import React from 'react'

interface Column<T> {
    key: keyof T
    title: string
    render?: (value: any, item: T) => React.ReactNode
    sortable?: boolean
    width?: string
}

interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    className?: string
    onRowClick?: (item: T) => void
    loading?: boolean
    emptyMessage?: string
}

export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    className = '',
    onRowClick,
    loading = false,
    emptyMessage = 'No data available'
}: DataTableProps<T>) {
    if (loading) {
        return (
            <div className={`bg-white rounded-lg border border-secondary-200 shadow-soft ${className}`}>
                <div className="p-8 text-center">
                    <div className="animate-pulse-soft">
                        <div className="w-8 h-8 bg-primary-200 rounded-full mx-auto mb-4"></div>
                        <p className="text-body text-secondary-600">Loading data...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className={`bg-white rounded-lg border border-secondary-200 shadow-soft ${className}`}>
                <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-secondary-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-6 h-6 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-body text-secondary-600">{emptyMessage}</p>
                </div>
            </div>
        )
    }

    return (
        <div className={`bg-white rounded-lg border border-secondary-200 shadow-soft overflow-hidden ${className}`}>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-secondary-200">
                    <thead className="bg-secondary-50">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className={`px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-secondary-100' : ''
                                        }`}
                                    style={{ width: column.width }}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{column.title}</span>
                                        {column.sortable && (
                                            <svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                            </svg>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-secondary-200">
                        {data.map((item, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={`${onRowClick ? 'cursor-pointer hover:bg-secondary-50' : ''} transition-colors duration-150`}
                                onClick={() => onRowClick?.(item)}
                            >
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-secondary-700"
                                    >
                                        {column.render
                                            ? column.render(item[column.key], item)
                                            : item[column.key]
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
