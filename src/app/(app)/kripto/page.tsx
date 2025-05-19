
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bitcoin, DollarSign, Zap, RefreshCw, Bot, Loader2, Search, Coins, BarChart3 } from "lucide-react"; // Removed TrendingUp as it was unused
import { useToast } from '@/hooks/use-toast';
import { analyzeCryptocurrency, type AnalyzeCryptocurrencyInput } from '@/ai/flows/analyze-cryptocurrency-flow';
import { getArkhamChartAction, type GetArkhamChartActionResult } from './actions'; // Impor server action
import { CryptoChart } from '@/components/kripto/crypto-chart'; // Impor komponen chart
import type { FormattedArkhamChartDataPoint, ArkhamChartDataPoint } from '@/services/arkham-service';
import Image from 'next/image';
import { format } from 'date-fns';
import { id as indonesiaLocale } from 'date-fns/locale';

interface CryptoDisplayInfo {
  id: string;
  name: string;
  symbol: string;
  iconImage?: string; // Still available if real images are sourced later
  placeholderBackgroundColor: string; // For colored placeholders
  placeholderTextColor: string; // For text on placeholder
  fallbackIcon: React.ElementType;
  mockPrice: string;
  dataAiHint: string;
}

const cryptoList: CryptoDisplayInfo[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', fallbackIcon: Bitcoin, mockPrice: 'Rp 1.050.250.000', dataAiHint: 'bitcoin logo', placeholderBackgroundColor: 'F7931A', placeholderTextColor: 'FFFFFF' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', fallbackIcon: Coins, mockPrice: 'Rp 60.750.000', dataAiHint: 'ethereum logo', placeholderBackgroundColor: '627EEA', placeholderTextColor: 'FFFFFF' },
  { id: 'tether', name: 'Tether', symbol: 'USDT', fallbackIcon: DollarSign, mockPrice: 'Rp 16.250', dataAiHint: 'tether logo', placeholderBackgroundColor: '26A17B', placeholderTextColor: 'FFFFFF' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', fallbackIcon: Zap, mockPrice: 'Rp 2.500.000', dataAiHint: 'solana logo', placeholderBackgroundColor: '9945FF', placeholderTextColor: 'FFFFFF' },
  { id: 'xrp', name: 'XRP', symbol: 'XRP', fallbackIcon: RefreshCw, mockPrice: 'Rp 8.200', dataAiHint: 'xrp logo', placeholderBackgroundColor: '00AEEF', placeholderTextColor: 'FFFFFF' },
];

