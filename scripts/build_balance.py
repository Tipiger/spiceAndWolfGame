#!/usr/bin/env python3
"""Compile the sole planning workbook to an offline browser script (stdlib only)."""
from __future__ import annotations

import argparse
import hashlib
import json
from math import ceil, isfinite
from pathlib import Path
import posixpath
import re
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parents[1]
WORKBOOK = ROOT / 'design' / '数值策划.xlsx'
OUTPUT = ROOT / 'js' / 'balance.generated.js'
NS = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
HEADERS = {
    '全局参数': ['参数键', '参数名称', '数值', '单位', '说明'],
    '商品': ['货物ID', '货物名称', '基准单价', '单件重量', '占格宽', '占格高', '单栈上限', '保鲜天数'],
    '城镇市场': ['城镇ID', '城镇名称', '货物ID', '货物名称', '基准售价', '初始库存'],
    '商路': ['起点ID', '起点名称', '终点ID', '终点名称', '行程天数', '旅费'],
    '收购公告': ['公告ID', '公告名称', '收购地ID', '货物ID', '货物名称', '需求数量', '收购单价', '首次发布天', '有效天数差', '刷新间隔天'],
    '主线路标': ['路标ID', '路标名称', '售货目标数量', '公告完成数量', '奖励银币'],
    '开局货物': ['货物ID', '货物名称', '数量', '单价成本'],
    '随机事件': ['事件ID', '事件名称', '最短持续天', '最长持续天', '行程耗时倍率', '库存倍率', '行情倍率', '每日消耗数量'],
}
# Limits protect the engine's supported domain; accepted balancing values live only in XLSX.
PARAMS = {
    'rules.market.pricePeriodDays': ('int', 1, 365),
    'rules.market.priceSteps': ('int', 1, 99),
    'rules.market.priceAmplitude': ('number', 0, .5),
    'rules.market.sellRate': ('number', .01, 1),
    'rules.market.restockDivisor': ('number', 1, 100000),
    'rules.market.minimumRestock': ('int', 0, 100000),
    'rules.events.dailyChance': ('number', 0, 1),
    'rules.events.rainForecastDays': ('int', 1, 30),
    'rules.events.harvestForecastExtraDays': ('int', 0, 30),
    'rules.events.festivalForecastExtraDays': ('int', 0, 30),
    'rules.events.travelerChance': ('number', 0, 1),
    'rules.events.tavernCost': ('coin', .25, 1000000),
    'rules.loan.limit': ('coin', .25, 1000000),
    'rules.loan.dailyRate': ('number', 0, 1),
    'rules.loan.termDays': ('int', 1, 365),
    'rules.rest.dailyCost': ('coin', 0, 1000000),
    'rules.rest.maxDays': ('int', 1, 365),
    'rules.rest.relationshipGain': ('number', 0, 100),
    'rules.rescue.cashThreshold': ('coin', .25, 1000000),
    'rules.rescue.reward': ('coin', .25, 1000000),
    'rules.rescue.days': ('int', 1, 365),
    'rules.relationship.max': ('int', 1, 100),
    'rules.relationship.travelGain': ('number', 0, 100),
    'rules.relationship.storyGain': ('number', 0, 100),
    'rules.relationship.appleGain': ('number', 0, 100),
    'rules.relationship.trustThreshold': ('number', 0, 100),
    'rules.relationship.intimacyThreshold': ('number', 0, 100),
    'initial.money': ('coin', 0, 1000000),
    'initial.day': ('int', 1, 100000),
    'initial.relationship': ('number', 0, 100),
    'initial.wagon.cols': ('int', 1, 30),
    'initial.wagon.rows': ('int', 1, 30),
    'initial.wagon.maxWeight': ('number', 1, 1000),
    'calendar.daysPerMonth': ('int', 1, 366),
    'calendar.monthsPerYear': ('int', 12, 12),
    'calendar.epoch.year': ('int', 1, 10000),
    'calendar.epoch.month': ('int', 1, 12),
    'calendar.epoch.day': ('int', 1, 366),
}


