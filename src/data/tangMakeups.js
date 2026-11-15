import { LAYER_ORDER } from './tangSceneLayout.js';
import { tangAssetMeta } from './tangAssetMeta.js';

/**
 * 唐代 41 个互动选项（数量与《妆奁千年》唐代数据库一致）：
 * 底妆 2 · 眉妆 5 · 胭脂 3 · 唇妆 3 · 额黄 1 · 花钿 6 · 面靥 1 · 斜红 1
 * 发髻 5 · 簪花 4 · 梳背 2 · 步摇 2 · 簪钗 6
 *
 * 字段说明：
 *   id            与数据库「妆容表」makeup_id 一致
 *   category      选择分组（一个分组内互斥；toggle 型分组为开关）
 *   stateKey      写入 makeupState 的字段名
 *   mode          exclusive（组内互斥）| toggle（独立开关）
 *   assetPath     静态资源相对路径
 *   archiveId     对应「展开档案」档案ID；null 表示尚未建立独立档案
 *   layerOrder    人物图层叠放顺序
 *   exclusiveGroup 同类互斥组标识
 */

/** 选择分组元信息：抽屉第二层的标题、副标题、缩略图裁切框、排版方式 */
export const makeupGroups = {
  base: {
    key: 'base',
    stateKey: 'base',
    mode: 'exclusive',
    archiveLabel: '唐 · 底妆',
    tab: '底妆',
    heading: '敷粉',
    lead: '素颜与白粉，二者择一，其余妆容皆不动。',
    thumb: { w: 46, h: 46 },
    layout: 'list',
  },
  eyebrow: {
    key: 'eyebrow',
    stateKey: 'eyebrow',
    mode: 'exclusive',
    archiveLabel: '唐 · 眉式',
    tab: '眉妆',
    heading: '择眉',
    lead: '择一眉式，为镜中人妆点。',
    thumb: { w: 78, h: 34 },
    layout: 'list',
  },
  blush: {
    key: 'blush',
    stateKey: 'blush',
    mode: 'exclusive',
    archiveLabel: '唐 · 颊妆',
    tab: '胭脂',
    heading: '匀面',
    lead: '三种胭脂，浓淡各别，一次只施一种。',
    thumb: { w: 62, h: 46 },
    layout: 'list',
  },
  lip: {
    key: 'lip',
    stateKey: 'lip',
    mode: 'exclusive',
    archiveLabel: '唐 · 唇式',
    tab: '唇妆',
    heading: '点唇',
    lead: '择一唇色，朱唇之上只留一种。',
    thumb: { w: 50, h: 36 },
    layout: 'list',
  },
  foreheadYellow: {
    key: 'foreheadYellow',
    stateKey: 'foreheadYellow',
    mode: 'toggle',
    archiveLabel: '唐 · 额妆',
    tab: '额黄',
    heading: '涂黄',
    lead: '额黄可与花钿同时施用，可开可关。',
    thumb: { w: 70, h: 40 },
    layout: 'list',
  },
  huadian: {
    key: 'huadian',
    stateKey: 'huadian',
    mode: 'exclusive',
    archiveLabel: '唐 · 花钿',
    tab: '花钿',
    heading: '花钿',
    lead: '六种额间纹样，一次择一。',
    thumb: { w: 36, h: 36 },
    layout: 'grid',
  },
  mianye: {
    key: 'mianye',
    stateKey: 'mianye',
    mode: 'toggle',
    archiveLabel: '唐 · 面靥',
    tab: '面靥',
    heading: '点靥',
    lead: '两颊点饰，可独立开关。',
    thumb: { w: 58, h: 30 },
    layout: 'list',
  },
  xiehong: {
    key: 'xiehong',
    stateKey: 'xiehong',
    mode: 'toggle',
    archiveLabel: '唐 · 斜红',
    tab: '斜红',
    heading: '斜红',
    lead: '面侧弦月红饰，可与花钿、面靥并用。',
    thumb: { w: 58, h: 30 },
    layout: 'list',
  },
  hair: {
    key: 'hair',
    stateKey: 'hair',
    mode: 'exclusive',
    archiveLabel: '唐 · 发髻',
    tab: '发髻',
    heading: '绾髻',
    lead: '五款完整髻式，一次只挽一种。',
    thumb: { w: 54, h: 58 },
    layout: 'list',
  },
  flower: {
    key: 'flower',
    stateKey: 'flower',
    mode: 'exclusive',
    archiveLabel: '唐 · 簪花',
    tab: '簪花',
    heading: '簪花',
    lead: '花饰簪于髻上，一次择一，可与簪钗同用。',
    thumb: { w: 44, h: 34 },
    layout: 'grid',
  },
  comb: {
    key: 'comb',
    stateKey: 'comb',
    mode: 'exclusive',
    archiveLabel: '唐 · 梳背',
    tab: '梳背',
    heading: '插梳',
    lead: '梳背插于髻前，一次择一。',
    thumb: { w: 56, h: 36 },
    layout: 'list',
  },
  buyao: {
    key: 'buyao',
    stateKey: 'buyao',
    mode: 'exclusive',
    archiveLabel: '唐 · 步摇',
    tab: '步摇',
    heading: '步摇',
    lead: '步摇垂珠随步而动，一次择一。',
    thumb: { w: 56, h: 44 },
    layout: 'list',
  },
  hairpin: {
    key: 'hairpin',
    stateKey: 'hairpin',
    mode: 'exclusive',
    archiveLabel: '唐 · 簪钗',
    tab: '簪钗',
    heading: '簪钗',
    lead: '六款簪钗，一次择一，插于髻下。',
    thumb: { w: 44, h: 32 },
    layout: 'grid',
  },
};

