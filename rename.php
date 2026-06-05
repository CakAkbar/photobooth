<?php
// Pastikan folder ini sesuai dengan lokasi stikermu
$direktori = 'assets/stickers/';

echo "<h2>Memulai proses pengubahan nama stiker...</h2>";

if (is_dir($direktori)) {
    // Membaca semua file di dalam folder
    $file_stiker = scandir($direktori);
    $nomor_urut = 1;

    foreach ($file_stiker as $file) {
        // Hanya memproses file yang berakhiran .png
        if (strtolower(pathinfo($file, PATHINFO_EXTENSION)) == 'png') {
            
            // Lewati jika namanya kebetulan sudah "stickerX.png" agar tidak error
            if (strpos($file, 'sticker') === 0) continue;

            $nama_lama = $direktori . $file;
            $nama_baru = $direktori . 'sticker' . $nomor_urut . '.png';

            // Proses ubah nama
            if (rename($nama_lama, $nama_baru)) {
                echo "<p style='color: green;'>Berhasil: <b>$file</b> &rarr; <b>sticker$nomor_urut.png</b></p>";
                $nomor_urut++;
            } else {
                echo "<p style='color: red;'>Gagal mengubah: $file</p>";
            }
        }
    }
    
    $total_diubah = $nomor_urut - 1;
    echo "<h3>Selesai! $total_diubah stiker berhasil diubah namanya.</h3>";
    echo "<p><a href='index.php'>Kembali ke Aplikasi Photobooth</a></p>";

} else {
    echo "<h3 style='color: red;'>Error: Folder '$direktori' tidak ditemukan!</h3>";
}
?>