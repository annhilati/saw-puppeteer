// Liste der Kurs-IDs
const kursIDs = [8699, 5544, 7788, 8634, 8681]; // Füge hier deine IDs hinzu

// Schleife, um die Kurse automatisch zu wählen
kursIDs.forEach(kursID => {
    const kursData = JSON.stringify({ kursID }); // JSON-Daten mit der aktuellen Kurs-ID
    Livewire.dispatch('addKurs', JSON.parse(kursData)); // Dispatch-Befehl ausführen
});