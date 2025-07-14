function getRandomLocalGif() {
    const localGifs = [
        'img/end_1.gif',
        'img/end_2.gif',
        'img/end_3.gif',
        'img/end_4.gif',
        'img/end_5.gif',
        'img/end_6.gif'
    ];
    const randomIndex = Math.floor(Math.random() * localGifs.length);
    return localGifs[randomIndex];
}

function getRandomOfflineGif() {
    const cachedUrls = JSON.parse(localStorage.getItem('cachedGifUrls') || '[]');
    if (cachedUrls.length > 0) {
        const randomIndex = Math.floor(Math.random() * cachedUrls.length);
        console.log('Found cached GIF:', cachedUrls[randomIndex]);
        return cachedUrls[randomIndex];
    } else {
        console.log('No cached GIFs found, falling back to local GIF.');
        return getRandomLocalGif();
    }
}

async function fetchRandomGif() {
    if (navigator.onLine) {
        console.log('Online: Fetching a new GIF from Tenor.');
        const randomQuery = window.gifQueries[Math.floor(Math.random() * window.gifQueries.length)];
        try {
            const response = await fetch(
                `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(randomQuery)}&key=${window.TENOR_API_KEY}&client_key=mathe_lern_app&limit=30&contentfilter=high`
            );
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const randomIndex = Math.floor(Math.random() * data.results.length);
                return data.results[randomIndex].media_formats.gif.url;
            } else {
                throw new Error('No GIFs found for query: ' + randomQuery);
            }
        } catch (error) {
            console.error('Error fetching new GIF, falling back to offline/local:', error);
            return getRandomOfflineGif();
        }
    } else {
        console.log('Offline: Using a pre-cached GIF.');
        return getRandomOfflineGif();
    }
}

function handleGameEndGif() {
    const resultGif = document.getElementById('result-gif');
    
    if (window.timeLeft > 0) {
        resultGif.style.fontSize = '48px';
        resultGif.style.display = 'block';
        resultGif.style.textAlign = 'center';
        resultGif.src = '';
        resultGif.alt = 'Schade';
        resultGif.innerText = '😕';
        if (typeof window.hideSaveGifButton === 'function') {
            window.hideSaveGifButton();
        }
    } else {
        resultGif.style.fontSize = '';
        resultGif.style.display = '';
        resultGif.style.textAlign = '';
        resultGif.innerText = '';
        
        resultGif.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        
        fetchRandomGif().then(gifUrl => {
            if (gifUrl) {
                resultGif.src = gifUrl;
            } else {
                resultGif.src = getRandomLocalGif();
            }
            
            // Wait for image to load before updating save button
            resultGif.onload = () => {
                if (typeof window.showSaveGifButton === 'function') {
                    window.showSaveGifButton();
                }
            };
        });
    }
}

async function precacheGifs() {
    if (!navigator.onLine) {
        console.log('Offline, skipping GIF pre-caching.');
        return;
    }

    console.log('Online, starting GIF pre-caching...');
    const PRECACHE_COUNT = 20;
    let cachedGifUrls = [];

    try {
        const randomQuery = window.gifQueries[Math.floor(Math.random() * window.gifQueries.length)];
        const response = await fetch(
            `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(randomQuery)}&key=${window.TENOR_API_KEY}&client_key=mathe_lern_app&limit=${PRECACHE_COUNT}&contentfilter=high`
        );

        if (!response.ok) throw new Error('Failed to fetch GIF list for precaching');

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const gifUrls = data.results.map(result => result.media_formats.gif.url);

            const cache = await caches.open('rechnen-ueben-app-dynamic-cache-v1');

            for (const url of gifUrls) {
                try {
                    const gifResponse = await fetch(url, { mode: 'no-cors' });
                    await cache.put(url, gifResponse);
                    cachedGifUrls.push(url);
                    console.log('Pre-cached GIF:', url);
                } catch (error) {
                    console.error('Failed to cache a single GIF:', url, error);
                }
            }
            
            if (cachedGifUrls.length > 0) {
                localStorage.setItem('cachedGifUrls', JSON.stringify(cachedGifUrls));
                console.log(`${cachedGifUrls.length} GIFs successfully pre-cached and URLs stored.`);
            }
        }
    } catch (error) {
        console.error('Error during GIF pre-caching process:', error);
    }
}

window.getRandomLocalGif = getRandomLocalGif;
window.getRandomOfflineGif = getRandomOfflineGif;
window.fetchRandomGif = fetchRandomGif;
window.handleGameEndGif = handleGameEndGif;
window.precacheGifs = precacheGifs;