const coverWrapper = document.querySelector('.cover-wrapper');
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const maxBorderWidth = 20;
    const borderWidth = Math.min(scrollTop, maxBorderWidth);

    coverWrapper.style.borderWidth = `${borderWidth}px`;
    coverWrapper.style.borderColor = '#F0F0E0';
});

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(loadRemainingImages, 1500);
    function loadRemainingImages() {
        const imageImages = document.querySelectorAll('.image');
        imageImages.forEach(imageDiv => {
            const imgElement = document.createElement('img');
            imgElement.src = imageDiv.getAttribute('data-src');
            imgElement.alt = imageDiv.getAttribute('data-alt');
            imageDiv.prepend(imgElement);
            imageDiv.classList.remove('image');
        });
    }
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const linkElement = this;
        linkElement.classList.add('bob');
        setTimeout(() => {
            const targetUrl = linkElement.href;
            window.location.href = targetUrl;
            linkElement.classList.remove('bob');
        }, 600);
    });
});