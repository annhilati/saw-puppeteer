const kursIDs = [8372, 8621, 8615, 5544, 8532, 8528, 5493, 8620];

kursIDs.forEach(kursID => {
    const kursData = JSON.stringify({ kursID });
    Livewire.dispatch('addKurs', JSON.parse(kursData)); 
});
