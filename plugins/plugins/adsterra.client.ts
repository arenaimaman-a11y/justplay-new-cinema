// plugins/adsterra.client.ts
export default defineNuxtPlugin(() => {
  // Memastikan script hanya berjalan di browser (Client-Side)
  if (process.client) {
    
    // 🎯 GOLDEN RULE: Jeda waktu dalam jam agar CPM tidak drop
    // 1 Jam adalah waktu paling optimal untuk situs streaming film
    const cappingTimeInHours = 1; 
    
    const storageKey = 'justplay_premium_pop';
    const now = new Date().getTime();
    const lastPop = localStorage.getItem(storageKey);

    // Hitung selisih waktu dalam milidetik
    const isCooldownOver = !lastPop || (now - parseInt(lastPop)) > (cappingTimeInHours * 60 * 60 * 1000);

    if (isCooldownOver) {
      // 🚀 OPTIMAL INJECTION: Membuat script secara dinamis saat runtime
      const script = document.createElement('script');
      
      // Menggunakan URL script Popunder premium Anda yang terbukti menghasilkan CPM $5 - $7
      script.src = 'https://twigcrucialpal.com/cc/4e/da/cc4eda891de7f30a7015d2741774fa17.js';
      script.async = true;
      
      // Injeksi di akhir body (setara dengan tagPosition: 'bodyClose')
      // Ini memastikan performa loading website utama Anda tetap instan dan cepat
      document.body.appendChild(script);

      // Catat timestamp eksekusi iklan yang sukses
      localStorage.setItem(storageKey, now.toString());
      
      // Debug log internal (bisa dihapus jika sudah production)
      console.log('[AdSterra] High-CPM Popunder successfully injected.');
    } else {
      // Jika masih dalam masa jeda, script tidak akan dimuat sama sekali
      // Ini menghemat kuota impresi ampas dan menjaga nilai penawaran (bidding) tetap tinggi
      const remainingMinutes = Math.round(((parseInt(lastPop) + (cappingTimeInHours * 60 * 60 * 1000)) - now) / 60 / 1000);
      console.log(`[AdSterra] Anti-Drop Protection Active. Next pop in ${remainingMinutes} minutes.`);
    }
  }
});