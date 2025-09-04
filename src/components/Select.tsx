import React from 'react'

interface SelectOption {
    value: string | number
    label: string
    disabled?: boolean
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
    label?: string
    error?: string
    helperText?: string
    options: SelectOption[]
    placeholder?: string
    variant?: 'default' | 'filled' | 'outlined'
}

export const Select: React.FC<SelectProps> = ({
    label,
    error,
    helperText,
    options,
    placeholder,
    variant = 'default',
    className = '',
    id,
    ...props
}) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`

    const baseClasses = 'w-full px-3 py-2 text-sm border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 appearance-none cursor-pointer'

    const variantClasses = {
        default: 'border-secondary-300 bg-white focus:border-primary-500 focus:ring-primary-500',
        filled: 'border-transparent bg-secondary-100 focus:bg-white focus:border-primary-500 focus:ring-primary-500',
        outlined: 'border-2 border-secondary-300 bg-transparent focus:border-primary-500 focus:ring-primary-500',
    }

    const errorClasses = error
        ? 'border-error-500 focus:border-error-500 focus:ring-error-500'
        : ''

    const selectClasses = `${baseClasses} ${variantClasses[variant]} ${errorClasses} ${className}`

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={selectId} className="form-label">
                    {label}
                </label>
            )}

            <div className="relative">
                <select
                    id={selectId}
                    className={selectClasses}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
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
