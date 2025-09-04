import React from 'react'

interface CardProps {
    children: React.ReactNode
    className?: string
    hover?: boolean
    padding?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    hover = true,
    padding = 'md'
}) => {
    const baseClasses = 'bg-white rounded-lg border border-secondary-200 shadow-soft'
    const hoverClasses = hover ? 'hover:shadow-medium transition-shadow duration-200' : ''

    const paddingClasses = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
    }

    const classes = `${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`

    return (
        <div className={classes}>
            {children}
        </div>
    )
}

interface CardHeaderProps {
    children: React.ReactNode
    className?: string
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
    return (
        <div className={`mb-4 ${className}`}>
            {children}
        </div>
    )
}

interface CardContentProps {
    children: React.ReactNode
    className?: string
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
    return (
        <div className={className}>
            {children}
        </div>
    )
}

interface CardFooterProps {
    children: React.ReactNode
    className?: string
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
    return (
        <div className={`mt-4 pt-4 border-t border-secondary-200 ${className}`}>
            {children}
        </div>
    )
}
