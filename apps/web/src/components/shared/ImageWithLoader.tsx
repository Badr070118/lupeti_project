'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type ImageWithLoaderProps = ImageProps & {
  containerClassName?: string;
};

export function ImageWithLoader({
  containerClassName,
  className,
  alt,
  ...props
}: ImageWithLoaderProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      {!loaded && <div className="absolute inset-0 skeleton-loader rounded-2xl" />}
      <Image
        {...props}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={cn(
          'transition-transform duration-500',
          loaded ? 'opacity-100' : 'opacity-0',
          className,
        )}
      />
    </div>
  );
}
