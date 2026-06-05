// ====== assets/js/filter.js ======
const fotoPratinjau = './assets/filter/filter.jpg'; 

const DatabaseFilter = [
    { id: 'f-normal', nama: 'Normal' },
    { id: 'f-lembut', nama: 'Lembut' },
    { id: 'f-brighten', nama: 'Brighten' },
    { id: 'f-lumiskin', nama: 'LumiSkin' },
    { id: 'f-warm', nama: 'Warm Sun' },
    { id: 'f-cool', nama: 'Cool Tone' },
    { id: 'f-fade', nama: 'Faded' },
    { id: 'f-dramatic', nama: 'Dramatic' },
    { id: 'f-film', nama: 'Analog Film' },
    { id: 'f-vintage', nama: 'Vintage' },
    { id: 'f-bw', nama: 'B & W' },
    { id: 'f-noir', nama: 'Film Noir' }
];

window.renderDaftarFilter = function() {
    const wadah = document.getElementById('daftarFilter');
    wadah.innerHTML = '';
    
    DatabaseFilter.forEach(item => {
        const aktif = (item.id === filterAktif) ? 'pilih' : '';
        wadah.innerHTML += `
            <div class="item-card ${aktif}" data-filter="${item.id}" onclick="pilihFilter(this)">
                <img src="${fotoPratinjau}" class="${item.id}" onerror="this.src='https://via.placeholder.com/80?text=Foto'">
                <span>${item.nama}</span>
            </div>
        `;
    });
};

// BUG FIX: Filter & Mirror berjalan harmonis
window.pilihFilter = function(elemen) {
    document.querySelectorAll('#daftarFilter .item-card').forEach(c => c.classList.remove('pilih'));
    elemen.classList.add('pilih');
    
    filterAktif = elemen.getAttribute('data-filter');
    const vid = getVideoLayar();
    
    // Jangan hapus kelas .mirrored jika statusnya sedang aktif
    if(vid) vid.className = filterAktif + (isMirrored ? ' mirrored' : ''); 
};