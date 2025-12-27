async function refreshMugs() {
    try {
        const response = await fetch('/recent');
        const arrests = await response.json();
        document.getElementById('spinner').style.display = 'none';
        // Update the mugs container
        const container = document.getElementById('arrest-gird-container');
        container.innerHTML = arrests.map(a => `
            <div class="arrest-card">
                <img 
                    src="data:image/jpeg;base64,${a.ImageBase64}" 
                    alt="${a.FullName}" 
                />
                <div class="arrest-details">
                    <h2>${a.FullName}</h2>
                    <p><strong>Age:</strong> ${a.Age}</p>
                    <p><strong>Date:</strong> ${a.BookingDate}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching mugs:', error);
    }
}

function buildArrestCard(arrest) {
    // create card container
    const arrestCard = document.createElement('div');
    arrestCard.classList.add('arrest-card');
    
    // create mugshot image
    const img = document.createElement('img');
    img.src = `data:image/jpeg;base64,${arrest.ImageBase64}`;
    img.alt = arrest.FullName;

    // add mugshot image to arrest-card
    arrestCard.appendChild(img);

    // create arrest details container
    const arrestDetails = document.createElement('div');
    arrestDetails.classList.add('arrest-details');

}

refreshMugs();