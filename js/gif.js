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

function getDynamicGifCacheName() {
    return window.GIF_DYNAMIC_CACHE_NAME || 'rechnen-ueben-app-dynamic-cache-v3';
}

function normalizeGifResult(displayUrl, sourceUrl) {
    return {
        displayUrl,
        sourceUrl: sourceUrl || displayUrl
    };
}

function extractGifUrlsFromResponse(data) {
    if (!data || typeof data !== 'object') {
        return [];
    }

    const knownCollections = [
        data.results,
        data.data,
        data.gifs,
        data.items
    ].filter(Array.isArray);

    const urls = [];

    for (const collection of knownCollections) {
        for (const item of collection) {
            const candidates = [
                item?.media_formats?.gif?.url,
                item?.media?.gif?.url,
                item?.images?.original?.url,
                item?.images?.downsized?.url,
                item?.gif?.url,
                item?.url,
                item?.gif_url
            ];

            const firstValid = candidates.find(candidate => typeof candidate === 'string' && candidate.length > 0);
            if (firstValid) {
                urls.push(firstValid);
            }
        }
    }

    return urls;
}

function buildKlipySearchUrl(query, limit) {
    const endpoint = (window.KLIPY_SEARCH_ENDPOINT || 'https://api.klipy.com/v1/gifs/search').trim();
    const url = new URL(endpoint);
    url.searchParams.set('q', query);
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('contentfilter', 'high');

    if (window.GIF_API_KEY && window.GIF_API_KEY !== 'DUMMY') {
        url.searchParams.set('key', window.GIF_API_KEY);
    }

    return url.toString();
}

async function fetchKlipyGifUrls(query, limit) {
    const response = await fetch(buildKlipySearchUrl(query, limit));
    if (!response.ok) {
        throw new Error(`GIF provider request failed with status ${response.status}`);
    }

    const data = await response.json();
    const urls = extractGifUrlsFromResponse(data);
    if (urls.length === 0) {
        throw new Error(`No GIFs found for query: ${query}`);
    }

    return urls;
}

async function resolveCachedGifDisplayUrl(sourceUrl) {
    if (!sourceUrl || typeof sourceUrl !== 'string' || typeof caches === 'undefined') {
        return null;
    }

    try {
        const cachedResponse = await caches.match(sourceUrl);
        if (!cachedResponse) {
            return null;
        }

        const blob = await cachedResponse.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error resolving cached GIF display URL:', error);
        return null;
    }
}

async function getRandomOfflineGif() {
    const cachedUrls = JSON.parse(localStorage.getItem('cachedGifUrls') || '[]');

    if (cachedUrls.length > 0) {
        const randomIndex = Math.floor(Math.random() * cachedUrls.length);

        const cachedUrl = cachedUrls[randomIndex];
        console.log('Found cached GIF URL:', cachedUrl);

        // Try all available browser caches first (includes legacy cache versions)
        const cachedDisplayUrl = await resolveCachedGifDisplayUrl(cachedUrl);
        if (cachedDisplayUrl) {
            console.log('Using cached GIF from service worker');
            return normalizeGifResult(cachedDisplayUrl, cachedUrl);
        }

        // Fallback to direct URL (may fail offline)
        console.log('Cache miss, trying direct URL (may fail offline)');
        return normalizeGifResult(cachedUrl, cachedUrl);
    } else {
        console.log('No cached GIFs found, falling back to local GIF.');
        const localGif = getRandomLocalGif();
        return normalizeGifResult(localGif, localGif);
    }
}

