// Coast Heat — cover rendering engine (canvas 2D, no libraries).
// Draws a multi-panel sunset poster from photos + lettering, in the sizes
// 1080x1080, 1080x1350 and 1920x1080. Everything here is original art:
// no game logos, artwork or fonts are used anywhere in this file.

export const SIZES = {
  "1080x1080": { w: 1080, h: 1080, label: "Square" },
  "1080x1350": { w: 1080, h: 1350, label: "Portrait" },
  "1920x1080": { w: 1920, h: 1080, label: "Wide" },
};

// Each layout is a function of (W, H) returning panels in fractions of the
// cover. Title band always occupies the bottom ~34% as an overlay.
export const LAYOUTS = [
  {
    id: "hero",
    name: "Hero + Two",
    blurb: "One big hero, two stacked",
    panels(W, H) {
      return [
        { x: 0, y: 0, w: 0.56, h: 0.66, tilt: -0.6 },
        { x: 0.56, y: 0, w: 0.44, h: 0.33, tilt: 0.6 },
        { x: 0.56, y: 0.33, w: 0.44, h: 0.33, tilt: -0.4 },
      ];
    },
  },
  {
    id: "grid",
    name: "Cast Grid",
    blurb: "Tall hero + four scenes",
    panels(W, H) {
      return [
        { x: 0, y: 0, w: 0.36, h: 0.66 },
        { x: 0.36, y: 0, w: 0.32, h: 0.33 },
        { x: 0.68, y: 0, w: 0.32, h: 0.33 },
        { x: 0.36, y: 0.33, w: 0.32, h: 0.33 },
        { x: 0.68, y: 0.33, w: 0.32, h: 0.33 },
      ];
    },
  },
  {
    id: "tilt",
    name: "Tilted Cut",
    blurb: "Slanted collage energy",
    panels(W, H) {
      return [
        { x: 0.02, y: 0.01, w: 0.46, h: 0.64, tilt: -2.2 },
        { x: 0.5, y: 0.03, w: 0.48, h: 0.3, tilt: 1.4 },
        { x: 0.52, y: 0.35, w: 0.46, h: 0.3, tilt: -1.2 },
      ];
    },
  },
  {
    id: "strip",
    name: "Wide + Strip",
    blurb: "Full-bleed hero, three below",
    panels(W, H) {
      return [
        { x: 0, y: 0, w: 1, h: 0.62 },
        { x: 0, y: 0.62, w: 0.34, h: 0.2 },
        { x: 0.34, y: 0.62, w: 0.33, h: 0.2 },
        { x: 0.67, y: 0.62, w: 0.33, h: 0.2 },
      ];
    },
  },
  {
    id: "comic",
    name: "Slash Comic",
    blurb: "Diagonal slashed panels",
    panels(W, H) {
      return [
        { x: 0, y: 0, w: 0.38, h: 0.66, slash: 0.06 },
        { x: 0.36, y: 0, w: 0.32, h: 0.66, slash: 0.06 },
        { x: 0.66, y: 0, w: 0.34, h: 0.66, slash: 0.06 },
      ];
    },
  },
  {
    id: "nine",
    name: "Mosaic Nine",
    blurb: "Hero corner + five scenes",
    panels(W, H) {
      return [
        { x: 0, y: 0, w: 0.42, h: 0.66 },
        { x: 0.42, y: 0, w: 0.29, h: 0.33 },
        { x: 0.71, y: 0, w: 0.29, h: 0.33 },
        { x: 0.42, y: 0.33, w: 0.29, h: 0.33 },
        { x: 0.71, y: 0.33, w: 0.29, h: 0.33 },
      ];
    },
  },
];

