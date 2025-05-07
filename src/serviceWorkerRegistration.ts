
// This variable will track whether we've shown the install prompt
let deferredPrompt: any;

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/service-worker.js';
      
      navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Error during service worker registration:', error);
        });
    });

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event for later use
      deferredPrompt = e;
      
      // Optionally, show your own install button or UI
      // This could trigger showing a custom install button in your UI
      const installEvent = new CustomEvent('canInstall', { detail: true });
      window.dispatchEvent(installEvent);
    });
  }
}

// Function to show the install prompt
export function showInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) {
    return Promise.resolve(false);
  }

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  return deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
      // Clear the deferredPrompt variable since it can't be used again
      deferredPrompt = null;
      return true;
    } else {
      console.log('User dismissed the install prompt');
      return false;
    }
  });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}

// Function to check if the app is installed
export function isAppInstalled(): boolean {
  // Check if the app is in standalone mode or display-mode is standalone
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true || // For iOS
    window.location.href.includes('?homescreen=1')
  );
}