/** 41 个选项本体 */
export const tangMakeups = [
  /* ---------------- 粉妆 2 ---------------- */
  {
    id: 'TANG_M007',
    name: '素颜',
    category: 'base',
    assetPath: 'assets/tang/portrait/bare.png',
    archiveId: 'A_TANG_M007',
    layerOrder: LAYER_ORDER.base,
    exclusiveGroup: 'base',
    value: 'bare',
    intro: '未叠加粉妆的初始人物底图。',
  },
  {
    id: 'TANG_M006',
    name: '白粉妆',
    category: 'base',
    assetPath: 'assets/tang/portrait/powder.png',
    archiveId: 'A_TANG_M006',
    layerOrder: LAYER_ORDER.base,
    exclusiveGroup: 'base',
    value: 'powder',
    intro: '在素颜基础上肤色略提亮，表现敷粉效果。',
  },

  /* ---------------- 眉妆 5 ---------------- */
  {
    id: 'TANG_M001',
    name: '柳叶眉',
    category: 'eyebrow',
    assetPath: 'assets/tang/makeup/eyebrow-liuye.png',
    archiveId: 'A_TANG_M001',
    layerOrder: LAYER_ORDER.eyebrow,
    exclusiveGroup: 'eyebrow',
    intro: '形似柳叶的修长眉形，是唐代文学中常见的眉妆意象。',
  },
  {
    id: 'TANG_M002',
    name: '桂叶眉',
    category: 'eyebrow',
    assetPath: 'assets/tang/makeup/eyebrow-guiye.png',
    archiveId: 'A_TANG_M002',
    layerOrder: LAYER_ORDER.eyebrow,
    exclusiveGroup: 'eyebrow',
    intro: '短而浓阔、轮廓醒目的眉形，是讨论中晚唐眉妆时常见的代表。',
  },
  {
    id: 'TANG_M003',
    name: '八字眉',
    category: 'eyebrow',
    assetPath: 'assets/tang/makeup/eyebrow-bazi.png',
    archiveId: 'A_TANG_M003',
    layerOrder: LAYER_ORDER.eyebrow,
    exclusiveGroup: 'eyebrow',
    intro: '两眉走势向外下垂，形如“八”字，在唐代眉式记述中有名。',
  },
  {
    id: 'TANG_M004',
    name: '远山眉',
    category: 'eyebrow',
    assetPath: 'assets/tang/makeup/eyebrow-yuanshan.png',
    archiveId: 'A_TANG_M004',
    layerOrder: LAYER_ORDER.eyebrow,
    exclusiveGroup: 'eyebrow',
    intro: '以远山般的柔和线条命名，是古代诗意眉妆中辨识度较高的一种。',
  },
  {
    id: 'TANG_M005',
    name: '却月眉',
    category: 'eyebrow',
    assetPath: 'assets/tang/makeup/eyebrow-queyue.png',
    archiveId: 'A_TANG_M005',
    layerOrder: LAYER_ORDER.eyebrow,
    exclusiveGroup: 'eyebrow',
    intro: '以新月轮廓得名的弯月形眉式，适合与柳叶眉、八字眉形成明显对比。',
  },

  /* ---------------- 胭脂 3 ---------------- */
  {
    id: 'TANG_M022',
    name: '桃花妆',
    category: 'blush',
    assetPath: 'assets/tang/makeup/blush-taohua.png',
    archiveId: 'A_TANG_M022',
    layerOrder: LAYER_ORDER.blush,
    exclusiveGroup: 'blush',
    intro: '白粉底上施较明显的桃红胭脂，浓度介于飞霞妆与酒晕妆之间。',
  },
  {
    id: 'TANG_M023',
    name: '酒晕妆',
    category: 'blush',
    assetPath: 'assets/tang/makeup/blush-jiuyun.png',
    archiveId: 'A_TANG_M023',
    layerOrder: LAYER_ORDER.blush,
    exclusiveGroup: 'blush',
    intro: '两颊浓施胭脂，红晕浓烈，较桃花妆更深。',
  },
  {
    id: 'TANG_M033',
    name: '飞霞妆',
    category: 'blush',
    assetPath: 'assets/tang/makeup/blush-feixia.png',
    archiveId: 'A_TANG_M033',
    layerOrder: LAYER_ORDER.blush,
    exclusiveGroup: 'blush',
    intro: '薄施朱色后覆粉，形成三种妆式中最轻淡的红晕。',
  },

  /* ---------------- 唇妆 3 ---------------- */
  {
    id: 'TANG_M024',
    name: '樱桃小口',
    category: 'lip',
    assetPath: 'assets/tang/makeup/lip-yingtao.png',
    archiveId: 'A_TANG_M024',
    layerOrder: LAYER_ORDER.lip,
    exclusiveGroup: 'lip',
    intro: '以局部点画营造较小、圆润的着色唇形。',
    assetNote: '正式素材目前只提供「白粉适配」版本，素颜适配版待补。',
  },
  {
    id: 'TANG_M025',
    name: '檀口',
    category: 'lip',
    assetPath: 'assets/tang/makeup/lip-tan.png',
    archiveId: 'A_TANG_M025',
    layerOrder: LAYER_ORDER.lip,
    exclusiveGroup: 'lip',
    intro: '以偏浅的红色呈现，突出唐代唇妆的色彩差异。',
  },
  {
    id: 'TANG_M026',
    name: '乌膏唇',
    category: 'lip',
    assetPath: 'assets/tang/makeup/lip-wugao.png',
    archiveId: 'A_TANG_M026',
    layerOrder: LAYER_ORDER.lip,
    exclusiveGroup: 'lip',
    intro: '中晚唐被记述的乌黑色唇妆，与八字眉可形成有意思的组合。',
  },

  /* ---------------- 额黄 1 ---------------- */
  {
    id: 'TANG_M020',
    name: '额黄',
    category: 'foreheadYellow',
    assetPath: 'assets/tang/makeup/forehead-yellow.png',
    archiveId: 'A_TANG_M020',
    layerOrder: LAYER_ORDER.foreheadYellow,
    exclusiveGroup: 'foreheadYellow',
    intro: '以前额鹅黄色平涂表现额黄，可与花钿同施。',
  },

  /* ---------------- 花钿 6 ---------------- */
  {
    id: 'TANG_M015',
    name: '梅花形',
    category: 'huadian',
    assetPath: 'assets/tang/makeup/huadian-01.png',
    archiveId: 'A_TANG_M012',
    layerOrder: LAYER_ORDER.huadian,
    exclusiveGroup: 'huadian',
    intro: '额部花钿纹样之一，五瓣梅花式。',
  },
  {
    id: 'TANG_M016',
    name: '圆点形',
    category: 'huadian',
    assetPath: 'assets/tang/makeup/huadian-02.png',
    archiveId: 'A_TANG_M012',
    layerOrder: LAYER_ORDER.huadian,
    exclusiveGroup: 'huadian',
    intro: '额部花钿纹样之一，素圆点式。',
  },
  {
    id: 'TANG_M034',
    name: '三叶形',
    category: 'huadian',
    assetPath: 'assets/tang/makeup/huadian-03.png',
    archiveId: 'A_TANG_M012',
    layerOrder: LAYER_ORDER.huadian,
    exclusiveGroup: 'huadian',
    intro: '额部花钿纹样之一，三叶舒展式。',
    archiveNote: '数据库暂无独立档案ID，暂挂「花钿文化总介绍」。',
  },
  {
    id: 'TANG_M035',
    name: '火焰形',
    category: 'huadian',
    assetPath: 'assets/tang/makeup/huadian-04.png',
    archiveId: 'A_TANG_M012',
    layerOrder: LAYER_ORDER.huadian,
    exclusiveGroup: 'huadian',
    intro: '额部花钿纹样之一，火焰升腾式。',
    archiveNote: '数据库暂无独立档案ID，暂挂「花钿文化总介绍」。',
  },
  {
    id: 'TANG_M036',
    name: '宝相花形',
    category: 'huadian',
    assetPath: 'assets/tang/makeup/huadian-05.png',
    archiveId: 'A_TANG_M012',
    layerOrder: LAYER_ORDER.huadian,
    exclusiveGroup: 'huadian',
    intro: '额部花钿纹样之一，宝相花式。',
    archiveNote: '数据库暂无独立档案ID，暂挂「花钿文化总介绍」。',
  },
  {
    id: 'TANG_M037',
    name: '桃形',
    category: 'huadian',
    assetPath: 'assets/tang/makeup/huadian-06.png',
    archiveId: 'A_TANG_M012',
    layerOrder: LAYER_ORDER.huadian,
    exclusiveGroup: 'huadian',
    intro: '额部花钿纹样之一，桃心式。',
    archiveNote: '数据库暂无独立档案ID，暂挂「花钿文化总介绍」。',
  },

  /* ---------------- 面靥 / 斜红 ---------------- */
  {
    id: 'TANG_M018',
    name: '点状面靥',
    category: 'mianye',
    assetPath: 'assets/tang/makeup/mianye-dot.png',
    archiveId: 'A_TANG_M013',
    layerOrder: LAYER_ORDER.mianye,
    exclusiveGroup: 'mianye',
    intro: '在两颊点饰，可独立开启或取消。',
  },
  {
    id: 'TANG_M019',
    name: '弦月斜红',
    category: 'xiehong',
    assetPath: 'assets/tang/makeup/xiehong-crescent.png',
    archiveId: 'A_TANG_M014',
    layerOrder: LAYER_ORDER.xiehong,
    exclusiveGroup: 'xiehong',
    intro: '面侧弦月状红饰，可独立开启或取消。',
  },

  /* ---------------- 发髻 5 ---------------- */
  {
    id: 'TANG_M030',
    name: '单刀半翻髻',
    category: 'hair',
    assetPath: 'assets/tang/hair/hair-01.png',
    archiveId: 'A_TANG_M030',
    layerOrder: LAYER_ORDER.hair,
    exclusiveGroup: 'hair',
    intro: '完整发型图层，覆盖贴头皮底图。',
  },
  {
    id: 'TANG_M027',
    name: '双刀半翻髻',
    category: 'hair',
    assetPath: 'assets/tang/hair/hair-02.png',
    archiveId: 'A_TANG_M027',
    layerOrder: LAYER_ORDER.hair,
    exclusiveGroup: 'hair',
    intro: '完整发型图层，覆盖贴头皮底图。',
  },
  {
    id: 'TANG_M028',
    name: '反绾髻',
    category: 'hair',
    assetPath: 'assets/tang/hair/hair-03.png',
    archiveId: 'A_TANG_M028',
    layerOrder: LAYER_ORDER.hair,
    exclusiveGroup: 'hair',
    intro: '完整发型图层，覆盖贴头皮底图。',
  },
  {
    id: 'TANG_M029',
    name: '倭堕髻',
    category: 'hair',
    assetPath: 'assets/tang/hair/hair-04.png',
    archiveId: 'A_TANG_M029',
    layerOrder: LAYER_ORDER.hair,
    exclusiveGroup: 'hair',
    intro: '完整发型图层，覆盖贴头皮底图。',
  },
  {
    id: 'TANG_M038',
    name: '双环望仙髻',
    category: 'hair',
    assetPath: 'assets/tang/hair/hair-05.png',
    archiveId: 'A_TANG_M038',
    layerOrder: LAYER_ORDER.hair,
    exclusiveGroup: 'hair',
    intro: '完整发型图层，覆盖贴头皮底图。',
  },

  /* ---------------- 簪花 4 ---------------- */
  {
    id: 'TANG_M040',
    name: '簪花·样式01',
    category: 'flower',
    assetPath: 'assets/tang/hair/flower-01.png',
    archiveId: 'A_TANG_FLOWERS',
    layerOrder: LAYER_ORDER.flower,
    exclusiveGroup: 'flower',
    intro: '参考《簪花仕女图》第 1 位人物头部花饰（从左至右计）。',
  },
  {
    id: 'TANG_M041',
    name: '簪花·样式02',
    category: 'flower',
    assetPath: 'assets/tang/hair/flower-02.png',
    archiveId: 'A_TANG_FLOWERS',
    layerOrder: LAYER_ORDER.flower,
    exclusiveGroup: 'flower',
    intro: '参考《簪花仕女图》第 3 位人物头部花饰（从左至右计）。',
  },
  {
    id: 'TANG_M042',
    name: '簪花·样式03',
    category: 'flower',
    assetPath: 'assets/tang/hair/flower-03.png',
    archiveId: 'A_TANG_FLOWERS',
    layerOrder: LAYER_ORDER.flower,
    exclusiveGroup: 'flower',
    intro: '参考《簪花仕女图》第 5 位人物头部花饰（从左至右计）。',
  },
  {
    id: 'TANG_M043',
    name: '簪花·样式04',
    category: 'flower',
    assetPath: 'assets/tang/hair/flower-04.png',
    archiveId: 'A_TANG_FLOWERS',
    layerOrder: LAYER_ORDER.flower,
    exclusiveGroup: 'flower',
    intro: '参考《簪花仕女图》第 6 位人物头部花饰（从左至右计）。',
  },

  /* ---------------- 梳背 2 ---------------- */
  {
    id: 'TANG_M044',
    name: '梳背·样式01',
    category: 'comb',
    assetPath: 'assets/tang/hair/comb-01.png',
    archiveId: 'A_TANG_COMBS',
    layerOrder: LAYER_ORDER.comb,
    exclusiveGroup: 'comb',
    intro: '金色镂空花纹梳背，髻前插戴。',
  },
  {
    id: 'TANG_M045',
    name: '梳背·样式02',
    category: 'comb',
    assetPath: 'assets/tang/hair/comb-02.png',
    archiveId: 'A_TANG_COMBS',
    layerOrder: LAYER_ORDER.comb,
    exclusiveGroup: 'comb',
    intro: '牡丹云纹金色梳背，髻前插戴。',
  },

  /* ---------------- 步摇 2 ---------------- */
  {
    id: 'TANG_M046',
    name: '步摇·样式01',
    category: 'buyao',
    assetPath: 'assets/tang/hair/buyao-01.png',
    archiveId: 'A_TANG_BUYAO',
    layerOrder: LAYER_ORDER.buyao,
    exclusiveGroup: 'buyao',
    intro: '粉色花枝、珍珠弧形垂饰。',
  },
  {
    id: 'TANG_M047',
    name: '步摇·样式02',
    category: 'buyao',
    assetPath: 'assets/tang/hair/buyao-02.png',
    archiveId: 'A_TANG_BUYAO',
    layerOrder: LAYER_ORDER.buyao,
    exclusiveGroup: 'buyao',
    intro: '金色花鸟造型，珠饰向下垂。',
  },

  /* ---------------- 簪钗 6 ---------------- */
  {
    id: 'TANG_M048',
    name: '簪钗·样式01',
    category: 'hairpin',
    assetPath: 'assets/tang/hair/pin-01.png',
    archiveId: 'A_TANG_PINS',
    layerOrder: LAYER_ORDER.hairpin,
    exclusiveGroup: 'hairpin',
    intro: '金色花鸟单股簪。',
  },
  {
    id: 'TANG_M049',
    name: '簪钗·样式02',
    category: 'hairpin',
    assetPath: 'assets/tang/hair/pin-02.png',
    archiveId: 'A_TANG_PINS',
    layerOrder: LAYER_ORDER.hairpin,
    exclusiveGroup: 'hairpin',
    intro: '金色花鸟双股钗。',
  },
  {
    id: 'TANG_M050',
    name: '簪钗·样式03',
    category: 'hairpin',
    assetPath: 'assets/tang/hair/pin-03.png',
    archiveId: 'A_TANG_PINS',
    layerOrder: LAYER_ORDER.hairpin,
    exclusiveGroup: 'hairpin',
    intro: '金银色花纹双股钗。',
  },
  {
    id: 'TANG_M051',
    name: '簪钗·样式04',
    category: 'hairpin',
    assetPath: 'assets/tang/hair/pin-04.png',
    archiveId: 'A_TANG_PINS',
    layerOrder: LAYER_ORDER.hairpin,
    exclusiveGroup: 'hairpin',
    intro: '银色花枝单股簪。',
  },
  {
    id: 'TANG_M052',
    name: '簪钗·样式05',
    category: 'hairpin',
    assetPath: 'assets/tang/hair/pin-05.png',
    archiveId: 'A_TANG_PINS',
    layerOrder: LAYER_ORDER.hairpin,
    exclusiveGroup: 'hairpin',
    intro: '扇形银色单股簪。',
  },
  {
    id: 'TANG_M053',
    name: '簪钗·样式06',
    category: 'hairpin',
    assetPath: 'assets/tang/hair/pin-06.png',
    archiveId: 'A_TANG_PINS',
    layerOrder: LAYER_ORDER.hairpin,
    exclusiveGroup: 'hairpin',
    intro: '银色花鸟双股钗。',
  },
];

