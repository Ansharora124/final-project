'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, CheckCircle2, Sparkles, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface UploadedFileState {
  file: File | null;
  previewUrl: string;
  isUploading: boolean;
  progress: number;
  exifDetected: boolean;
}

interface ImageUploaderProps {
  onImageSelected?: (previewUrl: string, autoExif?: any) => void;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, className }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<UploadedFileState>({
    file: null,
    previewUrl: '',
    isUploading: false,
    progress: 0,
    exifDetected: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateUploadAndExif = (file: File) => {
    const preview = URL.createObjectURL(file);
    setUploadState({
      file,
      previewUrl: preview,
      isUploading: true,
      progress: 25,
      exifDetected: false,
    });

    // Simulate upload and EXIF reading sequence
    setTimeout(() => {
      setUploadState((prev) => ({ ...prev, progress: 65 }));
    }, 400);

    setTimeout(() => {
      setUploadState((prev) => ({
        ...prev,
        isUploading: false,
        progress: 100,
        exifDetected: true,
      }));

      onImageSelected?.(preview, {
        camera: 'Sony Alpha 1 (Detected)',
        lens: 'Sony FE 70-200mm f/2.8 GM OSS II',
        focalLength: '135mm',
        aperture: 'f/2.8',
        shutterSpeed: '1/2000s',
        iso: 250,
      });
    }, 900);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateUploadAndExif(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      simulateUploadAndExif(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setUploadState({
      file: null,
      previewUrl: '',
      isUploading: false,
      progress: 0,
      exifDetected: false,
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={cn('w-full space-y-4', className)}>
      {!uploadState.previewUrl ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-4 group',
            dragActive
              ? 'border-primary-500 bg-primary-500/10 scale-[0.99]'
              : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/tiff"
            className="hidden"
            onChange={handleChange}
          />

          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-primary-400 group-hover:scale-110 group-hover:text-primary-300 transition-all shadow-inner">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <p className="text-base font-bold text-white">
              Drag & Drop your photograph here, or <span className="text-primary-400">browse</span>
            </p>
            <p className="text-xs text-slate-400">
              Supports high-res JPG, PNG, TIFF up to 50MB. EXIF metadata will be auto-parsed.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-2 font-mono">
            <span>• Min 3000x2000px</span>
            <span>• 1 Photo / Entrant</span>
            <span>• Original Raw/Edited</span>
          </div>
        </div>
      ) : (
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-4 space-y-4">
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={uploadState.previewUrl}
              alt="Upload preview"
              className="w-full h-full object-contain"
            />

            <button
              onClick={handleRemove}
              className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/80 text-slate-300 hover:text-white hover:bg-rose-600 transition-colors backdrop-blur-md"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Upload Progress / EXIF Bar */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
            {uploadState.isUploading ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5 text-primary-400">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    Extracting EXIF & Validating Pixel Integrity...
                  </span>
                  <span>{uploadState.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary-500 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${uploadState.progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>High-Res Photo Validated & EXIF Metadata Extracted</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                    Ready for Submission
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
