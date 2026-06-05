// ====== assets/js/app.js ======
var modeAktif = 'kamera'; 
var kisiAktif = 'Layout_A';
var temaAktif = null; 
var filterAktif = 'f-normal';
var waktuTimer = 3;

var jepretanMentah = []; 
var alokasiFoto = []; 

var isMirrored = true;
var warnaLatarAktif = '#e2e8f0';
var zoomSaatIni = 100;

var kanvasTangkapan = document.createElement('canvas');

function getVideoLayar() { return document.getElementById('videoLayar'); }
function getKanvasFinal() { return document.getElementById('kanvasFinal'); }
function getKanvasTemp() { return kanvasTangkapan; }

window.addEventListener('DOMContentLoaded', () => {
    setupMenuSamping();
    
    // Inisialisasi Kuas Ditunda Sedikit agar Kanvas Sudah Di-render
    setTimeout(() => {
        initCoretanKuas(); 
    }, 500);

    if(typeof renderDaftarKisi === 'function') renderDaftarKisi();
    if(typeof renderDaftarTema === 'function') renderDaftarTema();
    if(typeof renderDaftarFilter === 'function') renderDaftarFilter();
    if(typeof renderDaftarStiker === 'function') renderDaftarStiker();
    if(typeof nyalakanKamera === 'function') nyalakanKamera();
});

function setupMenuSamping() {
    document.querySelectorAll('.sidebar-tools .menu-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.sidebar-tools .menu-btn').forEach(b => b.classList.remove('aktif'));
            document.querySelectorAll('.popup-panel').forEach(p => p.classList.remove('aktif'));
            this.classList.add('aktif');
            const target = document.getElementById(this.dataset.target);
            if(target) target.classList.add('aktif');
        });
    });

    document.querySelectorAll('.tutup-popup').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.popup-panel').classList.remove('aktif');
            document.querySelectorAll('.sidebar-tools .menu-btn').forEach(b => b.classList.remove('aktif'));
        });
    });
}

// PERBAIKAN CERMIN (ANTI GAGAL: Menggunakan Inline Transform)
window.toggleMirror = function() {
    isMirrored = !isMirrored;
    const vid = getVideoLayar();
    const teks = document.getElementById('teksMirror');
    if(vid) {
        vid.style.transform = isMirrored ? 'scaleX(-1)' : 'scaleX(1)';
    }
    if(teks) {
        teks.innerText = isMirrored ? 'Cermin: ON' : 'Cermin: OFF';
    }
};

window.aturZoom = function(nilai) {
    zoomSaatIni += nilai;
    if(zoomSaatIni < 40) zoomSaatIni = 40;   
    if(zoomSaatIni > 300) zoomSaatIni = 300; 
    
    const angka = document.getElementById('zoomAngka');
    if(angka) angka.innerText = zoomSaatIni + '%';
    
    const wrapper = document.getElementById('areaKanvasWrapper');
    if(wrapper) {
        const tinggiDasar = 500; 
        wrapper.style.height = (tinggiDasar * (zoomSaatIni / 100)) + 'px';
    }
};

window.ubahLatar = function(warna) {
    warnaLatarAktif = warna;
    if(typeof renderKanvas === 'function') renderKanvas();
};

window.tambahTeksKustom = function() {
    const teksInput = document.getElementById('inputTeksHiasan');
    const warnaInput = document.getElementById('warnaTeksHiasan');
    const fontInput = document.getElementById('fontTeksHiasan');
    
    if(!teksInput || !warnaInput || !fontInput) return;
    
    const teks = teksInput.value;
    const warna = warnaInput.value;
    const font = fontInput.value;
    
    if(!teks.trim()) { alert("Ketikan sesuatu terlebih dahulu!"); return; }

    const cTeks = document.createElement('canvas');
    const cCtx = cTeks.getContext('2d');
    cCtx.font = `bold 100px ${font}`;
    const ukuranM = cCtx.measureText(teks);
    cTeks.width = ukuranM.width + 60; 
    cTeks.height = 150; 

    cCtx.font = `bold 100px ${font}`;
    cCtx.textAlign = 'center';
    cCtx.textBaseline = 'middle';
    cCtx.strokeStyle = '#ffffff';
    cCtx.lineWidth = 15;
    cCtx.strokeText(teks, cTeks.width/2, cTeks.height/2);
    cCtx.fillStyle = warna;
    cCtx.fillText(teks, cTeks.width/2, cTeks.height/2);

    if(typeof tambahStiker === 'function') tambahStiker(cTeks.toDataURL('image/png'));
    
    teksInput.value = '';
    const btnTutup = document.querySelector('#panelTeks .tutup-popup');
    if(btnTutup) btnTutup.click();
};

