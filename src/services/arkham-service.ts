
'use server';

export interface ArkhamChartDataPoint {
  timestamp: number; // Unix timestamp (milliseconds)
  price: number;
  // Anda bisa menambahkan properti lain yang dikembalikan oleh API Arkham, seperti volume, dll.
}

export interface FormattedArkhamChartDataPoint {
  date: string; // Formatted date string for X-axis display
  price: number;
}

/**
 * Mengambil data grafik historis untuk simbol mata uang kripto tertentu dari Arkham Intelligence API.
 * @param cryptoSymbol Simbol mata uang kripto (misalnya, "BTC", "ETH").
 * @returns Promise yang resolve ke array objek ArkhamChartDataPoint.
 */
export async function fetchArkhamChartData(
  cryptoSymbol: string
): Promise<ArkhamChartDataPoint[]> {
  const apiKey = process.env.ARKHAM_API_KEY;

  if (!apiKey) {
    console.error('Kunci API Arkham tidak diatur dalam variabel lingkungan ARKHAM_API_KEY.');
    // Di aplikasi nyata, Anda mungkin ingin melempar error atau mengembalikan struktur error tertentu
    // return []; 
    // Untuk tujuan demo agar UI tetap berfungsi tanpa API key, kita akan melanjutkan dengan data tiruan.
    console.warn('Menggunakan data grafik tiruan karena Kunci API Arkham tidak ditemukan.');
  }

  // --- TINDAKAN PENGGUNA DIPERLUKAN ---
  // TODO: Ganti ini dengan endpoint dan logika API Arkham yang sebenarnya.
  // Kode berikut adalah placeholder dan TIDAK AKAN BERFUNGSI.
  // Anda perlu menemukan endpoint API Arkham yang benar untuk data harga historis.
  // Contoh endpoint hipotetis (INI HANYA CONTOH):
  /*
  const API_BASE_URL = 'https://api.arkm.com/v1'; // Ganti dengan URL basis API Arkham yang benar
  const endpoint = `${API_BASE_URL}/historical_prices?symbol=${cryptoSymbol}&interval=1d&limit=30`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Ganti 'X-API-KEY' dengan header autentikasi yang benar jika diperlukan oleh Arkham
        'X-API-KEY': apiKey || '', 
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Gagal mengambil data Arkham untuk ${cryptoSymbol}: ${response.status} ${response.statusText}`,
        errorBody
      );
      // Melempar error akan ditangkap oleh Server Action dan dikirim ke klien
      throw new Error(`Gagal mengambil data grafik dari Arkham: ${response.statusText}`);
    }

    const data = await response.json(); 

    // Pastikan untuk memetakan respons API Arkham yang sebenarnya ke struktur ArkhamChartDataPoint
    // Contoh pemetaan (INI HANYA CONTOH):
    // return data.prices.map((item: any) => ({
    //   timestamp: item.timestamp, // pastikan ini adalah Unix timestamp dalam milidetik
    //   price: parseFloat(item.price),
    // }));

  } catch (error) {
    console.error(`Kesalahan saat mengambil data dari Arkham untuk ${cryptoSymbol}:`, error);
    throw error; // Lempar ulang error agar Server Action dapat menanganinya
  }
  */
  // --- AKHIR TINDAKAN PENGGUNA DIPERLUKAN ---

  // Jika Kunci API ada tapi kode di atas dikomentari, kita tetap gunakan data tiruan.
  if (apiKey) {
    console.warn(
      `PERINGATAN: fetchArkhamChartData menggunakan data placeholder untuk ${cryptoSymbol} karena panggilan API yang sebenarnya belum diimplementasikan atau dikomentari.`
    );
  }

  // Data placeholder jika implementasi API yang sebenarnya belum ada:
  // Membuat 30 titik data tiruan untuk satu bulan terakhir
  const mockData: ArkhamChartDataPoint[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Simulasikan variasi harga berdasarkan simbol
    let basePrice = 50000;
    if (cryptoSymbol === 'ETH') basePrice = 3000;
    else if (cryptoSymbol === 'USDT') basePrice = 1;
    else if (cryptoSymbol === 'SOL') basePrice = 150;
    else if (cryptoSymbol === 'XRP') basePrice = 0.5;

    mockData.push({
      timestamp: date.getTime(),
      price: basePrice + (Math.random() - 0.5) * (basePrice * 0.1), // Variasi +/- 10%
    });
  }
  return mockData;
}
