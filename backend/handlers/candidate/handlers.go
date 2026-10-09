package candidate

import (
	"HuntMeBackend/middleware"
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"github.com/jackc/pgx/v5"
)

type GetProfileResponse struct {
	ID              string   `json:"id"`
	FullName        string   `json:"fullName"`
	Email           string   `json:"email"`
	Phone           string   `json:"phone"`
	City            string   `json:"city"`
	Specialization  string   `json:"specialization"`
	ClaimedGrade    string   `json:"claimedGrade"`
	VerifiedGrade   string   `json:"verifiedGrade"`
	Category        string   `json:"category"`
	ExperienceYears float32  `json:"experienceYears"`
	DesiredSalary   int64    `json:"desiredSalary"`
	Skills          []string `json:"skills"`
	SoftSkills      []string `json:"softSkills"`
}

type CreateProfileRequest struct {
	FullName string `json:"fullName"`
	Email    string `json:"email"`
}

func (h *Handler) createProfileHandler(w http.ResponseWriter, r *http.Request) {
	cont, ok := middleware.UserFromContext(r.Context())
	if !ok {
		w.Header().Set("WWW-Authenticate", "Bearer")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req CreateProfileRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.FullName == "" || req.Email == "" {
		http.Error(w, "Full name and email are required", http.StatusBadRequest)
		return
	}

	_, err := h.db.Exec(r.Context(), `
        INSERT INTO public.candidates (id, full_name, email)
        VALUES ($1, $2, $3)
    `, cont.Subject, req.FullName, req.Email)

	if err != nil {
		log.Printf("DB error: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusCreated)

	json.NewEncoder(w).Encode(CreateProfileRequest{
		FullName: req.FullName,
		Email:    req.Email})
}

func (h *Handler) getProfileHandler(w http.ResponseWriter, r *http.Request) {
	cont, ok := middleware.UserFromContext(r.Context())
	if !ok {
		w.Header().Set("WWW-Authenticate", "Bearer")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	ctx := r.Context()

	var profile GetProfileResponse

	err := h.db.QueryRow(ctx, `
    SELECT
        id,
        full_name,
        email,
        COALESCE(phone, ''),
        COALESCE(city, ''),
        COALESCE(specialization, ''),
        COALESCE(claimed_grade, ''),
        COALESCE(verified_grade, ''),
        COALESCE(category, ''),
        COALESCE(experience_years, 0)::REAL,
        COALESCE(desired_salary, 0)::BIGINT,
        skills,
        soft_skills
    	FROM public.candidates
    	WHERE id = $1
	`, cont.Subject).Scan(
		&profile.ID,
		&profile.FullName,
		&profile.Email,
		&profile.Phone,
		&profile.City,
		&profile.Specialization,
		&profile.ClaimedGrade,
		&profile.VerifiedGrade,
		&profile.Category,
		&profile.ExperienceYears,
		&profile.DesiredSalary,
		&profile.Skills,
		&profile.SoftSkills,
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
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(profile); err != nil {
		log.Printf("/candidate/profile error: %v", err)
	}
}

func nullHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusAccepted)
}
