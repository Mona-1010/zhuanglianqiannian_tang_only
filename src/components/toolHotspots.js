import { MIRROR, SCENE } from '../data/tangSceneLayout.js';
import { tangTools } from '../data/tangTools.js';
import { el, svgEl } from '../utils/dom.js';

/**
 * 透明妆具热区：直接覆盖在背景实物上的 SVG 形状，
 * 默认完全透明，悬停/键盘聚焦时出现暗金色细轮廓与小型名称提示。
 */
export function createToolHotspots({ onSelect, onHover }) {
  const label = el('div', { class: 'hotspot-label' });

  const svg = svgEl('svg', {
    class: 'hotspots',
    width: SCENE.width,
    height: SCENE.height,
    viewBox: `0 0 ${SCENE.width} ${SCENE.height}`,
    'aria-label': '梳妆台上的妆具',
    role: 'group',
  });

  const labels = [];

  for (const tool of tangTools) {
    tool.hotspots.forEach((hotspot, index) => {
      const common = {
        class: hotspot.shape === 'ring' ? 'hotspot hotspot--ring' : 'hotspot',
        tabindex: '0',
        role: 'button',
        'aria-label': `${tool.fullName}，打开器物介绍`,
        'data-tool': tool.id,
      };
      let shape;
      let anchor;

      if (hotspot.shape === 'ring') {
        shape = svgEl('circle', {
          ...common,
          cx: MIRROR.ring.cx,
          cy: MIRROR.ring.cy,
          r: MIRROR.ring.r,
          'stroke-width': MIRROR.ring.strokeWidth,
        });
        anchor = { x: MIRROR.ring.cx, y: MIRROR.ring.cy - MIRROR.ring.r - 16 };
      } else if (hotspot.shape === 'ellipse') {
        shape = svgEl('ellipse', {
          ...common,
          cx: hotspot.x + hotspot.w / 2,
          cy: hotspot.y + hotspot.h / 2,
          rx: hotspot.w / 2,
          ry: hotspot.h / 2,
        });
        anchor = { x: hotspot.x + hotspot.w / 2, y: hotspot.y - 10 };
      } else {
        shape = svgEl('rect', {
          ...common,
          x: hotspot.x,
          y: hotspot.y,
          width: hotspot.w,
          height: hotspot.h,
          rx: Math.min(10, hotspot.h * 0.18),
        });
        anchor = { x: hotspot.x + hotspot.w / 2, y: hotspot.y - 10 };
      }

      const showLabel = () => {
        label.textContent = hotspot.label || tool.name;
        label.style.left = `${anchor.x}px`;
        label.style.top = `${anchor.y}px`;
        label.classList.add('is-on');
        label.dataset.tool = tool.id;
        onHover?.(tool.id);
      };
      const hideLabel = () => {
        label.classList.remove('is-on');
        onHover?.(null);
      };

      shape.addEventListener('pointerenter', showLabel);
      shape.addEventListener('pointerleave', hideLabel);
      shape.addEventListener('focus', showLabel);
      shape.addEventListener('blur', hideLabel);
      shape.addEventListener('click', () => onSelect(tool.id));
      shape.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(tool.id);
          shape.blur();
        }
      });

      svg.append(shape);

      if (hotspot.shape === 'ring') {
        labels.push({ x: MIRROR.ring.cx, y: MIRROR.ring.cy + MIRROR.ring.r + 28, text: tool.name });
      } else {
        labels.push({
          x: hotspot.x + hotspot.w / 2,
          y: hotspot.y + hotspot.h / 2,
          text: tool.name,
          small: true,
        });
      }
    });
  }

  const wrap = el('div', { class: 'hotspot-layer' }, [svg, label]);
  wrap.style.position = 'absolute';
  wrap.style.inset = '0';
  wrap.style.pointerEvents = 'none';
  svg.style.pointerEvents = 'none';
  // 形状本身仍可交互
  for (const shape of svg.querySelectorAll('.hotspot')) shape.style.pointerEvents = 'all';
  for (const shape of svg.querySelectorAll('.hotspot--ring')) shape.style.pointerEvents = 'stroke';
  label.style.pointerEvents = 'none';

  /** 调试模式：显示热区名称，便于人工核对定位 */
  function showDebugLabels(on) {
    for (const node of wrap.querySelectorAll('.debug-label')) node.remove();
    if (!on) return;
    for (const item of labels) {
      wrap.append(
        el('div', {
          class: 'debug-label',
          style: { left: `${item.x}px`, top: `${item.y}px` },
          text: item.text,
        })
      );
    }
    wrap.append(
      el('div', {
        class: 'debug-label',
        style: {
          left: `${MIRROR.box.x + MIRROR.box.width / 2}px`,
          top: `${MIRROR.box.y - 18}px`,
          color: '#c22',
        },
        text: '镜面遮罩',
      })
    );
  }

  return { el: wrap, showDebugLabels };
}