def require(ok, message):
    if not ok:
        raise ValueError(message)


def read_workbook(path):
    """Read native numeric/shared/inline cells; never trust formula caches."""
    tables = {}
    with zipfile.ZipFile(path) as book:
        strings = []
        if 'xl/sharedStrings.xml' in book.namelist():
            strings = [''.join(node.itertext()) for node in ET.fromstring(book.read('xl/sharedStrings.xml')).findall('s:si', NS)]
        rels = {node.attrib['Id']: node.attrib['Target'] for node in ET.fromstring(book.read('xl/_rels/workbook.xml.rels'))}
        for sheet in ET.fromstring(book.read('xl/workbook.xml')).findall('s:sheets/s:sheet', NS):
            name = sheet.attrib['name']
            if name not in HEADERS:
                continue
            target = rels[sheet.attrib[f'{{{REL}}}id']]
            target = target.lstrip('/') if target.startswith('/') else posixpath.normpath('xl/' + target)
            rows = []
            for row in ET.fromstring(book.read(target)).findall('s:sheetData/s:row', NS):
                cells = {}
                for cell in row.findall('s:c', NS):
                    ref = cell.attrib['r']
                    letters = re.match(r'[A-Z]+', ref).group()
                    index = 0
                    for letter in letters:
                        index = index * 26 + ord(letter) - 64
                    require(cell.find('s:f', NS) is None, f'{name}!{ref}：输入表不接受公式，请填数值。')
                    value = cell.find('s:v', NS)
                    kind = cell.attrib.get('t')
                    if kind == 'inlineStr':
                        parsed = ''.join(cell.find('s:is', NS).itertext())
                    elif value is None or value.text is None:
                        parsed = None
                    elif kind == 's':
                        parsed = strings[int(value.text)]
                    elif kind in ('str', 'e', 'b'):
                        parsed = value.text
                    else:
                        parsed = float(value.text)
                        if isfinite(parsed) and parsed.is_integer():
                            parsed = int(parsed)
                    cells[index - 1] = parsed
                if any(value is not None and value != '' for value in cells.values()):
                    rows.append([cells.get(i) for i in range(max(cells, default=-1) + 1)])
            require(rows and rows[0] == HEADERS[name], f'{name}：首行表头与约定不一致。')
            records = []
            for index, row in enumerate(rows[1:], 2):
                require(len(row) <= len(HEADERS[name]), f'{name}第{index}行：存在未定义的列。')
                records.append(dict(zip(HEADERS[name], row + [None] * (len(HEADERS[name]) - len(row)))))
            tables[name] = records
    require(set(tables) == set(HEADERS), '缺少工作表：' + '、'.join(set(HEADERS) - set(tables)))
    return tables


def number(value, label, kind='number', low=0, high=1000000):
    require(type(value) in (int, float) and isfinite(value), f'{label}：必须填写数值，不能为空或使用文本。')
    require(low <= value <= high, f'{label}：数值须在{low}至{high}之间。')
    if kind == 'int':
        require(value == int(value), f'{label}：必须为整数。')
    if kind == 'coin':
        require(abs(value * 4 - round(value * 4)) < 1e-8, f'{label}：银币必须是0.25的整数倍。')
    return value


def content_data():
    # content.js deliberately contains one JSON literal plus its browser/Node export.
    source = (ROOT / 'js' / 'content.js').read_text(encoding='utf-8')
    return json.JSONDecoder().raw_decode(source.split('globalThis.SW_CONTENT = ', 1)[1])[0]


