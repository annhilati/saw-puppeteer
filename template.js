// ⚙️ Hier Einstellungen vornehmen
const kursIDs = [1001, 1002, 1003, 1004]; // Füge hier deine IDs hinzu
const autoSend = false


// ⚠️ ACHTUNG: Hier nichts verändern
kursIDs.forEach(kursID => {
    Livewire.dispatch('addKurs', { kursID });
});
if (window.location.pathname === '/coursebooking' && autoSend) {
    window.location.replace("https://sawware.benno.webstitut.de/coursebooking/book")
}

