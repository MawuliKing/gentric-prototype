import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '../Button'
import { useAuth } from '../../contexts/AuthContext'

interface AgentLayoutProps {
    children: React.ReactNode
}

export const AgentLayout: React.FC<AgentLayoutProps> = ({ children }) => {
    const location = useLocation();
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-secondary-50">
            {/* Agent Header */}
            <header className="bg-warning-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h1 className="text-heading-3 text-white">Agent Dashboard</h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span className="text-sm text-white opacity-90">Online</span>
                            </div>
                            <span className="text-sm text-white opacity-90">Agent: {user?.name}</span>
                            <Button variant="secondary" size="sm" onClick={logout}>
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Agent Sidebar */}
                <aside className="w-64 bg-white shadow-lg min-h-screen">
                    <nav className="mt-8">
                        <div className="px-4 space-y-2">
                            <Link
                                to="/agent"
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${location.pathname === '/agent'
                                        ? 'bg-warning-100 text-warning-700'
                                        : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                                    }`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                </svg>
                                Dashboard
                            </Link>
                            <Link
                                to="/agent/tickets"
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${location.pathname === '/agent/tickets'
                                        ? 'bg-warning-100 text-warning-700'
                                        : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                                    }`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Tickets
                                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
                            </Link>
                            <Link
                                to="/agent/customers"
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${location.pathname === '/agent/customers'
                                        ? 'bg-warning-100 text-warning-700'
                                        : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                                    }`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                                Customers
                            </Link>
                            <Link
                                to="/agent/reports"
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${location.pathname === '/agent/reports'
                                        ? 'bg-warning-100 text-warning-700'
                                        : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                                    }`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Reports
                            </Link>
                            <Link
                                to="/agent/analytics"
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${location.pathname === '/agent/analytics'
                                        ? 'bg-warning-100 text-warning-700'
                                        : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                                    }`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Analytics
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
