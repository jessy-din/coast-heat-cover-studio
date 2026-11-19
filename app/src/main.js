// Coast Heat — editor wiring: photos, panels, controls, export, shot modes.
// The cover itself is drawn by src/cover.js; this file only runs the studio.

import {
  SIZES,
  LAYOUTS,
  GRADES,
  DEFAULT_PANEL_LABELS,
  labelsForPhoto,
  layoutById,
  gradeById,
  layoutPanelRects,
  drawCover,
  renderCoverToCanvas,
} from "./cover.js";

const SAMPLES = [
  { id: "hero", src: "samples/hero.jpg", name: "Convertible" },
  { id: "car", src: "samples/car.jpg", name: "Pink car" },
  { id: "skyline", src: "samples/skyline.jpg", name: "Skyline" },
  { id: "neon", src: "samples/neon.jpg", name: "Neon street" },
];

const $ = (sel) => document.querySelector(sel);
const params = new URLSearchParams(location.search);
const shot = params.get("shot");

// ---- state ---------------------------------------------------------------
function defaultPanels() {
  return DEFAULT_PANEL_LABELS.map((d, i) => {
    const photo = i % SAMPLES.length;
    const caption = labelsForPhoto(photo, true);
    return {
      photo,
      zoom: 1.15,
      ox: 0,
      oy: 0,
      label: caption.label,
      sub: caption.sub,
    };
  });
}

// Keep a panel's caption truthful: when its photo changes, the caption
// follows the new photo unless the user typed their own.
function applyPhotoCaption(panelIndex) {
  const panel = state.panels[panelIndex];
  const photo = photos[panel.photo];
  if (!photo) return;
  const caption = labelsForPhoto(panel.photo, photo.sample);
  panel.label = caption.label;
  panel.sub = caption.sub;
}

const state = {
  layout: params.get("layout") || "hero",
  grade: params.get("grade") || "ember",
  size: params.get("size") || "1920x1080",
  title: params.get("title") || "COAST HEAT",
  subtitle: params.get("subtitle") || "Chasing the last light",
  ticker: "GOLDEN HOUR · NO BRAKES · COMING SOON",
  stars: 5,
  badge: "seal",
  selected: 0,
  panels: defaultPanels(),
};

const photos = []; // { id, name, img, sample }
let history = [];
let future = [];

function snapshot() {
  return JSON.stringify(state);
}
function pushHistory() {
  history.push(snapshot());
  if (history.length > 60) history.shift();
  future = [];
}
function restore(json) {
  const next = JSON.parse(json);
  Object.assign(state, next);
  syncControls();
  render();
}
function undo() {
  if (!history.length) return;
  future.push(snapshot());
  restore(history.pop());
}
function redo() {
  if (!future.length) return;
  history.push(snapshot());
  restore(future.pop());
}

// ---- photo loading --------------------------------------------------------
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("could not load " + src));
    img.src = src;
  });
}

async function loadSamples() {
  for (const s of SAMPLES) {
    try {
      const img = await loadImage(s.src);
      photos.push({ id: s.id, name: s.name, img, sample: true });
    } catch {
      // A missing sample just leaves its panels procedural.
    }
  }
}

async function loadFonts() {
  try {
    await Promise.all([
      document.fonts.load('64px Anton'),
      document.fonts.load('40px Pacifico'),
      document.fonts.ready,
    ]);
  } catch {
    // System fallbacks still render; the cover stays usable offline.
  }
}

// ---- rendering -------------------------------------------------------------
const preview = $("#preview");

function render() {
  const size = SIZES[state.size] || SIZES["1920x1080"];
  if (preview.width !== size.w || preview.height !== size.h) {
    preview.width = size.w;
    preview.height = size.h;
  }
  drawCover(preview.getContext("2d"), size.w, size.h, state, photos.map((p) => p.img));
  window.__coverReady = true;
}

function renderShot() {
  const canvas = $("#shotCanvas");
  const size = SIZES[state.size] || SIZES["1920x1080"];
  canvas.width = size.w;
  canvas.height = size.h;
  drawCover(canvas.getContext("2d"), size.w, size.h, state, photos.map((p) => p.img));
  window.__coverReady = true;
}

// ---- controls ---------------------------------------------------------------
function buildChoices(container, items, current, onPick) {
  container.innerHTML = "";
  for (const item of items) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = item.name;
    const small = document.createElement("small");
    small.textContent = item.blurb;
    btn.appendChild(small);
    if (item.id === current) btn.classList.add("active");
    btn.addEventListener("click", () => {
      pushHistory();
      onPick(item.id);
      buildChoices(container, items, item.id, onPick);
      render();
    });
    container.appendChild(btn);
  }
}

