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