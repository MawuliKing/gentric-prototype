import React from 'react'

interface StatusBadgeProps {
    status: 'success' | 'warning' | 'error' | 'info' | 'pending'
    children: React.ReactNode
    className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    children,
    className = ''
}) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide'

    const statusClasses = {
        success: 'bg-success-100 text-success-800',
        warning: 'bg-warning-100 text-warning-800',
        error: 'bg-error-100 text-error-800',
        info: 'bg-primary-100 text-primary-800',
        pending: 'bg-secondary-100 text-secondary-800',
    }

    const classes = `${baseClasses} ${statusClasses[status]} ${className}`

    return (
        <span className={classes}>
            {children}
        </span>
    )
}

interface StatusIndicatorProps {
    status: 'success' | 'warning' | 'error' | 'info' | 'pending'
    className?: string
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
    status,
    className = ''
}) => {
    const baseClasses = 'w-2 h-2 rounded-full'

    const statusClasses = {
        success: 'bg-success-500',
        warning: 'bg-warning-500',
        error: 'bg-error-500',
        info: 'bg-primary-500',
        pending: 'bg-secondary-400',
    }

    const classes = `${baseClasses} ${statusClasses[status]} ${className}`

    return <div className={classes} />
}
