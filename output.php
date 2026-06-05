<?php
$dir_penyimpanan = "uploads/";
if (!isset($_GET['sesi'])) die("<h3 style='text-align:center;'>Sesi tidak valid.</h3>");

$id_sesi = preg_replace('/[^a-zA-Z0-9_]/', '', $_GET['sesi']);
$file_hasil_frame = $dir_penyimpanan . $id_sesi . "_frame.png";
$file_hasil_mentah = $dir_penyimpanan . $id_sesi . "_mentah.png";

// Pembersihan otomatis file lebih dari 24 jam (86400 detik)
foreach (glob($dir_penyimpanan . "*") as $file_lama) {
    if (is_file($file_lama) && (time() - filemtime($file_lama) > 86400)) unlink($file_lama);
}

if (!file_exists($file_hasil_frame) || (time() - filemtime($file_hasil_frame) > 86400)) {
    if (file_exists($file_hasil_frame)) unlink($file_hasil_frame);
    if (file_exists($file_hasil_mentah)) unlink($file_hasil_mentah);
    die("<div style='text-align:center; padding: 50px; font-family:sans-serif;'>
            <h2 style='color:#dc2626;'>Sesi Kedaluwarsa</h2>
            <p>Batas waktu penyimpanan 24 jam telah habis.</p>
         </div>");
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unduh Foto</title>
    <style>
        body { font-family: sans-serif; text-align: center; background: #f1f5f9; padding: 20px; }
        .wrapper { max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 20px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
        img { width: 100%; border-radius: 12px; margin-bottom: 20px; }
        .btn { display: block; padding: 15px; background: #ff4081; color: white; text-decoration: none; border-radius: 10px; font-weight: bold; margin-bottom: 10px; }
        .btn.mentah { background: #3b82f6; }
    </style>
</head>
<body>
    <div class="wrapper">
        <h2>Hasil Photobooth</h2>
        <img src="<?php echo $file_hasil_frame; ?>" alt="Frame">
        <a class="btn" href="<?php echo $file_hasil_frame; ?>" download="Frame_<?php echo $id_sesi; ?>.png">Unduh Foto Frame</a>
        <a class="btn mentah" href="<?php echo $file_hasil_mentah; ?>" download="Mentah_<?php echo $id_sesi; ?>.png">Unduh Foto Polos</a>
        <p style="font-size: 12px; color: #94a3b8;">*Akan terhapus otomatis dalam 24 jam</p>
    </div>
</body>
</html>