
'use server';

import { fetchArkhamChartData, type ArkhamChartDataPoint } from '@/services/arkham-service';

export interface GetArkhamChartActionResult {
  success: boolean;
  data?: ArkhamChartDataPoint[];
  error?: string;
}

export async function getArkhamChartAction(cryptoSymbol: string): Promise<GetArkhamChartActionResult> {
  try {
    // Di dunia nyata, Anda mungkin ingin melakukan normalisasi simbol di sini
    // atau validasi tambahan sebelum meneruskannya ke layanan.
    const chartData = await fetchArkhamChartData(cryptoSymbol.toUpperCase());
    if (chartData.length === 0 && cryptoSymbol !== "PLACEHOLDER") { // Hindari error untuk data placeholder awal
        // Ini bisa berarti API tidak mengembalikan data atau ada masalah lain
        // Untuk saat ini, kita akan tetap menganggapnya sukses tapi dengan data kosong
        // atau Anda bisa memilih untuk mengembalikan error di sini.
    }
    return { success: true, data: chartData };
  } catch (error) {
    console.error(`Error in getArkhamChartAction for ${cryptoSymbol}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Gagal mengambil data grafik Arkham.';
    return { success: false, error: errorMessage };
  }
}
