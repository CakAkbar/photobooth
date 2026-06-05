// ====== assets/js/kisi.js ======
const DatabaseAxara = {
    'Layout_A': { nama: 'Layout A (3 Pose)', icon: './assets/icons/icon_A.png', kotak: 3, w: 600, h: 1800, maxFoto: 3, lubang: [{x:40, y:50, w:520, h:420}, {x:40, y:520, w:520, h:420}, {x:40, y:990, w:520, h:420}], tema: [{id:'A1', nama:'Polos Putih', src:'./assets/frames/A_tema1.png'}, {id:'A2', nama:'Polos Hitam', src:'./assets/frames/A_tema2.png'}] },
    'Layout_B': { nama: 'Layout B (3 Pose)', icon: './assets/icons/icon_B.png', kotak: 3, w: 600, h: 1800, maxFoto: 3, lubang: [{x:40, y:150, w:520, h:400}, {x:40, y:580, w:520, h:400}, {x:40, y:1010, w:520, h:400}], tema: [{id:'B1', nama:'Klasik', src:'./assets/frames/B_tema1.png'}] },
    'Layout_C': { nama: 'Layout C (4 Pose)', icon: './assets/icons/icon_C.png', kotak: 4, w: 600, h: 1800, maxFoto: 4, lubang: [{x:40, y:50, w:520, h:320}, {x:40, y:410, w:520, h:320}, {x:40, y:770, w:520, h:320}, {x:40, y:1130, w:520, h:320}], tema: [{id:'C1', nama:'Bunga', src:'./assets/frames/C_tema1.png'}] },
    'Layout_D': { nama: 'Layout D (4 Pose)', icon: './assets/icons/icon_D.png', kotak: 4, w: 600, h: 1800, maxFoto: 4, lubang: [{x:40, y:100, w:520, h:310}, {x:40, y:440, w:520, h:310}, {x:40, y:780, w:520, h:310}, {x:40, y:1120, w:520, h:310}], tema: [{id:'D1', nama:'Polos', src:'./assets/frames/D_tema1.png'}] },
    'Layout_E': { nama: 'Layout E (4 Pose)', icon: './assets/icons/icon_E.png', kotak: 4, w: 1800, h: 1200, maxFoto: 4, lubang: [{x:50, y:50, w:900, h:650}, {x:50, y:750, w:530, h:350}, {x:630, y:750, w:530, h:350}, {x:1210, y:750, w:530, h:350}], tema: [{id:'E1', nama:'Majalah', src:'./assets/frames/E_tema1.png'}] },
    'Layout_F': { nama: 'Layout F (Grid)', icon: './assets/icons/icon_F.png', kotak: 4, w: 1800, h: 1200, maxFoto: 4, lubang: [{x:60, y:60, w:810, h:440}, {x:930, y:60, w:810, h:440}, {x:60, y:540, w:810, h:440}, {x:930, y:540, w:810, h:440}], tema: [{id:'F1', nama:'Kartu Pos', src:'./assets/frames/F_tema1.png'}] },
    'Layout_G': { nama: 'Layout G (3 Pose)', icon: './assets/icons/icon_G.png', kotak: 3, w: 1800, h: 1200, maxFoto: 3, lubang: [{x:60, y:60, w:810, h:440}, {x:60, y:540, w:810, h:440}, {x:930, y:60, w:810, h:650}], tema: [{id:'G1', nama:'Jurnal', src:'./assets/frames/G_tema1.png'}] },
    'Layout_H': { nama: 'Layout H (3 Pose)', icon: './assets/icons/icon_H.png', kotak: 3, w: 1800, h: 1200, maxFoto: 3, lubang: [{x:60, y:60, w:810, h:650}, {x:60, y:750, w:810, h:390}, {x:930, y:750, w:810, h:390}], tema: [{id:'H1', nama:'Jurnal Balik', src:'./assets/frames/H_tema1.png'}] },
    'Layout_I': { nama: 'Layout I (2 Pose)', icon: './assets/icons/icon_I.png', kotak: 2, w: 1800, h: 1200, maxFoto: 2, lubang: [{x:60, y:60, w:810, h:500}, {x:60, y:600, w:810, h:500}], tema: [{id:'I1', nama:'Samping', src:'./assets/frames/I_tema1.png'}] },
    'Layout_J': { nama: 'Layout J (2 Pose)', icon: './assets/icons/icon_J.png', kotak: 2, w: 1800, h: 1200, maxFoto: 2, lubang: [{x:60, y:60, w:810, h:650}, {x:930, y:60, w:810, h:650}], tema: [{id:'J1', nama:'Sejajar', src:'./assets/frames/J_tema1.png'}] },
    'Layout_K': { nama: 'Layout K (Susun)', icon: './assets/icons/icon_K.png', kotak: 2, w: 1200, h: 1800, maxFoto: 2, lubang: [{x:80, y:80, w:1040, h:700}, {x:80, y:840, w:1040, h:700}], tema: [{id:'K1', nama:'Portrait', src:'./assets/frames/K_tema1.png'}] },
    'Layout_L': { nama: 'Layout L (Full)', icon: './assets/icons/icon_L.png', kotak: 1, w: 1800, h: 1200, maxFoto: 1, lubang: [{x:80, y:80, w:1640, h:860}], tema: [{id:'L1', nama:'Polaroid', src:'./assets/frames/L_tema1.png'}] }
};