export const GRADES = [
  {
    id: "ember",
    name: "Ember Sunset",
    blurb: "Orange + magenta dusk",
    filter: "saturate(1.35) contrast(1.08) brightness(1.02)",
    tint: ["#ff7a18", "#ff2d78"],
    title: ["#fff7d6", "#ffb03a", "#ff5e8a"],
    script: "#ff7ad9",
    scrim: "22,6,18",
  },
  {
    id: "vice",
    name: "Neon Vice",
    blurb: "Pink + teal night neon",
    filter: "saturate(1.5) contrast(1.12) hue-rotate(-12deg)",
    tint: ["#ff2d78", "#19e3d6"],
    title: ["#fdf6ff", "#ff7ad9", "#19e3d6"],
    script: "#4df3e4",
    scrim: "10,4,28",
  },
  {
    id: "golden",
    name: "Golden Hour",
    blurb: "Warm honey light",
    filter: "saturate(1.25) contrast(1.05) sepia(0.22) brightness(1.05)",
    tint: ["#ffc46b", "#ff8a3d"],
    title: ["#fffbe8", "#ffd76b", "#ff9a3d"],
    script: "#ffb03a",
    scrim: "30,16,4",
  },
  {
    id: "midnight",
    name: "Midnight Teal",
    blurb: "Deep blue night drive",
    filter: "saturate(1.2) contrast(1.14) brightness(0.94) hue-rotate(18deg)",
    tint: ["#1b6fff", "#7a2bff"],
    title: ["#eaf6ff", "#7cc4ff", "#b07cff"],
    script: "#8fd8ff",
    scrim: "4,8,30",
  },
  {
    id: "candy",
    name: "Candy Pop",
    blurb: "Bubblegum bright",
    filter: "saturate(1.7) contrast(1.05) brightness(1.06)",
    tint: ["#ff5e8a", "#ffb03a"],
    title: ["#ffffff", "#ffd1e8", "#ff5e8a"],
    script: "#ff5e8a",
    scrim: "40,8,30",
  },
  {
    id: "noir",
    name: "Noir",
    blurb: "High-contrast mono",
    filter: "grayscale(0.92) contrast(1.28) brightness(1.02)",
    tint: ["#888888", "#222222"],
    title: ["#ffffff", "#d8d8d8", "#9a9a9a"],
    script: "#e8e8e8",
    scrim: "0,0,0",
  },
];

export const DEFAULT_PANEL_LABELS = [
  { label: "OCEAN DRIVE", sub: "6:42 PM · LOOKING FOR TROUBLE" },
  { label: "PALM BOULEVARD", sub: "7:05 PM · LIGHTS OUT" },
  { label: "MARINA DEL SOL", sub: "7:40 PM · NO WITNESSES" },
  { label: "PIER 26", sub: "5:30 AM · GONE FISHING" },
  { label: "INTERSTATE 6", sub: "11:58 PM · FULL THROTTLE" },
  { label: "TOWER 2", sub: "6:10 PM · LAST SWIM" },
];

// Captions that belong to each photo, so a panel's caption always matches the
// photo inside it. Order matches the sample tray: hero, man, biker, boat,
// car, skyline, neon. The cast (hero + the three new characters) comes first
// so the default panels show the full cast.
export const PHOTO_LABELS = [
  { label: "OCEAN DRIVE", sub: "6:42 PM · LOOKING FOR TROUBLE" },
  { label: "VICE CITY", sub: "AFTER DARK · NO ALIBI" },
  { label: "COASTAL RUN", sub: "TOP SPEED · SUNSET CHASE" },
  { label: "BISCAYNE BAY", sub: "OPEN WATER · NO WAKE" },
  { label: "INTERSTATE 6", sub: "11:58 PM · FULL THROTTLE" },
  { label: "MARINA DEL SOL", sub: "7:40 PM · NO WITNESSES" },
  { label: "NEON DINER", sub: "9:15 PM · LIGHTS OUT" },
];

export const USER_PHOTO_LABEL = { label: "YOUR SHOT", sub: "JUST NOW · STARRING YOU" };

export function labelsForPhoto(photoIndex, isSample) {
  if (isSample && PHOTO_LABELS[photoIndex]) return PHOTO_LABELS[photoIndex];
  if (!isSample) return USER_PHOTO_LABEL;
  return DEFAULT_PANEL_LABELS[photoIndex % DEFAULT_PANEL_LABELS.length];
}

export function layoutById(id) {
  return LAYOUTS.find((l) => l.id === id) || LAYOUTS[0];
}

