
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Bell, UserCog, Mic2, DatabaseZap, CircleUser, Link2, Shield, Palette, Code, MessageSquare, Languages, Archive, ArchiveX, Trash2 } from 'lucide-react';
import { useTheme } from 'next-themes';

type SettingsCategory = "general" | "notifications" | "personalization" | "speech" | "dataControls" | "builderProfile" | "connectedApps" | "security";

interface NavItem {
  id: SettingsCategory;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'general', label: 'Umum', icon: SettingsIcon },
  { id: 'notifications', label: 'Notifikasi', icon: Bell },
  { id: 'personalization', label: 'Personalisasi', icon: UserCog },
  { id: 'speech', label: 'Ucapan', icon: Mic2 },
  { id: 'dataControls', label: 'Kontrol Data', icon: DatabaseZap },
  { id: 'builderProfile', label: 'Profil Pembangun', icon: CircleUser },
  { id: 'connectedApps', label: 'Aplikasi Terhubung', icon: Link2 },
  { id: 'security', label: 'Keamanan', icon: Shield },
];

export default function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('general');
  const { theme, setTheme } = useTheme();

  const renderGeneralSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5" /> Tema</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={theme} onValueChange={(value) => setTheme(value)}>
          <SelectTrigger className="w-full sm:w-[280px]">
            <SelectValue placeholder="Pilih tema" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Terang</SelectItem>
            <SelectItem value="dark">Gelap</SelectItem>
            <SelectItem value="system">Sistem</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>

      <Separator className="my-6" />

      <CardHeader>
        <CardTitle className="flex items-center"><SettingsIcon className="mr-2 h-5 w-5" /> Preferensi Tampilan & Bahasa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
          <div className='space-y-0.5'>
            <Label htmlFor="show-code-switch" className="font-medium flex items-center"><Code className="mr-2 h-4 w-4"/>Selalu tampilkan kode saat menggunakan analis data</Label>
            <p className="text-xs text-muted-foreground">Aktifkan untuk selalu melihat blok kode dalam respons.</p>
          </div>
          <Switch id="show-code-switch" defaultChecked={false} aria-label="Selalu tampilkan kode saat menggunakan analis data"/>
        </div>

        <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
          <div className='space-y-0.5'>
            <Label htmlFor="follow-up-switch" className="font-medium flex items-center"><MessageSquare className="mr-2 h-4 w-4"/>Tampilkan saran tindak lanjut dalam obrolan</Label>
            <p className="text-xs text-muted-foreground">Dapatkan saran untuk pertanyaan berikutnya setelah respons AI.</p>
          </div>
          <Switch id="follow-up-switch" defaultChecked={true} aria-label="Tampilkan saran tindak lanjut dalam obrolan"/>
        </div>

        <div>
          <Label htmlFor="language-select" className="font-medium flex items-center mb-2"><Languages className="mr-2 h-5 w-5"/>Bahasa</Label>
          <Select defaultValue="auto">
            <SelectTrigger id="language-select" className="w-full sm:w-[280px]">
              <SelectValue placeholder="Pilih bahasa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Deteksi otomatis</SelectItem>
              <SelectItem value="id">Bahasa Indonesia</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>

      <Separator className="my-6" />

      <CardHeader>
        <CardTitle className="flex items-center"><Archive className="mr-2 h-5 w-5" /> Manajemen Obrolan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full sm:w-auto justify-start text-left">
          <ArchiveX className="mr-2 h-4 w-4" /> Kelola obrolan yang diarsipkan
        </Button>
        <Button variant="outline" className="w-full sm:w-auto justify-start text-left">
          <Archive className="mr-2 h-4 w-4" /> Arsipkan semua obrolan
        </Button>
        <Button variant="destructive" className="w-full sm:w-auto justify-start text-left">
          <Trash2 className="mr-2 h-4 w-4" /> Hapus semua obrolan
        </Button>
      </CardContent>
    </Card>
  );

  const renderPlaceholderContent = (category: NavItem) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><category.icon className="mr-2 h-5 w-5" /> {category.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Pengaturan untuk {category.label.toLowerCase()} akan segera tersedia.</p>
      </CardContent>
    </Card>
  );


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <nav className="md:w-1/4 lg:w-1/5 space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeCategory === item.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveCategory(item.id)}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="md:w-3/4 lg:w-4/5">
          {activeCategory === 'general' && renderGeneralSettings()}
          {activeCategory !== 'general' && renderPlaceholderContent(navItems.find(nav => nav.id === activeCategory)!)}
        </div>
      </div>
    </div>
  );
}
