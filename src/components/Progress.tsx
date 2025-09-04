import React from 'react'

interface ProgressProps {
    value: number
    max?: number
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
    showLabel?: boolean
    label?: string
    className?: string
}

export const Progress: React.FC<ProgressProps> = ({
    value,
    max = 100,
    size = 'md',
    variant = 'default',
    showLabel = false,
    label,
    className = '',
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const sizeClasses = {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4',
    }

    const variantClasses = {
        default: 'bg-primary-600',
        success: 'bg-success-600',
        warning: 'bg-warning-600',
        error: 'bg-error-600',
        info: 'bg-primary-500',
    }

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-secondary-700">{label}</span>
                    {showLabel && (
                        <span className="text-sm text-secondary-500">{Math.round(percentage)}%</span>
                    )}
                </div>
            )}

            <div className={`w-full bg-secondary-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
                <div
                    className={`h-full transition-all duration-300 ease-out rounded-full ${variantClasses[variant]}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {!label && showLabel && (
                <div className="mt-1 text-right">
                    <span className="text-sm text-secondary-500">{Math.round(percentage)}%</span>
                </div>
            )}
        </div>
    )
}

interface CircularProgressProps {
    value: number
    max?: number
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
    showLabel?: boolean
    label?: string
    className?: string
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    value,
    max = 100,
    size = 'md',
    variant = 'default',
    showLabel = true,
    label,
    className = '',
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    const radius = size === 'sm' ? 20 : size === 'md' ? 30 : 40
    const strokeWidth = size === 'sm' ? 3 : size === 'md' ? 4 : 5
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    const sizeClasses = {
        sm: 'w-12 h-12',
        md: 'w-16 h-16',
        lg: 'w-20 h-20',
    }

    const variantClasses = {
        default: 'text-primary-600',
        success: 'text-success-600',
        warning: 'text-warning-600',
        error: 'text-error-600',
        info: 'text-primary-500',
    }

    return (
        <div className={`flex flex-col items-center ${className}`}>
            <div className={`relative ${sizeClasses[size]}`}>
                <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2}`}>
                    {/* Background circle */}
                    <circle
                        cx={radius + strokeWidth}
                        cy={radius + strokeWidth}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="none"
                        className="text-secondary-200"
                    />
                    {/* Progress circle */}
                    <circle
                        cx={radius + strokeWidth}
                        cy={radius + strokeWidth}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className={`transition-all duration-300 ease-out ${variantClasses[variant]}`}
                    />
                </svg>

                {showLabel && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-sm font-medium ${variantClasses[variant]}`}>
                            {Math.round(percentage)}%
                        </span>
                    </div>
                )}
            </div>

            {label && (
                <span className="mt-2 text-sm font-medium text-secondary-700 text-center">
                    {label}
                </span>
            )}
        </div>
    )
}
