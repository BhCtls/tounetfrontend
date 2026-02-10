import React from 'react';
import { Input, type InputProps } from './Input';
import { cn } from '../../lib/utils';

interface FormFieldProps extends Omit<InputProps, 'error'> {
  label: string;
  error?: React.ReactNode;
  helperText?: string;
  required?: boolean;
}

export function FormField({
  label,
  error,
  helperText,
  required,
  className,
  id,
  ...props
}: FormFieldProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={cn('space-y-1', className)}>
      <label
        htmlFor={inputId}
        className={cn(
          'block text-sm font-medium text-gray-700',
          required && "after:content-['*'] after:ml-0.5 after:text-red-500"
        )}
      >
        {label}
      </label>
      <Input id={inputId} {...props} error={undefined} />
      {error && (
        <p className="text-sm text-red-600" id={`${inputId}-error`}>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500" id={`${inputId}-helper`}>
          {helperText}
        </p>
      )}
    </div>
  );
}
