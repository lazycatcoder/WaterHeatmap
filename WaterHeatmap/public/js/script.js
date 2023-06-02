document.addEventListener('DOMContentLoaded', function() {
    var heatmapElement = document.querySelector('.heatmap');
    if (heatmapElement) {
        heatmapElement.style.backgroundColor = 'blue';
    }
});

// Function for displaying images in a block with the heatmap class
async function displayHeatmap() {
    const heatmapContainer = document.querySelector('.heatmap');

    const mapImage = document.createElement('img');
    mapImage.src = './img/map.png';
    mapImage.alt = 'World Map';
    mapImage.classList.add('map');
    heatmapContainer.appendChild(mapImage);

    const coordinateSystem = document.createElement('div');
    coordinateSystem.classList.add('coordinate-system');
    heatmapContainer.appendChild(coordinateSystem);

    try {
        let heatmapImage = await findHeatmapImage();

        if (!heatmapImage) {
            heatmapImage = await findDefaultHeatmapImage();
        }

        if (heatmapImage) {
            heatmapContainer.insertBefore(heatmapImage, mapImage);
        } else {
            // console.log('File heatmap not found');
        }
    } catch (error) {
        console.log('Error loading heatmap image:', error);
    }
}

// Function to find and load a heatmap image with the current date
async function findHeatmapImage() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const targetDate = new Date(currentYear, 0, 1); // Date 01.01.current year
    let foundImage = false;

    while (currentDate > targetDate) {
        const year = currentDate.getFullYear();
        const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
        const day = ('0' + currentDate.getDate()).slice(-2);
        const fileName = `heatmap_${year}-${month}-${day}.png`;
        const filePath = `./map/${fileName}`;

        const imageExists = await checkImageExists(filePath);
        if (imageExists) {
            const heatmapImage = document.createElement('img');
            heatmapImage.src = filePath;
            heatmapImage.classList.add('heatmap');
            foundImage = true;
            return heatmapImage;
        }

        currentDate.setDate(currentDate.getDate() - 1); // Move to the previous date
    }

    if (!foundImage) {
        return null;
    }
}

// Function to find and load the heatmap.png file
async function findDefaultHeatmapImage() {
    const filePath = './map/heatmap.png';
    const imageExists = await checkImageExists(filePath);

    if (imageExists) {
        const heatmapImage = document.createElement('img');
        heatmapImage.src = filePath;
        heatmapImage.classList.add('heatmap');
        return heatmapImage;
    }

    return null;
}

// Function to check if image exists by URL
function checkImageExists(imageUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = imageUrl;
    });
}

// Calling a function to display images in a block with the heatmap class
displayHeatmap();



// Function to save a web page as a jpeg in original size
function savePage() {
    const saveButton = document.getElementById('save-button');
    const buttonText = saveButton.innerText;

    saveButton.innerText = 'Downloading...';
    saveButton.disabled = true;

    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    saveButton.appendChild(progressBar);

    // Delay for the smooth appearance of the progress bar
    setTimeout(() => {
        progressBar.style.opacity = '1';
    }, 100);

    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 5;
        progressBar.style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(progressInterval);
            saveButton.innerText = 'Downloaded';

            // Taking a screenshot and saving it to a file
            html2canvas(document.body).then(function (canvas) {
                canvas.toBlob(function (blob) {
                    const currentDate = new Date();
                    const year = currentDate.getFullYear();
                    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
                    const day = ('0' + currentDate.getDate()).slice(-2);
                    const fileName = `heatmap_${year}-${month}-${day}.jpg`;

                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = fileName;
                    link.click();

                    setTimeout(() => {
                        saveButton.innerText = buttonText;
                        saveButton.disabled = false;
                        progressBar.remove();
                    }, 3000);
                }, 'image/jpeg');
            });
        }
    }, 50);
}

// Calling a function to display images in a block with the heatmap class
displayHeatmap();

// Assign an event handler for the page save button
const saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', savePage);
saveButton.addEventListener('mousedown', () =>
    saveButton.classList.add('pressed')
);
saveButton.addEventListener('mouseup', () =>
    saveButton.classList.remove('pressed')
);