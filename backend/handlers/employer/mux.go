package employer

import (
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Handler struct {
	db *pgxpool.Pool
}

func RegisterRoutes(
	mux *http.ServeMux,
	requireAuth func(http.Handler) http.Handler,
	pool *pgxpool.Pool) {
	h := &Handler{db: pool}

	mux.Handle(
		"GET /api/v1/employer/profile",
		requireAuth(http.HandlerFunc(h.getProfileHandler)),
	)
	mux.Handle(
		"POST /api/v1/employer/profile",
		requireAuth(http.HandlerFunc(h.createProfileHandler)),
	)
	mux.Handle(
		"PATCH /api/v1/employer/profile",
		requireAuth(http.HandlerFunc(h.editProfileHandler)),
	)
	mux.Handle(
		"PATCH /api/v1/employer/candidates/",
		requireAuth(http.HandlerFunc(h.searchCandidatesHandler)),
	)
	mux.Handle(
		"POST /api/v1/employer/candidates/match",
		requireAuth(http.HandlerFunc(h.matchCandidatesHandler)),
	)
}
