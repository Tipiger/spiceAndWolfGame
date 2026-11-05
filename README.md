# 狼与香辛料 · 行商旅记

本地单人浏览器行商游戏。扮演罗伦斯，与赫萝同行，在五座城镇间采购、装车、交易，并在固定截止日前交付收购公告。当前为 **v0.8，城市节庆与行商消息版**。主线路标、条件与奖励保持原有设计。

## 游玩

[在线游玩](https://tipiger.github.io/spiceAndWolfGame/) · [GitHub 仓库](https://github.com/Tipiger/spiceAndWolfGame) · [自动发布状态](https://github.com/Tipiger/spiceAndWolfGame/actions/workflows/pages.yml)。维护方式与文件范围见 [GitHub 仓库与发布说明](docs/github-pages.md)。

直接用 Chrome、Safari 或 Edge 打开 `index.html`，macOS 可双击 `启动游戏.command`。运行文件已包含编译后的数值，不需要账号、网络或安装依赖。

本地预览需要 Node.js 18+ 和 Python 3.9+：

```sh
npm start
```

访问 <http://127.0.0.1:4173/>。Ctrl+C 关闭服务，`PORT=4174 npm start` 可更换端口。启动预览会先校验并编译策划表。

## 维护数值

**唯一数值来源：[design/数值策划.xlsx](design/数值策划.xlsx)。** 用 Excel 或 WPS 修改蓝字数值，保存后运行：

```sh
npm run balance
npm run verify
```

然后刷新游戏并开启新旅程。直接打开 HTML 也会使用编译结果，不在游玩时读取 Excel。不要手改 `js/balance.generated.js`，也不要在代码里补一份同名参数。

策划表覆盖全局参数、商品、城镇市场、商路、收购公告、主线路标、开局货物和随机事件。参数定义、单位、修改示例及校验规则见 [docs/balancing.md](docs/balancing.md)。

## 已实现玩法

- 地图是主界面；悬浮城镇查看行情，点击打开详情，支持拖动、缩放、马车定位和沿路行进动画。马车使用赫萝与罗伦斯的超大头像E版，左右互挤两帧按500ms/帧循环。
- 各城仅交易部分商品。金额统一使用特雷尼银币，按 `¼`、`½`、`¾` 结算。
- 收购公告全图公开，无需领取。自行采购，在截止日或之前抵达收购地直接交货；收购地的普通市场不交易对应商品。交货或过期后按表配置冷却并再次发布。
- 马车同时限制占格和重量；货栈可移动、旋转及整理。食品按购入批次腐坏，优先消耗较早到期的批次。
- 市场商品图鉴支持悬浮、Tab 聚焦和点击固定，说明原作情境、货源、保鲜及装载信息。
- 四个主线路标覆盖相遇、帕兹欧毛皮生意、公告交货后的信用与北行胡椒交易，逐步开放城镇和借贷。
- 日历记录旅程日期、公告截止与再发布；旅途手账记录收支与原作资料，收录六张选定小说插图。
- 降低公告收益、收窄相邻市场价差，并提高旅费；顺路交货与回程配货更有价值。
- 大暴雨影响一段双向商路，下雨日半速行进，雨停恢复；大丰收暂时使一个城镇的一种产出货物库存翻倍、行情降至七折；城市节庆提高当地酒、苹果和奶酪的需求与行情。
- 每个城镇均有酒馆，旅行每天也可能遇见旅人。未来消息提前两天可获悉，先听地点和大意，再补充日期与货物；对白始终可信，细节逐次增加。
- “资讯”统一展示全球正在生效的事件、听到的未来消息、收购公告和成交记录。已发生事件直接公开，只有已问明的未来日期进入日历。
- 事件开始或初次听到消息时，用官网彩色参考生成的配图与人物对白弹窗确认；途中暂停，确认后继续，刷新后待确认消息仍保留。
- PC顶部统一展示日期、银币与旅程导航，右下城镇区集中市场、商会、酒馆与马车定位。手机竖屏采用顶部日期/银币、底部资讯/马车/存档/更多，市场以商品卡片展示，内容面板保留底部导航；日期打开日历，银币打开手账。城镇与市场页的“收购公告”tab展示本城公告。
- 旅行逐日结算，途中事件会影响实际抵达日；支持中途自动保存与继续行进。
- 自动保存、JSON 文件存读档和路标回退。当前只接受 **v8 且数值版本相同**的存档，调参后开启新档，不做兼容迁移。

价格、库存、日数及装载参数以策划表为准。经营日期为拟制行商历，原作地理与商品情境不等于游戏经济数值。事件时序、效果与消息规则见 [docs/random-events.md](docs/random-events.md)。

## 开发与交接

先读 [AGENTS.md](AGENTS.md) 和 [docs/handoff.md](docs/handoff.md)。数据与界面的职责见 [docs/architecture.md](docs/architecture.md)。

```sh
npm run balance       # 编译与校验数值表
npm run check         # 检查数值是否过期、源码语法及入口引用
npm test              # 引擎行为与策划表导入测试
npm run verify        # 完整检查
npm run build:pages   # 完整检查后输出 GitHub Pages 静态站点到 _site/
npm run package       # 检查通过后生成当前离线发行包
```

`python3 scripts/package.py --list` 可预览发行清单。发行包包含策划表、源码、当前素材与文档；不包含整套原作书库、依赖缓存或其他发行包。验收与回归结果见 [docs/validation.md](docs/validation.md)。

## 原作与素材

原作依据：[docs/sources.md](docs/sources.md)；小说文字定位：[docs/novel-content.md](docs/novel-content.md)；原作插图：[docs/novel-art.md](docs/novel-art.md)；图片来源与实际生成提示词：[docs/assets-sources.md](docs/assets-sources.md)；历法：[docs/calendar-design.md](docs/calendar-design.md)。

`assets/狼与香辛料原作/` 是用户提供的创作参考资料，保留原样，不是运行依赖，不加入离线发行包。运行只加载已选素材。私人同人游戏，原作支仓冻砂，小说插画文仓十。
