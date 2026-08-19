// ハンバーガーメニュー
// 開閉・背景スクロール抑止・フォーカストラップ（Tab循環／Escで閉じる）を担当する

export function initHamburgerMenu() {
    const toggleButton = document.querySelector('.header__toggle');
    const nav = document.querySelector('.header__nav');

    if (!toggleButton || !nav) return;

    const isMenuOpen = () => nav.classList.contains('is-active');

    // メニュー内でフォーカス可能な要素（リンク＋開閉ボタン）を表示中のものだけ取得
    const getFocusableElements = () => {
        const items = [
            ...nav.querySelectorAll('a[href], button:not([disabled])'),
            toggleButton,
        ];
        return items.filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0);
    };

    const openMenu = () => {
        nav.classList.add('is-active');
        toggleButton.classList.add('is-active');
        toggleButton.setAttribute('aria-expanded', 'true');
        toggleButton.setAttribute('aria-label', 'メニューを閉じる');
        // 背景（body）のスクロールを止める
        document.body.classList.add('is-menu-open');
        // メニュー内の最初の項目へフォーカスを移す
        const focusable = getFocusableElements();
        if (focusable.length) focusable[0].focus();
    };

    const closeMenu = ({ returnFocus = false } = {}) => {
        nav.classList.remove('is-active');
        toggleButton.classList.remove('is-active');
        toggleButton.setAttribute('aria-expanded', 'false');
        toggleButton.setAttribute('aria-label', 'メニューを開く');
        document.body.classList.remove('is-menu-open');
        // キーボード操作で閉じた場合はトグルボタンへフォーカスを戻す
        if (returnFocus) toggleButton.focus();
    };

    toggleButton.addEventListener('click', () => {
        if (isMenuOpen()) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // リンクをクリックしたら閉じる
    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => closeMenu());
    });

    // メニュー展開中のキーボード操作（Escで閉じる／Tabをメニュー内に閉じ込める）
    document.addEventListener('keydown', (e) => {
        if (!isMenuOpen()) return;

        if (e.key === 'Escape') {
            closeMenu({ returnFocus: true });
            return;
        }

        if (e.key !== 'Tab') return;

        const focusable = getFocusableElements();
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    });
}
