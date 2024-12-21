const url = "https://sawware.benno.webstitut.de"

// ╭────────────────────────────────────────────────────────────────────────────────╮
// │                                     Head                                       │
// ╰────────────────────────────────────────────────────────────────────────────────╯

const puppeteer = require('puppeteer');

function log(message) {
    const timestamp = new Date().toTimeString().split(' ')[0];
    console.log(`[${timestamp}] ${message}`);
  }

// ╭────────────────────────────────────────────────────────────────────────────────╮
// │                                     Main                                       │
// ╰────────────────────────────────────────────────────────────────────────────────╯

(async () => {
  const browser = await puppeteer.launch();
  log("Browser gestartet");
  const page = await browser.newPage();
  log("Tab geöffnet");
  await page.goto(`${url}/login`);
  log(url, "geladen");

  // Extrahiere den Titel der Seite
  const title = await page.title();
  console.log('Seiten-Titel:', title);

  // Schließe den Browser
  await browser.close();
})();