export function gradeById(id) {
  return GRADES.find((g) => g.id === id) || GRADES[0];
}

// A procedural sunset scene, drawn when a panel has no photo yet: sky
// gradient, sun, skyline silhouettes and palm trees. Original vector art.
function drawProceduralScene(ctx, x, y, w, h, seed, grade) {
  const sky = ctx.createLinearGradient(x, y, x, y + h);
  sky.addColorStop(0, "#2b1055");
  sky.addColorStop(0.45, "#ff2d78");
  sky.addColorStop(0.75, "#ff7a18");
  sky.addColorStop(1, "#ffd76b");
  ctx.fillStyle = sky;
  ctx.fillRect(x, y, w, h);
  const sunX = x + w * (0.3 + (seed % 5) * 0.1);
  const sunY = y + h * 0.55;
  const sunR = Math.min(w, h) * 0.16;
  ctx.fillStyle = "#fff3c4";
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(20,8,30,0.85)";
  let bx = x;
  while (bx < x + w) {
    const bw = w * (0.08 + ((seed * 7 + bx) % 10) / 90);
    const bh = h * (0.18 + ((seed * 13 + bx) % 10) / 40);
    ctx.fillRect(bx, y + h - bh, bw, bh);
    bx += bw + w * 0.015;
  }
  ctx.fillStyle = "rgba(20,8,30,0.9)";
  ctx.fillRect(x, y + h * 0.82, w, h * 0.18);
  drawPalm(ctx, x + w * 0.82, y + h * 0.86, h * 0.22, "rgba(10,4,16,0.95)");
  drawPalm(ctx, x + w * 0.12, y + h * 0.9, h * 0.18, "rgba(10,4,16,0.95)");
}

// One palm silhouette: curved trunk + five fronds.
export function drawPalm(ctx, x, y, s, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(2, s * 0.05);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + s * 0.06, y - s * 0.55, x + s * 0.14, y - s * 0.95);
  ctx.stroke();
  const topX = x + s * 0.14;
  const topY = y - s * 0.95;
  for (let i = 0; i < 5; i++) {
    const a = (-160 + i * 32) * (Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.quadraticCurveTo(
      topX + Math.cos(a) * s * 0.32,
      topY + Math.sin(a) * s * 0.3 - s * 0.12,
      topX + Math.cos(a) * s * 0.55,
      topY + Math.sin(a) * s * 0.42 + s * 0.1,
    );
    ctx.stroke();
  }
  ctx.restore();
}

function drawPhotoCover(ctx, img, x, y, w, h, zoom, ox, oy) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const base = Math.max(w / iw, h / ih) * zoom;
  const dw = iw * base;
  const dh = ih * base;
  const dx = x + (w - dw) / 2 + ox * w;
  const dy = y + (h - dh) / 2 + oy * h;
  ctx.drawImage(img, dx, dy, dw, dh);
}

function fitFont(ctx, text, maxWidth, startSize, family, weight) {
  let size = startSize;
  ctx.font = `${weight} ${size}px ${family}`;
  while (size > 12 && ctx.measureText(text).width > maxWidth) {
    size -= 2;
    ctx.font = `${weight} ${size}px ${family}`;
  }
  return size;
}

