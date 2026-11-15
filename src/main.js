import { mountTangScene } from './components/tangDressingScene.js';

/**
 * 入口：仅挂载唐代场景（纯静态 ES Module，无构建步骤）。
 * 样式在 index.html 中通过 <link> 引入，便于直接部署到 GitHub Pages。
 * 未来四朝站点可在此处改为场景切换/路由，唐代本身保持为可独立嵌入的组件。
 */
function boot() {
  mountTangScene(document.body);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
