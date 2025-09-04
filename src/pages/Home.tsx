import React from 'react'
import { Button, Card } from '../components'

export const Home: React.FC = () => {
    return (
        <div className="fade-in">
            <div className="mb-8">
                <h1 className="text-display mb-4">Welcome to Gentric</h1>
                <p className="text-body-large text-secondary-600 max-w-2xl">
                    Your comprehensive report generation platform for organizations. Create, manage, and distribute professional reports with ease.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-heading-3 mb-2">Create Reports</h3>
                    <p className="text-body-small mb-4">Design and build professional reports with our intuitive editor.</p>
                    <Button variant="primary" size="sm">Get Started</Button>
                </Card>

                <Card>
                    <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-heading-3 mb-2">Generate Fast</h3>
                    <p className="text-body-small mb-4">Generate reports in seconds with our optimized processing engine.</p>
                    <Button variant="success" size="sm">Learn More</Button>
                </Card>

                <Card>
                    <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-heading-3 mb-2">Export & Share</h3>
                    <p className="text-body-small mb-4">Export to multiple formats and share with your team instantly.</p>
                    <Button variant="secondary" size="sm">View Options</Button>
                </Card>
            </div>
        </div>
    )
}
