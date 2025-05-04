// Nonaktifkan middleware untuk sementara
// Ini akan memungkinkan semua request tanpa pemeriksaan autentikasi
// Setelah masalah login teratasi, kita bisa mengaktifkan kembali middleware

export const config = {
  matcher: [],
};
