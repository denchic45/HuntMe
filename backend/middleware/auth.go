package middleware

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/MicahParks/keyfunc/v3"
	"github.com/golang-jwt/jwt/v5"
)

type AccessClaims struct {
	jwt.RegisteredClaims
	TokenType     string `json:"typ"`
	Email         string `json:"email"`
	EmailVerified bool   `json:"email_verified"`
	RealmAccess   struct {
		Roles []string `json:"roles"`
	} `json:"realm_access"`
}

type userContextKey struct{}

func UserFromContext(ctx context.Context) (*AccessClaims, bool) {
	claims, ok := ctx.Value(userContextKey{}).(*AccessClaims)
	return claims, ok && claims != nil
}

func RequireAuth(
	keys keyfunc.Keyfunc,
	issuer string,
	audience string,
) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			headers := r.Header.Values("Authorization")
			if len(headers) != 1 {
				unauthorized(w)
				return
			}

			parts := strings.Fields(headers[0])
			if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
				unauthorized(w)
				return
			}

			claims := &AccessClaims{}
			token, err := jwt.ParseWithClaims(
				parts[1],
				claims,
				keys.KeyfuncCtx(r.Context()),
				jwt.WithValidMethods([]string{"RS256"}),
				jwt.WithIssuer(issuer),
				jwt.WithAudience(audience),
				jwt.WithExpirationRequired(),
			)
			if err != nil || token == nil || !token.Valid ||
				claims.Subject == "" || claims.TokenType != "Bearer" {
				unauthorized(w)
				return
			}

			ctx := context.WithValue(r.Context(), userContextKey{}, claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func RequireRole(role string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			claims, ok := UserFromContext(r.Context())
			if !ok {
				unauthorized(w)
				return
			}
			for _, actual := range claims.RealmAccess.Roles {
				if actual == role {
					next.ServeHTTP(w, r)
					return
				}
			}
			w.Header().Set("Content-Type", "application/json; charset=utf-8")
			w.Header().Set("Cache-Control", "no-store")
			w.WriteHeader(403)
			if err := json.NewEncoder(w).Encode(map[string]string{"error": "FORBIDDEN", "message": "Required realm role: " + role}); err != nil {
				log.Printf("encode response: %v", err)
			}
		})
	}
}

func unauthorized(w http.ResponseWriter) {
	w.Header().Set("WWW-Authenticate", "Bearer")
	http.Error(w, "Unauthorized", http.StatusUnauthorized)
}
