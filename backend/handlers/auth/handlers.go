package auth

import (
	"encoding/json"
	"log"
	"net/http"

	"HuntMeBackend/middleware"
)

type profileResponse struct {
	ID string `json:"id"`
	// Username      string `json:"username"`
	// Email         string `json:"email"`
	// EmailVerified bool   `json:"email_verified"`
}

func authMeHandler(w http.ResponseWriter, r *http.Request) {
	id, ok := middleware.UserFromContext(r.Context())
	if !ok {
		w.Header().Set("WWW-Authenticate", "Bearer")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	response := profileResponse{
		ID: id.Subject,
		// Username:      cont.Username,
		// Email:         cont.Email,
		// EmailVerified: cont.EmailVerified,
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("/auth/me error: %v", err)
	}
}

func nullHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusCreated)
}
