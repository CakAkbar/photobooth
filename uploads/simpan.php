<?php
header('Content-Type: application/json');
$dir_penyimpanan = "uploads/";

if (!file_exists($dir_penyimpanan)) mkdir($dir_penyimpanan, 0777, true);

$hasil_respon = ['sukses' => false, 'id_sesi' => '', 'pesan' => ''];

if (isset($_POST['foto_frame']) && isset($_POST['foto_mentah'])) {
    $id_sesi = uniqid("pb_") . "_" . time(); 
    
    $raw_frame = str_replace(' ', '+', str_replace('data:image/png;base64,', '', $_POST['foto_frame']));
    $raw_mentah = str_replace(' ', '+', str_replace('data:image/png;base64,', '', $_POST['foto_mentah']));
    
    $simpan_f = file_put_contents($dir_penyimpanan . $id_sesi . "_frame.png", base64_decode($raw_frame));
    $simpan_m = file_put_contents($dir_penyimpanan . $id_sesi . "_mentah.png", base64_decode($raw_mentah));
    
    if ($simpan_f && $simpan_m) {
        $hasil_respon['sukses'] = true;
        $hasil_respon['id_sesi'] = $id_sesi;
    } else {
        $hasil_respon['pesan'] = 'Gagal menyimpan ke folder uploads.';
    }
}
echo json_encode($hasil_respon);
?>