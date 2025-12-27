async function refreshMugs() {
    try {
        const response = await fetch('/recent');
        const arrests = await response.json();
        document.getElementById('spinner').style.display = 'none';
        // Update the mugs container
        const container = document.getElementById('arrest-grid-container');
        arrests.forEach(a => {
            container.appendChild(buildArrestCard(a));
        });
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

    const fullName = document.createElement('h2');
    fullName.textContent = arrest.FullName;

    const age = document.createElement('p');
    const ageStrong = document.createElement('strong');
    ageStrong.textContent = 'Age:';
    age.appendChild(ageStrong);
    age.appendChild(document.createTextNode(` ${arrest.Age}`));

    const date = document.createElement('p');
    const dateStrong = document.createElement('strong');
    dateStrong.textContent = 'Date:';
    date.appendChild(dateStrong);
    date.appendChild(document.createTextNode(` ${arrest.BookingDate}`));

    arrestDetails.appendChild(fullName);
    arrestDetails.appendChild(age);
    arrestDetails.appendChild(date);

    arrestCard.appendChild(arrestDetails);

    return arrestCard;
}

refreshMugs();