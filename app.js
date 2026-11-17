const links = document.querySelectorAll('[data-asset]');
const screenGrid = document.querySelector('.screen-grid');
if (screenGrid) {
  for (const [file, title, description] of [
    ['screen-ai.png', 'AI 선택과 연결', '현재 사용하는 AI를 앱 안에서 고릅니다.'],
    ['screen-worship.png', '예배 정보', '교회와 예배 날짜를 순서대로 채웁니다.'],
    ['screen-font.png', 'AI 초안과 글꼴', '원문 요점과 발표 글꼴을 확인합니다.'],
  ]) {
    const figure = document.createElement('figure');
    figure.className = 'screen-card';
    const picture = document.createElement('img');
    picture.src = `assets/${file}`;
    picture.alt = `${title} 화면`;
    picture.loading = 'lazy';
    const caption = document.createElement('figcaption');
    const heading = document.createElement('b');
    heading.textContent = title;
    const detail = document.createElement('span');
    detail.textContent = description;
    caption.append(heading, detail);
    figure.append(picture, caption);
    screenGrid.append(figure);
  }
}
const cautions = document.querySelector('.value-card.caution ul');
if (cautions) {
  const item = document.createElement('li');
  item.textContent = 'Windows 설치 파일도 현재 코드 서명 전이라 SmartScreen의 보안 확인이 표시될 수 있습니다.';
  cautions.append(item);
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
      link.textContent = link.dataset.asset === 'linuxDeb' ? '.deb 다운로드' : '다운로드 ↗';
    }
    const history = document.getElementById('release-link');
    if (history && /^https:\/\//.test(release.releaseUrl || '')) {
      history.href = release.releaseUrl;
      history.hidden = false;
    }
  } catch { /* 배포 파일이 아직 없으면 준비 중 상태를 유지합니다. */ }
}

loadRelease();
