import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
const origin = process.env.QA_ORIGIN ?? "http://localhost:3000";
const routes = [
  "/",
  "/about/",
  "/services/",
  "/services/tattoo/",
  "/services/piercing/",
  "/services/cover-up/",
  "/appointment/",
  "/artists/",
  "/artists/doktor/",
  "/artists/su/",
  "/artists/birsu/",
  "/artists/cansin/",
  "/portfolio/",
  "/studios/",
  "/studios/alsancak/",
  "/studios/karsiyaka/",
  "/ataturk/",
];
const checked = new Set();
for (const route of routes) {
  const response = await fetch(origin + route);
  assert.equal(response.status, 200, route);
  const doc = new JSDOM(await response.text()).window.document;
  assert.ok(doc.querySelector(".header nav"), route + " header");
  assert.ok(doc.querySelector(".footer nav"), route + " footer");
  assert.equal(
    doc.querySelector('a[href*="artist-studio"]'),
    null,
    "Private studio link leaked",
  );
  for (const image of doc.querySelectorAll("img"))
    assert.ok(image.hasAttribute("alt"));
  for (const el of doc.querySelectorAll(
    "img[src],a[href],link[rel=stylesheet]",
  )) {
    const source = el.getAttribute("src") ?? el.getAttribute("href");
    if (!source || source.startsWith("#") || !source.startsWith("/")) continue;
    const url = new URL(source, origin);
    url.hash = "";
    if (checked.has(url.href)) continue;
    checked.add(url.href);
    const r = await fetch(url);
    assert.ok(r.ok, `${route} broken ${source}: ${r.status}`);
  }
  console.log("PASS public route " + route);
}
const privateResponse = await fetch(origin + "/artist-studio/", {
  redirect: "manual",
});
assert.ok([307, 308].includes(privateResponse.status));
assert.ok(
  privateResponse.headers.get("location").includes("/artist-studio/login"),
);
assert.match(privateResponse.headers.get("x-robots-tag"), /noindex/);
assert.match(privateResponse.headers.get("cache-control"), /no-store/);
assert.ok(!(await privateResponse.text()).includes("WORKSPACE /"));
const sitemap = await (await fetch(origin + "/sitemap.xml")).text();
assert.ok(!sitemap.includes("artist-studio"));
console.log(
  "PASS: public links/assets, private server guard, noindex, no-store and sitemap exclusion",
);

const { readdir, readFile } = await import("node:fs/promises");
async function scan(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = dir + "/" + entry.name;
    if (entry.isDirectory()) await scan(path);
    else if (path.endsWith(".js"))
      assert.ok(
        !(await readFile(path, "utf8")).includes("fixture-service-key"),
        "Privileged key reached browser chunk",
      );
  }
}
await scan(".next/static");
console.log("PASS: test server credential is absent from browser bundles");
