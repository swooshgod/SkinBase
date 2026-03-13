'use client';

import { useRef } from 'react';

interface PhotoPickerProps {
  onPhoto: (dataUrl: string) => void;
  children: React.ReactNode;
  className?: string;
  facingMode?: 'user' | 'environment'; // user = front camera, environment = back
}

export default function PhotoPicker({ onPhoto, children, className, facingMode = 'user' }: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        // Compress: max 600px wide/tall, JPEG 75%
        const canvas = document.createElement('canvas');
        const MAX = 600;
        let w = img.width, h = img.height;
        if (w > h && w > MAX) { h = (h * MAX) / w; w = MAX; }
        else if (h > MAX) { w = (w * MAX) / h; h = MAX; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        onPhoto(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture={facingMode}
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
      />
      <div onClick={() => inputRef.current?.click()} className={className} style={{ cursor: 'pointer' }}>
        {children}
      </div>
    </>
  );
}
