// ⚙️ Hier Einstellungen vornehmen
const kursIDs = [6671, 9018, 9045, 8808, 6686, 8560, 7771, 8969];
const autoBook = false;

// ⚠️ ACHTUNG: Hier nichts verändern
kursIDs.forEach(kursID => {
    Livewire.dispatch('addKurs', { kursID });
});
if (window.location.pathname === '/coursebooking' && autoBook) {
    window.location.replace("https://sawware.benno.webstitut.de/coursebooking/book")
};
