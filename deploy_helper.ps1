# Deploy Helper Script for Garasifyy
# Run this in PowerShell: .\deploy_helper.ps1

Write-Host "=== Garasifyy Deployment Helper ===" -ForegroundColor Cyan
Write-Host "Pastikan file admin.js, index.html, dll sudah siap." -ForegroundColor Yellow

$server_ip = Read-Host "Masukkan IP Server (contoh: 192.168.1.100)"
$user = Read-Host "Masukkan Username (contoh: root)"
$remote_path = Read-Host "Masukkan Path Tujuan (Enter untuk default: /var/www/html/)"

if ($remote_path -eq "") { 
    $remote_path = "/var/www/html/" 
}

Write-Host "`nMengupload file ke $user@$server_ip:$remote_path ..." -ForegroundColor Green
Write-Host "Perintah: scp -r ./* $user@$server_ip:$remote_path" -ForegroundColor Gray

# Confirmation
$confirm = Read-Host "Lanjut upload? (y/n)"
if ($confirm -eq "y") {
    scp -r ./* "$user@$server_ip:$remote_path"
    Write-Host "`nSelesai! Cek website Anda di http://$server_ip" -ForegroundColor Green
} else {
    Write-Host "Dibatalkan." -ForegroundColor Red
}
