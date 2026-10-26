/* @ds-bundle: {"format":4,"namespace":"Glint","components":[{"name":"Button"},{"name":"Input"},{"name":"Chip"},{"name":"Tabs"},{"name":"Card"},{"name":"Alert"},{"name":"Toggle"},{"name":"Checkbox"},{"name":"RadioList"},{"name":"Slider"},{"name":"ProgressRing"},{"name":"Stat"},{"name":"Sparkle"},{"name":"Icon"},{"name":"WarpCheck"},{"name":"Twinkle"},{"name":"GlintFx"},{"name":"CheckerWipe"}]} */
(function () {
  var React = window.React, h = React.createElement, useState = React.useState;

  function cx() { var out = []; for (var i = 0; i < arguments.length; i++) if (arguments[i]) out.push(arguments[i]); return out.join(" "); }
  function omit(o, keys) { var r = {}; for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k) && keys.indexOf(k) < 0) r[k] = o[k]; return r; }

  /* ---------- Sparkle: the brand's four-point star ---------- */
  var SPARKLE_D = "M50 0C53 35 65 47 100 50C65 53 53 65 50 100C47 65 35 53 0 50C35 47 47 35 50 0Z";
  function Sparkle(p) {
    var size = p.size || 24, outlined = !!p.outlined;
    return h("svg", { className: cx("gl-sparkle", outlined && "is-outlined", p.className), width: size, height: size, viewBox: outlined ? "-5 -5 110 110" : "0 0 100 100", "aria-hidden": p.title ? undefined : true, role: p.title ? "img" : undefined, style: p.color ? { color: p.color } : undefined },
      p.title ? h("title", null, p.title) : null, h("path", { d: SPARKLE_D }));
  }

  /* ---------- Icon: 24px grid, 2px square-capped strokes ---------- */
  var ICONS = {
    search: [["circle", { cx: 10, cy: 10, r: 6 }], ["path", { d: "M15 15L20 20" }]],
    close: [["path", { d: "M6 6L18 18M18 6L6 18" }]],
    check: [["path", { d: "M5 12.5L10 17.5L19 7" }]],
    heart: [["path", { d: "M12 20L4.5 12.5C2.5 10.5 2.8 6.6 5.6 5.4C7.8 4.5 10.4 5.3 12 7.8C13.6 5.3 16.2 4.5 18.4 5.4C21.2 6.6 21.5 10.5 19.5 12.5Z", strokeLinejoin: "round" }]],
    user: [["circle", { cx: 12, cy: 8, r: 4 }], ["path", { d: "M4 21C4 16.5 7.5 14 12 14C16.5 14 20 16.5 20 21" }]],
    sync: [["path", { d: "M19.5 13A7.5 7.5 0 1 1 16.5 6.2" }], ["path", { d: "M16 2.5V6.5H20" }]],
    moon: [["path", { d: "M19.5 14.5A8 8 0 1 1 9.5 4.5A6.5 6.5 0 0 0 19.5 14.5Z", strokeLinejoin: "round" }]],
    info: [["circle", { cx: 12, cy: 12, r: 9 }], ["path", { d: "M12 11V17" }], ["rect", { x: 11, y: 7, width: 2, height: 2, fill: "currentColor", stroke: "none" }]],
    warning: [["path", { d: "M12 3L22 20H2Z", fill: "var(--warning)", stroke: "var(--line)", strokeLinejoin: "round" }], ["path", { d: "M12 9V14", stroke: "var(--on-accent)" }], ["rect", { x: 11, y: 16, width: 2, height: 2, fill: "var(--on-accent)", stroke: "none" }]],
    bolt: [["path", { d: "M13 2L5 13.5H11.5L10.5 22L19 10H12.5Z", strokeLinejoin: "round" }]]
  };
  function Icon(p) {
    var size = p.size || 20, spec = ICONS[p.name] || ICONS.info;
    return h("svg", { className: cx("gl-icon", p.className), width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "square", "aria-hidden": p.label ? undefined : true, role: p.label ? "img" : undefined, "aria-label": p.label, style: p.color ? { color: p.color } : undefined },
      spec.map(function (s, i) { return h(s[0], Object.assign({ key: i }, s[1])); }));
  }

  /* ---------- Button ---------- */
  function Button(p) {
    var variant = p.variant || "secondary", size = p.size || "md";
    var rest = omit(p, ["variant", "size", "icon", "brackets", "state", "className", "children", "label"]);
    var label = p.children;
    if (p.brackets && typeof label === "string") label = "[ " + label + " ]";
    var iconOnly = p.icon && !p.children;
    return h("button", Object.assign({ type: "button" }, rest, {
      className: cx("gl-btn", "gl-btn-" + variant, size === "sm" && "gl-btn-sm", iconOnly && "gl-btn-icon", p.state && "is-" + p.state, p.className),
      "aria-label": iconOnly ? (p.label || p.icon) : p["aria-label"]
    }), p.icon ? h(Icon, { name: p.icon, size: size === "sm" ? 16 : 18 }) : null, label);
  }

  /* ---------- Input ---------- */
  var uid = 0;
  function useId(prefix) { var s = useState(function () { uid += 1; return prefix + uid; }); return s[0]; }
  function Input(p) {
    var id = useId("gl-in-");
    var rest = omit(p, ["label", "icon", "help", "error", "className"]);
    return h("div", { className: cx("gl-field", p.className) },
      p.label ? h("label", { className: "gl-field-label", htmlFor: id }, p.label) : null,
      h("div", { className: cx("gl-input", p.error && "is-invalid") },
        h("input", Object.assign({ id: id, "aria-invalid": p.error ? true : undefined, "aria-describedby": (p.error || p.help) ? id + "-h" : undefined }, rest)),
        p.icon ? h(Icon, { name: p.icon, size: 20 }) : null),
      (p.error || p.help) ? h("div", { id: id + "-h", className: cx("gl-field-help", p.error && "is-error") }, p.error || p.help) : null);
  }

  /* ---------- Chip ---------- */
  function Chip(p) {
    var variant = p.variant || "outline";
    var cls = cx("gl-chip", variant === "soft" && "gl-chip-soft", p.selected && "is-selected", p.onRemove && "has-x", p.className);
    if (p.onRemove) {
      return h("span", { className: cls }, p.children,
        h("button", { type: "button", className: "gl-x", "aria-label": "Remove " + (typeof p.children === "string" ? p.children : ""), onClick: p.onRemove }, h(Icon, { name: "close", size: 14 })));
    }
    return h("button", { type: "button", className: cls, "aria-pressed": !!p.selected, onClick: p.onClick }, p.children);
  }

  /* ---------- Tabs ---------- */
  function Tabs(p) {
    var items = p.items || [];
    var s = useState(p.defaultValue || (items[0] && items[0].id));
    var value = p.value !== undefined ? p.value : s[0];
    function pick(id) { if (p.value === undefined) s[1](id); if (p.onChange) p.onChange(id); }
    function onKey(e, i) {
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!d) return;
      var n = items[(i + d + items.length) % items.length]; pick(n.id);
      var btns = e.currentTarget.parentNode.querySelectorAll("button"); btns[(i + d + items.length) % items.length].focus();
    }
    return h("div", { className: cx("gl-tabs", p.className), role: "tablist", "aria-label": p.label },
      items.map(function (it, i) {
        var on = it.id === value;
        return h("button", { key: it.id, type: "button", role: "tab", className: "gl-tab", "aria-selected": on, tabIndex: on ? 0 : -1, onClick: function () { pick(it.id); }, onKeyDown: function (e) { onKey(e, i); } }, p.brackets && on ? "[ " + it.label + " ]" : it.label);
      }));
  }

  /* ---------- Card (window chrome) ---------- */
  function WinBar(p) {
    return h("div", { className: "gl-win-bar" },
      p.lead || null,
      h("span", { className: "gl-win-title" }, p.title),
      p.actions || null,
      p.onClose ? h("button", { type: "button", className: "gl-x", "aria-label": "Close", onClick: p.onClose }, h(Icon, { name: "close", size: 16 }))
        : h("span", { className: "gl-win-dots", "aria-hidden": true }, h("span", { className: "gl-win-dot" }), h("span", { className: "gl-win-dot" })));
  }
  function Card(p) {
    var rest = omit(p, ["title", "accent", "actions", "onClose", "elevation", "className", "children", "lead"]);
    return h("section", Object.assign({}, rest, { className: cx("gl-win", p.accent && "gl-win-accent", p.elevation === 3 && "gl-win-elev3", p.className) }),
      p.title ? h(WinBar, { title: p.title, actions: p.actions, onClose: p.onClose, lead: p.lead }) : null,
      h("div", { className: "gl-win-body" }, p.children));
  }

  /* ---------- Alert ---------- */
  var ALERT = { warning: ["warning", "Heads up"], danger: ["warning", "Error"], info: ["info", "Note"], success: ["check", "Done"] };
  function Alert(p) {
    var tone = p.tone || "warning", a = ALERT[tone] || ALERT.warning;
    var iconColor = tone === "info" ? "var(--accent-strong)" : tone === "success" ? "var(--success)" : undefined;
    return h("section", { className: cx("gl-win", "gl-win-elev3", "gl-alert-" + tone, p.className), role: tone === "danger" ? "alert" : "status" },
      h(WinBar, { title: p.barTitle || a[1], onClose: p.onClose }),
      h("div", { className: "gl-win-body" },
        h("div", { className: "gl-alert-body" },
          h(Icon, { name: a[0], size: 32, color: iconColor }),
          h("div", null,
            p.title ? h("p", { className: "gl-alert-title" }, p.title) : null,
            p.children ? h("p", { className: "gl-alert-text" }, p.children) : null,
            p.actions ? h("div", { className: "gl-alert-actions" }, p.actions) : null))));
  }

  /* ---------- Toggle, Checkbox, RadioList ---------- */
  function useControlled(value, initial) { var s = useState(initial); return value !== undefined ? [value, s[1]] : s; }
  function Toggle(p) {
    var st = useControlled(p.checked, !!p.defaultChecked);
    return h("label", { className: cx("gl-toggle", p.className) },
      h("input", { type: "checkbox", role: "switch", checked: st[0], disabled: p.disabled, onChange: function (e) { st[1](e.target.checked); if (p.onChange) p.onChange(e.target.checked); } }),
      p.label);
  }
  function Checkbox(p) {
    var st = useControlled(p.checked, !!p.defaultChecked);
    return h("label", { className: cx("gl-check", p.className) },
      h("input", { type: "checkbox", checked: st[0], disabled: p.disabled, onChange: function (e) { st[1](e.target.checked); if (p.onChange) p.onChange(e.target.checked); } }),
      h("span", null, p.label));
  }
  function RadioList(p) {
    var name = useId("gl-rl-");
    var items = p.items || [];
    var st = useControlled(p.value, p.defaultValue || (items[0] && items[0].id));
    return h("fieldset", { className: cx("gl-radiolist", p.className) },
      p.legend ? h("legend", null, p.legend) : null,
      items.map(function (it) {
        return h("label", { key: it.id, className: "gl-radio" },
          h("input", { type: "radio", name: name, value: it.id, checked: st[0] === it.id, onChange: function () { st[1](it.id); if (p.onChange) p.onChange(it.id); } }),
          h("span", null, it.label));
      }));
  }

  /* ---------- Slider ---------- */
  function Slider(p) {
    var min = p.min == null ? 0 : p.min, max = p.max == null ? 100 : p.max;
    var st = useControlled(p.value, p.defaultValue == null ? (min + max) / 2 : p.defaultValue);
    var pct = ((st[0] - min) / (max - min)) * 100;
    var id = useId("gl-sl-");
    return h("div", { className: cx("gl-slider", p.className) },
      h("div", { className: "gl-slider-head" }, h("label", { htmlFor: id }, p.label), h("b", null, (p.format ? p.format(st[0]) : st[0]))),
      h("input", { id: id, type: "range", min: min, max: max, step: p.step || 1, value: st[0], style: { "--gl-fill": pct + "%" }, onChange: function (e) { var v = Number(e.target.value); st[1](v); if (p.onChange) p.onChange(v); } }));
  }

  /* ---------- ProgressRing: the glanceable goal ---------- */
  function ProgressRing(p) {
    var size = p.size || 160, th = p.thickness || 16, v = Math.max(0, p.value || 0);
    var r = size / 2 - th / 2 - 2, c = 2 * Math.PI * r, done = v >= 1;
    var off = c * (1 - Math.min(v, 1));
    var valueSize = Math.round(size * 0.22), pid = useId("gl-ring-d");
    return h("div", { className: cx("gl-ring", p.className), role: "img", "aria-label": p.ariaLabel || ((p.label || "Progress") + ": " + Math.round(v * 100) + "%") },
      h("svg", { width: size, height: size, viewBox: "0 0 " + size + " " + size, "aria-hidden": true },
        h("defs", null, h("pattern", { id: pid, width: 4, height: 4, patternUnits: "userSpaceOnUse" },
          h("rect", { className: "gl-ring-tbase", width: 4, height: 4 }),
          h("rect", { className: "gl-ring-tdot", width: 2, height: 2 }),
          h("rect", { className: "gl-ring-tdot", x: 2, y: 2, width: 2, height: 2 }))),
        h("g", { transform: "rotate(-90 " + size / 2 + " " + size / 2 + ")" },
          h("circle", { className: "gl-ring-track", cx: size / 2, cy: size / 2, r: r, strokeWidth: th, stroke: "url(#" + pid + ")" }),
          h("circle", { className: "gl-ring-arc", cx: size / 2, cy: size / 2, r: r, strokeWidth: th, strokeDasharray: c, strokeDashoffset: off }),
          h("circle", { className: "gl-ring-edge", cx: size / 2, cy: size / 2, r: r + th / 2 }),
          h("circle", { className: "gl-ring-edge", cx: size / 2, cy: size / 2, r: r - th / 2 }))),
      h("div", { className: "gl-ring-mid" },
        done ? h("span", { className: "gl-ring-spark" }, h(Sparkle, { size: Math.round(size * 0.12) })) : null,
        h("span", { className: "gl-ring-value", style: { fontSize: valueSize + "px", lineHeight: valueSize + "px" } }, p.display != null ? p.display : Math.round(v * 100) + "%"),
        p.label ? h("span", { className: "gl-ring-label" }, p.label) : null));
  }

  /* ---------- Stat ---------- */
  function Stat(p) {
    return h("div", { className: cx("gl-stat", p.className) },
      h("span", { className: "gl-stat-label" }, p.label),
      h("span", { className: "gl-stat-value" }, p.value, p.unit ? h("span", { className: "gl-stat-unit" }, p.unit) : null),
      p.delta ? h("span", { className: cx("gl-stat-delta", p.trend === "down" && "is-down") }, p.delta) : null);
  }

  /* ---------- WarpCheck: the tileable warped checkerboard ---------- */
  function rng(seed) { var s = (seed >>> 0) || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function warpGeometry(o) {
    var cols = o.cols, rows = o.rows, cell = o.cell, W = cols * cell, H = rows * cell, R = rng(o.seed), TAU = Math.PI * 2;
    var a1 = o.amp * cell, a2 = a1 * 0.45, k = 1 + Math.floor(R() * 2);
    var px1 = R() * TAU, px2 = R() * TAU, py1 = R() * TAU, py2 = R() * TAU;
    function dx(y) { return a1 * Math.sin(TAU * k * y / H + px1) + a2 * Math.sin(TAU * (k + 1) * y / H + px2); }
    function dy(x) { return a1 * Math.sin(TAU * k * x / W + py1) + a2 * Math.sin(TAU * (k + 1) * x / W + py2); }
    function P(x, y) { return [x + dx(y), y + dy(x)]; }
    var N = 10, cells = [], stars = [];
    for (var j = -1; j <= rows; j++) for (var i = -1; i <= cols; i++) {
      if (((i + j) % 2 + 2) % 2 !== 0) continue;
      var x0 = i * cell, y0 = j * cell, x1 = x0 + cell, y1 = y0 + cell, pts = [], t;
      for (t = 0; t < N; t++) pts.push(P(x0 + (x1 - x0) * t / N, y0));
      for (t = 0; t < N; t++) pts.push(P(x1, y0 + (y1 - y0) * t / N));
      for (t = 0; t < N; t++) pts.push(P(x1 - (x1 - x0) * t / N, y1));
      for (t = 0; t < N; t++) pts.push(P(x0, y1 - (y1 - y0) * t / N));
      cells.push("M" + pts.map(function (q) { return q[0].toFixed(1) + " " + q[1].toFixed(1); }).join("L") + "Z");
      if (o.stars && i > 0 && j > 0 && i < cols - 1 && j < rows - 1 && R() < 0.3) {
        var c = P(x0 + cell / 2, y0 + cell / 2), s = cell * (R() < 0.5 ? 0.34 : 0.22);
        stars.push({ x: c[0] - s / 2, y: c[1] - s / 2, s: s });
      }
    }
    return { W: W, H: H, cells: cells.join(""), stars: stars };
  }
  function WarpCheck(p) {
    var o = { cols: p.cols || 8, rows: p.rows || 8, cell: p.cell || 40, amp: p.amp == null ? 0.28 : p.amp, seed: p.seed || 7, stars: p.stars !== false };
    if (o.cols % 2) o.cols += 1; if (o.rows % 2) o.rows += 1;
    var g = React.useMemo(function () { return warpGeometry(o); }, [o.cols, o.rows, o.cell, o.amp, o.seed, o.stars]);
    return h("svg", { className: cx("gl-warp", p.className), width: p.width || g.W, height: p.height || g.H, viewBox: "0 0 " + g.W + " " + g.H, preserveAspectRatio: "xMidYMid slice", "aria-hidden": true },
      h("rect", { className: "gl-warp-ground", width: g.W, height: g.H }),
      h("path", { className: "gl-warp-cell", d: g.cells }),
      g.stars.map(function (s, i) { return h("path", { key: i, className: "gl-warp-star", d: SPARKLE_D, transform: "translate(" + s.x.toFixed(1) + " " + s.y.toFixed(1) + ") scale(" + (s.s / 100).toFixed(3) + ")" }); }));
  }
  WarpCheck.geometry = warpGeometry;

  /* ---------- Motion: Twinkle (the glint), GlintFx (sheen + twinkle), CheckerWipe ---------- */
  var useEffect = React.useEffect, useRef = React.useRef;
  function reducedMotion() { return typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function r2(n) { return Math.round(n * 100) / 100; }
  /* A four-point star with independent vertical (Lv) and horizontal (Lh) rays. core sets the waist,
     using the same control-point ratios as SPARKLE_PATH (0.06 and 0.3 of the radius). */
  function starD(Lv, Lh, core, rot) {
    var a = 0.06 * core, b = 0.3 * core, c = Math.cos(rot), s = Math.sin(rot);
    function P(x, y) { return r2(x * c - y * s) + " " + r2(x * s + y * c); }
    var tips = [[0, -Lv], [Lh, 0], [0, Lv], [-Lh, 0]], d = "M" + P(0, -Lv);
    for (var q = 0; q < 4; q++) {
      var c1 = [a, -b], c2 = [b, -a];
      for (var k = 0; k < q; k++) { c1 = [-c1[1], c1[0]]; c2 = [-c2[1], c2[0]]; }
      var t = tips[(q + 1) % 4];
      d += "C" + P(c1[0], c1[1]) + " " + P(c2[0], c2[1]) + " " + P(t[0], t[1]);
    }
    return d + "Z";
  }
  function backOut(x) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
  function cubicOut(x) { return 1 - Math.pow(1 - x, 3); }
  function clamp01(x) { return Math.max(0, Math.min(1, x)); }
  /* Envelope: 0-22% pop with overshoot, 22-42% hold, 42-100% cubic collapse to a point. */
  function glintEnv(t) { if (t <= 0 || t >= 1) return 0; if (t < 0.22) return backOut(t / 0.22); if (t < 0.42) return 1; var x = (t - 0.42) / 0.58; return 1 - x * x * x; }
  function glintFrame(t, R) {
    var e = glintEnv(t), stretch = 1 + 0.45 * Math.sin(Math.PI * clamp01(t / 0.6)), rot = (Math.PI / 7) * cubicOut(clamp01(t));
    var e2 = glintEnv((t - 0.06) / 0.8) * 0.42, p = (t - 0.04) / 0.5;
    return {
      main: e > 0.001 ? starD(R * e * stretch, R * e * 0.74, R * e * 0.9, rot) : "",
      diag: e2 > 0.001 ? starD(R * e2, R * e2, R * e2 * 0.7, rot + Math.PI / 4) : "",
      ringR: p > 0 && p < 1 ? R * (0.3 + 0.9 * cubicOut(p)) : 0,
      ringW: p > 0 && p < 1 ? R * 0.07 * (1 - p) : 0
    };
  }
  function paintSvg(svg, fr) {
    var ring = svg.querySelector(".gl-tw-ring");
    svg.querySelector(".gl-tw-main").setAttribute("d", fr.main || "M0 0");
    svg.querySelector(".gl-tw-diag").setAttribute("d", fr.diag || "M0 0");
    ring.setAttribute("r", r2(fr.ringR)); ring.setAttribute("stroke-width", r2(fr.ringW));
  }
  var rgbCache = {};
  function toRGB(col) {
    if (rgbCache[col]) return rgbCache[col];
    var c = document.createElement("canvas"); c.width = c.height = 1; var x = c.getContext("2d");
    x.fillStyle = "#000"; x.fillStyle = col; x.fillRect(0, 0, 1, 1); var d = x.getImageData(0, 0, 1, 1).data;
    return (rgbCache[col] = [d[0], d[1], d[2]]);
  }
  /* Pixel mode: draw on an n×n canvas, threshold alpha to hard pixels, scale up with image-rendering: pixelated. */
  function paintCanvas(cv, fr, n) {
    var ctx = cv.getContext("2d"); if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, n, n); ctx.translate(n / 2, n / 2); ctx.fillStyle = "#000"; ctx.strokeStyle = "#000";
    if (window.Path2D) { if (fr.main) ctx.fill(new Path2D(fr.main)); if (fr.diag) ctx.fill(new Path2D(fr.diag)); }
    if (fr.ringR > 0 && fr.ringW > 0.12) { /* in pixel mode the ring flash becomes four single-pixel satellites on the diagonals */
      var q = Math.round(fr.ringR * 0.7071);
      [[q, q], [-q, q], [q, -q], [-q, -q]].forEach(function (o) { ctx.fillRect(o[0] - 0.5, o[1] - 0.5, 1, 1); });
    }
    var rgb = toRGB(getComputedStyle(cv).color), img = ctx.getImageData(0, 0, n, n), d = img.data;
    for (var i = 0; i < d.length; i += 4) { var on = d[i + 3] > 72; d[i] = rgb[0]; d[i + 1] = rgb[1]; d[i + 2] = rgb[2]; d[i + 3] = on ? 255 : 0; }
    ctx.putImageData(img, 0, 0);
  }
  function Twinkle(p) {
    var size = p.size || 48, dur = p.duration || 900, n = p.pixel || 0, ref = useRef(null), auto = p.autoplay !== false;
    useEffect(function () {
      var el = ref.current; if (!el) return;
      var R = n ? n * 0.3 : 30, raf = 0, timer = 0, start = null, dead = false;
      function paint(t) { var fr = glintFrame(t, R); if (n) paintCanvas(el, fr, n); else paintSvg(el, fr); }
      if (reducedMotion()) { paint(p.restAt != null ? p.restAt : 0.3); return; }
      if (!auto) { paint(p.restAt != null ? p.restAt : 0); return; }
      function tick(now) {
        if (dead) return; if (start === null) start = now;
        var ms = now - start; if (n) ms = Math.floor(ms / 83) * 83;
        var t = ms / dur; paint(Math.min(t, 1));
        if (t < 1) raf = requestAnimationFrame(tick);
        else if (p.loop) timer = setTimeout(function () { start = null; raf = requestAnimationFrame(tick); }, p.loop);
      }
      paint(0);
      timer = setTimeout(function () { raf = requestAnimationFrame(tick); }, p.delay || 0);
      return function () { dead = true; cancelAnimationFrame(raf); clearTimeout(timer); };
    }, [p.play, p.loop, dur, n, p.delay, auto, p.restAt]);
    var style = Object.assign({ width: size + "px", height: size + "px" }, p.color ? { color: p.color } : null, p.style);
    if (n) return h("canvas", { ref: ref, className: cx("gl-twinkle", "is-pixel", p.className), width: n, height: n, style: style, "aria-hidden": true });
    return h("svg", { ref: ref, className: cx("gl-twinkle", p.className), viewBox: "-50 -50 100 100", width: size, height: size, style: style, "aria-hidden": true },
      h("circle", { className: "gl-tw-ring", r: 0 }), h("path", { className: "gl-tw-diag", d: "M0 0" }), h("path", { className: "gl-tw-main", d: "M0 0" }));
  }
  function GlintFx(p) {
    var hover = p.trigger === "hover", st = useState(hover ? 0 : 1), n = st[0], setN = st[1];
    function again() { setN(function (x) { return x + 1; }); }
    useEffect(function () { if (!p.loop) return; var id = setInterval(again, p.loop); return function () { clearInterval(id); }; }, [p.loop]);
    var first = useRef(true);
    useEffect(function () { if (first.current) { first.current = false; return; } again(); }, [p.play]);
    var sz = p.sparkleSize || 36, corner = p.corner || "tr", off = -Math.round(sz * 0.42);
    var pos = { width: sz + "px", height: sz + "px" };
    pos[corner[0] === "b" ? "bottom" : "top"] = off + "px"; pos[corner[1] === "l" ? "left" : "right"] = off + "px";
    var sheenStyle = {}; if (p.sheen) sheenStyle["--gl-sheen"] = p.sheen; if (p.radius != null) sheenStyle.borderRadius = p.radius;
    return h("span", { className: cx("gl-glintfx", p.className), style: p.style, onMouseEnter: hover ? again : undefined, onFocus: hover ? again : undefined },
      p.children,
      h("span", { key: "sh" + n, className: cx("gl-sheen", n > 0 && "is-on", corner[1] === "l" && "is-rtl"), style: sheenStyle, "aria-hidden": true }, h("i")),
      h("span", { className: "gl-glintfx-spark", style: pos, "aria-hidden": true },
        h(Twinkle, { size: sz, play: n, autoplay: n > 0, delay: p.sparkDelay != null ? p.sparkDelay : 260, pixel: p.pixel, color: p.color })));
  }
  function CheckerWipe(p) {
    var ref = useRef(null), cell = p.cell || 48, stag = p.stagger || 16;
    var gs = useState(null), grid = gs[0], setGrid = gs[1], ps = useState("idle"), phase = ps[0], setPhase = ps[1];
    var cb = useRef(p.onCovered); cb.current = p.onCovered;
    useEffect(function () { var el = ref.current; if (!el) return; var b = el.getBoundingClientRect(); setGrid([Math.max(1, Math.ceil(b.width / cell)), Math.max(1, Math.ceil(b.height / cell))]); }, [cell]);
    useEffect(function () {
      if (!p.play || !grid) return;
      if (reducedMotion()) { if (cb.current) cb.current(); return; }
      var cover = (grid[0] + grid[1]) * stag + 90 + 200;
      setPhase("in");
      var t1 = setTimeout(function () { if (cb.current) cb.current(); setPhase("out"); }, cover + 80);
      var t2 = setTimeout(function () { setPhase("idle"); }, 2 * cover + 160);
      return function () { clearTimeout(t1); clearTimeout(t2); };
    }, [p.play, grid && grid.join("x")]);
    var cells = [];
    if (grid && phase !== "idle") for (var j = 0; j < grid[1]; j++) for (var i = 0; i < grid[0]; i++)
      cells.push(h("span", { key: i + "-" + j, className: "gl-wipe-cell", style: { left: i * cell + "px", top: j * cell + "px", width: cell + "px", height: cell + "px", animationDelay: ((i + j) * stag + ((i + j) % 2) * 90) + "ms" } }));
    return h("div", { ref: ref, className: cx("gl-wipe", phase === "in" && "is-in", phase === "out" && "is-out", p.className), style: p.color ? { "--gl-wipe": p.color } : undefined, "aria-hidden": true },
      cells,
      p.glint !== false && phase !== "idle" ? h("span", { key: "g" + p.play, className: "gl-wipe-glint" }, h(Twinkle, { size: Math.min(cell * 3, 160), pixel: 24, delay: (grid ? (grid[0] + grid[1]) * stag : 0) })) : null);
  }

  var api = { Button: Button, Input: Input, Chip: Chip, Tabs: Tabs, Card: Card, Alert: Alert, Toggle: Toggle, Checkbox: Checkbox, RadioList: RadioList, Slider: Slider, ProgressRing: ProgressRing, Stat: Stat, Sparkle: Sparkle, Icon: Icon, WarpCheck: WarpCheck, Twinkle: Twinkle, GlintFx: GlintFx, CheckerWipe: CheckerWipe, SPARKLE_PATH: SPARKLE_D };
  window.Glint = Object.assign(window.Glint || {}, api);
})();
