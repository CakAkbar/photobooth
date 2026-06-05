// ====== assets/js/kamera.js ======

window.mainkanSuara = function(tipe) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        if(tipe === 'beep') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); 
            gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
            oscillator.start();
            setTimeout(() => { oscillator.stop(); audioCtx.close(); }, 150);
        } else if(tipe === 'shutter') {
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(120, audioCtx.currentTime); 
            gainNode.gain.setValueAtTime(0.8, audioCtx.currentTime);
            oscillator.start();
            setTimeout(() => { oscillator.stop(); audioCtx.close(); }, 180);
        }
    } catch(e) {}
};

window.pilihTimer = function(elemen, detik) {
    document.querySelectorAll('.timer-btn').forEach(b => b.classList.remove('aktif'));
    elemen.classList.add('aktif');
    waktuTimer = detik;
};

window.nyalakanKamera = async function() {
    try {
        const vid = getVideoLayar();
        if(!vid) return;
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: {ideal: 1920}, height: {ideal: 1080}, facingMode: "user" }, audio: false 
        });
        vid.srcObject = stream;
        
        vid.className = filterAktif; 
        vid.style.transform = isMirrored ? 'scaleX(-1)' : 'scaleX(1)';
        
        await vid.play();
        vid.onloadedmetadata = () => {
            const kanvTemp = getKanvasTemp();
            kanvTemp.width = vid.videoWidth || 1280; 
            kanvTemp.height = vid.videoHeight || 720;
        };
    } catch (e) { alert("Kamera gagal diakses."); }
};

window.mulaiSesi = function() {
    const btnJepret = document.getElementById('btnJepret');
    if(btnJepret) btnJepret.classList.add('hidden');
    
    document.querySelectorAll('.popup-panel').forEach(p => p.classList.remove('aktif'));
    document.querySelectorAll('.sidebar-tools .menu-btn').forEach(b => b.classList.remove('aktif'));
    
    const wadahLive = document.getElementById('galeriKameraLive');
    if(wadahLive) wadahLive.innerHTML = '';
    
    jepretanMentah = [];
    let hitunganFoto = 0;

    function prosesHitungMundur() {
        if(hitunganFoto >= 10) { 
            if(typeof masukModeEdit === 'function') masukModeEdit();
            return; 
        }
        
        let sisaDetik = waktuTimer;
        const teksEl = document.getElementById('teksHitungMundur');
        if(teksEl) {
            teksEl.classList.remove('hidden');
            teksEl.innerText = sisaDetik;
        }
        mainkanSuara('beep');

        const interval = setInterval(() => {
            sisaDetik--;
            if(sisaDetik > 0) { 
                if(teksEl) teksEl.innerText = sisaDetik; 
                mainkanSuara('beep');
            } else {
                clearInterval(interval);
                if(teksEl) {
                    teksEl.innerText = ""; 
                    teksEl.classList.add('hidden');
                }
                
                setTimeout(() => {
                    eksekusiJepret();
                    hitunganFoto++;
                    setTimeout(prosesHitungMundur, 2000); 
                }, 100); 
            }
        }, 1000);
    }
    prosesHitungMundur();
};

function eksekusiJepret() {
    mainkanSuara('shutter'); 
    
    const flash = document.getElementById('flash');
    if(flash) {
        flash.style.opacity = '1'; 
        setTimeout(() => flash.style.opacity = '0', 150);
    }

    const vid = getVideoLayar();
    const kTemp = getKanvasTemp();
    if(!vid || !kTemp) return;
    
    const cw = vid.videoWidth || 1280;
    const ch = vid.videoHeight || 720;
    
    kTemp.width = cw; 
    kTemp.height = ch; 
    
    const cTemp = kTemp.getContext('2d');
    const computedFilter = getComputedStyle(vid).filter;
    cTemp.filter = (computedFilter !== 'none' && computedFilter !== '') ? computedFilter : 'none'; 
    
    cTemp.save();
    if(isMirrored) { 
        cTemp.translate(cw, 0); 
        cTemp.scale(-1, 1); 
    }
    cTemp.drawImage(vid, 0, 0, cw, ch);
    cTemp.restore();
    cTemp.filter = "none"; 

    const urlGambar = kTemp.toDataURL('image/jpeg', 0.9);
    jepretanMentah.push(urlGambar);
    
    const wadahLive = document.getElementById('galeriKameraLive');
    if(wadahLive) {
        const wrapper = document.createElement('div');
        wrapper.className = 'thumb-wrapper anim-muncul mb-3';
        
        const imgEl = document.createElement('img');
        imgEl.src = urlGambar; 
        imgEl.className = 'thumb-foto';
        
        wrapper.appendChild(imgEl);
        wadahLive.appendChild(wrapper);
        wadahLive.scrollTop = wadahLive.scrollHeight;
    }
}