function drawTitleBlock(ctx, W, H, state, grade) {
  // Title-over-art (#1 style): huge title overlapping the photo panels, so
  // the scrim starts higher to darken the title zone.
  const bandY = H * 0.5;
  const scrim = ctx.createLinearGradient(0, bandY, 0, H);
  scrim.addColorStop(0, `rgba(${grade.scrim},0)`);
  scrim.addColorStop(0.3, `rgba(${grade.scrim},0.45)`);
  scrim.addColorStop(0.65, `rgba(${grade.scrim},0.85)`);
  scrim.addColorStop(1, `rgba(${grade.scrim},0.94)`);
  ctx.fillStyle = scrim;
  ctx.fillRect(0, bandY, W, H - bandY);

  const pad = W * 0.035;
  const title = (state.title || "COAST HEAT").toUpperCase();
  const titleSize = fitFont(ctx, title, W - pad * 2, H * 0.24, "Anton, sans-serif", "");
  const titleY = H * 0.705;
  ctx.save();
  ctx.translate(W / 2, titleY);
  ctx.rotate(-0.02);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const grad = ctx.createLinearGradient(0, -titleSize * 0.6, 0, titleSize * 0.6);
  grad.addColorStop(0, grade.title[0]);
  grad.addColorStop(0.55, grade.title[1]);
  grad.addColorStop(1, grade.title[2]);
  ctx.lineJoin = "round";
  ctx.lineWidth = titleSize * 0.17;
  ctx.strokeStyle = "#1c0612";
  ctx.strokeText(title, 0, 0);
  // 3D chrome extrude: dark purple copy offset down-right, under the fill.
  ctx.fillStyle = "#3d0a3d";
  ctx.fillText(title, titleSize * 0.035, titleSize * 0.06);
  ctx.lineWidth = titleSize * 0.045;
  ctx.strokeStyle = "#ff2d78";
  ctx.strokeText(title, titleSize * 0.02, titleSize * 0.045);
  ctx.shadowColor = "rgba(10,2,10,0.55)";
  ctx.shadowBlur = titleSize * 0.1;
  ctx.shadowOffsetY = titleSize * 0.03;
  ctx.fillStyle = grad;
  ctx.fillText(title, 0, 0);
  ctx.restore();

  // Script subtitle, neon glow, tucked under the title's right side.
  const sub = state.subtitle || "";
  if (sub) {
    const subSize = fitFont(ctx, sub, W * 0.62, H * 0.075, "Pacifico, cursive", "");
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${subSize}px Pacifico, cursive`;
    ctx.shadowColor = grade.script;
    ctx.shadowBlur = H * 0.02;
    ctx.fillStyle = grade.script;
    ctx.fillText(sub, W * 0.62, H * 0.85);
    ctx.restore();
  }

  // Star meter + quote line above the title.
  const stars = Math.max(0, Math.min(5, state.stars ?? 5));
  const starText = "★".repeat(stars) + "☆".repeat(5 - stars);
  // Stars + quote sit above the title, over the photos: dark outline keeps
  // them readable. Credit moves below the subtitle, above the ticker.
  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(2, H * 0.003);
  ctx.strokeStyle = "rgba(12,4,10,0.85)";
  ctx.font = `${Math.round(H * 0.028)}px sans-serif`;
  ctx.fillStyle = "#ffd76b";
  ctx.strokeText(starText, pad, H * 0.55);
  ctx.fillText(starText, pad, H * 0.55);
  const quote = "“A FEVER DREAM IN NEON” — THE COAST HERALD";
  const quoteSize = fitFont(ctx, quote, W * 0.58, Math.round(H * 0.02), "sans-serif", "700");
  ctx.font = `700 ${quoteSize}px sans-serif`;
  ctx.fillStyle = "#f5efe6";
  ctx.strokeText(quote, pad + H * 0.16, H * 0.55);
  ctx.fillText(quote, pad + H * 0.16, H * 0.55);
  ctx.font = `${Math.round(H * 0.013)}px sans-serif`;
  ctx.fillStyle = "rgba(245,239,230,0.75)";
  ctx.fillText("COAST HEAT · A COAST HEAT COVER STUDIO PICTURE · STARRING YOU", pad, H * 0.905);
  ctx.restore();

  // Badge, top-right of the title zone.
  drawBadge(ctx, W, H, state.badge || "seal", grade);

  // Bottom ticker strip with palm silhouettes.
  const tickH = H * 0.045;
  ctx.fillStyle = "#14060f";
  ctx.fillRect(0, H - tickH, W, tickH);
  ctx.fillStyle = "#ff5e8a";
  drawPalm(ctx, W * 0.03, H - tickH * 0.12, tickH * 1.5, "#ff5e8a");
  drawPalm(ctx, W * 0.965, H - tickH * 0.12, tickH * 1.5, "#ff5e8a");
  const ticker = (state.ticker || "").toUpperCase();
  if (ticker) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const tSize = fitFont(ctx, ticker, W * 0.88, tickH * 0.52, "Anton, sans-serif", "");
    ctx.font = `${tSize}px Anton, sans-serif`;
    ctx.fillStyle = "#f5efe6";
    ctx.fillText(ticker, W / 2, H - tickH / 2);
    ctx.restore();
  }
}

function drawBadge(ctx, W, H, kind, grade) {
  const cx = W * 0.9;
  const cy = H * 0.72;
  ctx.save();
  if (kind === "seal") {
    const r = H * 0.055;
    ctx.translate(cx, cy);
    ctx.rotate(-0.12);
    ctx.fillStyle = "#ffd76b";
    ctx.beginPath();
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      const rr = i % 2 === 0 ? r * 1.18 : r * 0.98;
      ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#1c0612";
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffd76b";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `700 ${Math.round(r * 0.34)}px sans-serif`;
    ctx.fillText("EST.", 0, -r * 0.26);
    ctx.font = `${Math.round(r * 0.52)}px Anton, sans-serif`;
    ctx.fillText("2026", 0, r * 0.14);
    ctx.font = `700 ${Math.round(r * 0.26)}px sans-serif`;
    ctx.fillText("★ ORIGINAL ★", 0, r * 0.52);
  } else if (kind === "wanted") {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const bw = W * 0.17;
    const bh = H * 0.045;
    ctx.fillStyle = "#14060f";
    ctx.strokeStyle = "#ffd76b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cx - bw / 2, cy - bh / 2, bw, bh, bh / 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ffd76b";
    ctx.font = `700 ${Math.round(bh * 0.42)}px sans-serif`;
    ctx.fillText("WANTED  ★★★★★", cx, cy);
  } else if (kind === "vol") {
    ctx.translate(cx, cy);
    ctx.rotate(0.1);
    ctx.fillStyle = "#19e3d6";
    ctx.fillRect(-W * 0.05, -H * 0.022, W * 0.1, H * 0.044);
    ctx.fillStyle = "#14060f";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${Math.round(H * 0.028)}px Anton, sans-serif`;
    ctx.fillText("VOL. 06", 0, 0);
  }
  ctx.restore();
}

