// ⚙️ Hier Einstellungen vornehmen
const kursIDs = [8372, 8621, 8615, 5544, 8532, 8528, 5493, 8620];
const autoBook = false;


// ⚠️ ACHTUNG: Hier nichts verändern
kursIDs.forEach(kursID => {
    Livewire.dispatch('addKurs', { kursID });
});
if (window.location.pathname === '/coursebooking' && autoSend) {
    window.location.replace("https://sawware.benno.webstitut.de/coursebooking/book")
}

