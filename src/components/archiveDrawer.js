import { makeupById, makeupGroups } from '../data/tangMakeups.js';
import { getArchive } from '../data/tangArchives.js';
import { toolById } from '../data/tangTools.js';
import { isSelected, openMakeupIntro, goStage, setActiveGroup, selectMakeup, closeDrawer } from '../store/tangStore.js';
import { renderToolIntro } from './toolIntro.js';
import { renderMakeupSelector } from './makeupSelector.js';
import { renderMakeupIntro } from './makeupIntro.js';
import { clear, el } from '../utils/dom.js';

/**
 * 右侧抽屉：同一容器内切换三层（器物介绍 / 妆容选择 / 妆容介绍）。
 * 抽屉覆盖在场景之上，背景与人物都不重新排版。
 */
export function createArchiveDrawer() {
  const panel = el('aside', {
    class: 'drawer',
    'aria-label': '梳妆器物与妆容档案',
    'aria-hidden': 'true',
  });

  const actions = {
    close: closeDrawer,
    goStage,
    setActiveGroup,
    selectMakeup,
    openMakeupIntro,
    openSelector: () => goStage('makeup-select'),
  };

  let lastKey = '';

  function update(state) {
    const { drawer, makeup } = state;
    panel.classList.toggle('is-open', drawer.isOpen);
    panel.setAttribute('aria-hidden', drawer.isOpen ? 'false' : 'true');

    if (!drawer.isOpen || !drawer.toolId) return;

    const tool = toolById.get(drawer.toolId);
    if (!tool) return;

    const stage = drawer.stage;
    const activeMakeup =
      drawer.activeMakeupId && makeupById.get(drawer.activeMakeupId)
        ? makeupById.get(drawer.activeMakeupId)
        : null;

    // 仅在与内容相关的状态变化时重建，避免同一内容反复重绘
    const key = JSON.stringify({
      tool: drawer.toolId,
      stage,
      group: drawer.activeGroup,
      active: drawer.activeMakeupId,
      makeup,
    });
    if (key === lastKey) return;
    lastKey = key;

    let content;
    if (stage === 'makeup-intro' && activeMakeup) {
      content = renderMakeupIntro({
        makeup: activeMakeup,
        archive: getArchive(activeMakeup.archiveId),
        actions,
      });
    } else if (stage === 'makeup-select' && tool.hasMakeup) {
      content = renderMakeupSelector({
        tool,
        makeup,
        activeGroup: drawer.activeGroup,
        isSelected: (groupKey, option) => isSelected(groupKey, option, makeup),
        actions,
      });
    } else {
      content = renderToolIntro({
        tool,
        archive: getArchive(tool.archiveId),
        actions,
      });
    }

    clear(panel);
    panel.append(content);
    if (drawer.isOpen) panel.classList.add('is-open');
  }

  return { el: panel, update };
}

/** 供外部查看当前分组标题（调试/扩展用） */
export function groupLabel(groupKey) {
  return makeupGroups[groupKey]?.tab || groupKey;
}
