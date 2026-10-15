import { test, expect, type Page } from "@playwright/test";
import { resolve } from "node:path";
async function login(page: Page, name = "doktor") {
  await page.goto("/artist-studio/login/");
  await page
    .getByLabel("E-posta", { exact: true })
    .fill(`${name}@fixture.invalid`);
  await page.getByLabel("Şifre", { exact: true }).fill("fixture-password");
  await page.getByRole("button", { name: "Studio’ya gir" }).click();
  await expect(page.getByRole("heading", { name: "Profilim." })).toBeVisible();
}
async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
  ).toBeTruthy();
}
test("server guard and private metadata", async ({ request, page }) => {
  const r = await request.get("/artist-studio/", { maxRedirects: 0 });
  expect(r.status()).toBe(307);
  expect(r.headers()["location"]).toContain("/artist-studio/login");
  expect(r.headers()["cache-control"]).toContain("no-store");
  expect(r.headers()["x-robots-tag"]).toContain("noindex");
  expect(await r.text()).not.toContain("WORKSPACE /");
  await page.goto("/artist-studio/login/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex.*nofollow/,
  );
  await expect(page.locator(".header")).toHaveCount(0);
});
test("draft, preview, publish and all three themes", async ({
  page,
  request,
}) => {
  await login(page);
  const bio = page.getByLabel("Kısa biyografi");
  await bio.fill("Taslak yayın kontrolü — yalnızca test ortamı.");
  await expect(
    page.getByRole("button", { name: "Yayınla ↗", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Kaydet", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Taslak kaydedildi");
  expect(await (await request.get("/artists/doktor/")).text()).not.toContain(
    "Taslak yayın kontrolü",
  );
  await page.getByRole("button", { name: "Önizle", exact: true }).click();
  await expect(
    page
      .getByRole("article")
      .getByText("Taslak yayın kontrolü — yalnızca test ortamı.", {
        exact: true,
      }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Yayınla ↗", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Profilin yayında");
  expect(await (await request.get("/artists/doktor/")).text()).toContain(
    "Taslak yayın kontrolü",
  );
  await page.getByRole("button", { name: "Görünüm", exact: false }).click();
  for (const theme of ["ARCHIVE", "DARKROOM", "CHAOS"]) {
    await page.getByRole("button", { name: new RegExp(theme) }).click();
    if (
      await page
        .getByRole("button", { name: "Kaydet", exact: true })
        .isEnabled()
    ) {
      await page.getByRole("button", { name: "Kaydet", exact: true }).click();
      await expect(page.getByRole("status")).toContainText("Taslak kaydedildi");
      await page
        .getByRole("button", { name: "Yayınla ↗", exact: true })
        .click();
      await expect(page.getByRole("status")).toContainText("Profilin yayında");
    }
    expect(await (await request.get("/artists/doktor/")).text()).toContain(
      `data-theme="${theme.toLowerCase()}"`,
    );
  }
  await page.getByRole("button", { name: "Profilim", exact: false }).click();
  await bio.fill("Geri alınacak taslak");
  await page.getByRole("button", { name: "Kaydet", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Taslak kaydedildi");
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Son yayınlanan sürüme dön" }).click();
  await expect(bio).toHaveValue(
    "Taslak yayın kontrolü — yalnızca test ortamı.",
  );
});
test("portfolio upload, featured, ordering and deletion", async ({
  page,
  request,
}) => {
  await login(page, "su");
  await page.getByRole("button", { name: "Portfolio", exact: false }).click();
  await page
    .getByLabel("Portfolio görseli yükle")
    .setInputFiles([
      resolve("public/assets/work1.jpg"),
      resolve("public/assets/work2.jpg"),
    ]);
  await expect(page.getByRole("status")).toContainText("2 görsel yüklendi", {
    timeout: 30000,
  });
  const cards = page.locator("article[draggable]");
  await expect(cards).toHaveCount(2);
  await cards
    .nth(0)
    .getByLabel("Başlık", { exact: true })
    .fill("Birinci çalışma");
  await cards
    .nth(1)
    .getByLabel("Başlık", { exact: true })
    .fill("İkinci çalışma");
  await cards
    .nth(0)
    .getByRole("button", { name: "Öne çıkar", exact: true })
    .click();
  await cards
    .nth(1)
    .getByRole("button", { name: "Çalışmayı önceye taşı" })
    .click();
  await expect(cards.nth(0).getByLabel("Başlık", { exact: true })).toHaveValue(
    "İkinci çalışma",
  );
  await cards.nth(0).dragTo(cards.nth(1));
  await expect(cards.nth(0).getByLabel("Başlık",{exact:true})).toHaveValue("Birinci çalışma");
  await page.setViewportSize({width:390,height:900});
  await noOverflow(page);
  await page.screenshot({path:"test-results/studio-portfolio-390.png",fullPage:true});
  await page.getByRole("button", { name: "Kaydet", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Taslak kaydedildi");
  await page.getByRole("button", { name: "Yayınla ↗", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Profilin yayında");
  expect(await (await request.get("/artists/su/")).text()).toContain(
    "Birinci çalışma",
  );
  await page
    .getByRole("navigation", { name: "Studio bölümleri" })
    .getByRole("button", { name: "Öne çıkanlar", exact: false })
    .click();
  await expect(cards).toHaveCount(1);
  page.once("dialog", (d) => d.accept());
  await cards.nth(0).getByRole("button", { name: "Sil", exact: true }).click();
  await page.getByRole("button", { name: "Kaydet", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Taslak kaydedildi");
  await page.getByRole("button", { name: "Yayınla ↗", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Profilin yayında");
  expect(await (await request.get("/artists/su/")).text()).not.toContain(
    "Birinci çalışma",
  );
});
test("public appointment to Studio shared pool claim", async ({
  page,
  browser,
}) => {
  await page.goto("/appointment/");
  await page.getByRole("button", { name: /Devam et/ }).click();
  await page.getByLabel("SANATÇI", { exact: true }).selectOption("Su");
  await expect(page.getByLabel("ŞUBE", { exact: true })).toHaveValue(
    "Alsancak",
  );
  await page.getByLabel("SANATÇI", { exact: true }).selectOption("Fark Etmez");
  await page.getByRole("button", { name: /Devam et/ }).click();
  await page.getByLabel("AD SOYAD").fill("Ortak Havuz Testi");
  await page.getByLabel("TELEFON").fill("05555555555");
  await page.getByRole("button", { name: /Randevu talebini gönder/ }).click();
  await expect(page.getByText("TALEBİN ALINDI")).toBeVisible();
  await login(page, "birsu");
  await page.getByRole("button", { name: "Randevular", exact: false }).click();
  await expect(
    page.getByRole("heading", { name: "Ortak Havuz Testi" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Randevuyu al" }).click();
  await expect(
    page.getByText("Randevu güncellendi.", { exact: true }),
  ).toBeVisible();
  const context = await browser.newContext(),
    other = await context.newPage();
  await login(other, "cansin");
  await other.getByRole("button", { name: "Randevular", exact: false }).click();
  await expect(other.getByText("Henüz randevu yok.")).toBeVisible();
  await expect(
    other.getByRole("button", { name: "Sanatçılar", exact: false }),
  ).toHaveCount(0);
  await context.close();
});
test("manager controls and nine responsive widths", async ({ page }) => {
  await login(page);
  for (const width of [1920, 1600, 1440, 1366, 1280, 1024, 768, 430, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const label of [
      "Profilim",
      "Portfolio",
      "Görünüm",
      "Randevular",
      "Sanatçılar",
    ]) {
      await page.getByRole("button", { name: label, exact: false }).click();
      await expect(
        page.getByRole("heading", {
          name: label === "Sanatçılar" ? "Sanatçılar." : label + ".",
          exact: true,
        }),
      ).toBeVisible();
      await noOverflow(page);
    }
    await expect(page.getByLabel("Su şubesi", { exact: true })).toHaveValue(
      "alsancak",
    );
    await expect(page.getByLabel("Cansın şubesi", { exact: true })).toHaveValue(
      "karsiyaka",
    );
    if ([390, 1440].includes(width))
      await page.screenshot({
        path: `test-results/studio-manager-${width}.png`,
        fullPage: true,
      });
  }
});
test("profile photos, cover and direct invite authorization", async ({
  page,
  browser,
}) => {
  await login(page);
  await page
    .getByLabel("Profil fotoğrafı yükle")
    .setInputFiles(resolve("public/assets/work3.jpg"));
  await expect(page.getByRole("status")).toContainText("1 görsel yüklendi");
  await page
    .getByLabel("Kapak görseli yükle")
    .setInputFiles(resolve("public/assets/work4.jpg"));
  await expect(page.getByRole("status")).toContainText("1 görsel yüklendi");
  await page.getByRole("button", { name: "Kaydet", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Taslak kaydedildi");
  await page.getByRole("button", { name: "Yayınla ↗", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Profilin yayında");
  await page
    .getByRole("navigation", { name: "Studio bölümleri" })
    .getByRole("button", { name: "Sanatçılar", exact: false })
    .click();
  const form = page
    .locator("form")
    .filter({ has: page.getByRole("button", { name: "Davet gönder" }) });
  await form.getByLabel("İsim", { exact: true }).fill("Fixture Artist");
  await form
    .getByLabel("Profil adresi", { exact: false })
    .fill("fixture-artist");
  await form.getByLabel("E-posta", { exact: true }).fill("new@fixture.invalid");
  const requestPromise = page.waitForRequest(
    (r) => r.method() === "POST" && !!r.headers()["next-action"],
  );
  await form.getByRole("button", { name: "Davet gönder" }).click();
  const inviteRequest = await requestPromise;
  // Replay the same real Next Server Action with an ordinary artist's cookies.
  const context = await browser.newContext(),
    other = await context.newPage();
  await login(other, "su");
  const response = await context.request.post("/artist-studio/", {
    headers: {
      "Next-Action": inviteRequest.headers()["next-action"],
      "Content-Type": inviteRequest.headers()["content-type"],
      Origin: "http://localhost:3000",
    },
    data: inviteRequest.postDataBuffer()!,
  });
  expect(await response.text()).toContain("Bu işlem için yetkin yok.");
  await context.close();
});
