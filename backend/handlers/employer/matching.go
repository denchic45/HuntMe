package employer

import (
	"HuntMeBackend/middleware"
	"context"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"time"
)

const matchResultLimit = 20

const matchCandidatesSQL = `
SELECT
    c.id,
    'Кандидат'::text,
    c.city,
    c.specialization,
    c.verified_grade,
    c.category,
    c.experience_years::double precision,
    c.desired_salary::bigint,
    c.skills,
    c.has_fsp_verified,
    jsonb_array_length(c.fsp_achievements),
    c.test_score::double precision
FROM public.candidates AS c
WHERE c.is_public = TRUE
  AND c.testing_status = 'verified'
  AND c.verified_grade IS NOT NULL
  AND c.category IS NOT NULL
  AND BTRIM(c.category) <> ''
  AND LOWER(BTRIM(c.specialization)) = ANY($1::text[])
  AND CASE c.verified_grade
        WHEN 'Junior' THEN 1
        WHEN 'Middle' THEN 2
        WHEN 'Senior' THEN 3
        WHEN 'Lead' THEN 4
        ELSE 0
      END >= $2::integer
  AND ($3::numeric IS NULL OR c.desired_salary <= $3::numeric)
`

func (h *Handler) matchCandidatesHandler(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.UserFromContext(r.Context())
	if !ok {
		w.Header().Set("WWW-Authenticate", "Bearer")
		matchWriteError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Unauthorized")
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, 64<<10)
	defer r.Body.Close()
	decoder := json.NewDecoder(r.Body)
	var input MatchRequirementRequest
	if err := decoder.Decode(&input); err != nil {
		matchDecodeError(w, err)
		return
	}

	var extra json.RawMessage
	if err := decoder.Decode(&extra); err != io.EOF {
		if err != nil {
			matchDecodeError(w, err)
		} else {
			matchWriteError(w, http.StatusBadRequest, "BAD_REQUEST", "JSON object is required")
		}
		return
	}

	requirement, err := prepareMatchRequirement(input)
	if err != nil {
		matchWriteError(w, http.StatusBadRequest, "BAD_REQUEST", err.Error())
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	var hasEmployerProfile bool
	if err := h.db.QueryRow(ctx, `
SELECT EXISTS(SELECT 1 FROM public.employers WHERE id = $1)
`, claims.Subject).Scan(&hasEmployerProfile); err != nil {
		log.Printf("matchCandidatesHandler: check employer profile: %v", err)
		matchWriteError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Internal Server Error")
		return
	}
	if !hasEmployerProfile {
		matchWriteError(w, http.StatusForbidden, "FORBIDDEN", "Employer profile is required")
		return
	}

	rows, err := h.db.Query(
		ctx,
		matchCandidatesSQL,
		requirement.SpecializationAliases,
		requirement.GradeRank,
		requirement.Request.MaxSalaryBudget,
	)
	if err != nil {
		log.Printf("matchCandidatesHandler: query candidates: %v", err)
		matchWriteError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Internal Server Error")
		return
	}
	defer rows.Close()

	matches := make([]MatchResultItem, 0)
	for rows.Next() {
		var candidate CandidateSearchItem
		if err := rows.Scan(
			&candidate.CandidateID,
			&candidate.DisplayName,
			&candidate.City,
			&candidate.Specialization,
			&candidate.VerifiedGrade,
			&candidate.Category,
			&candidate.ExperienceYears,
			&candidate.DesiredSalary,
			&candidate.Skills,
			&candidate.HasFspVerified,
			&candidate.FspAchievementsCount,
			&candidate.TestScore,
		); err != nil {
			log.Printf("matchCandidatesHandler: scan candidate: %v", err)
			matchWriteError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Internal Server Error")
			return
		}

		if result, eligible := scoreMatchingCandidate(candidate, requirement); eligible {
			matches = append(matches, result)
		}
	}
	if err := rows.Err(); err != nil {
		log.Printf("matchCandidatesHandler: iterate candidates: %v", err)
		matchWriteError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Internal Server Error")
		return
	}

	response := MatchResponse{Matches: rankMatchingResults(matches, matchResultLimit)}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("matchCandidatesHandler: encode response: %v", err)
	}
}

func matchDecodeError(w http.ResponseWriter, err error) {
	var sizeError *http.MaxBytesError
	if errors.As(err, &sizeError) {
		matchWriteError(w, http.StatusRequestEntityTooLarge, "PAYLOAD_TOO_LARGE", "Too large")
		return
	}
	matchWriteError(w, http.StatusBadRequest, "BAD_REQUEST", "Incorrect JSON")
}

func matchWriteError(w http.ResponseWriter, status int, code, message string) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	body := struct {
		Error   string `json:"error"`
		Message string `json:"message"`
	}{Error: code, Message: message}
	if err := json.NewEncoder(w).Encode(body); err != nil {
		log.Printf("Encode error response: %v", err)
	}
}
