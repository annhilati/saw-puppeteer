// Liste der Kurs-IDs
const kursIDs = [8537, 8651, 8652, 8653]; // Füge hier deine IDs hinzu

// Schleife, um die Kurse automatisch zu wählen
kursIDs.forEach(kursID => {
    const kursData = JSON.stringify({ kursID }); // JSON-Daten mit der aktuellen Kurs-ID
    Livewire.dispatch('addKurs', JSON.parse(kursData)); // Dispatch-Befehl ausführen
});
window.location.replace("https://sawware.benno.webstitut.de/coursebooking/book")