def compile_tables(tables, content):
    result = {'rules': {}, 'initial': {}, 'calendar': {}, 'goods': [], 'markets': {}, 'routes': [], 'purchaseNotices': [], 'story': [], 'worldEvents': []}
    seen = set()
    for row in tables['全局参数']:
        key = row['参数键']
        require(key in PARAMS and key not in seen, f'全局参数：未知或重复参数 {key}。')
        seen.add(key)
        value = number(row['数值'], '全局参数 ' + key, *PARAMS[key])
        node = result
        parts = key.split('.')
        for part in parts[:-1]:
            node = node.setdefault(part, {})
        node[parts[-1]] = value
    require(seen == set(PARAMS), '全局参数缺失：' + '、'.join(set(PARAMS) - seen))
    rule = result['rules']
    require(rule['market']['priceSteps'] % 2 == 1, '行情档数必须为奇数。')
    require(rule['market']['priceAmplitude'] * (rule['market']['priceSteps'] // 2) < 1, '行情振幅会产生非正数价格。')
    require(rule['rescue']['reward'] >= rule['rescue']['cashThreshold'], '帮工报酬须不低于帮工资格余额门槛。')
    relation = rule['relationship']
    require(result['initial']['relationship'] <= relation['max'] and relation['trustThreshold'] <= relation['intimacyThreshold'] <= relation['max'], '关系初值或阶段阈值超过关系上限。')
    require(result['calendar']['epoch']['day'] <= result['calendar']['daysPerMonth'], '历元日期超出月长。')
    for event in content['calendar']['events']:
        require(event['day'] <= result['calendar']['daysPerMonth'], '月长不能短于已有节令日期。')

    goods = {g['id']: g for g in content['goods']}
    cities = {c['id']: c for c in content['cities']}
    notices = {n['id']: n for n in content['purchaseNotices']}
    stories = {s['id']: s for s in content['story'] if not s.get('narrativeOnly')}
    events = {event['id']: event for event in content['worldEvents']}

    def reference(rows, field, definitions, name_field=None, name_header=None, exact=True):
        ids = []
        for row in rows:
            identity = row[field]
            require(identity in definitions, f'{field}：未定义ID {identity}。')
            require(identity not in ids, f'{field}：重复ID {identity}。')
            if name_field:
                require(row[name_header] == definitions[identity][name_field], f'{identity}：名称须与内容定义一致。')
            ids.append(identity)
        if exact:
            require(set(ids) == set(definitions), f'{field}：缺少行 {set(definitions) - set(ids)}。')

    reference(tables['商品'], '货物ID', goods, 'name', '货物名称')
    columns = {'basePrice': ('基准单价', 'coin', .25, 100000), 'weight': ('单件重量', 'number', .001, 1000), 'cargoW': ('占格宽', 'int', 1, 30), 'cargoH': ('占格高', 'int', 1, 30), 'stackLimit': ('单栈上限', 'int', 1, 10000), 'shelfLifeDays': ('保鲜天数', 'int', 0, 365)}
    for row in tables['商品']:
        item = {'id': row['货物ID']}
        for key, (header, kind, low, high) in columns.items():
            item[key] = number(row[header], row['货物ID'] + ' ' + header, kind, low, high)
        item['shelfLifeDays'] = item['shelfLifeDays'] or None
        result['goods'].append(item)
    specs = {g['id']: g for g in result['goods']}
    pairs = set()
    for row in tables['城镇市场']:
        c, g = row['城镇ID'], row['货物ID']
        require(c in cities and g in goods, f'城镇市场：未定义引用 {c}/{g}。')
        require((c, g) not in pairs, f'城镇市场：重复 {c}/{g}。')
        pairs.add((c, g))
        require(row['城镇名称'] == cities[c]['name'] and row['货物名称'] == goods[g]['name'], f'城镇市场 {c}/{g}：参考名称不匹配。')
        result['markets'].setdefault(c, {})[g] = {'price': number(row['基准售价'], f'{c}/{g} 基准售价', 'coin', .25, 100000), 'stock': number(row['初始库存'], f'{c}/{g} 库存', 'int', 0, 100000)}
    require(set(result['markets']) == set(cities), '每座城镇都须有市场配置。')
    routes = set()
    for row in tables['商路']:
        a, b = row['起点ID'], row['终点ID']
        require(a in cities and b in cities and a != b, '商路：起终点必须是不同的已定义城镇。')
        key = tuple(sorted([a, b]))
        require(key not in routes, f'商路：重复的双向路径 {a}/{b}。')
        require(row['起点名称'] == cities[a]['name'] and row['终点名称'] == cities[b]['name'], f'商路 {a}/{b}：名称不匹配。')
        routes.add(key)
        result['routes'].append({'from': a, 'to': b, 'days': number(row['行程天数'], f'{a}/{b} 天数', 'int', 1, 100), 'cost': number(row['旅费'], f'{a}/{b} 旅费', 'coin')})
    require(routes, '至少需要一条商路。')
    reference(tables['收购公告'], '公告ID', notices, 'title', '公告名称')
    for row in tables['收购公告']:
        identity, c, g = row['公告ID'], row['收购地ID'], row['货物ID']
        require(c in cities and g in goods, f'{identity}：公告地或货物ID未定义。')
        require(row['货物名称'] == goods[g]['name'], f'{identity}：货物名称不匹配。')
        require(g not in result['markets'][c], f'{identity}：公告商品不能在收购地公开市场交易。')
        require(any(g in listings and listings[g]['stock'] > 0 for town, listings in result['markets'].items() if town != c), f'{identity}：没有外地供货市场。')
        item = {'id': identity, 'destination': c, 'good': g}
        for key, header, kind, low, high in [('quantity','需求数量','int',1,10000),('unitPrice','收购单价','coin',.25,100000),('initialPublishDay','首次发布天','int',1,100000),('listingDays','有效天数差','int',1,365),('refreshDays','刷新间隔天','int',1,365)]:
            item[key] = number(row[header], identity + ' ' + header, kind, low, high)
        result['purchaseNotices'].append(item)
    reference(tables['随机事件'], '事件ID', events, 'name', '事件名称')
    for row in tables['随机事件']:
        identity = row['事件ID']
        item = {'id': identity}
        for key, header, kind, low, high in [('minDays', '最短持续天', 'int', 1, 30), ('maxDays', '最长持续天', 'int', 1, 30), ('travelMultiplier', '行程耗时倍率', 'int', 1, 4), ('stockMultiplier', '库存倍率', 'int', 1, 4), ('priceMultiplier', '行情倍率', 'number', .1, 4), ('dailyConsumption', '每日消耗数量', 'int', 0, 100000)]:
            item[key] = number(row[header], identity + ' ' + header, kind, low, high)
        require(item['minDays'] <= item['maxDays'], identity + '：最短持续天不能大于最长持续天。')
        definition = events[identity]
        require(definition['scope'] in ('route', 'market', 'city'), identity + '：事件作用范围无效。')
        if definition['scope'] in ('market', 'city'):
            eligible = definition.get('eligibleGoods', [])
            require(eligible and len(eligible) == len(set(eligible)) and all(g in goods for g in eligible), identity + '：产出商品引用无效。')
            require(any(g in listings for listings in result['markets'].values() for g in eligible), identity + '：没有符合条件的市场。')
        templates = content['newsTemplates'][identity]
        for source in ('tavern', 'traveler', 'public'):
            groups = {'detail': templates[source]} if source == 'public' else templates[source]
            require(isinstance(groups, dict) and (source == 'public' or set(groups) == {'hint', 'detail'}), identity + '：消息层级无效。')
            for detail, choices in groups.items():
                require(isinstance(choices, list) and choices and all(isinstance(text, str) and text.strip() for text in choices), identity + '：缺少有效消息对白。')
                allowed = {'place', 'eventName'} if detail == 'hint' else {'place', 'eventName', 'startDate', 'endDate', 'goods', 'description'}
                require(all(set(re.findall(r'\{(\w+)\}', text)) <= allowed for text in choices), identity + '：消息使用未知参数或初闻泄漏细节。')
        result['worldEvents'].append(item)
    reference(tables['主线路标'], '路标ID', stories, 'title', '路标名称')
    for row in tables['主线路标']:
        identity = row['路标ID']
        sale = number(row['售货目标数量'], identity + ' 售货数量', 'int', 0, 10000)
        completed = number(row['公告完成数量'], identity + ' 公告完成数量', 'int', 0, 10000)
        require(bool(sale) == ('soldAt' in stories[identity]['conditions']), identity + '：售货目标数量须匹配路标类型。')
        require(identity == 'silver-resolution' or completed == 0, identity + '：该路标不接受公告完成目标。')
        require(identity != 'silver-resolution' or completed > 0, identity + '：须至少完成一则公告。')
        result['story'].append({'id': identity, 'saleQuantity': sale, 'purchaseCompleted': completed, 'money': number(row['奖励银币'], identity + ' 奖励银币', 'coin')})
    reference(tables['开局货物'], '货物ID', goods, 'name', '货物名称', exact=False)
    initial = result['initial']
    initial['inventory'], initial['costBasis'] = {}, {}
    weight, cells = 0, 0
    for row in tables['开局货物']:
        identity = row['货物ID']
        quantity = number(row['数量'], identity + ' 开局数量', 'int', 0, 10000)
        unit_cost = number(row['单价成本'], identity + ' 开局成本', 'coin')
        initial['inventory'][identity], initial['costBasis'][identity] = quantity, quantity * unit_cost
        spec = specs[identity]
        weight += quantity * spec['weight']
        cells += ceil(quantity / spec['stackLimit']) * spec['cargoW'] * spec['cargoH']
    require(weight <= initial['wagon']['maxWeight'], '开局货物超过马车承重。')
    require(cells <= initial['wagon']['cols'] * initial['wagon']['rows'], '开局货物占格超过马车空间。')
    canonical = json.dumps(result, ensure_ascii=False, sort_keys=True, separators=(',', ':'))
    version = json.loads((ROOT / 'package.json').read_text(encoding='utf-8'))['version']
    release = version[:-2] if version.endswith('.0') else version
    return {'revision': hashlib.sha256(canonical.encode()).hexdigest()[:16], 'releaseVersion': release, **result}


def runtime_check(balance):
    code = "const fs=require('node:fs');globalThis.SW_BALANCE=JSON.parse(fs.readFileSync(0,'utf8'));const data=require('./js/data.js');const {Game}=require('./js/engine.js');const game=new Game(data,{seed:0});game.validateState(game.state);"
    result = subprocess.run(['node', '-e', code], input=json.dumps(balance), cwd=ROOT, text=True, capture_output=True)
    require(result.returncode == 0, '配置无法创建有效新旅程：\n' + result.stderr.strip())


def render(balance):
    return '/* Generated from design/数值策划.xlsx. Run npm run balance; do not edit. */\n(function (root) {\n  const balance = ' + json.dumps(balance, ensure_ascii=False, indent=2) + ';\n  root.SW_BALANCE = balance;\n  if (typeof module !== "undefined" && module.exports) module.exports = balance;\n})(globalThis);\n'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Reject stale generated data without changing it')
    parser.add_argument('--workbook', type=Path, default=WORKBOOK)
    parser.add_argument('--output', type=Path, default=OUTPUT)
    options = parser.parse_args()
    try:
        balance = compile_tables(read_workbook(options.workbook), content_data())
        runtime_check(balance)
        source = render(balance)
        if options.check:
            require(options.output.exists() and options.output.read_text(encoding='utf-8') == source, '数值表尚未编译，运行 npm run balance。')
        else:
            options.output.parent.mkdir(parents=True, exist_ok=True)
            with tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', dir=options.output.parent, suffix='.tmp', delete=False) as stream:
                temporary = Path(stream.name)
                stream.write(source)
            temporary.replace(options.output)
        print('数值表校验通过 · 配置 ' + balance['revision'])
    except (ValueError, OSError, zipfile.BadZipFile, ET.ParseError, KeyError) as error:
        print('数值表错误：' + str(error), file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
