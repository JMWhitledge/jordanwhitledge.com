"""Attach a price path to each bull/bear cycle in data/out.json.

Usage: python3 -I add_paths.py <path to Yahoo ^GSPC daily chart JSON>
Each path is the S&P 500 close divided by its close on the cycle's first day,
at every daily close, so bulls rise from 1 and bears fall from 1.
"""
import json, os, sys, datetime as dt

S = os.path.dirname(os.path.abspath(__file__))
j = json.load(open(sys.argv[1]))['chart']['result'][0]
px = [(dt.datetime.fromtimestamp(t, dt.timezone.utc).date(), p)
      for t, p in zip(j['timestamp'], j['indicators']['quote'][0]['close']) if p]
px = [x for x in px if x[0] <= dt.date(2025, 12, 31)]

out = json.load(open(S + '/data/out.json'))
def dec(d): return round(d.year + (d.timetuple().tm_yday - 1) / 365.25, 3)
for c in out['cycles']:
    a, b = dt.date.fromisoformat(c['start']), dt.date.fromisoformat(c['end'])
    seg = [x for x in px if a <= x[0] <= b]
    assert seg[0][0] == a and seg[-1][0] == b, (c, seg[0], seg[-1])
    base = seg[0][1]
    chg = seg[-1][1] / base - 1
    assert abs(chg - c['chg']) < 0.001, (c, chg)
    pts = seg
    c['path'] = [[dec(d), round(p / base, 3)] for d, p in pts]
    c['days'] = (b - a).days
json.dump(out, open(S + '/data/out.json', 'w'), separators=(',', ':'))
print(len(out['cycles']), sum(len(c['path']) for c in out['cycles']), 'points')
