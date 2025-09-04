import React from 'react'

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string
    error?: string
    helperText?: string
    variant?: 'default' | 'filled'
    size?: 'sm' | 'md' | 'lg'
}

export const Checkbox: React.FC<CheckboxProps> = ({
    label,
    error,
    helperText,
    variant = 'default',
    size = 'md',
    className = '',
    id,
    ...props
}) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    }

    const baseClasses = 'rounded border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1'

    const variantClasses = {
        default: 'border-secondary-300 bg-white text-primary-600 focus:ring-primary-500',
        filled: 'border-transparent bg-secondary-100 text-primary-600 focus:ring-primary-500',
    }

    const errorClasses = error
        ? 'border-error-500 focus:ring-error-500'
        : ''

    const checkboxClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${errorClasses} ${className}`

    return (
        <div className="w-full">
            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input
                        id={checkboxId}
                        type="checkbox"
                        className={checkboxClasses}
                        {...props}
                    />
                </div>

                {label && (
                    <div className="ml-3 text-sm">
                        <label htmlFor={checkboxId} className="font-medium text-secondary-700 cursor-pointer">
                            {label}
                        </label>
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-1 text-sm text-error-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}

            {helperText && !error && (
                <p className="mt-1 text-sm text-secondary-500">
                    {helperText}
                </p>
            )}
        </div>
    )
}