// ================= PERBAIKAN KUAS CORETAN =================
let ctxCoretan = null;
let isSedangCoret = false;
let cxTerakhir = 0; let cyTerakhir = 0;

function initCoretanKuas() {
    const c = document.getElementById('canvasCoretan');
    if(!c) return;
    ctxCoretan = c.getContext('2d');
    
    const dapatkanPosisiKuas = (e) => {
        const rect = c.getBoundingClientRect();
        const evt = e.touches ? e.touches[0] : e;
        
        // Perbaikan presisi skala dari koordinat mouse ke koordinat Canvas internal
        const scaleX = c.width / rect.width;
        const scaleY = c.height / rect.height;
        return { 
            x: (evt.clientX - rect.left) * scaleX, 
            y: (evt.clientY - rect.top) * scaleY 
        };
    };

    const mulaiCoret = (e) => {
        if(c.style.pointerEvents === 'none') return;
        isSedangCoret = true;
        const pos = dapatkanPosisiKuas(e);
        cxTerakhir = pos.x; cyTerakhir = pos.y;
        
        ctxCoretan.beginPath();
        const ukuran = document.getElementById('ukuranKuas') ? document.getElementById('ukuranKuas').value : 8;
        const warna = document.getElementById('warnaKuas') ? document.getElementById('warnaKuas').value : '#db2777';
        
        ctxCoretan.arc(cxTerakhir, cyTerakhir, ukuran / 2, 0, Math.PI * 2);
        ctxCoretan.fillStyle = warna;
        ctxCoretan.fill();
    };

    const prosesCoret = (e) => {
        if(!isSedangCoret || c.style.pointerEvents === 'none') return;
        e.preventDefault(); 
        const pos = dapatkanPosisiKuas(e);
        
        const ukuran = document.getElementById('ukuranKuas') ? document.getElementById('ukuranKuas').value : 8;
        const warna = document.getElementById('warnaKuas') ? document.getElementById('warnaKuas').value : '#db2777';

        ctxCoretan.beginPath();
        ctxCoretan.moveTo(cxTerakhir, cyTerakhir);
        ctxCoretan.lineTo(pos.x, pos.y);
        ctxCoretan.strokeStyle = warna;
        ctxCoretan.lineWidth = ukuran;
        ctxCoretan.lineCap = 'round';
        ctxCoretan.lineJoin = 'round';
        ctxCoretan.stroke();
        cxTerakhir = pos.x; cyTerakhir = pos.y;
    };

    const stopCoret = () => { isSedangCoret = false; };

    c.addEventListener('mousedown', mulaiCoret);
    c.addEventListener('mousemove', prosesCoret);
    window.addEventListener('mouseup', stopCoret);
    
    c.addEventListener('touchstart', mulaiCoret, {passive: false});
    c.addEventListener('touchmove', prosesCoret, {passive: false});
    window.addEventListener('touchend', stopCoret);
}

window.toggleModeKuas = function(aktif) {
    const c = document.getElementById('canvasCoretan');
    const s = document.getElementById('stikerOverlay');
    if(c && s) {
        if(aktif) {
            c.style.pointerEvents = 'auto';
            s.style.pointerEvents = 'none';
            // Kunci semua stiker agar tidak bisa digeser saat sedang corat-coret
            const stikers = document.querySelectorAll('.stiker-item');
            stikers.forEach(el => el.style.pointerEvents = 'none');
        } else {
            c.style.pointerEvents = 'none';
            s.style.pointerEvents = 'none'; // Overlay selalu none agar tembus ke bawah
            // Buka akses stiker
            const stikers = document.querySelectorAll('.stiker-item');
            stikers.forEach(el => el.style.pointerEvents = 'auto');
        }
    }
};

window.hapusCoretan = function() {
    const c = document.getElementById('canvasCoretan');
    if(c && ctxCoretan) ctxCoretan.clearRect(0, 0, c.width, c.height);
};

// ================= MANAJEMEN MENU & RENDER =================

