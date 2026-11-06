# 图片素材来源

本文记录当前游戏实际使用的图片及生成提示词。所有运行素材均保存在项目内；官方 JPEG 保留原图；小说插图使用局部去水印展示版，原始扫描在原作库中保留。显示裁切由 CSS 完成。原作插画：文仓十；官方地图：出光秀匡。小说插图的原文件、卷幕场景和识别依据见 [novel-art.md](novel-art.md)。

## 制作源与发布图

制作源统一保存在 `assets/source/`：小说高清PNG母版在 `novel/hd/`，原尺寸去水印修复输入在 `novel/input/`，其余按 `official/`、`map/`、`events/`、`story/`、`wagon/` 分类。游戏只引用 `assets/runtime/` 的最终展示图；网站不发布制作源，可编辑离线包保留全部制作源与展示图。详细清单见 [图片目录说明](../assets/README.md)。整套原作库与带书源标记的扫描保留原位。

使用 `cwebp -q 92 -m 6 -sharp_yuv -alpha_q 100 -exact -metadata none`，保持当前母版尺寸、无损透明通道，颜色采用高质量有损压缩。当前27张编码母版共65.99 MiB，发布WebP约11.35 MiB，减少82.8%；另有1张SVG不转码。当前小说插图为1038–1046像素宽的高清中文增强版；增强前6.99 MiB的总量不再代表当前发布内容。

编码器版本、完整对应关系和SHA-256见 `scripts/image-exports.json`；`npm run images`从母版重新导出，`npm run images:check`检查同步状态。目录整理前后68个文件摘要逐一一致，未重新编码或覆盖任何原文件。下文路径已更新，代码块内的实际成功提示词保留当时请求原文；当时的输入文件名对应当前制作源文件名。临时试转和对照图不进入仓库或发布包。

## 第一卷剧情纹样背景

`assets/source/story/chapter-one-pattern.png`，1536×1024。使用内置 imagegen 新生成的AI同人纹样，不是官方原作插图；选用A版亚麻散花，以麦穗、苹果与狼尾重复排布，供主线阅读器使用。没有人物或文字；游戏以独立CSS叠加浅色遮罩和文字框，原作插图页进一步压淡底纹。

实际成功提示词：

```text
Use case: stylized-concept.
Asset type: a flat all-over repeating ornamental PATTERN BOARD for the background of a Spice and Wolf volume-one visual novel, 1536x1024 landscape. The user wants the kind of patterned surface seen on wallpaper, a quilt, or a tablecloth: many small repeated motifs evenly distributed across the whole surface. It must look like a 2D textile / wallpaper design sample viewed straight on, NOT a scene, NOT an illustration of an actual room or draped fabric. No perspective, no horizon, no central focal illustration, no large blank center, no mockup, no folds or lighting effects. Richly arranged but quiet enough behind dialogue. Delicate hand-drawn brown ink and soft watercolor details recalling warm classic Japanese light-novel illustrations and medieval European travelling-merchant life; organic irregularities, subtle material grain. Motifs should be stylized ornaments, not realistic objects laid on a table or a game item inventory. Actual repeated ornament rhythm with 5–8 repeats across the width, 4–6 repeats vertically; some motifs continue past edges to suggest an endless surface. NO human characters, portraits, chibi characters, letters, numbers, calligraphy, words, titles, logos, watermarks, UI panels, menus, quest symbols or decorative outer border. No captions or labels on the image.
Design A: Warm ivory and light oatmeal linen ground, airy small tossed repeat. Three motifs only: curved golden wheat sprigs, small muted russet-red apples with a sage leaf, and curled fluffy russet wolf tails with cream tips, each rendered as a refined little hand-drawn emblem. Repeat them in offset diagonal rows, each motif gently rotated; tiny muted sage leaf-pairs fill occasional gaps. About 65% calm cream ground remains visible, motifs similar small scale, light warm brown outlines, extremely restrained earthy watercolor. Pleasant gently playful harvest-and-wolf identity, adult tasteful textile design, no bright cartoon sticker outlines. Even spacing and density across entire sheet; absolutely no landscapes or foreground objects.
```

