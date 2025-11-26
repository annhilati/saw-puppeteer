from dataclasses import dataclass
from playwright.async_api import Page


async def main():
    page: Page = Page()
    toasters = await page.query_selector_all("#toaster")

    messages = []

    for t in toasters:
        # komplettes x-data-Attribut lesen
        xdata = await t.get_attribute("x-data")
        if not xdata:
            continue

        # ersten JSON.parse-Inhalt extrahieren
        # Beispiel:
        # toasterHub(JSON.parse('[{...}]'), JSON.parse('{...}'))
        import re, json
        m = re.search(r"JSON\.parse\('([^']*)'\)", xdata)
        if not m:
            continue

        raw_json = m.group(1)

        # HTML-Unescape (Playwright liefert die rohen Entities)
        from html import unescape
        raw_json = unescape(raw_json)

        # JSON laden (enthält z. B. [{ "message": "...", "type": "...", ... }])
        arr = json.loads(raw_json)

        # alle Messages extrahieren
        for item in arr:
            if "message" in item:
                messages.append(item["message"])

    print(messages)
