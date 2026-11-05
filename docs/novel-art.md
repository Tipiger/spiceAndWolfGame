# 本地原作插图选用记录

从用户提供的 `assets/狼与香辛料原作/` 查看第 1、2 卷正文和全部插图索引，再逐张查看下列 6 张候选。游戏使用的六张插图现为 `assets/novel/` 中的去水印 PNG 展示版。原始 JPEG 及书源标记完整保存在原作库中；卷幕对应关系不变，没有复制整套原作目录。

原作目录的 `插图.txt` 只有标题，没有图片与正文的对应标注。因此下文区分画面与正文直接吻合的场景，以及依据插图顺序、人物和所在卷推定的场景。文本行号均以本地文件为准。

## 选图与场景映射

| 资源 | 原始用户文件路径 | 尺寸 | 画面与对应依据 | 建议展示场景 |
| --- | --- | --- | --- | --- |
| `assets/novel/v1-holo-travel-clothes.png` | `assets/狼与香辛料原作/第01卷/插图_11.jpg` | 400 × 576 | 黑白整身赫萝，耳、尾可见，穿罗伦斯的大号旅行衣装。与第 1 卷第一幕 935–977 行次日早晨借穿衣服、询问衣服是否合身、为尾巴留空间的情节吻合。 | 初遇后的「同行」一幕、伙伴介绍。不要当成赫萝最初从麦堆现身的瞬间。 |
| `assets/novel/v1-apples-on-wagon.png` | `assets/狼与香辛料原作/第01卷/插图_12.jpg` | 400 × 576 | 黑白双人马车图；戴头巾的赫萝抱着苹果进食，罗伦斯坐在旁边。对应第 1 卷第三幕 135–231 行帕兹欧苹果摊购买大量苹果、赫萝在马车上连吃苹果。场景明确。 | 帕兹欧初到、苹果图鉴、同行者短过场。它是吃苹果的剧情画面，不是苹果产地证明或市场交易凭证。 |
| `assets/novel/v1-money-changer.png` | `assets/狼与香辛料原作/第01卷/插图_13.jpg` | 400 × 576 | 黑白坐姿青年、面前的钱币和钱柜。第 1 卷第三幕 1015–1160 行写到怀兹坐在兑换摊、罗伦斯向其打听银币。依据画面、人物与插图顺序，可合理对应怀兹；原图无姓名图注。 | 银币风波中的钱币情报/人物介绍。单一特雷尼银币规则下仍可讲银币成色与商行情报，不据此恢复兑换玩法。不要误标为米隆毛皮收购商。 |
| `assets/novel/v1-milone-negotiation.png` | `assets/狼与香辛料原作/第01卷/插图_14.jpg` | 400 × 576 | 黑白室内商谈；桌前戴眼镜的商行负责人，身后站着年轻职员，画面右侧有谈话者背影。第 1 卷第四幕 175 行起介绍米隆帕兹欧分行负责人，969 行起转入夜间营救交涉。依据人物与插图位置可合理对应米隆行长；正文文件没有图片图注，具体是哪次谈判不硬指定。 | 米隆商会接洽、银币计划与营救的商谈气氛。不能称为原作中「毛皮成交现场」的确证图。当地文本译为「列支敦·马贺特」，游戏使用的「马尔海特」是同一人物的译名取舍。 |
| `assets/novel/v1-companions.png` | `assets/狼与香辛料原作/第01卷/插图_08.jpg` | 400 × 584 | 第一卷彩页；赫萝戴头巾坐在窗边、罗伦斯在她身后，图下留有日文台词。台词与第五幕 477–557 行营救后在马车重逢、确认赫萝平安、提到随身麦子的段落相符。场景明确。 | 银币事件中「救援重逢」一幕，也可作双人关系图。不要将此图设为第一次见面，或把它说成银币交易彻底结算之后的现场。 |
| `assets/novel/v2-merchant-banter.png` | `assets/狼与香辛料原作/第02卷/插图_10.jpg` | 400 × 583 | 黑白双人近景，戴头巾的赫萝贴近罗伦斯的肩膀并抓住手臂。与第 2 卷第一幕 397–445 行谈到蜂蜜腌苹果、梨、桃，赫萝要求罗伦斯答应买给她吃的动作相符。人物和动作明确对应；不是与诺拉相遇的画面。 | 「胡椒北行」途中轻快的旅伴片刻、蜂蜜渍水果的图鉴配图。不是胡椒交易或品质鉴定的现场图。 |

实际接入：6张全部收录于「手账→原作资料」插图册；旅装图用于序幕结尾的同行插页，苹果图用于毛皮生意后的旅途插页，商会图用于银币风波交涉，第二卷闲谈图用于北行回望和旅伴商谈。插页标题注明对应情境，不把相邻情节误作同一现场。钱币摊与营救重逢图目前仅在插图册展示。商会和钱币摊两张的识别属于有正文支持的推定，不伪造作者图注。

