package auth

import "net/http"

func NewMux() *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/register", nullHandler)
	mux.HandleFunc("/login", nullHandler)
	mux.HandleFunc("/refresh", nullHandler)
	mux.HandleFunc("/me", nullHandler)
	mux.HandleFunc("/logout", nullHandler)

	return mux
}
