import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from './Button'
import { useAuth } from '../contexts/AuthContext'

export const Navigation: React.FC = () => {
    const location = useLocation();
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-soft border-b border-secondary-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h1 className="text-heading-3 text-secondary-900">Gecric</h1>
                        </div>
                    </div>

                    <div className="flex items-center space-x-8">
                        <Link
                            to="/"
                            className={`text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md ${location.pathname === '/'
                                ? 'text-primary-700 bg-primary-50'
                                : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/posts"
                            className={`text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md ${location.pathname === '/posts'
                                ? 'text-primary-700 bg-primary-50'
                                : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                                }`}
                        >
                            Reports
                        </Link>
                        <Link
                            to="/components"
                            className={`text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md ${location.pathname === '/components'
                                ? 'text-primary-700 bg-primary-50'
                                : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                                }`}
                        >
                            Components
                        </Link>
                        <Link
                            to="/storage-demo"
                            className={`text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md ${location.pathname === '/storage-demo'
                                ? 'text-primary-700 bg-primary-50'
                                : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                                }`}
                        >
                            Storage Demo
                        </Link>
                        <Link
                            to="/api-demo"
                            className={`text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md ${location.pathname === '/api-demo'
                                ? 'text-primary-700 bg-primary-50'
                                : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                                }`}
                        >
                            API Demo
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/profile"
                                    className={`text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md ${location.pathname === '/profile'
                                        ? 'text-primary-700 bg-primary-50'
                                        : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                                        }`}
                                >
                                    Profile
                                </Link>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-secondary-600">Welcome, {user?.name}</span>
                                    <Button variant="secondary" size="sm" onClick={logout}>
                                        Sign Out
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className={`text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md ${location.pathname === '/login'
                                    ? 'text-primary-700 bg-primary-50'
                                    : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                                    }`}
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
