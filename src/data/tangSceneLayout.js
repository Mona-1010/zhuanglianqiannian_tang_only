import { mirrorMask, mirrorMaskPolygonCss } from './mirrorMask.js';

/**
 * 唐代场景布局配置（集中管理，便于后续宋/明/清沿用同一套机制）。
 * 坐标系：1672 × 941，原点在左上角，X 向右，Y 向下。
 */
export const SCENE = {
  dynasty: '唐',
  width: 1672,
  height: 941,
  background: 'assets/tang/scene/study.png',
  /** 留边颜色取自背景上缘 / 下缘，避免出现白色网页背景 */
  edgeTop: '#eec9ad',
  edgeBottom: '#a5694d',
};

/** 人物画布：所有妆容、发髻、发饰图层共用的 1199×1312 坐标系 */
export const PORTRAIT_CANVAS = { width: 1199, height: 1312 };

/**
 * 整个人物容器在场景中的统一放置参数。
 * 只允许通过这里调整：所有妆容状态共用同一组数值，绝不单独缩放某一图层。
 * 亲测取值：scale 0.50 时，最高发髻与簪花恰好落在镜面内部；
 * 眉线约在镜面 y≈338，肩线自然被镜面下缘裁切。
 */
export const PORTRAIT_PLACEMENT = {
  scale: 0.5,
  /** 缩放后人物容器左上角在场景坐标系中的位置 */
  x: 572,
  y: 114,
};

/** 镜面遮罩：由 tools/sync-assets.mjs 从正式背景图检测得到 */
export const MIRROR = {
  box: mirrorMask.box,
  polygon: mirrorMask.polygon,
  clipPath: `polygon(${mirrorMaskPolygonCss})`,
  /** 镜框细窄介绍热区（环形） */
  ring: { cx: 883, cy: 350, r: 296, strokeWidth: 44 },
};

/**
 * 图层顺序（数值越大越靠上）。
 * 步摇、簪钗位于发髻之下，使簪杆自然被头发遮住；
 * 簪花、梳背位于发髻表面。
 */
export const LAYER_ORDER = {
  base: 10,
  blush: 20,
  foreheadYellow: 30,
  eyebrow: 40,
  lip: 50,
  huadian: 60,
  mianye: 62,
  xiehong: 64,
  buyao: 70,
  hairpin: 72,
  hair: 80,
  flower: 90,
  comb: 92,
};

/** 妆具热区在场景坐标系中的位置（形状：rect / ellipse / ring） */
export const HOTSPOT_SHAPES = { rect: 'rect', ellipse: 'ellipse', ring: 'ring' };
