package invitations

import (
	"HuntMeBackend/middleware"
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/jackc/pgx/v5"
)

type CreateRequest struct {
	CandidateID      string `json:"candidateId"`
	OfferDescription string `json:"offerDescription"`
	ContactMethod    string `json:"contactMethod"`
	SalaryMin        *int64 `json:"salaryMin"`
	SalaryMax        *int64 `json:"salaryMax"`
}
type Invitation struct {
	ID                string          `json:"id"`
	CandidateID       string          `json:"candidateId"`
	EmployerID        string          `json:"employerId"`
	EmployerCompany   string          `json:"employerCompany"`
	OfferDescription  string          `json:"offerDescription"`
	ContactMethod     string          `json:"contactMethod"`
	SalaryMin         int64           `json:"salaryMin"`
	SalaryMax         int64           `json:"salaryMax"`
	Currency          string          `json:"currency"`
	Status            string          `json:"status"`
	CreatedAt         time.Time       `json:"createdAt"`
	RespondedAt       *time.Time      `json:"respondedAt"`
	CandidateContacts json.RawMessage `json:"candidateContacts,omitempty"`
}

func (req *CreateRequest) valid() bool {
	req.CandidateID = strings.TrimSpace(req.CandidateID)
	req.OfferDescription = strings.TrimSpace(req.OfferDescription)
	req.ContactMethod = strings.TrimSpace(req.ContactMethod)
	return validText(req.CandidateID, 1, 255) && validText(req.OfferDescription, 1, 10000) && validText(req.ContactMethod, 1, 512) && req.SalaryMin != nil && req.SalaryMax != nil && *req.SalaryMin > 0 && *req.SalaryMax >= *req.SalaryMin && *req.SalaryMax <= 1000000000
}
func (i Invitation) same(req CreateRequest) bool {
	return i.CandidateID == req.CandidateID && i.OfferDescription == req.OfferDescription && i.ContactMethod == req.ContactMethod && i.SalaryMin == *req.SalaryMin && i.SalaryMax == *req.SalaryMax
}

const invitationSelect = `SELECT i.id::text,i.candidate_id,i.employer_id,i.employer_company,i.offer_description,i.contact_method,i.salary_min,i.salary_max,
 'RUB',i.status,i.created_at,i.responded_at,
 CASE WHEN i.status='accepted' AND i.employer_id=$1 AND $2::text='employer'
 THEN jsonb_build_object('fullName',c.full_name,'email',c.email,'phone',COALESCE(c.phone,'')) ELSE NULL END
 FROM public.invitations i JOIN public.candidates c ON c.id=i.candidate_id `
const ownInvitation = `(($2::text='candidate' AND i.candidate_id=$1) OR ($2::text='employer' AND i.employer_id=$1))`

func scanInvitation(row pgx.Row) (i Invitation, err error) {
	err = row.Scan(&i.ID, &i.CandidateID, &i.EmployerID, &i.EmployerCompany, &i.OfferDescription, &i.ContactMethod, &i.SalaryMin, &i.SalaryMax, &i.Currency, &i.Status, &i.CreatedAt, &i.RespondedAt, &i.CandidateContacts)
	return
}
func load(ctx context.Context, tx pgx.Tx, id, owner, role string) (Invitation, error) {
	return scanInvitation(tx.QueryRow(ctx, invitationSelect+`WHERE i.id=$3 AND `+ownInvitation, owner, role, id))
}

