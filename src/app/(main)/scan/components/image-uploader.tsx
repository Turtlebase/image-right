"use client";

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imagePreview: string | null;
}

export default function ImageUploader({ onImageUpload, imagePreview }: ImageUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onImageUpload(acceptedFiles[0]);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-colors duration-300',
        isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
      )}
    >
      <input {...getInputProps()} />
      {imagePreview ? (
        <div className="relative w-full h-full min-h-[200px] flex items-center justify-center">
            <Image
              src={imagePreview}
              alt="Image preview"
              fill
              className="object-contain rounded-lg"
            />
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          <UploadCloud className="mx-auto h-12 w-12 mb-4" />
          <p className="font-semibold text-lg text-foreground">Tap or drag & drop to upload</p>
          <p className="text-sm mt-1">You can also paste an image from your clipboard.</p>
        </div>
      )}
    </div>
  );
}