## 展示与取舍

- 这些扫描图只有 400 像素宽，优先放在视觉小说的竖幅插画框、商品图鉴的故事配图或人物详情面板中，使用 `object-fit: contain` 保留全图。大幅横向铺满屏幕会显著模糊，并截掉人物与图下文字。
- 已有 `assets/hero.jpg` 比这批扫描图分辨率高，且是小说插画风格的双人宣传图；标题画面可以保留，新图用于确切的原作场景补充。
- 第 1 卷彩页 `v1-companions.png` 下方自带日文台词。中文对话应放在独立文本框中，不覆盖在原台词上。
- 没有选用含封面标题、目录、广告式排字的页面，也没有选用初遇裸身图。第 2 卷诺拉与羊犬的图属于更晚剧情，没有拿它们冒充胡椒北行开端。
- 每张原文件右下均含原有书源水印，完整保留。所有资产来自用户提供的本地书稿，仅供当前私人游戏使用；本记录不构成对来源或权属的新主张。

## 可支持文本补充的正文线索

以下只记录可核对的背景，不将小说中的单次交易价格直接当成游戏经济平衡值：

- **帕兹欧河运**：第 1 卷第三幕第 5 行起提到位于斯拉乌德河中游、上游粮区和更远的森林山地、漂流木材和运粮船、无桥而靠渡运连接两岸。适合城镇介绍、地图悬浮信息和码头公告。
- **米隆商会**：同幕 269–291 行描述南方总行、帕兹欧分行、商行情报与码头附近的卸货通道。适合商会介绍和公告发布人背景。
- **苹果**：同幕 135–231 行是帕兹欧市场的苹果摊和赫萝吃苹果，并未证明苹果产自帕兹欧。产地与游戏腐坏天数仍应标为经营设计。
- **轻巧的胡椒**：第 1 卷尾声 235–275 行，罗伦斯选择体积轻巧的胡椒，考虑入冬后肉食增加的需求。第 2 卷第一幕 23–27 行又强调小袋胡椒的高价值。适合解释空间、重量和高价商品的风险取舍。
- **北行地貌与季节**：第 2 卷第一幕 7–27 行为深秋近冬、起伏的岩石丘陵、窄路、薪柴与稻草；51–55 行给出两人相遇约两周、帕兹欧银币事件结束九日前的相对时间。没有据此虚构官方的公历日期。
- **北行食品**：第 2 卷第一幕 397–445 行提到盐渍保存习惯，以及蜂蜜腌苹果、梨、桃，桃片可与无花果、杏仁及少量姜同渍。可丰富食品图鉴；昂贵腌渍品在文中偏向富人消费，不能直接说成每个城镇的普通廉价主食。

原始路径基准：`/Users/wangyiqing05/playground/spiceAndWolfGame/`。

## 去水印展示版

用户验收三张试样后，六张插图全部接入游戏图册及剧情插页，文件名见上表。原图及“轻小说文库 / www.wenku8.cn”书源标记继续保存在原始用户路径；作者与原作出处不变。旧运行 JPEG 副本及已验收的临时对比输出不再保留。

工具为内置 `image_gen.imagegen`，每张分别调用，`referenced_image_paths` 仅含对应原始 JPEG，`transparent_background=false`。彩色图另以去水印结果定向编辑，取得不猜写缺字的背景补片，提示词见下文。生成结果缩回原尺寸，只合成右下角水印区域（零基坐标 x=246…399，y=图高−66…图高−1），左、上边缘分别以6、7像素渐变衔接；区域外逐像素保留原图。前三张使用已验收的补绘结果，其余三张按相同方式处理。

水印遮住的靴子、地面、衣料、袖口、桌沿等为AI推补，不能视作原稿的准确复原。彩色重逢图保留可见日文；水印覆盖的字无法可靠恢复，未猜写缺字。原图为400像素宽，展示版保持原尺寸，不做全图重绘或锐化。

### 实际成功编辑提示词

每次请求由以下通用段和对应补画段原样拼接：

```text
Use case: precise-object-edit.
Asset type: a conservative restoration preview of a user-provided scanned Japanese light-novel illustration.
Input image: the supplied single image is the EDIT TARGET.
Primary request: remove ONLY the colorful lower-right Chinese book-source watermark/logo ("轻小说文库" and "www.wenku8.cn") completely, and reconstruct the small area of illustration it covers. Keep every other part as unchanged and pixel-faithful as possible.
Style/medium: preserve the existing grayscale pencil/ink lines, halftone/screentone grain, low-resolution scan texture and white paper.
Composition/framing: retain exact original full portrait page, original proportions, edge contents, pose, expressions, facial features, hair, clothing, objects and background. Do not crop, zoom, add padding, clean the rest of the scan, denoise, sharpen or enhance resolution. Do not redraw faces or hands.
Constraints: the edit must be confined to the logo's bottom-right region, approximately x=248..399 and y=516..575 on the original 400×576 image. Outside this region preserve the original artwork. No new text, signature, logo or watermark. This is only an edited derivative preview; the original scan remains separately preserved.
Local restoration details: <对应补画段>
```