export default function KriptoPage() {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoDisplayInfo | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [customCryptoName, setCustomCryptoName] = useState('');
  const { toast } = useToast();

  const [chartData, setChartData] = useState<FormattedArkhamChartDataPoint[] | null>(null);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);

  const formatChartData = (data: ArkhamChartDataPoint[]): FormattedArkhamChartDataPoint[] => {
    return data.map(point => ({
      date: format(new Date(point.timestamp), 'dd MMM', { locale: indonesiaLocale }), // Format tanggal pendek
      price: point.price,
    }));
  };

  const handleAnalyzeAndChartCrypto = async (crypto: Omit<CryptoDisplayInfo, 'fallbackIcon' | 'mockPrice' | 'dataAiHint' | 'placeholderBackgroundColor' | 'placeholderTextColor'> & Partial<Pick<CryptoDisplayInfo, 'id'>>) => {
    const cryptoName = crypto.name;
    const cryptoSymbol = crypto.symbol;
  
    if (!cryptoName.trim()) {
      toast({ title: "Nama Kripto Kosong", description: "Harap masukkan nama mata uang kripto.", variant: "destructive" });
      return;
    }
    
    // If it's a custom crypto, selectedCrypto might not have all fields like placeholderColor
    const currentSelected: CryptoDisplayInfo | { name: string, symbol: string, id?: string } = cryptoList.find(c => c.id === crypto.id) || { name: cryptoName, symbol: cryptoSymbol, id: crypto.id };
    setSelectedCrypto(currentSelected as CryptoDisplayInfo);

    setIsLoadingAnalysis(true);
    setAnalysisResult(null);
    setIsLoadingChart(true);
    setChartData(null);
    setChartError(null);

    try {
      // 1. Dapatkan Analisis AI
      const input: AnalyzeCryptocurrencyInput = { cryptocurrencyName: cryptoName };
      const result = await analyzeCryptocurrency(input);
      setAnalysisResult(result.analysis);
      toast({ title: `Analisis untuk ${cryptoName}`, description: "Analisis AI berhasil dimuat." });
    } catch (err) {
      console.error("Error fetching crypto analysis:", err);
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengambil analisis mata uang kripto.';
      toast({ title: 'Kesalahan Analisis AI', description: errorMessage, variant: 'destructive' });
      setAnalysisResult(`Gagal memuat analisis AI untuk ${cryptoName}.`);
    } finally {
      setIsLoadingAnalysis(false);
    }

    try {
      const chartResult: GetArkhamChartActionResult = await getArkhamChartAction(cryptoSymbol);
      if (chartResult.success && chartResult.data) {
        if (chartResult.data.length > 0) {
          setChartData(formatChartData(chartResult.data));
          toast({ title: `Grafik untuk ${cryptoName}`, description: "Data grafik berhasil dimuat." });
        } else {
          setChartError(`Tidak ada data grafik yang tersedia untuk ${cryptoSymbol}.`);
           toast({ title: 'Info Grafik', description: `Tidak ada data grafik yang ditemukan untuk ${cryptoSymbol}.`, variant: 'default' });
        }
      } else {
        setChartError(chartResult.error || 'Gagal mengambil data grafik.');
        toast({ title: 'Kesalahan Grafik', description: chartResult.error || 'Gagal mengambil data grafik.', variant: 'destructive' });
      }
    } catch (err) {
      console.error("Error fetching crypto chart data:", err);
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data grafik.';
      setChartError(errorMessage);
      toast({ title: 'Kesalahan Grafik', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsLoadingChart(false);
    }
  };
  
  const handleCustomCryptoSubmit = () => {
    if(customCryptoName.trim()){
      const symbol = customCryptoName.toUpperCase().split(' ')[0]; // Simple symbol extraction
      handleAnalyzeAndChartCrypto({ name: customCryptoName, symbol: symbol });
    } else {
      toast({ title: "Nama Kripto Kosong", description: "Harap masukkan nama mata uang kripto.", variant: "destructive" });
    }
  };


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analisis Mata Uang Kripto</h1>
          <p className="text-muted-foreground">
            Dapatkan wawasan dan lihat grafik harga mata uang kripto dengan bantuan AI dan data pasar.
          </p>
        </div>
      </div>

      {/* Predefined Crypto List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {cryptoList.map((crypto) => {
          const isLoadingCurrent = (isLoadingAnalysis || isLoadingChart) && selectedCrypto?.id === crypto.id;
          const placeholderSrc = `https://placehold.co/40x40/${crypto.placeholderBackgroundColor}/${crypto.placeholderTextColor}.png?text=${crypto.symbol}`;
          return (
            <Card key={crypto.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col rounded-xl overflow-hidden">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 pt-4 px-4 bg-card-foreground/5">
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">{crypto.name} ({crypto.symbol})</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">{crypto.mockPrice}</CardDescription>
                </div>
                <Image 
                  src={crypto.iconImage || placeholderSrc} 
                  data-ai-hint={crypto.dataAiHint} 
                  alt={`${crypto.name} logo`} 
                  width={36} 
                  height={36} 
                  className="rounded-full"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/40x40/CCC/000.png?text=?`; }} // Generic fallback
                />
              </CardHeader>
              <CardContent className="flex-grow p-4">
                <p className="text-sm text-muted-foreground italic">Klik tombol di bawah untuk analisis AI dan grafik harga.</p>
              </CardContent>
              <CardFooter className="p-4 bg-card-foreground/5">
                <Button 
                  onClick={() => handleAnalyzeAndChartCrypto(crypto)} 
                  className="w-full"
                  disabled={isLoadingCurrent}
                  variant="default"
                >
                  {isLoadingCurrent ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <BarChart3 className="mr-2 h-4 w-4" />
                  )}
                  Analisis & Grafik
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {/* Custom Crypto Analysis */}
      <Card className="shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-card-foreground/5">
          <CardTitle className="flex items-center text-foreground">
            <Search className="mr-3 h-6 w-6 text-primary" /> Analisis Kripto Pilihan Anda
          </CardTitle>
          <CardDescription className="text-muted-foreground">Masukkan nama mata uang kripto yang ingin Anda analisis lebih lanjut.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input 
              type="text"
              placeholder="cth: Dogecoin, Cardano, Polkadot"
              value={customCryptoName}
              onChange={(e) => setCustomCryptoName(e.target.value)}
              className="flex-grow text-base sm:text-sm"
              data-ai-hint="cryptocurrency name input"
              onKeyDown={(e) => e.key === 'Enter' && handleCustomCryptoSubmit()}
            />
            <Button 
              onClick={handleCustomCryptoSubmit}
              disabled={(isLoadingAnalysis || isLoadingChart) || !customCryptoName.trim()}
              className="w-full sm:w-auto"
            >
              {(isLoadingAnalysis || isLoadingChart) && selectedCrypto?.name.toLowerCase() === customCryptoName.toLowerCase() ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BarChart3 className="mr-2 h-4 w-4" /> 
              )}
              Dapatkan Analisis & Grafik
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis and Chart Display Area */}
      {(selectedCrypto) && (isLoadingAnalysis || analysisResult || isLoadingChart || chartData || chartError) && (
        <Card className="shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-card-foreground/5">
            <CardTitle className="flex items-center text-foreground">
              <Bot className="mr-3 h-6 w-6 text-accent" /> Hasil untuk {selectedCrypto?.name || "Pilihan Anda"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-6">
            {/* AI Analysis Section */}
            {isLoadingAnalysis && (
              <div className="flex flex-col items-center justify-center h-32 space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Sedang menganalisis {selectedCrypto?.name}...</p>
              </div>
            )}
            {analysisResult && !isLoadingAnalysis && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Analisis AI:</h3>
                <Textarea
                  value={analysisResult}
                  readOnly
                  className="min-h-[200px] bg-muted/20 text-sm border-border focus:ring-primary p-3 rounded-md"
                  placeholder="Hasil analisis AI akan ditampilkan di sini..."
                />
              </div>
            )}
            
            {/* Chart Section */}
            {isLoadingChart && (
              <div className="flex flex-col items-center justify-center h-48 space-y-3">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">Memuat data grafik untuk {selectedCrypto?.name}...</p>
              </div>
            )}
            {chartError && !isLoadingChart && (
               <div>
                 <h3 className="text-lg font-semibold mb-2 text-destructive">Grafik Harga:</h3>
                 <p className="text-destructive-foreground bg-destructive/20 p-3 rounded-md">{chartError}</p>
               </div>
            )}
            {chartData && !isLoadingChart && !chartError && (
              <CryptoChart data={chartData} cryptoName={selectedCrypto?.name || "Kripto"} />
            )}
             {!isLoadingChart && !chartData && !chartError && !isLoadingAnalysis && !analysisResult && ( // Improved condition to show initial message
                <div className="text-muted-foreground italic text-center py-10">
                  <BarChart3 className="mx-auto h-12 w-12 mb-4 text-muted-foreground/50" />
                  <p>Pilih mata uang kripto atau masukkan nama di atas untuk melihat analisis dan grafik harga.</p>
                </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

    