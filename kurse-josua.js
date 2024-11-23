const kursIDs = [7786,
                 7788, 
                 8176, 
                 5544, 
                 8606, 
                 8699, 
                 8634, 
                 8530, 
                 6286];

kursIDs.forEach(kursID => {
    const kursData = JSON.stringify({ kursID });
    Livewire.dispatch('addKurs', JSON.parse(kursData));
});
