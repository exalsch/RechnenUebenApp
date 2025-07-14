// Galerie-Funktionalität
document.addEventListener('DOMContentLoaded', () => {
    const galleryButton = document.getElementById('gallery-button');
    const saveGifButton = document.getElementById('save-gif');
    const galleryModal = document.getElementById('gallery-modal');
    const closeGalleryModalBtn = document.getElementById('close-gallery-modal');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const exportGalleryBtn = document.getElementById('export-gallery');
    const importGalleryBtn = document.getElementById('import-gallery');
    const importGalleryInput = document.getElementById('import-gallery-input');

    if (galleryButton) galleryButton.addEventListener('click', showGallery);
    if (saveGifButton) saveGifButton.addEventListener('click', saveGif);
    if (closeGalleryModalBtn) closeGalleryModalBtn.addEventListener('click', () => galleryModal.classList.add('hidden'));
    if (exportGalleryBtn) exportGalleryBtn.addEventListener('click', exportGallery);
    if (importGalleryBtn) importGalleryBtn.addEventListener('click', () => importGalleryInput.click());
    if (importGalleryInput) importGalleryInput.addEventListener('change', importGallery);

    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayGalleryPage(currentPage);
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(savedGifs.length / gifsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                displayGalleryPage(currentPage);
            }
        });
    }
});

const galleryContent = document.getElementById('gallery-content');
const pageInfo = document.getElementById('page-info');
const paginationControls = document.getElementById('pagination-controls');

let savedGifs = JSON.parse(localStorage.getItem('savedGifs') || '[]');
let currentPage = 1;
const gifsPerPage = 20;

function saveGif() {
    const saveGifButton = document.getElementById('save-gif');
    const currentGif = document.getElementById('result-gif').src;
    if (!savedGifs.includes(currentGif)) {
        savedGifs.push(currentGif);
        localStorage.setItem('savedGifs', JSON.stringify(savedGifs));
        saveGifButton.classList.add('saved');
    }
}

function removeGif(gifUrl) {
    savedGifs = savedGifs.filter(url => url !== gifUrl);
    localStorage.setItem('savedGifs', JSON.stringify(savedGifs));
    const totalPages = Math.ceil(savedGifs.length / gifsPerPage);
    if (currentPage > totalPages) {
        currentPage = totalPages > 0 ? totalPages : 1;
    }
    displayGalleryPage(currentPage);
}

function showGallery() {
    const galleryModal = document.getElementById('gallery-modal');
    currentPage = 1;
    galleryModal.classList.remove('hidden');
    displayGalleryPage(currentPage);
}

function displayGalleryPage(page) {
    galleryContent.innerHTML = '';
    const startIndex = (page - 1) * gifsPerPage;
    const endIndex = startIndex + gifsPerPage;
    const paginatedGifs = savedGifs.slice(startIndex, endIndex);

    if (savedGifs.length === 0) {
        galleryContent.innerHTML = '<p>Die Galerie ist leer.</p>';
        paginationControls.classList.add('hidden');
        return;
    } else {
        paginationControls.classList.remove('hidden');
    }

    paginatedGifs.forEach(gifUrl => {
        const gifContainer = document.createElement('div');
        gifContainer.className = 'gallery-item';

        const img = document.createElement('img');
        img.src = gifUrl;
        img.alt = 'Gespeichertes GIF';

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-gif-btn';
        removeBtn.textContent = '🗑️';
        removeBtn.onclick = () => {
            removeGif(gifUrl);
        };
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-gif-btn';
        copyBtn.textContent = '📋';
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(gifUrl).then(() => {
                alert('GIF-URL in die Zwischenablage kopiert!');
            }).catch(err => {
                console.error('Fehler beim Kopieren der URL: ', err);
            });
        };

        gifContainer.appendChild(img);
        gifContainer.appendChild(removeBtn);
        gifContainer.appendChild(copyBtn);
        galleryContent.appendChild(gifContainer);
    });

    const totalPages = Math.ceil(savedGifs.length / gifsPerPage);
    pageInfo.textContent = `Seite ${page} von ${totalPages}`;

    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    prevPageBtn.disabled = page === 1;
    nextPageBtn.disabled = page === totalPages || totalPages === 0;
}

function exportGallery() {
    if (savedGifs.length === 0) {
        alert('Die Galerie ist leer. Es gibt nichts zu exportieren.');
        return;
    }
    const dataStr = JSON.stringify(savedGifs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'galerie-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importGallery(event) {
    const importGalleryInput = document.getElementById('import-gallery-input');
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedGifs = JSON.parse(e.target.result);
            if (!Array.isArray(importedGifs) || !importedGifs.every(item => typeof item === 'string')) {
                throw new Error('Ungültiges Dateiformat.');
            }

            // Merge without duplicates
            const newGifs = importedGifs.filter(gif => !savedGifs.includes(gif));
            savedGifs.push(...newGifs);
            localStorage.setItem('savedGifs', JSON.stringify(savedGifs));
            alert(`${newGifs.length} neue GIFs wurden zur Galerie hinzugefügt.`);
            if (document.getElementById('gallery-modal') && !document.getElementById('gallery-modal').classList.contains('hidden')) {
                showGallery(); // Refresh gallery view if open
            }
        } catch (error) {
            alert('Fehler beim Importieren der Datei: ' + error.message);
        }
    };
    reader.readAsText(file);
    // Reset file input
    importGalleryInput.value = '';
}

// Globale Funktionen zur Steuerung des Save-Buttons von main.js aus
window.showSaveGifButton = function() {
    const saveGifButton = document.getElementById('save-gif');
    if (saveGifButton) {
        saveGifButton.style.display = '';
        saveGifButton.classList.remove('saved'); // Reset saved state for new GIF
    }
};

window.hideSaveGifButton = function() {
    const saveGifButton = document.getElementById('save-gif');
    if (saveGifButton) {
        saveGifButton.style.display = 'none';
    }
};
