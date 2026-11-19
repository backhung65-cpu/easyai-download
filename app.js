// 쉬운AI 홈페이지: 내려받기 주소·버전 채우기, 만드는 순서 화면 바꾸기, 계좌번호 복사.

async function loadRelease() {
  try {
    const response = await fetch('releases.json', { cache: 'no-store' });
    if (!response.ok) return;
    const release = await response.json();
    for (const link of document.querySelectorAll('[data-asset]')) {
      const url = release.assets?.[link.dataset.asset];
      if (typeof url !== 'string' || !/^https:\/\//.test(url)) continue;
      link.href = url;
      link.removeAttribute('aria-disabled');
      if (link.dataset.label) link.textContent = link.dataset.label;
    }
    if (release.version) for (const node of document.querySelectorAll('[data-version]')) node.textContent = `v${release.version}`;
    const history = document.getElementById('release-link');
    if (history && /^https:\/\//.test(release.releaseUrl || '')) {
      history.href = release.releaseUrl;
      history.hidden = false;
    }
  } catch {
    // 목록을 못 읽어도 버튼은 아래 내려받기 칸으로 안내한다.
  }
}
loadRelease();

const tabs = [...document.querySelectorAll('.steps__list [role="tab"]')];
const view = document.querySelector('.steps__view img');
function showStep(index, focus) {
  tabs.forEach((tab, i) => {
    const on = i === index;
    tab.setAttribute('aria-selected', String(on));
    tab.tabIndex = on ? 0 : -1;
  });
  const tab = tabs[index];
  if (view && tab) {
    view.src = tab.dataset.shot;
    view.alt = tab.dataset.alt;
  }
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => showStep(index, false));
  tab.addEventListener('keydown', (event) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    showStep((index + keys[event.key] + tabs.length) % tabs.length, true);
  });
});
if (tabs.length) showStep(0, false);

const copyAccount = document.querySelector('[data-copy-account]');
if (copyAccount) {
  copyAccount.addEventListener('click', async () => {
    const status = document.querySelector('.account__status');
    try {
      await navigator.clipboard.writeText(copyAccount.dataset.copyAccount);
      if (status) status.textContent = '계좌번호를 복사했습니다.';
    } catch {
      if (status) status.textContent = '복사하지 못했습니다. 계좌번호를 직접 선택해 복사해 주세요.';
    }
  });
}