function drawPanelLabel(ctx, rect, panel, W, H) {
  const label = panel.label || "";
  const sub = panel.sub || "";
  if (!label && !sub) return;
  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const fs = Math.max(11, Math.round(H * 0.016));
  const subFs = Math.round(fs * 0.72);
  ctx.font = `700 ${fs}px sans-serif`;
  const labelW = ctx.measureText(label).width;
  ctx.font = `${subFs}px sans-serif`;
  const subW = ctx.measureText(sub).width;
  const padX = fs * 0.8;
  const chipW = Math.max(labelW, subW) + padX * 2;
  const lineH = fs * 1.5;
  const chipH = sub ? lineH * 2 + fs * 0.5 : lineH + fs * 0.5;
  const lx = rect.x + rect.w * 0.04;
  const ly = rect.y + rect.h - chipH - rect.h * 0.05;
  ctx.fillStyle = "rgba(12,4,10,0.88)";
  ctx.fillRect(lx, ly, chipW, chipH);
  ctx.fillStyle = "#f5efe6";
  ctx.font = `700 ${fs}px sans-serif`;
  ctx.fillText(label, lx + padX, ly + lineH / 2 + fs * 0.12);
  if (sub) {
    ctx.font = `${subFs}px sans-serif`;
    ctx.fillStyle = "#ffd76b";
    ctx.fillText(sub, lx + padX, ly + lineH + lineH / 2 + fs * 0.12);
  }
  ctx.restore();
}

// Panel rects in device pixels, for the editor's hit-testing.
export function layoutPanelRects(W, H, layoutId) {
  const layout = layoutById(layoutId);
  const gutter = Math.max(4, Math.round(W * 0.006));
  return layout.panels(W, H).map((p) => {
    if (p.hidden) return null;
    return {
      x: p.x * W + gutter / 2,
      y: p.y * H + gutter / 2,
      w: p.w * W - gutter,
      h: p.h * H - gutter,
      tilt: p.tilt || 0,
      slash: p.slash || 0,
    };
  });
}

