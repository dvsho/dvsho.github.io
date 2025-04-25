const coverWrapper = document.querySelector('.cover-wrapper');
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const maxBorderWidth = 20;
    const borderWidth = Math.min(scrollTop, maxBorderWidth);

    coverWrapper.style.borderWidth = `${borderWidth}px`;
    coverWrapper.style.borderColor = '#F0F0E0';
});

document.addEventListener('DOMContentLoaded', function () {
    const coverImage = document.querySelector('.cover-image img');
    if (coverImage) {
        const coverImg = new Image();
        coverImg.src = coverImage.src;
        coverImg.onload = () => {
            coverImage.style.opacity = '1';
        };
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const imageDiv = entry.target;
                const imgElement = document.createElement('img');
                imgElement.src = imageDiv.getAttribute('data-src');
                imgElement.alt = imageDiv.getAttribute('data-alt');
                imgElement.style.opacity = '0';
                imgElement.style.transition = 'opacity 0.3s ease-in-out';
                imgElement.onload = () => {
                    imgElement.style.opacity = '1';
                    imgElement.classList.add('loaded');
                    imageDiv.classList.add('loaded');
                };
                imageDiv.prepend(imgElement);
                imageDiv.classList.remove('image');
                observer.unobserve(imageDiv);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    document.querySelectorAll('.image').forEach(imageDiv => {
        imageObserver.observe(imageDiv);
    });

    const popup = document.createElement('div');
    popup.classList.add('popup');
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(popup);
    document.body.appendChild(overlay);

    let currentImageIndex = -1;
    const allImages = Array.from(document.querySelectorAll('.image'));

    function showImage(index) {
        if (index < 0) index = allImages.length - 1;
        if (index >= allImages.length) index = 0;
        
        const imageDiv = allImages[index];
        const imgSrc = imageDiv.getAttribute('data-src');
        const captionText = imageDiv.querySelector('.caption').innerHTML;
        const popupImg = new Image();
        popupImg.src = imgSrc;
        popupImg.alt = "Popup Image";
        popupImg.onload = () => {
            popup.innerHTML = `
                <span class="nav-btn prev-btn">‹</span>
                <img src="${imgSrc}" alt="Popup Image">
                <div class="caption-section">${captionText}</div>
                <span class="close-btn">×</span>
                <span class="nav-btn next-btn">›</span>
            `;
            popup.style.display = 'block';
            overlay.style.display = 'block';
            currentImageIndex = index;

            document.querySelector('.close-btn').addEventListener('click', closePopup);
            document.querySelector('.prev-btn').addEventListener('click', () => showImage(currentImageIndex - 1));
            document.querySelector('.next-btn').addEventListener('click', () => showImage(currentImageIndex + 1));
        };
    }

    document.querySelectorAll('.image').forEach((imageDiv, index) => {
        imageDiv.addEventListener('click', function () {
            showImage(index);
        });
    });

    function closePopup() {
        popup.style.display = 'none';
        overlay.style.display = 'none';
        currentImageIndex = -1;
    }

    overlay.addEventListener('click', closePopup);
    document.addEventListener('keydown', function(e) {
        const popup = document.querySelector('.popup');
        if (popup && popup.style.display === 'block') {
            if (e.key === 'Escape') {
                closePopup();
            } else if (e.key === 'ArrowLeft') {
                showImage(currentImageIndex - 1);
            } else if (e.key === 'ArrowRight') {
                showImage(currentImageIndex + 1);
            }
        }
    });
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
        } else if (linkElement.textContent.includes('Common App')) {
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

document.querySelector('.back-to-top').addEventListener('click', function(e) {
    e.preventDefault();
    const button = this;
    button.classList.add('bob-up');

    button.addEventListener('animationend', function() {
        button.classList.remove('bob-up');
    });

    setTimeout(() => {
        const duration = 1000;
        const start = window.scrollY;
        const startTime = performance.now();

        function scroll(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            window.scrollTo(0, start * (1 - easeOut));
            if (progress < 1) {
                requestAnimationFrame(scroll);
            }
        }

        requestAnimationFrame(scroll);
    }, 600);
});
