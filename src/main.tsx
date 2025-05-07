
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { register as registerServiceWorker, isAppInstalled } from './serviceWorkerRegistration';

// Set a flag if the app is launched from installed PWA
if (isAppInstalled()) {
  document.documentElement.classList.add('pwa-installed');
}

// Initialize the app
createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for PWA support
registerServiceWorker();

// Log PWA status to help debugging
console.log("PWA Status:", {
  serviceWorkerSupported: 'serviceWorker' in navigator,
  isStandalone: window.matchMedia('(display-mode: standalone)').matches,
  isIOS: /iPhone|iPad|iPod/.test(navigator.userAgent)
});
