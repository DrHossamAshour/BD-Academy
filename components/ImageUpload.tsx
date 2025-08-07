"use client";

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '3/2';
  className?: string;
}

export default function ImageUpload({ 
  onImageUpload, 
  currentImage, 
  aspectRatio = '16/9',
  className = '' 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '16/9': return 'aspect-video';
      case '4/3': return 'aspect-[4/3]';
      case '1/1': return 'aspect-square';
      case '3/2': return 'aspect-[3/2]';
      default: return 'aspect-video';
    }
  };

  const getAspectRatioText = () => {
    switch (aspectRatio) {
      case '16/9': return '16:9 (Recommended for course thumbnails)';
      case '4/3': return '4:3 (Good for detailed images)';
      case '1/1': return '1:1 (Square format)';
      case '3/2': return '3:2 (Classic photo ratio)';
      default: return '16:9';
    }
  };

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Only JPG and PNG files are allowed.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`;
    }
    return null;
  };

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      setPreview(data.url);
      onImageUpload(data.url);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadImage(file);
  }, [uploadImage, validateFile]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Image Preview */}
      {preview && (
        <div className="relative">
          <div className={`${getAspectRatioClass()} relative overflow-hidden rounded-lg border border-gray-200`}>
            <Image
              src={preview}
              alt="Course preview"
              fill
              className="object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {!preview && (
        <div
          className={`${getAspectRatioClass()} relative border-2 border-dashed rounded-lg transition-colors ${
            dragActive 
              ? 'border-[#d8bf78] bg-[#d8bf78]/10' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 mb-2">
                Drop your image here or click to browse
              </p>
              <p className="text-xs text-gray-500 mb-4">
                {getAspectRatioText()}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Choose Image'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-3 w-3 text-green-500" />
          <span>Maximum file size: 1MB</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-3 w-3 text-green-500" />
          <span>Supported formats: JPG, PNG</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-3 w-3 text-green-500" />
          <span>Recommended ratio: {getAspectRatioText()}</span>
        </div>
      </div>

      {/* Loading State */}
      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#d8bf78]"></div>
          <span>Uploading image...</span>
        </div>
      )}
    </div>
  );
} 