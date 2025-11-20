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

## Ablaufplan
Zeit | Ereignisse
---- | ------------
T-0:30 | ❌ Login
T-0:00 | 🗑️ Sessions<br>✅ Login<br>✅ Verbindliches Buchen

## Weiterleitungen
Wenn keine gültige Session besteht, wird man zu `/login` weitergeleitet
Pfad | Keine Kursansicht | Kursansicht | Kurswahl
--- | ----------------- | ----------- | -----------
courseinformations |  | - | 
coursebooking |  |  |
coursebooking/book |  |  |