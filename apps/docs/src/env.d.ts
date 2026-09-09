/*
 * The PWA plugin serves its data through virtual modules, which exist only
 * once Vite is running. These references are what tells the type checker they
 * are real, and what they hold.
 */
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/pwa-assets" />
/// <reference types="vite-plugin-pwa/client" />
