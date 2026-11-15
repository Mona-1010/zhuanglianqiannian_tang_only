/**
 * 历史档案扩展接口（对应数据库「展开档案」表）。
 *
 * 本阶段只建立结构，不写入完整历史正文，也不虚构内容。
 * 未来接入四表 Excel（妆具表 / 妆容表 / 关联表 / 展开档案）时：
 *   1. 由 tools/sync-assets.mjs 或新的导入脚本把「展开档案」按 archiveId 生成 chapters；
 *   2. 页面无需改动，ArchiveDrawer 会按 chapters 逐章渲染正文、图片与来源；
 *   3. makeupId / toolId 的关联关系已在 tangMakeups.js、tangTools.js 中通过 archiveId 建立。
 *
 * 章节结构：
 *   {
 *     title: '章节标题',
 *     content: '正文（可直接多段，用 \n 分段）',
 *     images: [{ src, caption, credit }],
 *     sources: [{ label, url }]
 *   }
 */

/** 档案索引：archiveId → 标题与所属类型 */
export const tangArchiveIndex = {
  A_TANG_MIRROR: { title: '唐代铜镜：方寸之间，映见万象', kind: 'tool' },
  A_TANG_BROWS: { title: '唐代画眉：眉间风尚', kind: 'tool' },
  A_TANG_POWDER: { title: '唐代粉妆：粉白之间', kind: 'tool' },
  A_TANG_ROUGE: { title: '唐代胭脂：颊上红云', kind: 'tool' },
  A_TANG_LIP: { title: '唐代唇脂：朱唇与润泽', kind: 'tool' },
  A_TANG_FACE: { title: '唐代面饰：花钿、面靥与斜红', kind: 'tool' },
  A_TANG_FOREHEAD: { title: '唐代额黄妆料（黄粉盒）：文化档案', kind: 'tool' },
  A_TANG_HAIR: { title: '唐代梳篦与发髻用品：文化档案', kind: 'tool' },
  A_TANG_HAIRPIN: { title: '唐代发饰匣（簪钗饰物）：文化档案', kind: 'tool' },
  A_TANG_CASE: { title: '唐代妆奁（综合收纳）：文化档案', kind: 'tool' },

  A_TANG_M001: { title: '柳叶眉：眉形介绍与史料依据', kind: 'makeup' },
  A_TANG_M002: { title: '桂叶眉（短阔眉）：眉形介绍与史料依据', kind: 'makeup' },
  A_TANG_M003: { title: '八字眉（鸳鸯眉）：眉形介绍与史料依据', kind: 'makeup' },
  A_TANG_M004: { title: '远山眉（小山眉）：眉形介绍与史料依据', kind: 'makeup' },
  A_TANG_M005: { title: '却月眉（月棱眉）：眉形介绍与史料依据', kind: 'makeup' },
  A_TANG_M006: { title: '白粉妆：档案', kind: 'makeup' },
  A_TANG_M007: { title: '素颜：档案', kind: 'makeup' },
  A_TANG_M012: { title: '唐代花钿：文化总介绍', kind: 'makeup' },
  A_TANG_M013: { title: '唐代面靥：文化总介绍', kind: 'makeup' },
  A_TANG_M014: { title: '唐代斜红：文化总介绍', kind: 'makeup' },
  A_TANG_M020: { title: '额黄（涂黄）：妆容独立档案', kind: 'makeup' },
  A_TANG_M022: { title: '桃花妆（粉与胭脂结合）：妆容独立档案', kind: 'makeup' },
  A_TANG_M023: { title: '酒晕妆（浓红晕染）：妆容独立档案', kind: 'makeup' },
  A_TANG_M024: { title: '樱桃小口（点唇）：妆容独立档案', kind: 'makeup' },
  A_TANG_M025: { title: '檀口（浅色唇脂）：妆容独立档案', kind: 'makeup' },
  A_TANG_M026: { title: '乌膏唇（元和时世妆）：妆容独立档案', kind: 'makeup' },
  A_TANG_M033: { title: '飞霞妆：妆容独立档案', kind: 'makeup' },
  A_TANG_M027: { title: '双刀半翻髻：发式档案', kind: 'makeup' },
  A_TANG_M028: { title: '反绾髻：发式档案', kind: 'makeup' },
  A_TANG_M029: { title: '倭堕髻：发式档案', kind: 'makeup' },
  A_TANG_M030: { title: '单刀半翻髻：发式档案', kind: 'makeup' },
  A_TANG_M038: { title: '双环望仙髻：发式档案', kind: 'makeup' },
  A_TANG_FLOWERS: { title: '唐代簪花：文化总介绍', kind: 'makeup' },
  A_TANG_COMBS: { title: '唐代梳背：文化总介绍', kind: 'makeup' },
  A_TANG_BUYAO: { title: '唐代步摇：文化总介绍', kind: 'makeup' },
  A_TANG_PINS: { title: '唐代簪钗：文化总介绍', kind: 'makeup' },
};

/**
 * 档案正文：结构已就绪，正文待接入数据库。
 * 接入后形如：
 *   A_TANG_M002: { chapters: [{ title:'一、眉式由来', content:'…', images:[…], sources:[…] }] }
 */
export const tangArchives = {};

/** 尚未建立独立档案的妆容（记录缺项，便于以后补录） */
export const missingArchiveRecord = {
  TANG_M034: '花钿·三叶形',
  TANG_M035: '花钿·火焰形',
  TANG_M036: '花钿·宝相花形',
  TANG_M037: '花钿·桃形',
};

export function getArchive(archiveId) {
  if (!archiveId) return null;
  const index = tangArchiveIndex[archiveId] || null;
  const data = tangArchives[archiveId] || null;
  if (!index && !data) return null;
  return {
    archiveId,
    title: data?.title || index?.title || archiveId,
    kind: index?.kind || data?.kind || 'makeup',
    chapters: data?.chapters || [],
  };
}
