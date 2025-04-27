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
// │                                     Input                                      │
// ╰────────────────────────────────────────────────────────────────────────────────╯

// const readline = require('readline');

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });

// rl.question('Bitte gib die Kurse, die gewählt werden sollen an. Verwende Leerzeichen zur Trennung ', (kursIDsInput) => {
//     rl.close();
// });

// const kursIDs = kursIDsInput.split(" ")

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
        log("[LOGIN]   [INFO] Anmeldedaten eingetragen");

        let attempt = 0;
        const maxAttempts = 6; // 30 Sekunden bei 5 Sekunden Intervall

        while (attempt < maxAttempts) {
            try {
                await tab.click('button[type="submit"]');
                log("[LOGIN]   [INFO] Anmeldedaten abgesendet");
                await tab.waitForSelector('button[wire\\:click="logout"]', { timeout: 10001 }); // etwas mehr als 10 Sekunden warten
                log(`[LOGIN]   [SUCCESS] Angemeldet und Seite geladen: ${await tab.url()}`);
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

    if (settings["autoBook"]) {
        await tab.goto(`${url}/coursebooking`);
        log("[BOOK]   [INFO] Kursbuchungsseite geladen");

        for (const kursID of kursIDs) {
            await tab.evaluate((kursID) => {
                Livewire.dispatch('addKurs', { kursID });
            }, kursID);
            log(`[BOOK]   [INFO] Kurs mit ID ${kursID} hinzugefügt`);
        }
        // Alternative Variante, die nur eine Evaluation nutzt
        // await tab.evaluate((kursIDs) => {
        //     kursIDs.forEach(kursID => {
        //         Livewire.dispatch('addKurs', { kursID });
        //         log(`[BOOK]   [INFO] Kurs mit ID ${kursID} hinzugefügt`);
        //     });
        // }, kursIDs);

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
