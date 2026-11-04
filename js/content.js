/* 原作叙事与出处；经营数值维护于 design/数值策划.xlsx。 */
globalThis.SW_CONTENT = {
  "version": 8,
  "title": "狼与香辛料 · 行商旅记",
  "chapterTitle": "银币风波 · 下一段商路",
  "subtitle": "麦田、河港，与两个人的北行商路",
  "mapNote": "依官方375×533世界地图重绘；城镇锚点保持官方图位置，虚线商路、行程与旅费为游戏设计。",
  "adaptationNote": "主线用第一卷的相遇、毛皮交易、银币风波及第二卷开端的胡椒交易提示原作位置。对白、公开市场清单、循环收购公告、拟制行商历、货舱规格、保质日数、四分之一银币结算、世界事件及酒馆消息为游戏改编。",
  "initial": {
    "city": "pasloe",
    "unlockedCities": [
      "pasloe",
      "yorentz"
    ],
    "unlockedMechanics": [
      "trade",
      "purchase"
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
        "origin": "帕斯罗是明确的产麦村落；吕宾海根为本版补充的零售地。",
        "canonContext": "罗伦斯曾因本钱不足而经营利润薄、关税高的帕斯罗小麦。开篇另有耐寒耐虫的山村麦种，谷物的品种与去向并不相同。",
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
        "merchantNote": "不计短期腐坏，适合留作跨城卖货。在帕兹欧卖出随车毛皮，也是同行后的第一个主线路标。",
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
        "origin": "约伦兹有采购记录；波罗森是盐货经过的中继站，未明示盐的产地。",
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
        "origin": "帕兹欧露店可购；这批苹果的具体产地未在相关段落交代。",
        "canonContext": "帕兹欧是通向南方的果物中继站。赫萝第一次在城里买苹果，便把罗伦斯给的一整枚银币花成了满怀的鲜果。",
        "merchantNote": "本版买入5天后腐坏。去约伦兹单程便要4天；高价公告值得一跑，也需要留出交货余量。",
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
        "origin": "原作有佩连佐葡萄园；本版三处售酒城镇为贸易集散，不是已证实的产区。",
        "canonContext": "避雨的教会里，罗伦斯遇过与酒商议价的葡萄园主人。到了帕兹欧，他与赫萝又在一杯杯酒之间试探着彼此的打算。",
        "merchantNote": "酒桶每栈只放3桶，还要占两格和承重。本版不计短期腐坏，可把买家公告与普通买卖排进同一程。",
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
        "origin": "相关段落未交代蜂蜜产地；现有三城供货为经营补全。",
        "canonContext": "罗伦斯曾用蜂蜜糖与年轻骑士打开话头。帕兹欧的蜂蜜面包也让人垂涎，甜食在旅途中既是享受，也能拉近人与人的距离。",
        "merchantNote": "本版不计短期腐坏，每栈数量有限。波罗森的收购窗口较长，适合连同其他生意一起规划。",
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
        "origin": "原作旅食里有山羊奶酪；相关段落未交代其生产村镇。",
        "canonContext": "教会借宿那晚，罗伦斯在煮好的马铃薯上添了山羊奶酪。平日独行会省下的花费，有了旅伴便显得值得。",
        "merchantNote": "本版买入4天后腐坏。帕斯罗到帕兹欧就要3天，装车前先确认公告截止日，途中尽量少停留。",
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
      "text": "收割祭的夜里，罗伦斯离开帕斯罗。麦束旁多了一位长着狼耳与尾巴的旅伴，她自称是守望麦田的贤狼。",
      "scene": "wheat"
    },
    {
      "speaker": "赫萝",
      "text": "咱叫赫萝。麦田已经不大需要咱了……汝的马车若向北走，便捎咱去约伊兹吧。",
      "scene": "night"
    },
    {
      "speaker": "罗伦斯",
      "text": "先把毛皮带到帕兹欧，挣够下一程的盘缠。带上这些麦粒吧——赶路、做生意，我们一起走。",
      "scene": "dawn",
      "image": "assets/novel/v1-holo-travel-clothes.jpg",
      "imageCaption": "第一卷 · 同行次日的旅装（旅途插页）"
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
      "eligibleGoods": ["wheat", "apple", "honey"],
      "description": "附近产区收成充裕，这座城镇的一种货物供货增加，市价暂时下降。"
    },
    {
      "id": "festival",
      "name": "城市节庆",
      "scope": "city",
      "eligibleGoods": ["wine", "apple", "cheese"],
      "description": "广场挂起彩带，长桌旁陆续摆上酒桶与食篮。宴席让葡萄酒、苹果和奶酪的需求增加，当地经营这些货物的商人提高了收购行情。"
    }
  ],
  "eventArt": {
    "rain": "assets/events/rain.png",
    "harvest": "assets/events/harvest.png",
    "festival": "assets/events/festival.png",
    "tavern": "assets/events/tavern.png",
    "traveler": "assets/events/traveler.png"
  },
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
          "travel",
          "purchase"
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
      "id": "fur-deal",
      "title": "帕兹欧的第一笔生意",
      "canonPosition": "第一卷 · 毛皮交易与银币传闻",
      "summary": "在米隆商会的货场谈妥毛皮。银币成色的风波正在城里酝酿，眼前的收购公告则给了两人一条踏实的商路。",
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
          "speaker": "赫萝",
          "text": "验货人只盯着皮毛，咱便请他闻闻果香。货款谈妥了，那桩银币会升值的消息，却还得再听一听。",
          "scene": "market",
          "image": "assets/novel/v1-apples-on-wagon.jpg",
          "imageCaption": "第一卷 · 采购苹果后的御者台（旅途插页）"
        },
        {
          "speaker": "罗伦斯",
          "text": "先把这笔货款记好，再看各城的收购截止日。要挣下一程的本钱，得让货物和日期都对得上。",
          "scene": "guild",
          "image": "assets/novel/v1-apples-on-wagon.jpg",
          "imageCaption": "第一卷 · 采购苹果后的御者台（旅途插页）"
        }
      ],
      "reward": {
        "flags": [
          "fur_deal_done"
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
      "id": "silver-resolution",
      "title": "银币风波后的约定",
      "canonPosition": "第一卷 · 银币调查、商会交涉与脱险",
      "summary": "米隆商会接手银币风波的大宗交涉。完成一份收购公告后，两人重新在帕兹欧汇整账目，商会也愿意为下一段商路提供信用。",
      "objective": "按期交付 {{purchaseCompleted}} 则收购公告，再回帕兹欧整理账目与下一程的计划。",
      "conditions": {
        "city": "pazzio"
      },
      "scene": [
        {
          "speaker": "旁白",
          "text": "新币含银量下降的线索，牵出了梅迪欧的布局。米隆商会接下旧币收购与王室交涉；地下水道里的追逼，则让罗伦斯重新认清了自己不能出卖的约定。",
          "scene": "guild",
          "image": "assets/novel/v1-milone-negotiation.jpg",
          "imageCaption": "第一卷 · 米隆商会交涉"
        },
        {
          "speaker": "赫萝",
          "text": "这一程总算脱险了。米隆的胡椒轻巧，带去波罗森正合适——往后的路，汝可还记得给咱留个位置？",
          "scene": "dawn"
        }
      ],
      "reward": {
        "unlockCities": [
          "poroson"
        ],
        "unlockMechanics": [
          "loan"
        ],
        "flags": [
          "debasement_found",
          "milone_partner",
          "holo_rescued",
          "promise_kept"
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
      "id": "northbound",
      "title": "胡椒与下一段商路",
      "canonPosition": "第二卷开端 · 波罗森交易",
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
          "speaker": "罗伦斯",
          "text": "胡椒的进口证明交过了，分量也要亲眼看清。货款记好，再看看全图的收购公告，盘算去吕宾海根的下一程。",
          "scene": "market"
        },
        {
          "speaker": "赫萝",
          "text": "汝总算记得先看路再算账了。走吧，御者台上还有咱的位置。",
          "scene": "dawn",
          "image": "assets/novel/v2-merchant-banter.jpg",
          "imageCaption": "回望北行途中 · 蜜渍水果的约定"
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
      "file": "v1-holo-travel-clothes.jpg",
      "title": "同行次日的旅装",
      "note": "第一卷 · 第一幕。赫萝换上罗伦斯的衣服，两人开始同行。"
    },
    {
      "key": "apples",
      "file": "v1-apples-on-wagon.jpg",
      "title": "马车上的苹果",
      "note": "第一卷 · 第三幕。帕兹欧采购后，赫萝在马车上享用苹果。"
    },
    {
      "key": "changer",
      "file": "v1-money-changer.jpg",
      "title": "怀兹的钱币摊",
      "note": "第一卷 · 第三幕。银币线索中的兑换商场景。"
    },
    {
      "key": "milone",
      "file": "v1-milone-negotiation.jpg",
      "title": "米隆商会交涉",
      "note": "第一卷 · 第四幕。围绕银币成色与商会合作的交涉。"
    },
    {
      "key": "reunion",
      "file": "v1-companions.jpg",
      "title": "营救后的重逢",
      "note": "第一卷彩页 · 对应第五幕。米隆营救后，两人在马车上重逢。"
    },
    {
      "key": "banter",
      "file": "v2-merchant-banter.jpg",
      "title": "蜜渍水果的约定",
      "note": "第二卷 · 第一幕。北行途中，赫萝听罗伦斯谈起蜂蜜腌水果。"
    }
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = globalThis.SW_CONTENT;
