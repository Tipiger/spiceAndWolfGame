/* 原作叙事与出处；经营数值维护于 design/数值策划.xlsx。 */
globalThis.SW_CONTENT = {
  "version": 8,
  "title": "狼与香辛料 · 行商旅记",
  "chapterTitle": "第一章 · 狼与银币的约定",
  "subtitle": "麦田、河港，与两个人的北行商路",
  "storyBackground": "assets/runtime/story/chapter-one-pattern.webp",
  "mapWagonArt": {
    "frames": [
      "assets/runtime/wagon/companions-1.webp",
      "assets/runtime/wagon/companions-2.webp"
    ],
    "description": "赫萝与罗伦斯坐在迷你马车上，两颗大脑袋左右互挤"
  },
  "mapNote": "依官方375×533世界地图重绘；城镇锚点保持官方图位置，虚线商路、行程与旅费为游戏设计。",
  "adaptationNote": "主线按第一卷相遇、毛皮交易、银币风波及第二卷开端的胡椒交易改编，关键对话摘自用户提供的本地译文，连接叙述为新写，出处与字句整理见原作资料说明。公开市场、收购公告、拟制行商历、货舱、世界事件及酒馆消息为经营改编；公告交付并非原作银币事件的解法。",
  "initial": {
    "city": "pasloe",
    "unlockedCities": [
      "pasloe",
      "yorentz"
    ],
    "unlockedMechanics": [
      "trade"
    ]
  },
  "goods": [
    {
      "id": "wheat",
      "name": "小麦",
      "unit": "袋",
      "icon": "wheat",
      "description": "麦田村落最熟悉的货物。分量沉，却总能找到需要面包的城镇。",
      "sourceType": "原作明确产地",
      "sourceNote": "帕斯罗是官方设定中的产麦村落；吕宾海根的零售供应为游戏补全。",
      "catalog": {
        "origin": "帕斯罗的麦田出产小麦，远方城镇的粮商也常备着麦袋。",
        "canonContext": "罗伦斯曾因本钱不足而经营利润薄、关税高的帕斯罗小麦。山村里另有耐寒耐虫的麦种，谷物的品种与去向并不相同。",
        "merchantNote": "麦袋占格又压秤，先算整车能带多少，再扣往返旅费。约伦兹和帕兹欧的整批公告适合顺路交付。",
        "sourceRef": "第1卷 第一幕 83–85、123–147、213–219行",
        "sourceNote": "产麦与麦种情境来自正文；本版麦袋不区分品种，市场清单与货舱数值另定。"
      }
    },
    {
      "id": "fur",
      "name": "貂毛皮",
      "unit": "份",
      "icon": "fur",
      "description": "从东面山村换来的貂毛皮。约伦兹的旧商路连接盐货与毛皮，帕兹欧商会则愿意认真验货议价。",
      "sourceType": "原作采购与交易",
      "sourceNote": "官方试读中，罗伦斯将约伦兹采购的盐送往东面山村，换得貂毛皮，再到帕兹欧出售。约伦兹货场供应毛皮为旧商路补全，不把约伦兹称为毛皮产地。",
      "catalog": {
        "origin": "东面山村换得貂皮；约伦兹与帕兹欧按商路集散。",
        "canonContext": "把约伦兹买来的盐送到山村后，罗伦斯带着貂皮前往帕兹欧。米隆的验货场上，赫萝借果香话术替这批皮货抬高了价钱。",
        "merchantNote": "毛皮耐储存，适合留作跨城卖货。帕兹欧的商人收皮货时，值得多问几家报价。",
        "sourceRef": "第1卷 第二幕 133–149行；第三幕 269–277、335–523行",
        "sourceNote": "山村采购与米隆交易明示；约伦兹货场供货为补全，果香不是每份毛皮的固定属性。"
      }
    },
    {
      "id": "salt",
      "name": "盐",
      "unit": "袋",
      "icon": "salt",
      "description": "日常调味与保存食物都用得上。约伦兹商路上的老买卖。",
      "sourceType": "原作采购与集散",
      "sourceNote": "第一卷第二幕记载约伦兹采购盐；第二卷第一幕明确盐货经过波罗森。两地均不据此称为产盐地，零售库存为游戏设计。",
      "catalog": {
        "origin": "约伦兹的货场可以买到盐，波罗森也是盐货往来的中继站。",
        "canonContext": "盐是罗伦斯旧商路的货物：从约伦兹购入，再运到东面的山村交货。波罗森的商道也有从北方、东方运来的盐与铁。",
        "merchantNote": "可久放，但每袋仍有分量。比较两个货源时要连旅费一起算；吕宾海根的盐公告窗口较短。",
        "sourceRef": "第1卷 第二幕 133–149行；第2卷 第一幕 115–125行",
        "sourceNote": "采购地及经过波罗森的盐货明示；当地公开零售、价格与补货量为游戏设计。"
      }
    },
    {
      "id": "apple",
      "name": "苹果",
      "unit": "篮",
      "icon": "apple",
      "description": "帕兹欧露店上诱人的红苹果。甜香会随旅途渐退，赶在新鲜时送到买家手上，才卖得起好价。",
      "sourceType": "原作采购地",
      "sourceNote": "第一卷第三幕明确帕兹欧有果物露店、是通往南方的中继站；该段不交代苹果具体产地，不把采购地当作种植地。",
      "catalog": {
        "origin": "帕兹欧的果物露店可以买到苹果，南来北往的货商在此歇脚。",
        "canonContext": "帕兹欧是通向南方的果物中继站。赫萝第一次在城里买苹果，便把罗伦斯给的一整枚银币花成了满怀的鲜果。",
        "merchantNote": "苹果经不起久放。赶赴约伦兹前先算好路程；高价公告值得一跑，也需要留出交货余量。",
        "sourceRef": "第1卷 第三幕 107–115、135–215行",
        "sourceNote": "市场、果物商路与购买情节明示；不能把帕兹欧称为苹果种植地，保质与价差为改编。"
      }
    },
    {
      "id": "pepper",
      "name": "胡椒",
      "unit": "包",
      "icon": "pepper",
      "description": "轻巧而昂贵的香辛料。银币事件结束后，新的商路便从它开始。",
      "sourceType": "原作交易路线",
      "sourceNote": "第一卷尾声以胡椒结算，第二卷第一幕在波罗森出售，并明确其由米隆从利登王国拉玛帕达进口。两座现有市场是集散地，非种植地。",
      "catalog": {
        "origin": "利登王国·拉玛帕达；米隆进口后，经帕兹欧转往波罗森。",
        "canonContext": "罗伦斯在银币风波后要求以胡椒结算，看中它轻巧、冬日肉食调味又有需求。到波罗森验货时，他拿出了米隆签发的拉玛帕达进口证明。",
        "merchantNote": "单格可以堆叠多包，重量轻却占用许多本钱。可在波罗森转售，也可备足路费后去赶吕宾海根的公告。",
        "sourceRef": "第1卷 尾声 235–275行；第2卷 第一幕 633–667行",
        "sourceNote": "产地、进口证明和交易路线明示；本版不开放远方产地，采购与收购金额另定。"
      }
    },
    {
      "id": "wine",
      "name": "葡萄酒",
      "unit": "桶",
      "icon": "wine",
      "description": "酒馆与旅店的常客。先算清一桶的利润，再答应旅伴添上一杯。",
      "sourceType": "原作食用／贸易补全",
      "sourceNote": "官方第一卷试读有葡萄酒、葡萄园及葡萄酒业者；帕兹欧、波罗森和吕宾海根的具体批发供应为游戏补全。",
      "catalog": {
        "origin": "葡萄酒从酒庄流向各地，河港与商路城镇的酒商接手分销。",
        "canonContext": "避雨的教会里，罗伦斯遇过与酒商议价的葡萄园主人。到了帕兹欧，他与赫萝又在一杯杯酒之间试探着彼此的打算。",
        "merchantNote": "酒桶耐储存，却占地方又压秤。可把买家公告与普通买卖排进同一程，装车前先留好位置。",
        "sourceRef": "第1卷 第二幕 155–163行；第三幕 643–645行；第四幕 35–61行",
        "sourceNote": "葡萄园、酒业与饮酒情境明示；现有桶装货、批发城镇和不计短期腐坏均为补全。"
      }
    },
    {
      "id": "honey",
      "name": "蜂蜜",
      "unit": "罐",
      "icon": "honey",
      "description": "酒馆甜点与蜜渍果物都少不了它。罐口封得稳不稳，关系着下一程的货色。",
      "sourceType": "原作食用／贸易补全",
      "sourceNote": "官方试读出现蜂蜜糖、蜂蜜酒、蜂蜜食用；罐装蜂蜜货包与供货城镇为游戏补全。",
      "catalog": {
        "origin": "封罐的蜂蜜随商队运往各地，酒馆与面包铺都是常客。",
        "canonContext": "罗伦斯曾用蜂蜜糖与年轻骑士打开话头。帕兹欧的蜂蜜面包也让人垂涎，甜食在旅途中既是享受，也能拉近人与人的距离。",
        "merchantNote": "蜂蜜耐储存，每栈数量有限。波罗森的收购窗口较长，适合连同其他生意一起规划。",
        "sourceRef": "第1卷 第一幕 63–113行；第三幕 837–843行",
        "sourceNote": "蜂蜜糖与蜂蜜面包明示；罐装贸易品、供应城镇和公告需求为改编。"
      }
    },
    {
      "id": "cheese",
      "name": "奶酪",
      "unit": "轮",
      "icon": "cheese",
      "description": "浓香的奶酪轮适合旅店与宴席，却经不起太久的马车颠簸。先看好买家与路程，再决定装多少。",
      "sourceType": "原作食用／贸易补全",
      "sourceNote": "官方第一卷试读有山羊奶酪；把奶酪装为可交易货轮、配置帕斯罗与波罗森供货以及保质4天，均为游戏补全。",
      "catalog": {
        "origin": "山羊奶酪既能为旅途添一餐，也常被旅店和宴席成批购入。",
        "canonContext": "教会借宿那晚，罗伦斯在煮好的马铃薯上添了山羊奶酪。平日独行会省下的花费，有了旅伴便显得值得。",
        "merchantNote": "奶酪保鲜的日子不长。从帕斯罗去帕兹欧，装车前先确认公告截止日，途中尽量少停留。",
        "sourceRef": "第1卷 第二幕 237–263、299–329行",
        "sourceNote": "山羊奶酪的食用情境明示；奶酪轮、帕斯罗与波罗森货源及4天保质为补全。"
      }
    }
  ],
  "cities": [
    {
      "id": "pasloe",
      "name": "帕斯罗",
      "subtitle": "麦浪与收获祭",
      "x": 56,
      "y": 87.24,
      "japaneseName": "パスロエ",
      "description": "赫萝曾守望的产麦村落。收割祭中，最后割下麦束的青年要在谷仓里住满一周，村外的行商马车却得赶着下一笔交易上路。",
      "canonicalPixel": {
        "x": 210,
        "y": 465,
        "anchorType": "official-click-area-center",
        "hotspot": {
          "left": 192,
          "top": 454,
          "width": 36,
          "height": 22
        },
        "source": "https://spicy-wolf.com/1st/assets/css/original.css",
        "uncertaintyPx": 0
      },
      "marketNote": "公开市集只经营列出的货物。收购公告另行验货；无需领取，在公告期限内带齐自有货物到收购地即可交付。"
    },
    {
      "id": "yorentz",
      "name": "约伦兹",
      "subtitle": "盐与毛皮的旧商路",
      "x": 66.4,
      "y": 86.12,
      "japaneseName": "ヨーレンツ",
      "description": "罗伦斯购盐后前往东面山村的旧商路节点。盐货换得的貂皮，后来又被带向帕兹欧；眼前的驿站与货场仍为行商留着落脚处。",
      "canonicalPixel": {
        "x": 249,
        "y": 459,
        "anchorType": "source-label-center-manual",
        "source": "https://spicy-wolf.com/1st/assets/images/original/world_map.jpg",
        "uncertaintyPx": 2
      },
      "marketNote": "公开市集只经营列出的货物。收购公告另行验货；无需领取，在公告期限内带齐自有货物到收购地即可交付。"
    },
    {
      "id": "pazzio",
      "name": "帕兹欧",
      "subtitle": "斯劳德河上的商港",
      "x": 42.67,
      "y": 83.02,
      "japaneseName": "パッツィオ",
      "description": "斯劳德河中流的自治商港。主河以渡船通行，人工运河则把货送入市集；水门、码头与米隆商会的卸货场连着各地买卖。",
      "canonicalPixel": {
        "x": 160,
        "y": 442.5,
        "anchorType": "official-click-area-center",
        "hotspot": {
          "left": 129,
          "top": 433,
          "width": 62,
          "height": 19
        },
        "source": "https://spicy-wolf.com/1st/assets/css/original.css",
        "uncertaintyPx": 0
      },
      "marketNote": "公开市集只经营列出的货物。收购公告另行验货；无需领取，在公告期限内带齐自有货物到收购地即可交付。"
    },
    {
      "id": "poroson",
      "name": "波罗森",
      "subtitle": "胡椒与新买家",
      "x": 55.87,
      "y": 74.77,
      "japaneseName": "ポロソン",
      "description": "受西北方吕宾海根教会管辖的贸易中继站。气派石墙内是朴素屋舍，盐、铁、毛织物与谷物往来；晨钟一响，居民便停下活计祈祷。",
      "canonicalPixel": {
        "x": 209.5,
        "y": 398.5,
        "anchorType": "official-click-area-center",
        "hotspot": {
          "left": 182,
          "top": 390,
          "width": 55,
          "height": 17
        },
        "source": "https://spicy-wolf.com/1st/assets/css/original.css",
        "uncertaintyPx": 0
      },
      "marketNote": "公开市集只经营列出的货物。收购公告另行验货；无需领取，在公告期限内带齐自有货物到收购地即可交付。"
    },
    {
      "id": "ruvenheigen",
      "name": "吕宾海根",
      "subtitle": "大教堂与商会",
      "x": 36.27,
      "y": 70.83,
      "japaneseName": "リュビンハイゲン",
      "description": "石墙与瞭望塔围起的教会大城。田地和羊群铺向城外，通行者须经过两层关卡；商会、市集与旅舍在高密的街巷中等待来客。",
      "canonicalPixel": {
        "x": 136,
        "y": 377.5,
        "anchorType": "official-click-area-center",
        "hotspot": {
          "left": 91,
          "top": 341,
          "width": 90,
          "height": 73
        },
        "source": "https://spicy-wolf.com/1st/assets/css/original.css",
        "uncertaintyPx": 0
      },
      "marketNote": "公开市集只经营列出的货物。收购公告另行验货；无需领取，在公告期限内带齐自有货物到收购地即可交付。"
    }
  ],
  "prologue": [
    {
      "speaker": "旁白",
      "text": "收割祭的喧闹渐渐落在身后，罗伦斯驾着马车离开帕斯罗。车上装着待售的毛皮，还有从山村带来的麦束。他打算到帕兹欧卖掉毛皮，再用货款准备下一趟生意。\n在河边停下来过夜时，他掀开货台的麻布，却发现貂皮里蜷着一个陌生女孩。更奇怪的是，她头上长着狼耳，身后还露出一条蓬松的尾巴。",
      "scene": "wheat"
    },
    {
      "speaker": "旁白",
      "text": "女孩醒来后，先朝月亮发出一声真正的狼嚎，接着若无其事地讨起酒喝。罗伦斯握住腰间的银短剑，问她到底是谁。\n「咱的名字是赫萝，好久没有以这种模样出现了。」\n赫萝——那正是帕斯罗村丰收之神的名字。罗伦斯以为她在开玩笑，她却说起了村里的麦田，以及自己在那里守了多少年的约定。",
      "scene": "night"
    },
    {
      "speaker": "旁白",
      "text": "为了让罗伦斯相信，赫萝把一只手变成了巨大的狼爪。厚重的骨头、温热的肉垫，都不是戏法。她解释，自己寄宿在麦子里，这回正是借着车上的麦束，离开了村落。\n罗伦斯担心村里的收成，她却低下了头。新的耕作办法已经传来，村民不再需要她；收成不好时，却仍会怪她反复无常。",
      "scene": "night"
    },
    {
      "speaker": "旁白",
      "text": "刚才还得意地自称贤狼的女孩，忽然把脸埋进毛皮。罗伦斯问她，离开村子以后打算去哪里。过了一会儿，她才望向北方。\n「咱想回到北方去。」\n「咱出生的故乡——约伊兹森林。咱都记不得离开故乡多久了……好想回去。」\n她想先看看这个已经改变的世界，再回到久别的故乡。她问，能不能搭上他的马车。",
      "scene": "night"
    },
    {
      "speaker": "旁白",
      "text": "第二天一早，罗伦斯发现赫萝已翻出他最好的旅行衣服，正坐在货台上绑鞋带。那套衣服是他从学徒时代起，攒了许多年才买齐的。\n赫萝张开双臂，丝毫没有做错事的样子，还问能不能在裤子上剪个洞，好让尾巴伸出来。罗伦斯坚决摇头。她只好鼓着脸，把尾巴重新安顿好。",
      "scene": "dawn",
      "image": "assets/runtime/novel/v1-holo-travel-clothes-enhanced.webp",
      "imageCaption": "同行次日的旅装"
    },
    {
      "speaker": "罗伦斯与赫萝",
      "text": "赫萝从货台轻巧地跳下来，回头问他：\n「咱想要和汝一起旅行，行吗？」\n罗伦斯叹了口气。他仍有许多疑问，可一想到重新独自坐在驾座上，竟觉得比从前还寂寞。\n「我想这也算是一种缘分，就让你同行吧。」\n他伸出手，握住那只小而温暖的手。去北方以前，先得把毛皮送到帕兹欧；两个人的旅途，就从眼前这笔生意开始。",
      "scene": "dawn"
    }
  ],
  "worldEvents": [
    {
      "id": "rain",
      "name": "大暴雨",
      "scope": "route",
      "description": "连日暴雨使这段商路泥泞难行。下雨的日子马车行进放缓，雨停后恢复正常。"
    },
    {
      "id": "harvest",
      "name": "大丰收",
      "scope": "market",
      "eligibleGoods": [
        "wheat",
        "apple",
        "honey"
      ],
      "description": "附近产区收成充裕，这座城镇的一种货物供货增加，市价暂时下降。"
    },
    {
      "id": "festival",
      "name": "城市节庆",
      "scope": "city",
      "eligibleGoods": [
        "wine",
        "apple",
        "cheese"
      ],
      "description": "广场挂起彩带，长桌旁陆续摆上酒桶与食篮。宴席让葡萄酒、苹果和奶酪的需求增加，当地经营这些货物的商人提高了收购行情。"
    }
  ],
  "eventArt": {
    "rain": "assets/runtime/events/rain.webp",
    "harvest": "assets/runtime/events/harvest.webp",
    "festival": "assets/runtime/events/festival.webp",
    "tavern": "assets/runtime/events/tavern.webp",
    "traveler": "assets/runtime/events/traveler.webp"
  },
  "newsNoInformation": "酒馆老板：酒钱收下了。今日聊来聊去，倒没有什么新鲜的风声，下回有机会再坐坐。",
  "newsSpeakers": {
    "tavern": "酒馆老板",
    "traveler": "赶路的旅人",
    "public": "旁白"
  },
  "newsTemplates": {
    "rain": {
      "tavern": {
        "hint": [
          "听运货的车夫说，{place}过些天会有一场大雨。若是赶着送货，先给自己留些余地。",
          "你要走{place}？那边传来大雨的消息，车夫们正忙着补雨篷。日子还没问细，先记着这件事吧。"
        ],
        "detail": [
          "问清楚了，{place}从{startDate}到{endDate}有暴雨。那几天车轮只能慢慢挪，雨停才走得快。",
          "熟路的车夫又捎了话：{place}的暴雨落在{startDate}到{endDate}。有鲜货就更得算紧些，别把晴天的脚程当准数。"
        ]
      },
      "traveler": {
        "hint": [
          "前头有人传话，{place}过些日子要下大雨。你这车货要往那边送，可得留神路况。",
          "我刚听同路车夫说起，{place}快有一场大雨。赶期限的话，最好别把路上的日子算得太满。"
        ],
        "detail": [
          "雨天的日子我问到了：{startDate}到{endDate}，在{place}。那段泥路下雨时走不快，等雨过去才恢复。",
          "记好这两个日子，{startDate}和{endDate}。{place}这期间有暴雨，车走得慢；你若还要赶交货，得把这笔时间算进去。"
        ]
      },
      "public": [
        "雨点打在车篷上，{place}的路面已经泥泞起来。暴雨从{startDate}持续到{endDate}，下雨的日子马车放慢脚程，雨停后恢复。"
      ]
    },
    "harvest": {
      "tavern": {
        "hint": [
          "有一批好收成要运进{place}。过些天那里的货会宽裕起来，打算补货的话，不妨留意。",
          "从{place}来的商贩说，附近产区收成不错，过些日子货场会热闹些。具体是什么货，我再替你问问。"
        ],
        "detail": [
          "这回说的是{place}的{goods}。{startDate}到{endDate}供货充裕，价钱会比平常便宜，别记成了别的货。",
          "问到货名和日子了：{goods}，在{place}，从{startDate}到{endDate}。这几天添货、让价，正适合盘算采购。"
        ]
      },
      "traveler": {
        "hint": [
          "{place}那边快有一批丰收货进城。若你的车还空着，或许值得去看看货场。",
          "听那边来的货车说，{place}过些日子供货会宽裕不少。先别急着在别处把本钱全花光。"
        ],
        "detail": [
          "我问清了，是{place}的{goods}，便宜的日子在{startDate}到{endDate}。路程合适的话，你也许赶得上。",
          "那批货是{goods}。记着{place}从{startDate}到{endDate}有这场丰收行情，这批新货带来的让价只在这些天。"
        ]
      },
      "public": [
        "{place}的货场堆起新货，摊主们开始让价。{goods}的丰收供货已经到来，将从{startDate}持续到{endDate}。"
      ]
    },
    "festival": {
      "tavern": {
        "hint": [
          "{place}过些天要摆宴席了。酒食商贩正忙着张罗货物，最近往那边去的车不少。",
          "听说{place}快办节庆了，长桌和酒桶都得备起来。若有合适的吃食，也许能赶上一笔生意。"
        ],
        "detail": [
          "宴席定在{startDate}到{endDate}，就在{place}。当地市集这回要的是{goods}，节庆期间收价会比平日高些。",
          "我又问了个准信：{place}从{startDate}热闹到{endDate}，做{goods}生意的商人会抬高收价。鲜货记得算上路上的日子。"
        ]
      },
      "traveler": {
        "hint": [
          "有人在谈{place}的节庆，过些日子那边要开宴席。带着酒食的车夫都留着心呢。",
          "你听说{place}要办节庆了吗？消息刚沿商路传开，做吃食生意的人已经开始盘算了。"
        ],
        "detail": [
          "日子定下来了，{startDate}到{endDate}，在{place}。当地经营{goods}的市集会提高收价，赶到之前别让鲜货坏在车上。",
          "那边要备的货我问到了：{goods}。{place}的宴席从{startDate}摆到{endDate}，这段时间卖货比平日有利些。"
        ]
      },
      "public": [
        "{place}响起节庆的钟声，广场上已经摆开宴席。当地市集的{goods}需求转旺，收购行情上涨；节庆从{startDate}持续到{endDate}。"
      ]
    }
  },
  "story": [
    {
      "id": "promise",
      "title": "御者台上的约定",
      "canonPosition": "第一卷 · 帕斯罗相遇",
      "summary": "赫萝坐上御者台。去帕兹欧卖掉随车毛皮，是两人同行的第一笔生意。",
      "objective": "与赫萝约定同行，启程前往帕兹欧。",
      "conditions": {},
      "scene": [],
      "reward": {
        "unlockCities": [
          "pazzio"
        ],
        "unlockMechanics": [
          "travel"
        ],
        "flags": [
          "holo_companion"
        ]
      },
      "sourceIds": [
        "novel-trial-1",
        "anime-1",
        "local-novel-1"
      ]
    },
    {
      "id": "packing",
      "title": "两个人的行李",
      "narrativeOnly": true,
      "canonPosition": "第一卷 · 两个人的行李",
      "summary": "赫萝的麦粒随身保存，马车上的货物则要仔细安放。",
      "objective": "查看整装提示，准备启程。",
      "conditions": {},
      "scene": [
        {
          "speaker": "旁白",
          "text": "赫萝把借来的衣服整了整，罗伦斯则重新系紧货台上的绳索。多了一位旅伴，驾座窄了些，食宿的开销也要多算一份。\n「不过，我只不过是个辛苦做生意的商人，你要负责打点自己的餐费啊！」\n赫萝鼓起脸，随即又笑了。她可不打算只当个白吃白喝的乘客，昨夜凌乱的毛皮已经被她收拾得整整齐齐。",
          "scene": "dawn",
          "image": "assets/runtime/novel/v1-holo-travel-clothes-enhanced.webp",
          "imageCaption": "同行次日的旅装"
        },
        {
          "speaker": "旁白",
          "text": "麦束里的麦粒得另外收好。那些是赫萝能够留在这里的凭依，不能混进准备卖给商人的麦袋里。她挑出麦粒，带在身边；罗伦斯则检查马车上的货物与行李。\n毛皮占着地方，吃食又不能压坏。赶路之前，先看看货舱里每件东西怎么摆，也检查马儿能不能拉得动。到了帕兹欧，这些毛皮就该换成下一程的盘缠。",
          "scene": "dawn"
        },
        {
          "speaker": "罗伦斯与赫萝",
          "text": "罗伦斯爬上驾座，赫萝也跟着坐了过来。她望望天色，忽然说：\n「先这样吧！快要下雨了，还是赶紧出发的好。」\n「什……你怎么不早点说！」\n罗伦斯赶紧收好水桶、抓住缰绳，惹得她在一旁笑个不停。一个人坐时显得宽敞的驾座，如今有些挤；不过天凉起来时，两个人靠在一起倒也暖和。",
          "scene": "dawn"
        }
      ],
      "reward": {
        "unlockMechanics": []
      },
      "sourceIds": [
        "local-novel-1"
      ]
    },
    {
      "id": "fur-deal",
      "title": "帕兹欧的第一笔生意",
      "canonPosition": "第一卷 · 毛皮交易与银币传闻",
      "summary": "同行后的第一笔生意：把毛皮带到米隆货场。赫萝的果香话术，让罗伦斯见识到旅伴的本领。",
      "objective": "前往帕兹欧，在当地市场售出至少 {{saleQuantity}} 份貂毛皮。",
      "conditions": {
        "city": "pazzio",
        "soldAt": {
          "city": "pazzio",
          "good": "fur"
        }
      },
      "scene": [
        {
          "speaker": "旁白",
          "text": "毛皮买卖终于见到了现钱。回头想起进城时的事，罗伦斯还是忍不住看看身旁的赫萝。\n帕兹欧的街上堆满南方运来的果物，赫萝一眼就看中了苹果。她拉着他的衣角，眼睛发亮，却偏不直说想吃。罗伦斯故意谈起苹果生意，她的尾巴便在衣服底下急得沙沙作响。最后，那枚银币还是换成了一大堆苹果。",
          "scene": "market",
          "image": "assets/runtime/novel/v1-apples-on-wagon-enhanced.webp",
          "imageCaption": "马车上的苹果"
        },
        {
          "speaker": "旁白",
          "text": "赫萝抱着苹果坐回马车，接连吃了起来。罗伦斯原本只觉得钱包受了损，没想到苹果的香气，竟成了她在货场上谈价的帮手。\n米隆的验货人看过毛皮，报出了一个让他满意的价钱。他正准备点头，赫萝却拉住了衣角。她先悄声确认价钱好不好，随后转向验货人，请他再仔细闻闻手里的皮毛。",
          "scene": "market"
        },
        {
          "speaker": "赫萝",
          "text": "「恩，这是多年难得一见的皮草。或许咱应该这么说：这是多年难得一闻的皮草。」\n验货人困惑地把毛皮凑近鼻子，果然闻到了果香。赫萝趁势说起森林里丰盛的果实，又让他想象：在一堆带着腥味的皮衣里，一件散发果香的衣服会多么特别。\n她从容地说着，罗伦斯却捏着冷汗——那股香气，可不是貂原本就有的。",
          "scene": "market"
        },
        {
          "speaker": "旁白",
          "text": "验货人重新打起算盘，毛皮的评价也跟着变了。离开货场后，罗伦斯才明白，赫萝用的是刚才苹果留下的气味。她不懂每一种货物的行情，却很懂得怎样让人重新看待眼前的东西。\n如今货款已经记下，车上的余货和接下来要采购的东西，也得好好盘算。这位多出来的旅伴，看来带来的不只是食宿开销。",
          "scene": "market"
        }
      ],
      "reward": {
        "flags": [
          "fur_deal_done"
        ],
        "unlockMechanics": [
          "purchase"
        ]
      },
      "sourceIds": [
        "novel-trial-2",
        "novel-trial-4",
        "anime-3",
        "local-novel-1"
      ]
    },
    {
      "id": "silver-rumor",
      "title": "一份过于划算的提议",
      "narrativeOnly": true,
      "canonPosition": "第一卷 · 一份过于划算的提议",
      "summary": "杰廉声称银币将升值，提出用情报换取分成。两人决定先寻找证据。",
      "objective": "在帕兹欧听取杰廉的提议。",
      "conditions": {
        "city": "pazzio"
      },
      "scene": [
        {
          "speaker": "旁白",
          "text": "卖过毛皮，罗伦斯便想起了与杰廉的约定。前来帕兹欧的路上，他们曾在一处教会避雨。年轻商人杰廉就在那儿凑上前，热情地请教生意，还带来了一桩据说能赚钱的消息。\n他说，某种银币的含银量不久后会提高。若在消息传开前先买进，等银币升值，就能从中获利。作为报酬，他想分享罗伦斯赚来的钱。",
          "scene": "rain",
          "image": "assets/runtime/novel/v1-zheren-proposal-enhanced.webp",
          "imageCaption": "教会避雨时结识杰廉（回忆）"
        },
        {
          "speaker": "旁白",
          "text": "教会大厅里，赫萝把耳朵藏在衣服底下，听两个商人你来我往。罗伦斯也曾像杰廉这么年轻，觉得每个同行都懂得比自己多；如今，他已经知道，客气的笑脸和恭维的话都不能替一笔买卖担保。\n杰廉不肯只凭口头承诺交出全部消息，罗伦斯也不打算先付钱。两人约好，等毛皮卖掉，再到帕兹欧把条件谈清楚。",
          "scene": "rain",
          "image": "assets/runtime/novel/v1-shelter-companions-enhanced.webp",
          "imageCaption": "教会大厅里的商人闲谈（回忆）"
        },
        {
          "speaker": "罗伦斯与杰廉",
          "text": "到了帕兹欧，再次见面时，罗伦斯把杰廉的提议重新问了一遍：消息若是真的，利润怎么分；消息若是假的，亏损又该由谁承担？\n「如果你回答稳赚的话，我就打算拒绝：世上没有那么好康的事。」\n杰廉承认，投资有风险。他愿意在消息不实的时候退还情报费，却不会赔偿罗伦斯买卖银币的损失。",
          "scene": "market",
          "background": true
        },
        {
          "speaker": "旁白",
          "text": "条件听来不算苛刻，公证人也能为合约作证。罗伦斯仍觉得不对：若只是骗一笔情报费，杰廉为什么肯答应退钱，又愿意在这座城里公开露面？\n赫萝听着，没有替他下结论。她的耳朵能听出许多东西，却也不是百发百中。两人决定先请米隆打听杰廉的来历，再找懂银币的人核实。等消息的空档，自己的货物生意也得继续。",
          "scene": "market"
        }
      ],
      "reward": {
        "unlockMechanics": []
      },
      "sourceIds": [
        "local-novel-1"
      ]
    },
    {
      "id": "silver-resolution",
      "title": "银币风波后的约定",
      "canonPosition": "第一卷 · 银币调查、商会交涉与脱险",
      "summary": "米隆正在调查杰廉的来历。趁等待消息的空档，完成一笔公告生意，再回帕兹欧核对银币。",
      "objective": "按期交付 {{purchaseCompleted}} 则收购公告，再回帕兹欧等待调查结果。",
      "conditions": {
        "city": "pazzio"
      },
      "scene": [
        {
          "speaker": "旁白",
          "text": "公告上的货已经按期送到，钱也结清了。罗伦斯把采购、旅费和交货所得逐笔记好，再回到帕兹欧。那些是看得见货物、对得上账目的买卖；杰廉许下的好处，却还只是一句话。\n米隆仍在调查他的来历。趁这个时候，两人可以听听城里的消息，也该亲自去核对银币。不能因为手里刚有了余钱，就把它押在一份没有查明的传闻上。",
          "scene": "guild"
        },
        {
          "speaker": "旁白",
          "text": "离开商会后，罗伦斯说要找熟识的兑换商。赫萝问他，是不是要去铸币厂，惹得他笑出了声。那种地方，可不是一个旅行商人想进去就能进去的。\n银币若要大幅改变含银量，往往会先有细微的变化。兑换商整天摸着各地的钱币，也许早已察觉端倪。两人穿过拥挤的街道，往运河桥上那些摆着天秤的钱币摊走去。",
          "scene": "market"
        }
      ],
      "reward": {
        "unlockMechanics": [
          "information"
        ]
      },
      "sourceIds": [
        "novel-trial-4",
        "novel-trial-5",
        "novel-trial-6",
        "anime-5",
        "anime-6",
        "anime-7",
        "local-novel-1"
      ]
    },
    {
      "id": "money-changer",
      "title": "银币的声音",
      "narrativeOnly": true,
      "canonPosition": "第一卷 · 银币的声音",
      "summary": "兑换商处的新旧银币，给出了与升值传闻相反的线索。",
      "objective": "在帕兹欧核对银币线索。",
      "conditions": {
        "city": "pazzio"
      },
      "scene": [
        {
          "speaker": "旁白",
          "text": "桥上的兑换摊前挤满了人。罗伦斯找到了老相识怀兹，问他有没有近几次发行的特雷尼银币。怀兹取出几枚，连发行年份都标得清清楚楚。\n罗伦斯借着阳光检查，又掂量重量，还是看不出差别。连怀兹也说，自己整天碰这些钱币，没有发现变化。正当他发愁时，赫萝伸出手，问能不能让她看看。",
          "scene": "market",
          "image": "assets/runtime/novel/v1-money-changer-enhanced.webp",
          "imageCaption": "怀兹的钱币摊"
        },
        {
          "speaker": "旁白",
          "text": "赫萝把银币拢在掌中，举到耳旁，轻轻摇动。清脆的碰撞声响了几次，她又换了几组银币来听。怀兹觉得这只是胡闹，罗伦斯却盯住了她藏在头巾里的耳朵。\n最后，她把银币放回摊上，腼腆地说：\n「不知道。」\n怀兹连声安慰她，赫萝也笑着告辞。罗伦斯跟上她，一直到人群挡住了兑换摊，才压低声音追问结果。",
          "scene": "market"
        },
        {
          "speaker": "赫萝",
          "text": "「虽然只有些微不同，但越新的银币，感觉声音越低沉。」\n声音低沉，表示含银量在下降，恰好与杰廉承诺的方向相反。赫萝没有当场说破，是因为桥上人多；秘密若有价值，就不该让所有人听见。\n罗伦斯皱起眉。消息既然不实，杰廉为什么还肯签约？她提醒他，退还情报费，不等于替他承担买进银币的亏损。",
          "scene": "market"
        },
        {
          "speaker": "赫萝",
          "text": "「精心计划如何在自己绝不会亏损之下，只让对方去冒获利或亏损的风险，这样的行为也十足算是诈欺。」\n罗伦斯一时说不出话。银币若升值，杰廉能分走利润；若贬值，杰廉最多退回本来就不属于自己的情报费。\n不过，还有一件事解释不了：银币的含银量一向维持得很谨慎，偏偏这时有人四处劝商人买进。真会这么巧吗？",
          "scene": "market"
        },
        {
          "speaker": "赫萝与罗伦斯",
          "text": "「有所企图的人如果不是那名年轻人呢？」\n赫萝这一问，终于让罗伦斯想到另一种可能：杰廉也许是受人雇用，让许多商人悄悄买币。等币价跌下去，商人急着止损，幕后的人就能一批批收走旧币，又不引人注意。\n可对方为什么要这么多将贬值的银币？想通这一层，也许就能反过来做成一桩大生意。罗伦斯拉起赫萝，赶往米隆。",
          "scene": "market"
        }
      ],
      "reward": {
        "unlockMechanics": []
      },
      "sourceIds": [
        "local-novel-1"
      ]
    },
    {
      "id": "milone-plan",
      "title": "商会的筹码",
      "narrativeOnly": true,
      "canonPosition": "第一卷 · 商会的筹码",
      "summary": "罗伦斯把推断带给米隆，个人情报转化为商会规模的交涉。",
      "objective": "与米隆商会确认合作。",
      "conditions": {
        "city": "pazzio"
      },
      "scene": [
        {
          "speaker": "旁白",
          "text": "米隆查到了杰廉背后的梅迪欧商行。罗伦斯把自己的推测带到负责人马尔海特面前：对方在低调回收旧银币，真正的买家，很可能是发行银币的王室。\n王室缺钱，打算把旧币收回来熔掉，降低每枚银币的含银量，再铸出更多新币。同样一批银，就能造出更多钱。要办成这件事，手里先得有足够多的旧币。",
          "scene": "guild",
          "image": "assets/runtime/novel/v1-milone-negotiation-enhanced.webp",
          "imageCaption": "米隆商会的交涉"
        },
        {
          "speaker": "旁白",
          "text": "谁握住大量旧币，谁就能和急着用钱的王室谈条件。比起币价的一点差额，通商、关税之类的特权才是梅迪欧真正想要的东西。\n可罗伦斯只有一辆马车，既没那么多本钱，也没有人手去各处收币。米隆却办得到。若能抢先收集银币、与王室成交，他们就能从对手手里夺走这笔买卖。情报与商会的力量，终于接在了一起。",
          "scene": "guild"
        },
        {
          "speaker": "旁白",
          "text": "马尔海特听完，没有立刻许诺。他要判断对手已经走到了哪一步，也要确认情报值不值得投入这么多钱。罗伦斯则为自己争取从银币交易所得中分成。\n交涉终于有了结果。走出商会时，他忍不住算起这笔交易若能成功，离开一家自己的店还差多少。赫萝跟在身边，看着他的高兴劲。钱还没有到手，他已经开始描画店里的柜台了。",
          "scene": "guild"
        },
        {
          "speaker": "旁白",
          "text": "回到旅馆，罗伦斯拿起纸笔，画起了梦想中的店铺。赫萝刚睡醒，眼睛有些红。他说，也许用不了多久，自己就不必再四处行商了。\n赫萝的笑容慢慢淡下去。他以为她这么聪明，一个人也能继续旅行，便随口问了一句。\n「咱不想再一个人了。」\n她坐在床沿，摇着够不到地板的双脚。罗伦斯这才发现，自己刚才的话伤到了她。",
          "scene": "night",
          "image": "assets/runtime/novel/v1-loneliness-enhanced.webp",
          "imageCaption": "旅馆里的孤独与安慰"
        },
        {
          "speaker": "罗伦斯与赫萝",
          "text": "「那、那个，我是可以陪你到你回北方之前。」\n罗伦斯笨拙地补了一句，说钱就算进来，也不可能马上开店。赫萝抬起眼，问是不是真的。她没有再逞强，耳朵和尾巴都无精打采地垂着。\n他在床边坐下，握住她试探着伸来的手。问到她梦见什么时，她才断断续续地说：梦里自己醒了过来，昔日的同伴却全都不见了，到处都找不到。",
          "scene": "night"
        },
        {
          "speaker": "赫萝",
          "text": "「咱不想再碰到醒过来时，都见不到人的状况了……咱受够孤独了。孤独好冷。孤独……好让人寂寞。」\n罗伦斯没有急着劝她，只轻轻抱住她。他也曾在陌生城镇和空荡的驾座上，被同样的寂寞击中。他想开店，也是在找一个能让自己回去的地方。\n过了好一会儿，赫萝才松开抓着他衣服的手。他把画着店铺的纸递过去，让她擦掉眼泪。",
          "scene": "night"
        }
      ],
      "reward": {
        "unlockMechanics": []
      },
      "sourceIds": [
        "local-novel-1"
      ]
    },
    {
      "id": "rescue",
      "title": "不能出卖的约定",
      "narrativeOnly": true,
      "canonPosition": "第一卷 · 不能出卖的约定",
      "summary": "对手开始追逼，赫萝被抓。叶勒的出现让两人明白，故乡的旧关系也可能成为威胁。",
      "objective": "继续营救剧情。",
      "conditions": {
        "city": "pazzio"
      },
      "scene": [
        {
          "speaker": "旁白",
          "text": "夜深了，房门外忽然有了动静。赫萝早已披上外套，在黑暗里贴近罗伦斯，轻声提醒：\n「有些迟了，门外有三个人。想必是不速之客吧。」\n这里是二楼，窗外暂时没人。她踏上窗框，先跳了下去；罗伦斯紧跟着翻窗，落地时狼狈地摔了一跤。身后传来撬门的声音，他顾不上疼，抓住她伸来的手，站起来就跑。",
          "scene": "night",
          "image": "assets/runtime/novel/v1-window-warning-enhanced.webp",
          "imageCaption": "木窗前的逃离"
        },
        {
          "speaker": "旁白",
          "text": "经过马厩时，罗伦斯下意识地想去牵马，赫萝却叫他先保住性命。追兵不会为了泄愤就毁掉值钱的马车，等风头过去，还有机会回来。\n她解开颈边的小袋，分出一半麦粒，塞进他的胸前。\n「以防万一，汝也带一些吧。」\n麦粒还带着她的体温。罗伦斯把口袋按紧，跟她钻进巷子；这回带着的，不是一袋能拿去交易的粮食。",
          "scene": "night"
        },
        {
          "speaker": "罗伦斯与赫萝",
          "text": "通往米隆的路也有人看守。赫萝能听见追兵，罗伦斯认得街道，可两人带着彼此，总跑不出包围。她决定引走那些人，让他独自去求援。\n他反对，她却反问：难道要她露出狼耳与尾巴，去求商会救一个被抓的男人？只有他能出面交涉。\n「孤独可是要人命呐，这划算极了。」\n她轻轻抱了他一下，便在他来得及拉住以前，跑进了大街。",
          "scene": "night"
        },
        {
          "speaker": "旁白",
          "text": "罗伦斯冲进米隆，随后送来的威胁信却让他浑身发冷：赫萝已经落在梅迪欧手里，对方知道她是狼，还扬言要把她送进教会。\n若教会认定米隆与被恶魔附身的人来往，整家商会都可能受牵连。马尔海特必须考虑其他人的性命与生意；最省事的办法，就是撇清关系。罗伦斯坐在桌前，知道自己得拿出一个能救她的办法。",
          "scene": "guild",
          "image": "assets/runtime/novel/v1-milone-negotiation-enhanced.webp",
          "imageCaption": "米隆商会的营救交涉"
        },
        {
          "speaker": "罗伦斯",
          "text": "他想到，梅迪欧若早已收齐银币，就没必要只发信威胁。他们还在等，米隆就还有机会抢先与王室成交，再拿对方想要的特权谈判。\n「救出赫萝，然后拼命逃跑，直到贵商行完成交涉。」\n这是罗伦斯给出的办法。只要赫萝还没被送到教会，他们逃得越久，米隆就越有机会。他没有把握能撑多久，却不能把她留在那封信的另一头。",
          "scene": "guild"
        },
        {
          "speaker": "罗伦斯与赫萝",
          "text": "米隆的人借地下通道接应，终于把赫萝救了出来。两人在撤离的马车里重逢，罗伦斯满心的话，最后只挤出一句：\n「太好了，你平安无事。」\n赫萝却瞪着他，让他把她的名字说出来。他不知所措地回答，她立刻纠正：\n「咱是贤狼赫萝。」\n她揪住他的衣服，又气又委屈。原以为冲进去救她的会是罗伦斯，结果竟对着米隆的人认错了。",
          "scene": "night",
          "image": "assets/runtime/novel/v1-companions-enhanced.webp",
          "imageCaption": "营救后的马车重逢"
        },
        {
          "speaker": "罗伦斯与赫萝",
          "text": "罗伦斯没有辩解，缓缓握住她的手臂。赫萝抵抗了一下，便放松下来，连藏在头巾里的耳朵也垂了下去。\n「看见你没事，真的太好了。」\n她终于轻轻点头，用手指顶了顶他胸前装着麦粒的口袋。\n「只要汝一直带着这麦子，咱就不会死。」\n话虽如此，被留下的恐惧并不会因为活得长就减轻。她靠过来，把下巴轻轻搁在他的肩上。",
          "scene": "night"
        },
        {
          "speaker": "旁白",
          "text": "赫萝还带回了一条消息：站在梅迪欧一边的人里，有帕斯罗的叶勒。故乡熟悉的面孔，竟成了认出她身份的人。\n罗伦斯由此想到，背后还牵着经营麦子贸易的伯爵；粮食货款可以帮他们收集银币，减免关税的特权也值得他们争夺。他连忙让车夫把线索送回米隆。\n马车还没把他们送出险境。为了避开追兵，两人接下来仍得进入地下道。",
          "scene": "night"
        }
      ],
      "reward": {
        "unlockMechanics": []
      },
      "sourceIds": [
        "local-novel-1"
      ]
    },
    {
      "id": "escape",
      "title": "地下道里的狼",
      "narrativeOnly": true,
      "canonPosition": "第一卷 · 地下道里的狼",
      "summary": "追兵逼近，罗伦斯受伤；赫萝显露狼形，却也害怕旅伴因此畏惧自己。",
      "objective": "读完脱险与两人的分歧。",
      "conditions": {
        "city": "pazzio"
      },
      "scene": [
        {
          "speaker": "旁白",
          "text": "地下道潮湿昏暗，岔路一条接着一条。两人屏住呼吸，想趁追兵还没合围，找到通往外面的出口。可转过拐角，一个埋伏的人突然扑来，赫萝咬住了对方握刀的手臂。\n罗伦斯挥拳打退那人，拉起她往回跑，却又撞上另一个袭击者。刀子刺进了左臂，热血很快浸透衣袖。他踢开对方，只能继续抓住赫萝往前奔跑。",
          "scene": "underground",
          "image": "assets/runtime/novel/v1-underground-flight-enhanced.webp",
          "imageCaption": "地下道遇袭"
        },
        {
          "speaker": "旁白",
          "text": "血越流越多，罗伦斯已经分不清走过哪些岔路。终于，他们被逼到无路可退的地方，叶勒带着梅迪欧的人追了上来。罗伦斯举着短剑，连站稳都越来越困难。\n赫萝把他拉下来，解开伤口上的布。\n「可能会有些痛，忍耐一下。」\n他忽然想起初遇时她说过的话：变回原来的模样，需要麦子，也可以用鲜血。",
          "scene": "underground"
        },
        {
          "speaker": "旁白",
          "text": "赫萝俯身咬住伤口。有人惊叫着后退，叶勒却仍催促手下抓住她。她看见了罗伦斯脸上的表情，露出一个悲伤的笑。\n「别再看了。」\n褐色毛发从撕裂的衣袖间涌出，狼爪重重踏在地上。罗伦斯伸手抓住掉落的麦袋，再抬头时，眼前已是一头巨狼。她只往前一步，追兵便丢下武器，争相逃进黑暗。",
          "scene": "wolf",
          "image": "assets/runtime/novel/v1-wolf-revealed-enhanced.webp",
          "imageCaption": "贤狼显露真身"
        },
        {
          "speaker": "旁白",
          "text": "危险过去了，赫萝却没有走近他，只用低沉的声音要回麦子。罗伦斯问她要做什么。巨大的前爪刚一抬起，他便本能地往后缩。\n他马上明白，这个动作伤了她。眼前依然是刚才救他的赫萝，可身体里的恐惧，比辩解来得更快。她拾起掉在地上的麦袋，转身离去；那条让她引以为傲的尾巴，低低地垂在身后。",
          "scene": "wolf"
        },
        {
          "speaker": "罗伦斯",
          "text": "罗伦斯想喊她留下，却知道一句“我不怕”已经骗不过任何人。他拼尽力气，喊出了一个商人能想到的理由：\n「你以为……你撕破的衣服多少钱啊？」\n「你以为我花了多少年存下来的积蓄……才买齐那些衣物啊？我会拼命追的，一路追到北方的森林去！」\n巨狼停住了，尾巴甩了一下。他还没等到回答，眼前便彻底黑了下去。",
          "scene": "wolf"
        },
        {
          "speaker": "旁白",
          "text": "再醒来时，眼前是米隆房间的天花板。左臂一动就疼，窗外却已经恢复了白日的喧闹。马尔海特告诉他，赫萝曾守在地下道里，坚持等负责人亲自来，才肯把受伤的他交给救援的人。\n可她现在去了市场，说是要为旅行整装。罗伦斯听着这句话，只想到一种可能：也许她已经打算独自回北方，再也不会坐回他的驾座上。",
          "scene": "dawn",
          "background": true
        }
      ],
      "reward": {
        "unlockMechanics": []
      },
      "sourceIds": [
        "local-novel-1"
      ]
    },
    {
      "id": "companions",
      "title": "苹果与继续同行",
      "narrativeOnly": true,
      "canonPosition": "第一卷 · 苹果与继续同行",
      "summary": "脱险之后，商会结清收益；一张衣物与苹果账单，留下了继续同行的回答。",
      "objective": "在帕兹欧与米隆结算，确认下一程。",
      "conditions": {
        "city": "pazzio"
      },
      "scene": [
        {
          "speaker": "旁白",
          "text": "米隆抢先与王室完成了交易，又用得到的特权同梅迪欧谈妥条件。对手明白继续追逼也拿不到想要的东西，教会的威胁才终于解除。\n到了结账时，罗伦斯原以为足够开店的利润，却在运费、手续费等支出之后缩了水。马尔海特另外从特权交易中分出收益，也表示愿意与他继续来往。这场危险的生意，总算有了一个能落到账上的结果。",
          "scene": "guild"
        },
        {
          "speaker": "罗伦斯",
          "text": "马尔海特问，报酬要付银币，还是替他备成货物。罗伦斯想了想马车上的地方，回答：\n「请问有胡椒吗？胡椒很轻、而且不占空间，今后为了准备过冬，只要肉类料理增多，价格也会跟着上涨。」\n生意还可以继续做，开店的梦想也还在。可想到赫萝，他始终觉得胸口空了一块。正在这时，门外送来了一张给他的请款单。",
          "scene": "guild"
        },
        {
          "speaker": "旁白",
          "text": "罗伦斯先以为是自己忘了哪笔到期的货款，低头看清明细，却猛地跳下了床。上面写着女用长袍、腰带、旅行鞋、梳子，还有大量苹果。\n那么多苹果，光靠两只手根本带不走；可买得这么齐全，单子上偏偏没有马车。\n他顾不得手臂上的疼，攥着请款单冲向卸货场。在一堆堆货物和来往的人群中，他终于看见了熟悉的马车。",
          "scene": "market"
        },
        {
          "speaker": "赫萝",
          "text": "赫萝坐在驾座上，穿着新衣服，正用新买的梳子整理尾巴。她没有回头，只用不太高兴的口气说：\n「咱可不想被人讨债讨到北方来。」\n罗伦斯忍不住笑了。她装了那么多苹果，却没有另外买马车，原来就没打算独自上路。他走到驾座旁，向仍在假装专心梳毛的她伸出手。这一回，不必再急着找一个留住她的理由。",
          "scene": "dawn"
        },
        {
          "speaker": "罗伦斯与赫萝",
          "text": "赫萝瞥了一眼他的手，又低头看了看尾巴。过了一会儿，她终于把手伸了过来，像认输一样笑了。\n「咱会先还清欠债再回北方。」\n「这还用说吗！」\n她紧紧握住罗伦斯的手。北方还远，衣服和苹果的账也还没算完；驾座上的位置，却已经重新留好了。等伤势养好、下一批货备齐，两个人的马车便能再次上路。",
          "scene": "dawn"
        }
      ],
      "reward": {
        "unlockMechanics": [
          "loan"
        ],
        "unlockCities": [
          "poroson"
        ],
        "flags": [
          "milone_partner",
          "holo_rescued",
          "promise_kept",
          "first_chapter_complete"
        ]
      },
      "sourceIds": [
        "local-novel-1"
      ]
    },
    {
      "id": "northbound",
      "title": "胡椒与下一段商路",
      "canonPosition": "第二章序曲 · 波罗森交易",
      "summary": "银币事件留下的胡椒买卖，把两人的马车带到波罗森。新的市集与收购公告都在前方。",
      "objective": "从帕兹欧购入胡椒，抵达波罗森并在当地售出至少 {{saleQuantity}} 包。",
      "conditions": {
        "city": "poroson",
        "soldAt": {
          "city": "poroson",
          "good": "pepper"
        }
      },
      "scene": [
        {
          "speaker": "旁白",
          "text": "胡椒在波罗森顺利卖出，罗伦斯把货款收入账中。它从南方远道而来，米隆开出的进口证明说明了来处；真正交货时，分量和货色也得亲眼确认。\n这趟买卖让马车又向北走了一段。前面还有吕宾海根，更远的城镇，以及尚未打听清楚的道路。收购公告和旅人口中的消息，也都能成为下一程的线索。做完这一笔，还得想下一笔。",
          "scene": "market"
        },
        {
          "speaker": "旁白",
          "text": "说起往北的路，罗伦斯又想起赫萝对吃食的执着。先前在路上，他提到有些地方会用蜂蜜腌渍苹果，还会做梨子和桃子的腌渍物。\n她听得耳朵直动，尾巴在长袍下面急急地甩，靠到他的肩旁，一再追问：万一真有卖，怎么办？\n「……知道了啦，我会买给你吃啦。」\n这句话刚出口，赫萝便用力握住了他的手臂。",
          "scene": "dawn",
          "image": "assets/runtime/novel/v2-merchant-banter-enhanced.webp",
          "imageCaption": "北行路上的蜜渍水果之约（回忆）"
        },
        {
          "speaker": "罗伦斯与赫萝",
          "text": "「不得食言呐。」\n「只买一些喔，一些而已喔。」\n罗伦斯不确定她有没有把后半句听进去。如今，银币与货物重新装好，赫萝又在身旁催着出发；看来除了下一笔生意，还得替答应过的甜食留些钱。\n帕兹欧的风波暂且落在身后。马车往北，市集和岔路仍在前方；至于下一站会发生什么，得两个人一起走到了才知道。",
          "scene": "dawn"
        }
      ],
      "reward": {
        "unlockCities": [
          "ruvenheigen"
        ],
        "unlockMechanics": [
          "free_trade"
        ],
        "flags": [
          "chapter_complete"
        ]
      },
      "sourceIds": [
        "anime-7",
        "world-2",
        "local-novel-2"
      ]
    }
  ],
  "sources": [
    {
      "id": "novel-trial-1",
      "title": "作者官方网站 · 第一卷试读（序幕、第一幕）",
      "url": "https://hasekuraisuna.jp/trial/spicywolf/"
    },
    {
      "id": "novel-trial-2",
      "title": "作者官方网站 · 第一卷试读（第二幕）",
      "url": "https://hasekuraisuna.jp/trial/spicywolf/page02.php"
    },
    {
      "id": "novel-trial-4",
      "title": "作者官方网站 · 第一卷试读（商谈、兑换商与银币调查）",
      "url": "https://hasekuraisuna.jp/trial/spicywolf/page04.php"
    },
    {
      "id": "novel-trial-5",
      "title": "作者官方网站 · 第一卷试读（商会合作）",
      "url": "https://hasekuraisuna.jp/trial/spicywolf/page05.php"
    },
    {
      "id": "novel-trial-6",
      "title": "作者官方网站 · 第一卷试读（遭袭与救援交涉）",
      "url": "https://hasekuraisuna.jp/trial/spicywolf/page06.php"
    },
    {
      "id": "anime-1",
      "title": "2024 动画官方 · 第1幕简介",
      "url": "https://spice-and-wolf.com/story/episode1.html"
    },
    {
      "id": "anime-2",
      "title": "2024 动画官方 · 第2幕简介",
      "url": "https://spice-and-wolf.com/story/episode2.html"
    },
    {
      "id": "anime-3",
      "title": "2024 动画官方 · 第3幕简介",
      "url": "https://spice-and-wolf.com/story/episode3.html"
    },
    {
      "id": "anime-4",
      "title": "2024 动画官方 · 第4幕简介",
      "url": "https://spice-and-wolf.com/story/episode4.html"
    },
    {
      "id": "anime-5",
      "title": "2024 动画官方 · 第5幕简介",
      "url": "https://spice-and-wolf.com/story/episode5.html"
    },
    {
      "id": "anime-6",
      "title": "2024 动画官方 · 第6幕简介",
      "url": "https://spice-and-wolf.com/story/episode6.html"
    },
    {
      "id": "anime-7",
      "title": "2024 动画官方 · 第7幕简介",
      "url": "https://spice-and-wolf.com/story/episode7.html"
    },
    {
      "id": "world-1",
      "title": "原作官方 · 第一卷舞台",
      "url": "https://spicy-wolf.com/original/worldI.html"
    },
    {
      "id": "world-2",
      "title": "原作官方 · 第二卷舞台",
      "url": "https://spicy-wolf.com/original/worldII.html"
    },
    {
      "id": "world-setting",
      "title": "原作官方 · 世界设定与银币",
      "url": "https://spicy-wolf.com/1st/original/world.html"
    },
    {
      "id": "world-map-css",
      "title": "原作官方世界地图热点与原始尺寸",
      "url": "https://spicy-wolf.com/1st/assets/css/original.css"
    },
    {
      "id": "novel-trial-goods",
      "title": "官方小说试读 · 盐、毛皮与山羊奶酪",
      "url": "https://hasekuraisuna.jp/trial/spicywolf/page02.php",
      "note": "约伦兹采购盐、山村换毛皮，以及山羊奶酪食用；具体市场清单和保质期为游戏设计。"
    },
    {
      "id": "novel-trial-apples",
      "title": "官方小说试读 · 帕兹欧的果物露店",
      "url": "https://hasekuraisuna.jp/trial/spicywolf/page03.php",
      "note": "帕兹欧是南方果物中转点，苹果原产地未确认。斯劳德主河靠渡船通行；第一卷第三幕另有城内人工运河、桥与水门，不可混为一谈。"
    },
    {
      "id": "silver-quarter-design",
      "title": "四分之一银币的显示与结算规则",
      "note": "特雷尼银币是本版唯一货币，按玩家要求采用¼、½、¾。此精度属于游戏规则，不声称是原作统一币制。"
    },
    {
      "id": "calendar-harvest",
      "title": "作者官方试读 · 秋季收获祭与冬将近",
      "url": "https://hasekuraisuna.jp/trial/spicywolf/",
      "note": "支持季节氛围，不提供本游戏拟制的具体年月日。"
    },
    {
      "id": "calendar-winter-fair",
      "title": "原作官方 · 第三卷库梅尔森冬季大市",
      "url": "https://spicy-wolf.com/original/worldIII.html",
      "note": "支持冬季大市与祭典，不提供12月1日这一游戏日期。"
    },
    {
      "id": "local-novel-1",
      "title": "用户提供本地小说 · 第01卷",
      "note": "核对序幕及第一至六幕、尾声中的相关段落；简短改写与卷幕行号见docs/novel-content.md。原始TXT仅作创作参考，不整套发布。"
    },
    {
      "id": "local-novel-2",
      "title": "用户提供本地小说 · 第02卷",
      "note": "重点核对第一至三幕中的商道、盐货、胡椒产地与教会城市描写；具体定位见docs/novel-content.md。未把游戏数值当作原作设定。"
    }
  ],
  "calendar": {
    "name": "行商历",
    "description": "以秋季收割祭时节的旅程为起点；年月日为游戏拟制，十二个月各三十天。",
    "events": [
      {
        "id": "harvest-aftermath",
        "title": "收割祭时节",
        "month": 10,
        "day": 1,
        "kind": "seasonal",
        "description": "麦田已经收割，村庄的宴席与秋粮买卖仍在继续。",
        "canonical": false,
        "sourceNote": "原作开篇可核实秋季收获祭；10月1日为游戏拟定日期。",
        "sourceUrl": "https://hasekuraisuna.jp/trial/spicywolf/"
      },
      {
        "id": "autumn-granary",
        "title": "秋粮入仓",
        "month": 10,
        "day": 15,
        "kind": "seasonal",
        "description": "磨坊和农舍忙着备粮，启程前记得查看全图收购公告的截止日期。",
        "canonical": false,
        "sourceNote": "原创季节路标，不对应原作明确节日或日期。"
      },
      {
        "id": "winter-preparation",
        "title": "备冬时节",
        "month": 11,
        "day": 1,
        "kind": "seasonal",
        "description": "寒季渐近，车夫们开始盘算冬粮与下一程的落脚处。",
        "canonical": false,
        "sourceNote": "原作开篇已有冬将近的描写；11月1日和此路标为游戏拟制。",
        "sourceUrl": "https://hasekuraisuna.jp/trial/spicywolf/"
      },
      {
        "id": "northern-winter-fair",
        "title": "北方冬市",
        "month": 12,
        "day": 1,
        "kind": "seasonal",
        "description": "北方传来冬季大市的消息，库梅尔森的热闹还在更远的旅途上。",
        "canonical": false,
        "sourceNote": "官方第三卷舞台明确库梅尔森冬季大市与祭典；12月1日为拟定日期，当前并不开放该城。",
        "sourceUrl": "https://spicy-wolf.com/original/worldIII.html"
      }
    ]
  },
  "purchaseNotices": [
    {
      "id": "pasloe-apples",
      "title": "村中餐桌的鲜果",
      "issuer": "叶勒",
      "issuerRole": "帕斯罗村的青年",
      "canonical": true,
      "description": "收割祭的宴席离不开好吃的果物，平日各家的餐桌也惦记鲜甜。叶勒替村人张贴{{quantity}}{{unit}}{{goodName}}的公告；本村集市不卖这种货物，愿按公告价收下赶在截止日前送到的鲜货。"
    },
    {
      "id": "pasloe-wine",
      "title": "磨坊家的葡萄酒",
      "issuer": "玛塔",
      "issuerRole": "村中乳品作坊主人",
      "canonical": false,
      "description": "磨坊与农舍轮流备下聚餐，玛塔替几户人家张贴{{quantity}}{{unit}}{{goodName}}的公告。本村集市不经营这种货物；在截止日前带齐交付，便按公告结钱。"
    },
    {
      "id": "yorentz-wheat",
      "title": "驿站的面包粮",
      "issuer": "欧特",
      "issuerRole": "驿站经营者",
      "canonical": false,
      "description": "盐货和皮货占满了约伦兹的货场，来往车夫却总要吃面包。驿站另向行商收{{quantity}}{{unit}}{{goodName}}，不必预先许诺，只要在本期截止日前送齐。"
    },
    {
      "id": "yorentz-apples",
      "title": "车夫们订下的甜果",
      "issuer": "克劳斯",
      "issuerRole": "车队经纪",
      "canonical": false,
      "description": "一拨车队走了，下一拨又来。克劳斯常替车夫们收{{quantity}}{{unit}}{{goodName}}。约伦兹集市不卖这种货物，他愿多付赶路的钱，只收截止日前到货、仍未腐坏的果篮。"
    },
    {
      "id": "pazzio-wheat",
      "title": "河岸磨坊的粮仓",
      "issuer": "马尔海特",
      "issuerRole": "米隆商会分店负责人",
      "canonical": true,
      "description": "河船把谷物送进帕兹欧，磨坊的粮仓仍要定期补货。米隆商会为磨坊张贴{{quantity}}{{unit}}{{goodName}}的独立公告；这笔整批交易与公开档口分开验收，截止日前到货便结款。"
    },
    {
      "id": "pazzio-cheese",
      "title": "酒馆的新鲜奶酪",
      "issuer": "莉娜",
      "issuerRole": "河岸酒馆女主人",
      "canonical": false,
      "description": "河岸酒馆每天都有新客人。莉娜要{{quantity}}{{unit}}{{goodName}}配热菜，愿为不绕路的新鲜货多付一些。本地公开档口不卖这种货物，带货到店、尚未腐坏且赶上截止日即可交付。"
    },
    {
      "id": "poroson-apples",
      "title": "礼拜后的鲜果席",
      "issuer": "安塞尔",
      "issuerRole": "教会旅舍管事",
      "canonical": false,
      "description": "晨钟响过，旅舍便要为礼拜后歇脚的客人备餐。安塞尔收{{quantity}}{{unit}}{{goodName}}，波罗森公开集市不卖这种货物；供货地点任你选择，只验本期日期与完整数量。"
    },
    {
      "id": "poroson-honey",
      "title": "作坊的蜂蜜储备",
      "issuer": "格雷塔",
      "issuerRole": "烘焙作坊主",
      "canonical": false,
      "description": "朴素的波罗森也有人爱吃蜜制点心。格雷塔常替教会旅舍烘焙，另向行商收{{quantity}}{{unit}}{{goodName}}。可合并其他买卖，但仍须在公告截止日前送齐。"
    },
    {
      "id": "ruvenheigen-pepper",
      "title": "教会厨房的香辛料",
      "issuer": "约斯特",
      "issuerRole": "教会采买人",
      "canonical": false,
      "description": "大城的厨房不断迎来宾客，约斯特为教会采买{{quantity}}{{unit}}{{goodName}}。本地集市不经营这种香辛料，他愿按公告价收货；较近的波罗森与较远的帕兹欧，哪条路划算由你计算。"
    },
    {
      "id": "ruvenheigen-salt",
      "title": "朝圣旅舍的盐仓",
      "issuer": "贝恩",
      "issuerRole": "朝圣旅舍管事",
      "canonical": false,
      "description": "几处朝圣旅舍合收{{quantity}}{{unit}}{{goodName}}，用于接待与厨房储备。吕宾海根公开档口不做这种货物的买卖，贝恩便定期张贴公告；在本期截止日前带齐交货，按公告结清。"
    }
  ],
  "novelArt": [
    {
      "key": "clothes",
      "file": "v1-holo-travel-clothes-enhanced.webp",
      "title": "同行次日的旅装",
      "note": "赫萝换上罗伦斯的衣服，两人开始同行。"
    },
    {
      "key": "apples",
      "file": "v1-apples-on-wagon-enhanced.webp",
      "title": "马车上的苹果",
      "note": "帕兹欧采购后，赫萝在马车上享用苹果。"
    },
    {
      "key": "changer",
      "file": "v1-money-changer-enhanced.webp",
      "title": "怀兹的钱币摊",
      "note": "银币线索中的兑换商场景。"
    },
    {
      "key": "milone",
      "file": "v1-milone-negotiation-enhanced.webp",
      "title": "米隆商会交涉",
      "note": "围绕银币成色与商会合作的交涉。"
    },
    {
      "key": "reunion",
      "file": "v1-companions-enhanced.webp",
      "title": "营救后的重逢",
      "note": "米隆营救后，两人在马车上重逢。"
    },
    {
      "key": "zheren",
      "file": "v1-zheren-proposal-enhanced.webp",
      "title": "避雨时结识杰廉",
      "note": "教会避雨时，杰廉向罗伦斯搭话。"
    },
    {
      "key": "shelter",
      "file": "v1-shelter-companions-enhanced.webp",
      "title": "旅伴与商人的闲谈",
      "note": "赫萝在外套下听着罗伦斯与商人的交谈。"
    },
    {
      "key": "loneliness",
      "file": "v1-loneliness-enhanced.webp",
      "title": "旅馆里的孤独与安慰",
      "note": "赫萝诉说梦境与孤独，罗伦斯在旅馆里安慰她。"
    },
    {
      "key": "window",
      "file": "v1-window-warning-enhanced.webp",
      "title": "木窗前的逃离",
      "note": "赫萝先从木窗逃出，罗伦斯随后跟上。"
    },
    {
      "key": "flight",
      "file": "v1-underground-flight-enhanced.webp",
      "title": "地下道遇袭",
      "note": "罗伦斯在地下道受到袭击，手臂负伤。"
    },
    {
      "key": "wolf",
      "file": "v1-wolf-revealed-enhanced.webp",
      "title": "贤狼显露真身",
      "note": "赫萝恢复巨狼形态，逼退地下道的追兵。"
    },
    {
      "key": "banter",
      "file": "v2-merchant-banter-enhanced.webp",
      "title": "蜜渍水果的约定",
      "note": "北行途中，赫萝听罗伦斯谈起蜂蜜腌水果。"
    }
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = globalThis.SW_CONTENT;