function buildPhotoTray() {
  const tray = $("#photoTray");
  tray.innerHTML = "";
  photos.forEach((p, i) => {
    const thumb = document.createElement("img");
    thumb.src = p.img.src;
    thumb.alt = p.name;
    thumb.title = p.name;
    if (state.panels[state.selected] && state.panels[state.selected].photo === i) {
      thumb.classList.add("selected");
    }
    thumb.addEventListener("click", () => {
      pushHistory();
      state.panels[state.selected].photo = i;
      applyPhotoCaption(state.selected);
      buildPhotoTray();
      syncPanelControls();
      render();
    });
    tray.appendChild(thumb);
  });
  $("#photoCount").textContent =
    photos.length + " photo" + (photos.length === 1 ? "" : "s") + " loaded · click one to put it in the selected panel";
}

function buildPanelPhotoSelect() {
  const sel = $("#panelPhoto");
  sel.innerHTML = "";
  photos.forEach((p, i) => {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = p.name + (p.sample ? " (sample)" : " (yours)");
    sel.appendChild(opt);
  });
}

function syncPanelControls() {
  const panel = state.panels[state.selected];
  buildPanelPhotoSelect();
  $("#panelPhoto").value = String(panel.photo ?? 0);
  $("#zoomInput").value = String(panel.zoom ?? 1.15);
  $("#panXInput").value = String(panel.ox ?? 0);
  $("#panYInput").value = String(panel.oy ?? 0);
  $("#panelLabel").value = panel.label || "";
  $("#panelSub").value = panel.sub || "";
}

function syncControls() {
  $("#titleInput").value = state.title;
  $("#subtitleInput").value = state.subtitle;
  $("#tickerInput").value = state.ticker;
  $("#starsInput").value = String(state.stars);
  $("#starsLabel").textContent = "★".repeat(state.stars) + "☆".repeat(5 - state.stars);
  $("#badgeSelect").value = state.badge;
  document.querySelectorAll(".size-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.size === state.size);
  });
  buildChoices($("#layoutGrid"), LAYOUTS, state.layout, (id) => { state.layout = id; });
  buildChoices($("#gradeGrid"), GRADES, state.grade, (id) => { state.grade = id; });
  buildPhotoTray();
  syncPanelControls();
}

function bindControls() {
  $("#titleInput").addEventListener("input", (e) => { state.title = e.target.value; render(); });
  $("#titleInput").addEventListener("change", pushHistory);
  $("#subtitleInput").addEventListener("input", (e) => { state.subtitle = e.target.value; render(); });
  $("#subtitleInput").addEventListener("change", pushHistory);
  $("#tickerInput").addEventListener("input", (e) => { state.ticker = e.target.value; render(); });
  $("#tickerInput").addEventListener("change", pushHistory);
  $("#starsInput").addEventListener("input", (e) => {
    state.stars = Number(e.target.value);
    $("#starsLabel").textContent = "★".repeat(state.stars) + "☆".repeat(5 - state.stars);
    render();
  });
  $("#starsInput").addEventListener("change", pushHistory);
  $("#badgeSelect").addEventListener("change", (e) => {
    pushHistory();
    state.badge = e.target.value;
    render();
  });
  document.querySelectorAll(".size-btn").forEach((b) => {
    b.addEventListener("click", () => {
      pushHistory();
      state.size = b.dataset.size;
      document.querySelectorAll(".size-btn").forEach((x) => x.classList.toggle("active", x === b));
      render();
    });
  });
  $("#panelPhoto").addEventListener("change", (e) => {
    pushHistory();
    state.panels[state.selected].photo = Number(e.target.value);
    applyPhotoCaption(state.selected);
    syncPanelControls();
    buildPhotoTray();
    render();
  });
  $("#zoomInput").addEventListener("input", (e) => {
    state.panels[state.selected].zoom = Number(e.target.value);
    render();
  });
  $("#zoomInput").addEventListener("change", pushHistory);
  $("#panXInput").addEventListener("input", (e) => {
    state.panels[state.selected].ox = Number(e.target.value);
    render();
  });
  $("#panXInput").addEventListener("change", pushHistory);
  $("#panYInput").addEventListener("input", (e) => {
    state.panels[state.selected].oy = Number(e.target.value);
    render();
  });
  $("#panYInput").addEventListener("change", pushHistory);
  $("#panelLabel").addEventListener("input", (e) => {
    state.panels[state.selected].label = e.target.value.toUpperCase();
    render();
  });
  $("#panelLabel").addEventListener("change", pushHistory);
  $("#panelSub").addEventListener("input", (e) => {
    state.panels[state.selected].sub = e.target.value.toUpperCase();
    render();
  });
  $("#panelSub").addEventListener("change", pushHistory);

  $("#undoBtn").addEventListener("click", undo);
  $("#redoBtn").addEventListener("click", redo);
  $("#surpriseBtn").addEventListener("click", surpriseMe);
  $("#exportBtn").addEventListener("click", exportPNG);

  $("#fileInput").addEventListener("change", async (e) => {
    const files = [...e.target.files];
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
      try {
        const img = await loadImage(dataUrl);
        pushHistory();
        photos.push({ id: "user-" + photos.length, name: file.name.replace(/\.[^.]+$/, ""), img, sample: false });
        state.panels[state.selected].photo = photos.length - 1;
        applyPhotoCaption(state.selected);
      } catch {
        // Skip unreadable files; the rest still load.
      }
    }
    buildPhotoTray();
    syncPanelControls();
    render();
    e.target.value = "";
  });
}

