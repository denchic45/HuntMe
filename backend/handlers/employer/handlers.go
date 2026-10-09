package employer

import (
	"HuntMeBackend/middleware"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

type GetEmployerProfileResponse struct {
	ID            string `json:"id"`
	CompanyName   string `json:"companyName"`
	Industry      string `json:"industry"`
	Description   string `json:"description"`
	Website       string `json:"website"`
	ContactPerson string `json:"contactPerson"`
}

type CreateEmployerProfileRequest struct {
	CompanyName string `json:"companyName"`
}

type EditEmployerProfileRequest struct {
	CompanyName   *string `json:"companyName"`
	Industry      *string `json:"industry"`
	Description   *string `json:"description"`
	Website       *string `json:"website"`
	ContactPerson *string `json:"contactPerson"`
}

func (h *Handler) createProfileHandler(w http.ResponseWriter, r *http.Request) {
	cont, ok := middleware.UserFromContext(r.Context())
	if !ok {
		w.Header().Set("WWW-Authenticate", "Bearer")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req CreateEmployerProfileRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	req.CompanyName = strings.TrimSpace(req.CompanyName)

	if req.CompanyName == "" {
		http.Error(w, "Company name is required", http.StatusBadRequest)
		return
	}

	_, err := h.db.Exec(r.Context(), `
        INSERT INTO public.employers (id, company_name)
        VALUES ($1, $2)
    `, cont.Subject, req.CompanyName)

	var pgErr *pgconn.PgError

	if errors.As(err, &pgErr) && pgErr.Code == "23505" {
		http.Error(w, "Profile already exists", http.StatusConflict)
		return
	}

	if err != nil {
		log.Printf("DB error: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusCreated)

	json.NewEncoder(w).Encode(CreateEmployerProfileRequest{
		CompanyName: req.CompanyName})
}

func (h *Handler) getProfileHandler(w http.ResponseWriter, r *http.Request) {
	cont, ok := middleware.UserFromContext(r.Context())
	if !ok {
		w.Header().Set("WWW-Authenticate", "Bearer")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	ctx := r.Context()

	var profile GetEmployerProfileResponse

	err := h.db.QueryRow(ctx, `
    SELECT
        id,
        company_name,
        COALESCE(industry, ''),
        COALESCE(description, ''),
        COALESCE(website, ''),
        COALESCE(contact_person, '')
    FROM public.employers
    WHERE id = $1
`, cont.Subject).Scan(
		&profile.ID,
		&profile.CompanyName,
		&profile.Industry,
		&profile.Description,
		&profile.Website,
		&profile.ContactPerson,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			http.Error(w, "Profile not found", http.StatusNotFound)
			return
		}

		log.Printf("DB error: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")

	if err := json.NewEncoder(w).Encode(profile); err != nil {
		log.Printf("/employer/profile error: %v", err)
	}
}

func (h *Handler) editProfileHandler(w http.ResponseWriter, r *http.Request) {
	cont, ok := middleware.UserFromContext(r.Context())
	if !ok {
		w.Header().Set("WWW-Authenticate", "Bearer")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req EditEmployerProfileRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.CompanyName != nil {
		*req.CompanyName = strings.TrimSpace(*req.CompanyName)

		if *req.CompanyName == "" {
			http.Error(w, "Empty company name", http.StatusBadRequest)
			return
		}
	}

	tag, err := h.db.Exec(r.Context(), `
    UPDATE public.employers
    SET
        company_name = COALESCE($2::text, company_name),
        industry = COALESCE($3::text, industry),
        description = COALESCE($4::text, description),
        website = COALESCE($5::text, website),
        contact_person = COALESCE($6::text, contact_person)
    WHERE id = $1
`,
		cont.Subject,
		req.CompanyName,
		req.Industry,
		req.Description,
		req.Website,
		req.ContactPerson,
	)

	if err != nil {
		log.Printf("DB error: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	if tag.RowsAffected() == 0 {
		http.Error(w, "Profile not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func nullHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusAccepted)
}
