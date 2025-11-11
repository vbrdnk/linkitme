'use client';

import { type VariantProps, cva } from 'class-variance-authority';
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';

import type { LinkitItemProps, LinkitItemSize } from '@/types/linkit-item';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

const linkitItemVariants = cva(
  'relative bg-white rounded-3xl p-6 shadow-sm border border-gray-100 group transition-all duration-500 ease-out',
  {
    variants: {
      size: {
        xs: 'w-60 h-[280px]',
        sm: 'w-[400px] h-[180px]',
        md: 'w-[400px] h-80',
        lg: 'w-[300px] h-[550px]',
        xl: 'w-[600px] h-[380px]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

// Size icon components
const SizeIcon = ({ type, isActive }: { type: LinkitItemSize; isActive: boolean }) => {
  const iconMap = {
    xs: <rect x="6" y="5" width="12" height="14" rx="2" />,
    sm: <rect x="2" y="8" width="20" height="8" rx="2" />,
    md: <rect x="4" y="4" width="16" height="16" rx="2" />,
    lg: <rect x="7" y="2" width="10" height="20" rx="2" />,
    xl: <rect x="2" y="5" width="20" height="14" rx="2" />,
  };

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        'transition-all duration-200',
        isActive ? 'fill-black stroke-black' : 'fill-transparent stroke-white'
      )}
      strokeWidth="2"
    >
      {iconMap[type]}
    </svg>
  );
};

export function LinkitItem({
  children,
  size,
  onSizeChange,
  onDelete,
  className,
  disabled = false,
}: LinkitItemProps) {
  const [internalSize, setInternalSize] = useState<LinkitItemSize>('md');

  // Use controlled or uncontrolled state
  const currentSize = size ?? internalSize;
  const handleSizeChange = (newSize: LinkitItemSize) => {
    if (disabled) return;
    if (onSizeChange) {
      onSizeChange(newSize);
    } else {
      setInternalSize(newSize);
    }
  };

  const handleDelete = () => {
    if (disabled || !onDelete) return;
    onDelete();
  };

  return (
    <div
      className={cn(linkitItemVariants({ size: currentSize }), disabled && 'opacity-50', className)}
      role="article"
      aria-label="Linkit item"
    >
      {/* Content */}
      <div className="relative z-0 h-full w-full overflow-hidden">{children}</div>

      {/* Delete Control */}
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={disabled}
          className={cn(
            'absolute -top-4 -left-4 z-10 bg-white shadow-md hover:bg-gray-50 rounded-full transition-opacity duration-200',
            'opacity-0 group-hover:opacity-100'
          )}
          aria-label="Delete item"
        >
          <Trash2 className="size-4 text-gray-700" />
        </Button>
      )}

      {/* Resize Control */}
      <div
        className={cn(
          'absolute -bottom-6 left-1/2 -translate-x-1/2 z-10',
          'bg-black rounded-full px-3 py-2 shadow-lg',
          'flex items-center gap-2',
          'transition-opacity duration-200',
          'opacity-0 group-hover:opacity-100'
        )}
        role="toolbar"
        aria-label="Resize controls"
      >
        {(['xs', 'sm', 'md', 'lg', 'xl'] as LinkitItemSize[]).map(sizeOption => (
          <button
            key={sizeOption}
            onClick={() => handleSizeChange(sizeOption)}
            disabled={disabled}
            className={cn(
              'p-1.5 rounded-md transition-all duration-200',
              'hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed',
              currentSize === sizeOption && 'bg-white'
            )}
            aria-label={`Resize to ${sizeOption}`}
            aria-pressed={currentSize === sizeOption}
          >
            <SizeIcon type={sizeOption} isActive={currentSize === sizeOption} />
          </button>
        ))}
      </div>
    </div>
  );
}
