// Hatbazaar 画像スライダー
// ドット（ステッパー）の生成、矢印・ドット・矢印キーでのスライド切り替えを担当する

export function initSlider() {
    const sliderContainer = document.querySelector('.hatbazaar__image-slider');
    if (!sliderContainer) return;

    const wrapper = sliderContainer.querySelector('.slider-wrapper');
    const slides = sliderContainer.querySelectorAll('.slider-slide');
    const prevBtn = sliderContainer.querySelector('.slider-prev');
    const nextBtn = sliderContainer.querySelector('.slider-next');
    const dotsContainer = sliderContainer.querySelector('.slider-dots');

    let currentIndex = 0;
    const totalSlides = slides.length;

    // ページの言語に合わせてドットのラベルを切り替える
    const isJa = document.documentElement.lang.startsWith('ja');
    const dotLabel = (n) => (isJa ? `${n}枚目のスライドを表示` : `Go to slide ${n}`);

    // ドット（ステッパー）を生成し、ARIA属性を設定する
    slides.forEach((slide, index) => {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        dot.type = 'button';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', dotLabel(index + 1));
        dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        dot.setAttribute('aria-controls', `slide-${index}`);
        slide.id = `slide-${index}`;

        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.slider-dot');

    function updateSlider() {
        wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, index) => {
            dot.setAttribute('aria-selected', index === currentIndex ? 'true' : 'false');
        });
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

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // 左右の矢印キーでスライドを切り替える
    sliderContainer.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
}
