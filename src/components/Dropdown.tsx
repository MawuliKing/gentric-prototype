import React, { useState, useRef, useEffect } from 'react'

interface DropdownOption {
    value: string | number
    label: string
    disabled?: boolean
    icon?: React.ReactNode
}

interface DropdownProps {
    options: DropdownOption[]
    value?: string | number
    onChange?: (value: string | number) => void
    placeholder?: string
    label?: string
    error?: string
    helperText?: string
    disabled?: boolean
    className?: string
}

export const Dropdown: React.FC<DropdownProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    label,
    error,
    helperText,
    disabled = false,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const selectedOption = options.find(option => option.value === value)

    const baseClasses = 'w-full px-3 py-2 text-sm border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer'
    const normalClasses = 'border-secondary-300 bg-white hover:border-secondary-400 focus:border-primary-500 focus:ring-primary-500'
    const errorClasses = 'border-error-500 focus:border-error-500 focus:ring-error-500'
    const disabledClasses = 'border-secondary-200 bg-secondary-50 text-secondary-400 cursor-not-allowed'

    const buttonClasses = `${baseClasses} ${disabled
        ? disabledClasses
        : error
            ? errorClasses
            : normalClasses
        } ${className}`

    return (
        <div className="w-full" ref={dropdownRef}>
            {label && (
                <label className="form-label">
                    {label}
                </label>
            )}

            <div className="relative">
                <button
                    type="button"
                    className={buttonClasses}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {selectedOption?.icon && (
                                <span className="mr-2 text-secondary-400">
                                    {selectedOption.icon}
                                </span>
                            )}
                            <span className={selectedOption ? 'text-secondary-900' : 'text-secondary-500'}>
                                {selectedOption ? selectedOption.label : placeholder}
                            </span>
                        </div>
                        <svg
                            className={`w-4 h-4 text-secondary-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                                }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>

                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-secondary-200 rounded-md shadow-strong max-h-60 overflow-auto">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={`w-full px-3 py-2 text-left text-sm transition-colors duration-150 flex items-center ${option.disabled
                                    ? 'text-secondary-400 cursor-not-allowed'
                                    : option.value === value
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-secondary-700 hover:bg-secondary-50'
                                    }`}
                                onClick={() => {
                                    if (!option.disabled) {
                                        onChange?.(option.value)
                                        setIsOpen(false)
                                    }
                                }}
                                disabled={option.disabled}
                            >
                                {option.icon && (
                                    <span className="mr-2 text-secondary-400">
                                        {option.icon}
                                    </span>
                                )}
                                {option.label}
                            </button>
                        ))}
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
