import asyncio
import os, dotenv
from fancyconsole import log
from playwright.async_api import async_playwright, Page

# 0. Anmelden
# 1. Warten auf Beginn (detektieren?)
#   ab 30 Sekunden vor: alle 5 Sekunden reloaden, Login-Page detektieren -> weiter
# 
# 
# 

# ────────────────────────────────────────────────────────────────────────────────
# Meta / Config
# ────────────────────────────────────────────────────────────────────────────────

dotenv.load_dotenv()
username: str       = os.getenv("USER")
password: str       = os.getenv("PASSWORD")
kursIDs:  list[int] = [int(p) for p in os.getenv("KURSE").split(", ")]
testlauf: bool      = os.getenv("TESTLAUF")

settings = {
    "autoLogin": True,
    "selectCourses": True,
    "autoBook": False,
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


        # ──────────────────────────────────────────────
        # Erster Login
        # ──────────────────────────────────────────────

        login(tab)

        # Seitenzustand testen
        await tab.goto(url + "/coursebooking")
        log("BOOK", "INFO", "Warte eine Sekunde um eventuelle Weiterleitung abzuwarten")
        try:
            await tab.wait_for_url("**/dashboard", timeout=1000)
            await tab.wait_for_load_state("load")
        except:
            pass

        if tab.url.endswith("/dashboard"):
            log("BOOK", "WARN", "Nur Kursinformationen verfügbar")
            await tab.goto(url + "/courseinformations")
            log("BOOK", "SUCCESS", "Kursinformations-Seite geladen")
        else:
            log("BOOK", "SUCCESS", "Kursbuchungs-Seite geladen")

        # ──────────────────────────────────────────────
        # Abwarten
        # ──────────────────────────────────────────────
        s = 5
        if not testlauf:
            log("SKRIPT", "INFO", f"Warten, bis Sessions beendet werden (Refresh alle {s} Sekunden)")
            while not tab.url.endswith("login"):
                try:
                    await tab.wait_for_url("**/login", timeout=s*1000)
                except:
                    await tab.reload()

            log("SKRIPT", "INFO", f"Sessions wurden beendet")
            login(tab)

        # ──────────────────────────────────────────────
        # Course Booking
        # ──────────────────────────────────────────────

        await tab.goto(url + "/coursebooking")
        log("BOOK", "INFO", "Warte eine Sekunde um Weiterleitung abzuwarten")
        await tab.wait_for_timeout(1000)

        if tab.url.endswith("/dashboard"):
            log("BOOK", "WARN", "Nur Kursinformationen verfügbar")
            await tab.goto(url + "/courseinformations")
            log("BOOK", "SUCCESS", "Kursinformations-Seite geladen")
        else:
            log("BOOK", "SUCCESS", "Kursbuchungs-Seite geladen")

        await tab.evaluate(
            """(kursIDs) => {
                kursIDs.forEach(kursID => {
                    Livewire.dispatch('addKurs', { kursID });
                });
            }""",
            kursIDs
        )
        log("BOOK", "INFO", "Alle Kurse versucht hinzuzufügen (Feedback erwarteter Maßen unbekannt)")

        await tab.goto(f"{url}/coursebooking/book")
        log(f"BOOK", "INFO", f"Seite geladen: {tab.url}")

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

            await p.wait_for_selector('button[wire\\:click="logout"]', timeout=10000)
            log(f"LOGIN", "SUCCESS", f"Angemeldet und Seite geladen: {p.url}")
            break

        except Exception:
            log(f"LOGIN", "FAIL", f"Versuch {attempt} von {maxAttempts} gescheitert.")
            if attempt >= maxAttempts:
                log("LOGIN", "FATAL", "Seite wurde nach maximalen Versuchen nicht weitergeleitet")
                return
            attempt += 1

if __name__ == "__main__":
    asyncio.run(main())
