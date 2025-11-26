# Analyse
## Funktionsweise
### Kurse hinzufügen
```js
Livewire.dispatch('addKurs', { 5544 });
```
- wird ein Kurs hinzugefügt, der bereits gewählt ist gibt es einen Fehler
- wird eine Kursnummer hinzugefügt, die nicht existiert entsteht kein Fehler

### Kurse entfernen
```js
Livewire.dispatch('removeKurs', { 5544 });
```

### Verbindlich wählen
Verbindlich kann gewählt werden, wann man mit einer gültigen Session `https://sawware.benno.webstitut.de/coursebooking/book` besucht, während das Buchen freigeschaltet ist
```js
window.location.replace("https://sawware.benno.webstitut.de/coursebooking/book")
```

## Session
- Die SAWware-Seite und die Kursauswahl ist Session-basiert
- Die Session wird mit dem Login begonnen und endet mit dem schließen des letzten Tabs bzw dem Logout in einem beliebigen Tab

## Toasts
```html
<div role="status" id="toaster" x-data="toasterHub(JSON.parse(&#39;[{\u0022duration\u0022:4000,\u0022message\u0022:\u0022Du hast schon gew\\u00e4hlt.\u0022,\u0022type\u0022:\u0022error\u0022}]&#39;), JSON.parse(&#39;{\u0022alignment\u0022:\u0022middle\u0022,\u0022duration\u0022:4000}&#39;))" class="fixed z-50 p-4 w-full flex flex-col pointer-events-none sm:p-6 top-1/2 -translate-y-1/2 items-end rtl:items-start">
```

## Weiterleitungen
Wenn keine gültige Session besteht, wird man zu `/login` weitergeleitet
Pfad | Keine Kursansicht | Kursansicht | Kurswahl | gewählte Kurse
--- | ----------------- | ----------- | ----------- | ---------------
courseinformations |  | - | 
coursebooking |  | dashboard |
coursebooking/book |  |  |