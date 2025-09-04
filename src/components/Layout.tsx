import React from 'react'
import { Navigation } from './Navigation'

interface LayoutProps {
    children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-secondary-50">
            <Navigation />
            <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {children}
                </div>
            </main>
        </div>
    )
}
