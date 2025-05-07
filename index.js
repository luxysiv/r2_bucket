import { handleRequest } from './src/handlers.js';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
