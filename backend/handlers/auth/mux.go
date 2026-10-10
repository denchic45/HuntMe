package auth

import "net/http"

func RegisterRoutes(
	mux *http.ServeMux,
	requireAuth func(http.Handler) http.Handler,
) {
	mux.Handle(
		"GET /api/v1/auth/me",
		requireAuth(http.HandlerFunc(authMeHandler)),
	)
}
