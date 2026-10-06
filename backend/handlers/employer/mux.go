package employer

import (
	"HuntMeBackend/handlers/employer/candidates"
	"net/http"
)

func NewMux() *http.ServeMux {
	mux := http.NewServeMux()
	candidatesMux := candidates.NewMux()

	mux.HandleFunc("/company", nullHandler)
	mux.Handle("/candidates", http.StripPrefix("/candidates", candidatesMux))
	mux.HandleFunc("/invitations", nullHandler)

	return mux
}
