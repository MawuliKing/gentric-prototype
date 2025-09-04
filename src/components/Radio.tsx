import React from 'react'

interface RadioOption {
    value: string | number
    label: string
    disabled?: boolean
}

interface RadioGroupProps {
    name: string
    options: RadioOption[]
    value?: string | number
    onChange?: (value: string | number) => void
    label?: string
    error?: string
    helperText?: string
    variant?: 'default' | 'filled'
    size?: 'sm' | 'md' | 'lg'
    orientation?: 'vertical' | 'horizontal'
    className?: string
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
    name,
    options,
    value,
    onChange,
    label,
    error,
    helperText,
    variant = 'default',
    size = 'md',
    orientation = 'vertical',
    className = '',
}) => {
    const groupId = `radio-group-${Math.random().toString(36).substr(2, 9)}`

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    }

    const baseClasses = 'border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1'

    const variantClasses = {
        default: 'border-secondary-300 bg-white text-primary-600 focus:ring-primary-500',
        filled: 'border-transparent bg-secondary-100 text-primary-600 focus:ring-primary-500',
    }

    const errorClasses = error
        ? 'border-error-500 focus:ring-error-500'
        : ''

    const radioClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${errorClasses}`

    const containerClasses = orientation === 'horizontal'
        ? 'flex flex-wrap gap-4'
        : 'space-y-2'

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="form-label">
                    {label}
                </label>
            )}

            <div className={containerClasses}>
                {options.map((option) => (
                    <div key={option.value} className="flex items-center">
                        <input
                            id={`${groupId}-${option.value}`}
                            name={name}
                            type="radio"
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => onChange?.(option.value)}
                            disabled={option.disabled}
                            className={radioClasses}
                        />
                        <label
                            htmlFor={`${groupId}-${option.value}`}
                            className={`ml-2 text-sm font-medium text-secondary-700 cursor-pointer ${option.disabled ? 'text-secondary-400 cursor-not-allowed' : ''
                                }`}
                        >
                            {option.label}
                        </label>
                    </div>
                ))}
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
