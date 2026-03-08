function BgmControl() {
    const bgm = document.getElementById('bgm') as HTMLAudioElement;
    const control = document.getElementById("bgm-control");
    if (bgm.paused) {
      bgm.play();
      control!.setAttribute("fill", "#18d1ff");
      control!.style.transform = "scaleY(1)";
      localStorage.removeItem('bgm-paused');
    } else {
      bgm.pause();
      control!.setAttribute("fill", "currentColor");
      control!.style.transform = "scaleY(.5)";
      localStorage.setItem('bgm-paused', '1');
    }
}
function initBgm() {
    const bgm = document.getElementById('bgm') as HTMLAudioElement | null;
    const control = document.getElementById("bgm-control");
    if (!bgm || !control) return;
    const userPaused = localStorage.getItem('bgm-paused') === '1';
    const shouldPlay = !userPaused && (bgm as HTMLElement).dataset.autoplay === 'true';
    if (shouldPlay) {
      bgm.play().catch(() => {});
      control.setAttribute("fill", "#18d1ff");
      control.style.transform = "scaleY(1)";
    } else {
      bgm.pause();
      control.setAttribute("fill", "currentColor");
      control.style.transform = "scaleY(.5)";
    }
}
window.addEventListener('load', initBgm);
document.addEventListener('pjax:complete', initBgm);