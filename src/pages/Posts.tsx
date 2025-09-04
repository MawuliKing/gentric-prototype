import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button, Card, StatusBadge, DataTable } from '../components'

export const Posts: React.FC = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['posts'],
        queryFn: () =>
            fetch('https://jsonplaceholder.typicode.com/posts')
                .then(res => res.json()),
    })

    return (
        <div className="fade-in">
            <div className="mb-6">
                <h1 className="text-heading-1 mb-2">Sample Reports</h1>
                <p className="text-body-large text-secondary-600">
                    Example data fetched using React Query to demonstrate our data fetching capabilities.
                </p>
            </div>

            {error && (
                <Card className="border-l-4 border-error">
                    <div className="flex items-center">
                        <StatusBadge status="error" className="mr-3">Error</StatusBadge>
                        <p className="text-body">{error.message}</p>
                    </div>
                </Card>
            )}

            {data && (
                <DataTable
                    data={data.slice(0, 10)}
                    columns={[
                        {
                            key: 'id',
                            title: 'ID',
                            width: '80px',
                            render: (value) => <span className="text-caption">#{value}</span>
                        },
                        {
                            key: 'title',
                            title: 'Report Title',
                            render: (value) => <span className="font-medium text-secondary-800">{value}</span>
                        },
                        {
                            key: 'body',
                            title: 'Description',
                            render: (value) => (
                                <span className="text-body-small text-secondary-600">
                                    {value.length > 100 ? `${value.substring(0, 100)}...` : value}
                                </span>
                            )
                        },
                        {
                            key: 'status',
                            title: 'Status',
                            width: '120px',
                            render: () => <StatusBadge status="success">Active</StatusBadge>
                        },
                        {
                            key: 'actions',
                            title: 'Actions',
                            width: '200px',
                            render: () => (
                                <div className="flex space-x-2">
                                    <Button variant="secondary" size="sm">View</Button>
                                    <Button variant="primary" size="sm">Export</Button>
                                </div>
                            )
                        }
                    ]}
                    loading={isLoading}
                    emptyMessage="No reports available"
                    onRowClick={(item) => console.log('Row clicked:', item)}
                />
            )}
        </div>
    )
}
