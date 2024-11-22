const kursIDs = [8372, 7835, 8615, 5544, 5493, 8620];

kursIDs.forEach(kursID => {
    const kursData = JSON.stringify({ kursID });
    Livewire.dispatch('addKurs', JSON.parse(kursData)); 
});
