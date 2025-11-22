const coverWrapper = document.querySelector('.cover-wrapper');
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const maxBorderWidth = 20;
    const borderWidth = Math.min(scrollTop, maxBorderWidth);

    coverWrapper.style.borderWidth = `${borderWidth}px`;
    coverWrapper.style.borderColor = '#F0F0E0';
});

document.addEventListener('DOMContentLoaded', function () {
    const mobilePopup = document.querySelector('.mobile-popup');
    const dismissBtn = document.querySelector('.mobile-popup .dismiss-btn');
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && window.innerWidth <= 600) {
                mobilePopup.style.display = 'block';
                mobilePopup.offsetHeight;
                mobilePopup.classList.add('slide-in');
                galleryObserver.disconnect();
            }
        });
    }, {
        threshold: 0.1
    });

    const firstGallery = document.querySelector('.gallery25');
    if (firstGallery) {
        galleryObserver.observe(firstGallery);
    }

    dismissBtn.addEventListener('click', () => {
        mobilePopup.classList.add('slide-out');
        setTimeout(() => {
            mobilePopup.style.display = 'none';
            mobilePopup.classList.remove('slide-out');
        }, 300);
    });

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
                <span class="nav-btn prev-btn">←</span>
                <img src="${imgSrc}" alt="Popup Image">
                <div class="caption-section">${captionText}</div>
                <span class="close-btn">×</span>
                <span class="nav-btn next-btn">→</span>
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
            if (window.innerWidth <= 600) {
                mobilePopup.classList.add('slide-out');
                setTimeout(() => {
                    mobilePopup.style.display = 'none';
                    mobilePopup.classList.remove('slide-out');
                }, 300);
            }
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

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const contactPopup = document.querySelector('.contact-popup');
    const overlay = document.querySelector('.overlay');
    const contactLink = document.querySelector('.contact-link');
    const dismissBtn = contactPopup.querySelector('.dismiss-btn');
    const emailIcons = contactPopup.querySelectorAll('.email-icon');
    const phoneIcon = contactPopup.querySelector('.phone-icon');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.classList.contains('contact-link')) {
                this.classList.add('bob-up');
                setTimeout(() => {
                    this.classList.add('animate-symbol');
                    setTimeout(() => {
                        contactPopup.style.display = 'block';
                        overlay.style.display = 'block';
                        setTimeout(() => {
                            contactPopup.classList.add('show');
                        }, 10);
                        setTimeout(() => {
                            this.classList.remove('bob-up', 'animate-symbol');
                        }, 300);
                    }, 450);
                }, 300);
            } else {
                this.classList.add('bob-right');
                setTimeout(() => {
                    this.classList.add('animate-symbol');
                    setTimeout(() => {
                        window.open(this.href, '_blank');
                        setTimeout(() => {
                            this.classList.remove('bob-right', 'animate-symbol');
                        }, 300);
                    }, 450);
                }, 300);
            }
        });
    });

    emailIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const emailLink = this.nextElementSibling;
            this.classList.add('animate-symbol');
            setTimeout(() => {
                window.location.href = emailLink.href;
                setTimeout(() => {
                    this.classList.remove('animate-symbol');
                }, 300);
            }, 450);
        });
    });

    if (phoneIcon) {
        phoneIcon.addEventListener('click', function() {
            this.classList.add('animate-symbol');
            setTimeout(() => {
                window.location.href = 'sms:+16306059689';
                setTimeout(() => {
                    this.classList.remove('animate-symbol');
                }, 300);
            }, 450);
        });
    }

    function closeContactPopup() {
        contactPopup.classList.remove('show');
        setTimeout(() => {
            contactPopup.style.display = 'none';
            overlay.style.display = 'none';
        }, 300);
    }

    dismissBtn.addEventListener('click', closeContactPopup);
    overlay.addEventListener('click', closeContactPopup);
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

document.addEventListener('DOMContentLoaded', function() {
    const essayPopup = document.querySelector('.essay-popup');
    const essayCloseBtn = document.querySelector('.essay-close-btn');
    const essayText = document.querySelector('.essay-text');
    const overlay = document.querySelector('.overlay');
    async function loadEssayContent() {
        try {
            const response = await fetch('essay.txt');
            const content = await response.text();
            essayText.textContent = content;
        } catch (error) {
            console.error('Error loading essay content:', error);
            essayText.textContent = 'Sorry, the essay content could not be loaded at this time.';
        }
    }
    
    let scrollPosition = 0;
    function showEssayPopup() {
        loadEssayContent();
        scrollPosition = window.pageYOffset;
        document.body.style.top = `-${scrollPosition}px`;
        document.body.classList.add('popup-active');
        essayPopup.style.display = 'block';
        overlay.style.display = 'block';
        setTimeout(() => {
            essayPopup.classList.add('show');
        }, 10);
    }
    
    function closeEssayPopup() {
        essayPopup.classList.remove('show');
        setTimeout(() => {
            essayPopup.style.display = 'none';
            overlay.style.display = 'none';
            document.body.classList.remove('popup-active');
            document.body.style.top = '';
            window.scrollTo(0, scrollPosition);
        }, 300);
    }
    
    essayCloseBtn.addEventListener('click', closeEssayPopup);
    overlay.addEventListener('click', function(e) {
        if (essayPopup.style.display === 'block') {
            closeEssayPopup();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && essayPopup.classList.contains('show')) {
            closeEssayPopup();
        }
    });
    
    window.showEssayPopup = showEssayPopup;
});
