package candidate

import (
	"HuntMeBackend/middleware"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strings"

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

type EditProfileRequest struct {
	FullName        *string   `json:"fullName"`
	Email           *string   `json:"email"`
	Phone           *string   `json:"phone"`
	City            *string   `json:"city"`
	Specialization  *string   `json:"specialization"`
	ClaimedGrade    *string   `json:"claimedGrade"`
	ExperienceYears *float32  `json:"experienceYears"`
	DesiredSalary   *int64    `json:"desiredSalary"`
	Skills          *[]string `json:"skills"`
	SoftSkills      *[]string `json:"softSkills"`
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

func (h *Handler) editProfileHandler(w http.ResponseWriter, r *http.Request) {
	cont, ok := middleware.UserFromContext(r.Context())
	if !ok {
		w.Header().Set("WWW-Authenticate", "Bearer")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req EditProfileRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.FullName != nil && strings.TrimSpace(*req.FullName) == "" {
		http.Error(w, "Empty full name", http.StatusBadRequest)
		return
	}

	tag, err := h.db.Exec(r.Context(), `
    UPDATE public.candidates
    SET
        full_name = COALESCE($2::text, full_name),
        email = COALESCE($3::text, email),
        phone = COALESCE($4::text, phone),
        city = COALESCE($5::text, city),
        specialization = COALESCE($6::text, specialization),
        claimed_grade = COALESCE($7::text, claimed_grade),
        experience_years = COALESCE($8::numeric, experience_years),
        desired_salary = COALESCE($9::numeric, desired_salary),
        skills = COALESCE($10::text[], skills),
        soft_skills = COALESCE($11::text[], soft_skills)
    WHERE id = $1
`,
		cont.Subject,
		req.FullName,
		req.Email,
		req.Phone,
		req.City,
		req.Specialization,
		req.ClaimedGrade,
		req.ExperienceYears,
		req.DesiredSalary,
		req.Skills,
		req.SoftSkills,
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
