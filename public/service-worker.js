// public/service-worker.js

// --- Versionado de cachés ---
const CACHE_STATIC = 'static-v1';
const CACHE_DYNAMIC = 'dynamic-v1';
const CACHE_IMAGES = 'images-v1';
const OFFLINE_PAGE = '/offline.html';

// --- Archivos base del App Shell (ajusta si cambias nombres/rutas) ---
const APP_SHELL = [
  '/',
  '/index.html',
  '/offline.html',
  '/offline.css',
  '/vite.svg',
  '/manifest.json',
];

// --- Instalación del Service Worker ---
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando service worker...');
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// --- Activación y limpieza de cachés antiguas ---
self.addEventListener('activate', (event) => {
  console.log('[SW] Activado');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (![CACHE_STATIC, CACHE_DYNAMIC, CACHE_IMAGES].includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// --- Estrategias de caché ---
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Estrategia Network First para datos dinámicos o API
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(req));
    return;
  }

  // Estrategia Cache First para el App Shell
  if (APP_SHELL.includes(url.pathname) || req.mode === 'navigate') {
    event.respondWith(cacheFirst(req));
    return;
  }

  // Estrategia Stale While Revalidate para imágenes
  if (req.destination === 'image') {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  // Por defecto: intentar red -> caché -> offline
  event.respondWith(
    fetch(req).catch(() => caches.match(req).then((res) => res || caches.match(OFFLINE_PAGE)))
  );
});

// --- Funciones de estrategia ---
async function cacheFirst(req) {
  const cached = await caches.match(req);
  return cached || fetch(req);
}

async function networkFirst(req) {
  try {
    const fresh = await fetch(req);
    const cache = await caches.open(CACHE_DYNAMIC);
    cache.put(req, fresh.clone());
    return fresh;
  } catch (err) {
    const cached = await caches.match(req);
    return cached || caches.match(OFFLINE_PAGE);
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE_IMAGES);
  const cached = await cache.match(req);
  const fetchPromise = fetch(req).then((networkRes) => {
    cache.put(req, networkRes.clone());
    return networkRes;
  });
  return cached || fetchPromise;
}

// --- IndexedDB para almacenar datos offline ---
function openIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('my-pwa-db', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('entries')) {
        db.createObjectStore('entries', { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getAllEntries() {
  const db = await openIDB();
  return new Promise((resolve) => {
    const tx = db.transaction('entries', 'readonly');
    const store = tx.objectStore('entries');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
  });
}

async function deleteEntry(id) {
  const db = await openIDB();
  const tx = db.transaction('entries', 'readwrite');
  tx.objectStore('entries').delete(id);
  return tx.complete;
}

// --- Sincronización en segundo plano ---
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-entries') {
    event.waitUntil(syncEntries());
  }
});

async function syncEntries() {
  const entries = await getAllEntries();
  if (!entries.length) return;

  for (const entry of entries) {
    try {
      // 🔹 Reemplaza con tu endpoint Firebase Function:
      const res = await fetch('https://us-central1-TU_PROYECTO.cloudfunctions.net/syncEntries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (res.ok) await deleteEntry(entry.id);
    } catch (err) {
      console.error('[SW] Error sincronizando', err);
      return; // si falla, reintenta en el siguiente sync
    }
  }
}

// --- Notificaciones Push ---
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'Notificación';
  const options = {
    body: data.body || 'Tienes una nueva notificación',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
