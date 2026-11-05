# 图片素材来源

本文记录当前游戏实际使用的图片及生成提示词。所有运行素材均保存在项目内；官方 JPEG 保留原图；小说插图使用局部去水印展示版，原始扫描在原作库中保留。显示裁切由 CSS 完成。原作插画：文仓十；官方地图：出光秀匡。小说插图的原文件、卷幕场景和识别依据见 [novel-art.md](novel-art.md)。

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

`assets/novel/` 中的六张PNG来自用户提供的原作资料，已按用户要求去除右下书源水印，仅遮挡区域采用AI补绘，完整构图与其余像素保留。原始JPEG及书源标记继续保存在原作库中。图册与剧情插页均引用当前PNG。清单、场景对应、补画限制及内置imagegen实际提示词见 [novel-art.md](novel-art.md)；文字考据见 [novel-content.md](novel-content.md)。

## AI 地图与道具

以下地图、城镇与两帧马车均使用内置 `image_gen.imagegen` 生成。原文件直接复制到项目，保留真实 PNG 格式与 alpha。地图以官方原图为参考，交互锚点另见 [sources.md](sources.md)；局部山林、支流、纹理与建筑属于同人补画，不是官方设定的精确复原。

| 本地文件 | 原始尺寸／格式 | 实际用途 |
| --- | --- | --- |
| `assets/world-map-v3.png` | 1052 × 1495，RGB PNG | 地形主底图，无文字或建筑，游戏另叠城镇、商路与标签。 |
| `assets/wagon/companions-1.png`、`companions-2.png` | 各512 × 341，RGBA PNG | 用户选定E版：赫萝与罗伦斯两颗大头左右互挤，迷你马车在下方；地图按500ms/帧交替。 |
| `assets/village-v3.png` | 1254 × 1254，RGBA PNG | 农舍、谷仓、风车的麦田村庄主题。 |
| `assets/harbor-v3.png` | 1254 × 1254，RGBA PNG | 仓库、码头、帆船与渡船的河港主题，无跨主河桥梁。 |
| `assets/cathedral-v3.png` | 1254 × 1254，RGBA PNG | 石教堂、钟楼、市集与低城墙的教会城镇主题。 |

两帧马车、村庄、河港、教会城镇图的四角 alpha 均为0。三类城镇图表达地区主题，不代表具体建筑的原作还原。原作斯劳德主河以渡船通行，城内人工运河另有桥和水门；两者在文字与地理考据中区分。

## 实际生成提示词

以下保留在用资产的成功请求原文。运行游戏无需访问生成器或外部文件。

### companions-1.png / companions-2.png

- 工具：内置 `image_gen.imagegen`，原始E版生成与同一造型定向编辑均使用 `transparent_background=true`。
- 原始E版仅以 `assets/hero.jpg` 为人物、服装与配色参考（官网来源见上文）；用户要求头像占主体一半以上，不使用真实人车比例。成品为AI同人补画，不是官方Q版插图。
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

