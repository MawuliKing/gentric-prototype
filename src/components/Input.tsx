import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    variant?: 'default' | 'filled' | 'outlined'
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    variant = 'default',
    className = '',
    id,
    ...props
}) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    const baseClasses = 'w-full px-3 py-2 text-sm border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1'

    const variantClasses = {
        default: 'border-secondary-300 bg-white focus:border-primary-500 focus:ring-primary-500',
        filled: 'border-transparent bg-secondary-100 focus:bg-white focus:border-primary-500 focus:ring-primary-500',
        outlined: 'border-2 border-secondary-300 bg-transparent focus:border-primary-500 focus:ring-primary-500',
    }

    const errorClasses = error
        ? 'border-error-500 focus:border-error-500 focus:ring-error-500'
        : ''

    const iconClasses = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : ''

    const inputClasses = `${baseClasses} ${variantClasses[variant]} ${errorClasses} ${iconClasses} ${className}`

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={inputId} className="form-label">
                    {label}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <div className="text-secondary-400">
                            {leftIcon}
                        </div>
                    </div>
                )}

                <input
                    id={inputId}
                    className={inputClasses}
                    {...props}
                />

                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <div className="text-secondary-400">
                            {rightIcon}
                        </div>
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
