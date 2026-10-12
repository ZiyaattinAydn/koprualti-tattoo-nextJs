// Companion for baslat.bat: a port check and browser opening after the server responds.
// Uses Node.js so Windows does not need PowerShell or a second server window.
const net = require("node:net");
const http = require("node:http");
const { exec } = require("node:child_process");

const port = Number(process.env.KOPRUALTI_PORT || 3000);
const host = "127.0.0.1";
const url = `http://${host}:${port}/`;

if (process.argv.includes("--check-port")) {
  const probe = net.createServer();
  probe.once("error", () => process.exit(1));
  probe.listen(port, host, () => probe.close(() => process.exit(0)));
} else if (process.argv.includes("--open-when-ready")) {
  let attempts = 0;
  const retry = () => {
    if (++attempts > 120) return;
    setTimeout(check, 1000);
  };
  const check = () => {
    const request = http.get(url, (response) => {
      response.resume();
      if (response.statusCode !== 200) return retry();
      if (process.env.KOPRUALTI_NO_BROWSER === "1") {
        console.log(`Site hazir: ${url}`);
        return;
      }
      // The URL is local and fixed; cmd's start command opens the default browser.
      exec(`start "" "${url}"`, { windowsHide: true }, (error) => {
        if (error) console.log(`Tarayicida su adresi acin: ${url}`);
      });
    });
    request.setTimeout(1500, () => request.destroy());
    request.on("error", retry);
  };
  check();
} else {
  console.error("Expected --check-port or --open-when-ready");
  process.exitCode = 2;
}
