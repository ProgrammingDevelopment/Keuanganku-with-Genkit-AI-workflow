"use client";

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, Loader2, FileImage, XCircle } from "lucide-react";
import Image from "next/image";

interface ReceiptUploadFormProps {
  onSubmit: (file: File) => void;
  isLoading: boolean;
}

export function ReceiptUploadForm({ onSubmit, isLoading }: ReceiptUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Batas 5MB
        alert("Ukuran berkas terlalu besar. Ukuran maksimal adalah 5MB.");
        return;
      }
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        alert("Jenis berkas tidak valid. Harap unggah gambar PNG, JPG, atau WEBP.");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedFile) {
      onSubmit(selectedFile);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="receipt-upload" className="block text-sm font-medium text-foreground mb-1">
          Gambar Struk
        </Label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-border hover:border-primary transition-colors">
          <div className="space-y-1 text-center">
            {previewUrl ? (
              <div className="relative group">
                <Image 
                  src={previewUrl} 
                  alt="Pratinjau struk" 
                  width={300} 
                  height={200} 
                  className="mx-auto h-48 w-auto rounded-md object-contain"
                  data-ai-hint="receipt preview"
                />
                <Button 
                  type="button"
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={clearSelection}
                  aria-label="Hapus pratinjau"
                >
                  <XCircle className="h-4 w-4"/>
                </Button>
              </div>
            ) : (
              <FileImage className="mx-auto h-12 w-12 text-muted-foreground" />
            )}
            <div className="flex text-sm text-muted-foreground justify-center">
              <Label
                htmlFor="receipt-upload"
                className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
              >
                <span>Unggah berkas</span>
                <Input 
                  id="receipt-upload" 
                  name="receipt-upload" 
                  type="file" 
                  className="sr-only" 
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/webp"
                  ref={fileInputRef}
                  data-ai-hint="file upload receipt"
                />
              </Label>
              {!previewUrl && <p className="pl-1">atau seret dan lepas</p>}
            </div>
            {!previewUrl && <p className="text-xs text-muted-foreground">PNG, JPG, WEBP hingga 5MB</p>}
            {selectedFile && !previewUrl && <p className="text-sm text-foreground mt-2">{selectedFile.name}</p>}
          </div>
        </div>
      </div>
      
      <Button type="submit" disabled={!selectedFile || isLoading} className="w-full">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <UploadCloud className="mr-2 h-4 w-4" />
        )}
        {isLoading ? 'Memproses...' : 'Pindai Struk'}
      </Button>
    </form>
  );
}
