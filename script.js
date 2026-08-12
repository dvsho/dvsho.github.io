const coverWrapper = document.querySelector('.cover-wrapper');
coverWrapper.style.borderColor = '#F0F0E0';
let ticking = false;
let lastBorderWidth = -1;

window.addEventListener('scroll', () => {
    if (document.body.classList.contains('popup-active')) return;
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrollTop = window.scrollY;
            const maxBorderWidth = 20;
            const borderWidth = Math.min(scrollTop, maxBorderWidth);
            if (borderWidth !== lastBorderWidth) {
                coverWrapper.style.borderWidth = `${borderWidth}px`;
                lastBorderWidth = borderWidth;
            }
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

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
        closeMobilePopup();
    });

    function closeMobilePopup() {
        if (mobilePopup.style.display !== 'none') {
            mobilePopup.classList.add('slide-out');
            setTimeout(() => {
                mobilePopup.style.display = 'none';
                mobilePopup.classList.remove('slide-out');
            }, 300);
        }
    }

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
                imgElement.onload = () => {
                    imgElement.classList.add('loaded');
                    imageDiv.classList.add('loaded');
                };
                imageDiv.prepend(imgElement);
                observer.unobserve(imageDiv);
            }
        });
    }, {
        rootMargin: '200px 0px',
        threshold: 0.1
    });

    const allImages = Array.from(document.querySelectorAll('.image'));
    const eagerImages = allImages.slice(0, 10);
    const lazyImages = allImages.slice(10);

    eagerImages.forEach(imageDiv => {
        const imgElement = document.createElement('img');
        imgElement.src = imageDiv.getAttribute('data-src');
        imgElement.alt = imageDiv.getAttribute('data-alt');
        imgElement.onload = () => {
            imgElement.classList.add('loaded');
            imageDiv.classList.add('loaded');
        };
        imageDiv.prepend(imgElement);
    });

    lazyImages.forEach(imageDiv => {
        imageObserver.observe(imageDiv);
    });

    const popup = document.createElement('div');
    popup.classList.add('popup');
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(popup);
    document.body.appendChild(overlay);
    let currentImageIndex = -1;

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
            if (!document.body.classList.contains('popup-active')) {
                scrollPosition = window.pageYOffset;
                document.body.style.top = `-${scrollPosition}px`;
                document.body.classList.add('popup-active');
            }
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
            overlay.offsetHeight;
            overlay.classList.add('show');
            currentImageIndex = index;
            popup.querySelector('.close-btn').addEventListener('click', closePopup);
            popup.querySelector('.prev-btn').addEventListener('click', () => showImage(currentImageIndex - 1));
            popup.querySelector('.next-btn').addEventListener('click', () => showImage(currentImageIndex + 1));
        };
    }

    document.body.addEventListener('click', function(e) {
        const imageDiv = e.target.closest('.image');
        if (imageDiv) {
            const index = allImages.indexOf(imageDiv);
            if (index !== -1) {
                showImage(index);
                if (window.innerWidth <= 600) {
                    closeMobilePopup();
                }
            }
        }
    });

    function closePopup() {
        popup.style.display = 'none';
        overlay.classList.remove('show');
        setTimeout(() => {
            if (overlay.classList.contains('show')) return;
            overlay.style.display = 'none';
        }, 400);
        currentImageIndex = -1;
        if (document.body.classList.contains('popup-active')) {
            document.body.classList.remove('popup-active');
            document.body.style.top = '';
            window.scrollTo(0, scrollPosition);
        }
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

    overlay.addEventListener('click', () => {
        if (popup.style.display === 'block') {
            closePopup();
        }
        if (essayPopup.style.display === 'block') {
            closeEssayPopup();
        }
        if (faqPopup && faqPopup.classList.contains('show')) {
            closeFaqPopup();
        }
    });

    document.querySelector('.back-to-top').addEventListener('click', function(e) {
        e.preventDefault();
        const button = this;
        button.classList.add('bob-up');
        button.addEventListener('animationend', function() {
            button.classList.remove('bob-up');
        });
        const isMobile = window.innerWidth <= 600;
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
        }, isMobile ? 1000 : 600);
    });

    const essayPopup = document.querySelector('.essay-popup');
    const essayCloseBtn = document.querySelector('.essay-close-btn');
    const essayText = document.querySelector('.essay-text');
    
    async function loadEssayContent() {
        try {
            const response = await fetch('assets/essay.txt');
            const content = await response.text();
            essayText.textContent = content;
        } catch (error) {
            console.error('Error loading essay content:', error);
            essayText.textContent = 'Sorry, the essay content could not be loaded at this time.';
        }
    }
    
    function showEssayPopup() {
        loadEssayContent();
        closeMobilePopup();
        scrollPosition = window.pageYOffset;
        document.body.style.top = `-${scrollPosition}px`;
        document.body.classList.add('popup-active');
        essayPopup.style.display = 'block';
        overlay.style.display = 'block';
        overlay.offsetHeight;
        overlay.classList.add('show');
        setTimeout(() => {
            essayPopup.classList.add('show');
        }, 10);
    }
    
    function closeEssayPopup() {
        essayPopup.classList.remove('show');
        overlay.classList.remove('show');
        setTimeout(() => {
            essayPopup.style.display = 'none';
            if (!faqPopup || !faqPopup.classList.contains('show')) {
                if (!overlay.classList.contains('show')) {
                    overlay.style.display = 'none';
                }
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

    const faqPopup = document.querySelector('.faq-popup');
    const faqCloseBtn = document.querySelector('.faq-close-btn');
    const faqText = document.querySelector('.faq-text');
    const faqBtn = document.querySelector('.faq-btn');

    async function loadFaqContent() {
        try {
            const response = await fetch('assets/faq.txt');
            const content = await response.text();
            
            const lines = content.split('\n');
            let formattedContent = '';
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line === '') {
                    formattedContent += '\n';
                    continue;
                }
                
                if (line.endsWith('?')) {
                    formattedContent += `<span class="faq-question">${line}</span>`;
                } else {
                    formattedContent += line + '\n';
                }
            }
            
            faqText.innerHTML = formattedContent;
        } catch (error) {
            console.error('Error loading FAQ content:', error);
            faqText.textContent = 'Sorry, the FAQ content could not be loaded at this time.';
        }
    }

    function showFaqPopup() {
        loadFaqContent();
        closeMobilePopup();
        
        scrollPosition = window.pageYOffset;
        document.body.style.top = `-${scrollPosition}px`;
        document.body.classList.add('popup-active');
        
        const rect = faqBtn.getBoundingClientRect();
        
        faqPopup.style.display = 'block';
        faqPopup.style.transition = 'none';
        faqPopup.style.top = `${rect.top}px`;
        faqPopup.style.left = `${rect.left}px`;
        faqPopup.style.width = `${rect.width}px`;
        faqPopup.style.height = `${rect.height}px`;
        faqPopup.style.transform = 'none';
        faqPopup.style.opacity = '1';
        faqPopup.style.borderRadius = '10px';
        faqPopup.style.border = '2px solid #101830';
        faqPopup.style.padding = '6px 18px';
        faqPopup.style.background = 'transparent';
        
        faqBtn.style.transition = 'none';
        faqBtn.style.opacity = '0';
        overlay.style.display = 'block';
        overlay.offsetHeight;
        overlay.classList.add('show');
        
        faqPopup.offsetHeight;
        
        faqPopup.style.transition = '';
        faqPopup.style.top = '';
        faqPopup.style.left = '';
        faqPopup.style.width = '';
        faqPopup.style.height = '';
        faqPopup.style.transform = '';
        faqPopup.style.borderRadius = '';
        faqPopup.style.border = '';
        faqPopup.style.padding = '';
        faqPopup.style.background = '';
        
        setTimeout(() => {
            faqPopup.classList.add('show');
        }, 10);
    }

    function closeFaqPopup() {
        faqPopup.classList.remove('show');
        overlay.classList.remove('show');
        
        const rect = faqBtn.getBoundingClientRect();
        
        faqPopup.style.transition = 'all 0.6s cubic-bezier(0.19, 1, 0.22, 1)';
        faqPopup.style.top = `${rect.top}px`;
        faqPopup.style.left = `${rect.left}px`;
        faqPopup.style.width = `${rect.width}px`;
        faqPopup.style.height = `${rect.height}px`;
        faqPopup.style.transform = 'none';
        faqPopup.style.borderRadius = '10px';
        faqPopup.style.opacity = '1';
        faqPopup.style.padding = '6px 18px';
        faqPopup.style.border = '2px solid #101830';
        faqPopup.style.background = 'transparent';

        setTimeout(() => {
            faqPopup.style.display = 'none';
            faqPopup.style.top = '';
            faqPopup.style.left = '';
            faqPopup.style.width = '';
            faqPopup.style.height = '';
            faqPopup.style.transform = '';
            faqPopup.style.borderRadius = '';
            faqPopup.style.opacity = '';
            faqPopup.style.transition = '';
            faqPopup.style.padding = '';
            faqPopup.style.border = '';
            faqPopup.style.background = '';
            
            faqBtn.style.transition = 'none';
            faqBtn.style.opacity = '1';
            faqBtn.style.color = 'transparent';
            
            faqBtn.offsetHeight;
            
            faqBtn.style.transition = '';
            faqBtn.style.color = '';
            
            if (!essayPopup.classList.contains('show') &&
                (!popup || popup.style.display !== 'block')) {
                if (!overlay.classList.contains('show')) {
                    overlay.style.display = 'none';
                }
                document.body.classList.remove('popup-active');
                document.body.style.top = '';
                window.scrollTo(0, scrollPosition);
            }
        }, 600);
    }

    if (faqBtn) {
        faqBtn.addEventListener('click', showFaqPopup);
    }
    if (faqCloseBtn) {
        faqCloseBtn.addEventListener('click', closeFaqPopup);
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && faqPopup.classList.contains('show')) {
            closeFaqPopup();
        }
    });
});
