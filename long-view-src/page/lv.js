<script>
(function () {
  var DATA = /*DATA*/;
  var rows = DATA.rows, cycles = DATA.cycles;
  var SVGNS = 'http://www.w3.org/2000/svg';
  var SERIES = [
    { k: 'st', name: 'U.S. stocks', short: 'Stocks', c: 'var(--s-st)', w: 2.5 },
    { k: 'bal', name: '60/40 portfolio', short: '60/40', c: 'var(--s-bal)', w: 2 },
    { k: 'bd', name: '10-year Treasuries', short: 'Treasuries', c: 'var(--s-bd)', w: 2 },
    { k: 'bl', name: 'Treasury bills', short: 'T-bills', c: 'var(--s-bl)', w: 2 },
    { k: 'inf', name: 'Inflation', short: 'Inflation', c: 'var(--s-inf)', w: 2, dash: '5 4' }
  ];
  var RECESSIONS = [[1929.58,1933.17],[1937.33,1938.42],[1945.08,1945.75],[1948.83,1949.75],[1953.5,1954.33],[1957.58,1958.25],[1960.25,1961.08],[1969.92,1970.83],[1973.83,1975.17],[1980,1980.5],[1981.5,1982.83],[1990.5,1991.17],[2001.17,2001.83],[2007.92,2009.42],[2020.08,2020.25]];
  var EVENTS = [
    { x: 1932.4, a: 'Great Depression', b: 'S&P 500 down 86%', right: true },
    { x: 1945.7, a: 'World War II ends', h: 44 },
    { x: 1974.75, a: 'Oil shock', b: 'down 48%', h: 84 },
    { x: 1987.8, a: 'Black Monday', b: 'down 34%', h: 58 },
    { x: 2002.75, a: 'Dot-com bust', b: 'down 49%', h: 92 },
    { x: 2009.2, a: 'Financial crisis', b: 'down 57%', h: 128 },
    { x: 2020.2, a: 'Pandemic', b: 'down 34%', h: 70 }
  ];
  var START = 1928, END = 2026, MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  var ret = { st: [], bal: [], bd: [], bl: [], inf: [] };
  rows.forEach(function (r) {
    ret.st.push(r.st); ret.bd.push(r.bd); ret.bl.push(r.bl); ret.inf.push(r.inf);
    ret.bal.push(0.6 * r.st + 0.4 * r.bd);
  });
  var levels = {};
  Object.keys(ret).forEach(function (k) {
    var v = 1000; levels[k] = [v];
    ret[k].forEach(function (r) { v *= 1 + r; levels[k].push(v); });
  });
  var state = { real: false };

  function el(tag, attrs, parent, text) {
    var n = document.createElementNS(SVGNS, tag);
    for (var a in attrs) n.setAttribute(a, attrs[a]);
    if (text != null) n.textContent = text;
    if (parent) parent.appendChild(n);
    return n;
  }
  function pct(v, d) { return (v * 100).toFixed(d == null ? 1 : d).replace('-', '−') + '%'; }
  function money(v, compact) {
    if (v >= 1e6) return '$' + (v / 1e6).toFixed(1) + 'M';
    if (compact && v >= 1e4) return '$' + Math.round(v / 1e3) + 'K';
    return '$' + Math.round(v).toLocaleString('en-US');
  }
  function cagr(arr, n) {
    var s = arr.slice(arr.length - n), g = 1;
    s.forEach(function (r) { g *= 1 + r; });
    return Math.pow(g, 1 / n) - 1;
  }
  function median(a) { var s = a.slice().sort(function (x, y) { return x - y; }), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }
  function stdev(a) { var m = a.reduce(function (x, y) { return x + y; }, 0) / a.length; return Math.sqrt(a.reduce(function (s, v) { return s + (v - m) * (v - m); }, 0) / (a.length - 1)); }
  function series(k) {
    return state.real ? levels[k].map(function (v, i) { return v / levels.inf[i] * 1000; }) : levels[k];
  }
  function realRet(k) { return ret[k].map(function (r, i) { return (1 + r) / (1 + ret.inf[i]) - 1; }); }

  function frame() {
    var w = document.getElementById('lv-main').clientWidth, narrow = w < 640;
    return { w: w, narrow: narrow, l: narrow ? 46 : 62, r: narrow ? 84 : 172 };
  }
  function xScale(f) { return function (v) { return f.l + (v - START) / (END - START) * (f.w - f.l - f.r); }; }

  var hovers = [];
  function placeTip(tip, wrap, px, py) {
    tip.style.display = 'block';
    var w = tip.offsetWidth, W = wrap.clientWidth;
    tip.style.left = (px + 14 + w > W ? Math.max(0, px - 14 - w) : px + 14) + 'px';
    if (py != null) tip.style.top = Math.max(0, py) + 'px';
  }
  function hoverLayer(svg, f, h, top, wrap, show) {
    var x = xScale(f), tip = document.createElement('div');
    tip.className = 'lv-tip'; wrap.appendChild(tip);
    var line = el('line', { y1: top, y2: h, stroke: 'var(--navy)', 'stroke-width': 1, opacity: 0, 'stroke-dasharray': '3 3' }, svg);
    var layer = el('g', {}, svg);
    var hit = el('rect', { x: f.l, y: 0, width: f.w - f.l - f.r, height: h, fill: 'transparent' }, svg);
    var api = {
      set: function (i, withTip) {
        var px = x(START + i);
        line.setAttribute('x1', px); line.setAttribute('x2', px); line.setAttribute('opacity', 0.55);
        while (layer.firstChild) layer.removeChild(layer.firstChild);
        var html = show(i, layer, px);
        if (withTip && html) { tip.innerHTML = html; placeTip(tip, wrap, px); } else tip.style.display = 'none';
      },
      clear: function () {
        line.setAttribute('opacity', 0); tip.style.display = 'none';
        while (layer.firstChild) layer.removeChild(layer.firstChild);
      }
    };
    function move(e) {
      var r = svg.getBoundingClientRect();
      var v = (e.clientX - r.left - f.l) / (f.w - f.l - f.r) * (END - START);
      var i = Math.max(1, Math.min(END - START, Math.round(v)));
      hovers.forEach(function (o) { o.set(i, o === api); });
    }
    hit.addEventListener('pointermove', move);
    hit.addEventListener('pointerdown', move);
    hit.addEventListener('pointerleave', function () { hovers.forEach(function (o) { o.clear(); }); });
    hovers.push(api);
  }

  function renderMain() {
    var wrap = document.getElementById('lv-main'), f = frame(), h = f.narrow ? 400 : 580;
    wrap.innerHTML = '';
    var svg = el('svg', { viewBox: '0 0 ' + f.w + ' ' + h, height: h, role: 'img', 'aria-label': 'Line chart of $1,000 invested at the start of 1928 in U.S. stocks, a 60/40 portfolio, 10-year Treasuries and Treasury bills, compared with inflation, through 2025.' }, wrap);
    var list = SERIES.filter(function (s) { return !(state.real && s.k === 'inf'); });
    var data = {}; var lo = Infinity, hi = 0;
    list.forEach(function (s) { data[s.k] = series(s.k); data[s.k].forEach(function (v) { lo = Math.min(lo, v); hi = Math.max(hi, v); }); });
    lo *= 0.7; hi *= 1.2;
    var top = 10, bot = h - 26, x = xScale(f);
    var y = function (v) { return bot - (Math.log(v) - Math.log(lo)) / (Math.log(hi) - Math.log(lo)) * (bot - top); };
    RECESSIONS.forEach(function (r) { el('rect', { x: x(r[0]), y: top, width: Math.max(1.5, x(r[1]) - x(r[0])), height: bot - top, fill: 'var(--lv-band)' }, svg); });
    for (var p = 1e3; p <= hi; p *= 10) {
      if (p < lo) continue;
      el('line', { x1: f.l, x2: f.w - f.r, y1: y(p), y2: y(p), stroke: 'var(--lv-rule)' }, svg);
      el('text', { x: f.l - 8, y: y(p) + 4, 'text-anchor': 'end' }, svg, p >= 1e6 ? '$' + p / 1e6 + 'M' : money(p, f.narrow));
    }
    for (var d = 1930; d <= 2020; d += f.narrow ? 20 : 10) {
      el('line', { x1: x(d), x2: x(d), y1: bot, y2: bot + 4, stroke: 'var(--slate)' }, svg);
      el('text', { x: x(d), y: bot + 17, 'text-anchor': 'middle' }, svg, d);
    }
    el('line', { x1: f.l, x2: f.w - f.r, y1: bot, y2: bot, stroke: 'var(--slate)' }, svg);
    list.slice().reverse().forEach(function (s) {
      var pts = data[s.k].map(function (v, i) { return x(START + i).toFixed(1) + ',' + y(v).toFixed(1); }).join(' ');
      el('polyline', { points: pts, fill: 'none', stroke: s.c, 'stroke-width': s.w, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-dasharray': s.dash || 'none' }, svg);
    });
    if (!f.narrow) EVENTS.forEach(function (e) {
      var i = Math.floor(e.x - START), t = e.x - START - i, s = data.st;
      var v = Math.exp(Math.log(s[i]) * (1 - t) + Math.log(s[i + 1]) * t), py = y(v), px = x(e.x);
      if (e.right) {
        el('text', { x: px + 12, y: py - 1, class: 'ink' }, svg, e.a);
        el('text', { x: px + 12, y: py + 14 }, svg, e.b);
        return;
      }
      el('line', { x1: px, x2: px, y1: py - 5, y2: py - e.h, stroke: 'var(--slate)', opacity: 0.6 }, svg);
      el('text', { x: px - 5, y: py - e.h + 9, 'text-anchor': 'end', class: 'ink' }, svg, e.a);
      if (e.b) el('text', { x: px - 5, y: py - e.h + 24, 'text-anchor': 'end' }, svg, e.b);
    });
    var labels = list.map(function (s) {
      var arr = data[s.k], r = state.real ? realRet(s.k) : ret[s.k];
      return { s: s, v: arr[arr.length - 1], y: y(arr[arr.length - 1]), g: cagr(r, r.length) };
    }).sort(function (a, b) { return a.y - b.y; });
    var gap = f.narrow ? 35 : 36;
    labels.forEach(function (l, i) { l.ly = i ? Math.max(l.y, labels[i - 1].ly + gap) : Math.max(l.y, top + 6); });
    var over = labels[labels.length - 1].ly - (bot - 14);
    if (over > 0) labels.forEach(function (l) { l.ly -= over; });
    labels.forEach(function (l) {
      var lx = f.w - f.r + 10;
      el('circle', { cx: f.w - f.r, cy: l.y, r: 4, fill: l.s.c, stroke: 'var(--paper)', 'stroke-width': 2 }, svg);
      el('text', { x: lx, y: l.ly, class: 'ink' }, svg, f.narrow ? l.s.short : l.s.name);
      el('text', { x: lx, y: l.ly + 15, class: 'body' }, svg, money(l.v, f.narrow) + (f.narrow ? '' : ', ' + pct(l.g) + ' a year'));
    });
    hoverLayer(svg, f, bot, top, wrap, function (i, layer, px) {
      var html = '<b>End of ' + (START + i - 1) + '</b>';
      labels.forEach(function (l) {
        var v = data[l.s.k][i];
        el('circle', { cx: px, cy: y(v), r: 4, fill: l.s.c, stroke: 'var(--paper)', 'stroke-width': 2 }, layer);
        html += '<span>' + l.s.short + '<em style="font-style:normal">' + money(v) + '</em></span>';
      });
      return html;
    });
    var deck = document.getElementById('lv-deck-val');
    if (deck) deck.textContent = '$' + (levels.st[levels.st.length - 1] / 1e6).toFixed(1) + ' million';
  }

  function renderCape() {
    var wrap = document.getElementById('lv-cape'), f = frame(), h = 150;
    wrap.innerHTML = '';
    var svg = el('svg', { viewBox: '0 0 ' + f.w + ' ' + h, height: h, role: 'img', 'aria-label': 'Area chart of the Shiller CAPE ratio at each year end, 1928 to 2025.' }, wrap);
    var vals = rows.map(function (r) { return r.cape; }), med = median(vals), last = vals[vals.length - 1];
    var top = 8, bot = h - 24, x = xScale(f), max = 50;
    var y = function (v) { return bot - v / max * (bot - top); };
    RECESSIONS.forEach(function (r) { el('rect', { x: x(r[0]), y: top, width: Math.max(1.5, x(r[1]) - x(r[0])), height: bot - top, fill: 'var(--lv-band)' }, svg); });
    [0, 25, 50].forEach(function (t) {
      el('line', { x1: f.l, x2: f.w - f.r, y1: y(t), y2: y(t), stroke: 'var(--lv-rule)' }, svg);
      el('text', { x: f.l - 8, y: y(t) + 4, 'text-anchor': 'end' }, svg, t);
    });
    var line = vals.map(function (v, i) { return x(START + i + 1).toFixed(1) + ',' + y(v).toFixed(1); });
    el('polygon', { points: x(START + 1) + ',' + bot + ' ' + line.join(' ') + ' ' + x(END) + ',' + bot, fill: 'var(--navy)', opacity: 0.1 }, svg);
    el('polyline', { points: line.join(' '), fill: 'none', stroke: 'var(--navy)', 'stroke-width': 2, 'stroke-linejoin': 'round' }, svg);
    el('line', { x1: f.l, x2: f.w - f.r, y1: y(med), y2: y(med), stroke: 'var(--gold)', 'stroke-width': 1.5, 'stroke-dasharray': '4 4' }, svg);
    el('text', { x: f.w - f.r + 10, y: y(last) + 4, class: 'ink' }, svg, last.toFixed(1) + (f.narrow ? '' : ' at end of 2025'));
    el('text', { x: f.w - f.r + 10, y: y(med) + 4, class: 'body' }, svg, 'Median ' + med.toFixed(1));
    decadeAxis(svg, f, x, bot);
    hoverLayer(svg, f, bot, top, wrap, function (i, layer) {
      var r = rows[i - 1];
      el('circle', { cx: x(START + i), cy: y(r.cape), r: 4, fill: 'var(--navy)', stroke: 'var(--paper)', 'stroke-width': 2 }, layer);
      return '<b>December ' + r.y + '</b><span>CAPE<em style="font-style:normal">' + r.cape.toFixed(1) + '</em></span>';
    });
  }
  function decadeAxis(svg, f, x, bot) {
    el('line', { x1: f.l, x2: f.w - f.r, y1: bot, y2: bot, stroke: 'var(--slate)' }, svg);
    for (var d = 1930; d <= 2020; d += f.narrow ? 20 : 10) el('text', { x: x(d), y: bot + 17, 'text-anchor': 'middle' }, svg, d);
  }

  function renderRates() {
    var wrap = document.getElementById('lv-rates'), f = frame(), h = 170;
    wrap.innerHTML = '';
    var svg = el('svg', { viewBox: '0 0 ' + f.w + ' ' + h, height: h, role: 'img', 'aria-label': 'Bars of annual inflation with a line of Treasury bill yields, 1928 to 2025.' }, wrap);
    var top = 8, bot = h - 24, x = xScale(f), lo = -0.12, hi = 0.20;
    var y = function (v) { return bot - (v - lo) / (hi - lo) * (bot - top); };
    RECESSIONS.forEach(function (r) { el('rect', { x: x(r[0]), y: top, width: Math.max(1.5, x(r[1]) - x(r[0])), height: bot - top, fill: 'var(--lv-band)' }, svg); });
    [-0.1, 0, 0.1, 0.2].forEach(function (t) {
      el('line', { x1: f.l, x2: f.w - f.r, y1: y(t), y2: y(t), stroke: t === 0 ? 'var(--slate)' : 'var(--lv-rule)' }, svg);
      el('text', { x: f.l - 8, y: y(t) + 4, 'text-anchor': 'end' }, svg, pct(t, 0));
    });
    var bw = Math.max(1.5, (x(START + 1) - x(START)) - 2);
    rows.forEach(function (r) {
      var y0 = y(0), y1 = y(r.inf);
      el('rect', { x: x(r.y + 0.5) - bw / 2, y: Math.min(y0, y1), width: bw, height: Math.max(1, Math.abs(y1 - y0)), fill: 'var(--s-inf)', opacity: 0.8, rx: 1 }, svg);
    });
    el('polyline', { points: rows.map(function (r) { return x(r.y + 0.5).toFixed(1) + ',' + y(r.bl).toFixed(1); }).join(' '), fill: 'none', stroke: 'var(--s-bl)', 'stroke-width': 2, 'stroke-linejoin': 'round' }, svg);
    var inf = rows[rows.length - 1], yb = y(inf.bl), yi = y(inf.inf);
    el('text', { x: f.w - f.r + 10, y: Math.min(yb, yi - 15) + 4, class: 'body' }, svg, 'T-bills ' + pct(inf.bl));
    el('text', { x: f.w - f.r + 10, y: Math.max(yi, yb + 15) + 4, class: 'body' }, svg, 'Inflation ' + pct(inf.inf));
    decadeAxis(svg, f, x, h - 24 > y(lo) ? y(lo) : bot);
    hoverLayer(svg, f, bot, top, wrap, function (i) {
      var r = rows[i - 1];
      return '<b>' + r.y + '</b><span>Inflation<em style="font-style:normal">' + pct(r.inf) + '</em></span><span>T-bills<em style="font-style:normal">' + pct(r.bl) + '</em></span>';
    });
  }

  function dec(s) { var p = s.split('-'); return +p[0] + (p[1] - 1) / 12 + (p[2] - 1) / 365; }
  function month(s) { var p = s.split('-'); return MONTHS[p[1] - 1] + ' ' + p[0]; }
  function renderCycles() {
    var wrap = document.getElementById('lv-cycles'), f = frame(), h = f.narrow ? 300 : 340;
    wrap.innerHTML = '';
    f.r = f.narrow ? 12 : 20;
    var svg = el('svg', { viewBox: '0 0 ' + f.w + ' ' + h, height: h, role: 'img', 'aria-label': 'Bars of each S&P 500 bull and bear market from 1928 to 2025, width showing duration and height showing size.' }, wrap);
    var tip = document.createElement('div'); tip.className = 'lv-tip'; wrap.appendChild(tip);
    var top = 22, bot = h - 24, x = xScale(f), lim = 2.15;
    var y = function (c) { return (top + bot) / 2 - Math.log(1 + c) / lim * (bot - top) / 2; };
    [[-0.75], [-0.5], [1], [3], [6]].forEach(function (t) {
      var v = t[0];
      el('line', { x1: f.l, x2: f.w - f.r, y1: y(v), y2: y(v), stroke: 'var(--lv-rule)' }, svg);
      el('text', { x: f.l - 8, y: y(v) + 4, 'text-anchor': 'end' }, svg, (v > 0 ? '+' : '') + pct(v, 0));
    });
    for (var d = 1930; d <= 2020; d += f.narrow ? 20 : 10) el('text', { x: x(d), y: bot + 17, 'text-anchor': 'middle' }, svg, d);
    cycles.forEach(function (c) {
      var x0 = x(dec(c.start)), x1 = x(dec(c.end)), y1 = y(c.chg), y0 = y(0), bear = c.kind === 'bear';
      var r = el('rect', { x: x0 + 0.5, y: Math.min(y0, y1), width: Math.max(2, x1 - x0 - 1), height: Math.abs(y1 - y0), fill: bear ? 'var(--s-inf)' : 'var(--s-st)', rx: 1.5 }, svg);
      var html = '<b>' + (bear ? 'Bear market' : 'Bull market') + '</b>' + month(c.start) + ' to ' + month(c.end) + '<span>Change<em style="font-style:normal">' + (bear ? '' : '+') + pct(c.chg, 0) + '</em></span><span>Length<em style="font-style:normal">' + (c.m < 1 ? 'under 1' : c.m) + ' mo</em></span>';
      r.addEventListener('pointerenter', function () { tip.innerHTML = html; placeTip(tip, wrap, x1, 4); r.setAttribute('opacity', 0.75); });
      r.addEventListener('pointerleave', function () { tip.style.display = 'none'; r.removeAttribute('opacity'); });
      var big = bear ? c.chg <= -0.45 : c.chg >= 2.2;
      if (big && !(f.narrow && !bear && c.chg < 3.5) && !(f.narrow && bear && c.chg > -0.55)) {
        el('text', { x: (x0 + x1) / 2, y: bear ? y1 + 15 : y1 - 6, 'text-anchor': 'middle', class: 'ink' }, svg, (bear ? '' : '+') + pct(c.chg, 0));
      }
    });
    el('line', { x1: f.l, x2: f.w - f.r, y1: y(0), y2: y(0), stroke: 'var(--slate)' }, svg);
  }

  function rolling(k, n) {
    var out = [];
    for (var i = 0; i + n <= ret[k].length; i++) {
      var g = 1;
      for (var j = i; j < i + n; j++) g *= 1 + ret[k][j];
      out.push(Math.pow(g, 1 / n) - 1);
    }
    return out;
  }
  function renderTime() {
    var box = document.getElementById('lv-time'), keys = SERIES.slice(0, 4);
    box.innerHTML = '';
    [1, 5, 10, 20].forEach(function (n) {
      var cell = document.createElement('div');
      cell.innerHTML = '<h3>' + n + '-year periods</h3>';
      var wrap = document.createElement('div'); wrap.className = 'lv-chart'; cell.appendChild(wrap); box.appendChild(cell);
      var w = wrap.clientWidth, h = 300, top = 18, bot = h - 40, lo = -0.5, hi = 0.6;
      var svg = el('svg', { viewBox: '0 0 ' + w + ' ' + h, height: h, role: 'img', 'aria-label': n + '-year rolling return ranges' }, wrap);
      var tip = document.createElement('div'); tip.className = 'lv-tip'; wrap.appendChild(tip);
      var y = function (v) { return bot - (v - lo) / (hi - lo) * (bot - top); };
      var L = 36, step = (w - L) / 4, bw = Math.min(24, step - 8);
      [-0.5, -0.25, 0, 0.25, 0.5].forEach(function (t) {
        el('line', { x1: L, x2: w, y1: y(t), y2: y(t), stroke: t === 0 ? 'var(--slate)' : 'var(--lv-rule)' }, svg);
        el('text', { x: L - 6, y: y(t) + 4, 'text-anchor': 'end' }, svg, pct(t, 0));
      });
      keys.forEach(function (s, i) {
        var a = rolling(s.k, n), mn = Math.min.apply(null, a), mx = Math.max.apply(null, a), md = median(a);
        var up = a.filter(function (v) { return v > 0; }).length / a.length, cx = L + step * (i + 0.5);
        var r = el('rect', { x: cx - bw / 2, y: y(mx), width: bw, height: Math.max(3, y(mn) - y(mx)), fill: s.c, rx: 3 }, svg);
        el('line', { x1: cx - bw / 2 - 2, x2: cx + bw / 2 + 2, y1: y(md), y2: y(md), stroke: 'var(--paper)', 'stroke-width': 2 }, svg);
        el('text', { x: cx, y: y(mx) - 5, 'text-anchor': 'middle', class: 'body', style: 'font-size:11.5px' }, svg, pct(mx, 0));
        el('text', { x: cx, y: Math.min(bot + 12, y(mn) + 14), 'text-anchor': 'middle', class: 'body', style: 'font-size:11.5px' }, svg, pct(mn, 0));
        el('text', { x: cx, y: h - 8, 'text-anchor': 'middle', class: 'ink', style: 'font-size:11.5px' }, svg, pct(up, 0));
        var html = '<b>' + s.name + ', ' + n + '-year</b><span>Best<em style="font-style:normal">' + pct(mx) + '</em></span><span>Median<em style="font-style:normal">' + pct(md) + '</em></span><span>Worst<em style="font-style:normal">' + pct(mn) + '</em></span><span>Positive<em style="font-style:normal">' + pct(up, 0) + ' of ' + a.length + '</em></span>';
        var hit = el('rect', { x: cx - step / 2, y: 0, width: step, height: h, fill: 'transparent' }, svg);
        hit.addEventListener('pointerenter', function () { tip.innerHTML = html; placeTip(tip, wrap, cx, 24); });
        hit.addEventListener('pointerleave', function () { tip.style.display = 'none'; });
      });
    });
  }

  function renderTables() {
    var P = [1, 5, 10, 25, 50, rows.length];
    var t = '<thead><tr><th>Asset</th>' + P.map(function (n, i) { return '<th>' + (i === P.length - 1 ? 'All' : n + '-yr') + '</th>'; }).join('') + '<th>Real, all</th><th>Worst yr</th><th>Std dev</th></tr></thead><tbody>';
    SERIES.forEach(function (s) {
      var isInf = s.k === 'inf';
      t += '<tr><th scope="row">' + s.name + '</th>' + P.map(function (n) { return '<td>' + pct(cagr(ret[s.k], n)) + '</td>'; }).join('');
      t += '<td>' + (isInf ? '' : pct(cagr(realRet(s.k), rows.length))) + '</td><td>' + (isInf ? '' : pct(Math.min.apply(null, ret[s.k]))) + '</td><td>' + (isInf ? '' : pct(stdev(ret[s.k]))) + '</td></tr>';
    });
    document.getElementById('lv-table-cagr').innerHTML = t + '</tbody>';
    var d = '<thead><tr><th>Decade</th><th>Stocks</th><th>60/40</th><th>Treas.</th><th>Infl.</th></tr></thead><tbody>';
    for (var y = 1930; y <= 2020; y += 10) {
      var a = y - START, b = Math.min(a + 10, rows.length);
      d += '<tr><th scope="row">' + (y === 2020 ? '2020 to 2025' : y + 's') + '</th>' + ['st', 'bal', 'bd', 'inf'].map(function (k) {
        var g = 1; ret[k].slice(a, b).forEach(function (r) { g *= 1 + r; });
        return '<td>' + pct(Math.pow(g, 1 / (b - a)) - 1) + '</td>';
      }).join('') + '</tr>';
    }
    document.getElementById('lv-table-dec').innerHTML = d + '</tbody>';
  }

  function notes() {
    var bears = cycles.filter(function (c) { return c.kind === 'bear'; }), bulls = cycles.filter(function (c) { return c.kind === 'bull'; });
    var medB = Math.round(median(bears.map(function (c) { return c.m; }))), medU = Math.round(median(bulls.map(function (c) { return c.m; })));
    document.getElementById('lv-cycles-note').textContent = 'The S&P 500 has been through ' + bears.length + ' bear markets since 1928, roughly one every five years. The median bear lasted ' + medB + ' months and the median bull ' + medU + ', so the declines have tended to be short and the advances long.';
    var one = rolling('st', 1), twenty = rolling('st', 20);
    document.getElementById('lv-time-note').textContent = 'A single year in stocks has ranged from ' + pct(Math.min.apply(null, one), 0) + ' to ' + pct(Math.max.apply(null, one), 0) + '. No 20-year calendar window has lost money, and the worst one returned ' + pct(Math.min.apply(null, twenty)) + ' a year. Treasury bills flip that picture: almost no risk in a single year, and little to show after inflation over twenty.';
    var c99 = rows.filter(function (r) { return r.y === 1999; })[0].cape, i99 = rows.findIndex(function (r) { return r.y === 2000; });
    var g = 1; ret.st.slice(i99, i99 + 10).forEach(function (r) { g *= 1 + r; });
    var r81 = rows.filter(function (r) { return r.y === 1981; })[0], i82 = rows.findIndex(function (r) { return r.y === 1982; }), g2 = 1;
    ret.st.slice(i82, i82 + 10).forEach(function (r) { g2 *= 1 + r; });
    document.getElementById('lv-cape-note').textContent = 'Price divided by ten years of inflation-adjusted earnings. CAPE closed 1999 at ' + c99.toFixed(0) + ' and stocks returned ' + pct(Math.pow(g, 0.1) - 1) + ' a year over the next decade. It closed 1981 at ' + r81.cape.toFixed(0) + ' and they returned ' + pct(Math.pow(g2, 0.1) - 1) + '. It has said more about the following ten years than the following one.';
  }

  function legend(id, list) {
    document.getElementById(id).innerHTML = list.map(function (s) {
      return '<li' + (s.k === 'inf' ? ' data-inf' : '') + '><i style="border-color:' + s.c + (s.dash ? ';border-top-style:dashed' : '') + '"></i>' + s.name + '</li>';
    }).join('');
  }

  function renderAll() {
    hovers = [];
    renderMain(); renderCape(); renderRates(); renderCycles(); renderTime();
  }
  function toggle(real) {
    state.real = real;
    document.getElementById('lv-real').setAttribute('aria-pressed', real);
    document.getElementById('lv-nominal').setAttribute('aria-pressed', !real);
    var li = document.querySelector('#lv-legend [data-inf]'); if (li) li.style.display = real ? 'none' : '';
    hovers = []; renderAll();
  }
  document.getElementById('lv-real').addEventListener('click', function () { toggle(true); });
  document.getElementById('lv-nominal').addEventListener('click', function () { toggle(false); });

  legend('lv-legend', SERIES); legend('lv-legend2', SERIES.slice(0, 4));
  renderTables(); notes(); renderAll();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(renderAll);
  var last = document.getElementById('lv-main').clientWidth, t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(function () {
      var w = document.getElementById('lv-main').clientWidth;
      if (w !== last) { last = w; renderAll(); }
    }, 120);
  });
})();
</script>