func (h *Handler) create(w http.ResponseWriter, r *http.Request) {
	var req CreateRequest
	if err := decodeRequest(w, r, &req); err != nil {
		status, code, message := http.StatusBadRequest, "BAD_REQUEST", "Invalid JSON: expected one object with known, unique fields"
		var sizeErr *http.MaxBytesError
		if errors.As(err, &sizeErr) {
			status, code, message = http.StatusRequestEntityTooLarge, "PAYLOAD_TOO_LARGE", "JSON exceeds 64 KiB"
		}
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(status)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": code, "message": message}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	if !req.valid() {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(400)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "BAD_REQUEST", "message": "candidateId, offerDescription, contactMethod and positive salaryMin..salaryMax (RUB) are required"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	key := strings.TrimSpace(r.Header.Get("Idempotency-Key"))
	if key != "" && !validText(key, 8, 128) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(400)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "BAD_REQUEST", "message": "Idempotency-Key must contain 8..128 characters"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	c, _ := middleware.UserFromContext(r.Context())
	ctx := r.Context()
	tx, err := h.db.Begin(ctx)
	if err != nil {
		log.Printf("database operation: %v", err)
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(http.StatusInternalServerError)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "INTERNAL_ERROR", "message": "Database operation failed"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	defer tx.Rollback(ctx)
	var company string
	err = tx.QueryRow(ctx, `SELECT company_name FROM public.employers WHERE id=$1 FOR UPDATE`, c.Subject).Scan(&company)
	if errors.Is(err, pgx.ErrNoRows) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(403)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "PROFILE_REQUIRED", "message": "Employer profile is required"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	if err != nil {
		log.Printf("database operation: %v", err)
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(http.StatusInternalServerError)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "INTERNAL_ERROR", "message": "Database operation failed"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	var existingID string
	if key != "" {
		err = tx.QueryRow(ctx, `SELECT id::text FROM public.invitations WHERE employer_id=$1 AND idempotency_key=$2`, c.Subject, key).Scan(&existingID)
		if err == nil {
			existing, e := load(ctx, tx, existingID, c.Subject, "employer")
			if e != nil {
				log.Printf("database operation: %v", e)
				w.Header().Set("Content-Type", "application/json; charset=utf-8")
				w.Header().Set("Cache-Control", "no-store")
				w.WriteHeader(http.StatusInternalServerError)
				if err := json.NewEncoder(w).Encode(map[string]string{"error": "INTERNAL_ERROR", "message": "Database operation failed"}); err != nil {
					log.Printf("encode response: %v", err)
				}
				return
			}
			if !existing.same(req) {
				w.Header().Set("Content-Type", "application/json; charset=utf-8")
				w.Header().Set("Cache-Control", "no-store")
				w.WriteHeader(409)
				if err := json.NewEncoder(w).Encode(map[string]string{"error": "IDEMPOTENCY_CONFLICT", "message": "Key was already used with another payload"}); err != nil {
					log.Printf("encode response: %v", err)
				}
				return
			}
			w.Header().Set("Content-Type", "application/json; charset=utf-8")
			w.Header().Set("Cache-Control", "no-store")
			w.WriteHeader(200)
			if err := json.NewEncoder(w).Encode(existing); err != nil {
				log.Printf("encode response: %v", err)
			}
			return
		}
		if !errors.Is(err, pgx.ErrNoRows) {
			log.Printf("database operation: %v", err)
			w.Header().Set("Content-Type", "application/json; charset=utf-8")
			w.Header().Set("Cache-Control", "no-store")
			w.WriteHeader(http.StatusInternalServerError)
			if err := json.NewEncoder(w).Encode(map[string]string{"error": "INTERNAL_ERROR", "message": "Database operation failed"}); err != nil {
				log.Printf("encode response: %v", err)
			}
			return
		}
	}
	var eligible bool
	err = tx.QueryRow(ctx, `SELECT COALESCE(is_public AND testing_status='verified' AND NULLIF(verified_grade,'') IS NOT NULL AND NULLIF(category,'') IS NOT NULL AND NULLIF(verified_specialization,'') IS NOT NULL, FALSE) FROM public.candidates WHERE id=$1 FOR SHARE`, req.CandidateID).Scan(&eligible)
	if errors.Is(err, pgx.ErrNoRows) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(404)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "CANDIDATE_UNAVAILABLE", "message": "Public verified candidate not found"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	if err != nil {
		log.Printf("database operation: %v", err)
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(http.StatusInternalServerError)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "INTERNAL_ERROR", "message": "Database operation failed"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	if !eligible {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(404)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "CANDIDATE_UNAVAILABLE", "message": "Public verified candidate not found"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	err = tx.QueryRow(ctx, `SELECT id::text FROM public.invitations WHERE employer_id=$1 AND candidate_id=$2 AND status='sent'`, c.Subject, req.CandidateID).Scan(&existingID)
	if err == nil {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(409)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "PENDING_INVITATION", "message": "A pending invitation already exists; retry with its original Idempotency-Key"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	if !errors.Is(err, pgx.ErrNoRows) {
		log.Printf("database operation: %v", err)
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(http.StatusInternalServerError)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "INTERNAL_ERROR", "message": "Database operation failed"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	var id string
	var storedKey *string
	if key != "" {
		storedKey = &key
	}
	err = tx.QueryRow(ctx, `INSERT INTO public.invitations(employer_id,candidate_id,employer_company,offer_description,contact_method,salary_min,salary_max,idempotency_key) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id::text`, c.Subject, req.CandidateID, company, req.OfferDescription, req.ContactMethod, *req.SalaryMin, *req.SalaryMax, storedKey).Scan(&id)
	if err != nil {
		log.Printf("database operation: %v", err)
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(http.StatusInternalServerError)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "INTERNAL_ERROR", "message": "Database operation failed"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	i, err := load(ctx, tx, id, c.Subject, "employer")
	if err != nil {
		log.Printf("database operation: %v", err)
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(http.StatusInternalServerError)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "INTERNAL_ERROR", "message": "Database operation failed"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	if err = tx.Commit(ctx); err != nil {
		log.Printf("database operation: %v", err)
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(http.StatusInternalServerError)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "INTERNAL_ERROR", "message": "Database operation failed"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	w.Header().Set("Location", "/api/v1/employer/invitations/"+id)
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(201)
	if err := json.NewEncoder(w).Encode(i); err != nil {
		log.Printf("encode response: %v", err)
	}
}
func (h *Handler) list(w http.ResponseWriter, r *http.Request, role string) {
	page, limit := 1, 20
	for _, param := range []struct {
		name   string
		target *int
		max    int
	}{{"page", &page, 1000000}, {"limit", &limit, 100}} {
		if r.URL.Query().Has(param.name) {
			value, err := strconv.Atoi(r.URL.Query().Get(param.name))
			if err != nil || value < 1 || value > param.max {
				w.Header().Set("Content-Type", "application/json; charset=utf-8")
				w.Header().Set("Cache-Control", "no-store")
				w.WriteHeader(http.StatusBadRequest)
				if err := json.NewEncoder(w).Encode(map[string]string{"error": "BAD_REQUEST", "message": "Invalid pagination"}); err != nil {
					log.Printf("encode response: %v", err)
				}
				return
			}
			*param.target = value
		}
	}
	c, _ := middleware.UserFromContext(r.Context())
	response := struct {
		Items []Invitation `json:"items"`
		Total int64        `json:"total"`
		Page  int          `json:"page"`
		Limit int          `json:"limit"`
	}{Items: []Invitation{}, Page: page, Limit: limit}
	if err := h.db.QueryRow(r.Context(), `SELECT count(*) FROM public.invitations i WHERE `+ownInvitation, c.Subject, role).Scan(&response.Total); err != nil {
		log.Printf("database operation: %v", err)
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(http.StatusInternalServerError)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "INTERNAL_ERROR", "message": "Database operation failed"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	rows, err := h.db.Query(r.Context(), invitationSelect+`WHERE `+ownInvitation+` ORDER BY i.created_at DESC,i.id DESC LIMIT $3 OFFSET $4`, c.Subject, role, limit, (page-1)*limit)
	if err != nil {
		log.Printf("database operation: %v", err)
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(http.StatusInternalServerError)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "INTERNAL_ERROR", "message": "Database operation failed"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	defer rows.Close()
	for rows.Next() {
		i, err := scanInvitation(rows)
		if err != nil {
			log.Printf("database operation: %v", err)
			w.Header().Set("Content-Type", "application/json; charset=utf-8")
			w.Header().Set("Cache-Control", "no-store")
			w.WriteHeader(http.StatusInternalServerError)
			if err := json.NewEncoder(w).Encode(map[string]string{"error": "INTERNAL_ERROR", "message": "Database operation failed"}); err != nil {
				log.Printf("encode response: %v", err)
			}
			return
		}
		response.Items = append(response.Items, i)
	}
	if err = rows.Err(); err != nil {
		log.Printf("database operation: %v", err)
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(http.StatusInternalServerError)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "INTERNAL_ERROR", "message": "Database operation failed"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(200)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("encode response: %v", err)
	}
}
func (h *Handler) get(w http.ResponseWriter, r *http.Request, role string) {
	id := r.PathValue("id")
	if !uuidPattern.MatchString(id) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(400)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "BAD_REQUEST", "message": "Invalid invitation ID"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	c, _ := middleware.UserFromContext(r.Context())
	i, err := scanInvitation(h.db.QueryRow(r.Context(), invitationSelect+`WHERE i.id=$3 AND `+ownInvitation, c.Subject, role, id))
	if errors.Is(err, pgx.ErrNoRows) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(404)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "INVITATION_NOT_FOUND", "message": "Invitation not found"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	if err != nil {
		log.Printf("database operation: %v", err)
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(http.StatusInternalServerError)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "INTERNAL_ERROR", "message": "Database operation failed"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(200)
	if err := json.NewEncoder(w).Encode(i); err != nil {
		log.Printf("encode response: %v", err)
	}
}
func (h *Handler) respond(w http.ResponseWriter, r *http.Request, target string) {
	id := r.PathValue("id")
	if !uuidPattern.MatchString(id) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(400)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "BAD_REQUEST", "message": "Invalid invitation ID"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	if r.ContentLength != 0 {
		var empty struct{}
		if err := decodeRequest(w, r, &empty); err != nil {
			status, code, message := http.StatusBadRequest, "BAD_REQUEST", "Invalid JSON: expected one object with known, unique fields"
			var sizeErr *http.MaxBytesError
			if errors.As(err, &sizeErr) {
				status, code, message = http.StatusRequestEntityTooLarge, "PAYLOAD_TOO_LARGE", "JSON exceeds 64 KiB"
			}
			w.Header().Set("Content-Type", "application/json; charset=utf-8")
			w.Header().Set("Cache-Control", "no-store")
			w.WriteHeader(status)
			if err := json.NewEncoder(w).Encode(map[string]string{"error": code, "message": message}); err != nil {
				log.Printf("encode response: %v", err)
			}
			return
		}
	}
	c, _ := middleware.UserFromContext(r.Context())
	ctx := r.Context()
	tx, err := h.db.Begin(ctx)
	if err != nil {
		log.Printf("database operation: %v", err)
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(http.StatusInternalServerError)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "INTERNAL_ERROR", "message": "Database operation failed"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	defer tx.Rollback(ctx)
	var status string
	err = tx.QueryRow(ctx, `SELECT status FROM public.invitations WHERE id=$1 AND candidate_id=$2 FOR UPDATE`, id, c.Subject).Scan(&status)
	if errors.Is(err, pgx.ErrNoRows) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(404)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "INVITATION_NOT_FOUND", "message": "Invitation not found"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	if err != nil {
		log.Printf("database operation: %v", err)
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(http.StatusInternalServerError)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "INTERNAL_ERROR", "message": "Database operation failed"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	if status != target && status != "sent" {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(409)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "INVALID_TRANSITION", "message": "Invitation already has a different final status"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	if status == "sent" {
		_, err = tx.Exec(ctx, `UPDATE public.invitations SET status=$2,responded_at=clock_timestamp() WHERE id=$1`, id, target)
		if err != nil {
			log.Printf("database operation: %v", err)
			w.Header().Set("Content-Type", "application/json; charset=utf-8")
			w.Header().Set("Cache-Control", "no-store")
			w.WriteHeader(http.StatusInternalServerError)
			if err := json.NewEncoder(w).Encode(map[string]string{"error": "INTERNAL_ERROR", "message": "Database operation failed"}); err != nil {
				log.Printf("encode response: %v", err)
			}
			return
		}
	}
	i, err := load(ctx, tx, id, c.Subject, "candidate")
	if err != nil {
		log.Printf("database operation: %v", err)
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(http.StatusInternalServerError)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "INTERNAL_ERROR", "message": "Database operation failed"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	if err = tx.Commit(ctx); err != nil {
		log.Printf("database operation: %v", err)
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(http.StatusInternalServerError)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": "INTERNAL_ERROR", "message": "Database operation failed"}); err != nil {
			log.Printf("encode response: %v", err)
		}
		return
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(200)
	if err := json.NewEncoder(w).Encode(i); err != nil {
		log.Printf("encode response: %v", err)
	}
}

func decodeRequest(w http.ResponseWriter, r *http.Request, dst any) error {
	r.Body = http.MaxBytesReader(w, r.Body, 64<<10)
	defer r.Body.Close()
	data, err := io.ReadAll(r.Body)
	if err != nil {
		return err
	}
	data = bytes.TrimSpace(data)
	if len(data) == 0 || data[0] != '{' || !uniqueJSONKeys(data) {
		return errors.New("one JSON object with unique keys is required")
	}
	decoder := json.NewDecoder(bytes.NewReader(data))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(dst); err != nil {
		return err
	}
	if err := decoder.Decode(new(any)); err != io.EOF {
		return errors.New("trailing JSON is not allowed")
	}
	return nil
}
func uniqueJSONKeys(data []byte) bool {
	d := json.NewDecoder(bytes.NewReader(data))
	var value func() bool
	value = func() bool {
		t, err := d.Token()
		if err != nil {
			return false
		}
		delim, ok := t.(json.Delim)
		if !ok {
			return true
		}
		switch delim {
		case '{':
			keys := make(map[string]bool)
			for d.More() {
				k, err := d.Token()
				if err != nil {
					return false
				}
				s, ok := k.(string)
				if !ok || keys[s] {
					return false
				}
				keys[s] = true
				if !value() {
					return false
				}
			}
		case '[':
			for d.More() {
				if !value() {
					return false
				}
			}
		default:
			return false
		}
		_, err = d.Token()
		return err == nil
	}
	if !value() {
		return false
	}
	_, err := d.Token()
	return err == io.EOF
}

func validText(s string, min, max int) bool {
	n := utf8.RuneCountInString(strings.TrimSpace(s))
	return n >= min && n <= max && !strings.ContainsRune(s, '\x00')
}

var uuidPattern = regexp.MustCompile(`^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$`)
