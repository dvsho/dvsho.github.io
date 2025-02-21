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

    const popup = document.createElement('div');
    popup.classList.add('popup');
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(popup);
    document.body.appendChild(overlay);

    document.querySelectorAll('.image').forEach(imageDiv => {
        imageDiv.addEventListener('click', function () {
            const imgSrc = imageDiv.getAttribute('data-src');
            const captionText = imageDiv.querySelector('.caption').innerHTML;
            popup.innerHTML = `
                <img src="${imgSrc}" alt="Popup Image">
                <div class="caption-section">${captionText}</div>
                <span class="close-btn">×</span>
            `;

            popup.style.display = 'block';
            overlay.style.display = 'block';
            document.querySelector('.close-btn').addEventListener('click', closePopup);
        });
    });

    function closePopup() {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    }

    overlay.addEventListener('click', closePopup);
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