## 官方图片

下载日期：2026-11-03。优先使用原站明确提供的高分辨率资源，不将宣传图当成某座城镇或具体剧情现场的复原。

| 本地文件 | 原始尺寸 | 实际用途 | 原始图片与来源 |
| --- | --- | --- | --- |
| `assets/source/official/hero.jpg` | 1488 × 1016 | 标题与旅途主视觉，罗伦斯与赫萝的官方宣传插画。 | [作者官网](https://hasekuraisuna.jp/) · [原图](https://hasekuraisuna.jp/assets/img/top/slider/0@2x.jpg) |
| `assets/source/official/holo.jpg` | 640 × 772 | 第一卷赫萝麦田立绘，用于旅伴卡和开场。 | [作者官网](https://hasekuraisuna.jp/) · [原图](https://hasekuraisuna.jp/assets/img/top/slider/sp1.jpg) |
| `assets/source/official/night.jpg` | 640 × 772 | 第三卷赫萝月夜立绘，仅作夜晚气氛，不冒充第一卷事件插图。 | [作者官网](https://hasekuraisuna.jp/) · [原图](https://hasekuraisuna.jp/assets/img/top/slider/sp3.jpg) |
| `assets/source/official/world-map.jpg` | 375 × 533 | 官方原作世界地图，用于定位依据与原图对照。 | [原作官方网站](https://spicy-wolf.com/1st/original/world.html) · [原图](https://spicy-wolf.com/1st/assets/images/original/world_map.jpg) |

`assets/runtime/crest.svg` 是项目自绘的简化麦穗／狼头界面标记，不是官方商标素材。

## 小说插图

`assets/source/novel/input/` 保留12张原尺寸去水印修复输入，右下书源区域采用AI补绘，其余像素保留。`assets/source/novel/hd/` 保存后续高清增强及中文翻译PNG母版。游戏图册和剧情插页引用 `assets/runtime/novel/` 的WebP；原始JPEG及书源标记继续保存在原作库中。清单、场景对应、补画限制及内置imagegen实际提示词见 [novel-art.md](novel-art.md)；文字考据见 [novel-content.md](novel-content.md)。

## AI 地图与道具

以下地图、城镇与两帧马车均使用内置 `image_gen.imagegen` 生成。原文件直接复制到项目，保留真实 PNG 格式与 alpha。地图以官方原图为参考，交互锚点另见 [sources.md](sources.md)；局部山林、支流、纹理与建筑属于同人补画，不是官方设定的精确复原。

| 本地文件 | 原始尺寸／格式 | 实际用途 |
| --- | --- | --- |
| `assets/source/map/world-map-v3.png` | 1052 × 1495，RGB PNG | 地形主底图，无文字或建筑，游戏另叠城镇、商路与标签。 |
| `assets/source/wagon/companions-1.png`、`companions-2.png` | 各512 × 341，RGBA PNG | 用户选定E版：赫萝与罗伦斯两颗大头左右互挤，迷你马车在下方；地图按500ms/帧交替。 |
| `assets/source/map/village-v3.png` | 1254 × 1254，RGBA PNG | 农舍、谷仓、风车的麦田村庄主题。 |
| `assets/source/map/harbor-v3.png` | 1254 × 1254，RGBA PNG | 仓库、码头、帆船与渡船的河港主题，无跨主河桥梁。 |
| `assets/source/map/cathedral-v3.png` | 1254 × 1254，RGBA PNG | 石教堂、钟楼、市集与低城墙的教会城镇主题。 |

两帧马车、村庄、河港、教会城镇图的四角 alpha 均为0。三类城镇图表达地区主题，不代表具体建筑的原作还原。原作斯劳德主河以渡船通行，城内人工运河另有桥和水门；两者在文字与地理考据中区分。

## 实际生成提示词

以下保留在用资产的成功请求原文。运行游戏无需访问生成器或外部文件。

### companions-1.png / companions-2.png

- 工具：内置 `image_gen.imagegen`，原始E版生成与同一造型定向编辑均使用 `transparent_background=true`。
- 原始E版仅以 `assets/source/official/hero.jpg` 为人物、服装与配色参考（官网来源见上文）；用户要求头像占主体一半以上，不使用真实人车比例。成品为AI同人补画，不是官方Q版插图。
- 用户选中E版后，再以该版两帧图为编辑目标，改为赫萝先向右挤罗伦斯、罗伦斯再向左挤回来。最终原始帧图为1087×1447的RGBA PNG；按上下两等份机械裁切，每帧1087×723，最后一行透明边缘舍去，再用FFmpeg Lanczos等比缩到512×341，保留alpha。未用程序重绘人物。
- 运行使用两张PNG，以CSS在一秒周期内交替显示，各500ms；不使用GIF量化图，减少半透明边缘损失。减少动态效果时停在第一帧。旧静态马车及整车颠簸动画已移除。

原始E版成功请求：

```text
工具：内置 image_gen.imagegen
transparent_background=true
参考图：assets/hero.jpg，角色、服装与配色参考；不沿用原图人物比例。
原图来源：https://hasekuraisuna.jp/assets/img/top/slider/0@2x.jpg

Use case: illustration-story.
Asset type: TWO-FRAME transparent chibi sprite sheet, a new HEAD-DOMINANT map-marker proposal for a private Spice and Wolf fan game.
Reference: hero.jpg is ONLY a reference for recognizable adult Holo and adult Kraft Lawrence facial identity, hairstyles and blue/red/brown travel-clothing colors. Do NOT copy the composition or realistic body proportions. Create a fresh super-deformed drawing.
PRIMARY VISUAL REQUIREMENT: the two ENORMOUS character HEADS are the entire visual focus. Their faces, hair and Holo's wolf ears must occupy AT LEAST 65–75 PERCENT OF THE COLORED SUBJECT AREA. Think TWO OVERSIZED PORTRAIT AVATARS sharing a ridiculously tiny horse-cart base. Do not make a realistic wagon illustration with small passengers. No realistic relative scale between people, cart and horse. The two nearly round heads sit shoulder-to-shoulder and dominate the upper 70% of EACH sprite. Each head is approximately 40–45% of the entire sprite width and 60–65% of its height. Their tiny torsos are just little hints immediately under the heads, no long legs. Heads much taller than the cart and MUCH larger than the horse's head.
Subject arrangement: Holo with copper-red long hair, two pointed brown wolf ears, wine-red eyes and a blue collar on the left; Lawrence with short silver-gray hair, gray-brown eyes, a little visible chin stubble and brown coat/white collar on the right. Both are recognizable adult protagonists rendered as extreme SD chibi, not realistic children. Holo's red checked waistcloth and fluffy brown pale-tip tail can be tiny accents. The enormous heads fit next to each other above a MINIATURE wooden merchant wagon in the bottom 20–25% of the sprite, with two tiny wooden wheels and a SMALL hint of cream canvas BEHIND THEIR NECKS, never a tall canopy behind or above their heads. A tiny simplified chestnut horse with a harness goes at the bottom right, facing right, no taller than the lower THIRD of a character head. Whole cart-and-horse group is at most the bottom 25–30% of subject height. Both enormous faces unobstructed, no canopy covering hair, eyes or ears. Keep wagon and horse only as cute readable travel symbols; massively prioritize avatars.
Style: original Japanese light-novel character identity translated into exaggerated head-first SD illustration, warm cream, brown, copper, blue/red accents, precise brown ink contours and tasteful soft color. NOT generic cart clipart. No scenery, text, numeral, caption, frame, sign, logo, pin, badge circle, cloud, background tile or rendered checkerboard.
Sprite sheet layout: portrait canvas, ONE column and TWO equal rows. Two repetitions of the SAME complete chibi-heads-with-tiny-cart group: top half FRAME 1, bottom half FRAME 2. Equal panel size, same camera, size, baseline and registration. Entire subject with at least 5% genuinely transparent alpha margin on every side inside EACH HALF. No labels, no central dividing line, nothing crossing the horizontal middle. Real transparency everywhere outside the subjects.
Animation: exactly TWO consecutive frames for a gentle looping travel marker. Preserve all dimensions, head positions, hair silhouettes, cart body and wheel centers between frames. Frame 2 changes only small expressive features as specified, Holo's ear/tail tips, the tiny horse's alternating walking legs and wheel spoke angles. Keep the heads stable so they do not jitter or transform. No new props, no missing character, no third face, no extra horse, no added limbs. A small walking beat, no dramatic jump.
VARIANT E: the most exaggerated option, two nearly touching giant portrait heads together cover about 80% of colored area. Their teeny cart is a little horizontal strip directly beneath their chins, wheels like small buttons. The tiny horse is a mini symbolic pony at lower right, much smaller than either face. Clean rounded dark-brown outlines, simplified cel/watercolor colors, very readable eyes, cheeks and silver/copper hair at 96 pixels. Holo cheerful open-eyed in frame 1 and a clear playful wink in frame 2; Lawrence remains open-eyed with a cute dry but affectionate smile. No large canopy: just a narrow cream folded-canvas hint behind the tiny shoulders. The two large heads MUST be even more dominant than a typical chibi plush.
```

左右互挤的成功编辑请求：

```text
Use case: precise-object-edit.
Input image 1 is the EDIT TARGET: the selected E-version TWO-FRAME sprite sheet of Holo and Kraft Lawrence with extremely oversized heads on a tiny horse-cart. Preserve THIS exact design and illustration finish; do not invent a different variant.
User's new animation direction: the two enormous heads playfully CROWD and NUDGE one another LEFT AND RIGHT while sitting on the miniature cart. This must be the main animation, clearly visible in two alternating frames even at 96 px. It is not a blinking animation and not just ear or horse-leg movement.
Keep: the exact enormous copper-haired Holo and silver-haired Lawrence identities, red and gray-brown eyes, Lawrence's little chin stubble, the blue blouse, red checked cloth, brown coat and white collar, Holo's two wolf ears and fluffy tail, original warm clean linework and colors, the ridiculously tiny wooden wagon and tiny horse at lower right. HEADS REMAIN OVER 70% of the colored subject area, the cart/horse stay a small symbolic base under their chins. Do not make people or heads smaller.
EXACT TWO-FRAME ACTION, one column / two equal rows:
TOP HALF = FRAME 1, PUSH TO THE RIGHT: Holo on the LEFT leans her enormous head toward the RIGHT to crowd Lawrence. Her head tilts clockwise about 10 degrees and shifts right about 3–4% of the sprite width. Her right cheek presses against Lawrence's left cheek/temple. Lawrence's enormous head is visibly nudged RIGHT about 4–5% of the sprite width and tilts clockwise around 8 degrees; he wears a comically squeezed, mildly put-upon expression, with the contacted cheek subtly squashed. Holo has a playful smug grin. The contact is gentle and funny, not violent.
BOTTOM HALF = FRAME 2, PUSH BACK TO THE LEFT: Lawrence on the RIGHT leans his enormous head LEFT to push back. His head tilts counterclockwise about 10 degrees and shifts left about 3–4% of the sprite width, pressing his left cheek against Holo's right cheek/temple. Holo is visibly nudged LEFT about 4–5% of the sprite width and tilts counterclockwise around 8 degrees with a cute squeezed pout or amused squint. Lawrence has a small mischievous smile. The big heads still touch; alternate left/right group pressure is unmistakable.
The two extremes form a charming repeated left-right cheek-jostling loop. Both head centers visibly change in the SAME horizontal direction in each frame, then reverse, with opposing playful pressure between the pair. Give the giant head pair a subtle soft cartoon squash at their contact, without changing facial identity. Tiny necks/shoulders can bend minimally to support the poses. No hands pushing faces, no grabbing, fighting, pain, crying, anger, impact bursts, hearts, text or sweat drops. No hair growth, changing outfits, duplicate faces or extra ears.
CRITICAL REGISTRATION: wagon body, tiny horse torso, both wheel centers and the baseline stay pixel-aligned between the two equal cells, same perspective/size/colors. Only the heads/neck hints and soft tail/ear follow-through move. Do NOT shift the whole cart or camera. Keep each complete sprite inside its own half with generous transparent horizontal margin so the sideways-moving ears and hair never crop. Extra canvas margin is allowed; preserve the extremely dominant HEAD-TO-CART ratio. Preserve whole tiny horse and wheels.
Output: a PORTRAIT 1-column by 2-row transparent sprite sheet, exactly TWO complete groups. Top half and bottom half are equal dimensions. Genuine alpha transparency outside the subjects, including all corners and middle gutter. No background, brown backdrop, paper rectangle, checkerboard pixels, border, label, text, motion-symbol marks, logo, extra panels or scenery.

```

### world-map-v3.png

- 工具：`image_gen.imagegen`。
- 参数：`transparent_background=false`。
- 参考图：`assets/source/official/world-map.jpg`。

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

生成与编辑日期：2026-11-06。当前五张均使用内置 `image_gen.imagegen`，以同名旧彩色场景作为编辑目标及线稿、色彩与环境风格参考，移除赫萝与罗伦斯，改为环境及普通居民的场景。五张均为全彩 PNG，1536 × 1024、3:2 横幅，无文字、对话框、水印或界面；不再暗示玩家一行正在事件现场。

原场景的线稿与色彩最初参照本项目保存的官网彩色宣传图 `assets/source/official/hero.jpg` 与赫萝立绘 `assets/source/official/holo.jpg`（来源链接见本文“官方图片”）。当前编辑只引用各自的旧场景，不再以两位主角作为画面主体；所有场景均为同人补画，不是原作具体事件的官方插图。

调用参数：`transparent_background=false`；每张的 `referenced_image_paths` 仅含同名旧场景 `assets/source/events/<文件名>.png`。以下记录当前素材实际成功请求的完整提示词。

| 本地文件 | 当前画面与用途 |
| --- | --- |
| `assets/source/events/rain.png` | 远景暴雨与泥泞商路为主体，突出密集雨幕、积水和深车辙；滑倒马匹与散架马车缩小为远处路边细节，无人物。 |
| `assets/source/events/harvest.png` | 普通农人在粮仓货场验粮、搬运，展示粮袋、麦束、苹果及蜂蜜。 |
| `assets/source/events/festival.png` | 普通居民与工人筹备城市节庆，搬运宴席物资。 |
| `assets/source/events/tavern.png` | 普通居民在酒馆炉边听同行商人分享消息。 |
| `assets/source/events/traveler.png` | 普通中年车夫在停靠的篷车旁与行路旅人交流消息。 |

### rain.png

```text
Use case: precise-object-edit.
Asset type: full-color environmental rain-event illustration for a medieval merchant browser game, 1536x1024, horizontal 3:2.
Input image: the provided rain.png is an EDIT TARGET and a reference for fine-line watercolor style, weather and the roadside mishap only. Radically recompose it into a WIDE ENVIRONMENTAL ESTABLISHING SHOT.
Primary request: the weather and impassable muddy trade road must be the unmistakable main subjects. Pull the camera far back. At least 85–90 percent of the visual attention and image area must belong to torrential rain, waterlogged road, storm sky and countryside. NOT a close-up of a horse or cart.
Composition: foreground and center are a broad muddy rutted medieval dirt road running diagonally from the bottom edge and curving away through the landscape. Deep wheel ruts are filled with brown rainwater, large puddles mirror the dark sky, countless visible raindrop impacts stipple puddle surfaces, muddy rivulets stream across the road, churned sticky mud and washed-out road edges clearly show why travel is slowed. Leave this main road fully visible and visually dominant. Upper portion has low charcoal blue-gray storm clouds, dense wind-driven slanting rain and hazy distant fields and tree lines dissolving in sheets of rain; wet grasses bend along the road edges. Keep rainfall dense and highly readable over the whole landscape, with natural atmospheric depth, restrained muted blue-gray, earthy brown, desaturated green.
Retain ONE SMALL roadside accident as a SECONDARY mid-distance detail at a side of the road, away from foreground and central focal area: a broken covered wooden cart with a detached wheel, fallen planks and a little spilled cargo; beside it a living chestnut horse that has slipped in the mud, head lifted. The entire cart-plus-horse group must fit within roughly 15–18 percent of canvas WIDTH and no more than 15 percent of canvas HEIGHT, with open landscape all around it. No foreground wheels, horse portraits, large barrels or detailed cargo competing with weather. The horse and cart should be recognizable on closer inspection, but the first impression must be HEAVY RAIN AND MUDDY ROAD.
Style invariants: same delicate Japanese light-novel pen-and-pencil linework and soft translucent FULL-COLOR watercolor, subtle paper texture, believable rural medieval objects. One coherent full-bleed landscape, no collage or panels. No people anywhere, no Holo or Lawrence or lookalikes. No blood, wounds, dead animal, lightning spectacle, modern objects, text, letters, captions, UI, watermark, logo or signature.
```

### harvest.png

```text
Use case: precise-object-edit.
Asset type: finished full-color world-event illustration for a medieval merchant browser game.
Input image 1 is the edit target, assets/events/harvest.png, and is also the visual style and environment reference.
Primary request: remove Holo and Lawrence completely from this harvest illustration. The long copper-haired wolf-eared woman in the left foreground and the short silver-haired brown-coated man in the center must both be absent. Replace their occupied space naturally with harvest-yard scenery and ordinary local farm workers, so the picture shows a good harvest happening independently of the player and contains no recognizable protagonists or protagonist lookalikes.
Scene: a modest late-medieval European village granary yard on a warm autumn day. Preserve the timber barn, abundant neatly stacked grain sacks, opened grain sack and ordinary middle-aged bearded farmer on the right; retain the honey crocks in the foreground. Add a modest basket of fresh apples among the supplies. One ordinary adult local farm worker with dark hair beneath a plain linen cap and simple undyed working clothes checks grain beside the farmer, while a second modestly dressed worker carries a sack in the middle ground. Keep these ordinary residents secondary to the abundant harvest goods. Fill remaining foreground naturally with tied sacks and wheat sheaves. Keep the architecture generic, without a recognizable city-specific landmark.
Style/invariants: keep the existing delicate clean Japanese light-novel linework, soft translucent full-color watercolor, subtle paper texture, luminous natural daylight, restrained ochre, warm oak, cream, muted olive, and warm autumn colors. Retain believable adult anatomy and everyday medieval commerce. Preserve the 3:2 landscape composition and 1536x1024 output size. One continuous finished scene, readable at small game size.
Avoid: Holo, Lawrence, wolf ears, animal tails on people, long copper-haired heroine, silver-haired young merchant, any recognizable named character, modern objects, magical abundance, dramatic hero posing, text, letters, numbers, signs with writing, captions, speech bubbles, panels, UI, logos, signature or watermark.
```

### festival.png

```text
Use case: precise-object-edit.
Asset type: full-color event illustration for a medieval merchant game, wide landscape 3:2, 1536x1024.
Input image 1 is the EDIT TARGET and watercolor style reference.
Primary request: remove Holo and Lawrence entirely from this illustration. Remove the silver-haired young merchant at left and the long reddish-brown-haired wolf woman at center, including all wolf ears, tail, hair and protagonist clothing. Replace their occupied space with ordinary LOCAL TOWNSPEOPLE preparing a town festival: one middle-aged dark-haired woman with hair tucked into a plain cream linen coif lifts an apple basket, and one stocky brown-haired adult porter in a simple muted olive tunic carries a small wine cask. Both are generic supporting inhabitants, visually distinct from the protagonists, working naturally with the existing steward. This should illustrate a local town event that occurs independently of the player, not a scene starring player characters.
Keep the existing middle-aged steward on the right, apple baskets, cheese wheels, wine barrels, festive preparations, open hall and modest timber-and-stone courtyard. Replace the conspicuous castle-like background at top center with modest generic rooflines, no identifiable city landmark. Keep delicate Japanese light-novel linework, translucent soft full-color watercolor, warm autumn daylight, restrained ochre, oak brown, cream, muted olive and apple red, paper texture, polished coherence and readable composition.
No recognizable Holo, Lawrence, silver-haired protagonist, wolf-woman, animal ears, animal tail or long copper-haired young woman anywhere, including background. No words, letters, numbers, captions, written signs, UI, speech balloons, logos, signatures or watermarks. No modern objects, neon, armor, 3D or grayscale.
```

### tavern.png

```text
Use case: precise-object-edit.
Asset type: full-color medieval merchant browser-game news illustration, 3:2 landscape, 1536x1024.
Input image: the provided tavern.png is the EDIT TARGET and the style reference.
Primary request: remove Holo and Kraft Lawrence entirely. This picture illustrates news circulating in the world, not the player characters' personal experience. Recompose the left and center seating area naturally into the same tavern. Keep the ordinary brown-capped traveling merchant at the right sharing news, but his listeners are now two entirely ordinary adult townspeople: a middle-aged dark-haired woman with a simple cream linen headscarf and muted moss-green wool dress, and a stocky adult brown-haired local craftsman in a plain beige linen shirt and russet vest. Natural modest everyday clothing, human ears only, no animal features. They listen to the traveling merchant beside ceramic mugs and his worn leather satchel. Neither resembles Lawrence or Holo in hair, face, costume, or silhouette. Use an observational medium-wide view so the tavern and circulating news are the subject, no heroic portrait.
Preserve the established beautiful delicate clean pen-and-pencil linework, soft translucent full-color watercolor, warm amber hearth light, oak beams, rough stone fireplace, pottery, subtle paper texture and restrained natural palette of the reference. Believable late-medieval European tavern, anatomy and furniture. Remove every remnant of long copper hair, wolf ears, tails, silver-gray-haired young merchant, blue blouse and red checked cloth. Keep a complete naturally painted scene where characters were removed.
No Holo, no Lawrence, no named or recognizable protagonist, no wolf-person, no text, labels, captions, dialogue bubbles, logos, watermarks, panels, modern objects, photorealism, 3D or grayscale. Full bleed, no added border.
```

### traveler.png

```text
Use case: precise-object-edit.
Asset type: one finished full-color traveler-news illustration for a medieval merchant browser game.
Input image: the supplied traveler.png is the edit target. Preserve its current gentle full-color fine-line watercolor style, 1536x1024 3:2 landscape framing, countryside, autumn trees, anonymous distant modest village, road, stopped canvas-covered wooden wagon, resting chestnut horse and the ordinary pedestrian traveler on the right.
Primary request: REMOVE BOTH RECOGNIZABLE PROTAGONISTS completely. On the left, remove the reddish-haired wolf-woman including her entire body, hair, animal ears, fluffy tail, blue blouse, red checked cloth and all traces of her silhouette. Fill that area naturally with the empty wooden wagon bench, neutral cream-brown cargo sacks, woven baskets and the cream canvas interior. No person should be seated in or on the wagon.
Replace the silver-haired young man in the center with a clearly different ordinary middle-aged wagon driver, roughly 50 years old: weathered broad face, short dark-brown hair mostly under a plain gray cloth cap, short brown beard, simple dull ochre wool tunic and practical neutral work vest. He stands on the ground by the stopped wagon wheel, chatting naturally with the existing pedestrian traveler on the right. He must NOT look like Lawrence: no silver or pale hair, no youthful handsome narrow face, no recognizable protagonist outfit. Retain the idea of two anonymous ordinary travelers exchanging local news, not a scene about the player's party.
Make the wagon clearly parked at the roadside and horse quietly resting, not moving without a driver. Keep everyday late-medieval European materials, natural anatomy, understated friendly faces and coherent perspective. Preserve restrained natural colors, delicate pen-and-pencil linework, soft translucent watercolor and warm airy autumn daylight.
No Holo, no Lawrence, no wolf features, no fantasy character, no protagonist lookalike, no specific-city landmark, no modern objects, no text, letters, numbers, captions, panels, dialogue balloons, UI, logo, signature or watermark.
```