export function drawCover(ctx, W, H, state, photos) {
  const grade = gradeById(state.grade);
  const layout = layoutById(state.layout);
  ctx.save();
  ctx.clearRect(0, 0, W, H);
  // Cream poster stock + outer frame.
  ctx.fillStyle = "#f7ead9";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#14060f";
  ctx.fillRect(0, 0, W, Math.max(3, H * 0.004));
  ctx.fillRect(0, H - Math.max(3, H * 0.004), W, Math.max(3, H * 0.004));
  ctx.fillRect(0, 0, Math.max(3, W * 0.004), H);
  ctx.fillRect(W - Math.max(3, W * 0.004), 0, Math.max(3, W * 0.004), H);

  const rects = layoutPanelRects(W, H, state.layout);
  const panels = state.panels || [];
  rects.forEach((rect, i) => {
    if (!rect) return;
    const panel = panels[i] || {};
    const photo = photos[panel.photo ?? i] || null;
    ctx.save();
    // Clip to the panel shape (rectangle, tilted, or slashed).
    ctx.beginPath();
    if (rect.slash) {
      const s = rect.slash * W;
      ctx.moveTo(rect.x + s, rect.y);
      ctx.lineTo(rect.x + rect.w, rect.y);
      ctx.lineTo(rect.x + rect.w - s, rect.y + rect.h);
      ctx.lineTo(rect.x, rect.y + rect.h);
      ctx.closePath();
    } else if (rect.tilt) {
      const cx = rect.x + rect.w / 2;
      const cy = rect.y + rect.h / 2;
      ctx.translate(cx, cy);
      ctx.rotate((rect.tilt * Math.PI) / 180);
      ctx.rect(-rect.w / 2, -rect.h / 2, rect.w, rect.h);
      ctx.translate(-cx, -cy);
    } else {
      ctx.rect(rect.x, rect.y, rect.w, rect.h);
    }
    ctx.clip();
    if (photo) {
      ctx.filter = grade.filter;
      drawPhotoCover(ctx, photo, rect.x, rect.y, rect.w, rect.h, panel.zoom ?? 1.15, panel.ox ?? 0, panel.oy ?? 0);
      ctx.filter = "none";
      // Grade tint wash.
      const wash = ctx.createLinearGradient(rect.x, rect.y, rect.x + rect.w, rect.y + rect.h);
      wash.addColorStop(0, grade.tint[0] + "30");
      wash.addColorStop(1, grade.tint[1] + "30");
      ctx.globalCompositeOperation = "overlay";
      ctx.fillStyle = wash;
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      ctx.globalCompositeOperation = "source-over";
      // Warm sun flare top corner.
      const flare = ctx.createRadialGradient(rect.x + rect.w * 0.85, rect.y + rect.h * 0.08, 0, rect.x + rect.w * 0.85, rect.y + rect.h * 0.08, rect.w * 0.5);
      flare.addColorStop(0, "rgba(255,220,140,0.28)");
      flare.addColorStop(1, "rgba(255,220,140,0)");
      ctx.fillStyle = flare;
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    } else {
      drawProceduralScene(ctx, rect.x, rect.y, rect.w, rect.h, i + 1, grade);
    }
    // Vignette.
    const vig = ctx.createRadialGradient(rect.x + rect.w / 2, rect.y + rect.h / 2, Math.min(rect.w, rect.h) * 0.35, rect.x + rect.w / 2, rect.y + rect.h / 2, Math.max(rect.w, rect.h) * 0.75);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, "rgba(10,2,10,0.32)");
    ctx.fillStyle = vig;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    ctx.restore();
    // Cream gutter edge + caption chip (outside the clip).
    ctx.save();
    ctx.strokeStyle = "#f7ead9";
    ctx.lineWidth = Math.max(3, W * 0.004);
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    drawPanelLabel(ctx, rect, panel, W, H);
    ctx.restore();
  });

  drawTitleBlock(ctx, W, H, state, grade);
  ctx.restore();
}

export function renderCoverToCanvas(W, H, state, photos) {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  drawCover(canvas.getContext("2d"), W, H, state, photos);
  return canvas;
}
