import React, { useState } from 'react'
import { Button, DataTable, Input, Modal, ModalBody, ModalFooter, Select, StatusBadge } from '../../../components'

// Mock customer data structure for UI demonstration
interface Customer {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    status: 'active' | 'inactive' | 'pending'
    lastLogin: string
    createdAt: string
    updatedAt: string
    assignedProjects: number
}

// Mock data for demonstration
const mockCustomers: Customer[] = [
    {
        id: '1',
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@company.com',
        phone: '+1 (555) 123-4567',
        status: 'active',
        lastLogin: '2024-01-15T10:30:00Z',
        createdAt: '2023-06-15T09:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        assignedProjects: 5
    },
    {
        id: '2',
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'bob.smith@company.com',
        phone: '+1 (555) 234-5678',
        status: 'active',
        lastLogin: '2024-01-14T16:45:00Z',
        createdAt: '2023-08-20T14:30:00Z',
        updatedAt: '2024-01-14T16:45:00Z',
        assignedProjects: 3
    },
    {
        id: '3',
        firstName: 'Carol',
        lastName: 'Williams',
        email: 'carol.williams@company.com',
        phone: '+1 (555) 345-6789',
        status: 'pending',
        lastLogin: '2024-01-10T11:20:00Z',
        createdAt: '2024-01-01T08:00:00Z',
        updatedAt: '2024-01-10T11:20:00Z',
        assignedProjects: 1
    },
    {
        id: '4',
        firstName: 'David',
        lastName: 'Brown',
        email: 'david.brown@company.com',
        phone: '+1 (555) 456-7890',
        status: 'active',
        lastLogin: '2024-01-15T09:15:00Z',
        createdAt: '2023-03-10T10:15:00Z',
        updatedAt: '2024-01-15T09:15:00Z',
        assignedProjects: 8
    },
    {
        id: '5',
        firstName: 'Eva',
        lastName: 'Davis',
        email: 'eva.davis@company.com',
        phone: '+1 (555) 567-8901',
        status: 'inactive',
        lastLogin: '2023-12-20T14:30:00Z',
        createdAt: '2023-05-15T11:45:00Z',
        updatedAt: '2023-12-20T14:30:00Z',
        assignedProjects: 0
    }
]

const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' }
]

export const Customers: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const [newCustomer, setNewCustomer] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        status: 'pending' as const
    })

    const [editCustomer, setEditCustomer] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        status: 'active' as 'active' | 'inactive' | 'pending'
    })

    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({})

    // Filter customers based on search and filters
    const filteredCustomers = customers.filter(customer => {
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
                    status={value === 'active' ? 'success' : value === 'pending' ? 'warning' : 'error'}
                >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
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
            key: 'lastLogin' as keyof Customer,
            title: 'Last Login',
            render: (value: string) => (
                <span className="text-sm text-secondary-600">
                    {new Date(value).toLocaleDateString()}
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
                        variant={customer.status === 'active' ? 'error' : 'primary'}
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleToggleStatus(customer)
                        }}
                    >
                        {customer.status === 'active' ? 'Deactivate' : 'Activate'}
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
        if (!newCustomer.phone.trim()) {
            newErrors.phone = 'Phone is required'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            const newCustomerData: Customer = {
                id: Date.now().toString(),
                ...newCustomer,
                lastLogin: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                assignedProjects: 0
            }

            setCustomers([...customers, newCustomerData])
            setNewCustomer({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                status: 'pending'
            })
            setErrors({})
            setIsAddModalOpen(false)
            setIsLoading(false)
        }, 1000)
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
        if (!editCustomer.phone.trim()) {
            newErrors.phone = 'Phone is required'
        }

        if (Object.keys(newErrors).length > 0) {
            setEditErrors(newErrors)
            return
        }

        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setCustomers(customers.map(customer =>
                customer.id === editingCustomer.id
                    ? { ...customer, ...editCustomer, updatedAt: new Date().toISOString() }
                    : customer
            ))

            setEditCustomer({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                status: 'active'
            })
            setEditErrors({})
            setEditingCustomer(null)
            setIsEditModalOpen(false)
            setIsLoading(false)
        }, 1000)
    }

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer)
        setEditCustomer({
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phone: customer.phone,
            status: customer.status
        })
        setEditErrors({})
        setIsEditModalOpen(true)
    }

    const handleToggleStatus = async (customer: Customer) => {
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setCustomers(customers.map(c =>
                c.id === customer.id
                    ? { ...c, status: c.status === 'active' ? 'inactive' : 'active', updatedAt: new Date().toISOString() }
                    : c
            ))
            setIsLoading(false)
        }, 500)
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
                    disabled={isLoading}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Customer
                </Button>
            </div>

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
                            <p className="text-2xl font-semibold text-secondary-900">{customers.length}</p>
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
                                {customers.filter(c => c.status === 'active').length}
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
                                {customers.filter(c => c.status === 'pending').length}
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
                                {customers.reduce((sum, customer) => sum + customer.assignedProjects, 0)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customers Table */}
            <DataTable
                data={filteredCustomers}
                columns={columns}
                loading={isLoading}
                emptyMessage="No customers found. Click 'Add Customer' to create your first customer."
            />

            {/* Add Customer Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false)
                    setNewCustomer({
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: '',
                        status: 'pending'
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
                            disabled={isLoading}
                        />
                        <Input
                            label="Last Name"
                            placeholder="Enter last name"
                            value={newCustomer.lastName}
                            onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                            error={errors.lastName}
                            required
                            disabled={isLoading}
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter email address"
                            value={newCustomer.email}
                            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                            error={errors.email}
                            required
                            disabled={isLoading}
                        />
                        <Input
                            label="Phone"
                            placeholder="Enter phone number"
                            value={newCustomer.phone}
                            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                            error={errors.phone}
                            required
                            disabled={isLoading}
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
                                email: '',
                                phone: '',
                                status: 'pending'
                            })
                            setErrors({})
                        }}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleAdd}
                        disabled={isLoading}
                    >
                        {isLoading ? (
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
                        phone: '',
                        status: 'active'
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
                            disabled={isLoading}
                        />
                        <Input
                            label="Last Name"
                            placeholder="Enter last name"
                            value={editCustomer.lastName}
                            onChange={(e) => setEditCustomer({ ...editCustomer, lastName: e.target.value })}
                            error={editErrors.lastName}
                            required
                            disabled={isLoading}
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter email address"
                            value={editCustomer.email}
                            onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })}
                            error={editErrors.email}
                            required
                            disabled={isLoading}
                        />
                        <Input
                            label="Phone"
                            placeholder="Enter phone number"
                            value={editCustomer.phone}
                            onChange={(e) => setEditCustomer({ ...editCustomer, phone: e.target.value })}
                            error={editErrors.phone}
                            required
                            disabled={isLoading}
                        />
                        <div className="md:col-span-2">
                            <Select
                                label="Status"
                                placeholder="Select status"
                                value={editCustomer.status}
                                onChange={(e) => setEditCustomer({ ...editCustomer, status: e.target.value as any })}
                                options={statusOptions}
                                disabled={isLoading}
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
                                phone: '',
                                status: 'active'
                            })
                            setEditErrors({})
                            setEditingCustomer(null)
                        }}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleUpdate}
                        disabled={isLoading}
                    >
                        {isLoading ? (
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
