package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Charge struct {
	OffenseDescription  string `json:"offenseDescription"`
	BondAmount   	    string `json:"bondAmount"`
	CaseNumber          string `json:"caseNumber"`
	ArrestingAgencyName string `json:"arrestingAgencyName"`
}

type ViewCharge struct {
	OffenseDescription  string
	BondAmount   	    string
	CaseNumber          string
	ArrestingAgencyName string
}


func (app *application) fetchChargesFromAPI(bookingNumber int) ([]Charge, error) {
    url := fmt.Sprintf("https://www.sheriffleefl.org/public-api/bookings/%d/charges", bookingNumber);

    client := &http.Client{
        Timeout: 10 * time.Second,
    }

    resp, err := client.Get(url)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("%s", resp.Status)
    }

    var charges []Charge
    if err := json.NewDecoder(resp.Body).Decode(&charges); err != nil {
        return nil, err
    }

    return charges, nil    
}

func toChargeViewModel(c Charge) ViewCharge {
	return ViewCharge{
		OffenseDescription: c.OffenseDescription,
		BondAmount: c.BondAmount,
		CaseNumber: c.CaseNumber,
		ArrestingAgencyName: c.ArrestingAgencyName,
	}	
}