**v1-holo-travel-clothes**

```text
Restore the small portion of Holo's dark stocking / right lower leg and the light wood-grain ground that lie beneath the lower-right logo. Preserve the black fur hem and white boot fur exactly. Do not redesign her boots or extend her leg.
```

**v1-apples-on-wagon**

```text
Restore only the fabric folds, dark skirt / blanket and a little wagon edge beneath the lower-right logo, using the immediately neighboring black-and-white screentone and pencil texture.
```

**v1-milone-negotiation**

```text
Restore only the lower right of the seated man's dark suit sleeve and cuff and the light horizontal tabletop beneath the lower-right logo. Continue existing contours and fine screentone using neighboring pixels as guide.
```

**v1-money-changer（完整请求）**

```text
Use case: precise-object-edit.
Input image: the supplied single image is the EDIT TARGET.
Primary request: remove ONLY the colorful lower-right Chinese book-source watermark/logo (轻小说文库 and www.wenku8.cn), reconstructing the small area it covers. Keep every other part pixel-faithful to the original scan.
Composition: preserve the entire original 400×576 portrait page, framing, characters, facial features, expressions, hands, pose, clothing and background. No crop, zoom, added padding, denoising, sharpening or stylistic enhancement.
Constraints: restrict the edit to approximately x=248..399, y=511..575. Match the original ink linework, scan grain and tone. No new objects, logos, watermarks or lettering. Original scan remains preserved separately.
Local restoration details: Restore the wooden floorboards and edge of the dark padded seat in the lower-right corner; follow the existing diagonal floorboard lines. Preserve the scattered coins on the table.
```

**v1-companions（完整请求）**

```text
Use case: precise-object-edit.
Input image: the supplied single image is the EDIT TARGET.
Primary request: remove ONLY the colorful lower-right Chinese book-source watermark/logo (轻小说文库 and www.wenku8.cn), reconstructing the small area it covers. Keep every other part pixel-faithful to the original scan.
Composition: preserve the entire original 400×584 portrait page, framing, characters, facial features, expressions, hands, pose, clothing and background. No crop, zoom, added padding, denoising, sharpening or stylistic enhancement.
Constraints: restrict the edit to approximately x=248..399, y=519..583. Match the original ink linework, scan grain and tone. No new objects, logos, watermarks or lettering. Original scan remains preserved separately.
Local restoration details: This is a muted full-color illustration. Remove only the colorful logo and URL, reconstructing the dark navy clothing and brown seat/background beneath it. Preserve all existing visible Japanese caption glyphs, including the entire short upper line. Do not invent any missing Japanese text hidden by the watermark; keep only the actual visible original text. Do not add new text. Preserve the original warm colors.
```

**v1-companions 背景补片定向编辑**

输入为本图去水印后的彩色结果，参数仍为 `transparent_background=false`。最终只取右下角背景补片，与原始扫描合成；原图可见文字保持原样。

```text
Use case: precise-object-edit. The input is the EDIT TARGET. Remove ONLY the entire LOWER long white Japanese caption at the very bottom of this image (the line beginning ぬしがその麦を). Fill its small area with matching dark navy/black cloth and warm brown background from immediately above and below. Leave the short upper line 無事でよかった completely unchanged. Preserve the exact full portrait, people, hands, clothes and all other image pixels. Do not add or replace any letters, characters, logos or watermark. This supplies a clean background patch; the actual visible original lettering will be preserved separately.
```

**v2-merchant-banter（完整请求）**

```text
Use case: precise-object-edit.
Input image: the supplied single image is the EDIT TARGET.
Primary request: remove ONLY the colorful lower-right Chinese book-source watermark/logo (轻小说文库 and www.wenku8.cn), reconstructing the small area it covers. Keep every other part pixel-faithful to the original scan.
Composition: preserve the entire original 400×583 portrait page, framing, characters, facial features, expressions, hands, pose, clothing and background. No crop, zoom, added padding, denoising, sharpening or stylistic enhancement.
Constraints: restrict the edit to approximately x=248..399, y=518..582. Match the original ink linework, scan grain and tone. No new objects, logos, watermarks or lettering. Original scan remains preserved separately.
Local restoration details: Restore the dark grayscale fabric folds of the cloak in the lower-right corner, matching the halftone texture. Preserve the hands, faces, shoulder and all clothing edges exactly.
```
