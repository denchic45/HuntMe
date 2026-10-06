package invitations

import "net/http"

func NewMux() *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/", nullHandler)
	mux.HandleFunc("/{id}/accept", nullHandler)
	mux.HandleFunc("/{id}/reject", nullHandler)

	return mux
}
