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
Verbindlich kann gewählt werden, wann man mit einer gültigen Session `https://sawware.benno.webstitut.de/coursebooking/book` besucht
```js
window.location.replace("https://sawware.benno.webstitut.de/coursebooking/book")
```

## Session
- Die SAWware-Seite und die Kursauswahl ist Session-basiert
- Die Session wird mit dem Login begonnen und endet mit dem schließen des letzten Tabs bzw dem Logout in einem beliebigen Tab

## Ablaufplan
Zeit | Ereignisse
---- | ------------
halbe stunde vor beginn | Der Login wird deaktiviert
Zu beginn | Sessions werden beendet<br>Login wird aktiviert
