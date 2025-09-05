import React, { useState } from 'react'
import { Button, DataTable, Input, Modal, ModalBody, ModalFooter, Select, StatusBadge } from '../../../components'
import { useCustomers } from '../../../hooks/useCustomers'
import type { Customer, CreateCustomerRequest } from '../../../types/api'

const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'PENDING', label: 'Pending' }
]

export const Customers: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(10)

    // Use the customers hook for backend integration
    const {
        customers,
        loading,
        error,
        total,
        totalPages,
        createCustomer,
        isCreating,
        createError
    } = useCustomers({ page: currentPage, pageSize })

    const [newCustomer, setNewCustomer] = useState<CreateCustomerRequest>({
        firstName: '',
        lastName: '',
        otherName: '',
        email: '',
        phoneNumber: ''
    })

    const [editCustomer, setEditCustomer] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'PENDING'
    })

    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({})

    // Add hardcoded assignedProjects data to customers
    const customersWithProjects = customers.map(customer => ({
        ...customer,
        assignedProjects: Math.floor(Math.random() * 15) // Random 0-14 projects
    }))

    // Filter customers based on search and filters
    const filteredCustomers = customersWithProjects.filter(customer => {
        const matchesSearch = searchTerm === '' ||
            customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === '' || customer.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const columns = [
        {
            key: 'name' as keyof Customer,
            title: 'Customer',
            render: (_: any, customer: Customer) => (
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-700">
                            {customer.firstName[0]}{customer.lastName[0]}
                        </span>
                    </div>
                    <div className="ml-4">
                        <div className="font-medium text-secondary-900">
                            {customer.firstName} {customer.lastName}
                        </div>
                        <div className="text-sm text-secondary-500">{customer.email}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'status' as keyof Customer,
            title: 'Status',
            render: (value: string) => (
                <StatusBadge
                    status={value === 'ACTIVE' ? 'success' : value === 'PENDING' ? 'warning' : 'error'}
                >
                    {value === 'ACTIVE' ? 'Active' : value === 'PENDING' ? 'Pending' : 'Inactive'}
                </StatusBadge>
            )
        },
        {
            key: 'assignedProjects' as keyof Customer,
            title: 'Projects',
            render: (value: number) => (
                <span className="text-sm font-medium text-secondary-900">{value}</span>
            )
        },
        {
            key: 'lastLoginAt' as keyof Customer,
            title: 'Last Login',
            render: (value: string | null) => (
                <span className="text-sm text-secondary-600">
                    {value ? new Date(value).toLocaleDateString() : 'Never'}
                </span>
            )
        },
        {
            key: 'actions' as keyof Customer,
            title: 'Actions',
            render: (_: any, customer: Customer) => (
                <div className="flex space-x-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(customer)
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant={customer.status === 'ACTIVE' ? 'error' : 'primary'}
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleToggleStatus(customer)
                        }}
                    >
                        {customer.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </Button>
                </div>
            )
        }
    ]

    const handleAdd = async () => {
        // Validate form
        const newErrors: { [key: string]: string } = {}
        if (!newCustomer.firstName.trim()) {
            newErrors.firstName = 'First name is required'
        }
        if (!newCustomer.lastName.trim()) {
            newErrors.lastName = 'Last name is required'
        }
        if (!newCustomer.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(newCustomer.email)) {
            newErrors.email = 'Email is invalid'
        }
        if (!newCustomer.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            const result = await createCustomer(newCustomer)

            if (result) {
                // Success - reset form and close modal
                setNewCustomer({
                    firstName: '',
                    lastName: '',
                    otherName: '',
                    email: '',
                    phoneNumber: ''
                })
                setErrors({})
                setIsAddModalOpen(false)
            } else {
                // Error is already set in the hook
                console.error('Failed to create customer')
            }
        } catch (err) {
            console.error('Unexpected error:', err)
        }
    }

    const handleUpdate = async () => {
        if (!editingCustomer) return

        // Validate form
        const newErrors: { [key: string]: string } = {}
        if (!editCustomer.firstName.trim()) {
            newErrors.firstName = 'First name is required'
        }
        if (!editCustomer.lastName.trim()) {
            newErrors.lastName = 'Last name is required'
        }
        if (!editCustomer.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(editCustomer.email)) {
            newErrors.email = 'Email is invalid'
        }
        if (!editCustomer.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required'
        }

        if (Object.keys(newErrors).length > 0) {
            setEditErrors(newErrors)
            return
        }

        // TODO: Implement update functionality
        console.log('Update customer:', editCustomer)
    }

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer)
        setEditCustomer({
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phoneNumber: customer.phoneNumber,
            status: customer.status
        })
        setEditErrors({})
        setIsEditModalOpen(true)
    }

    const handleToggleStatus = async (customer: Customer) => {
        // TODO: Implement toggle status functionality
        console.log('Toggle status for customer:', customer.id)
    }

    const clearFilters = () => {
        setSearchTerm('')
        setStatusFilter('')
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-heading-1 mb-2">Customers</h1>
                    <p className="text-body-large text-secondary-600">
                        Manage your customer accounts and their project assignments.
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setIsAddModalOpen(true)}
                    disabled={isCreating}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Customer
                </Button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-error-50 border border-error-200 rounded-md p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-error-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-error-800">
                                Error Loading Customers
                            </h3>
                            <div className="mt-2 text-sm text-error-700">
                                {error}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {createError && (
                <div className="bg-error-50 border border-error-200 rounded-md p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-error-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-error-800">
                                Error Creating Customer
                            </h3>
                            <div className="mt-2 text-sm text-error-700">
                                {createError}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white p-6 rounded-lg border border-secondary-200 shadow-soft">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Input
                            placeholder="Search customers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <Select
                            placeholder="Filter by status"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            options={[
                                { value: '', label: 'All Statuses' },
                                ...statusOptions
                            ]}
                        />
                    </div>
                    <div className="flex items-end">
                        <Button
                            variant="secondary"
                            onClick={clearFilters}
                            className="w-full"
                        >
                            Clear Filters
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg border border-secondary-200 shadow-soft">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-secondary-600">Total Customers</p>
                            <p className="text-2xl font-semibold text-secondary-900">{total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-secondary-200 shadow-soft">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-success-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-secondary-600">Active Customers</p>
                            <p className="text-2xl font-semibold text-secondary-900">
                                {customersWithProjects.filter(c => c.status === 'ACTIVE').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-secondary-200 shadow-soft">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-warning-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-secondary-600">Pending Customers</p>
                            <p className="text-2xl font-semibold text-secondary-900">
                                {customersWithProjects.filter(c => c.status === 'PENDING').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-secondary-200 shadow-soft">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-info-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-info-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-secondary-600">Total Projects</p>
                            <p className="text-2xl font-semibold text-secondary-900">
                                {customersWithProjects.reduce((sum, customer) => sum + (customer.assignedProjects || 0), 0)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customers Table */}
            <DataTable
                data={filteredCustomers}
                columns={columns}
                loading={loading}
                emptyMessage="No customers found. Click 'Add Customer' to create your first customer."
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-secondary-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <Button
                            variant="secondary"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-secondary-700">
                                Showing{' '}
                                <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>
                                {' '}to{' '}
                                <span className="font-medium">
                                    {Math.min(currentPage * pageSize, total)}
                                </span>
                                {' '}of{' '}
                                <span className="font-medium">{total}</span>
                                {' '}results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <Button
                                    variant="secondary"
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50"
                                >
                                    Previous
                                </Button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={page === currentPage ? "primary" : "secondary"}
                                        onClick={() => setCurrentPage(page)}
                                        className="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                    >
                                        {page}
                                    </Button>
                                ))}
                                <Button
                                    variant="secondary"
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50"
                                >
                                    Next
                                </Button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Customer Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false)
                    setNewCustomer({
                        firstName: '',
                        lastName: '',
                        otherName: '',
                        email: '',
                        phoneNumber: ''
                    })
                    setErrors({})
                }}
                title="Add New Customer"
                size="lg"
            >
                <ModalBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            placeholder="Enter first name"
                            value={newCustomer.firstName}
                            onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                            error={errors.firstName}
                            required
                            disabled={isCreating}
                        />
                        <Input
                            label="Last Name"
                            placeholder="Enter last name"
                            value={newCustomer.lastName}
                            onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                            error={errors.lastName}
                            required
                            disabled={isCreating}
                        />
                        <Input
                            label="Other Name (Optional)"
                            placeholder="Enter other name"
                            value={newCustomer.otherName || ''}
                            onChange={(e) => setNewCustomer({ ...newCustomer, otherName: e.target.value })}
                            error={errors.otherName}
                            disabled={isCreating}
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter email address"
                            value={newCustomer.email}
                            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                            error={errors.email}
                            required
                            disabled={isCreating}
                        />
                        <Input
                            label="Phone Number"
                            placeholder="Enter phone number"
                            value={newCustomer.phoneNumber}
                            onChange={(e) => setNewCustomer({ ...newCustomer, phoneNumber: e.target.value })}
                            error={errors.phoneNumber}
                            required
                            disabled={isCreating}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setIsAddModalOpen(false)
                            setNewCustomer({
                                firstName: '',
                                lastName: '',
                                otherName: '',
                                email: '',
                                phoneNumber: ''
                            })
                            setErrors({})
                        }}
                        disabled={isCreating}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleAdd}
                        disabled={isCreating}
                    >
                        {isCreating ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Adding...
                            </>
                        ) : (
                            'Add Customer'
                        )}
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Edit Customer Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setEditCustomer({
                        firstName: '',
                        lastName: '',
                        email: '',
                        phoneNumber: '',
                        status: 'ACTIVE'
                    })
                    setEditErrors({})
                    setEditingCustomer(null)
                }}
                title="Edit Customer"
                size="lg"
            >
                <ModalBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            placeholder="Enter first name"
                            value={editCustomer.firstName}
                            onChange={(e) => setEditCustomer({ ...editCustomer, firstName: e.target.value })}
                            error={editErrors.firstName}
                            required
                            disabled={false}
                        />
                        <Input
                            label="Last Name"
                            placeholder="Enter last name"
                            value={editCustomer.lastName}
                            onChange={(e) => setEditCustomer({ ...editCustomer, lastName: e.target.value })}
                            error={editErrors.lastName}
                            required
                            disabled={false}
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter email address"
                            value={editCustomer.email}
                            onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })}
                            error={editErrors.email}
                            required
                            disabled={false}
                        />
                        <Input
                            label="Phone Number"
                            placeholder="Enter phone number"
                            value={editCustomer.phoneNumber}
                            onChange={(e) => setEditCustomer({ ...editCustomer, phoneNumber: e.target.value })}
                            error={editErrors.phoneNumber}
                            required
                            disabled={false}
                        />
                        <div className="md:col-span-2">
                            <Select
                                label="Status"
                                placeholder="Select status"
                                value={editCustomer.status}
                                onChange={(e) => setEditCustomer({ ...editCustomer, status: e.target.value as any })}
                                options={statusOptions}
                                disabled={false}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setIsEditModalOpen(false)
                            setEditCustomer({
                                firstName: '',
                                lastName: '',
                                email: '',
                                phoneNumber: '',
                                status: 'ACTIVE'
                            })
                            setEditErrors({})
                            setEditingCustomer(null)
                        }}
                        disabled={false}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleUpdate}
                        disabled={false}
                    >
                        {false ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                            </>
                        ) : (
                            'Update Customer'
                        )}
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}
