const coverWrapper = document.querySelector('.cover-wrapper');
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const maxBorderWidth = 20;
    const borderWidth = Math.min(scrollTop, maxBorderWidth);

    coverWrapper.style.borderWidth = `${borderWidth}px`;
    coverWrapper.style.borderColor = '#F0F0E0';
});

document.addEventListener('DOMContentLoaded', function () {
    let scrollPosition = 0;
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
                <div class="popup-card">
                    <img src="${imgSrc}" alt="Popup Image">
                    <div class="caption-section">${captionText}</div>
                </div>
                <div class="popup-controls">
                    <div class="control-btn prev-btn">←</div>
                    <div class="control-btn close-btn">×</div>
                    <div class="control-btn next-btn">→</div>
                </div>
            `;
            popup.style.display = 'block';
            overlay.style.display = 'block';
            currentImageIndex = index;

            popup.querySelector('.close-btn').addEventListener('click', closePopup);
            popup.querySelector('.prev-btn').addEventListener('click', () => showImage(currentImageIndex - 1));
            popup.querySelector('.next-btn').addEventListener('click', () => showImage(currentImageIndex + 1));
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

    const logo = document.querySelector('.logo');
    let currentRotation = 0;
    let logoClickCount = 0;
    let easterEggFound = false;

    logo.addEventListener('click', function() {
        const randomRotation = 30 + Math.random() * 300;
        currentRotation += randomRotation;
        logo.style.setProperty('--current-rotation', `${currentRotation - randomRotation}deg`);
        logo.style.setProperty('--target-rotation', `${currentRotation}deg`);
        logo.classList.add('spin');
        logo.addEventListener('animationend', function() {
            logo.classList.remove('spin');
            logo.style.transform = `rotate(${currentRotation}deg)`;
        }, { once: true });

        if (!easterEggFound) {
            logoClickCount++;
            if (logoClickCount === 5) {
                showEasterEggPopup();
                easterEggFound = true;
            }
        }
    });

    const navLinks = document.querySelectorAll('.nav-links a');
    const contactPopup = document.querySelector('.contact-popup:not(.easter-egg-popup)');
    const easterEggPopup = document.querySelector('.easter-egg-popup');
    const contactLink = document.querySelector('.contact-link');
    const contactDismissBtn = contactPopup.querySelector('.dismiss-btn');
    const easterEggDismissBtn = easterEggPopup.querySelector('.dismiss-btn');
    const emailIcons = contactPopup.querySelectorAll('.email-icon');
    const socialIcons = contactPopup.querySelectorAll('.social-icon');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.classList.contains('contact-link')) {
                this.classList.add('bob-up');
                setTimeout(() => {
                    if (easterEggPopup.classList.contains('show')) {
                        easterEggPopup.classList.remove('show');
                        setTimeout(() => {
                            easterEggPopup.style.display = 'none';
                        }, 300);
                        contactPopup.dataset.triggeringPopup = 'easterEgg';
                    }

                    if (!document.body.classList.contains('popup-active')) {
                        scrollPosition = window.pageYOffset;
                        document.body.style.top = `-${scrollPosition}px`;
                        document.body.classList.add('popup-active');
                    }
                    contactPopup.style.display = 'block';
                    overlay.style.display = 'block';
                    setTimeout(() => {
                        contactPopup.classList.add('show');
                    }, 10);
                    setTimeout(() => {
                        this.classList.remove('bob-up');
                    }, 300);
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

    socialIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const socialLink = this.nextElementSibling;
            this.classList.add('animate-symbol');
            setTimeout(() => {
                window.open(socialLink.href, '_blank');
                setTimeout(() => {
                    this.classList.remove('animate-symbol');
                }, 300);
            }, 450);
        });
    });

    function closeContactPopup() {
        contactPopup.classList.remove('show');
        setTimeout(() => {
            contactPopup.style.display = 'none';

            if (contactPopup.dataset.triggeringPopup === 'easterEgg') {
                delete contactPopup.dataset.triggeringPopup;
                easterEggPopup.style.display = 'block';
                setTimeout(() => {
                    easterEggPopup.classList.add('show');
                }, 10);
                return;
            }

            if (!easterEggPopup.classList.contains('show')) {
                overlay.style.display = 'none';
                if (document.body.classList.contains('popup-active') && !essayPopup.classList.contains('show')) {
                    document.body.classList.remove('popup-active');
                    document.body.style.top = '';
                    window.scrollTo(0, scrollPosition);
                }
            }
        }, 300);
    }

    contactDismissBtn.addEventListener('click', closeContactPopup);
    easterEggDismissBtn.addEventListener('click', closeEasterEggPopup);

    overlay.addEventListener('click', () => {
        if (popup.style.display === 'block') {
            closePopup();
        }
        if (contactPopup.classList.contains('show')) {
            closeContactPopup();
        }
        if (easterEggPopup.classList.contains('show')) {
            closeEasterEggPopup();
        }
        if (essayPopup.style.display === 'block') {
            closeEssayPopup();
        }
    });

    function showEasterEggPopup() {
        confetti({
            particleCount: 150,
            spread: 180,
            origin: { y: 0.6 }
        });

        if (contactPopup.classList.contains('show')) {
            contactPopup.classList.remove('show');
            setTimeout(() => {
                contactPopup.style.display = 'none';
            }, 300);
            easterEggPopup.dataset.triggeringPopup = 'contact';
        }

        if (!document.body.classList.contains('popup-active')) {
            scrollPosition = window.pageYOffset;
            document.body.style.top = `-${scrollPosition}px`;
            document.body.classList.add('popup-active');
        }
        easterEggPopup.style.display = 'block';
        overlay.style.display = 'block';
        setTimeout(() => {
            easterEggPopup.classList.add('show');
        }, 10);
    }

    function closeEasterEggPopup() {
        easterEggPopup.classList.remove('show');
        setTimeout(() => {
            easterEggPopup.style.display = 'none';

            let restoring = false;
            if (easterEggPopup.dataset.triggeringPopup === 'contact') {
                delete easterEggPopup.dataset.triggeringPopup;
                contactPopup.style.display = 'block';
                setTimeout(() => {
                    contactPopup.classList.add('show');
                }, 10);
                restoring = true;
            }

            if (!restoring && !contactPopup.classList.contains('show')) {
                overlay.style.display = 'none';
                if (document.body.classList.contains('popup-active') && !essayPopup.classList.contains('show')) {
                    document.body.classList.remove('popup-active');
                    document.body.style.top = '';
                    window.scrollTo(0, scrollPosition);
                }
            }

            const bonusRotation = 555;
            logo.style.setProperty('--current-rotation', `${currentRotation}deg`);
            currentRotation += bonusRotation;
            logo.style.setProperty('--target-rotation', `${currentRotation}deg`);
            logo.classList.add('spin');
            logo.addEventListener('animationend', function() {
                logo.classList.remove('spin');
                logo.style.transform = `rotate(${currentRotation}deg)`;
            }, { once: true });
        }, 300);
    }

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

    const essayPopup = document.querySelector('.essay-popup');
    const essayCloseBtn = document.querySelector('.essay-close-btn');
    const essayText = document.querySelector('.essay-text');
    
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
            if (!contactPopup.classList.contains('show') && !easterEggPopup.classList.contains('show')) {
                overlay.style.display = 'none';
                document.body.classList.remove('popup-active');
                document.body.style.top = '';
                window.scrollTo(0, scrollPosition);
            }
        }, 300);
    }
    
    essayCloseBtn.addEventListener('click', closeEssayPopup);
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && essayPopup.classList.contains('show')) {
            closeEssayPopup();
        }
    });
    
    window.showEssayPopup = showEssayPopup;
});
