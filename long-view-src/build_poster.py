import json, os, re
S = os.path.dirname(os.path.abspath(__file__))
data = open(S + '/data/out.json').read()
js = open(S + '/page/lv.js').read().replace('/*DATA*/', data)

def sub(old, new):
    global js
    assert old in js, old
    js = js.replace(old, new)

# Taller main chart, tighter strips, one shared time axis down the column.
sub("  var START = 1928,", "  if (window.LV_EVH) EVENTS.forEach(function (e) { if (window.LV_EVH[e.a]) e.h = window.LV_EVH[e.a]; });\n  var START = 1928,")
sub("h = f.narrow ? 400 : 580", "h = window.LV_H || 640")
sub("var gap = f.narrow ? 35 : 36;", "var gap = window.LV_GAP || 36;")
sub("f = frame(), h = 150;", "f = frame(), h = 138;")
sub("f = frame(), h = 170;", "f = frame(), h = 156;")
sub("h = f.narrow ? 360 : 460;", "h = 500;")
sub("    f.r = f.narrow ? 12 : 20;\n", "")
sub("var w = wrap.clientWidth, h = 300, top = 18, bot = h - 40", "var w = wrap.clientWidth, h = 440, top = 18, bot = h - 58")
sub("md = median(a);", "md = a.reduce(function (t, v) { return t + v; }, 0) / a.length;")
sub("""el('text', { x: cx, y: h - 8, 'text-anchor': 'middle', class: 'ink', style: 'font-size:11.5px' }, svg, pct(up, 0));""",
    """el('text', { x: cx, y: h - 26, 'text-anchor': 'middle', class: 'ink', style: 'font-size:12.5px' }, svg, pct(md));
        el('text', { x: cx, y: h - 8, 'text-anchor': 'middle', class: 'body', style: 'font-size:12.5px' }, svg, pct(up, 0));""")
sub("keys.forEach(function (s, i) {\n        var a = rolling",
    """el('text', { x: 0, y: h - 26, class: 'ink', style: 'font-size:12.5px' }, svg, 'Average');
      el('text', { x: 0, y: h - 8, class: 'body', style: 'font-size:12.5px' }, svg, 'Positive');
      keys.forEach(function (s, i) {
        var a = rolling""")

sub("a: 'Pandemic', b: 'down 34%', h: 70", "a: 'Pandemic', b: 'down 34%', h: 54 },\n    { x: 2022.95, a: 'Rate shock', b: 'down 25%', below: true")

sub("      if (e.right) {", """      if (e.below) {
        el('text', { x: px + 5, y: py + 17, class: 'ink' }, svg, e.a);
        el('text', { x: px + 5, y: py + 32 }, svg, e.b);
        return;
      }
      if (e.right) {""")
sub("el('line', { x1: f.l, x2: f.w - f.r, y1: y(0), y2: y(0), stroke: 'var(--slate)' }, svg);\n  }\n\n  function rolling", """el('line', { x1: f.l, x2: f.w - f.r, y1: y(0), y2: y(0), stroke: 'var(--slate)' }, svg);
    var lx = f.w - f.r + 16, rx = f.w - 2, mx = lx + 88, ty = 318;
    el('text', { x: lx, y: ty - 16, class: 'ink' }, svg, 'Six worst declines');
    el('text', { x: lx, y: ty, class: 'body' }, svg, 'and years to recover');
    el('text', { x: lx, y: ty + 26, class: 'ink' }, svg, 'Peak');
    el('text', { x: mx, y: ty + 26, class: 'ink', 'text-anchor': 'end' }, svg, 'Drop');
    el('text', { x: rx, y: ty + 26, class: 'ink', 'text-anchor': 'end' }, svg, 'Years');
    el('line', { x1: lx, x2: rx, y1: ty + 33, y2: ty + 33, stroke: 'var(--gold)', 'stroke-width': 1.5 }, svg);
    [[1929, 0.8619, 25.0], [2007, 0.5678, 5.5], [1937, 0.5447, 8.9], [2000, 0.4915, 7.2], [1973, 0.482, 7.5], [1938, 0.463, 6.3]].forEach(function (d, i) {
      var ry = ty + 52 + i * 22;
      el('text', { x: lx, y: ry, class: 'body' }, svg, d[0]);
      el('text', { x: mx, y: ry, class: 'body', 'text-anchor': 'end' }, svg, pct(-d[1], 0));
      el('text', { x: rx, y: ry, class: 'body', 'text-anchor': 'end' }, svg, d[2].toFixed(1));
    });
  }

  function rolling""")
