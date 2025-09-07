import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '../Button'
import { useAuth } from '../../contexts/AuthContext'

interface CustomerLayoutProps {
    children: React.ReactNode
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
    const location = useLocation();
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-secondary-50">
            {/* Customer Header */}
            <header className="bg-white shadow-sm border-b border-secondary-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-success-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h1 className="text-heading-3 text-secondary-900">My Dashboard</h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-secondary-600">Hello, {user?.name}</span>
                            <Button variant="secondary" size="sm" onClick={logout}>
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Customer Navigation Tabs */}
                <div className="border-b border-secondary-200 mb-8">
                    <nav className="-mb-px flex space-x-8">
                        <Link
                            to="/customer"
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${location.pathname === '/customer'
                                ? 'border-success-500 text-success-600'
                                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                                }`}
                        >
                            Overview
                        </Link>
                        <Link
                            to="/customer/reports"
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${location.pathname === '/customer/reports'
                                ? 'border-success-500 text-success-600'
                                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                                }`}
                        >
                            My Reports
                        </Link>
                        {/* <Link
                            to="/customer/templates"
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${location.pathname === '/customer/templates'
                                    ? 'border-success-500 text-success-600'
                                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                                }`}
                        >
                            Templates
                        </Link> */}
                        {/* <Link
                            to="/customer/billing"
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${location.pathname === '/customer/billing'
                                ? 'border-success-500 text-success-600'
                                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                                }`}
                        >
                            Billing
                        </Link> */}
                    </nav>
                </div>

                {/* Main Content */}
                <main>
                    {children}
                </main>
            </div>
        </div>
    )
}
