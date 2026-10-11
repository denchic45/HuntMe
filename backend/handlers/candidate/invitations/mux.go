package invitations

import (
	"HuntMeBackend/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
	"net/http"
)

type Handler struct{ db *pgxpool.Pool }

func RegisterRoutes(mux *http.ServeMux, requireAuth func(http.Handler) http.Handler, pool *pgxpool.Pool) {
	h := &Handler{db: pool}
	for _, role := range []string{"candidate", "employer"} {
		mux.Handle("GET /api/v1/"+role+"/invitations", requireAuth(middleware.RequireRole(role)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { h.list(w, r, role) }))))
		mux.Handle("GET /api/v1/"+role+"/invitations/{id}", requireAuth(middleware.RequireRole(role)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { h.get(w, r, role) }))))
	}
	mux.Handle("POST /api/v1/employer/invitations", requireAuth(middleware.RequireRole("employer")(http.HandlerFunc(h.create))))
	mux.Handle("POST /api/v1/candidate/invitations/{id}/accept", requireAuth(middleware.RequireRole("candidate")(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { h.respond(w, r, "accepted") }))))
	mux.Handle("POST /api/v1/candidate/invitations/{id}/reject", requireAuth(middleware.RequireRole("candidate")(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { h.respond(w, r, "rejected") }))))
}
