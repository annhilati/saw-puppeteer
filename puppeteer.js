require('dotenv').config();
console.log("Geladener Benutzername:", process.env.USERNAME);
console.log("Geladenes Passwort:", process.env.PASSWORD);
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const kursIDs = [8372, 8621, 8615, 5544, 8532, 8528, 5493, 8620];
const settings = {
    autoLogin: true,
    selectCourses: false,
    autoBook: false
}

const url = "https://sawware.benno.webstitut.de"

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

(async () => {
    const browser = await puppeteer.launch({
        headless: false, // Sichtbarer Modus
        defaultViewport: null, // Verwendet die Standard-Browsergröße
        args: ['--start-maximized'] // Startet maximiert
    });
    log("Browser gestartet");

    const page = await browser.newPage();
    log("Tab geöffnet");

    await page.goto(`${url}/login`);
    log(url, "geladen");

    // ╭──────────────────────────────────────────────────╮
    // │                      Login                       │
    // ╰──────────────────────────────────────────────────╯

    if (settings["autoLogin"]) {
        await page.evaluate((username, password) => {
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            if (usernameInput && passwordInput) {
                usernameInput.value = username;
                passwordInput.value = password;
                const submitButton = document.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.click();
                }
            } else {
                console.error("Eingabefelder oder Submit-Button nicht gefunden!");
            }
        }, username, password);

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

    await browser.close();
    log("Browser geschlossen");
})();