window.masukModeEdit = function() {
    modeAktif = 'edit';
    
    const bKamera = document.getElementById('blokKamera');
    if(bKamera) bKamera.classList.add('hidden');
    
    const bEditor = document.getElementById('blokEditor');
    if(bEditor) {
        bEditor.classList.remove('hidden');
        bEditor.classList.add('flex');
    }
    
    const gLive = document.getElementById('galeriKameraLive');
    if(gLive) gLive.classList.add('hidden');
    
    const gMentah = document.getElementById('galeriMentah');
    if(gMentah) gMentah.classList.remove('hidden');
    
    const tJudul = document.getElementById('teksJudul');
    if(tJudul) tJudul.innerText = "Ruang Penyuntingan";
    
    const tSub = document.getElementById('teksSubJudul');
    if(tSub) tSub.innerText = "Centang foto dari galeri samping, lalu hiasi dengan stiker dan coretan.";

    const menu = ['btnMenuFilter', 'btnMenuBingkai', 'btnMenuStiker', 'btnMenuLatar', 'btnMenuTeks', 'btnMenuKuas'];
    menu.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            if(id === 'btnMenuFilter') el.classList.add('hidden');
            else el.classList.remove('hidden');
        }
    });
    
    const wAksi = document.getElementById('wadahAksiKamera');
    if(wAksi) wAksi.style.display = 'none';
    
    zoomSaatIni = 100;
    const zAngka = document.getElementById('zoomAngka');
    if(zAngka) zAngka.innerText = '100%';
    
    const wrapper = document.getElementById('areaKanvasWrapper');
    if(wrapper) wrapper.style.height = '500px';

    alokasiFoto = []; 
    tampilkanGaleriBawah();
    
    // PEMAKSAAN UKURAN KANVAS CORETAN SESUAI KISI SAAT MASUK MODE EDIT
    const dataKisi = DatabaseAxara[kisiAktif]; 
    const cKuas = document.getElementById('canvasCoretan');
    if(cKuas && dataKisi) {
        cKuas.width = dataKisi.w;
        cKuas.height = dataKisi.h;
    }

    renderKanvas();
};

window.ulangiSesi = function() {
    if(!confirm('Yakin ingin membuang semua foto dan mengulang dari awal?')) return;
    
    jepretanMentah = []; alokasiFoto = [];
    
    const bEditor = document.getElementById('blokEditor');
    if(bEditor) {
        bEditor.classList.add('hidden');
        bEditor.classList.remove('flex');
    }
    
    const bKamera = document.getElementById('blokKamera');
    if(bKamera) bKamera.classList.remove('hidden');
    
    const gMentah = document.getElementById('galeriMentah');
    if(gMentah) gMentah.classList.add('hidden');
    
    const gLive = document.getElementById('galeriKameraLive');
    if(gLive) {
        gLive.classList.remove('hidden');
        gLive.innerHTML = '<div class="text-center text-slate-400 text-xs mt-10" id="teksTungguFoto"><i class="fa-solid fa-camera text-3xl mb-2 opacity-50"></i><br>Foto jepretan akan muncul di sini.</div>';
    }
    
    const wAksi = document.getElementById('wadahAksiKamera');
    if(wAksi) wAksi.style.display = 'flex';
    
    const bJepret = document.getElementById('btnJepret');
    if(bJepret) bJepret.classList.remove('hidden');

    const tJudul = document.getElementById('teksJudul');
    if(tJudul) tJudul.innerText = "Sesi Pemotretan";
    
    const tSub = document.getElementById('teksSubJudul');
    if(tSub) tSub.innerText = "Atur gaya terbaikmu. Foto akan muncul di sebelah kanan.";
    
    const menu = ['btnMenuFilter', 'btnMenuBingkai', 'btnMenuStiker', 'btnMenuLatar', 'btnMenuTeks', 'btnMenuKuas'];
    menu.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            if(id === 'btnMenuFilter') el.classList.remove('hidden');
            else el.classList.add('hidden');
        }
    });
    
    const overlay = document.getElementById('stikerOverlay');
    if(overlay) overlay.innerHTML = '';
    if(typeof hapusCoretan === 'function') hapusCoretan();
};

window.tampilkanGaleriBawah = function() {
    const wadah = document.getElementById('galeriMentah');
    if(!wadah) return;
    wadah.innerHTML = '';
    jepretanMentah.forEach((src, i) => {
        const dipakai = alokasiFoto.includes(src) ? 'terpakai' : '';
        wadah.innerHTML += `
            <div class="thumb-wrapper ${dipakai}" onclick="window.toggleFoto(${i})">
                <img src="${src}" class="thumb-foto" onerror="this.style.display='none'">
                <div class="centang"><i class="fa-solid fa-check"></i></div>
            </div>
        `;
    });
};

