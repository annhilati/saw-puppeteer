const username = 'deinBenutzername';
const password = 'deinPasswort';
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
    const browser = await puppeteer.launch();
    log("Browser gestartet");

    const page = await browser.newPage();
    log("Tab geöffnet");

    await page.goto(`${url}/login`);
    log(url, "geladen");

    // ╭────────────────────────────────────────────────────────╮
    // │                         Login                          │
    // ╰────────────────────────────────────────────────────────╯

    if (settings["autoLogin"]) {

        document.getElementById('username').value = username;
        document.getElementById('password').value = password;

        // Auf den Submit-Button klicken
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.click();
        } else {
            log('Submit-Button nicht gefunden!');
    }};

    // ╭────────────────────────────────────────────────────────╮
    // │                        Booking                         │
    // ╰────────────────────────────────────────────────────────╯

    if (settings["courseBooking"]) {
        page.goto(`${url}/coursebooking`)

        kursIDs.forEach(kursID => {
            Livewire.dispatch('addKurs', { kursID });
        });

        page.goto(`${url}/coursebooking/book`)
    }

    await browser.close();
})();
