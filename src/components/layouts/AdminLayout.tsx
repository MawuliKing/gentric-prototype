import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '../Button'
import { useAuth } from '../../contexts/AuthContext'

interface AdminLayoutProps {
    children: React.ReactNode
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const location = useLocation();
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-secondary-50">
            {/* Admin Header */}
            <header className="bg-primary-700 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h1 className="text-heading-3 text-white">Admin Dashboard</h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-white opacity-90">Welcome, {user?.name}</span>
                            <Button variant="secondary" size="sm" onClick={logout}>
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Admin Sidebar */}
                <aside className="w-64 bg-white shadow-lg min-h-screen">
                    <nav className="mt-8">
                        <div className="px-4 space-y-2">
                            <Link
                                to="/admin"
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${location.pathname === '/admin'
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                                    }`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                </svg>
                                Dashboard
                            </Link>
                            <Link
                                to="/admin/users"
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${location.pathname === '/admin/users'
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                                    }`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                                Users
                            </Link>
                            <Link
                                to="/admin/reports"
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${location.pathname === '/admin/reports'
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                                    }`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Reports
                            </Link>
                            <Link
                                to="/admin/settings"
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${location.pathname === '/admin/settings'
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                                    }`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Settings
                            </Link>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
