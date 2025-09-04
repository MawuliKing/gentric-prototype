import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
    size?: 'sm' | 'md' | 'lg'
    children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    ...props
}) => {
    const baseClasses = 'font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variantClasses = {
        primary: 'bg-primary-700 text-white hover:bg-primary-800 focus:ring-primary-500',
        secondary: 'bg-white text-primary-700 border border-primary-200 hover:bg-primary-50 hover:border-primary-300 focus:ring-primary-500',
        success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500',
        warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500',
        error: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
    }

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    }

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    )
}