window.toggleFoto = function(index) {
    const src = jepretanMentah[index];
    const maxFoto = DatabaseAxara[kisiAktif].maxFoto; 
    const pos = alokasiFoto.indexOf(src);
    
    if(pos > -1) alokasiFoto.splice(pos, 1); 
    else if(alokasiFoto.length < maxFoto) alokasiFoto.push(src); 
    
    tampilkanGaleriBawah();
    renderKanvas();
};

window.renderKanvas = function(gambarTema = true) {
    return new Promise((resolve) => {
        const kanvas = getKanvasFinal();
        if(!kanvas) return resolve();
        
        const ctx = kanvas.getContext('2d');
        const dataKisi = DatabaseAxara[kisiAktif]; 
        
        kanvas.width = dataKisi.w; kanvas.height = dataKisi.h;
        
        // Menjaga Coretan jika Kanvas berubah ukuran
        const cKuas = document.getElementById('canvasCoretan');
        if(cKuas && cKuas.width !== dataKisi.w && cKuas.width > 0) {
            const arsipCoret = document.createElement('canvas');
            arsipCoret.width = cKuas.width; arsipCoret.height = cKuas.height;
            arsipCoret.getContext('2d').drawImage(cKuas, 0, 0);
            
            cKuas.width = dataKisi.w; cKuas.height = dataKisi.h;
            ctxCoretan.drawImage(arsipCoret, 0, 0, dataKisi.w, dataKisi.h);
        }

        const pembungkus = document.getElementById('areaKanvasWrapper');
        if (pembungkus) pembungkus.style.aspectRatio = `${dataKisi.w} / ${dataKisi.h}`;

        ctx.fillStyle = warnaLatarAktif; 
        ctx.fillRect(0, 0, kanvas.width, kanvas.height);
        
        ctx.fillStyle = "#ffffff"; 
        dataKisi.lubang.forEach(l => ctx.fillRect(l.x, l.y, l.w, l.h));

        function sematkanStikerDanCoretanKeKanvas() {
            if(cKuas) ctx.drawImage(cKuas, 0, 0, kanvas.width, kanvas.height);

            const overlay = document.getElementById('stikerOverlay');
            if(overlay) {
                const sekumpulanStiker = overlay.querySelectorAll('.stiker-item');
                if(sekumpulanStiker.length > 0) {
                    const ukuranLayar = overlay.getBoundingClientRect();
                    const skalaX = kanvas.width / ukuranLayar.width;
                    const skalaY = kanvas.height / ukuranLayar.height;

                    sekumpulanStiker.forEach(el => {
                        const gambarMurni = el.querySelector('img');
                        const batasanEl = el.getBoundingClientRect();
                        const posisiX = (batasanEl.left - ukuranLayar.left) * skalaX;
                        const posisiY = (batasanEl.top - ukuranLayar.top) * skalaY;
                        const ukuranW = batasanEl.width * skalaX;
                        const ukuranH = batasanEl.height * skalaY;
                        ctx.drawImage(gambarMurni, posisiX, posisiY, ukuranW, ukuranH);
                    });
                }
            }

            const waktuSekarang = new Date();
            const formatWaktu = waktuSekarang.toLocaleDateString('id-ID', { year:'numeric', month:'short', day:'numeric' }) + " " + waktuSekarang.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' });
            
            ctx.font = "bold 16px 'Courier New', Courier, monospace";
            ctx.textAlign = "right";
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.shadowColor = "rgba(0, 0, 0, 0.6)"; 
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.fillText(`AXARA BOOTH • ${formatWaktu}`, kanvas.width - 20, kanvas.height - 20);
            ctx.shadowColor = "transparent";
        }

        if (alokasiFoto.length === 0) {
            if (gambarTema) prosesTimpaBingkai(); else resolve(kanvas.toDataURL('image/png'));
            return;
        }
        
        let digambar = 0;
        
        function akhiriSatuFoto() {
            digambar++;
            if(digambar === alokasiFoto.length) {
                if (gambarTema) prosesTimpaBingkai(); else resolve(kanvas.toDataURL('image/png')); 
            }
        }

        for(let i = 0; i < alokasiFoto.length; i++) {
            const img = new Image(); img.src = alokasiFoto[i];
            img.onload = () => {
                if (!img.width || !img.height) { akhiriSatuFoto(); return; }

                const lubang = dataKisi.lubang[i];
                const rLubang = lubang.w / lubang.h, rImg = img.width / img.height;
                let sx, sy, sw, sh;
                if (rImg > rLubang) { sh = img.height; sw = img.height * rLubang; sx = (img.width - sw) / 2; sy = 0; } 
                else { sw = img.width; sh = img.width / rLubang; sx = 0; sy = (img.height - sh) / 2; }

                ctx.drawImage(img, sx, sy, sw, sh, lubang.x, lubang.y, lubang.w, lubang.h);
                akhiriSatuFoto();
            };
            img.onerror = () => { akhiriSatuFoto(); }
        }

        function prosesTimpaBingkai() {
            if(!temaAktif || temaAktif === 'polos') { 
                sematkanStikerDanCoretanKeKanvas(); 
                resolve(kanvas.toDataURL('image/png')); 
                return; 
            }
            
            const temaData = dataKisi.tema.find(t => t.id === temaAktif);
            if(!temaData) { sematkanStikerDanCoretanKeKanvas(); resolve(kanvas.toDataURL('image/png')); return; }
            
            const bingkai = new Image(); bingkai.src = temaData.src;
            bingkai.onload = () => { 
                ctx.drawImage(bingkai, 0, 0, kanvas.width, kanvas.height); 
                sematkanStikerDanCoretanKeKanvas(); 
                resolve(kanvas.toDataURL('image/png')); 
            };
            bingkai.onerror = () => { sematkanStikerDanCoretanKeKanvas(); resolve(kanvas.toDataURL('image/png')); };
        }
    });
};

