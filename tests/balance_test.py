"""Exercise planner input errors and the workbook-to-game boundary."""
import copy
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location('build_balance', ROOT / 'scripts/build_balance.py')
compiler = importlib.util.module_from_spec(spec)
spec.loader.exec_module(compiler)


class PlanningTables(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tables = compiler.read_workbook(compiler.WORKBOOK)
        cls.content = compiler.content_data()

    def build(self, mutate=None):
        tables = copy.deepcopy(self.tables)
        if mutate:
            mutate(tables)
        return compiler.compile_tables(tables, self.content)

    def test_workbook_creates_a_valid_playable_opening(self):
        compiler.runtime_check(self.build())

    def test_real_table_edit_changes_game_quotes_and_announcement_copy(self):
        def edit(tables):
            next(row for row in tables['城镇市场'] if row['城镇ID'] == 'pasloe' and row['货物ID'] == 'wheat')['基准售价'] = 10
            next(row for row in tables['收购公告'] if row['公告ID'] == 'pazzio-wheat')['需求数量'] = 9
        balance = self.build(edit)
        script = """const fs=require('node:fs');global.SW_BALANCE=JSON.parse(fs.readFileSync(0,'utf8'));const data=require('./js/data.js');const {Game}=require('./js/engine.js');const game=new Game(data);console.log(JSON.stringify({price:game.quote('wheat').buy,description:data.purchaseNotices.find(n=>n.id==='pazzio-wheat').description,quantity:game.getPurchaseOffers('pazzio').find(n=>n.templateId==='pazzio-wheat').quantity}));"""
        process = subprocess.run(['node', '-e', script], cwd=ROOT, input=json.dumps(balance), text=True, capture_output=True, check=True)
        observed = json.loads(process.stdout)
        self.assertGreater(observed['price'], 9)
        self.assertEqual(observed['quantity'], 9)
        self.assertIn('9袋小麦', observed['description'])
        self.assertNotEqual(balance['revision'], self.build()['revision'])

    def test_reference_notes_do_not_change_balance_revision(self):
        self.assertEqual(self.build()['revision'], self.build(lambda t: t['全局参数'][0].update({'说明': '文字说明调整'}))['revision'])

    def test_duplicate_and_missing_ids_are_rejected(self):
        for mutation in [lambda t: t['商品'].append(t['商品'][0]), lambda t: t['商品'].pop()]:
            with self.subTest(mutation=mutation), self.assertRaises(ValueError):
                self.build(mutation)

    def test_non_quarter_prices_are_rejected(self):
        with self.assertRaisesRegex(ValueError, '0.25'):
            self.build(lambda t: t['城镇市场'][0].update({'基准售价': 1.1}))

    def test_blank_text_and_fractional_quantities_are_rejected(self):
        for value in [None, '12', 1.5]:
            with self.subTest(value=value), self.assertRaises(ValueError):
                self.build(lambda t: t['收购公告'][0].update({'需求数量': value}))

    def test_market_duplicates_and_unknown_goods_are_rejected(self):
        for mutation in [lambda t: t['城镇市场'].append(t['城镇市场'][0]), lambda t: t['城镇市场'][0].update({'货物ID': 'unknown'})]:
            with self.subTest(mutation=mutation), self.assertRaises(ValueError):
                self.build(mutation)

    def test_announcement_cannot_buy_a_local_market_good(self):
        with self.assertRaisesRegex(ValueError, '公开市场'):
            self.build(lambda t: t['收购公告'][0].update({'收购地ID': 'pazzio'}))

    def test_duplicate_reverse_routes_are_rejected(self):
        def edit(tables):
            row = dict(tables['商路'][0])
            row['起点ID'], row['终点ID'] = row['终点ID'], row['起点ID']
            tables['商路'].append(row)
        with self.assertRaisesRegex(ValueError, '重复'):
            self.build(edit)

    def test_invalid_rule_references_and_calendar_days_are_rejected(self):
        for key, value in [('rules.market.priceSteps', 8), ('calendar.epoch.day', 31), ('rules.relationship.max', 10)]:
            def edit(tables):
                next(row for row in tables['全局参数'] if row['参数键'] == key)['数值'] = value
            with self.subTest(key=key), self.assertRaises(ValueError):
                self.build(edit)

    def test_initial_cargo_and_engine_quantity_limit_are_checked(self):
        for quantity in [100, 10001]:
            with self.subTest(quantity=quantity), self.assertRaises(ValueError):
                self.build(lambda t: t['开局货物'][0].update({'数量': quantity}))

    def test_duplicate_or_unknown_global_parameters_are_rejected(self):
        for mutation in [lambda t: t['全局参数'].append(t['全局参数'][0]), lambda t: t['全局参数'][0].update({'参数键': 'rules.unknown'})]:
            with self.subTest(mutation=mutation), self.assertRaises(ValueError):
                self.build(mutation)

    def test_event_inputs_compile_from_the_same_workbook(self):
        balance = self.build()
        self.assertEqual(balance['rules']['events']['rainForecastDays'], 2)
        self.assertEqual({event['id'] for event in balance['worldEvents']}, {'rain', 'harvest', 'festival'})
        changed = self.build(lambda t: t['随机事件'][1].update({'行情倍率': .6}))
        self.assertEqual(next(event for event in changed['worldEvents'] if event['id'] == 'harvest')['priceMultiplier'], .6)
        self.assertNotEqual(changed['revision'], balance['revision'])

    def test_festival_demand_and_prices_are_workbook_driven(self):
        changed = self.build(lambda t: next(row for row in t['随机事件'] if row['事件ID'] == 'festival').update({'每日消耗数量': 9, '行情倍率': 1.5}))
        festival = next(event for event in changed['worldEvents'] if event['id'] == 'festival')
        self.assertEqual(festival['dailyConsumption'], 9)
        self.assertEqual(festival['priceMultiplier'], 1.5)
        for value in [-1, 1.5]:
            with self.subTest(value=value), self.assertRaises(ValueError):
                self.build(lambda t: next(row for row in t['随机事件'] if row['事件ID'] == 'festival').update({'每日消耗数量': value}))

    def test_first_rumor_cannot_include_exact_forecast_fields(self):
        content = copy.deepcopy(self.content)
        content['newsTemplates']['festival']['tavern']['hint'] = ['{place}将于{startDate}举办宴席。']
        with self.assertRaisesRegex(ValueError, '初闻泄漏细节'):
            compiler.compile_tables(copy.deepcopy(self.tables), content)

    def test_invalid_event_durations_multipliers_and_probabilities_are_rejected(self):
        mutations = [
            lambda t: t['随机事件'][0].update({'最短持续天': 4, '最长持续天': 2}),
            lambda t: t['随机事件'][1].update({'库存倍率': 1.5}),
            lambda t: t['随机事件'][1].update({'行情倍率': 0}),
            lambda t: t['随机事件'].append(t['随机事件'][0]),
            lambda t: next(row for row in t['全局参数'] if row['参数键'] == 'rules.events.dailyChance').update({'数值': 1.1}),
            lambda t: next(row for row in t['全局参数'] if row['参数键'] == 'rules.events.rainForecastDays').update({'数值': 0}),
        ]
        for mutation in mutations:
            with self.subTest(mutation=mutation), self.assertRaises(ValueError):
                self.build(mutation)


if __name__ == '__main__':
    unittest.main()
