// Runs the real Next server against a local protocol fixture backed by PostgreSQL.
// No real Supabase service, email provider or production deployment is contacted.
import { spawn, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, chmodSync, mkdirSync } from "node:fs";
import { brotliDecompressSync } from "node:zlib";
import { resolve } from "node:path";
const env = {
  ...process.env,
  VERCEL: "",
  NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:55440",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "fixture-public-key",
  SUPABASE_SERVICE_ROLE_KEY: "fixture-service-key",
  SITE_URL: "http://localhost:3000",
  NO_PROXY: "localhost,127.0.0.1",
};
const children = [];
function start(cmd, args) {
  const p = spawn(cmd, args, { env, stdio: "inherit" });
  children.push(p);
  return p;
}
async function complete(p) {
  await new Promise((resolve, reject) => {
    p.once("error", reject);
    p.once("exit", (code) =>
      code === 0 ? resolve() : reject(new Error("Process exited " + code)),
    );
  });
}
async function ready(url) {
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("Server not ready " + url);
}
try {
  mkdirSync(".qa-runtime", { recursive: true });
  const browser = resolve(".qa-runtime/chromium");
  writeFileSync(
    browser,
    brotliDecompressSync(
      readFileSync("node_modules/@sparticuz/chromium/bin/chromium.br"),
    ),
  );
  chmodSync(browser, 0o700);
  for (const file of ["swiftshader", "fonts"]) {
    const dir =
      file === "fonts" ? resolve(".qa-runtime/fonts") : resolve(".qa-runtime");
    mkdirSync(dir, { recursive: true });
    const archive = resolve(".qa-runtime/" + file + ".tar");
    writeFileSync(
      archive,
      brotliDecompressSync(
        readFileSync(`node_modules/@sparticuz/chromium/bin/${file}.tar.br`),
      ),
    );
    const result = spawnSync("tar", [
      "--no-same-owner",
      "-xf",
      archive,
      "-C",
      dir,
    ]);
    if (result.status) throw Error("Browser runtime extraction failed");
  }
  env.FONTCONFIG_PATH = "/etc/fonts";
  env.PLAYWRIGHT_CHROMIUM_EXECUTABLE = browser;
  start(process.execPath, [
    "--import",
    "tsx",
    "tests/helpers/supabase-fixture.ts",
  ]);
  await ready("http://127.0.0.1:55440/health");
  await complete(start("npm", ["run", "build"]));
  start(process.execPath, [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "0.0.0.0",
  ]);
  await ready("http://localhost:3000/artist-studio/login/");
  await complete(start("node", ["scripts/audit-server.mjs"]));
  await complete(start("npx", ["playwright", "test"]));
} finally {
  for (const child of children)
    if (child.exitCode === null) child.kill("SIGTERM");
}
