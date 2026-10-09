package candidate

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
		"POST /api/v1/candidate/profile",
		requireAuth(http.HandlerFunc(h.createProfileHandler)),
	)

	mux.Handle(
		"GET /api/v1/candidate/profile",
		requireAuth(http.HandlerFunc(h.getProfileHandler)),
	)

	mux.Handle(
		"PATCH /api/v1/candidate/profile",
		requireAuth(http.HandlerFunc(h.editProfileHandler)),
	)

	mux.Handle(
		"POST /api/v1/candidate/fsp",
		requireAuth(http.HandlerFunc(nullHandler)),
	)

	mux.Handle(
		"PATCH /api/v1/candidate/privacy",
		requireAuth(http.HandlerFunc(h.editPrivacy)),
	)
}
