# GitHub 仓库与 Pages 发布

游戏由普通 HTML、CSS、JavaScript 和本地素材构成，GitHub Pages 直接提供静态文件。在线游玩不需要账号、后端或额外运行依赖，本地双击 `index.html` 的方式仍然可用。

## 仓库与访问入口

- 公开仓库：[Tipiger/spiceAndWolfGame](https://github.com/Tipiger/spiceAndWolfGame)，日常维护分支为 `main`。
- 在线游玩：[狼与香辛料 · 行商旅记](https://tipiger.github.io/spiceAndWolfGame/)。
- 构建与发布：[Verify and deploy GitHub Pages](https://github.com/Tipiger/spiceAndWolfGame/actions/workflows/pages.yml)。

2026-11-05 已完成手动发布与线上浏览器验收。Pages 来源为 GitHub Actions，HTTPS 已强制启用；配置包含 `main` 推送触发，完整验证成功才会更新站点。本轮尚未观察到推送自动创建运行记录；如果推送后没有任务，在工作流页面选择 **Run workflow**，分支选 `main`，即可完成已验证可用的发布流程。

## 在其他电脑继续维护

先安装 Git、Node.js 18+ 和 Python 3.9+，然后克隆现有仓库：

```sh
git clone https://github.com/Tipiger/spiceAndWolfGame.git
cd spiceAndWolfGame
npm run verify
```

克隆后可以直接打开 `index.html` 游玩，也可运行 `npm start` 本地预览。项目没有需要安装的 npm 依赖。整套原作库、个人存档及本地发行包不在仓库中，不影响游戏运行；在新电脑推送改动前需登录有仓库写入权限的 GitHub 账号。

## 复制为自己的仓库时

将项目副本推送到自己的仓库后，在 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。然后在 **Actions → Verify and deploy GitHub Pages** 查看运行结果；若第一次推送早于开启 Pages，选择 **Run workflow** 重新运行。

部署成功后，**Settings → Pages** 和工作流的 `github-pages` 环境显示该副本的实际访问地址，通常为 `https://你的用户名.github.io/你的仓库名/`。原仓库的发布地址和本地 Git 的 `origin` 无需修改；只有维护自己的副本时才使用对应仓库地址。

GitHub 免费账号支持公开仓库的 Pages；私有仓库是否支持取决于账号套餐。发布来源的配置和权限遵循 [GitHub 官方说明](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 日常维护

保持每次提交对应一项可说明的改动。修改经营数值时，只编辑 `design/数值策划.xlsx`，然后运行 `npm run balance`，将表格和生成的 `js/balance.generated.js` 一起提交。

```sh
npm run verify
git status
git add 要提交的文件
git commit -m "说明本次改动"
git push
```

推送 `main` 后，工作流会重新校验数值、检查源码并运行全部测试，然后构建并部署。检查失败时不会部署，线上继续使用上次成功版本。合并请求只验证和构建，不发布。

## 发布范围

| 内容 | Git 仓库 | Pages 站点 |
| --- | --- | --- |
| `index.html`、根目录 CSS、`js/` | 纳入 | 纳入 |
| `assets/runtime/` 中实际使用的 WebP 展示图与 SVG 标记 | 纳入 | 纳入 |
| `assets/source/` 的母版、原尺寸修复输入和官网原图 | 纳入，保留来源；可编辑离线包同时包含 | 不发布、不预加载 |
| `design/数值策划.xlsx`、`scripts/`、`tests/`、`package.json` | 纳入 | 不发布 |
| `design/previews/` 的本地设计候选与对比预览 | 仅留本地 | 不发布 |
| `README.md`、`AGENTS.md`、`.github/`、`.gitignore` | 纳入 | 不发布 |
| `docs/` 的考据、来源、有效提示词和维护说明 | 纳入 | 发布 Markdown，保证游戏来源链接可访问 |
| `docs/screenshots/` 当前验收图 | 纳入 | 不发布 |
| `assets/狼与香辛料原作/` 整套小说正文、原始扫描图及参考文件 | 不纳入，保留本地 | 不发布 |
| `_site/`、`releases/`、缓存、依赖、环境密钥、导出存档、Excel 临时锁文件 | 不纳入 | 不作为源文件发布 |

选入 `assets/source/novel/` 的插图母版、修复输入和 `assets/runtime/novel/` 的 WebP 展示图，和原作库里的完整参考材料分别管理；游戏不会读取被忽略的原作库。制作源与展示图对应关系和摘要见 `scripts/image-exports.json`。考据文档记录原作定位和改编依据，不包含整套原文。

`npm run build:pages` 完整检查后生成 `_site/`，只包含游戏入口、样式、脚本、实际使用的素材与来源等 Markdown 文档，本地WebP版本的28张运行图片共11.35 MiB，站点约11.88 MiB，尚未发布线上。`python3 -B scripts/build_pages.py --list` 可以只查看清单。发布产物入口的本地JS/CSS使用内容SHA256前12位的`?v=`参数，避免旧缓存脚本与更新后的素材混用；源码`index.html`保持原路径，离线方式不变。Actions直接部署静态文件，不经过Jekyll，仓库子目录仍使用相对路径。

`.gitignore` 排除 `_site/`、离线发行包、依赖缓存、环境密钥文件、常见存档文件，以及整套 `assets/狼与香辛料原作/`。原作资料库保留在本地，不上传、不进入站点。选定的原作插图及来源标记作为游戏实际资产保留。源码、测试、策划表、文档和工作流由 Git 管理，站点构建不包含开发脚本、测试或策划表。

自动存档保存在当前浏览器的本地存储中，不会上传 GitHub。同一设备上的本地文件、本地预览和 Pages 网站各自保存旅程；需要转移时，在原入口导出 JSON，再到新入口导入。存档仍需满足游戏当前版本和数值摘要，不做兼容迁移。
