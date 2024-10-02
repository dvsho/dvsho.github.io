// Select the cover wrapper
const coverWrapper = document.querySelector('.cover-wrapper');

// Listen for scroll events
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY; // Current vertical scroll position
    const maxBorderWidth = 20; // Maximum border width
    const borderWidth = Math.min(scrollTop, maxBorderWidth); // Calculate border width

    // Set the border width to the cover wrapper
    coverWrapper.style.borderWidth = `${borderWidth}px`;
    coverWrapper.style.borderColor = '#F0F0E0'; // Set border color
});