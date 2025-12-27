async function loadCharges() {
    const url = new URL(window.location.href);
    const bookingNumber = url.searchParams.get('number'); // if this function is running then the number is there

    showSpinner('charges-spinner');
    
    const response = await fetch(`/charges?number=${bookingNumber}`);
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    const charges = await response.json();
    hideSpinner('charges-spinner');
    document.getElementById('charges-section').style.display = "grid";
    const chargesList = document.getElementById('charges-list');

    charges.forEach(c => {
        chargesList.appendChild(buildChargeCard(c));
    });
}

async function loadBooking() {
    const url = new URL(window.location.href);
    const bookingNumber = url.searchParams.get('number'); // if this function is running then the number is there

    showSpinner('info-spinner');
    
    const response = await fetch(`/arrest?number=${bookingNumber}`);
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    const info = await response.json();
    hideSpinner('info-spinner');
    document.getElementById('info-section').style.display = "flex";
    
    // populate booking information
    document.getElementById('booking-image').src = `data:image/jpeg;base64,${info.ImageBase64}`;
    document.getElementById('booking-full-name').textContent = info.FullName;
    document.getElementById('booking-age').textContent = info.Age;
    document.getElementById('booking-date').textContent = info.BookingDate;
    
    const inCustody = info.InCustody ? "Yes" : "No";
    document.getElementById('booking-in-custody').textContent = inCustody;

}

function buildChargeCard(charge) {
    const chargeCard = document.createElement('div');
    chargeCard.classList.add('charge-card');
    chargeCard.role = 'listitem';

    const chargeDescription = document.createElement('p');
    chargeDescription.classList.add('charge-description');
    chargeDescription.textContent = charge.OffenseDescription;

    const chargeMeta = document.createElement('div');
    chargeMeta.classList.add('charge-meta')

    const bondDiv = document.createElement('div');
    
    const bondLabel = document.createElement('span');
    bondLabel.classList.add('label');
    bondLabel.textContent = 'Bond Amount';

    const bondSpan = document.createElement('span');
    bondSpan.textContent = charge.BondAmount !== '' 
        ? charge.BondAmount 
        : 'Information Not Available';

    const caseDiv = document.createElement('div');
    
    const caseLabel = document.createElement('span');
    caseLabel.classList.add('label');
    caseLabel.textContent = 'Case Number';

    const caseSpan = document.createElement('span');
    caseSpan.textContent = charge.CaseNumber;

    const agencyDiv = document.createElement('div');
    
    const agencyLabel = document.createElement('span');
    agencyLabel.classList.add('label');
    agencyLabel.textContent = 'Arresting Agency';

    const agencySpan = document.createElement('span');
    agencySpan.textContent = charge.ArrestingAgencyName !== ''
        ? charge.ArrestingAgencyName
        : 'Information Not Available';

    // build agency div
    agencyDiv.appendChild(agencyLabel);
    agencyDiv.appendChild(agencySpan);

    // build case number div
    caseDiv.appendChild(caseLabel);
    caseDiv.appendChild(caseSpan);

    // build bond div
    bondDiv.appendChild(bondLabel);
    bondDiv.appendChild(bondSpan);

    // build charge meta div
    chargeMeta.appendChild(bondDiv);
    chargeMeta.appendChild(caseDiv);
    chargeMeta.appendChild(agencyDiv);

    // build charge card div
    chargeCard.appendChild(chargeDescription);
    chargeCard.appendChild(chargeMeta);

    return chargeCard;
}

function showSpinner(id) {
    const spinner = document.getElementById(id);
    if (spinner) {
        spinner.style.display = 'flex';
    }
}

function hideSpinner(id) {
    const spinner = document.getElementById(id);
    if (spinner) {
        spinner.style.display = 'none';
    }
}

loadBooking()
loadCharges()