sub("<th>Real, all</th><th>Worst yr</th><th>Std dev</th>", "<th>After<br>inflation</th><th>Worst<br>year</th><th>Volatility</th>")
sub("(i === P.length - 1 ? 'All' : n + '-yr')", "(i === P.length - 1 ? '98-yr' : n + '-yr')")
sub("<th>Treas.</th><th>Infl.</th>", "<th>Treasuries</th><th>Inflation</th>")

css = open(S + '/page/lv.css').read()

head = '''<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Source+Sans+3:wght@400;500;600&display=block" rel="stylesheet">
<style>
:root{--navy:#1B2A4A;--navy-deep:#111D33;--gold:#B5823F;--gold-light:#D6AF72;--charcoal:#46403A;--slate:#6B6459;--paper:#F8F3EA;
--heading:'Newsreader',Georgia,serif;--essay:'Newsreader',Georgia,serif;--body:'Source Sans 3',sans-serif;}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--paper)}
body{width:2000px;font-family:var(--body);color:var(--charcoal);-webkit-font-smoothing:antialiased}
.pt-top{background:var(--navy-deep);color:#fff;padding:36px 44px 34px;display:flex;justify-content:space-between;align-items:flex-end;gap:40px}
.pt-eyebrow{font-size:15px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--gold-light)}
.pt-top h1{font-family:var(--heading);font-weight:400;font-size:52px;line-height:1.12;margin-top:8px}
.pt-top .pt-deck{font-size:19px;color:#E9E3D8;margin-top:10px}
.pt-mark{text-align:right;flex:none}
.pt-mark b{display:block;font-family:var(--heading);font-weight:400;font-size:28px}
.pt-mark i{display:block;width:48px;height:2px;background:var(--gold-light);margin:9px 0 9px auto}
.pt-mark span{font-size:15px;color:#E9E3D8}
.pt-body{display:grid;grid-template-columns:1250px 620px;gap:42px;padding:26px 44px 20px}
.pt-body h2{font-family:var(--heading);font-weight:500;color:var(--navy);font-size:25px;line-height:1.2}
.pt-sec{margin-top:20px;padding-top:15px;border-top:1px solid var(--lv-rule)}
.pt-sec:first-child{margin-top:0;padding-top:0;border-top:0}
.pt-sub{font-size:15px;margin-top:3px}
.pt-col{--lv-rule:rgba(70,64,58,0.14)}
.pt-foot{padding:0 44px 28px;font-size:12.5px;line-height:1.5;color:var(--slate)}
.pt-foot p{margin-top:5px}
.pt-foot p:first-child{border-top:1px solid rgba(70,64,58,0.14);padding-top:12px;margin-top:0}
.pt-foot strong{color:var(--charcoal);font-weight:600}
.pt-hide{display:none}
</style>
''' + css + '''
<style>
.lv-legend{margin:9px 0 4px;font-size:14px}
.lv-chart text{font-size:13px}
.lv-grid{grid-template-columns:repeat(2,1fr);gap:12px 22px;margin-top:10px}
.lv-grid h3{font-size:15px;margin-bottom:2px}
.lv-table{font-size:14px}
.lv-table th,.lv-table td{padding:8px 6px}
.lv-scroll{margin-top:6px;overflow:visible}
.lv-table thead th{vertical-align:bottom}
.lv-fine{font-size:12.5px;margin-top:6px;line-height:1.45}
</style></head><body>
<div class="lv">
<header class="pt-top">
  <div>
    <div class="pt-eyebrow">The long view</div>
    <h1>What $1,000 did across 98 years of markets</h1>
    <p class="pt-deck">$1,000 in the S&amp;P 500 at the start of 1928 grew to about <span id="lv-deck-val">$11.6 million</span> by the end of 2025, with every dividend reinvested and every crash sat through.</p>
  </div>
  <div class="pt-mark"><b>Jordan M. Whitledge</b><i></i><span>Common Sense Finance, Uncommon Wealth</span></div>
</header>
<div class="pt-body">
  <div class="pt-col">
    <section class="pt-sec">
      <h2>Growth of $1,000, 1928 to 2025</h2>
      <p class="pt-sub">Log scale, so equal distances are equal percentage moves. Gray bands are recessions.</p>
      <ul class="lv-legend" id="lv-legend"></ul>
      <div class="lv-chart" id="lv-main"></div>
    </section>
    <section class="pt-sec">
      <h2>What investors were paying: the Shiller CAPE</h2>
      <p class="pt-sub">CAPE is price divided by ten years of inflation-adjusted earnings. It closed 1999 at 44 and stocks returned −1.0% a year over the next decade. It closed 1981 at 8 and they returned 17.4%.</p>
      <div class="lv-chart" id="lv-cape" style="margin-top:8px"></div>
    </section>
    <section class="pt-sec">
      <h2>Inflation and Treasury bill yields</h2>
      <p class="pt-sub">Treasury bills returned 3.3% a year against 3.0% inflation, so cash held its value and earned little more.</p>
      <ul class="lv-legend">
        <li><i class="bar" style="background:var(--s-inf)"></i>Inflation (CPI)</li>
        <li><i style="border-color:var(--s-bl)"></i>3-month Treasury bills</li>
      </ul>
      <div class="lv-chart" id="lv-rates"></div>
    </section>
    <section class="pt-sec">
      <h2>Bull and bear markets</h2>
      <p class="pt-sub">18 bear markets since 1928. The median bear lasted 14 months and the median bull 38.</p>
      <ul class="lv-legend">
        <li><i class="bar" style="background:var(--s-st)"></i>Bull market</li>
        <li><i class="bar" style="background:var(--s-inf)"></i>Bear market (20% or more)</li>
        <li><i class="bar" style="background:rgba(70,64,58,0.16)"></i>Recession</li>
      </ul>
      <div class="lv-chart" id="lv-cycles"></div>
      <p class="lv-fine">S&amp;P 500 price, without dividends, on a log scale. Each bull market climbs from the prior low and each bear market falls from the prior high, so every shape starts at zero. Bulls of four years or more are labeled with length, total gain, and yearly pace. Years to recover run from the peak until the index closed back at that level. With dividends reinvested, recoveries came sooner.</p>
    </section>
  </div>
  <div class="pt-col">
    <section class="pt-sec">
      <h2>Time changes the risk</h2>
      <p class="pt-sub">A single year in stocks has ranged from −44% to +53%. No 20-year window has lost money, even after inflation.</p>
      <ul class="lv-legend" id="lv-legend2"></ul>
      <div class="lv-grid" id="lv-time"></div>
      <p class="lv-fine">Annualized returns for every rolling calendar-year window, before inflation unless noted. Each bar runs from worst to best and the white tick marks the average. Positive is the share of windows with a gain.</p>
    </section>
    <section class="pt-sec">
      <h2>Compound annual returns through 2025</h2>
      <div class="lv-scroll"><table class="lv-table" id="lv-table-cagr"></table></div>
      <p class="lv-fine">After inflation covers the full 98 years. Volatility is the standard deviation of yearly returns.</p>
    </section>
    <section class="pt-sec">
      <h2>Annualized by decade</h2>
      <div class="lv-scroll"><table class="lv-table" id="lv-table-dec"></table></div>
    </section>
  </div>
</div>
<footer class="pt-foot">
  <p><strong>For educational purposes only.</strong> This is not personalized investment advice or a recommendation of any security or allocation. Index returns are shown without fees, expenses, or taxes, and you cannot invest directly in an index. The 60/40 portfolio is hypothetical: 60% S&amp;P 500 and 40% 10-year Treasuries, rebalanced each January, and no account earned these results. Past performance does not guarantee future results.</p>
  <p><strong>Sources.</strong> Returns and inflation: Aswath Damodaran, NYU Stern. CAPE: Robert J. Shiller, Yale. Bull and bear markets: S&amp;P 500 daily closes from Yahoo Finance, including its predecessor index before 1957; a rally under 12 months that ends in a new low stays inside the bear, so some lists will split these differently. Recessions: National Bureau of Economic Research.</p>
</footer>
<div class="pt-hide">
  <button id="lv-nominal"></button><button id="lv-real"></button>
  <p id="lv-cycles-note"></p><p id="lv-time-note"></p><p id="lv-cape-note"></p>
</div>
</div>
''' + js + '''
<script>
document.fonts.ready.then(function(){setTimeout(function(){document.body.setAttribute('data-h',document.documentElement.scrollHeight)},300)});
</script>
</body></html>'''
open(S + '/poster.html', 'w').write(head)


