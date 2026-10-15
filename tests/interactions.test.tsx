import { strict as assert } from "node:assert";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { JSDOM } from "jsdom";
import { register } from "node:module";
register("./css-module-loader.mjs", import.meta.url);

async function run() {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "https://example.test/portfolio/",
    pretendToBeVisual: true,
  });
  Object.assign(globalThis, {
    window: dom.window,
    self: dom.window,
    document: dom.window.document,
    location: dom.window.location,
    history: dom.window.history,
    Element: dom.window.Element,
    HTMLElement: dom.window.HTMLElement,
    HTMLAnchorElement: dom.window.HTMLAnchorElement,
    MouseEvent: dom.window.MouseEvent,
    KeyboardEvent: dom.window.KeyboardEvent,
    AbortController: dom.window.AbortController,
  });
  globalThis.matchMedia = () =>
    ({
      matches: true,
      addEventListener() {},
      removeEventListener() {},
    }) as unknown as MediaQueryList;
  dom.window.scrollTo = () => {};
  dom.window.matchMedia = globalThis.matchMedia;
  globalThis.requestAnimationFrame = (callback) =>
    setTimeout(() => callback(Date.now()), 0) as unknown as number;
  globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
  const React = await import("react");
  const { render, fireEvent, within, act } =
    await import("@testing-library/react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { PortfolioPage } = await import("../src/components/PortfolioPage");
  const { ImageLightbox } = await import("../src/components/ImageLightbox");
  const { AppointmentPage } = await import("../src/components/AppointmentPage");
  const { ServicesPage } = await import("../src/components/ServicesPage");
  const { StudiosPage } = await import("../src/components/StudiosPage");
  const { StudioIntro } = await import("../src/components/StudioIntro");
  const { studios } = await import("../src/data/studios");
  const { mountDoodles } = await import("../src/lib/doodles");
  const portfolio = render(
    <>
      <PortfolioPage />
      <ImageLightbox />
    </>,
  );
  const cards = () =>
    portfolio.container.querySelectorAll(".portfolio-card").length;
  const click = (label: string) =>
    fireEvent.click(
      within(portfolio.container).getByRole("button", { name: label }),
    );
  assert.equal(cards(), 6);
  click("Tattoo");
  assert.equal(cards(), 0);
  click("Piercing");
  assert.equal(cards(), 0);
  click("Tattoo");
  assert.equal(cards(), 0);
  click("Piercing");
  assert.equal(cards(), 6);
  const artist = within(portfolio.container).getByLabelText("02 / Sanatçı");
  fireEvent.change(artist, { target: { value: "doktor" } });
  assert.equal(cards(), 0);
  assert.ok(
    within(portfolio.container).getByText("Bu seçimde henüz görsel yok."),
  );
  click("Filtreleri sıfırla");
  assert.equal(cards(), 6);
  assert.equal((artist as HTMLSelectElement).value, "all");
  click("Cover-Up");
  assert.equal(cards(), 0);
  click("Bütün Tasarımlar");
  assert.equal(cards(), 6);
  const trigger = portfolio.container.querySelector(
    ".portfolio-card",
  ) as HTMLButtonElement;
  trigger.focus();
  fireEvent.click(trigger);
  assert.ok(within(portfolio.container).getByRole("dialog"));
  assert.equal(
    document.activeElement?.getAttribute("aria-label"),
    "Görseli kapat",
  );
  fireEvent.keyDown(document, { key: "Escape" });
  assert.equal(portfolio.container.querySelector('[role="dialog"]'), null);
  assert.equal(document.activeElement, trigger);
  fireEvent.click(trigger);
  fireEvent.mouseDown(within(portfolio.container).getByRole("dialog"));
  assert.equal(portfolio.container.querySelector('[role="dialog"]'), null);
  portfolio.unmount();

  dom.window.history.replaceState(
    null,
    "",
    "/appointment/?service=coverup&branch=KarşıyaKa",
  );
  const appointment = render(<AppointmentPage />);
  assert.ok(
    appointment.container
      .querySelector(".appointment-s3-service-choice.active")
      ?.textContent?.includes("Cover-Up"),
  );
  fireEvent.click(
    within(appointment.container).getByRole("button", { name: /^01 Tattoo/ }),
  );
  assert.equal(
    appointment.container.querySelectorAll(
      ".appointment-s3-service-choice.active",
    ).length,
    2,
  );
  assert.equal(
    appointment.container.querySelector<HTMLSelectElement>(
      'select[name="branch"]',
    )?.value,
    "Karşıyaka",
  );
  fireEvent.click(
    within(appointment.container).getByRole("button", { name: /Devam et/ }),
  );
  assert.ok(
    appointment.container
      .querySelectorAll(".formpage")[1]
      .classList.contains("active"),
  );
  fireEvent.click(
    within(appointment.container).getByRole("button", { name: /Devam et/ }),
  );
  assert.ok(
    appointment.container
      .querySelectorAll(".formpage")[2]
      .classList.contains("active"),
  );
  fireEvent.click(
    within(appointment.container).getByRole("button", { name: /Geri/ }),
  );
  assert.ok(
    appointment.container
      .querySelectorAll(".formpage")[1]
      .classList.contains("active"),
  );
  assert.equal(
    fireEvent.submit(appointment.container.querySelector("form.form")!),
    false,
  );
  appointment.unmount();

  dom.window.history.replaceState(null, "", "/services/#piercing");
  const servicePage = render(<ServicesPage />);
  assert.equal(
    servicePage.container
      .querySelector("#piercing .service-trigger")
      ?.getAttribute("aria-expanded"),
    "true",
  );
  fireEvent.click(
    within(servicePage.container).getByRole("button", { name: /Cover Up/ }),
  );
  assert.ok(
    servicePage.container.querySelector("#coverup")?.classList.contains("open"),
  );
  assert.equal(
    servicePage.container
      .querySelector("#piercing .service-trigger")
      ?.getAttribute("aria-expanded"),
    "false",
  );
  servicePage.unmount();

  // Slug queries and legacy display-name queries preselect the same branch.
  for (const studio of studios) {
    dom.window.history.replaceState(
      null,
      "",
      `/appointment?branch=${studio.slug}`,
    );
    const form = render(<AppointmentPage />);
    assert.equal(
      form.container.querySelector<HTMLSelectElement>('select[name="branch"]')
        ?.value,
      studio.name,
    );
    form.unmount();
  }
  const { BranchDiscovery, discoveryKey } =
    await import("../src/components/BranchDiscovery");
  // An unvisited reduced-motion location is recorded without an intro.
  const reducedIntro = render(
    <BranchDiscovery slug="karsiyaka" name="Karşıyaka" number="02" />,
  );
  assert.equal(
    reducedIntro.container.querySelector("[data-branch-discovery]"),
    null,
  );
  assert.equal(dom.window.localStorage.getItem(discoveryKey("karsiyaka")), "1");
  reducedIntro.unmount();
  dom.window.matchMedia = () => ({ matches: false }) as MediaQueryList;
  const firstIntro = render(
    <React.StrictMode>
      <BranchDiscovery slug="alsancak" name="Alsancak" number="01" />
    </React.StrictMode>,
  );
  assert.ok(
    firstIntro.container.querySelector('[data-branch-discovery="alsancak"]'),
  );
  assert.equal(dom.window.localStorage.getItem(discoveryKey("alsancak")), "1");
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 910));
  });
  assert.equal(
    firstIntro.container.querySelector("[data-branch-discovery]"),
    null,
    "intro ends within one second",
  );
  firstIntro.unmount();
  const revisit = render(
    <BranchDiscovery slug="alsancak" name="Alsancak" number="01" />,
  );
  assert.equal(
    revisit.container.querySelector("[data-branch-discovery]"),
    null,
    "no repeated intro",
  );
  revisit.unmount();
  // Storage denial must never crash the arrival view.
  const storageDescriptor = Object.getOwnPropertyDescriptor(
    dom.window,
    "localStorage",
  )!;
  Object.defineProperty(dom.window, "localStorage", {
    configurable: true,
    get() {
      throw new Error("storage denied");
    },
  });
  const deniedStorage = render(
    <BranchDiscovery slug="alsancak" name="Alsancak" number="01" />,
  );
  assert.equal(
    deniedStorage.container.querySelector("[data-branch-discovery]"),
    null,
  );
  deniedStorage.unmount();
  Object.defineProperty(dom.window, "localStorage", storageDescriptor);
  dom.window.matchMedia = globalThis.matchMedia;

  dom.window.history.replaceState(null, "", "/studios/");
  const list = render(<StudiosPage />);
  assert.equal(list.container.querySelectorAll("[data-location]").length, 2);
  studios.forEach((studio) => {
    assert.equal(
      list.container
        .querySelector(`[data-location="${studio.slug}"]`)
        ?.getAttribute("href"),
      `/studios/${studio.slug}`,
    );
    assert.equal(
      list.container
        .querySelector(`[data-location="${studio.slug}"] img`)
        ?.getAttribute("src"),
      studio.hero.src,
    );
  });
  const cleanup = mountDoodles("/studios/");
  assert.ok(list.container.querySelector("[data-branch-doodles]"));
  assert.equal(
    list.container.querySelector(".doodle-v50-layer"),
    null,
    "no duplicate measured atmosphere",
  );
  cleanup();
  list.unmount();
  for (const studio of studios) {
    const detail = render(<StudioIntro studio={studio} />);
    assert.equal(
      detail.container
        .querySelector("[data-studio]")
        ?.getAttribute("data-studio"),
      studio.slug,
    );
    assert.equal(
      detail.container.querySelector("#booking a")?.getAttribute("href"),
      `/appointment?branch=${studio.slug}`,
    );
    assert.equal(detail.container.querySelectorAll("[data-chapter]").length, 5);
    assert.equal(
      detail.container.querySelectorAll("[data-branch-doodles]").length,
      5,
    );
    assert.equal(
      detail.container.querySelector('nav[aria-label$="keşif bölümleri"]'),
      null,
    );
    dom.window.history.replaceState(null, "", `/studios/${studio.slug}/`);
    const historyLength = dom.window.history.length;
    assert.equal(
      fireEvent.click(detail.container.querySelector('a[href="#explore"]')!),
      false,
    );
    assert.equal(dom.window.history.length, historyLength);
    assert.equal(
      dom.window.location.hash,
      "",
      "chapter navigation does not pollute Back history",
    );
    for (const artist of studio.artists) {
      assert.ok(
        detail.container.querySelector(
          `#artists a[href="${artist.href.replace(/\/(?=#|$)/, "")}"]`,
        ),
      );
    }
    for (const id of [
      "explore",
      "artists",
      "archive",
      "story",
      "location",
      "booking",
    ]) {
      assert.ok(detail.container.querySelector(`#${id}`));
    }
    assert.equal(
      detail.container.querySelector("#location a")?.getAttribute("href"),
      studio.mapUrl,
    );
    assert.equal(
      dom.window.localStorage.getItem(`koprualti:discovered:v1:${studio.slug}`),
      "1",
    );
    assert.equal(
      detail.container.querySelector("[data-branch-discovery]"),
      null,
      "reduced motion skips discovery",
    );
    detail.unmount();
  }
  const { TattooCursorCanvas } =
    await import("../src/components/TattooCursorCanvas");
  let strokes = 0;
  Object.defineProperty(dom.window.HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    value: () => ({
      setTransform() {},
      clearRect() {},
      beginPath() {},
      moveTo() {},
      lineTo() {},
      stroke() {
        strokes++;
      },
      lineCap: "round",
      lineJoin: "round",
      strokeStyle: "",
      lineWidth: 1,
    }),
  });
  globalThis.matchMedia = () =>
    ({ matches: dom.window.innerWidth > 760 }) as MediaQueryList;
  Object.defineProperty(dom.window, "innerWidth", {
    configurable: true,
    value: 390,
  });
  let cursor = render(
    <section data-tattoo-zone>
      <TattooCursorCanvas />
    </section>,
  );
  assert.ok(
    !cursor.container
      .querySelector("[data-tattoo-zone]")
      ?.classList.contains("tattoo-cursor-ready"),
  );
  cursor.unmount();
  Object.defineProperty(dom.window, "innerWidth", {
    configurable: true,
    value: 1024,
  });
  cursor = render(
    <section data-tattoo-zone>
      <TattooCursorCanvas />
    </section>,
  );
  const hero =
    cursor.container.querySelector<HTMLElement>("[data-tattoo-zone]")!;
  hero.getBoundingClientRect = () => ({
    left: 0,
    top: 0,
    width: 600,
    height: 400,
    right: 600,
    bottom: 400,
    x: 0,
    y: 0,
    toJSON() {},
  });
  Object.defineProperties(hero, {
    clientWidth: { value: 600 },
    clientHeight: { value: 400 },
  });
  assert.ok(hero.classList.contains("tattoo-cursor-ready"));
  const pointer = (kind: string, x: number, y: number) => {
    const e = new dom.window.Event(kind, { bubbles: true });
    Object.defineProperties(e, {
      pointerType: { value: "mouse" },
      button: { value: 0 },
      clientX: { value: x },
      clientY: { value: y },
    });
    hero.dispatchEvent(e);
  };
  pointer("pointermove", 30, 40);
  pointer("pointerdown", 30, 40);
  pointer("pointermove", 50, 55);
  await new Promise((resolve) => setTimeout(resolve, 12));
  assert.ok(strokes > 0, "tattoo trail should draw on pointer movement");
  cursor.unmount();
  assert.ok(!hero.classList.contains("tattoo-cursor-ready"));

  const { HomePage } = await import("../src/components/HomePage");
  const { ArtistsPage } = await import("../src/components/ArtistsPage");
  const { DoctorPage } = await import("../src/components/DoctorPage");
  const { AboutPage } = await import("../src/components/AboutPage");
  const { AtaturkPage } = await import("../src/components/AtaturkPage");
  const pages = [
    <HomePage />,
    <ArtistsPage artists={[]} urls={{}} />,
    <DoctorPage />,
    <AboutPage />,
    <AtaturkPage />,
    <ServicesPage />,
    <AppointmentPage />,
    <StudiosPage />,
    ...studios.map((studio) => (
      <StudioIntro key={studio.slug} studio={studio} />
    )),
    <PortfolioPage />,
  ];
  for (const page of pages) {
    const html = renderToStaticMarkup(page),
      fragment = new JSDOM(html).window.document;
    for (const image of fragment.querySelectorAll("img")) {
      const src = image.getAttribute("src");
      assert.ok(src?.startsWith("/assets/"), `image src missing: ${page.type}`);
      assert.ok(
        existsSync(join(process.cwd(), "public", src!)),
        `image file missing: ${src}`,
      );
    }
    for (const item of fragment.querySelectorAll("[data-full]")) {
      const src = item.getAttribute("data-full");
      assert.ok(src?.startsWith("/assets/"), `lightbox source missing: ${src}`);
      assert.ok(
        existsSync(join(process.cwd(), "public", src!)),
        `lightbox file missing: ${src}`,
      );
    }
  }
  dom.window.close();
  console.log(
    "PASS: portfolio, modal, appointment slug/name preselection, services, branch explorer, discovery lifecycle/storage/reduced motion, cursor, doodle cleanup, images on all pages",
  );
}
run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