window.simpanKeServer = async function() {
    const maxFoto = DatabaseAxara[kisiAktif].maxFoto;
    if(alokasiFoto.length < maxFoto) {
        alert(`Harap centang tepat ${maxFoto} foto dari galeri samping.`); return;
    }
    const ll = document.getElementById('layarLoading');
    if(ll) ll.style.display = 'flex';

    const dataMentah = await renderKanvas(false);
    const dataFrame = await renderKanvas(true);

    const dataForm = new FormData();
    dataForm.append('foto_frame', dataFrame);
    dataForm.append('foto_mentah', dataMentah);

    fetch('simpan.php', { method: 'POST', body: dataForm })
    .then(res => res.json())
    .then(data => {
        if(ll) ll.style.display = 'none';
        if (data.sukses) { buatBarcodeUnduhan(data.id_sesi); } 
    }).catch(error => {
        if(ll) ll.style.display = 'none';
        alert("Gagal koneksi ke server.");
    });
};

window.ledakanConfetti = function() {
    const warna = ['#db2777', '#f472b6', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
    for(let i=0; i<120; i++) {
        let conf = document.createElement('div');
        conf.style.position = 'fixed';
        conf.style.width = Math.random() * 8 + 6 + 'px';
        conf.style.height = Math.random() * 12 + 6 + 'px';
        conf.style.backgroundColor = warna[Math.floor(Math.random() * warna.length)];
        conf.style.left = '50%';
        conf.style.top = '50%';
        conf.style.zIndex = '9999';
        conf.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        conf.style.pointerEvents = 'none';
        document.body.appendChild(conf);

        let sudut = Math.random() * Math.PI * 2;
        let kecepatan = Math.random() * 18 + 10;
        let vx = Math.cos(sudut) * kecepatan;
        let vy = Math.sin(sudut) * kecepatan;
        let rotasi = 0;
        let gravitasi = 0.5;

        function gerak() {
            vy += gravitasi;
            let xSkrg = parseFloat(conf.style.left);
            let ySkrg = parseFloat(conf.style.top);
            conf.style.left = (xSkrg + vx) + 'px';
            conf.style.top = (ySkrg + vy) + 'px';
            rotasi += 15;
            conf.style.transform = `translate(-50%, -50%) rotate(${rotasi}deg)`;
            
            if(ySkrg < window.innerHeight + 50) {
                requestAnimationFrame(gerak);
            } else {
                conf.remove();
            }
        }
        requestAnimationFrame(gerak);
    }
};

function buatBarcodeUnduhan(idSesi) {
    const urlAkses = window.location.origin + window.location.pathname.replace('index.php', '') + "output.php?sesi=" + idSesi;
    const containerQr = document.getElementById('qrcode');
    if(containerQr) {
        containerQr.innerHTML = '';
        new QRCode(containerQr, { text: urlAkses, width: 220, height: 220, colorDark : "#1e293b", colorLight : "#ffffff", correctLevel : QRCode.CorrectLevel.H });
    }
    const area = document.getElementById('area-hasil');
    if(area) area.style.display = 'block';
    
    const kaca = document.querySelector('.glass-container');
    if(kaca) kaca.style.filter = 'blur(10px)';
    
    ledakanConfetti();
    setTimeout(ledakanConfetti, 400);
}