# Social version: main chart only, 4:5 portrait.
pre = head.split('<body>')[0]
social = pre + """<style>
body{width:864px}
.lv-chart text{font-size:15px}
.sv-top{background:var(--navy-deep);color:#fff;padding:30px 30px 26px}
.sv-top .pt-eyebrow{font-size:14px}
.sv-top h1{font-family:var(--heading);font-weight:400;font-size:42px;line-height:1.12;margin-top:6px}
.sv-top p{font-size:19px;line-height:1.35;color:#E9E3D8;margin-top:10px}
.sv-mid{padding:16px 30px 0}
.sv-mid .pt-sub{font-size:16px}
.sv-mid .lv-legend{font-size:15px;gap:6px 16px}
.sv-foot{padding:10px 30px 12px;font-size:12px;line-height:1.42;color:var(--slate)}
.sv-foot strong{color:var(--charcoal);font-weight:600}
.sv-brand{background:var(--navy-deep);color:#fff;padding:13px 30px;display:flex;justify-content:space-between;align-items:baseline}
.sv-brand b{font-family:var(--heading);font-weight:400;font-size:23px}
.sv-brand span{font-size:15px;color:var(--gold-light)}
</style></head><body>
<div class="lv">
<header class="sv-top">
  <div class="pt-eyebrow">The long view</div>
  <h1>What $1,000 did across 98 years of markets</h1>
  <p>$1,000 in the S&amp;P 500 at the start of 1928 grew to about <span id="lv-deck-val">$11.6 million</span> by the end of 2025, with every dividend reinvested and every crash sat through.</p>
</header>
<div class="sv-mid">
  <p class="pt-sub">Log scale, so equal distances are equal percentage moves. Gray bands are recessions.</p>
  <ul class="lv-legend" id="lv-legend"></ul>
  <div class="lv-chart" id="lv-main"></div>
</div>
<footer class="sv-foot"><strong>For educational purposes only,</strong> not personalized investment advice. Index returns exclude fees, expenses, and taxes, and you cannot invest directly in an index. The 60/40 portfolio is hypothetical: 60% S&amp;P 500 and 40% 10-year Treasuries, rebalanced each January, and no account earned these results. Past performance does not guarantee future results. <strong>Sources:</strong> Aswath Damodaran, NYU Stern; Yahoo Finance; NBER.</footer>
<div class="sv-brand"><b>Jordan M. Whitledge</b><span>Common Sense Finance, Uncommon Wealth</span></div>
<div class="pt-hide">
  <button id="lv-nominal"></button><button id="lv-real"></button>
  <p id="lv-cycles-note"></p><p id="lv-time-note"></p><p id="lv-cape-note"></p>
  <ul id="lv-legend2"></ul><div id="lv-cape"></div><div id="lv-rates"></div><div id="lv-cycles"></div><div id="lv-time"></div>
  <table id="lv-table-cagr"></table><table id="lv-table-dec"></table>
</div>
</div>
<script>window.LV_H = 692; window.LV_GAP = 40; window.LV_EVH = { 'Financial crisis': 92, 'Dot-com bust': 58 };</script>
""" + js + "</body></html>"
open(S + '/social.html', 'w').write(social)
