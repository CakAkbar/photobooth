// ====== assets/js/stiker.js ======
const totalStiker = 86; 

window.renderDaftarStiker = function() {
    const wadah = document.getElementById('daftarStiker');
    wadah.innerHTML = '';
    
    for (let i = 1; i <= totalStiker; i++) {
        const namaFile = `sticker${i}.png`;
        wadah.innerHTML += `
            <div class="item-card flex items-center justify-center h-20 cursor-pointer" onclick="tambahStiker('./assets/stickers/${namaFile}')">
                <img src="./assets/stickers/${namaFile}" class="max-h-full max-w-full object-contain drop-shadow-md">
            </div>
        `;
    }
};

window.tambahStiker = function(src) {
    const overlay = document.getElementById('stikerOverlay');
    if(!overlay) return;

    const box = document.createElement('div');
    box.className = 'stiker-item absolute group cursor-move pointer-events-auto';
    box.style.width = '25%'; // Pakai persentase agar ikut membesar saat di zoom
    box.style.height = 'auto';
    box.style.left = '50%';
    box.style.top = '50%';
    box.style.transform = 'translate(-50%, -50%)';

    box.innerHTML = `
        <img src="${src}" class="w-full h-full object-contain pointer-events-none drop-shadow-lg">
        
        <div class="hapus-btn absolute -top-3 -right-3 bg-rose-500 text-white w-7 h-7 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 shadow-md transition z-10" onclick="this.parentElement.remove()">
            <i class="fa-solid fa-times text-xs"></i>
        </div>
        
        <div class="resize-btn absolute -bottom-3 -right-3 bg-sky-500 text-white w-7 h-7 rounded-full flex items-center justify-center cursor-se-resize opacity-0 group-hover:opacity-100 shadow-md transition z-10">
            <i class="fa-solid fa-expand text-xs"></i>
        </div>
    `;

    overlay.appendChild(box);
    aktifkanAksiInteraktif(box);
};

function aktifkanAksiInteraktif(el) {
    let sedangGeser = false, sedangUkuran = false;
    let mulaiX, mulaiY, awalW, awalH, awalKiri, awalAtas;

    const tombolUbah = el.querySelector('.resize-btn');
    const ambilPosisi = (e) => e.touches ? e.touches[0] : e;

    const pemicuAksi = (e, modeUkuran) => {
        if(!modeUkuran && (e.target.closest('.hapus-btn') || e.target.closest('.resize-btn'))) return;
        
        if(modeUkuran) { sedangUkuran = true; e.stopPropagation(); } 
        else { sedangGeser = true; }
        
        const pos = ambilPosisi(e);
        mulaiX = pos.clientX; mulaiY = pos.clientY;
        
        if(!modeUkuran) {
            const kotak = el.getBoundingClientRect();
            const kotakInduk = el.parentElement.getBoundingClientRect();
            awalKiri = kotak.left - kotakInduk.left;
            awalAtas = kotak.top - kotakInduk.top;
            
            el.style.transform = 'none';
            el.style.left = awalKiri + 'px';
            el.style.top = awalAtas + 'px';
        } else {
            awalW = el.offsetWidth; awalH = el.offsetHeight;
        }
    };

    el.addEventListener('mousedown', (e) => pemicuAksi(e, false));
    el.addEventListener('touchstart', (e) => pemicuAksi(e, false), {passive: false});
    tombolUbah.addEventListener('mousedown', (e) => pemicuAksi(e, true));
    tombolUbah.addEventListener('touchstart', (e) => pemicuAksi(e, true), {passive: false});

    const prosesAksi = (e) => {
        if(!sedangGeser && !sedangUkuran) return;
        const pos = ambilPosisi(e);
        const jarakX = pos.clientX - mulaiX;
        const jarakY = pos.clientY - mulaiY;

        if(sedangGeser) {
            el.style.left = (awalKiri + jarakX) + 'px';
            el.style.top = (awalAtas + jarakY) + 'px';
        } else if(sedangUkuran) {
            const dimensiBaru = Math.max(40, awalW + jarakX); 
            el.style.width = dimensiBaru + 'px';
            el.style.height = (awalH * (dimensiBaru / awalW)) + 'px'; 
        }
    };

    document.addEventListener('mousemove', prosesAksi);
    document.addEventListener('touchmove', prosesAksi, {passive: false});

    // FUNGSI KONVERSI: Mengunci Piksel ke Persentase Setelah Selesai Ditarik
    const akhiriAksi = () => { 
        if(sedangGeser || sedangUkuran) {
            const kotakInduk = el.parentElement.getBoundingClientRect();
            const kotak = el.getBoundingClientRect();
            
            // Konversi px ke % agar saat bingkai di-zoom, stiker tidak kabur
            const pKiri = ((kotak.left - kotakInduk.left) / kotakInduk.width) * 100;
            const pAtas = ((kotak.top - kotakInduk.top) / kotakInduk.height) * 100;
            const pLebar = (kotak.width / kotakInduk.width) * 100;
            const pTinggi = (kotak.height / kotakInduk.height) * 100;
            
            el.style.left = pKiri + '%';
            el.style.top = pAtas + '%';
            el.style.width = pLebar + '%';
            el.style.height = pTinggi + '%';
            el.style.transform = 'none'; 
        }
        sedangGeser = false; 
        sedangUkuran = false; 
    };
    
    document.addEventListener('mouseup', akhiriAksi);
    document.addEventListener('touchend', akhiriAksi);
}