package main

import (
	"HuntMeBackend/handlers/auth"
	"HuntMeBackend/handlers/candidate"
	"HuntMeBackend/middleware"
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/MicahParks/keyfunc/v3"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	const issuer = "http://localhost:8080/realms/huntme"
	const jwksURL = "http://keycloak:8080/realms/huntme/protocol/openid-connect/certs"

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer cancel()

	dbPool, err := pgxpool.New(ctx, os.Getenv("CONNECTION_STRING_DB"))
	if err != nil {
		log.Printf("failed to connect to PostgreSQL: %v", err)
	}

	if dbPool.Ping(ctx) != nil {
		log.Fatalf("no connection, reconnection")
	}

	jwks, err := keyfunc.NewDefaultCtx(ctx, []string{jwksURL})
	if err != nil {
		log.Fatalf("error happened during keycloak public keys initialization: %v", err)
	}

	requireAuth := middleware.RequireAuth(jwks, issuer, "huntme-api")

	mux := http.NewServeMux()

	frontendOrigin := os.Getenv("CORS_ALLOWED_ORIGIN")

	handler := middleware.CORS(frontendOrigin)(mux)

	auth.RegisterRoutes(mux, requireAuth)
	candidate.RegisterRoutes(mux, requireAuth, dbPool)

	server := &http.Server{
		Addr:              ":8081",
		Handler:           handler,
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
