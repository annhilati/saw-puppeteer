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
    log("Browser gestartet");

    const page = await browser.newPage();
    log("Tab geöffnet");

    await page.goto(`${url}/login`);
    log(`${url} geladen`);

    // ╭──────────────────────────────────────────────────╮
    // │                      Login                       │
    // ╰──────────────────────────────────────────────────╯

    require('dotenv').config();
    const username = "Anton Berndt";
    const password = process.env.PASSWORD;

    if (settings["autoLogin"]) {
        await page.type('#username', username);  // Das Feld mit der ID "name"
        await page.type('#password', password);
        await page.evaluate(() => {
            const form = document.querySelector('form[wire\\:submit="login"]');
            if (form) {
                form.
                form.submit();
            } else {
                console.error("Formular nicht gefunden!");
            }
        });
        

        await page.waitForNavigation(); // Warten, bis die Seite geladen ist
        log("Login abgeschlossen");
    }

    // ╭──────────────────────────────────────────────────╮
    // │                     Booking                      │
    // ╰──────────────────────────────────────────────────╯

    if (settings["autoBook"]) {
        await page.goto(`${url}/coursebooking`);
        log("Kursbuchungsseite geladen");

        for (const kursID of kursIDs) {
            await page.evaluate((kursID) => {
                Livewire.dispatch('addKurs', { kursID });
            }, kursID);
            log(`Kurs mit ID ${kursID} hinzugefügt`);
        }

        await page.goto(`${url}/coursebooking/book`);
        log("Kurse gebucht");
    }

    // await browser.close();
    log("Browser geschlossen");
})();
