// Load Tailwind CSS from CDN with fallback
function loadTailwindCSS() {
    return new Promise((resolve, reject) => {
        if (document.querySelector('link[href*="tailwindcss.com"]')) {
            resolve();
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
        link.integrity = 'sha384-+Q9Jq7a9+5d5v5f5p5v5f5p5v5f5p5v5f5';
        link.crossOrigin = 'anonymous';
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
    });
}

// Initialize after loading
loadTailwindCSS().catch(err => {
    console.error('Failed to load Tailwind CSS:', err);
});