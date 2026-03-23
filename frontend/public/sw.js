// const CACHE = 'smartgrocery-v1';
// const STATIC = ['/', '/products', '/cart'];

// self.addEventListener('install', e => {
//   e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
//   self.skipWaiting();
// });

// self.addEventListener('activate', e => {
//   e.waitUntil(caches.keys().then(keys =>
//     Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
//   ));
// });

// self.addEventListener('fetch', e => {
//   if (e.request.url.includes('/api/')) return; // Never cache API calls
//   e.respondWith(
//     caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
//       if (res.ok && e.request.method === 'GET') {
//         const clone = res.clone();
//         caches.open(CACHE).then(c => c.put(e.request, clone));
//       }
//       return res;
//     }).catch(() => caches.match('/')))
//   );
// });

// // Push notification handler
// self.addEventListener('push', e => {
//   const data = e.data?.json() || { title: 'SmartGrocery', body: 'You have a new notification!' };
//   e.waitUntil(self.registration.showNotification(data.title, {
//     body: data.body, icon: '/icon-192.png', badge: '/icon-192.png',
//     tag: 'smartgrocery', renotify: true,
//   }));
// });


self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', async () => {
  const keys = await caches.keys();
  await Promise.all(keys.map(k => caches.delete(k)));
  await self.registration.unregister();
  const clients = await self.clients.matchAll({ type: 'window' });
  clients.forEach(c => c.navigate(c.url));
});