package main

import (
	"HuntMeBackend/handlers/auth"
	"HuntMeBackend/middleware"
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/MicahParks/keyfunc/v3"
)

func main() {
	const issuer = "http://localhost:8080/realms/huntme"
	const jwksURL = "http://keycloak:8080/realms/huntme/protocol/openid-connect/certs"

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	jwks, err := keyfunc.NewDefaultCtx(ctx, []string{jwksURL})
	if err != nil {
		log.Fatalf("error happened during keycloak public keys initialization: %v", err)
	}

	requireAuth := middleware.RequireAuth(jwks, issuer, "huntme-api")

	mux := http.NewServeMux()

	auth.RegisterRoutes(mux, requireAuth)

	server := &http.Server{
		Addr:              ":8081",
		Handler:           mux,
		ReadHeaderTimeout: 10 * time.Second,
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
