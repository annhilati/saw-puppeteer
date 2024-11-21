const kursIDs = [
    5544,
    7642,
    8372,
    8528,
    8532,
    8562,
    8609];

kursIDs.forEach(kursID => {
    const kursData = JSON.stringify({ kursID });
    Livewire.dispatch('addKurs', JSON.parse(kursData)); 
});
