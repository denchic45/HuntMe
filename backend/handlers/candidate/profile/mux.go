package profile

import "net/http"

func NewMux() *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/", nullHandler)
	mux.HandleFunc("/resume", nullHandler)

	return mux
}
