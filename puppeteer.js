const kursIDs = [8372, 8621, 8615, 5544, 8532, 8528, 5493, 8620];
const settings = {
    autoLogin: true,
    selectCourses: false,
    autoBook: false,
    headless: false
}

// ╭────────────────────────────────────────────────────────────────────────────────╮
// │                                     Meta                                       │
// ╰────────────────────────────────────────────────────────────────────────────────╯

const puppeteer = require('puppeteer');

function log(message) {
    const timestamp = new Date().toTimeString().split(' ')[0];
    console.log(`[${timestamp}] ${message}`);
  }

// ╭────────────────────────────────────────────────────────────────────────────────╮
// │                                     Main                                       │
// ╰────────────────────────────────────────────────────────────────────────────────╯

const url = "https://sawware.benno.webstitut.de"
log("[SCRIPT]  [INFO] Skript gestartet");

(async () => {
    const browser = await puppeteer.launch({
        headless: settings["headless"], // Sichtbarer Modus
        defaultViewport: null, // Verwendet die Standard-Browsergröße
        args: ['--start-maximized'] // Startet maximiert
    });
    log("[BROWSER] [INFO] Browser gestartet");

    const tab = await browser.newPage();
    log("[BROWSER] [INFO] Neuer Tab geöffnet");

    await tab.goto(`${url}/login`);
    log(`[BROWSER] [INFO] URL geändert und Seite geladen: ${url}/login`);

    // ╭──────────────────────────────────────────────────╮
    // │                      Login                       │
    // ╰──────────────────────────────────────────────────╯

    require('dotenv').config();
    const username = "Anton Berndt";
    const password = process.env.PASSWORD;

    if (settings["autoLogin"]) {
        log("[SCRIPT]  [INFO] Login begonnen")
        await tab.type('#username', username);
        await tab.type('#password', password);
        await tab.waitForSelector('button[type="submit"]', { visible: true });
        await tab.click('button[type="submit"]');
        log("[LOGIN]   [INFO] Anmeldedaten eingetragen und abgesendet");

        try {
            await tab.waitForSelector('button[wire\\:click="logout"]', { timeout: 30000 }); // Wartet auf den Logout-Button
            log(`[LOGIN]   [SUCCESS] Angemeldet und Seite geladen: ${await tab.url()}`);

        } catch (error) {
            log("[LOGIN]   [FATAL] Seite wurde nach 30 Sekunden nicht weitergeleitet");
            process.exit();
        }
    }

    // ╭──────────────────────────────────────────────────╮
    // │                     Booking                      │
    // ╰──────────────────────────────────────────────────╯

    if (settings["autoBook"]) {
        await tab.goto(`${url}/coursebooking`);
        log("[BOOK]   [INFO] Kursbuchungsseite geladen");

        for (const kursID of kursIDs) {
            await tab.evaluate((kursID) => {
                Livewire.dispatch('addKurs', { kursID });
            }, kursID);
            log(`[BOOK]   [INFO] Kurs mit ID ${kursID} hinzugefügt`);
        }

        await tab.goto(`${url}/coursebooking/book`);
        log("[BOOK]   [INFO] Seite geladen:", await tab.url());
    }

    // ╭──────────────────────────────────────────────────╮
    // │                       Ende                       │
    // ╰──────────────────────────────────────────────────╯

    log("[SCRIPT]  [INFO] Skript ordnungsgemäß ausgeführt")
    if (!settings["headless"]) {
        log("[SCRIPT]  [INFO] Schließe das Browserfenster, um das Skript zu beenden")
    } else {
        browser.close()
    }
})();
