import { defineConfig } from "@playwright/test";
import chromium from "@sparticuz/chromium";
export default defineConfig({
  testDir: "./tests/browser",
  workers: 1,
  timeout: 45000,
  expect: { timeout: 10000 },
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? {
          executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
          args: chromium.args.filter(
            (a) =>
              ![
                "--single-process",
                "--disable-web-security",
                "--allow-running-insecure-content",
              ].includes(a),
          ),
        }
      : undefined,
  },
  reporter: "list",
});
