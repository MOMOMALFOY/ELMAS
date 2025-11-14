(() => {
    const initGallery = (gallery) => {
        const track = gallery.querySelector('.product-gallery__track');
        const slides = Array.from(gallery.querySelectorAll('.product-gallery__slide'));
        if (!track || slides.length === 0) {
            return;
        }

        const thumbs = Array.from(gallery.querySelectorAll('.product-gallery__thumb'));
        const prev = gallery.querySelector('.product-gallery__nav--prev');
        const next = gallery.querySelector('.product-gallery__nav--next');
        const viewport = gallery.querySelector('.product-gallery__viewport');
        const label = gallery.dataset.galleryLabel || 'Galerie produit';

        let currentIndex = 0;
        let pointerStartX = 0;
        let pointerActive = false;

        const totalSlides = slides.length;
        const hasMultipleSlides = totalSlides > 1;

        const update = () => {
            track.style.setProperty('--product-gallery-index', String(currentIndex));

            slides.forEach((slide, index) => {
                const isActive = index === currentIndex;
                slide.classList.toggle('is-active', isActive);
                slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            });

            thumbs.forEach((thumb, index) => {
                const isActive = index === currentIndex;
                thumb.classList.toggle('is-active', isActive);
                thumb.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });

            if (prev) {
                prev.disabled = !hasMultipleSlides;
            }

            if (next) {
                next.disabled = !hasMultipleSlides;
            }

            if (!hasMultipleSlides) {
                gallery.classList.add('product-gallery--single');
            } else {
                gallery.classList.remove('product-gallery--single');
            }
        };

        const goToSlide = (index) => {
            if (!hasMultipleSlides) {
                update();
                return;
            }

            currentIndex = (index + totalSlides) % totalSlides;
            update();
        };

        const handlePrev = () => goToSlide(currentIndex - 1);
        const handleNext = () => goToSlide(currentIndex + 1);

        const handleThumbClick = (event) => {
            const button = event.currentTarget;
            const slideIndex = Number.parseInt(button.dataset.slide || '', 10);
            if (!Number.isNaN(slideIndex)) {
                goToSlide(slideIndex);
            }
        };

        const pointerDown = (event) => {
            if (!hasMultipleSlides) {
                return;
            }

            pointerActive = true;
            pointerStartX = (event.touches?.[0]?.clientX ?? event.clientX) || 0;
        };

        const pointerUp = (event) => {
            if (!pointerActive) {
                return;
            }

            const pointerEndX = (event.changedTouches?.[0]?.clientX ?? event.clientX) || 0;
            const deltaX = pointerEndX - pointerStartX;

            if (Math.abs(deltaX) > 40) {
                if (deltaX < 0) {
                    handleNext();
                } else {
                    handlePrev();
                }
            }

            pointerActive = false;
        };

        const pointerCancel = () => {
            pointerActive = false;
        };

        const handleKeyDown = (event) => {
            if (!hasMultipleSlides) {
                return;
            }

            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                handlePrev();
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                handleNext();
            }
        };

        if (prev && hasMultipleSlides) {
            prev.addEventListener('click', handlePrev);
        }

        if (next && hasMultipleSlides) {
            next.addEventListener('click', handleNext);
        }

        thumbs.forEach((thumb) => {
            thumb.addEventListener('click', handleThumbClick);
        });

        if (viewport) {
            viewport.addEventListener('pointerdown', pointerDown);
            viewport.addEventListener('pointerup', pointerUp);
            viewport.addEventListener('pointercancel', pointerCancel);
            viewport.addEventListener('touchstart', pointerDown, { passive: true });
            viewport.addEventListener('touchend', pointerUp);
        }

        if (hasMultipleSlides) {
            gallery.setAttribute('tabindex', '0');
            gallery.addEventListener('keydown', handleKeyDown);
        } else {
            gallery.removeAttribute('tabindex');
        }

        gallery.setAttribute('role', 'group');
        gallery.setAttribute('aria-label', label);

        update();
    };

    const onReady = () => {
        document.querySelectorAll('.js-product-gallery').forEach(initGallery);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onReady, { once: true });
    } else {
        onReady();
    }
})();

