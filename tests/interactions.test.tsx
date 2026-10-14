import { strict as assert } from "node:assert";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { JSDOM } from "jsdom";

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
    HTMLElement: dom.window.HTMLElement,
    HTMLAnchorElement: dom.window.HTMLAnchorElement,
    MouseEvent: dom.window.MouseEvent,
    KeyboardEvent: dom.window.KeyboardEvent,
    AbortController: dom.window.AbortController,
  });
  globalThis.matchMedia = () => ({ matches: true }) as MediaQueryList;
  dom.window.scrollTo = () => {};
  globalThis.requestAnimationFrame = (callback) =>
    setTimeout(() => callback(Date.now()), 0) as unknown as number;
  globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
  const React = await import("react");
  const { render, fireEvent, within } = await import("@testing-library/react");
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
    within(appointment.container).getByRole("button", { name: /Tattoo/ }),
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

  const list = render(<StudiosPage />);
  assert.equal(list.container.querySelectorAll(".branch-card").length, 2);
  studios.forEach((studio) => {
    assert.equal(
      list.container
        .querySelector(`.branch-card--${studio.slug} .branch-action--filled`)
        ?.getAttribute("href"),
      studio.mapUrl,
    );
    assert.equal(
      list.container
        .querySelector(`.branch-card--${studio.slug} img`)
        ?.getAttribute("src"),
      studio.photo,
    );
  });
  const cleanup = mountDoodles("/studios/");
  assert.ok(list.container.querySelector(".doodle-v50-layer"));
  cleanup();
  assert.equal(list.container.querySelector(".doodle-v50-layer"), null);
  list.unmount();
  for (const studio of studios) {
    const detail = render(<StudioIntro studio={studio} />);
    assert.equal(
      detail.container
        .querySelector(".branch-intro-photo img")
        ?.getAttribute("src"),
      studio.photo,
    );
    assert.match(
      detail.container
        .querySelector(".branch-action--outline")
        ?.getAttribute("href") || "",
      new RegExp(
        `^/appointment/?\\?branch=${encodeURIComponent(studio.name)}$`,
      ),
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
    <ArtistsPage />,
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
    "PASS: portfolio, modal, appointment, services, studios, cursor, doodle cleanup, images on all pages",
  );
}
run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
