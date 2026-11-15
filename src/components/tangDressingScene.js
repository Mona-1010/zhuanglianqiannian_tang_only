import { SCENE } from '../data/tangSceneLayout.js';
import { makeupById, makeupGroups, resolveLayers, tangMakeups } from '../data/tangMakeups.js';
import {
  closeDrawer,
  getState,
  goStage,
  isPristine,
  openMakeupIntro,
  openTool,
  resetMakeup,
  selectMakeup,
  setActiveGroup,
  subscribe,
} from '../store/tangStore.js';
import { createArchiveDrawer } from './archiveDrawer.js';
import { createMirrorPortrait, preloadLayers } from './mirrorPortrait.js';
import { createToolHotspots } from './toolHotspots.js';
import { el } from '../utils/dom.js';

/**
 * 唐代梳妆场景：背景 + 镜中人物 + 透明热区 + 右侧抽屉。
 * 只组装，不持有业务状态；状态全部来自 store，便于后续朝代复用。
 */
export function mountTangScene(root = document.body) {
  const stage = el('div', { class: 'stage', 'aria-label': '唐代梳妆台场景' });

  const bg = el('img', {
    class: 'stage__bg',
    src: SCENE.background,
    alt: '唐代室内妆台：铜花镜、漆奁与十式妆具',
    draggable: 'false',
    fetchpriority: 'high',
  });
  stage.append(bg);

  const portrait = createMirrorPortrait();
  stage.append(portrait.el);

  const hotspots = createToolHotspots({
    onSelect: (toolId) => openTool(toolId),
  });
  stage.append(hotspots.el);

  const masthead = el('div', { class: 'masthead' }, [
    el('div', { class: 'masthead__brand' }, [
      el('p', { class: 'masthead__title', text: '妆奁千年' }),
      el('p', { class: 'masthead__sub', text: '唐 · 梳妆' }),
    ]),
    el('div', { class: 'masthead__aside' }, [
      el('button', {
        class: 'text-btn',
        type: 'button',
        'data-action': 'reset',
        text: '卸妆',
        title: '恢复素颜初始状态',
        onclick: () => resetMakeup(),
      }),
    ]),
  ]);

  const stateStrip = el('div', { class: 'state-strip', 'aria-live': 'polite' });

  const drawer = createArchiveDrawer();

  root.append(stage, masthead, stateStrip, drawer.el);

  /* ---------------- 场景等比缩放：背景、人物、热区共用同一变换 ---------------- */
  function fitScene() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const narrow = vw <= 760;
    // 窄屏：抽屉改成下方抽屉，场景整体缩到上半屏，画面与镜中人物仍完整可见
    const k = narrow
      ? Math.min(vw / SCENE.width, (vh * 0.52) / SCENE.height)
      : Math.min(vw / SCENE.width, vh / SCENE.height);
    const x = (vw - SCENE.width * k) / 2;
    const y = narrow
      ? Math.max(72, vh * 0.075)
      : (vh - SCENE.height * k) / 2;
    stage.style.transform = `translate(${x}px, ${y}px) scale(${k})`;
  }
  window.addEventListener('resize', fitScene);
  fitScene();

  /* ---------------- 渲染 ---------------- */
  const ORDER = [
    'base',
    'blush',
    'foreheadYellow',
    'eyebrow',
    'lip',
    'huadian',
    'mianye',
    'xiehong',
    'buyao',
    'hairpin',
    'hair',
    'flower',
    'comb',
  ];

  function renderStateStrip(makeup) {
    stateStrip.replaceChildren();
    const items = [];
    for (const key of ORDER) {
      const group = makeupGroups[key];
      if (!group) continue;
      const value = makeup[group.stateKey];
      if (!value) continue;
      if (key === 'base') {
        if (value !== 'powder') continue;
        items.push({ label: '底妆', name: '白粉妆' });
        continue;
      }
      const option = makeupById.get(value);
      if (option) {
        const short = option.name.includes('·') ? option.name.split('·').pop() : option.name;
        // 名称里已含分类词时不再重复前缀（如「点状面靥」）
        const tab = short.includes(group.tab) ? '' : group.tab;
        items.push({ label: tab, name: short });
      }
    }
    stateStrip.classList.toggle('is-empty', items.length === 0);
    items.forEach((item, index) => {
      stateStrip.append(
        el('span', { class: 'state-strip__item' }, [
          index ? el('span', { class: 'state-strip__dot' }) : null,
          el('span', {
            text: item.label ? `${item.label} · ${item.name}` : item.name,
          }),
        ])
      );
    });
  }

  function render(state) {
    portrait.update(state.makeup);
    drawer.update(state);
    renderStateStrip(state.makeup);
    const resetBtn = masthead.querySelector('[data-action="reset"]');
    if (resetBtn) resetBtn.disabled = isPristine(state.makeup);
    document.body.dataset.drawerOpen = state.drawer.isOpen ? 'true' : 'false';
  }

  subscribe(render);
  render(getState());

  /* ---------------- 预载：让换妆即时生效 ---------------- */
  const paths = new Set();
  for (const m of tangMakeups) paths.add(m.assetPath);
  for (const layer of resolveLayers(getState().makeup)) paths.add(layer.src);
  preloadLayers([...paths]);

  /* ---------------- 调试模式 ?debug=1 ---------------- */
  const params = new URLSearchParams(window.location.search);
  if (params.get('debug') === '1') {
    document.body.classList.add('debug');
    hotspots.showDebugLabels(true);
    root.append(
      el('div', {
        class: 'debug-hint',
        text: `debug · 场景 ${SCENE.width}×${SCENE.height} · 视口 ${window.innerWidth}×${window.innerHeight}`,
      })
    );

    // 调试辅助：?debug=1&seed=TANG_M002,TANG_M023,TANG_M028&tool=TANG_T002&stage=makeup-select
    const seed = params.get('seed');
    if (seed) {
      for (const id of seed.split(',')) {
        if (id.trim()) selectMakeup(id.trim());
      }
    }
    const toolId = params.get('tool');
    if (toolId) {
      openTool(toolId);
      const stage = params.get('stage');
      if (stage === 'makeup-select' || stage === 'makeup-intro') {
        goStage(stage);
        const introId = params.get('intro');
        if (stage === 'makeup-intro' && introId) openMakeupIntro(introId);
      }
      const group = params.get('group');
      if (group) setActiveGroup(group);
    }
  }

  /* ---------------- 键盘 ---------------- */
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && getState().drawer.isOpen) closeDrawer();
  });

  return { stage, drawer };
}
