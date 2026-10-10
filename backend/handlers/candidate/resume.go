package candidate

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os/exec"
	"strings"
	"time"
)

const (
	maxResumeFileSize       int64 = 10 << 20
	maxResumeRequestSize          = maxResumeFileSize + (1 << 20)
	resumeMultipartMemory         = 1 << 20
	maxResumeTextSize             = 2 << 20
	resumeExtractionTimeout       = 10 * time.Second
)

var (
	errResumeInvalidPDF   = errors.New("cannot extract text from PDF")
	errResumeEmptyText    = errors.New("PDF contains no extractable text")
	errResumeTextTooLarge = errors.New("extracted text exceeds the limit")
	errResumeTimeout      = errors.New("PDF extraction timed out")
)

func (h *Handler) resumeHandler(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, maxResumeRequestSize)
	defer r.Body.Close()

	err := r.ParseMultipartForm(resumeMultipartMemory)
	if r.MultipartForm != nil {
		defer r.MultipartForm.RemoveAll()
	}
	if err != nil {
		var sizeErr *http.MaxBytesError
		if errors.As(err, &sizeErr) {
			writeResumeError(w, http.StatusRequestEntityTooLarge, "Request is too large")
			return
		}

		writeResumeError(w, http.StatusBadRequest, "Invalid multipart/form-data")
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		if errors.Is(err, http.ErrMissingFile) {
			writeResumeError(w, http.StatusBadRequest, "PDF field 'file' is required")
		} else {
			log.Printf("resumeHandler: open upload: %v", err)
			writeResumeError(w, http.StatusInternalServerError, "Cannot open uploaded file")
		}
		return
	}
	defer file.Close()

	if len(r.MultipartForm.File["file"]) != 1 {
		writeResumeError(w, http.StatusBadRequest, "Upload exactly one PDF in field 'file'")
		return
	}
	if header.Size == 0 {
		writeResumeError(w, http.StatusBadRequest, "PDF is empty")
		return
	}
	if header.Size > maxResumeFileSize {
		writeResumeError(w, http.StatusRequestEntityTooLarge, "PDF must not exceed 10 MiB")
		return
	}

	var prefix [512]byte
	n, err := io.ReadFull(file, prefix[:])
	if err != nil && !errors.Is(err, io.EOF) && !errors.Is(err, io.ErrUnexpectedEOF) {
		log.Printf("resumeHandler: read upload: %v", err)
		writeResumeError(w, http.StatusInternalServerError, "Cannot read uploaded file")
		return
	}
	if http.DetectContentType(prefix[:n]) != "application/pdf" {
		writeResumeError(w, http.StatusBadRequest, "Expected a PDF file")
		return
	}

	if _, err := file.Seek(0, io.SeekStart); err != nil {
		log.Printf("resumeHandler: rewind upload: %v", err)
		writeResumeError(w, http.StatusInternalServerError, "Cannot read uploaded file")
		return
	}

	text, err := extractResumeText(r.Context(), file)
	if err != nil {
		if r.Context().Err() != nil {
			return
		}

		switch {
		case errors.Is(err, errResumeInvalidPDF):
			writeResumeError(w, http.StatusBadRequest, "Cannot read PDF; it may be damaged or password-protected")
		case errors.Is(err, errResumeEmptyText):
			writeResumeError(w, http.StatusUnprocessableEntity, "No text found in PDF; a scanned document requires OCR")
		case errors.Is(err, errResumeTextTooLarge):
			writeResumeError(w, http.StatusRequestEntityTooLarge, "Extracted text must not exceed 2 MiB")
		case errors.Is(err, errResumeTimeout):
			writeResumeError(w, http.StatusServiceUnavailable, "PDF processing exceeded the time limit")
		default:
			log.Printf("resumeHandler: %v", err)
			writeResumeError(w, http.StatusInternalServerError, "PDF processing failed")
		}
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	response := struct {
		Text string `json:"text"`
	}{Text: text}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("resumeHandler: write response: %v", err)
	}
}

func extractResumeText(parent context.Context, file io.Reader) (string, error) {
	ctx, cancel := context.WithTimeout(parent, resumeExtractionTimeout)
	defer cancel()

	output := &resumeTextBuffer{
		limit:  maxResumeTextSize,
		cancel: cancel,
	}

	cmd := exec.CommandContext(ctx, "pdftotext", "-enc", "UTF-8", "-nopgbrk", "-", "-")
	cmd.Stdin = file
	cmd.Stdout = output
	cmd.Stderr = io.Discard
	cmd.WaitDelay = time.Second

	err := cmd.Run()
	if parent.Err() != nil {
		return "", parent.Err()
	}
	if output.tooLarge {
		return "", errResumeTextTooLarge
	}
	if errors.Is(ctx.Err(), context.DeadlineExceeded) {
		return "", errResumeTimeout
	}
	if err != nil {
		var exitErr *exec.ExitError
		if errors.As(err, &exitErr) {
			switch exitErr.ExitCode() {
			case 1, 3, 99:
				return "", errResumeInvalidPDF
			}
		}

		return "", fmt.Errorf("pdftotext: %w", err)
	}

	text := strings.TrimSpace(output.buffer.String())
	if text == "" {
		return "", errResumeEmptyText
	}
	return text, nil
}

type resumeTextBuffer struct {
	buffer   bytes.Buffer
	limit    int
	cancel   context.CancelFunc
	tooLarge bool
}

func (b *resumeTextBuffer) Write(p []byte) (int, error) {
	if len(p) > b.limit-b.buffer.Len() {
		b.tooLarge = true
		b.cancel()
		return 0, errResumeTextTooLarge
	}
	return b.buffer.Write(p)
}

func writeResumeError(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)

	response := struct {
		Error string `json:"error"`
	}{Error: message}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("error response: %v", err)
	}
}
