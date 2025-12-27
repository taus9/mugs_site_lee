async function refreshMugs() {
    const container = document.getElementById('arrest-grid-container');
    if (!container) {
        return;
    }

    showSpinner();
    container.innerHTML = '';

    try {
        const response = await fetch('/recent');
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const arrests = await response.json();
        hideSpinner();

        arrests.forEach(a => {
            container.appendChild(buildArrestCard(a));
        });
    } catch (error) {
        console.error('Error fetching mugs:', error);
        hideSpinner();
        displayLoadError(container);
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

    // create full name headline
    const fullName = document.createElement('h2');
    fullName.textContent = arrest.FullName;

    // create age info
    const age = document.createElement('p');
    const ageStrong = document.createElement('strong');
    ageStrong.textContent = 'Age:';
    age.appendChild(ageStrong);
    age.appendChild(document.createTextNode(` ${arrest.Age}`));

    // create booking date info
    const date = document.createElement('p');
    const dateStrong = document.createElement('strong');
    dateStrong.textContent = 'Date:';
    date.appendChild(dateStrong);
    date.appendChild(document.createTextNode(` ${arrest.BookingDate}`));

    // add in order
    arrestDetails.appendChild(fullName);
    arrestDetails.appendChild(age);
    arrestDetails.appendChild(date);

    arrestCard.appendChild(arrestDetails);

    return arrestCard;
}

function displayLoadError(container) {
    const errorCard = document.createElement('div');
    errorCard.classList.add('load-error');

    const message = document.createElement('p');
    message.textContent = 'Could not load recent arrests';

    const retryButton = document.createElement('button');
    retryButton.type = 'button';
    retryButton.classList.add('retry-button');
    retryButton.textContent = 'Retry';
    retryButton.addEventListener('click', () => {
        refreshMugs();
    });

    errorCard.appendChild(message);
    errorCard.appendChild(retryButton);

    container.appendChild(errorCard);
}

function showSpinner() {
    const spinner = document.getElementById('spinner');
    if (spinner) {
        spinner.style.display = 'flex';
    }
}

function hideSpinner() {
    const spinner = document.getElementById('spinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

refreshMugs();