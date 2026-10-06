package candidate

import "net/http"

func nullHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusAccepted)
}
