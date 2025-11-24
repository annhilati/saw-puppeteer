const kursIDs = [6671, 9018, 9045, 8808, 6686, 8560, 7771, 8969];
const settings = {
    autoLogin: true,
    selectCourses: true,
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
        headless: settings["headless"],
        defaultViewport: null,
        args: ['--start-maximized']
    });
    log("[BROWSER] [INFO] Browser gestartet");

    // Show Off
    // const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // await sleep(10000)

    const tab = await browser.newPage();
    log("[BROWSER] [INFO] Neuer Tab geöffnet");

    await tab.goto(`${url}/login`);
    log(`[BROWSER] [INFO] URL geändert und Seite geladen: ${url}/login`);

    // ╭──────────────────────────────────────────────────╮
    // │                      Login                       │
    // ╰──────────────────────────────────────────────────╯

    require('dotenv').config();
    const username = process.env.USER;
    const password = process.env.PASSWORD;

    if (settings["autoLogin"]) {
        log("[SCRIPT]  [INFO] Login begonnen")
        await tab.type('#username', username);
        await tab.type('#password', password);
        log("[LOGIN]   [INFO] Anmeldedaten eingetragen");
        await tab.waitForSelector('button[type="submit"]', { visible: true });
        log("[LOGIN]   [INFO] Anmelde-Button sichtbar");

        let attempt = 0;
        const maxAttempts = 60;

        while (attempt < maxAttempts) {
            try {
                await tab.click('button[type="submit"]');
                log("[LOGIN]   [INFO] Anmeldedaten abgesendet (warte maximal 10 Sekunden auf Weiterleitung)");
                await tab.waitForSelector('button[wire\\:click="logout"]', { timeout: 10001 }); // etwas mehr als 10 Sekunden warten
                log(`[LOGIN]   [SUCCESS] Angemeldet und Seite geladen: ${tab.url()}`);
                break; // Schleife beenden, wenn der Selector gefunden wurde
            } catch (error) {
                attempt++;
                log(`[LOGIN]   [RETRY] Versuch ${attempt} von ${maxAttempts} gescheitert.`);
                if (attempt >= maxAttempts) {
                    log(`[LOGIN]   [FATAL] Seite wurde nach ${maxAttempts} Veruschen nicht weitergeleitet`);
                    process.exit();
                }
            }
        }
    }

    // ╭──────────────────────────────────────────────────╮
    // │                     Booking                      │
    // ╰──────────────────────────────────────────────────╯

    if (settings["selectCourses"]) {
        await tab.goto(`${url}/coursebooking`);

        log("[BOOK]    [INFO] Warte eine Sekunde um Weiterleitung abzuwarten");
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (new URL(tab.url()).pathname === "/dashboard") {
            log("[BOOK]    [WARN] Nur Kursinformationen verfügbar");
            await tab.goto(`${url}/courseinformations`);
            log("[BOOK]    [SUCCESS] Kursinformationsseite geladen");
        } else {
            log("[BOOK]    [SUCCESS] Kursbuchungsseite geladen");
        }

        await tab.evaluate((kursIDs) => {
            kursIDs.forEach(kursID => {
                Livewire.dispatch('addKurs', { kursID });
            });
        }, kursIDs);
        log(`[BOOK]    [INFO] Alle Kurse versucht hinzuzufügen (Feedback erwarteter Maßen unbekannt)`);
    }
    if (settings["autoBook"] || settings["headless"]) {
        await tab.goto(`${url}/coursebooking/book`);
        log("[BOOK]    [INFO] Seite geladen:", tab.url());
    }

    // ╭──────────────────────────────────────────────────╮
    // │                       Ende                       │
    // ╰──────────────────────────────────────────────────╯

    log("[SCRIPT]  [SUCCESS] Skript ordnungsgemäß ausgeführt")
    if (!settings["headless"]) {
        log("[SCRIPT]  [INFO] Schließe das Browserfenster, um das Skript zu beenden")
    } else {
        browser.close()
    }
    
})();
