# GlobalChat Socket.IO

Versi paling sederhana: chat teks global real-time tanpa Firebase. Backend menggunakan Node.js, Express, dan Socket.IO.

## Menjalankan di komputer
1. Instal Node.js LTS.
2. Ekstrak ZIP dan buka terminal di folder proyek.
3. Jalankan:

```bash
npm install
npm start
```

4. Buka `http://localhost:3000` di browser.
5. Untuk tes real-time, buka alamat yang sama di dua tab/browser dan masuk dengan nama berbeda.

## Agar orang lain bisa ikut
Server harus dijalankan di hosting yang mendukung aplikasi Node.js dan WebSocket, lalu bagikan URL hosting. Jangan bagikan `localhost`, karena itu hanya mengarah ke perangkat sendiri.

## Batas versi ini
- Chat teks grup yang terlihat oleh semua pengguna online.
- Nama tampilan sementara, tanpa sistem akun/password.
- Pesan dan daftar online tidak disimpan permanen. Pesan hilang saat server dimulai ulang atau halaman dibuka ulang.
- Belum ada VN, foto, video call, kirim video, atau kontak.
- Sebelum dipakai publik, tambahkan autentikasi, moderasi, rate limiting, dan aturan keamanan.
