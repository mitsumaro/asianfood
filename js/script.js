document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.querySelector('.header__toggle');
    const nav = document.querySelector('.header__nav');

    if (toggleButton && nav) {
        toggleButton.addEventListener('click', () => {
            const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';

            // Toggle aria-expanded
            toggleButton.setAttribute('aria-expanded', !isExpanded);

            // Toggle menu visibility class
            nav.classList.toggle('is-active');
            toggleButton.classList.toggle('is-active');

            // Update aria-label based on state
            toggleButton.setAttribute('aria-label', isExpanded ? 'メニューを開く' : 'メニューを閉じる');
        });

        // Close menu when a link is clicked
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('is-active');
                toggleButton.classList.remove('is-active');
                toggleButton.setAttribute('aria-expanded', 'false');
                toggleButton.setAttribute('aria-label', 'メニューを開く');
            });
        });
    }
    // Hatbazaar Slider Logic
    const sliderContainer = document.querySelector('.hatbazaar__image-slider');
    if (sliderContainer) {
        const wrapper = sliderContainer.querySelector('.slider-wrapper');
        const slides = sliderContainer.querySelectorAll('.slider-slide');
        const prevBtn = sliderContainer.querySelector('.slider-prev');
        const nextBtn = sliderContainer.querySelector('.slider-next');
        const dotsContainer = sliderContainer.querySelector('.slider-dots');

        let currentIndex = 0;
        const totalSlides = slides.length;

        // Initialize ARIA and Dots
        slides.forEach((slide, index) => {
            // Create dot
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Slide ${index + 1}`);
            dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
            dot.setAttribute('aria-controls', `slide-${index}`);
            // Assign ID to slide for aria-controls
            slide.id = `slide-${index}`;
            // Hidden by default for accessibility focus flow if not active? 
            // Actually for carousel, usually only active slide is visible or all are reachable.
            // With overflow:hidden, they are visually hidden.
            // Let's keep it simple.

            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.slider-dot');

        function updateSlider() {
            // Translate wrapper
            wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Update dots
            dots.forEach((dot, index) => {
                dot.setAttribute('aria-selected', index === currentIndex ? 'true' : 'false');
            });

            // Update Arrows ARIA (optional but good feedback)
            // We could disable arrows at bounds if not looping, but let's loop.
        }

        function goToSlide(index) {
            if (index < 0) {
                currentIndex = totalSlides - 1;
            } else if (index >= totalSlides) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }
            updateSlider();
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        // Event Listeners
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        // Keyboard Navigation (Left/Right Arrow) within the slider group
        sliderContainer.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });


    }
});
