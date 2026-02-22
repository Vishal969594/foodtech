// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:4000' 
    : 'https://oniontech-api.onrender.com';

// Update time every second
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    
    const headerInfo = document.querySelector('.header-info');
    const spans = headerInfo.querySelectorAll('span');
    if (spans.length >= 2) {
        spans[1].textContent = timeString;
    }
}

// Fetch metrics from API
async function fetchMetrics() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/metrics`);
        if (!response.ok) throw new Error('Failed to fetch metrics');
        const data = await response.json();
        updateMetricsDisplay(data);
    } catch (error) {
        console.error('Error fetching metrics:', error);
        // Fallback to local simulation if API fails
        simulateMetrics();
    }
}

// Update metrics display with API data
function updateMetricsDisplay(data) {
    const totalOnions = document.getElementById('totalOnions');
    const temperature = document.getElementById('temperature');
    const humidity = document.getElementById('humidity');
    const shelfLife = document.getElementById('shelfLife');

    if (totalOnions) totalOnions.textContent = data.totalOnions.toLocaleString();
    if (temperature) temperature.textContent = data.temperatureC.toFixed(1) + '°C';
    if (humidity) humidity.textContent = data.humidityPct + '%';
    if (shelfLife) shelfLife.textContent = data.shelfLifeDays + ' Days';
}

// Simulate metrics (fallback when API is unavailable)
function simulateMetrics() {
    const totalOnions = document.getElementById('totalOnions');
    const temperature = document.getElementById('temperature');
    const humidity = document.getElementById('humidity');
    const shelfLife = document.getElementById('shelfLife');

    const baseOnions = 24450;
    const baseTemp = 4.2;
    const baseHumidity = 65;
    const baseShelfLife = 72;

    if (totalOnions) totalOnions.textContent = (baseOnions + Math.floor(Math.random() * 100 - 50)).toLocaleString();
    if (temperature) temperature.textContent = (baseTemp + Math.random() * 0.5 - 0.25).toFixed(1) + '°C';
    if (humidity) humidity.textContent = Math.floor(baseHumidity + Math.random() * 10 - 5) + '%';
    if (shelfLife) shelfLife.textContent = Math.floor(baseShelfLife + Math.random() * 6 - 3) + ' Days';
}

// Fetch locations from API
async function fetchLocations() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/locations`);
        if (!response.ok) throw new Error('Failed to fetch locations');
        const data = await response.json();
        updateLocationsDisplay(data);
    } catch (error) {
        console.error('Error fetching locations:', error);
    }
}

// Update locations display
function updateLocationsDisplay(locations) {
    const container = document.querySelector('.storage-locations');
    if (!container) return;

    container.innerHTML = locations.map(loc => `
        <div class="location-item">
            <div class="location-info">
                <div class="status-dot status-${loc.status}"></div>
                <span>${loc.name}</span>
            </div>
            <span>${loc.temperatureC !== undefined ? loc.temperatureC + '°C' : loc.humidityPct + '%'}</span>
        </div>
    `).join('');
}

// Tab switching functionality
document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});

// Notification bell animation
document.querySelectorAll('.notification-bell').forEach(bell => {
    bell.addEventListener('click', function() {
        this.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            this.style.animation = '';
        }, 500);
    });
});

// Initialize everything on window load
window.addEventListener('load', function() {
    updateTime();
    setInterval(updateTime, 1000);
    
    // Fetch real data from API
    fetchMetrics();
    fetchLocations();
    
    // Update metrics every 5 seconds
    setInterval(fetchMetrics, 5000);
});

// Add scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
});

document.querySelectorAll('.metric-card, .chart-container, .performance-card').forEach(el => {
    observer.observe(el);
});