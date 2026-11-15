import {
  makeupByCategory,
  makeupGroups,
  thumbTransform,
} from '../data/tangMakeups.js';
import { drawerHead } from './drawerParts.js';
import { el } from '../utils/dom.js';

function thumb(option, box) {
  const t = thumbTransform(option.assetPath, box);
  const wrap = el('span', {
    class: 'opt__thumb',
    style: { width: `${box.w}px`, height: `${box.h}px` },
  });
  if (!t) {
    wrap.append(el('span', { style: { display: 'block', width: '100%', height: '100%' } }));
    return wrap;
  }
  const img = el('img', {
    src: option.assetPath,
    alt: '',
    draggable: 'false',
    loading: 'eager',
    decoding: 'async',
  });
  img.style.width = `${t.meta.w}px`;
  img.style.height = `${t.meta.h}px`;
  img.style.transform = `translate(${t.tx.toFixed(2)}px, ${t.ty.toFixed(2)}px) scale(${t.k.toFixed(4)})`;
  wrap.append(img);
  return wrap;
}

const HAIR_ACCESSORY_GROUPS = ['flower', 'comb', 'buyao', 'hairpin'];

/** 第二层：打开妆具，选择妆容 */
export function renderMakeupSelector({ tool, makeup, activeGroup, isSelected, actions }) {
  const groupKey = activeGroup || (tool.groups || [])[0];
  const group = makeupGroups[groupKey];
  const options = makeupByCategory[groupKey] || [];
  const current = options.find((option) => isSelected(groupKey, option));

  const head = drawerHead({
    backLabel: '器物介绍',
    onBack: () => actions.goStage('tool-intro'),
    onClose: actions.close,
  });

  const tabs =
    (tool.groups || []).length > 1
      ? el(
          'div',
          { class: 'subgroup-tabs', role: 'tablist' },
          tool.groups.map((key) => {
            const g = makeupGroups[key];
            const selectedCount = (makeupByCategory[key] || []).filter((o) => isSelected(key, o)).length;
            return el(
              'button',
              {
                class: `subgroup-tab${key === groupKey ? ' is-on' : ''}`,
                type: 'button',
                role: 'tab',
                'aria-selected': key === groupKey ? 'true' : 'false',
                onclick: () => actions.setActiveGroup(key),
              },
              [
                el('span', { text: g.tab }),
                selectedCount ? el('span', { class: 'subgroup-tab__count', text: '·' }) : null,
              ]
            );
          })
        )
      : null;

  const rows = options.map((option) => {
    const on = Boolean(isSelected(groupKey, option));
    // 双列图谱式排版空间有限：去掉「簪钗·」这样的分组前缀，由分类标签承担
    const label =
      group.layout === 'grid' && option.name.includes('·')
        ? option.name.split('·').pop()
        : option.name;
    return el(
      'button',
      {
        class: `opt${on ? ' is-on' : ''}`,
        type: 'button',
        role: 'option',
        'aria-selected': on ? 'true' : 'false',
        'data-makeup': option.id,
        title: option.name,
        onclick: () => actions.selectMakeup(option.id),
      },
      [
        thumb(option, group.thumb),
        el('span', { class: 'opt__name', text: label }),
        el('span', { class: 'opt__mark' }),
      ]
    );
  });

  const list = el(
    'div',
    {
      class: `opt-list${group.layout === 'grid' ? ' opt-list--grid' : ''}`,
      role: 'listbox',
      'aria-label': `${group.heading}选项`,
    },
    rows
  );

  const needsHairHint = HAIR_ACCESSORY_GROUPS.includes(groupKey) && !makeup.hair;

  const currentBlock = el(
    'div',
    { class: `selector__current${current ? '' : ' is-empty'}` },
    [
      current
        ? el('span', { class: 'selector__current-name', text: current.name })
        : el('span', { class: 'selector__current-name', text: '尚未选择' }),
      current
        ? el(
            'button',
            {
              class: 'link-more',
              type: 'button',
              onclick: () => actions.openMakeupIntro(current.id),
            },
            [el('span', { text: '了解此妆' }), el('span', { text: '→' })]
          )
        : null,
    ]
  );

  const notes = [];
  if (needsHairHint) {
    notes.push(
      el('p', {
        class: 'selector__note',
        text: '尚未绾髻：建议先在「梳篦」中择一款发髻，发饰方有所依。',
      })
    );
  }
  if (group.mode === 'toggle') {
    notes.push(
      el('p', {
        class: 'selector__note',
        text: '此类面饰可与花钿、面靥同时施用，再点一次即可取消。',
      })
    );
  }
  if (current?.assetNote) {
    notes.push(el('p', { class: 'selector__note', text: current.assetNote }));
  }

  const body = el('div', { class: 'drawer__body' }, [
    el('div', { class: 'drawer__scroll' }, [
      el('div', { class: 'selector__head' }, [
        el('p', { class: 'drawer__kicker', text: `${tool.name} · ${group.tab}` }),
        el('h2', { class: 'title-md', style: { marginTop: '8px' }, text: group.heading }),
        el('p', { class: 'selector__lead', text: group.lead }),
      ]),
      tabs,
      list,
      currentBlock,
      ...notes,
    ]),
  ]);

  return el('div', { style: { display: 'contents' } }, [head, body]);
}
