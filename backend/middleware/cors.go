package middleware

import "net/http"

func CORS(allowedOrigin string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Add("Vary", "Origin")

			origin := r.Header.Get("Origin")
			if origin != "" && origin == allowedOrigin {
				w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)

				if r.Method == http.MethodOptions &&
					r.Header.Get("Access-Control-Request-Method") != "" {
					w.Header().Set(
						"Access-Control-Allow-Methods",
						"GET, HEAD, POST, PUT, PATCH, DELETE",
					)
					w.Header().Set(
						"Access-Control-Allow-Headers",
						"Authorization, Content-Type",
					)
					w.WriteHeader(http.StatusNoContent)
					return
				}
			}

			next.ServeHTTP(w, r)
		})
	}
}
