// Funktion, um Klicks zu überwachen
document.addEventListener('click', function (event) {
    // Überprüfen, ob ein Button geklickt wurde
    if (event.target.tagName === 'BUTTON') {
        const buttonID = event.target.id || 'Keine ID';
        console.log('Button geklickt:', buttonID);

        // Optional: Ergebnisse in eine Liste speichern
        saveButtonID(buttonID);
    }
});

// Liste für geklickte Button-IDs
const clickedButtonIDs = [];

// Funktion, um geklickte IDs zu speichern
function saveButtonID(id) {
    if (!clickedButtonIDs.includes(id)) {
        clickedButtonIDs.push(id);
        console.log('Aktuelle geklickte IDs:', clickedButtonIDs);
    }
}

// Zusätzliche Funktion: IDs als JSON exportieren (falls nötig)
function exportIDs() {
    const json = JSON.stringify(clickedButtonIDs, null, 2);
    console.log('Exportierte IDs:', json);
    // Download als Datei
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'button-ids.json';
    link.click();
}
