import asyncio
from playwright.async_api import async_playwright
import os, dotenv
from fancyconsole import log


# ────────────────────────────────────────────────────────────────────────────────
# Meta / Config
# ────────────────────────────────────────────────────────────────────────────────

dotenv.load_dotenv()
username: str       = os.getenv("USER")
password: str       = os.getenv("PASSWORD")
kursIDs:  list[int] = [int(p) for p in os.getenv("KURSE").split(", ")]

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

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=settings["headless"],
            args=["--start-maximized"]
        )
        log("BROWSER", "INFO", "Browser gestartet")

        context = await browser.new_context(no_viewport=True)
        page = await context.new_page()
        log("BROWSER", "INFO", "Neuer Tab geöffnet")

        await page.goto(f"{url}/login")
        log("BROWSER", "INFO", "Login-Seite geladen")

        # ──────────────────────────────────────────────
        # Login
        # ──────────────────────────────────────────────

        if settings["autoLogin"]:
            log("[SCRIPT]  [INFO] Login begonnen")
            await page.fill("#username", username)
            await page.fill("#password", password)
            log("[LOGIN]   [INFO] Anmeldedaten eingetragen")

            await page.wait_for_selector('button[type="submit"]', state="visible")
            log("[LOGIN]   [INFO] Anmelde-Button sichtbar")

            attempt = 1
            maxAttempts = 60

            while attempt < maxAttempts:
                try:
                    await page.click('button[type="submit"]')
                    log("[LOGIN]   [INFO] Anmeldedaten abgesendet (warte maximal 10 Sekunden auf Weiterleitung)")

                    await page.wait_for_selector('button[wire\\:click="logout"]', timeout=10000)
                    log(f"[LOGIN]   [SUCCESS] Angemeldet und Seite geladen: {page.url}")
                    break

                except Exception:
                    log(f"[LOGIN]   [RETRY] Versuch {attempt} von {maxAttempts} gescheitert.")
                    if attempt >= maxAttempts:
                        log("[LOGIN]   [FATAL] Seite wurde nach maximalen Versuchen nicht weitergeleitet")
                        return
                    attempt += 1

        # ──────────────────────────────────────────────
        # Course Booking
        # ──────────────────────────────────────────────

        if settings["selectCourses"]:
            await page.goto(url + "/coursebooking")
            log("[BOOK]    [INFO] Warte eine Sekunde um Weiterleitung abzuwarten")
            await page.wait_for_timeout(1000)

            if page.url.endswith("/dashboard"):
                log("[BOOK]    [WARN] Nur Kursinformationen verfügbar")
                await page.goto(url + "/courseinformations")
                log("[BOOK]    [SUCCESS] Kursinformations-Seite geladen")
            else:
                log("[BOOK]    [SUCCESS] Kursbuchungs-Seite geladen")

            # Livewire dispatch ausführen
            await page.evaluate(
                """(kursIDs) => {
                    kursIDs.forEach(kursID => {
                        Livewire.dispatch('addKurs', { kursID });
                    });
                }""",
                kursIDs
            )
            log("[BOOK]    [INFO] Alle Kurse versucht hinzuzufügen (Feedback erwarteter Maßen unbekannt)")

        if settings["autoBook"] or settings["headless"]:
            await page.goto(f"{url}/coursebooking/book")
            log(f"[BOOK]    [INFO] Seite geladen: {page.url}")

        # ──────────────────────────────────────────────
        # Ende
        # ──────────────────────────────────────────────

        log("[SCRIPT]  [SUCCESS] Skript ordnungsgemäß ausgeführt")
        if settings["headless"]:
            await browser.close()
        else:
            log("[SCRIPT]  [INFO] Schließe das Browserfenster, um das Skript zu beenden")


if __name__ == "__main__":
    asyncio.run(main())
