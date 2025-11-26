import asyncio
import os, dotenv
from fancyconsole import log
from playwright.async_api import async_playwright, Page

# ────────────────────────────────────────────────────────────────────────────────
# Meta / Config
# ────────────────────────────────────────────────────────────────────────────────

dotenv.load_dotenv()
username: str       = os.getenv("USER")
password: str       = os.getenv("PASSWORD")
kursIDs:  list[int] = [int(p) for p in os.getenv("KURSE").split(", ")]
testlauf: bool      = os.getenv("TESTLAUF")

settings = {
    "headless": False
}

url = "https://sawware.benno.webstitut.de"

# ────────────────────────────────────────────────────────────────────────────────
# Main
# ────────────────────────────────────────────────────────────────────────────────

async def main():

    log("SCRIPT", "INFO", "Skript gestartet")
    if testlauf:
        log("SCRIPT", "WARN", "Dies ist ein Testlauf")

    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(
            headless=settings["headless"],
            args=["--start-maximized"]
        )
        log("BROWSER", "INFO", "Browser gestartet")

        ctx = await browser.new_context(no_viewport=True)
        tab = await ctx.new_page()
        log("BROWSER", "INFO", "Neuer Tab geöffnet")

        while True:
            try:
                # ──────────────────────────────────────────────
                # Erster Login
                # ──────────────────────────────────────────────

                login(tab)

                await tab.goto(url + "/coursebooking")
                info_only = False

                try:
                    await tab.wait_for_url("**/dashboard", timeout=1000)
                    log("BOOK", "WARN", "Nur Kursinformationen verfügbar")
                    
                    info_only = True
                    await tab.goto(url + "/courseinformations")

                except:
                    log("BOOK", "SUCCESS", "Kursbuchungs-Seite geladen")

                # ──────────────────────────────────────────────
                # Abwarten
                # ──────────────────────────────────────────────

                s = 10
                if not testlauf and not info_only:
                    log("SKRIPT", "INFO", f"Warten, bis Sessions beendet werden (Refresh alle {s} Sekunden)")
                    while not tab.url.endswith("login"):
                        try:    await tab.wait_for_url("**/login", timeout=s*1000)
                        except: await tab.reload()

                    log("SKRIPT", "INFO", f"Sessions wurden beendet")
                    login(tab)
                    await tab.goto(url + "/coursebooking")
                    log("BOOK", "SUCCESS", "Kursbuchungs-Seite geladen")

                # ──────────────────────────────────────────────
                # Course Booking
                # ──────────────────────────────────────────────

                await tab.evaluate(
                    """(kursIDs) => {
                        kursIDs.forEach(kursID => {
                            Livewire.dispatch('addKurs', { kursID });
                        });
                    }""",
                    kursIDs
                )
                log("BOOK", "INFO", "Alle Kurse versucht hinzuzufügen (Feedback erwarteter Maßen unbekannt)")

                log("BOOK", "INFO", "Beginne verbindliches Buchen")
                await tab.goto(f"{url}/coursebooking/book")
                # Hier noch redirects überprüfen. Sowohl bei SUCCESS als auch nicht
                log(f"BOOK", "INFO", f"Kurse verbindlich gebucht")

                break # Anti-Timeout-Loop beenden

            except Exception as e:
                log("SKRIPT", "FATAL", f"{type(e)}: {e}")
                log("SKRIPT", "INFO", f"Der Prozess wird von Neuem begonnen")
                continue # Anti-Timeout-Loop neustarten

        # ──────────────────────────────────────────────
        # Ende
        # ──────────────────────────────────────────────

        log("SCRIPT", "SUCCESS", "Skript ordnungsgemäß ausgeführt")
        if settings["headless"]:
            await browser.close()
        else:
            log("SCRIPT", "INFO", "Schließe das Browserfenster, um das Skript zu beenden")

async def login(p: Page):
    log("SKRIPT", "INFO", "Loginsequenz begonnen")

    await p.goto(url + "/login")
    try:
        p.wait_for_url("**/dashboard", timeout=1000)
        log("LOGIN", "SUCCESS", "Bereits angemeldet")
        return
    except:
        pass

    log("BROWSER", "INFO", "Login-Seite geladen")

    await p.fill("#username", username)
    await p.fill("#password", password)
    log("LOGIN", "INFO", "Anmeldedaten eingetragen")

    await p.wait_for_selector('button[type="submit"]', state="visible")
    log("LOGIN", "INFO", "Anmelde-Button sichtbar")

    attempt = 1
    maxAttempts = 60

    while attempt < maxAttempts:
        try:
            await p.click('button[type="submit"]')
            log("LOGIN", "INFO", "Anmeldedaten abgesendet (warte maximal 10 Sekunden auf Weiterleitung)")

            await p.wait_for_url("**/dashboard", timeout=10000)
            log(f"LOGIN", "SUCCESS", f"Angemeldet und Seite geladen: {p.url}")
            break

        except Exception:
            log(f"LOGIN", "FAIL", f"Versuch {attempt} von {maxAttempts} gescheitert.")
            if attempt >= maxAttempts:
                log("LOGIN", "FATAL", "Seite wurde nach maximalen Versuchen nicht weitergeleitet")
                return
            attempt += 1

async def get_toasts(p: Page):
    toasters = await p.query_selector_all("#toaster")

    messages = []

    for t in toasters:
        xdata = await t.get_attribute("x-data")
        if not xdata:
            continue

        import re, json
        m = re.search(r"JSON\.parse\('([^']*)'\)", xdata)
        if not m:
            continue

        raw_json = m.group(1)

        from html import unescape
        raw_json = unescape(raw_json)

        arr: dict = json.loads(raw_json)

        for item in arr:
            if "message" in item:
                messages.append(item["message"])

    return messages


if __name__ == "__main__":
    asyncio.run(main())
