import { el, closeIcon } from '../utils/dom.js';

/** 抽屉顶部：小标题 / 返回 / 关闭 */
export function drawerHead({ kicker, onBack, backLabel, onClose }) {
  const left = el('div', { style: { display: 'flex', alignItems: 'baseline', gap: '14px' } }, [
    onBack
      ? el(
          'button',
          { class: 'back-link', type: 'button', 'aria-label': `返回${backLabel || '上一页'}`, onclick: onBack },
          [el('span', { class: 'arrow', text: '←' }), el('span', { text: backLabel || '返回' })]
        )
      : el('p', { class: 'drawer__kicker', text: kicker }),
  ]);

  const right = el('button', {
    class: 'icon-btn',
    type: 'button',
    'aria-label': '关闭',
    onclick: onClose,
  });
  right.append(closeIcon());

  return el('header', { class: 'drawer__head' }, [left, right]);
}

/** 档案章节渲染：有数据则逐章展开，无数据则保留占位结构 */
export function archiveChapters(archive) {
  const chapters = archive?.chapters || [];
  if (!chapters.length) {
    return el('div', {}, [
      el('p', {
        class: 'placeholder-note',
        text: '本章正文、文物图片、图注与来源引用将以结构化字段接入数据库后显示，此处仅保留排版位置。',
      }),
    ]);
  }
  return el(
    'div',
    { class: 'archive-chapters' },
    chapters.map((chapter) =>
      el('section', { class: 'doc-block' }, [
        el('div', { class: 'doc-block__head' }, [
          el('h4', { class: 'doc-block__title', text: chapter.title || '' }),
          chapter.tag ? el('span', { class: 'doc-block__tag', text: chapter.tag }) : null,
        ]),
        el('div', { class: 'doc-block__body', text: chapter.content || '' }),
        ...(chapter.images || []).map((image) =>
          el('figure', { class: 'doc-figure' }, [image.src ? el('img', { src: image.src, alt: image.caption || '' }) : el('span', { text: image.caption || '图片' })])
        ),
        ...(chapter.sources || []).length
          ? [
              el(
                'ul',
                { class: 'doc-sources' },
                chapter.sources.map((s) =>
                  el('li', {}, [
                    s.url
                      ? el('a', { href: s.url, target: '_blank', rel: 'noreferrer', text: s.label || s.url })
                      : el('span', { text: s.label || '' }),
                  ])
                )
              ),
            ]
          : [],
      ])
    )
  );
}

/** 预留容器：图片 / 来源 */
export function reservedBlocks() {
  return [
    el('section', { class: 'doc-block' }, [
      el('div', { class: 'doc-block__head' }, [
        el('h4', { class: 'doc-block__title', text: '图像与图注' }),
        el('span', { class: 'doc-block__tag', text: '待接入' }),
      ]),
      el('div', { class: 'doc-figure', text: '文物图片与图注位置' }),
    ]),
    el('section', { class: 'doc-block' }, [
      el('div', { class: 'doc-block__head' }, [
        el('h4', { class: 'doc-block__title', text: '来源引用' }),
        el('span', { class: 'doc-block__tag', text: '待接入' }),
      ]),
      el('div', { class: 'doc-block__body' }, [
        el('p', {
          class: 'placeholder-note',
          text: '数据库「展开档案」中的原始链接、馆藏机构与许可说明将在此逐条列出。',
        }),
      ]),
    ]),
  ];
}
