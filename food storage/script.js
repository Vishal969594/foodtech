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

// Simulate real-time data updates for metrics
function updateMetrics() {
    const totalOnions = document.getElementById('totalOnions');
    const temperature = document.getElementById('temperature');
    const humidity = document.getElementById('humidity');
    const shelfLife = document.getElementById('shelfLife');

    // Simulate small fluctuations in data
    const baseOnions = 24450;
    const baseTemp = 4.2;
    const baseHumidity = 65;
    const baseShelfLife = 72;

    totalOnions.textContent = (baseOnions + Math.floor(Math.random() * 100 - 50)).toLocaleString();
    temperature.textContent = (baseTemp + Math.random() * 0.5 - 0.25).toFixed(1) + '°C';
    humidity.textContent = Math.floor(baseHumidity + Math.random() * 10 - 5) + '%';
    shelfLife.textContent = Math.floor(baseShelfLife + Math.random() * 6 - 3) + ' Days';
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
    
    updateMetrics();
    setInterval(updateMetrics, 5000);
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