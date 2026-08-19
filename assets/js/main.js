// エントリーポイント
// 役割ごとに分割したモジュールをまとめて初期化する

import { initHamburgerMenu } from './modules/hamburgerMenu.js';
import { initSlider } from './modules/slider.js';

document.addEventListener('DOMContentLoaded', () => {
    initHamburgerMenu();
    initSlider();
});
