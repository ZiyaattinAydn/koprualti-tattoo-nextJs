import { existsSync, readFileSync } from "node:fs";
import { join, extname } from "node:path";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
const root = join(process.cwd(), "out");
const routes = [
  "",
  "portfolio",
  "artists",
  "artists/doktor",
  "about",
  "ataturk",
  "studios",
  "studios/alsancak",
  "studios/karsiyaka",
  "services",
  "appointment",
];
const errors = [];
for (const route of routes) {
  const pathname = `/${route}${route ? "/" : ""}`,
    file = join(root, route, "index.html");
  if (!existsSync(file)) {
    errors.push(`${pathname}: exported page missing`);
    continue;
  }
  const page = new JSDOM(readFileSync(file, "utf8"), {
    url: `https://example.test${pathname}`,
  }).window.document;
  if (!page.querySelector('meta[name="viewport"]'))
    errors.push(`${pathname}: viewport meta missing`);
  if (!page.querySelector(".header nav") || !page.querySelector(".footer nav"))
    errors.push(`${pathname}: navigation missing`);
  const visit = (url, label) => {
    if (
      !url ||
      url.startsWith("#") ||
      url.startsWith("mailto:") ||
      url.startsWith("tel:")
    )
      return;
    const target = new URL(url, "https://example.test" + pathname);
    if (target.origin !== "https://example.test") return;
    const relative = target.pathname.replace(/^\//, "");
    const candidate = join(root, relative);
    const isFile = extname(candidate) !== "";
    if (!existsSync(isFile ? candidate : join(candidate, "index.html")))
      errors.push(`${pathname}: missing ${label} ${url}`);
  };
  for (const image of page.querySelectorAll("img")) {
    if (!image.hasAttribute("alt"))
      errors.push(`${pathname}: image without alt`);
    if (!image.getAttribute("src"))
      errors.push(`${pathname}: image without src`);
    visit(image.getAttribute("src"), "image");
  }
  for (const control of page.querySelectorAll("button"))
    if (!control.getAttribute("type"))
      errors.push(`${pathname}: button without type`);
  for (const item of page.querySelectorAll(
    'a[href],link[rel="stylesheet"],script[src]',
  ))
    visit(item.getAttribute("href") || item.getAttribute("src"), "link");
  for (const item of page.querySelectorAll("[data-full]"))
    visit(item.getAttribute("data-full"), "lightbox");
  console.log(
    `${pathname}: ${page.querySelectorAll("img").length} images, ${page.querySelectorAll("a[href]").length} links`,
  );
}
assert.deepEqual(errors, [], errors.join("\n"));
console.log(`PASS: ${routes.length} pages, navigations and local assets`);
