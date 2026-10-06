package testingMux

import "net/http"

func NewMux() *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/survey", nullHandler)
	mux.HandleFunc("/start", nullHandler)
	mux.HandleFunc("/submit", nullHandler)

	return mux
}
