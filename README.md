# 62teknologi-backend-test-adven-marta-adi-surya

## Instalasi
Untuk install aplikasi ini pada server atau komputer harus sudah terinstall nodejs dan akses ke database mysql. berikut ini langkah-langkahnya
1. clone repository
   ```bash
   git clone git@github.com:adisurya/62teknologi-backend-test-adven-marta-adi-surya.git
   ```
2. copy file .env.example menjadi .env, lalu file .env dapat di edit untuk melakukan konfigurasi
3. download module yang digunakan untuk aplikasi ini
   ```bash
   npm ci
   ```
4. jalankan migrasi database
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```
5. jalankan aplikasi
   ```bash
   node index.js
   ```