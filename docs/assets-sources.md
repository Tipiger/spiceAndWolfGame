# 图片素材来源

本文记录当前游戏实际使用的图片及生成提示词。所有运行素材均保存在项目内；官方 JPEG 和用户提供的小说插图保留原图，显示裁切由 CSS 完成。原作插画：文仓十；官方地图：出光秀匡。小说插图的原文件、卷幕场景和识别依据见 [novel-art.md](novel-art.md)。

## 官方图片

下载日期：2026-11-03。优先使用原站明确提供的高分辨率资源，不将宣传图当成某座城镇或具体剧情现场的复原。

| 本地文件 | 原始尺寸 | 实际用途 | 原始图片与来源 |
| --- | --- | --- | --- |
| `assets/hero.jpg` | 1488 × 1016 | 标题与旅途主视觉，罗伦斯与赫萝的官方宣传插画。 | [作者官网](https://hasekuraisuna.jp/) · [原图](https://hasekuraisuna.jp/assets/img/top/slider/0@2x.jpg) |
| `assets/holo.jpg` | 640 × 772 | 第一卷赫萝麦田立绘，用于旅伴卡和开场。 | [作者官网](https://hasekuraisuna.jp/) · [原图](https://hasekuraisuna.jp/assets/img/top/slider/sp1.jpg) |
| `assets/night.jpg` | 640 × 772 | 第三卷赫萝月夜立绘，仅作夜晚气氛，不冒充第一卷事件插图。 | [作者官网](https://hasekuraisuna.jp/) · [原图](https://hasekuraisuna.jp/assets/img/top/slider/sp3.jpg) |
| `assets/world-map.jpg` | 375 × 533 | 官方原作世界地图，用于定位依据与原图对照。 | [原作官方网站](https://spicy-wolf.com/1st/original/world.html) · [原图](https://spicy-wolf.com/1st/assets/images/original/world_map.jpg) |

`assets/crest.svg` 是项目自绘的简化麦穗／狼头界面标记，不是官方商标素材。

## 小说插图

`assets/novel/` 中的六张图来自用户提供的原作资料，原样复制并核对内容。它们以竖幅插页或手账图册展示，保留全部画面和原有书源标记。具体清单与场景对应见 [novel-art.md](novel-art.md)；原作文字考据见 [novel-content.md](novel-content.md)。

## AI 地图与道具

以下五张均使用内置 `image_gen.imagegen` 生成。原文件直接复制到项目，保留真实 PNG 格式与 alpha。地图以官方原图为参考，交互锚点另见 [sources.md](sources.md)；局部山林、支流、纹理与建筑属于同人补画，不是官方设定的精确复原。

| 本地文件 | 原始尺寸／格式 | 实际用途 |
| --- | --- | --- |
| `assets/world-map-v3.png` | 1052 × 1495，RGB PNG | 地形主底图，无文字或建筑，游戏另叠城镇、商路与标签。 |
| `assets/wagon-v3.png` | 1536 × 1024，RGBA PNG | 一匹棕马与木质篷车，用于地图马车和货舱入口。 |
| `assets/village-v3.png` | 1254 × 1254，RGBA PNG | 农舍、谷仓、风车的麦田村庄主题。 |
| `assets/harbor-v3.png` | 1254 × 1254，RGBA PNG | 仓库、码头、帆船与渡船的河港主题，无跨主河桥梁。 |
| `assets/cathedral-v3.png` | 1254 × 1254，RGBA PNG | 石教堂、钟楼、市集与低城墙的教会城镇主题。 |

马车、村庄、河港、教会城镇图的四角 alpha 均为0；近乎透明像素比例分别约48.2%、52.7%、54.2%、62.4%。三类城镇图表达地区主题，不代表具体建筑的原作还原。原作斯劳德主河以渡船通行，城内人工运河另有桥和水门；两者在文字与地理考据中区分。

## 实际生成提示词

以下保留五个在用资产的成功请求原文。运行游戏无需访问生成器或外部文件。

### wagon-v3.png

- 工具：`image_gen.imagegen`。
- 参数：`transparent_background=true`。
- 未使用图像参考。

```text
Use case: illustration-story.
Asset type: transparent PNG cutout used as the player's traveling merchant wagon marker on an illustrated map.
Primary request: A beautifully detailed medieval merchant's covered horse wagon, viewed at a slightly elevated three-quarter angle, traveling from left to right. The wooden wagon sits left/back, one natural chestnut horse is harnessed on its right/front. The whole horse, harness, wheels, wagon and canvas canopy must fit fully within the image with breathing room.
Style/medium: delicate Japanese light-novel pen-and-pencil linework with translucent watercolor colors and subtle hand-painted texture. Detailed aged oak spokes and planks, cream canvas canopy folds, leather straps, coiled rope and one or two small tied supply bundles. Refined and believable, readable when reduced to a map marker, with a clear dark-brown silhouette.
Composition: one isolated complete horse and covered cargo wagon, gently diagonal in a 3:2 landscape composition, the horse facing right. Warm cream, oak brown and chestnut colors, restrained golden light, visible functional wheels and plausible harness. No characters or riders.
Background: actual fully transparent alpha, including all corners and spaces around the object. Only a very subtle isolated contact shadow immediately beneath wheels/hooves if needed; no ground tile, no landscape, no painted paper rectangle, no white backdrop.
Constraints: no text, no labels, no logo, no map pin or glow, no UI, no decorative frame, no toys, no flat vector icon, no extra horse, anatomically plausible four legs.
```

### world-map-v3.png

- 工具：`image_gen.imagegen`。
- 参数：`transparent_background=false`。
- 参考图：`assets/world-map.jpg`。

```text
Use case: illustration-story. Create a refined high resolution watercolor and fine-ink medieval fantasy atlas TERRAIN MAP, portrait ratio 750:1066. Attached image is a STRICT GEOGRAPHY reference. Preserve exactly its coastline, west sea, western island, river courses, south mountains and relative geographical locations. Remove all printed text, town/building illustrations, roads, compass and clouds. Terrain only: pale parchment, muted teal water, olive forests, ochre plains, delicate hachures and relief. Mainland on right, ocean on left, separate western island. The south river runs east-west at 86% image height, from x=13% to x=72%; mountains lie north of it at x=57%..77%, y=79%..85%. North river flows from x=32%,y=41% to x=98%,y=47%. Coast passes x=62% y=10%, x=38% y=40%, x=26% y=50%, x=19% y=55%, x=10% y=79%, x=13% y=86%, x=2% y=96%. Fine detailed professional light-novel pen-and-watercolor texture, airy autumn palette. No town, bridge, building, people, label, text, lettering, UI or compass. This is a private merchant game terrain background with interactive towns layered separately. Keep every geographical silhouette faithful to the reference.
```

### village-v3.png

- 工具：`image_gen.imagegen`。
- 参数：`transparent_background=true`。
- 未使用图像参考。

```text
Use case: illustration-story. Asset: a high-quality transparent PNG settlement vignette for a medieval traveling merchant map. One compact little wheat-farming village: three timber-framed farm cottages, a small thatched barn and one modest wooden windmill, with a few tied grain sacks and subtle golden wheat stalks beside the buildings. Elevated three-quarter isometric map view. Refined Japanese light-novel watercolor and fine sepia pen-and-pencil illustration, warm ochre roofs, cream plaster, aged oak and soft olive accents, believable delicate architectural details, crisp readable silhouette at small size. Entire village fully inside a square composition with generous transparent margins, windmill blades intact and not cropped. Only tiny irregular grass/wheat touches directly under foundations, no broad terrain tile. Actual fully transparent alpha around the complete group and at all corners. No white or parchment rectangle, no people, no characters, no letters, text, labels, numbers, logos, UI or flags. Not flat vector art, not crude geometry, not a toy 3D model, not photorealistic.
```

### harbor-v3.png

- 工具：`image_gen.imagegen`。
- 参数：`transparent_background=true`。
- 未使用图像参考。

```text
Use case: illustration-story. Asset: a refined transparent PNG riverside trade-port vignette for a medieval merchant map. One compact group of three to five timber-framed warehouses and merchant houses with slate and ochre roofs, a wooden ferry landing, rope bollards, tied barrels and grain crates, one small moored ferry skiff and a modest sailboat. Elevated three-quarter isometric map view. Delicate Japanese light-novel watercolor and fine sepia pen-and-pencil details, cream plaster, aged oak, muted teal accents, professional charming architecture and a clear small-size silhouette. Entire group fully within a square composition with transparent breathing room; masts and roofs not cropped. Very small irregular quay foundations only, no broad land or water rectangle. The Slode river has NO BRIDGE: absolutely no bridge, arch, cross-river span or road over water. No people, no characters, no text, letters, labels, numbers, banners, UI or logos. Actual fully transparent alpha around all structures and boats and at every corner. No white or parchment backdrop, no flat vector graphics, no crude geometric icon, no toy 3D model.
```

### cathedral-v3.png

- 工具：`image_gen.imagegen`。
- 参数：`transparent_background=true`。
- 未使用图像参考。

```text
Use case: illustration-story. Asset: a refined transparent PNG cathedral trading town vignette for a medieval merchant map. One compact ecclesiastical city cluster: a graceful pale-stone cathedral with a tall narrow slate spire and secondary bell tower, two half-timber merchant houses, a small market stall with canvas awning, crates, and a short low section of old town wall. A believable medieval church town, not a fantasy castle. Elevated three-quarter isometric map view, square composition, entire spire and all buildings fully inside the canvas with generous transparent margins. Delicate Japanese light-novel watercolor and fine sepia pen-and-pencil details, luminous cream stone, muted blue-gray slate, warm oak, restrained terracotta and small olive-green touches. Rich but readable small-size silhouette, precise charming architecture, not crude geometry or a flat vector icon or toy 3D render. Only tiny irregular foundation stones directly beneath buildings, no broad ground tile. Actual fully transparent alpha around all structures and every corner. No people, characters, letters, text, numbers, labels, UI, logos, flags, bridges, large moat, or white/parchment rectangle.
```


## AI 事件与消息插图

生成与编辑日期：2026-11-04。以下五张均使用内置 `image_gen.imagegen` 制作：丰收、节庆、酒馆与旅人四张保留独立生成的彩色场景；暴雨图在本场景上定向编辑人物表情与必要姿态。当前五张均以 RGB PNG 保存到项目，尺寸均为 1536 × 1024、3:2 横幅。人物、服饰、线稿与色彩最初参照本项目保存的官网彩色宣传图 `assets/hero.jpg` 与赫萝立绘 `assets/holo.jpg`（来源链接见本文“官方图片”）；场景是同人补画，不宣称为原作具体事件的官方插图。

统一采用精细线稿、柔和透明水彩、木色与秋日自然色彩，保留罗伦斯和赫萝的参考造型；五张均无文字、对话框或界面。调用参数均为 `transparent_background=false`；四张独立生成场景的 `referenced_image_paths` 依次为上述两张官网参考图，暴雨图当前编辑请求只引用本场景作为编辑目标，具体参数见其记录。

| 本地文件 | 实际用途 |
| --- | --- |
| `assets/events/rain.png` | 大暴雨商路，罗伦斯与赫萝湿冷谨慎地乘篷车赶路。 |
| `assets/events/harvest.png` | 丰收货场，粮袋、蜂蜜与农人验货。 |
| `assets/events/festival.png` | 宴席采购，苹果、奶酪、蜂蜜与葡萄酒。 |
| `assets/events/tavern.png` | 酒馆炉边，同行商人分享消息。 |
| `assets/events/traveler.png` | 乡间商路，罗伦斯与旅人交谈。 |

以下保留当前五张彩色素材实际成功生成或编辑请求的完整提示词。

### rain.png

- 工具：内置 `image_gen.imagegen`，定向编辑。
- 编辑目标：项目中的 `assets/events/rain.png` 彩色暴雨场景；该场景的人物、服饰与色彩源自上文两张官网参考图。
- 本次输入：`referenced_image_paths` 只含同名暴雨场景图，作为编辑目标；`transparent_background=false`。
- 当前画面：两人收起笑容，罗伦斯谨慎握缰观察泥路，赫萝缩身护住衣物与麦袋；保持原横幅构图、马车、马、背景与雨景。

```text
Use case: precise-object-edit.
Input image: Image 1 is the EDIT TARGET, the current rain.png. Edit this exact illustration locally; do not redesign or recompose the scene.
Primary request: change only the protagonists' facial expressions and the minimum necessary upper-body/hand poses so this is a difficult, wet, chilly journey through heavy rain, with restrained concern and concentration instead of a cheerful romantic outing.
Lawrence: remove his smile completely. His eyebrows are slightly drawn together, his lips pressed in a straight tight line with no raised mouth corners, and his eyes are focused cautiously down toward the muddy road ahead. His shoulders are slightly tense and his existing hands grip the same reins more carefully. Keep his silver-gray hair, face identity, small chin stubble, brown coat, white collar, seated position and adult proportions.
Holo: remove her smile completely, and remove the leisurely hand-propping-her-cheek pose. Let her huddle slightly under the same canvas shelter against the wet cold, with a subtle frown and a mildly worried or impatient expression. Lower both hands to gather her existing clothing close and protect the little wheat pouch at her chest. Keep the same adult identity, wine-red eyes, long reddish-brown hair, wolf ears and tail, blue blouse, dark vest, red checked cloth, long dark skirt and location on the bench. Her mouth is closed, neutral to slightly downturned, with no cheerful smile.
Strict invariants: preserve the original full-color fine-line and soft watercolor finish, color palette, lighting, 3:2 landscape framing, camera viewpoint, canvas-covered wagon, bench, sacks, wheels, chestnut horse, harness and reins, rain, puddles, muddy road, fields, trees, distant village and sky. Preserve the whole background and all objects as closely as possible. Do not replace the image with a new scene. Output must remain 1536x1024 RGB PNG.
Emotional target: cautious, effortful travel in a downpour, visibly cold and inconvenienced but naturally self-controlled. No panic, crying, shouting, exaggerated grimaces, injury, accident or disaster. No happy expressions, no relaxed chin-resting, no carefree sightseeing.
No text, captions, dialogue balloons, panels, UI, logo, signature or watermark.
```

### harvest.png

```text
Use case: illustration-story.
Asset type: a finished full-color story illustration for a medieval traveling merchant browser game, one continuous scene in a wide 3:2 landscape composition.
Input images and roles: Image 1 (hero.jpg) is a character-design, travel-clothing, fine-line and COLOR-PALETTE reference only. Image 2 (holo.jpg) is a character-design and travel-clothing reference only. Create a completely new scene; do not copy either reference's composition, pose or background.
Style and continuity: delicate clean Japanese light-novel pen-and-pencil linework with soft translucent WATERCOLOR COLORS, gentle natural light, subtle paper texture and an airy detailed-but-uncluttered background. A coherent set of five colored illustrations. Restrained ochre, oak brown, pale cream, muted olive, blue and warm copper; retain living full color throughout. Quiet believable everyday medieval commerce, soft expressive faces and practical cloth folds. No black-and-white printing or grayscale screentones.
Recurring protagonists when present: adult Lawrence, a traveling merchant in his mid-twenties with short silver-gray hair, a little chin stubble, a white collar and a simple dark brown merchant's coat; and adult Holo, a clearly adult wolf-woman with very long warm reddish-brown hair, wine-red eyes, expressive brown wolf ears and a full brown wolf tail, wearing a modest blue blouse, dark fitted vest, red checked cloth at the hips, dark skirt and a little leather wheat pouch at her chest. Follow the supplied references for their recognizable facial design and clothing. Natural adult proportions and understated expressions.
Setting and framing: late-medieval European merchant roads and modest timber towns, functional wooden covered wagons and simple linen/wool clothes. Keep the main action and important faces within the frame. Readable at small game size without harsh contrast or clutter.
Constraints: no text, letters, numbers, captions, written signs, dialogue balloons, panels, UI, logos, signatures or watermark. No modern objects, no glossy high-saturation anime poster, no neon, no ornate fantasy armor, no 3D, no photorealism, no heavy impasto or grayscale image.
New scene: a village harvest yard in soft autumn daylight. Lawrence and Holo inspect an abundant but neatly stacked supply of grain sacks and honey crocks beside a modest timber granary. An ordinary adult farmer opens a sack to show the grain; Lawrence thoughtfully checks it while Holo smiles beside a wheat sheaf and tied supplies. Show the good harvest through extra sacks and modest farming details, not magical plenty. Gentle golden straw, amber honey, warm oak, muted olive and Holo's blue-and-red travel clothes in transparent watercolor.
```

### festival.png

```text
Use case: illustration-story.
Asset type: a finished full-color story illustration for a medieval traveling merchant browser game, one continuous scene in a wide 3:2 landscape composition.
Input images and roles: Image 1 (hero.jpg) is a character-design, travel-clothing, fine-line and COLOR-PALETTE reference only. Image 2 (holo.jpg) is a character-design and travel-clothing reference only. Create a completely new scene; do not copy either reference's composition, pose or background.
Style and continuity: delicate clean Japanese light-novel pen-and-pencil linework with soft translucent WATERCOLOR COLORS, gentle natural light, subtle paper texture and an airy detailed-but-uncluttered background. A coherent set of five colored illustrations. Restrained ochre, oak brown, pale cream, muted olive, blue and warm copper; retain living full color throughout. Quiet believable everyday medieval commerce, soft expressive faces and practical cloth folds. No black-and-white printing or grayscale screentones.
Recurring protagonists when present: adult Lawrence, a traveling merchant in his mid-twenties with short silver-gray hair, a little chin stubble, a white collar and a simple dark brown merchant's coat; and adult Holo, a clearly adult wolf-woman with very long warm reddish-brown hair, wine-red eyes, expressive brown wolf ears and a full brown wolf tail, wearing a modest blue blouse, dark fitted vest, red checked cloth at the hips, dark skirt and a little leather wheat pouch at her chest. Follow the supplied references for their recognizable facial design and clothing. Natural adult proportions and understated expressions.
Setting and framing: late-medieval European merchant roads and modest timber towns, functional wooden covered wagons and simple linen/wool clothes. Keep the main action and important faces within the frame. Readable at small game size without harsh contrast or clutter.
Constraints: no text, letters, numbers, captions, written signs, dialogue balloons, panels, UI, logos, signatures or watermark. No modern objects, no glossy high-saturation anime poster, no neon, no ornate fantasy armor, no 3D, no photorealism, no heavy impasto or grayscale image.
New scene: merchants supplying a small city's feast. In a modest timber market courtyard, Lawrence discusses a purchase with an adult household steward beside baskets of apples, small cheese wheels, honey crocks and two wine barrels. Holo stands nearby with an interested amused expression, her wolf ears and tail naturally visible. One adult worker carries a basket toward an open doorway where the edge of a plain feast table can be seen. The scene is quiet procurement before a local feast, not a crowded royal banquet. Soft apple red, honey gold, linen cream and warm oak, delicate full-color watercolor.
```

### tavern.png

```text
Use case: illustration-story.
Asset type: a finished full-color story illustration for a medieval traveling merchant browser game, one continuous scene in a wide 3:2 landscape composition.
Input images and roles: Image 1 (hero.jpg) is a character-design, travel-clothing, fine-line and COLOR-PALETTE reference only. Image 2 (holo.jpg) is a character-design and travel-clothing reference only. Create a completely new scene; do not copy either reference's composition, pose or background.
Style and continuity: delicate clean Japanese light-novel pen-and-pencil linework with soft translucent WATERCOLOR COLORS, gentle natural light, subtle paper texture and an airy detailed-but-uncluttered background. A coherent set of five colored illustrations. Restrained ochre, oak brown, pale cream, muted olive, blue and warm copper; retain living full color throughout. Quiet believable everyday medieval commerce, soft expressive faces and practical cloth folds. No black-and-white printing or grayscale screentones.
Recurring protagonists when present: adult Lawrence, a traveling merchant in his mid-twenties with short silver-gray hair, a little chin stubble, a white collar and a simple dark brown merchant's coat; and adult Holo, a clearly adult wolf-woman with very long warm reddish-brown hair, wine-red eyes, expressive brown wolf ears and a full brown wolf tail, wearing a modest blue blouse, dark fitted vest, red checked cloth at the hips, dark skirt and a little leather wheat pouch at her chest. Follow the supplied references for their recognizable facial design and clothing. Natural adult proportions and understated expressions.
Setting and framing: late-medieval European merchant roads and modest timber towns, functional wooden covered wagons and simple linen/wool clothes. Keep the main action and important faces within the frame. Readable at small game size without harsh contrast or clutter.
Constraints: no text, letters, numbers, captions, written signs, dialogue balloons, panels, UI, logos, signatures or watermark. No modern objects, no glossy high-saturation anime poster, no neon, no ornate fantasy armor, no 3D, no photorealism, no heavy impasto or grayscale image.
New scene: listening to merchant news beside the hearth of a medieval tavern. Lawrence and Holo sit at a small wooden table with one seasoned adult traveling merchant. The guest speaks in a relaxed low voice while Lawrence listens thoughtfully and Holo leans in with a knowing smile. Simple ceramic cups and a tied travel satchel; a modest stone fireplace and unobtrusive timber beams behind them. Holo's ears, copper hair and thick tail identify her naturally, with modest reference clothing. Warm amber firelight, brown oak and a little soft blue in her blouse, luminous translucent full-color watercolor, comfortable and intimate rather than dark or drunken.
```

### traveler.png

```text
Use case: illustration-story.
Asset type: a finished full-color story illustration for a medieval traveling merchant browser game, one continuous scene in a wide 3:2 landscape composition.
Input images and roles: Image 1 (hero.jpg) is a character-design, travel-clothing, fine-line and COLOR-PALETTE reference only. Image 2 (holo.jpg) is a character-design and travel-clothing reference only. Create a completely new scene; do not copy either reference's composition, pose or background.
Style and continuity: delicate clean Japanese light-novel pen-and-pencil linework with soft translucent WATERCOLOR COLORS, gentle natural light, subtle paper texture and an airy detailed-but-uncluttered background. A coherent set of five colored illustrations. Restrained ochre, oak brown, pale cream, muted olive, blue and warm copper; retain living full color throughout. Quiet believable everyday medieval commerce, soft expressive faces and practical cloth folds. No black-and-white printing or grayscale screentones.
Recurring protagonists when present: adult Lawrence, a traveling merchant in his mid-twenties with short silver-gray hair, a little chin stubble, a white collar and a simple dark brown merchant's coat; and adult Holo, a clearly adult wolf-woman with very long warm reddish-brown hair, wine-red eyes, expressive brown wolf ears and a full brown wolf tail, wearing a modest blue blouse, dark fitted vest, red checked cloth at the hips, dark skirt and a little leather wheat pouch at her chest. Follow the supplied references for their recognizable facial design and clothing. Natural adult proportions and understated expressions.
Setting and framing: late-medieval European merchant roads and modest timber towns, functional wooden covered wagons and simple linen/wool clothes. Keep the main action and important faces within the frame. Readable at small game size without harsh contrast or clutter.
Constraints: no text, letters, numbers, captions, written signs, dialogue balloons, panels, UI, logos, signatures or watermark. No modern objects, no glossy high-saturation anime poster, no neon, no ornate fantasy armor, no 3D, no photorealism, no heavy impasto or grayscale image.
New scene: sharing news with a traveler on a country road. Their covered wagon has stopped beside a rural track. Lawrence stands by its wheel, speaking naturally to an ordinary adult pedestrian traveler carrying a small shoulder pack and walking staff. Holo sits near the driver's bench and listens with a relaxed curious expression, long reddish-brown hair and fluffy tail visible, dressed as in the colored references. A single chestnut horse waits quietly; gently rolling fields and a few autumn trees are suggested behind them. Clear soft daylight, warm earth, muted green, pale blue sky and cream canvas, full-color transparent watercolor. Emphasize a chance friendly conversation, no dramatic heroic posing.
```

