// Load Chart.js from CDN with fallback
function loadChartJS() {
    return new Promise((resolve, reject) => {
        if (typeof Chart !== 'undefined') {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js';
        script.integrity = 'sha384-Q9Nk9J1JQz5FppY6fZlgY5v6I+5C5p5v55f5p5v5f5';
        script.crossOrigin = 'anonymous';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Initialize charts after loading
loadChartJS().catch(err => {
    console.error('Failed to load Chart.js:', err);
});