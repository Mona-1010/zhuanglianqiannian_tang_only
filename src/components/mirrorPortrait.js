import { MIRROR, PORTRAIT_CANVAS, PORTRAIT_PLACEMENT } from '../data/tangSceneLayout.js';
import { resolveLayers } from '../data/tangMakeups.js';
import { el } from '../utils/dom.js';

/**
 * 镜中人物：整幅 1199×1312 人物容器统一缩放后放入铜镜，
 * 再用从背景图检测出的镜面多边形遮罩限制可见范围。
 * 所有妆容、发髻、发饰图层共用同一原点，只调整整体 transform。
 */
export function createMirrorPortrait() {
  const layerEls = new Map();

  const portrait = el('div', {
    class: 'portrait',
    style: {
      transform: `translate(${PORTRAIT_PLACEMENT.x - MIRROR.box.x}px, ${
        PORTRAIT_PLACEMENT.y - MIRROR.box.y
      }px) scale(${PORTRAIT_PLACEMENT.scale})`,
    },
  });

  const el_ = el(
    'div',
    {
      class: 'mirror',
      style: {
        left: `${MIRROR.box.x}px`,
        top: `${MIRROR.box.y}px`,
        width: `${MIRROR.box.width}px`,
        height: `${MIRROR.box.height}px`,
        clipPath: MIRROR.clipPath,
        webkitClipPath: MIRROR.clipPath,
      },
      'data-canvas': `${PORTRAIT_CANVAS.width}x${PORTRAIT_CANVAS.height}`,
    },
    [
      portrait,
      el('div', { class: 'mirror__sheen' }),
      el('div', { class: 'mirror__vignette' }),
    ]
  );

  function update(makeup) {
    const layers = resolveLayers(makeup);
    const seen = new Set();

    for (const layer of layers) {
      seen.add(layer.key);
      let img = layerEls.get(layer.key);
      if (!img) {
        img = el('img', {
          class: 'portrait__layer',
          alt: '',
          draggable: 'false',
          decoding: 'async',
        });
        layerEls.set(layer.key, img);
        portrait.append(img);
      }
      if (img.getAttribute('src') !== layer.src) img.setAttribute('src', layer.src);
      img.style.zIndex = String(layer.z);
    }

    for (const [key, img] of layerEls) {
      if (!seen.has(key)) {
        img.remove();
        layerEls.delete(key);
      }
    }
  }

  return { el: el_, update };
}

/** 预载全部人物图层，保证换妆即时、无闪白 */
export function preloadLayers(paths) {
  const run = () => {
    for (const src of paths) {
      const img = new Image();
      img.src = src;
    }
  };
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 1800 });
  else setTimeout(run, 600);
}
