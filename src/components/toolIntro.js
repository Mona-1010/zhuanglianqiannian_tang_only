import { archiveChapters, drawerHead } from './drawerParts.js';
import { el } from '../utils/dom.js';

/** 第一层：妆具介绍 */
export function renderToolIntro({ tool, archive, actions }) {
  const head = drawerHead({
    kicker: '唐 · 梳妆器物',
    onClose: actions.close,
  });

  const body = el('div', { class: 'drawer__body' }, [
    el('div', { class: 'drawer__scroll' }, [
      el('h2', { class: 'title-lg tool-intro__name', text: tool.name }),
      el('p', { class: 'tool-intro__cat', text: tool.category }),
      el('div', { class: 'rule' }),
      el('p', { class: 'lede', text: tool.intro }),
      el('div', { class: 'archive-slot' }, [
        el('p', { class: 'archive-slot__title', text: archive?.title || `档案 ${tool.archiveId}` }),
        el('div', { class: 'archive-slot__body' }, [archiveChapters(archive)]),
      ]),
      tool.introNote
        ? el('p', { class: 'selector__note', style: { marginTop: '22px' }, text: tool.introNote })
        : null,
    ]),
  ]);

  if (tool.hasMakeup) {
    body.append(
      el('div', { class: 'drawer__foot' }, [
        el('div', { class: 'tool-intro__foot' }, [
          el(
            'button',
            {
              class: 'btn-primary',
              type: 'button',
              onclick: () => actions.openSelector(tool.id),
            },
            [el('span', { text: '打开妆具' }), el('span', { class: 'arrow', text: '→' })]
          ),
          el('span', { class: 'hint', text: '镜中即时生效' })
        ]),
      ])
    );
  } else {
    body.append(
      el('div', { class: 'drawer__foot' }, [
        el('p', {
          class: 'placeholder-note',
          text: '此器物仅作介绍，不提供换妆选项。',
        }),
      ])
    );
  }

  return el('div', { style: { display: 'contents' } }, [head, body]);
}
