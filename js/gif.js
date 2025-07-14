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

async function getRandomOfflineGif() {
    const cachedUrls = JSON.parse(localStorage.getItem('cachedGifUrls') || '[]');
    if (cachedUrls.length > 0) {
        const randomIndex = Math.floor(Math.random() * cachedUrls.length);
        const cachedUrl = cachedUrls[randomIndex];
        console.log('Found cached GIF URL:', cachedUrl);
        
        // Try to get from service worker cache first
        try {
            const cache = await caches.open('rechnen-ueben-app-dynamic-cache-v1');
            const cachedResponse = await cache.match(cachedUrl);
            if (cachedResponse) {
                const blob = await cachedResponse.blob();
                const objectUrl = URL.createObjectURL(blob);
                console.log('Using cached GIF from service worker');
                return objectUrl;
            }
        } catch (error) {
            console.error('Error accessing cached GIF:', error);
        }
        
        // Fallback to direct URL (may fail offline)
        console.log('Cache miss, trying direct URL (may fail offline)');
        return cachedUrl;
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
            return await getRandomOfflineGif();
        }
    } else {
        console.log('Offline: Using a pre-cached GIF.');
        return await getRandomOfflineGif();
    }
}

let isLoadingGif = false;

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
        isLoadingGif = false;
    } else {
        if (isLoadingGif) {
            console.log('GIF already loading, skipping duplicate request');
            return;
        }
        
        isLoadingGif = true;
        resultGif.style.fontSize = '';
        resultGif.style.display = '';
        resultGif.style.textAlign = '';
        resultGif.innerText = '';
        
        resultGif.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        
        fetchRandomGif().then(async (gifUrl) => {
            if (gifUrl) {
                resultGif.src = gifUrl;
            } else {
                resultGif.src = getRandomLocalGif();
            }
            
            // Wait for image to load before updating save button
            resultGif.onload = () => {
                isLoadingGif = false;
                if (typeof window.showSaveGifButton === 'function') {
                    window.showSaveGifButton();
                }
            };
            
            resultGif.onerror = () => {
                console.log('Failed to load GIF, falling back to local');
                isLoadingGif = false;
                resultGif.src = getRandomLocalGif();
                if (typeof window.showSaveGifButton === 'function') {
                    window.showSaveGifButton();
                }
            };
            
            // Fallback in case onload doesn't fire
            setTimeout(() => {
                isLoadingGif = false;
            }, 5000);
        }).catch(error => {
            console.error('Error loading GIF:', error);
            isLoadingGif = false;
            resultGif.src = getRandomLocalGif();
            if (typeof window.showSaveGifButton === 'function') {
                window.showSaveGifButton();
            }
        });
    }
}

async function precacheGifs() {
    if (!navigator.onLine) {
        console.log('Offline, skipping GIF pre-caching.');
        return;
    }

    console.log('Online, starting GIF pre-caching...');
    const PRECACHE_COUNT = window.gifCacheCount || 20;
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