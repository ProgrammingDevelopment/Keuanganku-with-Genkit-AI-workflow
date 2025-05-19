
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bitcoin, DollarSign, TrendingUp, Zap, RefreshCw, Bot, Loader2, Search, Coins } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { analyzeCryptocurrency, type AnalyzeCryptocurrencyInput } from '@/ai/flows/analyze-cryptocurrency-flow';
import Image from 'next/image';

interface CryptoDisplayInfo {
  id: string;
  name: string;
  symbol: string;
  iconImage?: string; // URL for a proper logo if available
  fallbackIcon: React.ElementType;
  mockPrice: string;
  dataAiHint: string;
}

const cryptoList: CryptoDisplayInfo[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', fallbackIcon: Bitcoin, mockPrice: 'Rp 1.050.250.000', dataAiHint: 'bitcoin logo' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', fallbackIcon: Coins, mockPrice: 'Rp 60.750.000', dataAiHint: 'ethereum logo' },
  { id: 'tether', name: 'Tether', symbol: 'USDT', fallbackIcon: DollarSign, mockPrice: 'Rp 16.250', dataAiHint: 'tether logo' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', fallbackIcon: Zap, mockPrice: 'Rp 2.500.000', dataAiHint: 'solana logo' },
  { id: 'xrp', name: 'XRP', symbol: 'XRP', fallbackIcon: RefreshCw, mockPrice: 'Rp 8.200', dataAiHint: 'xrp logo' },
];

export default function KriptoPage() {
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [customCryptoName, setCustomCryptoName] = useState('');
  const { toast } = useToast();

  const handleAnalyzeCrypto = async (cryptoName: string) => {
    if (!cryptoName.trim()) {
      toast({ title: "Nama Kripto Kosong", description: "Harap masukkan nama mata uang kripto.", variant: "destructive" });
      return;
    }
    setSelectedCrypto(cryptoName);
    setIsLoadingAnalysis(true);
    setAnalysisResult(null);
    try {
      const input: AnalyzeCryptocurrencyInput = { cryptocurrencyName: cryptoName };
      const result = await analyzeCryptocurrency(input);
      setAnalysisResult(result.analysis);
      toast({ title: `Analisis untuk ${cryptoName}`, description: "Analisis AI berhasil dimuat." });
    } catch (err) {
      console.error("Error fetching crypto analysis:", err);
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengambil analisis mata uang kripto.';
      toast({ title: 'Kesalahan Analisis', description: errorMessage, variant: 'destructive' });
      setAnalysisResult(`Gagal memuat analisis untuk ${cryptoName}. Coba lagi nanti.`);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analisis Mata Uang Kripto</h1>
          <p className="text-muted-foreground">
            Dapatkan wawasan tentang mata uang kripto populer dengan bantuan AI.
          </p>
        </div>
      </div>

      {/* Predefined Crypto List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cryptoList.map((crypto) => {
          const FallbackIcon = crypto.fallbackIcon;
          return (
            <Card key={crypto.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col rounded-xl overflow-hidden">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 pt-4 px-4 bg-card-foreground/5">
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">{crypto.name} ({crypto.symbol})</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">{crypto.mockPrice}</CardDescription>
                </div>
                <Image 
                  src={crypto.iconImage || `https://placehold.co/40x40.png`} 
                  data-ai-hint={crypto.dataAiHint} 
                  alt={`${crypto.name} logo`} 
                  width={36} 
                  height={36} 
                  className="rounded-full"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/40x40.png`; }} // Fallback for broken image links
                />
              </CardHeader>
              <CardContent className="flex-grow p-4">
                <p className="text-sm text-muted-foreground italic">Klik tombol di bawah untuk analisis AI mendalam.</p>
              </CardContent>
              <CardFooter className="p-4 bg-card-foreground/5">
                <Button 
                  onClick={() => handleAnalyzeCrypto(crypto.name)} 
                  className="w-full"
                  disabled={isLoadingAnalysis && selectedCrypto === crypto.name}
                  variant="default"
                >
                  {isLoadingAnalysis && selectedCrypto === crypto.name ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Bot className="mr-2 h-4 w-4" />
                  )}
                  Analisis AI
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
            />
            <Button 
              onClick={() => handleAnalyzeCrypto(customCryptoName)}
              disabled={isLoadingAnalysis || !customCryptoName.trim()}
              className="w-full sm:w-auto"
            >
              {isLoadingAnalysis && selectedCrypto === customCryptoName ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Bot className="mr-2 h-4 w-4" /> 
              )}
              Dapatkan Analisis
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Display Area */}
      {(isLoadingAnalysis || analysisResult) && (
        <Card className="shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-card-foreground/5">
            <CardTitle className="flex items-center text-foreground">
              <Bot className="mr-3 h-6 w-6 text-accent" /> Hasil Analisis AI untuk {selectedCrypto || "Pilihan Anda"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {isLoadingAnalysis && !analysisResult && (
              <div className="flex flex-col items-center justify-center h-48 space-y-3">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">Sedang menganalisis {selectedCrypto}, mohon tunggu...</p>
              </div>
            )}
            {analysisResult && (
              <Textarea
                value={analysisResult}
                readOnly
                className="min-h-[250px] bg-muted/20 text-sm border-border focus:ring-primary p-3 rounded-md"
                placeholder="Hasil analisis akan ditampilkan di sini..."
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