function surpriseMe() {
  pushHistory();
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  state.layout = pick(LAYOUTS).id;
  state.grade = pick(GRADES).id;
  const order = [...photos.keys()];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  state.panels.forEach((panel, i) => {
    panel.photo = order[i % order.length] ?? 0;
    const caption = labelsForPhoto(panel.photo, photos[panel.photo]?.sample);
    panel.label = caption.label;
    panel.sub = caption.sub;
    panel.zoom = 1.05 + Math.random() * 0.5;
    panel.ox = (Math.random() - 0.5) * 0.3;
    panel.oy = (Math.random() - 0.5) * 0.3;
  });
  syncControls();
  render();
}

function exportPNG() {
  const size = SIZES[state.size] || SIZES["1920x1080"];
  const canvas = renderCoverToCanvas(size.w, size.h, state, photos.map((p) => p.img));
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const slug = state.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "cover";
    a.href = url;
    a.download = `coast-heat-${slug}-${state.size}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }, "image/png");
}

// ---- panel picking + drag-to-pan --------------------------------------------
function coverPoint(event) {
  const rect = preview.getBoundingClientRect();
  const size = SIZES[state.size] || SIZES["1920x1080"];
  return {
    x: ((event.clientX - rect.left) / rect.width) * size.w,
    y: ((event.clientY - rect.top) / rect.height) * size.h,
    w: size.w,
    h: size.h,
  };
}

function panelAt(point) {
  const rects = layoutPanelRects(point.w, point.h, state.layout);
  for (let i = rects.length - 1; i >= 0; i--) {
    const r = rects[i];
    if (!r) continue;
    if (point.x >= r.x && point.x <= r.x + r.w && point.y >= r.y && point.y <= r.y + r.h) return i;
  }
  return -1;
}

function bindCanvas() {
  let dragging = false;
  let last = null;
  let moved = false;
  let dragStart = null;
  preview.addEventListener("pointerdown", (e) => {
    const point = coverPoint(e);
    const hit = panelAt(point);
    if (hit < 0) return;
    state.selected = hit;
    syncPanelControls();
    buildPhotoTray();
    render();
    dragging = true;
    moved = false;
    dragStart = snapshot();
    last = point;
    preview.setPointerCapture(e.pointerId);
  });
  preview.addEventListener("pointermove", (e) => {
    if (!dragging || !last) return;
    const point = coverPoint(e);
    const panel = state.panels[state.selected];
    const rects = layoutPanelRects(point.w, point.h, state.layout);
    const rect = rects[state.selected];
    if (!rect) return;
    panel.ox = Math.max(-0.5, Math.min(0.5, panel.ox + (point.x - last.x) / rect.w));
    panel.oy = Math.max(-0.5, Math.min(0.5, panel.oy + (point.y - last.y) / rect.h));
    if (Math.abs(point.x - last.x) + Math.abs(point.y - last.y) > 2) moved = true;
    last = point;
    render();
  });
  preview.addEventListener("pointerup", () => {
    if (dragging && moved && dragStart !== null) {
      history.push(dragStart);
      if (history.length > 60) history.shift();
      future = [];
    }
    dragging = false;
    last = null;
    dragStart = null;
    syncPanelControls();
  });
}

// ---- boot --------------------------------------------------------------------
async function boot() {
  if (shot === "cover") {
    document.body.classList.add("shot");
    document.title = "Coast Heat — cover";
    await loadFonts();
    await loadSamples();
    renderShot();
    return;
  }
  if (shot === "editor") {
    state.layout = params.get("layout") || "grid";
    state.grade = params.get("grade") || "vice";
    state.title = params.get("title") || "COAST HEAT";
    state.subtitle = params.get("subtitle") || "Chasing the last light";
  }
  await loadFonts();
  await loadSamples();
  bindControls();
  bindCanvas();
  syncControls();
  render();
}

boot();
