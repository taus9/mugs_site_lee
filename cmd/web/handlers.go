package main

import (
	"encoding/json"
	"html/template"
	"net/http"
	"strconv"
)

type HomePageData struct {
	Arrests []ViewArrest
}

func (app *application) home(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	files := []string{
		"./ui/html/partials/spinner.tmpl.html",
		"./ui/html/pages/home.tmpl.html",
	}

	ts, err := template.ParseFiles(files...)
	if err != nil {
		app.serverError(w, err)
		return
	}

	err = ts.ExecuteTemplate(w, "home", nil);
	if err != nil {
		app.serverError(w, err)
	}
}

func (app *application) fetchArrestsFromBackend(w http.ResponseWriter, r *http.Request) {
	arrests, err := app.fetchArrestsFromAPI()
	if err != nil {
		app.serverError(w, err)
		return
	}

	fArrests := make([]ViewArrest, 0, len(arrests))
	for _, a := range arrests {
		fArrests = append(fArrests, toViewModel(a))
	}

	w.Header().Set("Content-Type", "application/json")
	
	err = json.NewEncoder(w).Encode(fArrests)
	
	if err != nil {
		app.serverError(w, err)
	}
}

func (app *application) bookingView(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.URL.Query().Get("number"))
	if err != nil || id < 1 {
		app.notFound(w)
		return
	}
	files := []string{
		"./ui/html/partials/spinner.tmpl.html",
		"./ui/html/pages/booking.tmpl.html",
	}

	ts, err := template.ParseFiles(files...)
	if err != nil {
		app.serverError(w, err)
		return
	}

	err = ts.ExecuteTemplate(w, "booking", nil);
	if err != nil {
		app.serverError(w, err)
	}
}

func (app *application) fetchSingleArrestFromBackend(w http.ResponseWriter, r *http.Request) {
	bookingNumber, err := strconv.Atoi(r.URL.Query().Get("number"))
	if err != nil || bookingNumber < 1 {
		app.notFound(w)
		return
	}
	
	arrest, err := app.fetchSingleArrestFromAPI(bookingNumber)
	if err != nil {
		
		if err.Error() == "404 Not Found" {
			app.notFound(w)
			return
		}

		app.serverError(w, err)
		return
	}
	
	fArrest := toViewModel(*arrest)
	w.Header().Set("Content-Type", "application/json")
	
	err = json.NewEncoder(w).Encode(fArrest)
	
	if err != nil {
		app.serverError(w, err)
	}
}