/* ---------------- 索引与工具函数 ---------------- */

export const makeupById = new Map(tangMakeups.map((m) => [m.id, m]));

export const makeupByCategory = tangMakeups.reduce((acc, m) => {
  (acc[m.category] ||= []).push(m);
  return acc;
}, {});

/** 某一分组当前选中的妆容对象（含 toggle 型分组） */
export function selectedOfCategory(state, category) {
  const group = makeupGroups[category];
  if (!group) return null;
  const v = state[group.stateKey];
  if (!v || v === true || v === 'bare') return null;
  return makeupById.get(v) || null;
}

/**
 * 由 makeupState 解析出需要在镜中叠加的图层列表。
 * 关键：所有图层共用一个 1199×1312 画布原点，只按 layerOrder 排序，绝不单独位移。
 */
export function resolveLayers(state) {
  const layers = [];

  const bare = makeupById.get('TANG_M007');
  const powder = makeupById.get('TANG_M006');
  const base = state.base === 'powder' ? powder : bare;
  layers.push({ key: 'base', src: base.assetPath, z: base.layerOrder });

  const exclusiveKeys = [
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

  for (const key of exclusiveKeys) {
    const v = state[key];
    if (!v) continue;
    const option = makeupById.get(typeof v === 'string' ? v : v.id);
    if (!option) continue;
    // 支持「同一选项按底妆切换适配版本」的扩展：variants[base] 优先
    const variantSrc = option.variants?.[state.base];
    layers.push({ key, src: variantSrc || option.assetPath, z: option.layerOrder });
  }

  return layers.sort((a, b) => a.z - b.z);
}

/** 缩略图裁切参数：把 1199×1312 图层中真正有内容的部分放进小预览框 */
export function thumbTransform(assetPath, box) {
  // tangAssetMeta 的键相对 assets/tang/，这里做一次归一化，兼容带前缀的路径
  const key = String(assetPath)
    .replace(/^\.?\//, '')
    .replace(/^assets\/tang\//, '');
  const meta = tangAssetMeta[key];
  if (!meta || !meta.bbox) return null;
  const { bbox } = meta;
  const k = Math.min(box.w / bbox.w, box.h / bbox.h);
  const tx = (box.w - bbox.w * k) / 2 - bbox.x0 * k;
  const ty = (box.h - bbox.h * k) / 2 - bbox.y0 * k;
  return { k, tx, ty, meta };
}
