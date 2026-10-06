package main

import (
	"HuntMeBackend/handlers/auth"
	"fmt"
	"log"
	"net/http"
)

func main() {
	mux := http.NewServeMux()

	auth := auth.NewMux()

	mux.Handle("/api/v1/auth", http.StripPrefix("/api/v1/auth", auth))

	server := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	log.Println("Huntbackend is up")

	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "OK")
}

// func nullHandler(w http.ResponseWriter, r *http.Request) {
// 	w.WriteHeader(http.StatusAccepted)
// }
