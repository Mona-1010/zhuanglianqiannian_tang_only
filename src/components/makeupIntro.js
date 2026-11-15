import { makeupGroups } from '../data/tangMakeups.js';
import { archiveChapters, drawerHead, reservedBlocks } from './drawerParts.js';
import { el } from '../utils/dom.js';

/** 第三层：所选妆容介绍（历史正文、图像、来源均为结构化预留位） */
export function renderMakeupIntro({ makeup, archive, actions }) {
  const group = makeupGroups[makeup.category];

  const head = drawerHead({
    backLabel: '妆容选择',
    onBack: () => actions.goStage('makeup-select'),
    onClose: actions.close,
  });

  const body = el('div', { class: 'drawer__body' }, [
    el('div', { class: 'drawer__scroll' }, [
      el('p', { class: 'drawer__kicker', style: { marginTop: '20px' }, text: group.archiveLabel }),
      el('h2', { class: 'title-lg makeup-intro__title', text: makeup.name }),
      el('div', { class: 'makeup-intro__ids' }, [
        el('span', { text: `妆容 ID · ${makeup.id}` }),
        el('span', { text: archive ? `档案 ID · ${archive.archiveId}` : '档案 ID · 未关联' }),
      ]),
      el('div', { class: 'rule' }),
      el('p', { class: 'lede', text: makeup.intro }),

      el('section', { class: 'doc-block' }, [
        el('div', { class: 'doc-block__head' }, [
          el('h4', { class: 'doc-block__title', text: '历史正文' }),
          el('span', { class: 'doc-block__tag', text: archive?.chapters?.length ? '已接入' : '待接入' }),
        ]),
        el('div', { class: 'doc-block__body' }, [archiveChapters(archive)]),
      ]),

      ...reservedBlocks(),

      makeup.archiveNote
        ? el('p', { class: 'selector__note', style: { marginTop: '24px' }, text: makeup.archiveNote })
        : null,
    ]),
  ]);

  return el('div', { style: { display: 'contents' } }, [head, body]);
}