async function fetchRandomGif() {
    if (navigator.onLine) {
        console.log('Online: Fetching a new GIF from Klipy.');
        const randomQuery = window.gifQueries[Math.floor(Math.random() * window.gifQueries.length)];
        try {
            const gifUrls = await fetchKlipyGifUrls(randomQuery, 30);
            const randomIndex = Math.floor(Math.random() * gifUrls.length);
            const selectedUrl = gifUrls[randomIndex];
            return normalizeGifResult(selectedUrl, selectedUrl);
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
let currentGifUrl = null;

function handleGameEndGif() {
    const resultGif = document.getElementById('result-gif');
    const resultPlaceholder = document.getElementById('result-placeholder');

    // Reset any existing state
    if (currentGifUrl) {
        console.log('GIF already displayed, not fetching new one');
        return;
    }

    if (window.timeLeft > 0) {
        // Game ended early - show placeholder instead of image to avoid broken image icon
        if (resultGif) {
            resultGif.removeAttribute('src');
            resultGif.classList.add('hidden');
            resultGif.style.display = 'none';
            resultGif.removeAttribute('alt');
        }
        if (resultPlaceholder) {
            resultPlaceholder.textContent = ' Schade';
            resultPlaceholder.classList.remove('hidden');
        }
        if (typeof window.hideSaveGifButton === 'function') {
            window.hideSaveGifButton();
        }
        isLoadingGif = false;
        currentGifUrl = 'early_end'; // Mark as handled
    } else {
        // Game completed normally - show reward GIF
        if (isLoadingGif) {
            console.log('GIF already loading, skipping duplicate request');
            return;
        }

        isLoadingGif = true;
        // Ensure placeholder is hidden and image is visible for normal end
        if (resultPlaceholder) {
            resultPlaceholder.textContent = '';
            resultPlaceholder.classList.add('hidden');
        }
        if (resultGif) {
            resultGif.classList.remove('hidden');
            resultGif.style.display = '';
            resultGif.alt = 'Zufälliges Ende GIF';
        }

        // Show loading placeholder
        resultGif.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

        fetchRandomGif().then(async (gifResult) => {
            // Check if we're still supposed to be loading (prevent race conditions)
            if (!isLoadingGif) {
                console.log('GIF loading was cancelled, ignoring result');
                return;
            }

            if (gifResult && gifResult.displayUrl) {
                currentGifUrl = gifResult.sourceUrl;
                resultGif.dataset.originalGifUrl = gifResult.sourceUrl;
                resultGif.src = gifResult.displayUrl;
            } else {
                const localGif = getRandomLocalGif();
                currentGifUrl = localGif;
                resultGif.dataset.originalGifUrl = localGif;
                resultGif.src = localGif;
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
                const localGif = getRandomLocalGif();
                currentGifUrl = localGif;
                resultGif.dataset.originalGifUrl = localGif;
                resultGif.src = localGif;
                isLoadingGif = false;
                if (typeof window.showSaveGifButton === 'function') {
                    window.showSaveGifButton();
                }
            };

            // Fallback in case onload doesn't fire
            setTimeout(() => {
                if (isLoadingGif) {
                    console.log('GIF load timeout, assuming completed');
                    isLoadingGif = false;
                }
            }, 5000);
        }).catch(error => {
            console.error('Error loading GIF:', error);
            const localGif = getRandomLocalGif();
            currentGifUrl = localGif;
            resultGif.dataset.originalGifUrl = localGif;
            resultGif.src = localGif;
            isLoadingGif = false;
            if (typeof window.showSaveGifButton === 'function') {
                window.showSaveGifButton();
            }
        });
    }
}

// Reset GIF state when starting a new game
function resetGifState() {
    isLoadingGif = false;
    currentGifUrl = null;
    const resultGif = document.getElementById('result-gif');
    const resultPlaceholder = document.getElementById('result-placeholder');
    if (resultGif) {
        resultGif.onload = null;
        resultGif.onerror = null;
        resultGif.removeAttribute('src');
        resultGif.removeAttribute('data-original-gif-url');
        resultGif.classList.remove('hidden');
        resultGif.style.display = '';
        resultGif.alt = 'Zufälliges Ende GIF';
    }
    if (resultPlaceholder) {
        resultPlaceholder.textContent = '';
        resultPlaceholder.classList.add('hidden');
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
        const gifUrls = await fetchKlipyGifUrls(randomQuery, PRECACHE_COUNT);

        if (gifUrls.length > 0) {
            const cache = await caches.open(getDynamicGifCacheName());

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

            // Store cached GIF URLs in local storage
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
window.resetGifState = resetGifState;
window.precacheGifs = precacheGifs;
window.resolveCachedGifDisplayUrl = resolveCachedGifDisplayUrl;