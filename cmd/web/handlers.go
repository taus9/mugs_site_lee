package main

import (
	"fmt"
	"html/template"
	"net/http"
	"strconv"
)

type HomePageData struct {
	Arrests  []ViewArrest
}

func (app *application) home(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	files := []string{
		"./ui/html/partials/spinner.tmpl.html",
		"./ui/html/base.tmpl.html",
		"./ui/html/pages/home.tmpl.html",
	}

	ts, err := template.ParseFiles(files...)
	if err != nil {
		app.serverError(w, err)
		return
	}

	// arrests, err := app.fetchArrests()
	// if err != nil {
	// 	app.serverError(w, err)
	// 	return
	// }

	// fArrests := make([]ViewArrest, 0, len(arrests))
	// for _, a := range arrests {
	// 	fArrests = append(fArrests, toViewModel(a))
	// }

	// data := HomePageData{
	// 	Arrests: fArrests,
	// }

	err = ts.ExecuteTemplate(w, "base", nil)
	if err != nil {
		app.serverError(w, err)
	}
}

func (app *application) bookingView(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil || id < 1 {
		app.notFound(w)
		return
	}
	fmt.Fprintf(w, "Booking id %d", id)
}
