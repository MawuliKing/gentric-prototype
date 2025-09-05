import React, { useState } from 'react'
import { Button, DataTable, Input, Modal, ModalBody, ModalFooter, Select, StatusBadge } from '../../../components'
import { useAgents } from '../../../hooks/useAgents'
import type { Agent, CreateAgentRequest } from '../../../types/api'


const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'PENDING', label: 'Pending' }
]

export const Agents: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(10)

    // Use the agents hook for backend integration
    const {
        agents,
        loading,
        error,
        total,
        totalPages,
        createAgent,
        isCreating,
        createError
    } = useAgents({ page: currentPage, pageSize })

    const [newAgent, setNewAgent] = useState<CreateAgentRequest>({
        firstName: '',
        lastName: '',
        otherName: '',
        email: '',
        phoneNumber: ''
    })

    const [editAgent, setEditAgent] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'PENDING'
    })

    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({})

    // Add hardcoded performance data to agents
    const agentsWithPerformance = agents.map(agent => ({
        ...agent,
        assignedProjects: Math.floor(Math.random() * 20), // Random 0-19 projects
        performance: {
            rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Random 3.0-5.0 rating
            completedTasks: Math.floor(Math.random() * 100),
            totalTasks: Math.floor(Math.random() * 100) + 50
        }
    }))

    // Filter agents based on search and filters
    const filteredAgents = agentsWithPerformance.filter(agent => {
        const matchesSearch = searchTerm === '' ||
            agent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.email.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === '' || agent.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const columns = [
        {
            key: 'name' as keyof Agent,
            title: 'Agent',
            render: (_: any, agent: Agent) => (
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-700">
                            {agent.firstName[0]}{agent.lastName[0]}
                        </span>
                    </div>
                    <div className="ml-4">
                        <div className="font-medium text-secondary-900">
                            {agent.firstName} {agent.lastName}
                        </div>
                        <div className="text-sm text-secondary-500">{agent.email}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'status' as keyof Agent,
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
            key: 'assignedProjects' as keyof Agent,
            title: 'Projects',
            render: (value: number) => (
                <span className="text-sm font-medium text-secondary-900">{value}</span>
            )
        },
        {
            key: 'performance' as keyof Agent,
            title: 'Performance',
            render: () => (
                <div className="text-sm">
                    <div className="font-medium text-secondary-900">
                        ⭐ 5/5.0
                    </div>
                    <div className="text-secondary-500">
                        0/0
                    </div>
                </div>
            )
        },
        {
            key: 'lastLoginAt' as keyof Agent,
            title: 'Last Login',
            render: (value: string | null) => (
                <span className="text-sm text-secondary-600">
                    {value ? new Date(value).toLocaleDateString() : 'Never'}
                </span>
            )
        },
        {
            key: 'actions' as keyof Agent,
            title: 'Actions',
            render: (_: any, agent: Agent) => (
                <div className="flex space-x-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(agent)
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant={agent.status === 'ACTIVE' ? 'error' : 'primary'}
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleToggleStatus(agent)
                        }}
                    >
                        {agent.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </Button>
                </div>
            )
        }
    ]

    const handleAdd = async () => {
        // Validate form
        const newErrors: { [key: string]: string } = {}
        if (!newAgent.firstName.trim()) {
            newErrors.firstName = 'First name is required'
        }
        if (!newAgent.lastName.trim()) {
            newErrors.lastName = 'Last name is required'
        }
        if (!newAgent.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(newAgent.email)) {
            newErrors.email = 'Email is invalid'
        }
        if (!newAgent.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            const result = await createAgent(newAgent)

            if (result) {
                // Success - reset form and close modal
                setNewAgent({
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
                console.error('Failed to create agent')
            }
        } catch (err) {
            console.error('Unexpected error:', err)
        }
    }

    const handleUpdate = async () => {
        if (!editingAgent) return

        // Validate form
        const newErrors: { [key: string]: string } = {}
        if (!editAgent.firstName.trim()) {
            newErrors.firstName = 'First name is required'
        }
        if (!editAgent.lastName.trim()) {
            newErrors.lastName = 'Last name is required'
        }
        if (!editAgent.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(editAgent.email)) {
            newErrors.email = 'Email is invalid'
        }
        if (!editAgent.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required'
        }

        if (Object.keys(newErrors).length > 0) {
            setEditErrors(newErrors)
            return
        }

        // TODO: Implement update functionality
        console.log('Update agent:', editAgent)
    }

    const handleEdit = (agent: Agent) => {
        setEditingAgent(agent)
        setEditAgent({
            firstName: agent.firstName,
            lastName: agent.lastName,
            email: agent.email,
            phoneNumber: agent.phoneNumber,
            status: agent.status
        })
        setEditErrors({})
        setIsEditModalOpen(true)
    }

    const handleToggleStatus = async (agent: Agent) => {
        // TODO: Implement toggle status functionality
        console.log('Toggle status for agent:', agent.id)
    }

    const clearFilters = () => {
        setSearchTerm('')
        setStatusFilter('')
    }

    const isLoading = isCreating;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-heading-1 mb-2">Agents</h1>
                    <p className="text-body-large text-secondary-600">
                        Manage your team of agents and their assignments.
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
                    Add Agent
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
                                Error Loading Agents
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
                                Error Creating Agent
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
                            placeholder="Search agents..."
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-secondary-600">Total Agents</p>
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
                            <p className="text-sm font-medium text-secondary-600">Active Agents</p>
                            <p className="text-2xl font-semibold text-secondary-900">
                                {agentsWithPerformance.filter(a => a.status === 'ACTIVE').length}
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
                            <p className="text-sm font-medium text-secondary-600">Pending Agents</p>
                            <p className="text-2xl font-semibold text-secondary-900">
                                {agentsWithPerformance.filter(a => a.status === 'PENDING').length}
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
                                {agentsWithPerformance.reduce((sum, agent) => sum + (agent.assignedProjects || 0), 0)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Agents Table */}
            <DataTable
                data={filteredAgents}
                columns={columns}
                loading={loading}
                emptyMessage="No agents found. Click 'Add Agent' to create your first agent."
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

            {/* Add Agent Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false)
                    setNewAgent({
                        firstName: '',
                        lastName: '',
                        email: '',
                        phoneNumber: '',
                        otherName: ''
                    })
                    setErrors({})
                }}
                title="Add New Agent"
                size="lg"
            >
                <ModalBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            placeholder="Enter first name"
                            value={newAgent.firstName}
                            onChange={(e) => setNewAgent({ ...newAgent, firstName: e.target.value })}
                            error={errors.firstName}
                            required
                            disabled={isCreating}
                        />
                        <Input
                            label="Last Name"
                            placeholder="Enter last name"
                            value={newAgent.lastName}
                            onChange={(e) => setNewAgent({ ...newAgent, lastName: e.target.value })}
                            error={errors.lastName}
                            required
                            disabled={isCreating}
                        />
                        <Input
                            label="Other Name (Optional)"
                            placeholder="Enter other name"
                            value={newAgent.otherName || ''}
                            onChange={(e) => setNewAgent({ ...newAgent, otherName: e.target.value })}
                            error={errors.otherName}
                            disabled={isCreating}
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter email address"
                            value={newAgent.email}
                            onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                            error={errors.email}
                            required
                            disabled={isCreating}
                        />
                        <Input
                            label="Phone Number"
                            placeholder="Enter phone number"
                            value={newAgent.phoneNumber}
                            onChange={(e) => setNewAgent({ ...newAgent, phoneNumber: e.target.value })}
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
                            setNewAgent({
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
                            'Add Agent'
                        )}
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Edit Agent Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setEditAgent({
                        firstName: '',
                        lastName: '',
                        email: '',
                        phoneNumber: '',
                        status: 'ACTIVE'
                    })
                    setEditErrors({})
                    setEditingAgent(null)
                }}
                title="Edit Agent"
                size="lg"
            >
                <ModalBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            placeholder="Enter first name"
                            value={editAgent.firstName}
                            onChange={(e) => setEditAgent({ ...editAgent, firstName: e.target.value })}
                            error={editErrors.firstName}
                            required
                            disabled={false}
                        />
                        <Input
                            label="Last Name"
                            placeholder="Enter last name"
                            value={editAgent.lastName}
                            onChange={(e) => setEditAgent({ ...editAgent, lastName: e.target.value })}
                            error={editErrors.lastName}
                            required
                            disabled={false}
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter email address"
                            value={editAgent.email}
                            onChange={(e) => setEditAgent({ ...editAgent, email: e.target.value })}
                            error={editErrors.email}
                            required
                            disabled={false}
                        />
                        <Input
                            label="Phone"
                            placeholder="Enter phone number"
                            value={editAgent.phoneNumber}
                            onChange={(e) => setEditAgent({ ...editAgent, phoneNumber: e.target.value })}
                            error={editErrors.phoneNumber}
                            required
                            disabled={false}
                        />
                        <div className="md:col-span-2">
                            <Select
                                label="Status"
                                placeholder="Select status"
                                value={editAgent.status}
                                onChange={(e) => setEditAgent({ ...editAgent, status: e.target.value as any })}
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
                            setEditAgent({
                                firstName: '',
                                lastName: '',
                                email: '',
                                phoneNumber: '',
                                status: 'ACTIVE'
                            })
                            setEditErrors({})
                            setEditingAgent(null)
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
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                            </>
                        ) : (
                            'Update Agent'
                        )}
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}
