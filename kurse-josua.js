const kursIDs = [7788, 
                 8176, 
                 5544, 
                 8606, 
                 8699, 
                 8634, 
                 8681, 
                 6286];

kursIDs.forEach(kursID => {
    const kursData = JSON.stringify({ kursID });
    Livewire.dispatch('addKurs', JSON.parse(kursData));
});
