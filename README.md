# Script zum Wählen von SAW-Kursen

> [!IMPORTANT]
> Wenn du keine oder nur wenig Erfahrung mit der Verwendung von Computern oder Webdevelopment hast, lies zunächst die gesammte Anleitung. <br>
> Die Anleitung geht ausserdem davon aus, dass du kein Steinzeitmensch bist und zumindest Text kopieren (Strg+C), einfügen (Strg+V) und zwischenspeichern (zum Beispiel in Windows' "Editor" Programm) kannst.

## Tutorial für Anfänger
### Vorbereitung
1. **Melde dich bei SAWWare an und wähle deine Kurse**
2. **Füge die Kursnummern in die Liste am Anfang des Scripts ein.**<br>
   Es ist wichtig, dass die Liste richtig formatiert ist. Sie kann beispielsweise so aussehen:
   
    ```js
    const kursIDs = [5544, 7642, 8372, 8528, 8532, 8562, 8609];
    ```

    Insgesammt muss das Script so aussehen:
    ```js
    // ⚙️ Hier Einstellungen vornehmen
   const kursIDs = [1001, 1002, 1003, 1004];
   const autoBook = false;
   

   // ⚠️ ACHTUNG: Hier nichts verändern
   kursIDs.forEach(kursID => {
      Livewire.dispatch('addKurs', { kursID });
   });
   if (window.location.pathname === '/coursebooking' && autoSend) {
       window.location.replace("https://sawware.benno.webstitut.de/coursebooking/book")
   };
    ```

3. **Öffne im Browser die Entwicklerwerkzeuge**<br>
   Das machst du beispielsweise, indem du auf der SAWWare-Seite irgendwo rechtsklickst und "Element untersuchen" o.ä. wählst. In den "Dev-Tools", die sich jetzt - meistens am rechten Bildschirmrand - geöffnet haben, bist du nun im "Elemente"/"Elements"-Tab gelandet.<br>
5. **Wechsle zum "Konsole"/"Console"-Tab**<br>
   ![image](https://github.com/user-attachments/assets/6422feff-222f-4fd2-ac30-1e8c78879cdc)
6. **Ggf. Konsole authorisieren**<br>
   Es kann sein, dass du als Sicherheitsfreigabe etwas bestimmtes in die Konsole schreiben musst. Das wird dort angezeigt und kann beispielsweise "Eingabe erlauben" heißen.
7. **Klärung der Daten**<br>
   Melde dich von der SAWWare-Seite ab.

    Warte anschließend auf den Beginn der Wahl und lass die Konsole geöffnet

### Wenn die Wahl begonnen hat
7. **Lade die SAWWare-Seite neu und melde dich wenn nötig an, öffne die Kurswahlansicht**
   
8. Kopiere das fertige Script mit den IDs deiner Kurse und füge es in die Konsole ein (Strg+V), drücke anschließend Enter
   
9. Suche den Knopf auf der Wahlseite, mit dem die Wahl abgesendet wird und drücke ihn.

Done 🤙

## Anleitung für Safari auf dem Tablet
1. Installiere die App ["Web Inspector"](https://apps.apple.com/de/app/web-inspector/id1584825745) auf deinem iPad.

2. Befolge die Anweisungen in der App, um die Erweiterung für Safari zu installieren.

3. Starte die Erweiterung durch tippen auf das blaue i-symbol in der Suchleiste.
  <img width="1180" alt="Bild" src="https://github.com/user-attachments/assets/b2c830b8-7f0c-42bd-8b0c-cbf25565c3a9">


4. Wechsle zum Tab 'Console'

5. Füge das Skript wie in der normalen Anleitung ein.

6. Drücke auf den 'Execute'-Button rechts.

Done 🤙

> [!NOTE]
> Das Script ist in keiner Weise eine Garantie dafür, dass alle Kurse gewählt werden und ist zeitabhängig. Wenn ein Kurs ausgebucht ist, wird er nicht gewählt.

## Sonstiges
<details>
  <summary>Technische Details</summary>
  hier steht noch nix
</details>
