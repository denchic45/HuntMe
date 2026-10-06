package candidate

import (
	"HuntMeBackend/handlers/candidate/invitations"
	"HuntMeBackend/handlers/candidate/profile"
	"HuntMeBackend/handlers/candidate/testingMux"
	"net/http"
)

func NewMux() *http.ServeMux {
	mux := http.NewServeMux()

	profileMux := profile.NewMux()
	testingMux := testingMux.NewMux()
	invitationsMux := invitations.NewMux()

	mux.Handle("/profile", http.StripPrefix("/profile", profileMux))
	mux.Handle("/testing", http.StripPrefix("/testing", testingMux))
	mux.Handle("/invitations", http.StripPrefix("/invitations", invitationsMux))

	mux.HandleFunc("/fsp", nullHandler)
	mux.HandleFunc("/privacy", nullHandler)

	return mux
}
