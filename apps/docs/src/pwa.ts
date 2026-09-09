import { registerSW } from "virtual:pwa-register"

/*
 * The service worker takes over as soon as it is ready, and a new build
 * replaces the old one without asking. This is documentation, not an editor
 * with unsaved work: there is nothing for a reload prompt to protect, and a
 * reader holding a stale page after a release is the worse outcome.
 */
registerSW({ immediate: true })
