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
log("Skript gestartet");

(async () => {
    const browser = await puppeteer.launch({
        headless: settings["headless"], // Sichtbarer Modus
        defaultViewport: null, // Verwendet die Standard-Browsergröße
        args: ['--start-maximized'] // Startet maximiert
    });
    log("[INFO] Browser gestartet");

    const tab = await browser.newPage();
    log("[INFO] Neuer Tab geöffnet");

    await tab.goto(`${url}/login`);
    log(`[INFO] URL geändert und Seite geladen: ${url}/login`);

    // ╭──────────────────────────────────────────────────╮
    // │                      Login                       │
    // ╰──────────────────────────────────────────────────╯

    require('dotenv').config();
    const username = "Anton Berndt";
    const password = process.env.PASSWORD;

    if (settings["autoLogin"]) {
        log("[INFO] Login begonnen")
        await tab.type('#username', username);
        await tab.type('#password', password);
        await tab.waitForSelector('button[type="submit"]', { visible: true });
        await tab.click('button[type="submit"]');
        log("[INFO] Anmeldedaten eingetragen und angemeldet");

        // await tab.evaluate(() => {
        //     const form = document.querySelector('form[wire\\:submit="login"]');
        //     if (form) {
        //         form.
        //         form.submit();
        //     } else {
        //         log("Formular nicht gefunden!");
        //     }
        // });
        
        try {
            await tab.waitForFunction(
                () => window.location.href !== `${url}/login`, 
                { timeout: 30000 } // Timeout nach 10 Sekunden
            );
            log(`URL hat sich geändert:, ${await tab.url()}`);
            await tab.waitForNavigation();
            log(`Seite geladen: ${await tab.url()}`)

        } catch (error) {
            log("Seite wurde nach 30 Sekunden nicht weitergeleitet")
        }
        
        
    }

    // ╭──────────────────────────────────────────────────╮
    // │                     Booking                      │
    // ╰──────────────────────────────────────────────────╯

    if (settings["autoBook"]) {
        await tab.goto(`${url}/coursebooking`);
        log("Kursbuchungsseite geladen");

        for (const kursID of kursIDs) {
            await tab.evaluate((kursID) => {
                Livewire.dispatch('addKurs', { kursID });
            }, kursID);
            log(`Kurs mit ID ${kursID} hinzugefügt`);
        }

        await tab.goto(`${url}/coursebooking/book`);
        log("Kurse gebucht");
    }


    log("Skript ordnungsgemäß ausgeführt")
    if (!settings["headless"]) {
        log("Schließe das Browserfenster, um das Skript zu beenden")
    } else {
        browser.close()
    }
})();
