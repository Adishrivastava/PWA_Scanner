const staticCacheName = 'files-static-v13';
const dynamicCacheName = 'files-dynamic-v13';

const assets = [
	'/',
	'/pwa_scanner_files/index.html',
	'/pwa_scanner_files/user_login.html',
	'/pwa_scanner_files/assects/scripts/info.js',
	'/pwa_scanner_files/assects/scripts/scanner.js',
	'/pwa_scanner_files/assects/scripts/database.js',
	'/pwa_scanner_files/assects/scripts/materialize_pro.js',
	'/pwa_scanner_files/assects/scripts/app.js',
	'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',
	'https://cdnjs.cloudflare.com/ajax/libs/sweetalert/2.1.2/sweetalert.min.js',
	'https://fonts.googleapis.com/icon?family=Material+Icons',
	'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
	'/pwa_scanner_files/assects/styles/style.css',
	'/pwa_scanner_files/manifest.json',
];

// ? listening install event
self.addEventListener('install', async (evt) => {
	let promise = await caches
		.open(staticCacheName)
		.then((cache) => {
			//console.log('caches');
		})
		.catch((e) => {
			console.log(e);
		});
});

// ? activation event
self.addEventListener('activate', (evt) => {
	console.log('activated');
});

// ? todo fetch event
self.addEventListener('fetch', (evt) => {
	const req = evt.request;
	const url = new URL(req.url);
	if (url.origin == location.origin) {
		evt.respondWith(cacheFirst(req));
	} else {
		evt.respondWith(networkFirst(req));
	}
});

// ? looking for cache first in local files
const cacheFirst = async (req) => {
	let cachesRes = await caches.match(req);
	return cachesRes || fetch(req);
};

// ? looking network in hhtp files
const networkFirst = async (req) => {
	const cache = await caches.open(dynamicCacheName);

	if (req.method == 'POST') {
		const res = await fetch(req);

		return res;
	} else {
		try {
			const res = await fetch(req);
			cache.put(req, res.clone());
			return res;
		} catch (e) {
			return cache.match(req);
		}
	}
	//return fetch(req);
};
