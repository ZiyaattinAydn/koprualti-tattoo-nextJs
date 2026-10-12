/* Typed adaptation of the original v50 studio doodle placement algorithm. */
type Theme = "dark" | "light" | "purple";
type Box = { x: number; y: number; w: number; h: number };
type Layer = {
  section: HTMLElement;
  layer: HTMLDivElement;
  starLayer: HTMLDivElement;
  theme: Theme;
  sectionIndex: number;
  usedFamilies?: Set<string>;
};
export function mountDoodles(path: string): () => void {
  const parts = path.split("/").filter(Boolean),
    last = parts.at(-1);
  const routes: Record<string, string> = {
    portfolio: "portfolio.html",
    artists: "artists.html",
    about: "about.html",
    ataturk: "ataturk.html",
    studios: "studios.html",
    services: "services.html",
    appointment: "appointment.html",
  };
  const page =
    last === "doktor"
      ? "artist-doktor.html"
      : last === "alsancak" || last === "karsiyaka"
        ? "sube-" + last + ".html"
        : routes[last || ""] || "index.html";
  const controller = new AbortController(),
    signal = controller.signal,
    timers = new Set<number>();
  let disposed = false,
    frame = 0,
    ro: ResizeObserver | undefined,
    io: IntersectionObserver | undefined;
  const plans: Record<string, Array<[string, Theme]>> = {
    "index.html": [
      [".hero", "dark"],
      [".manifest", "light"],
      [".work-section", "dark"],
      [".doctor-section", "dark"],
      [".tribute", "purple"],
    ],
    "portfolio.html": [
      [".pagehero", "dark"],
      [".portfolio-section", "light"],
    ],
    "artists.html": [
      [".pagehero", "dark"],
      [".doctor-spotlight", "dark"],
      [".cansin-spotlight", "dark"],
      [".su-spotlight", "dark"],
      [".birsu-spotlight", "dark"],
      [".artist-planner", "dark"],
    ],
    "artist-doktor.html": [
      [".artist-detail-hero", "dark"],
      [".artist-works-section", "dark"],
      [".artist-profile-system", "dark"],
    ],
    "about.html": [[".archive", "light"]],
    "ataturk.html": [
      [".ataturk-hero", "dark"],
      [".ataturk-story", "dark"],
      [".ataturk-editorial-section", "dark"],
      [".ataturk-stance", "dark"],
      [".ataturk-details-section", "dark"],
    ],
    "studios.html": [
      [".pagehero", "dark"],
      [".studios-page", "light"],
    ],
    "sube-alsancak.html": [
      [".branch-intro", "dark"],
      [".branch-future", "dark"],
    ],
    "sube-karsiyaka.html": [
      [".branch-intro", "dark"],
      [".branch-future", "dark"],
    ],
    "services.html": [
      [".pagehero", "dark"],
      [".service-list", "dark"],
    ],
    "appointment.html": [[".booking-stage", "purple"]],
  };
  const motifs: Record<string, string[]> = {
    botanical: [
      "botanical-rose",
      "botanical-stargazer-lily",
      "botanical-rosebud",
      "botanical-lotus",
      "botanical-blossom",
      "botanical-olive-branch",
      "botanical-tree",
      "botanical-barbed-wreath",
      "botanical-sun-moon",
      "botanical-sun",
      "botanical-crescent",
      "botanical-clover",
      "botanical-allseeing-eye",
      "botanical-heart",
      "botanical-flying-swallow",
      "botanical-paws",
    ],
    classic: [
      "classic-barbed-circle",
      "classic-double-rose",
      "classic-lily",
      "classic-moon-sun",
      "classic-swift",
      "classic-royal-crown",
      "classic-sword-heart",
      "classic-dice-pair",
    ],
    symbols: [
      "symbols-crown",
      "symbols-diamond",
      "symbols-dice",
      "symbols-skull",
      "symbols-anatomical-heart",
      "symbols-brain",
      "symbols-dagger-heart",
      "symbols-anchor",
      "symbols-astronaut",
      "symbols-sunmoon",
      "symbols-eye-emblem",
      "symbols-tree-emblem",
      "symbols-love-rose",
      "symbols-barbed-ring",
    ],
    fauna: [
      "fauna-cobra",
      "fauna-dragon",
      "fauna-scorpion",
      "fauna-wolf",
      "fauna-fox",
      "fauna-bear",
      "fauna-eagle",
      "fauna-panther",
      "fauna-koi",
      "fauna-lion-family",
      "fauna-swallow",
      "fauna-spider",
      "fauna-lion-head",
      "fauna-wings",
      "fauna-shell",
      "fauna-angel",
    ],
    signature: ["doktor", "medusa"],
    whiteOnly: ["symbols-k6", "classic-blackletter"],
  };
  const preferences: Record<string, string[]> = {
    "index.html": [
      "botanical-blossom",
      "symbols-diamond",
      "fauna-fox",
      "fauna-scorpion",
      "symbols-skull",
      "botanical-clover",
      "fauna-wings",
      "botanical-rosebud",
      "fauna-cobra",
      "fauna-eagle",
      "symbols-anchor",
      "botanical-lotus",
      "botanical-olive-branch",
      "fauna-lion-head",
      "medusa",
      "doktor",
      "fauna-dragon",
      "botanical-tree",
    ],
    "portfolio.html": [
      "fauna-panther",
      "symbols-dice",
      "fauna-swallow",
      "botanical-rose",
      "symbols-crown",
      "botanical-blossom",
      "fauna-eagle",
      "symbols-k6",
      "classic-blackletter",
    ],
    "artists.html": [
      "fauna-wolf",
      "fauna-cobra",
      "symbols-dagger-heart",
      "botanical-rosebud",
      "fauna-scorpion",
      "fauna-lion-head",
      "medusa",
      "doktor",
      "botanical-crescent",
      "symbols-anatomical-heart",
    ],
    "artist-doktor.html": [
      "doktor",
      "fauna-wings",
      "symbols-skull",
      "botanical-rose",
      "fauna-cobra",
      "medusa",
      "symbols-dice",
      "fauna-scorpion",
    ],
    "about.html": [
      "symbols-k6",
      "classic-blackletter",
      "botanical-rose",
      "botanical-olive-branch",
      "fauna-swallow",
      "symbols-anchor",
      "botanical-sun-moon",
      "symbols-diamond",
      "botanical-tree",
    ],
    "ataturk.html": [
      "botanical-olive-branch",
      "botanical-rose",
      "fauna-swallow",
      "botanical-crescent",
      "botanical-lotus",
      "fauna-angel",
      "botanical-blossom",
      "symbols-anchor",
    ],
    "studios.html": [
      "fauna-wings",
      "botanical-rose",
      "symbols-diamond",
      "botanical-crescent",
      "fauna-eagle",
      "botanical-olive-branch",
      "symbols-k6",
    ],
    "sube-alsancak.html": [
      "symbols-k6",
      "botanical-rose",
      "fauna-swallow",
      "botanical-olive-branch",
    ],
    "sube-karsiyaka.html": [
      "fauna-wings",
      "symbols-diamond",
      "botanical-crescent",
      "fauna-eagle",
    ],
    "services.html": [
      "symbols-anatomical-heart",
      "fauna-cobra",
      "botanical-rosebud",
      "symbols-dagger-heart",
      "fauna-swallow",
      "symbols-anchor",
      "fauna-scorpion",
    ],
    "appointment.html": [
      "botanical-rose",
      "fauna-swallow",
      "symbols-anchor",
      "botanical-heart",
      "symbols-crown",
      "botanical-olive-branch",
      "symbols-diamond",
    ],
  };
  const ALL = [
    ...motifs.botanical,
    ...motifs.classic,
    ...motifs.symbols,
    ...motifs.fauna,
    ...motifs.signature,
  ];
  const RATIO: Record<string, number> = {
    "botanical-rose": 0.997,
    "botanical-stargazer-lily": 1.0599,
    "botanical-rosebud": 1.1617,
    "botanical-lotus": 1.0586,
    "botanical-blossom": 1.0327,
    "botanical-olive-branch": 1.218,
    "botanical-tree": 1.0982,
    "botanical-barbed-wreath": 1.0594,
    "botanical-sun-moon": 1.0136,
    "botanical-sun": 0.9796,
    "botanical-crescent": 1.0442,
    "botanical-clover": 1.1538,
    "botanical-allseeing-eye": 1.1182,
    "botanical-heart": 1.5467,
    "botanical-flying-swallow": 0.9713,
    "botanical-paws": 0.9365,
    "classic-blackletter": 0.8049,
    "classic-barbed-circle": 0.9914,
    "classic-double-rose": 1.3849,
    "classic-lily": 1.2344,
    "classic-moon-sun": 1.0829,
    "classic-swift": 1.1931,
    "classic-royal-crown": 1.0956,
    "classic-sword-heart": 1.4153,
    "classic-dice-pair": 1.0464,
    "symbols-k6": 0.9272,
    "symbols-crown": 1.0,
    "symbols-diamond": 1.2448,
    "symbols-dice": 1.0294,
    "symbols-skull": 1.28,
    "symbols-anatomical-heart": 1.3333,
    "symbols-brain": 1.1548,
    "symbols-dagger-heart": 1.3169,
    "symbols-anchor": 1.4798,
    "symbols-astronaut": 1.0483,
    "symbols-sunmoon": 1.0029,
    "fauna-cobra": 1.1953,
    "fauna-dragon": 1.2803,
    "fauna-scorpion": 1.1581,
    "fauna-wolf": 1.2046,
    "fauna-fox": 1.0839,
    "fauna-bear": 0.9564,
    "fauna-eagle": 1.0395,
    "fauna-panther": 0.9294,
    "fauna-koi": 1.2115,
    "fauna-lion-family": 1.0329,
    "fauna-swallow": 1.0984,
    "fauna-spider": 1.3347,
    "fauna-lion-head": 1.0317,
    "fauna-wings": 0.7277,
    "fauna-shell": 1.0897,
    "fauna-angel": 0.9243,
    doktor: 1.2433,
    medusa: 1.1327,
    "symbols-eye-emblem": 1.3376,
    "symbols-tree-emblem": 1.2528,
    "symbols-love-rose": 0.9963,
    "symbols-barbed-ring": 0.9963,
  };
  const panels =
    ".form,.booking-form,.booking-panel,.preview-form,.pcard,.work-card,.artist-card,.artist-media,.doctor-card,.service-visual,.studio-map-card,.studio-card,.branch-card,.branch-intro-photo,.archive-note,.archive-card,.tribute-sign,.ataturk-counter,.ataturk-portrait-stage,.artist-work-card,.portrait,.booking-step,.service-detail,.booking-shell,.appointment-shell,.moodgrid,.filterbar,.artist-work-mosaic";
  const blockersSel =
    "h1,h2,h3,h4,h5,h6,p,blockquote,li,a,button,input,select,textarea,label,figure,img,video,table,.eyebrow,.kick,.crumb,.hero-note,.doctor-lead,.doctor-copy,.manifest-copy,.timeline,.archive-head,.doctor-stats,.artist-info,.artist-work-card," +
    panels;
  const layers: Layer[] = [];
  const used = new Map<string, number>();
  let scheduled = false;
  const STAR_SHAPES = [
    "spark-plus",
    "spark-burst",
    "spark-diamond",
    "spark-asterisk",
  ];
  const STAR_COLORS: Record<Theme, string[]> = {
    dark: ["#dec8ec", "#9bb8ff", "#f3cf66", "#dcb6ff"],
    light: ["#7d5ca6", "#6f87e4", "#d0a12b", "#6b6772"],
    purple: ["#dcb8e7", "#a9bfff", "#f2cf6f", "#c99fe1"],
  };
  function family(s: string) {
    if (/swallow|swift/.test(s)) return "swallow";
    if (/sun.?moon|moon.?sun/.test(s)) return "sunmoon";
    if (/rose|blossom/.test(s)) return "rose";
    if (/wings|angel/.test(s)) return "winged";
    if (/crown/.test(s)) return "crown";
    if (/dice/.test(s)) return "dice";
    if (/skull/.test(s)) return "skull";
    if (/heart/.test(s)) return "heart";
    if (/cobra|dragon|snake/.test(s)) return "snake";
    return s;
  }
  const boxIntersect = (a: Box, b: Box, p = 0) =>
    a.x < b.x + b.w + p &&
    a.x + a.w + p > b.x &&
    a.y < b.y + b.h + p &&
    a.y + a.h + p > b.y;
  const distance = (a: Box, b: Box) =>
    Math.hypot(
      a.x + a.w / 2 - (b.x + b.w / 2),
      a.y + a.h / 2 - (b.y + b.h / 2),
    );
  function protectedAreas(section: HTMLElement): Box[] {
    const sr = section.getBoundingClientRect(),
      out: Box[] = [];
    for (const el of section.querySelectorAll(blockersSel)) {
      if (
        el.closest(".doodle-v50-layer,.doodle-v51-star-layer") ||
        el.closest("header,footer")
      )
        continue;
      const cs = getComputedStyle(el);
      if (
        cs.display === "none" ||
        cs.visibility === "hidden" ||
        parseFloat(cs.opacity) < 0.02
      )
        continue;
      if (el.matches(".service-trigger")) {
        for (const child of el.children) {
          const cr = child.getBoundingClientRect();
          if (cr.width > 3 && cr.height > 3)
            out.push({
              x: cr.left - sr.left,
              y: cr.top - sr.top,
              w: cr.width,
              h: cr.height,
            });
        }
        continue;
      }
      const r = el.getBoundingClientRect();
      if (r.width < 7 || r.height < 7 || r.bottom < sr.top || r.top > sr.bottom)
        continue;
      if (
        r.width * r.height > sr.width * sr.height * 0.75 &&
        !el.matches("img,video,table," + panels)
      )
        continue;
      out.push({
        x: r.left - sr.left,
        y: r.top - sr.top,
        w: r.width,
        h: r.height,
      });
    }
    return out;
  }
  function halton(n: number, b: number) {
    let res = 0,
      unit = 1 / b;
    while (n) {
      res += (n % b) * unit;
      n = Math.floor(n / b);
      unit /= b;
    }
    return res;
  }
  function hash(str: string) {
    let h = 2166136261;
    for (const ch of str) {
      h ^= ch.charCodeAt(0);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function renderStars(
    entry: Layer,
    reserved: Box[],
    majorRects: Box[],
    seed: number,
  ) {
    const { section, starLayer, theme, sectionIndex } = entry;
    const sw = section.clientWidth,
      sh = section.clientHeight;
    starLayer.replaceChildren();
    if (sw < 240 || sh < 110) return;
    const mobile = innerWidth < 760,
      tablet = innerWidth >= 760 && innerWidth < 1100;
    const baseDensity = (sw * sh) / (mobile ? 78000 : tablet ? 56000 : 43000);
    const goal = Math.min(
      mobile ? 5 : tablet ? 12 : 26,
      Math.max(mobile ? 2 : tablet ? 4 : 6, Math.round(baseDensity)),
    );
    const placed: Box[] = [];
    const neighborhood: Array<{ rect: Box; shape: string; color: string }> = [];
    const colors = STAR_COLORS[theme] || STAR_COLORS.dark;
    let count = 0;
    for (let attempt = 1; attempt <= goal * 180 && count < goal; attempt++) {
      const shape =
        STAR_SHAPES[
          (attempt * 5 + sectionIndex * 3 + seed) % STAR_SHAPES.length
        ];
      const size = mobile
        ? 10 + ((attempt + seed) % 8)
        : tablet
          ? 11 + ((attempt * 3 + seed) % 11)
          : 12 + ((attempt * 5 + seed) % 13);
      const x =
        8 + halton(attempt + 19 + (seed % 97), 5) * Math.max(1, sw - size - 16);
      const y =
        8 +
        halton(attempt + 37 + (seed % 131), 7) * Math.max(1, sh - size - 16);
      const rect = { x, y, w: size, h: size };
      if (reserved.some((r) => boxIntersect(rect, r, mobile ? 5 : 8))) continue;
      if (majorRects.some((r) => boxIntersect(rect, r, mobile ? 6 : 9)))
        continue;
      if (placed.some((r) => boxIntersect(rect, r, mobile ? 14 : 18))) continue;
      const color = colors[(attempt + count + sectionIndex) % colors.length];
      const local = neighborhood.filter(
        (n) => distance(rect, n.rect) < (mobile ? 68 : 86),
      );
      if (local.some((n) => n.shape === shape)) continue;
      if (local.filter((n) => n.color === color).length > 1) continue;
      const spark = document.createElement("span");
      spark.className = "doodle-v50-sparkle";
      spark.dataset.shape = shape;
      spark.setAttribute("aria-hidden", "true");
      spark.style.cssText = `--sx:${x.toFixed(1)}px;--sy:${y.toFixed(1)}px;--ss:${size}px;--so:${(theme === "light" ? 0.52 : theme === "purple" ? 0.44 : 0.48) + (attempt % 3) * 0.05};--sr:${((seed + attempt * 29) % 24) - 12}deg;--st:${7 + ((attempt + seed) % 6)}s;--sd:-${(attempt * 7 + seed) % 15}s;--sc:${color}`;
      starLayer.append(spark);
      placed.push(rect);
      neighborhood.push({ rect, shape, color });
      count++;
    }
    section.dataset.starDoodleCount = String(count);
  }
  function render(entry: Layer) {
    const { section, layer, theme, sectionIndex } = entry;
    const sw = section.clientWidth,
      sh = section.clientHeight;
    layer.replaceChildren();
    if (sw < 260 || sh < 140) {
      entry.starLayer.replaceChildren();
      return;
    }
    const mobile = innerWidth < 760,
      tablet = innerWidth >= 760 && innerWidth < 1100;
    const density = (sw * sh) / (mobile ? 130000 : tablet ? 128000 : 91000);
    const goal = Math.min(
      mobile ? 4 : tablet ? 7 : 16,
      Math.max(mobile ? 2 : tablet ? 2 : 3, Math.round(density)),
    );
    const reserved = protectedAreas(section);
    const collisions: Box[] = [];
    const nowFamilies = new Set<string>();
    const lastMotifs = preferences[page] || preferences["index.html"];
    const available = [
      ...new Set([
        ...lastMotifs,
        ...ALL,
        ...(theme === "light" ? motifs.whiteOnly : []),
      ]),
    ].filter((name) => theme === "light" || !motifs.whiteOnly.includes(name));
    const seed = hash(page + "-" + sectionIndex);
    available.sort(
      (a, b) => (hash(a + seed) % 2147483647) - (hash(b + seed) % 2147483647),
    );
    const front = lastMotifs.filter((n) => available.includes(n));
    const rotateBy = front.length ? sectionIndex % front.length : 0;
    const choice = [
      ...new Set([
        ...front.slice(rotateBy),
        ...front.slice(0, rotateBy),
        ...available,
      ]),
    ];
    let count = 0;
    for (let attempt = 1; attempt <= goal * 140 && count < goal; attempt++) {
      const name =
        theme === "light" && count === 0 && attempt <= 30
          ? "symbols-k6"
          : choice[
              (attempt * 13 + count * 7 + sectionIndex * 11) % choice.length
            ];
      const cat = family(name);
      if (nowFamilies.has(cat)) continue;
      const previousIndex = used.get(name);
      if (
        previousIndex !== undefined &&
        Math.abs(previousIndex - sectionIndex) < 2
      )
        continue;
      const sectionWasUsed = layers.some(
        (e) =>
          e.sectionIndex < sectionIndex &&
          e.sectionIndex >= sectionIndex - 1 &&
          e.usedFamilies?.has(cat),
      );
      if (sectionWasUsed && attempt < goal * 76) continue;
      const basic = mobile
        ? 70 + (hash(name) % 29)
        : tablet
          ? 94 + (hash(name) % 56)
          : 110 + (hash(name) % 90);
      const width = Math.min(basic, sw * (mobile ? 0.3 : 0.18));
      const ratio = RATIO[name] || 1;
      const height = width * ratio;
      if (height > sh * 0.54 || width > sw * 0.42) continue;
      const x =
        12 +
        halton(attempt + 17 + (seed % 199), 2) * Math.max(1, sw - width - 24);
      const y =
        14 +
        halton(attempt + 31 + (seed % 151), 3) * Math.max(1, sh - height - 28);
      const rect = { x, y, w: width, h: height };
      const gap = mobile ? 15 : tablet ? 22 : 29;
      if (reserved.some((r) => boxIntersect(rect, r, gap))) continue;
      if (collisions.some((r) => boxIntersect(rect, r, 45))) continue;
      const img = document.createElement("img");
      img.className = "doodle-v50-mark";
      img.src = `/assets/doodles/${name}-${theme === "light" ? "ink" : "chalk"}.webp`;
      img.alt = "";
      img.draggable = false;
      img.decoding = "async";
      img.loading = "lazy";
      img.dataset.asset = name;
      img.setAttribute("aria-hidden", "true");
      img.width = Math.round(width);
      img.height = Math.round(height);
      img.style.cssText = `--dx:${x.toFixed(1)}px;--dy:${y.toFixed(1)}px;--dw:${width}px;--do:${(theme === "light" ? 0.23 : theme === "purple" ? 0.14 : 0.19) + (attempt % 4) * 0.013};--dr:${(hash(name + page) % 25) - 12}deg;--dt:${19 + (hash(name) % 13)}s;--dd:-${(seed + attempt) % 22}s`;
      layer.append(img);
      collisions.push(rect);
      nowFamilies.add(cat);
      used.set(name, sectionIndex);
      count++;
    }
    entry.usedFamilies = nowFamilies;
    section.dataset.cleanDoodleCount = String(count);
    renderStars(entry, reserved, collisions, seed);
  }
  function updateAll() {
    frame = 0;
    scheduled = false;
    if (disposed || document.hidden) return;
    used.clear();
    layers.forEach((e) => render(e));
  }
  function schedule() {
    if (disposed || scheduled || document.hidden) return;
    scheduled = true;
    frame = requestAnimationFrame(updateAll);
  }
  function init() {
    let sectionIndex = 0;
    for (const [sel, theme] of plans[page] || []) {
      const section = document.querySelector<HTMLElement>("main " + sel);
      if (!section) continue;
      section.classList.add("doodle-v50-surface");
      const layer = document.createElement("div");
      layer.className = "doodle-v50-layer";
      layer.dataset.theme = theme;
      layer.setAttribute("aria-hidden", "true");
      const starLayer = document.createElement("div");
      starLayer.className = "doodle-v51-star-layer";
      starLayer.dataset.theme = theme;
      starLayer.setAttribute("aria-hidden", "true");
      section.insertBefore(layer, section.firstChild);
      section.insertBefore(starLayer, layer.nextSibling);
      layers.push({
        section,
        layer,
        starLayer,
        theme,
        sectionIndex: sectionIndex++,
      });
    }
    if (!layers.length) return;
    schedule();
    window.addEventListener("resize", schedule, { passive: true, signal });
    window.addEventListener("load", schedule, { once: true, signal });
    document.addEventListener(
      "visibilitychange",
      () => {
        document.documentElement.classList.toggle(
          "k6-page-hidden",
          document.hidden,
        );
        if (document.hidden) {
          cancelAnimationFrame(frame);
          frame = 0;
          scheduled = false;
        } else schedule();
      },
      { signal },
    );
    document.fonts?.ready.then(() => {
      if (!disposed) schedule();
    });
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(schedule);
      layers.forEach((l) => ro?.observe(l.section));
    }
    document.addEventListener(
      "click",
      (ev) => {
        if (
          (ev.target as Element)?.closest(
            ".service-trigger,.service-row,.service-detail",
          )
        ) {
          const timer = window.setTimeout(schedule, 350);
          timers.add(timer);
        }
      },
      { signal },
    );
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries)
            e.target.classList.toggle("is-visible", e.isIntersecting);
        },
        { rootMargin: "150px 0px" },
      );
      layers.forEach((e) => {
        io?.observe(e.layer);
        io?.observe(e.starLayer);
      });
    } else
      layers.forEach((e) => {
        e.layer.classList.add("is-visible");
        e.starLayer.classList.add("is-visible");
      });
  }

  init();
  return () => {
    disposed = true;
    controller.abort();
    ro?.disconnect();
    io?.disconnect();
    if (frame) cancelAnimationFrame(frame);
    timers.forEach((timer) => clearTimeout(timer));
    layers.forEach(({ section, layer, starLayer }) => {
      layer.remove();
      starLayer.remove();
      section.classList.remove("doodle-v50-surface");
      delete section.dataset.starDoodleCount;
      delete section.dataset.cleanDoodleCount;
    });
    document.documentElement.classList.remove("k6-page-hidden");
  };
}