window.renderDaftarKisi = function() {
    const wadah = document.getElementById('daftarKisi');
    wadah.innerHTML = '';
    for (const [key, data] of Object.entries(DatabaseAxara)) {
        const aktif = (key === kisiAktif) ? 'pilih' : '';
        wadah.innerHTML += `
            <div class="kisi-card ${aktif}" onclick="pilihKisi('${key}')">
                <div class="icon-kisi-wrapper"><img src="${data.icon}" alt="${data.nama}"></div>
                <span>${data.nama}</span>
            </div>
        `;
    }
};

window.renderDaftarTema = function() {
    const wadah = document.getElementById('daftarBingkai');
    
    // Selalu tambahkan opsi polos di awal menu tema
    const aktifPolos = (!temaAktif || temaAktif === 'polos') ? 'pilih' : '';
    wadah.innerHTML = `
        <div class="item-card ${aktifPolos} flex flex-col justify-center border-dashed" onclick="pilihTema('polos')">
            <div class="w-full h-[90px] mb-1.5 flex items-center justify-center text-slate-300 text-3xl"><i class="fa-solid fa-ban"></i></div>
            <span>Tanpa Bingkai</span>
        </div>
    `;
    
    DatabaseAxara[kisiAktif].tema.forEach(t => {
        const aktif = (t.id === temaAktif) ? 'pilih' : '';
        wadah.innerHTML += `
            <div class="item-card ${aktif}" onclick="pilihTema('${t.id}')">
                <img src="${t.src}" onerror="this.src='https://via.placeholder.com/80?text=Tema'">
                <span>${t.nama}</span>
            </div>
        `;
    });
};

window.pilihKisi = function(key) {
    kisiAktif = key;
    temaAktif = null; // KEMBALIKAN KE MODE POLOS
    renderDaftarKisi();
    renderDaftarTema();
    
    if(modeAktif === 'edit') {
        const batas = DatabaseAxara[kisiAktif].maxFoto;
        if(alokasiFoto.length > batas) alokasiFoto = alokasiFoto.slice(0, batas);
        if(typeof tampilkanGaleriBawah === 'function') tampilkanGaleriBawah();
        renderKanvas();
    }
};

window.pilihTema = function(id) {
    temaAktif = id;
    renderDaftarTema();
    if(modeAktif === 'edit') renderKanvas();
};