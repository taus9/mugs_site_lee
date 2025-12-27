package main

import "net/http"

func (app *application) routes() *http.ServeMux {
	mux := http.NewServeMux()

	fileServer := http.FileServer(http.Dir("./ui/static/"))
	mux.Handle("/static/", http.StripPrefix("/static", fileServer))

	// sever-side render
	mux.HandleFunc("/", app.home)
	mux.HandleFunc("/booking", app.bookingView)

	// used for client-side rendering
	mux.HandleFunc("/recent", app.fetchArrestsFromBackend)
	mux.HandleFunc("/arrest", app.fetchSingleArrestFromBackend)
	mux.HandleFunc("/charges", app.fetchChargesFromBackend)

	return mux
}
