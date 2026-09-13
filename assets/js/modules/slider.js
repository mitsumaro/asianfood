// Hatbazaar 画像スライダー
// ドット（ステッパー）の生成、矢印・ドット・矢印キーでのスライド切り替えを担当する

export function initSlider() {
    const sliderContainer = document.querySelector('.hatbazaar__image-slider');
    if (!sliderContainer) return;

    const wrapper = sliderContainer.querySelector('.slider-wrapper');
    const slides = Array.from(sliderContainer.querySelectorAll('.slider-slide'));
    const prevBtn = sliderContainer.querySelector('.slider-prev');
    const nextBtn = sliderContainer.querySelector('.slider-next');
    const dotsContainer = sliderContainer.querySelector('.slider-dots');

    const totalSlides = slides.length;
    if (totalSlides === 0) return;

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

        dot.addEventListener('click', () => slideTo(index + 1));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.slider-dot');

    // 先頭・末尾の複製を前後に配置し、端をまたぐ際も同じ方向へ自然にスライドできるようにする
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[totalSlides - 1].cloneNode(true);
    firstClone.removeAttribute('id');
    lastClone.removeAttribute('id');
    firstClone.setAttribute('aria-hidden', 'true');
    lastClone.setAttribute('aria-hidden', 'true');
    wrapper.appendChild(firstClone);
    wrapper.insertBefore(lastClone, wrapper.firstChild);

    // 複製を含めたインデックス（1〜totalSlidesが実スライド、0とtotalSlides+1が複製）
    let currentIndex = 1;

    function updateDots() {
        const realIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        dots.forEach((dot, index) => {
            dot.setAttribute('aria-selected', index === realIndex ? 'true' : 'false');
        });
    }

    // トランジションなしで即座に指定位置へ移動する（複製から実スライドへの瞬間切り替え用）
    function snapTo(index) {
        currentIndex = index;
        wrapper.style.transition = 'none';
        wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        void wrapper.offsetHeight; // 強制リフローでトランジション無効化を反映させる
        wrapper.style.transition = '';
    }

    // トランジションありで指定位置へスライドする
    function slideTo(index) {
        currentIndex = index;
        wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
    }

    snapTo(1);
    updateDots();

    // 複製スライドまでスライドし終えたら、見た目を変えずに実スライドへ瞬間的に戻す
    wrapper.addEventListener('transitionend', (e) => {
        if (e.target !== wrapper || e.propertyName !== 'transform') return;
        if (currentIndex === totalSlides + 1) {
            snapTo(1);
        } else if (currentIndex === 0) {
            snapTo(totalSlides);
        }
    });

    function nextSlide() {
        slideTo(currentIndex + 1);
    }

    function prevSlide() {
        slideTo(currentIndex - 1);
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
