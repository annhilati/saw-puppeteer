from dataclasses import dataclass
from playwright.async_api import Page

@dataclass
class Webbot:
    page: Page