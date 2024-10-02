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

const logo = document.querySelector('.logo');
logo.addEventListener('click', function() {
    logo.classList.add('spin');
    logo.addEventListener('animationend', function() {
        logo.classList.remove('spin');
    });
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const linkElement = this;
        if (linkElement.textContent.includes('Email')) {
            linkElement.classList.add('bob-up');
        } else if (linkElement.textContent.includes('Resume')) {
            linkElement.classList.add('bob-down');
        } else {
            linkElement.classList.add('bob-right');
        }

        linkElement.addEventListener('animationend', function() {
            linkElement.classList.remove('bob-up', 'bob-down', 'bob-right');
        });

        setTimeout(() => {
            const targetUrl = linkElement.href;
            if (linkElement.textContent.includes('Email')) {
                window.location.href = targetUrl;
            } else {
                window.open(targetUrl, '_blank');
            }
        }, 600);
    });
});