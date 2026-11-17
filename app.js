const links = document.querySelectorAll('[data-asset]');
const walkthrough = document.querySelector('.walkthrough');
if (walkthrough) {
  const slides = [...walkthrough.querySelectorAll('.walkthrough__slide')];
  const track = walkthrough.querySelector('.walkthrough__track');
  const previous = walkthrough.querySelector('[data-carousel-prev]');
  const next = walkthrough.querySelector('[data-carousel-next]');
  const count = walkthrough.querySelector('[data-carousel-count]');
  const dots = walkthrough.querySelector('[data-carousel-dots]');
  let active = 0;

  const goTo = (index) => {
    active = Math.max(0, Math.min(index, slides.length - 1));
    track.style.transform = `translateX(-${active * 100}%)`;
    count.textContent = `${active + 1} / ${slides.length}`;
    previous.disabled = active === 0;
    next.disabled = active === slides.length - 1;
    slides.forEach((slide, slideIndex) => {
      slide.setAttribute('aria-hidden', String(slideIndex !== active));
      slide.inert = slideIndex !== active;
    });
    [...dots.children].forEach((dot, dotIndex) =>
      dot.setAttribute('aria-current', String(dotIndex === active)),
    );
  };

  slides.forEach((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `${index + 1}번 화면 보기`);
    dot.addEventListener('click', () => goTo(index));
    dots.append(dot);
  });
  previous.addEventListener('click', () => goTo(active - 1));
  next.addEventListener('click', () => goTo(active + 1));
  walkthrough.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(active + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  goTo(0);
}
async function loadRelease() {
  try {
    const response = await fetch('releases.json', { cache: 'no-store' });
    if (!response.ok) return;
    const release = await response.json();
    for (const link of links) {
      const url = release.assets?.[link.dataset.asset];
      if (typeof url !== 'string' || !/^https:\/\//.test(url)) continue;
      link.href = url;
      link.removeAttribute('aria-disabled');
      link.textContent =
        link.dataset.asset === 'linuxDeb' ? '.deb 다운로드' : '다운로드 ↗';
    }
    const history = document.getElementById('release-link');
    if (history && /^https:\/\//.test(release.releaseUrl || '')) {
      history.href = release.releaseUrl;
      history.hidden = false;
    }
  } catch {
    const note = document.querySelector('.download-note');
    if (note)
      note.textContent +=
        ' 배포 목록을 불러오지 못했습니다. 잠시 후 새로고침해 주세요.';
  }
}

loadRelease();
