package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Arrest struct {
    ID            string `json:"id"`
    BookingNumber string `json:"bookingNumber"`
    BookingDate   string `json:"bookingDate"`
    SurName       string `json:"surName"`
    GivenName     string `json:"givenName"`
    MiddleName    string `json:"middleName"`
    BirthDate     string `json:"birthDate"`
    ImageBase64   string `json:"image"`
}

type ViewArrest struct {
    ID          string
    FullName    string
    BookingDate string
    Age         int
    ImageBase64 string
}

func (app *application) fetchArrestsFromAPI() ([]Arrest, error) {
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

func toViewModel(a Arrest) ViewArrest {
    fullName := a.GivenName
    if a.MiddleName != "" {
        fullName += " " + a.MiddleName
    }
    fullName += " " + a.SurName
    return ViewArrest{
        ID: a.ID,
        FullName: fullName,
        BookingDate: formatBookingDate(a.BookingDate),
        Age: calculateAge(a.BirthDate),
        ImageBase64: a.ImageBase64,
    }
}

func calculateAge(birthDate string) int {
    if birthDate == "" {
        return 0
    }

    dob, err := time.Parse("2006-01-02 15:04:05.000", birthDate)
    if err != nil {
        return 0
    }

    today := time.Now()
    age := today.Year() - dob.Year()

    if today.Month() < dob.Month() ||
        (today.Month() == dob.Month() && today.Day() < dob.Day()) {
        age--
    }

    return age
}

func formatBookingDate(dateStr string) string {
    t, err := time.Parse(
        "2006-01-02 15:04:05.000",
        dateStr,
    )
    if err != nil {
        return dateStr
    }

    return t.Format("Jan 2, 2006 3:04 PM")
}
