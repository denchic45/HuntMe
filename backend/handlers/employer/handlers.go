package employer

import (
	"HuntMeBackend/middleware"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"
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

type CandidateSearchItem struct {
	CandidateID          string   `json:"candidateId"`
	DisplayName          string   `json:"displayName"`
	City                 *string  `json:"city,omitempty"`
	Specialization       *string  `json:"specialization,omitempty"`
	VerifiedGrade        string   `json:"verifiedGrade"`
	Category             string   `json:"category"`
	ExperienceYears      *float64 `json:"experienceYears,omitempty"`
	DesiredSalary        *int64   `json:"desiredSalary,omitempty"`
	Skills               []string `json:"skills"`
	HasFspVerified       bool     `json:"hasFspVerified"`
	FspAchievementsCount int      `json:"fspAchievementsCount"`
	TestScore            *float64 `json:"testScore,omitempty"`
}

type CandidateSearchListResponse struct {
	Items []CandidateSearchItem `json:"items"`
	Total int64                 `json:"total"`
	Page  int                   `json:"page"`
	Limit int                   `json:"limit"`
}

type CandidateSearchFilter struct {
	Specialization *string
	Grade          *string
	Skills         []string
	HasFspVerified *bool
	SalaryMax      *int64
	Page           int
	Limit          int
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

func (h *Handler) searchCandidatesHandler(w http.ResponseWriter, r *http.Request) {
	writeError := func(status int, code, message string) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.WriteHeader(status)

		body := struct {
			Error   string `json:"error"`
			Message string `json:"message"`
		}{
			Error:   code,
			Message: message,
		}

		if err := json.NewEncoder(w).Encode(body); err != nil {
			log.Printf("searchCandidatesHandler: encode error response: %v", err)
		}
	}

	if _, ok := middleware.UserFromContext(r.Context()); !ok {
		w.Header().Set("WWW-Authenticate", "Bearer")
		writeError(http.StatusUnauthorized, "UNAUTHORIZED", "Unauthorized")
		return
	}

	query := r.URL.Query()

	filter := CandidateSearchFilter{
		Page:  1,
		Limit: 10,
	}

	if value := strings.TrimSpace(query.Get("specialization")); value != "" {
		filter.Specialization = &value
	}

	if value := strings.TrimSpace(query.Get("grade")); value != "" {
		switch value {
		case "Junior", "Middle", "Senior", "Lead":
			filter.Grade = &value
		default:
			writeError(
				http.StatusBadRequest,
				"BAD_REQUEST",
				"grade должен быть Junior, Middle, Senior или Lead",
			)
			return
		}
	}

	if value := strings.TrimSpace(query.Get("skills")); value != "" {
		for _, part := range strings.Split(value, ",") {
			skill := strings.TrimSpace(part)

			if skill == "" {
				writeError(
					http.StatusBadRequest,
					"BAD_REQUEST",
					"skills не должен содержать пустые элементы",
				)
				return
			}

			filter.Skills = append(filter.Skills, skill)
		}
	}

	if query.Has("hasFspVerified") {
		value := strings.TrimSpace(query.Get("hasFspVerified"))

		if value != "true" && value != "false" {
			writeError(
				http.StatusBadRequest,
				"BAD_REQUEST",
				"hasFspVerified должен быть true или false",
			)
			return
		}

		verified := value == "true"
		filter.HasFspVerified = &verified
	}

	if query.Has("salaryMax") {
		value, err := strconv.ParseInt(
			strings.TrimSpace(query.Get("salaryMax")),
			10,
			64,
		)
		if err != nil || value < 0 {
			writeError(
				http.StatusBadRequest,
				"BAD_REQUEST",
				"salaryMax должен быть неотрицательным целым числом",
			)
			return
		}

		filter.SalaryMax = &value
	}

	if query.Has("page") {
		value, err := strconv.Atoi(strings.TrimSpace(query.Get("page")))
		if err != nil || value < 1 {
			writeError(
				http.StatusBadRequest,
				"BAD_REQUEST",
				"page должен быть целым числом не меньше 1",
			)
			return
		}

		filter.Page = value
	}

	if query.Has("limit") {
		value, err := strconv.Atoi(strings.TrimSpace(query.Get("limit")))
		if err != nil || value < 1 || value > 100 {
			writeError(
				http.StatusBadRequest,
				"BAD_REQUEST",
				"limit должен быть целым числом от 1 до 100",
			)
			return
		}

		filter.Limit = value
	}

	const maxOffset int64 = 1<<63 - 1

	if int64(filter.Page-1) > maxOffset/int64(filter.Limit) {
		writeError(http.StatusBadRequest, "BAD_REQUEST", "Слишком большое значение page")
		return
	}

	offset := int64(filter.Page-1) * int64(filter.Limit)

	const candidateSearchWhere = `
WHERE c.is_public = TRUE
  AND c.testing_status = 'verified'
  AND c.verified_grade IS NOT NULL
  AND c.category IS NOT NULL
  AND ($1::text IS NULL OR c.specialization = $1::text)
  AND ($2::text IS NULL OR c.verified_grade = $2::text)
  AND ($3::text[] IS NULL OR c.skills @> $3::text[])
  AND ($4::boolean IS NULL OR c.has_fsp_verified = $4::boolean)
  AND ($5::numeric IS NULL OR c.desired_salary <= $5::numeric)
`

	const candidateSearchCountSQL = `
SELECT COUNT(*)
FROM public.candidates AS c
` + candidateSearchWhere

	const candidateSearchSQL = `
SELECT
    c.id,
    'Кандидат'::text AS display_name,
    c.city,
    c.specialization,
    c.verified_grade,
    c.category,
    c.experience_years::double precision,
    c.desired_salary::bigint,
    c.skills,
    c.has_fsp_verified,
    jsonb_array_length(c.fsp_achievements)
FROM public.candidates AS c
` + candidateSearchWhere + `
ORDER BY c.has_fsp_verified DESC, c.id ASC
LIMIT $6::integer
OFFSET $7::bigint
`

	filterArgs := []any{
		filter.Specialization,
		filter.Grade,
		filter.Skills,
		filter.HasFspVerified,
		filter.SalaryMax,
	}

	response := CandidateSearchListResponse{
		Items: make([]CandidateSearchItem, 0),
		Page:  filter.Page,
		Limit: filter.Limit,
	}

	ctx := r.Context()

	if err := h.db.QueryRow(
		ctx,
		candidateSearchCountSQL,
		filterArgs...,
	).Scan(&response.Total); err != nil {
		log.Printf("searchCandidatesHandler: count candidates: %v", err)
		writeError(http.StatusInternalServerError, "INTERNAL_ERROR", "Internal Server Error")
		return
	}

	queryArgs := append(filterArgs, filter.Limit, offset)

	rows, err := h.db.Query(ctx, candidateSearchSQL, queryArgs...)
	if err != nil {
		log.Printf("searchCandidatesHandler: query candidates: %v", err)
		writeError(http.StatusInternalServerError, "INTERNAL_ERROR", "Internal Server Error")
		return
	}
	defer rows.Close()

	for rows.Next() {
		var item CandidateSearchItem

		if err := rows.Scan(
			&item.CandidateID,
			&item.DisplayName,
			&item.City,
			&item.Specialization,
			&item.VerifiedGrade,
			&item.Category,
			&item.ExperienceYears,
			&item.DesiredSalary,
			&item.Skills,
			&item.HasFspVerified,
			&item.FspAchievementsCount,
		); err != nil {
			log.Printf("searchCandidatesHandler: scan candidate: %v", err)
			writeError(http.StatusInternalServerError, "INTERNAL_ERROR", "Internal Server Error")
			return
		}

		response.Items = append(response.Items, item)
	}

	if err := rows.Err(); err != nil {
		log.Printf("searchCandidatesHandler: iterate candidates: %v", err)
		writeError(http.StatusInternalServerError, "INTERNAL_ERROR", "Internal Server Error")
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")

	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("response: %v", err)
	}
}

func nullHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusAccepted)
}
