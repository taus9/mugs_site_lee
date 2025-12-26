package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Arrest struct {
    ID            string    `json:"id"`
    BookingNumber string `json:"bookingNumber"`
    BookingDate   string `json:"bookingDate"`
    SurName       string `json:"surName"`
    GivenName     string `json:"givenName"`
    MiddleName    string `json:"middleName"`
    BirthDate     string `json:"birthDate"`
    ImageBase64   string `json:"image"`
}

type PageData struct {
    Arrests []Arrest
}

func (app *application) fetchArrests() ([]Arrest, error) {
    url := "https://www.sheriffleefl.org/public-api/bookings"

    client := &http.Client{
        Timeout: 10 * time.Second,
    }

    resp, err := client.Get(url)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("bad status: %s", resp.Status)
    }

    var arrests []Arrest
    if err := json.NewDecoder(resp.Body).Decode(&arrests); err != nil {
        return nil, err
    }

    return arrests, nil
}
