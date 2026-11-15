import { makeupGroups, makeupById } from '../data/tangMakeups.js';
import { toolById } from '../data/tangTools.js';

/**
 * 页面状态：人物换妆状态与抽屉打开状态彼此独立。
 *   makeup   —— 镜中人物当前穿戴
 *   drawer   —— 右侧抽屉三层导航
 */
export function createInitialMakeupState() {
  return {
    base: 'bare', // 'bare' | 'powder'
    eyebrow: null,
    blush: null,
    lip: null,
    foreheadYellow: false,
    huadian: null,
    mianye: false,
    xiehong: false,
    hair: null,
    flower: null,
    comb: null,
    buyao: null,
    hairpin: null,
  };
}

const store = {
  makeup: createInitialMakeupState(),
  drawer: {
    isOpen: false,
    toolId: null,
    activeMakeupId: null,
    activeGroup: null,
    stage: 'tool-intro', // tool-intro | makeup-select | makeup-intro
  },
};

const listeners = new Set();

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  for (const fn of listeners) fn(store);
}

export function getState() {
  return store;
}

/** 当前分组里选中的值（用于选中态渲染） */
export function isSelected(groupKey, option, makeup) {
  const group = makeupGroups[groupKey] || makeupGroups[option.category];
  if (!group) return false;
  const value = makeup[group.stateKey];
  if (option.category === 'base') return value === option.value;
  if (group.mode === 'toggle') return value === option.id;
  return value === option.id;
}

/* ------------------------------ 动作 ------------------------------ */

export function selectMakeup(makeupId) {
  const option = makeupById.get(makeupId);
  if (!option) return;
  const group = makeupGroups[option.category];
  const key = group.stateKey;

  if (option.category === 'base') {
    store.makeup.base = option.value;
    store.drawer.activeMakeupId = option.id;
  } else if (group.mode === 'toggle') {
    store.makeup[key] = store.makeup[key] === option.id ? false : option.id;
    store.drawer.activeMakeupId = store.makeup[key] ? option.id : null;
  } else {
    store.makeup[key] = store.makeup[key] === option.id ? null : option.id;
    store.drawer.activeMakeupId = store.makeup[key] ? option.id : null;
  }
  emit();
}

/** 直接切换某个分组的选中项（供「取消」等操作使用） */
export function clearCategory(category) {
  const group = makeupGroups[category];
  if (!group) return;
  if (category === 'base') return; // 底妆始终二选一
  store.makeup[group.stateKey] = group.mode === 'toggle' ? false : null;
  if (store.drawer.activeMakeupId && makeupById.get(store.drawer.activeMakeupId)?.category === category) {
    store.drawer.activeMakeupId = null;
  }
  emit();
}

export function openTool(toolId) {
  const tool = toolById.get(toolId);
  if (!tool) return;
  store.drawer.isOpen = true;
  store.drawer.toolId = toolId;
  store.drawer.stage = 'tool-intro';
  const groups = tool.groups || [];
  store.drawer.activeGroup = groups[0] || null;
  const group = groups[0] ? makeupGroups[groups[0]] : null;
  store.drawer.activeMakeupId = group ? pickSelectedInGroup(group) : null;
  emit();
}

function pickSelectedInGroup(group) {
  const value = store.makeup[group.stateKey];
  if (!value || value === true) return null;
  if (group.stateKey === 'base') return value === 'powder' ? 'TANG_M006' : 'TANG_M007';
  return value;
}

export function setActiveGroup(groupKey) {
  store.drawer.activeGroup = groupKey;
  const group = makeupGroups[groupKey];
  store.drawer.activeMakeupId = group ? pickSelectedInGroup(group) : null;
  emit();
}

export function goStage(stage) {
  store.drawer.stage = stage;
  emit();
}

export function openMakeupIntro(makeupId) {
  if (!makeupId) return;
  store.drawer.activeMakeupId = makeupId;
  store.drawer.stage = 'makeup-intro';
  emit();
}

export function closeDrawer() {
  store.drawer.isOpen = false;
  emit();
}

/** 卸妆 / 恢复素颜：一次性回到初始人物状态 */
export function resetMakeup() {
  store.makeup = createInitialMakeupState();
  store.drawer.activeMakeupId = store.drawer.activeGroup
    ? pickSelectedInGroup(makeupGroups[store.drawer.activeGroup])
    : null;
  emit();
}

export function isPristine(makeup = store.makeup) {
  const init = createInitialMakeupState();
  return Object.keys(init).every((k) => makeup[k] === init[k]);
}
