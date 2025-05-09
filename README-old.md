# Script zum Wählen von SAW-Kursen

> [!IMPORTANT]
> Wenn du keine oder nur wenig Erfahrung mit der Verwendung von Computern oder Webdevelopment hast, lies zunächst die gesammte Anleitung. <br>
> Die Anleitung geht außerdem davon aus, dass du kein Steinzeitmensch bist und zumindest Text kopieren (Strg+C), einfügen (Strg+V) und zwischenspeichern (zum Beispiel in Windows' "Editor" Programm) kannst.

> [!IMPORTANT]
> Wenn du auf dem iPad unterwegs bist, lies dennoch erst die gesammte Anleitung um zu verstehen, was hier erreicht werden soll. <br>Folge dann den Schritten der Anleitung für iPads.

> [!IMPORTANT]
> Da der Kiwi-Browser nicht mehr weiterentwickelt wird, gibt für Android-Geräte aktuell keine einfache Möglichkeit der Ausführung dieses Codes. <br>
> ~~Wenn du auf einem Android-Tablet unterwegs bist, installiere die Kiwi-Browser App. Du kannst sie wie den Browser eines Computers benutzen. Die Konsole findest du im 3-Punkte-Menü oben rechts.~~

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
   if (window.location.pathname === '/coursebooking' && autoBook) {
      window.location.replace("https://sawware.benno.webstitut.de/coursebooking/book")
   };
    ```

3. **Öffne im Browser die Entwicklerwerkzeuge**<br>
   Das machst du beispielsweise, indem du auf der SAWWare-Seite irgendwo rechtsklickst und "Element untersuchen" o.ä. wählst. In den "Dev-Tools", die sich jetzt - meistens am rechten Bildschirmrand - geöffnet haben, bist du nun im "Elemente"/"Elements"-Tab gelandet.<br>
4. **Wechsle zum "Konsole"/"Console"-Tab**<br>
   ![image](https://github.com/user-attachments/assets/6422feff-222f-4fd2-ac30-1e8c78879cdc)
5. **Ggf. Konsole authorisieren**<br>
   Es kann sein, dass du als Sicherheitsfreigabe etwas bestimmtes in die Konsole schreiben musst. Das wird dort angezeigt und kann beispielsweise "Eingabe erlauben" lauten.
6. **Auf die Wahl warten**<br>
   Warte auf die Wahl und lasse die Konsole währenddessen am besten geöffnet. Du kannst den Code auch schon einfügen, nur abschicken bringt eben noch nichts. (Siehe Schritt 8)

### Wenn die Wahl begonnen hat
7. **Lade die SAWWare-Seite neu und melde dich wenn nötig an, öffne die Kurswahlansicht**
   
8. Kopiere das fertige Script mit den IDs deiner Kurse und füge es in die Konsole ein (Strg+V), drücke anschließend Enter
   
9. Suche den Knopf auf der Wahlseite, mit dem die Wahl abgesendet wird und drücke ihn.

Done 🤙

## Konsole für Safari auf dem iPad
1. Installiere die [Web Inspector](https://apps.apple.com/de/app/web-inspector/id1584825745) App auf deinem iPad.

2. Befolge die Anweisungen in der App, um die Erweiterung für Safari zu installieren.

3. Starte die Erweiterung durch tippen auf das blaue Infosymbol (bzw das Puzzelteil) in der Suchleiste.
  <img width="1180" alt="Bild" src="https://github.com/user-attachments/assets/b2c830b8-7f0c-42bd-8b0c-cbf25565c3a9">

4. Wechsle zum Tab 'Console'.

5. Füge das Skript wie in der normalen Anleitung beschrieben ein.

6. Drücke auf den 'Execute'-Button rechts.

Done 🤙

> [!NOTE]
> Das Script ist in keiner Weise eine Garantie dafür, dass alle Kurse gewählt werden und ist zeitabhängig. Wenn ein Kurs ausgebucht ist, wird er nicht gewählt.