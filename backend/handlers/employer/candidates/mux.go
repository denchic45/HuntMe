package candidates

import (
	"net/http"
)

func NewMux() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("/", nullHandler)
	mux.HandleFunc("/{id}", nullHandler)
	mux.HandleFunc("/match", nullHandler)

	return mux
}
