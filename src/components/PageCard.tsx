import React from 'react';
import { cn } from '../lib/utils';

interface PageCardProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | number;
  padding?: boolean;
}

export function PageCard({
  children,
  className,
  maxWidth = 'xl',
  padding = true,
}: PageCardProps) {
  const maxWidthMap = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full',
  };

  const maxWidthClass = typeof maxWidth === 'string' ? maxWidthMap[maxWidth] : `max-w-[${maxWidth}px]`;

  return (
    <div className={cn('mx-auto', maxWidthClass, className)}>
      {padding ? (
        <div className="bg-[#e0e0e0] rounded-[15px] p-5 shadow-lg relative">
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
