const kursIDs = [8372, 5544, 8532, 8528, 8609];

kursIDs.forEach(kursID => {
    const kursData = JSON.stringify({ kursID });
    Livewire.dispatch('addKurs', JSON.parse(kursData)); 
});
