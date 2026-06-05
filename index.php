<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Axara Booth - Premium Experience</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <style>
        body { background: #fdfdfd; background-image: radial-gradient(at 10% 20%, rgba(255, 228, 230, 0.4) 0px, transparent 50%), radial-gradient(at 90% 80%, rgba(224, 242, 254, 0.5) 0px, transparent 50%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; overflow: hidden; }
        .glass-container { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(25px); border: 1px solid rgba(255, 255, 255, 0.5); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.03); border-radius: 24px; }

        .sidebar-menu { display: flex; flex-direction: column; width: 95px; background: white; padding: 20px 10px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); z-index: 999; flex-shrink: 0; position: relative; }
        .sidebar-tools { flex: 1; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; overflow-x: hidden; padding-right: 4px; }
        .sidebar-actions { flex-shrink: 0; display: flex; flex-direction: column; gap: 10px; border-top: 2px solid #f1f5f9; padding-top: 15px; margin-top: 10px; }
        
        .menu-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 65px; border-radius: 14px; color: #94a3b8; transition: all 0.25s ease; cursor: pointer; border: none; background: transparent; flex-shrink: 0; }
        .menu-btn:hover { color: #db2777; background: #fff1f2; }
        .menu-btn.aktif { color: #db2777; background: #ffe4e6; box-shadow: 0 4px 12px rgba(219, 39, 119, 0.15); }
        .menu-btn i { font-size: 22px; margin-bottom: 5px; }
        .menu-btn span { font-size: 11px; font-weight: 600; line-height: 1; }

        .btn-aksi { color: white; background: #db2777; box-shadow: 0 4px 15px rgba(219, 39, 119, 0.25); z-index: 1000; position: relative; }
        .btn-aksi:hover { background: #be185d; color: white; transform: translateY(-2px); }

        .popup-panel { position: absolute; left: 130px; top: 50%; transform: translateY(-50%); background: white; border-radius: 24px; padding: 24px; width: 350px; max-height: 85vh; overflow-y: auto; box-shadow: 0 20px 45px rgba(0,0,0,0.08); z-index: 40; display: none; border: 1px solid #f1f5f9; }
        .popup-panel.aktif { display: block; animation: slideIn 0.25s ease; }
        @keyframes slideIn { from { opacity: 0; transform: translate(-25px, -50%); } to { opacity: 1; transform: translate(0, -50%); } }

        .kisi-card { background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 16px; padding: 12px; cursor: pointer; transition: all 0.2s ease; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
        .kisi-card:hover { border-color: #fbcfe8; background: #fff1f2; }
        .kisi-card.pilih { border-color: #db2777; background: #fff1f2; box-shadow: 0 4px 12px rgba(219, 39, 119, 0.1); }
        .icon-kisi-wrapper { width: 100%; height: 90px; display: flex; justify-content: center; align-items: center; margin-bottom: 5px; }
        .icon-kisi-wrapper img { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .item-card { border: 2px solid #f1f5f9; border-radius: 14px; padding: 12px; cursor: pointer; transition: 0.2s; text-align: center; background: #f8fafc; }
        .item-card:hover { border-color: #fbcfe8; }
        .item-card.pilih { border-color: #db2777; background: #fff1f2; }
        .item-card img { width: 100%; height: 90px; object-fit: contain; border-radius: 8px; margin-bottom: 6px; }
        .item-card span { font-size: 11px; font-weight: 600; color: #475569; }

        .ruang-kerja { display: flex; flex-direction: column; width: 100%; height: 100%; background: #f8fafc; border-radius: 20px; padding: 20px; box-sizing: border-box; }
        .ruang-konten { display: flex; flex-direction: row; width: 100%; height: calc(100% - 40px); gap: 20px; overflow: hidden; }
        
        .kiri-utama { flex: 1; display: flex; flex-direction: column; position: relative; height: 100%; background: #1e293b; border-radius: 16px; overflow: hidden; }
        .kiri-kanvas { background: #f1f5f9; border: 1px solid #cbd5e1; align-items: center; justify-content: center; } 
        
        .kanan-galeri { width: 160px; display: flex; flex-direction: column; height: 100%; flex-shrink: 0; }
        .galeri-samping { flex: 1; overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column; gap: 12px; background: rgba(255,255,255,0.8); padding: 15px 10px; border-radius: 16px; border: 1px solid #e2e8f0; align-items: center; box-shadow: 0 5px 20px rgba(0,0,0,0.02); }

        .btn-bawah-kanvas { padding: 12px 30px; border-radius: 30px; font-weight: bold; font-size: 14px; display: flex; align-items: center; gap: 10px; border: none; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .btn-bawah-kanvas:hover { transform: translateY(-2px); }
        .btn-bawah-primer { background: #db2777; color: white; box-shadow: 0 4px 15px rgba(219, 39, 119, 0.25); }
        .btn-bawah-primer:hover { background: #be185d; }
        .btn-bawah-sekunder { background: #334155; color: white; box-shadow: 0 4px 15px rgba(51, 65, 85, 0.25); }
        .btn-bawah-sekunder:hover { background: #1e293b; }

        /* Kamera: CSS khusus Mirror dihapus, karena akan diurus langsung oleh JavaScript Inline Style agar anti gagal */
        #videoLayar { width: 100%; height: 100%; object-fit: cover; transition: filter 0.3s; transform: scaleX(-1); }
        
        .top-bar { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 12px; z-index: 50; align-items: center; }
        .timer-btn { background: white; border: 1px solid #e2e8f0; padding: 8px 20px; border-radius: 30px; font-weight: 600; font-size: 12px; cursor: pointer; color: #64748b; transition: 0.2s; white-space: nowrap; }
        .timer-btn.aktif { color: #db2777; border-color: #db2777; box-shadow: 0 4px 10px rgba(219, 39, 119, 0.15); }
        #flash { position: absolute; inset: 0; background: white; opacity: 0; pointer-events: none; z-index: 99; transition: 0.1s; }
        .anim-muncul { animation: popIn 0.5s ease forwards; }
        @keyframes popIn { 0% { transform: scale(0.3); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

        .zoom-controls { position: absolute; top: 15px; right: 15px; z-index: 50; display: flex; gap: 8px; background: rgba(255,255,255,0.9); padding: 8px; border-radius: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); backdrop-filter: blur(5px); align-items: center; }
        .btn-zoom { width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; background: white; border-radius: 50%; color: #334155; box-shadow: 0 2px 5px rgba(0,0,0,0.08); border: none; cursor: pointer; transition: 0.2s; font-size: 16px; }
        .btn-zoom:hover { background: #db2777; color: white; }
        
        .scroll-area-kanvas { flex: 1; overflow: auto; display: flex; justify-content: center; align-items: flex-start; padding: 40px; }
        #areaKanvasWrapper { position: relative; height: 500px; flex-shrink: 0; box-shadow: 0 15px 35px rgba(0,0,0,0.15); border-radius: 8px; background: white; transition: height 0.2s ease-out; margin: auto; }
        #kanvasFinal { width: 100%; height: 100%; display: block; border-radius: 8px; pointer-events: none; }
        #canvasCoretan { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 15; border-radius: 8px; pointer-events: none; touch-action: none; } 
        #stikerOverlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: hidden; border-radius: 8px; z-index: 20; }

        .thumb-wrapper { width: 120px; flex-shrink: 0; margin: 0 auto; position: relative; cursor: pointer; }
        .thumb-foto { width: 100%; aspect-ratio: 4 / 3; height: auto; object-fit: cover; border-radius: 8px; border: 3px solid transparent; transition: 0.2s; background: #cbd5e1; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .thumb-wrapper.terpakai .thumb-foto { border-color: #db2777; opacity: 0.85; transform: scale(0.95); }
        .thumb-wrapper .centang { position: absolute; top: -6px; right: 12px; background: #db2777; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; opacity: 0; transition: 0.2s; transform: scale(0.6); box-shadow: 0 2px 6px rgba(0,0,0,0.15); z-index: 10; }
        .thumb-wrapper.terpakai .centang { opacity: 1; transform: scale(1); }

        .f-normal { filter: none; } .f-lembut { filter: blur(0.4px) brightness(1.1) contrast(0.96); } .f-brighten { filter: brightness(1.18) saturate(1.05); } .f-lumiskin { filter: brightness(1.08) contrast(1.08) saturate(1.15) sepia(0.05); } .f-warm { filter: sepia(0.3) saturate(1.2) contrast(1.1) brightness(1.05) hue-rotate(-10deg); } .f-cool { filter: saturate(0.8) contrast(1.1) brightness(1.1) hue-rotate(15deg); } .f-fade { filter: contrast(0.85) brightness(1.1) saturate(0.8); } .f-dramatic { filter: contrast(1.3) saturate(1.2) brightness(0.95); } .f-film { filter: sepia(0.1) saturate(1.3) contrast(1.1) grayscale(0.1); } .f-vintage { filter: sepia(0.55) contrast(1.05) brightness(0.95); } .f-bw { filter: grayscale(100%) contrast(1.25); } .f-noir { filter: grayscale(100%) contrast(1.5) brightness(0.8); }

        #area-hasil { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; display: none; background: rgba(255,255,255,0.96); backdrop-filter: blur(25px); padding: 40px; border-radius: 32px; box-shadow: 0 30px 60px rgba(0,0,0,0.15); z-index: 200; border: 1px solid rgba(255,255,255,0.8); width: 400px; }
        .barcode-wrapper { background: white; padding: 20px; border-radius: 20px; display: inline-block; box-shadow: 0 8px 24px rgba(0,0,0,0.04); margin: 24px 0; }
        .loading-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 150; display: none; justify-content: center; align-items: center; color: white; font-weight: bold; flex-direction: column; gap: 15px; backdrop-filter: blur(4px); }
        .loader { border: 4px solid #f3f3f3; border-top: 4px solid #db2777; border-radius: 50%; width: 45px; height: 45px; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    </style>
</head>
<body class="w-screen h-screen flex items-center justify-center p-4">

    <div class="glass-container w-full h-full max-w-[1350px] flex relative p-4 gap-4">
        
        <div class="sidebar-menu">
            <div class="sidebar-tools custom-scrollbar">
                <button class="menu-btn" id="btnMenuKisi" data-target="panelKisi"><i class="fa-solid fa-border-all"></i><span>Kisi</span></button>
                <button class="menu-btn" id="btnMenuFilter" data-target="panelFilter"><i class="fa-solid fa-wand-magic-sparkles"></i><span>Filter</span></button>
                <button class="menu-btn hidden" id="btnMenuBingkai" data-target="panelBingkai"><i class="fa-solid fa-image"></i><span>Tema</span></button>
                <button class="menu-btn hidden" id="btnMenuStiker" data-target="panelStiker"><i class="fa-solid fa-face-smile"></i><span>Stiker</span></button>
                <button class="menu-btn hidden" id="btnMenuTeks" data-target="panelTeks"><i class="fa-solid fa-font"></i><span>Teks</span></button>
                <button class="menu-btn hidden" id="btnMenuKuas" data-target="panelKuas"><i class="fa-solid fa-paint-brush"></i><span>Kuas</span></button>
                <button class="menu-btn hidden" id="btnMenuLatar" data-target="panelLatar"><i class="fa-solid fa-fill-drip"></i><span>Latar</span></button>
            </div>
            
            <div class="sidebar-actions" id="wadahAksiKamera">
                <button class="menu-btn btn-aksi" id="btnJepret" onclick="window.mulaiSesi()">
                    <i class="fa-solid fa-camera"></i><span>Mulai</span>
                </button>
            </div>
        </div>

        <div class="popup-panel" id="panelKisi"><div class="flex justify-between items-center mb-5"><h3 class="font-bold text-lg text-slate-800">Pilih Kisi</h3><button class="tutup-popup text-gray-400 hover:text-red-500"><i class="fa-solid fa-xmark text-lg"></i></button></div><div class="grid grid-cols-2 gap-3 custom-scrollbar" id="daftarKisi"></div></div>
        <div class="popup-panel" id="panelFilter"><div class="flex justify-between items-center mb-5"><h3 class="font-bold text-lg text-slate-800">Filter Lensa</h3><button class="tutup-popup text-gray-400 hover:text-red-500"><i class="fa-solid fa-xmark text-lg"></i></button></div><div class="grid grid-cols-3 gap-3" id="daftarFilter"></div></div>
        <div class="popup-panel" id="panelBingkai"><div class="flex justify-between items-center mb-4"><h3 class="font-bold text-lg text-slate-800">Tema Bingkai</h3><button class="tutup-popup text-gray-400 hover:text-red-500"><i class="fa-solid fa-xmark text-lg"></i></button></div><div class="grid grid-cols-2 gap-3 custom-scrollbar" id="daftarBingkai"></div></div>
        <div class="popup-panel" id="panelStiker"><div class="flex justify-between items-center mb-4"><h3 class="font-bold text-lg text-slate-800">Stiker Hiasan</h3><button class="tutup-popup text-gray-400 hover:text-red-500"><i class="fa-solid fa-xmark text-lg"></i></button></div><div class="grid grid-cols-3 gap-3 custom-scrollbar" id="daftarStiker"></div></div>
        
        <div class="popup-panel" id="panelLatar">
            <div class="flex justify-between items-center mb-4"><h3 class="font-bold text-lg text-slate-800">Warna Latar</h3><button class="tutup-popup text-gray-400 hover:text-red-500"><i class="fa-solid fa-xmark text-lg"></i></button></div>
            <div class="grid grid-cols-4 gap-4">
                <div class="w-12 h-12 rounded-full cursor-pointer border-2 border-slate-300 shadow-sm" style="background: #e2e8f0" onclick="ubahLatar('#e2e8f0')"></div><div class="w-12 h-12 rounded-full cursor-pointer border-2 border-slate-300 shadow-sm" style="background: #ffffff" onclick="ubahLatar('#ffffff')"></div><div class="w-12 h-12 rounded-full cursor-pointer border-2 border-slate-300 shadow-sm" style="background: #fecdd3" onclick="ubahLatar('#fecdd3')"></div><div class="w-12 h-12 rounded-full cursor-pointer border-2 border-slate-300 shadow-sm" style="background: #bfdbfe" onclick="ubahLatar('#bfdbfe')"></div><div class="w-12 h-12 rounded-full cursor-pointer border-2 border-slate-300 shadow-sm" style="background: #bbf7d0" onclick="ubahLatar('#bbf7d0')"></div><div class="w-12 h-12 rounded-full cursor-pointer border-2 border-slate-300 shadow-sm" style="background: #fef08a" onclick="ubahLatar('#fef08a')"></div><div class="w-12 h-12 rounded-full cursor-pointer border-2 border-slate-300 shadow-sm" style="background: #e9d5ff" onclick="ubahLatar('#e9d5ff')"></div><div class="w-12 h-12 rounded-full cursor-pointer border-2 border-slate-300 shadow-sm" style="background: #1e293b" onclick="ubahLatar('#1e293b')"></div>
            </div>
        </div>

        <div class="popup-panel" id="panelTeks">
            <div class="flex justify-between items-center mb-4"><h3 class="font-bold text-lg text-slate-800">Teks Kustom</h3><button class="tutup-popup text-gray-400 hover:text-red-500"><i class="fa-solid fa-xmark text-lg"></i></button></div>
            <div class="flex flex-col gap-4">
                <input type="text" id="inputTeksHiasan" placeholder="Ketik ucapan..." class="w-full border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-pink-500">
                <div class="flex gap-2">
                    <select id="fontTeksHiasan" class="flex-1 border-2 border-slate-200 p-2 rounded-xl focus:outline-none focus:border-pink-500 font-bold">
                        <option value="sans-serif">Modern</option><option value="serif">Klasik</option><option value="cursive">Sambung</option>
                    </select>
                    <input type="color" id="warnaTeksHiasan" value="#db2777" class="w-12 h-11 rounded-xl cursor-pointer">
                </div>
                <button onclick="window.tambahTeksKustom()" class="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl shadow-md transition">Ubah Jadi Stiker</button>
            </div>
        </div>

        <div class="popup-panel" id="panelKuas">
            <div class="flex justify-between items-center mb-4"><h3 class="font-bold text-lg text-slate-800">Kuas Bebas</h3><button class="tutup-popup text-gray-400 hover:text-red-500"><i class="fa-solid fa-xmark text-lg"></i></button></div>
            <div class="flex flex-col gap-4">
                <label class="flex items-center gap-3 p-3 bg-pink-50 rounded-xl cursor-pointer border border-pink-100">
                    <input type="checkbox" id="toggleKuasMode" onchange="window.toggleModeKuas(this.checked)" class="w-5 h-5 accent-pink-600">
                    <span class="font-bold text-pink-700">Aktifkan Kuas</span>
                </label>
                <div class="flex items-center gap-3"><span class="text-sm font-bold">Warna:</span><input type="color" id="warnaKuas" value="#db2777" class="w-full h-10 rounded-lg cursor-pointer"></div>
                <div class="flex items-center gap-3"><span class="text-sm font-bold">Ukuran:</span><input type="range" id="ukuranKuas" min="2" max="30" value="8" class="w-full accent-pink-600"></div>
                <button onclick="window.hapusCoretan()" class="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 rounded-xl shadow-sm transition mt-2"><i class="fa-solid fa-trash mr-2"></i>Bersihkan Coretan</button>
                <p class="text-[10px] text-slate-400 text-center leading-tight">Matikan mode kuas untuk menggeser stiker kembali.</p>
            </div>
        </div>

        <div class="flex-1 relative bg-white rounded-3xl overflow-hidden shadow-inner border border-gray-100 flex flex-col p-4 box-border">
            
            <div id="teksHeader" class="text-center mb-3 w-full shrink-0">
                <h4 id="teksJudul" class="font-bold text-slate-700 text-sm tracking-wide uppercase">Sesi Pemotretan</h4>
                <p id="teksSubJudul" class="text-xs text-slate-400 font-medium">Atur gaya terbaikmu. Foto akan muncul di sebelah kanan.</p>
            </div>

            <div class="ruang-konten">
                <div class="kiri-utama" id="areaKiri">
                    
                    <div id="blokKamera" class="w-full h-full relative">
                        <div class="top-bar" id="bilahKameraAtas">
                            <button class="timer-btn aktif" onclick="window.pilihTimer(this, 3)">3s</button>
                            <button class="timer-btn" onclick="window.pilihTimer(this, 5)">5s</button>
                            <button class="timer-btn" onclick="window.pilihTimer(this, 10)">10s</button>
                            <div class="w-px h-6 bg-white mx-1 opacity-50"></div>
                            <button class="timer-btn" onclick="window.toggleMirror()"><i class="fa-solid fa-arrows-left-right"></i> <span id="teksMirror">Cermin: ON</span></button>
                        </div>
                        
                        <video id="videoLayar" class="f-normal" autoplay playsinline muted></video>
                        <div id="teksHitungMundur" class="absolute inset-0 flex items-center justify-center text-[160px] text-white font-black drop-shadow-2xl hidden z-10"></div>
                        <div id="flash"></div>
                    </div>

                    <div id="blokEditor" class="w-full h-full relative hidden kiri-kanvas bg-f1f5f9 flex-col">
                        <div class="zoom-controls">
                            <button onclick="window.aturZoom(-20)" class="btn-zoom"><i class="fa-solid fa-minus"></i></button>
                            <span id="zoomAngka" class="text-sm font-bold text-slate-700 w-12 text-center">100%</span>
                            <button onclick="window.aturZoom(20)" class="btn-zoom"><i class="fa-solid fa-plus"></i></button>
                        </div>
                        
                        <div class="scroll-area-kanvas custom-scrollbar" id="wadahScroll">
                            <div id="areaKanvasWrapper">
                                <canvas id="kanvasFinal"></canvas>
                                <canvas id="canvasCoretan"></canvas>
                                <div id="stikerOverlay"></div>
                            </div>
                        </div>

                        <!-- TOMBOL BAWAH KANVAS -->
                        <div class="bg-white p-4 flex justify-center gap-4 border-t border-slate-200 shrink-0 w-full rounded-b-16px shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
                            <button class="btn-bawah-kanvas btn-bawah-sekunder" onclick="window.ulangiSesi()">
                                <i class="fa-solid fa-rotate-left"></i> Ulangi Sesi
                            </button>
                            <button class="btn-bawah-kanvas btn-bawah-primer" onclick="window.simpanKeServer()">
                                <i class="fa-solid fa-qrcode"></i> Cetak & Unduh
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="kanan-galeri">
                    <div class="galeri-samping custom-scrollbar" id="galeriKameraLive">
                        <div class="text-center text-slate-400 text-xs mt-10" id="teksTungguFoto">
                            <i class="fa-solid fa-camera text-3xl mb-2 opacity-50"></i><br>Foto jepretan akan muncul di sini.
                        </div>
                    </div>
                    <div class="galeri-samping custom-scrollbar hidden" id="galeriMentah"></div>
                </div>
            </div>

        </div>
    </div>

    <div class="loading-overlay" id="layarLoading">
        <div class="loader"></div>
        <p class="text-sm tracking-wide font-medium mt-3">Mengekspor gambar kualitas tinggi...</p>
    </div>

    <div id="area-hasil">
        <div class="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"><i class="fa-solid fa-check"></i></div>
        <h3 class="text-xl font-bold text-slate-800 mb-1">Dokumen Berhasil Dibuat</h3>
        <p class="text-xs text-slate-400 font-medium mb-3">Gunakan ponsel pintar pelanggan untuk memindai tautan di bawah ini.</p>
        <span class="text-[10px] font-bold text-pink-600 bg-pink-50 px-4 py-1.5 rounded-full tracking-wider uppercase">Sistem Cloud Aktif 24 Jam</span>
        <div class="barcode-wrapper"><div id="qrcode"></div></div>
        <div class="mt-2">
            <button onclick="location.reload()" class="bg-slate-800 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-slate-700 transition shadow-md tracking-wide">Selesai & Muat Ulang</button>
        </div>
    </div>

    <script src="assets/js/app.js?v=25"></script>
    <script src="assets/js/kisi.js?v=25"></script>
    <script src="assets/js/filter.js?v=25"></script>
    <script src="assets/js/stiker.js?v=25"></script>
    <script src="assets/js/kamera.js?v=25"></script>
</body>
</html>