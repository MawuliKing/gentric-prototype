import React, { useState } from 'react'
import { Button, DataTable, Input, Modal, ModalBody, ModalFooter, Select, StatusBadge } from '../../../components'

// Mock agent data structure for UI demonstration
interface Agent {
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
    performance: {
        rating: number
        completedTasks: number
        totalTasks: number
    }
}

// Mock data for demonstration
const mockAgents: Agent[] = [
    {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+1 (555) 123-4567',
        status: 'active',
        lastLogin: '2024-01-15T10:30:00Z',
        createdAt: '2023-06-15T09:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        assignedProjects: 12,
        performance: {
            rating: 4.8,
            completedTasks: 45,
            totalTasks: 50
        }
    },
    {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@company.com',
        phone: '+1 (555) 234-5678',
        status: 'active',
        lastLogin: '2024-01-14T16:45:00Z',
        createdAt: '2023-08-20T14:30:00Z',
        updatedAt: '2024-01-14T16:45:00Z',
        assignedProjects: 8,
        performance: {
            rating: 4.6,
            completedTasks: 38,
            totalTasks: 42
        }
    },
    {
        id: '3',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@company.com',
        phone: '+1 (555) 345-6789',
        status: 'pending',
        lastLogin: '2024-01-10T11:20:00Z',
        createdAt: '2024-01-01T08:00:00Z',
        updatedAt: '2024-01-10T11:20:00Z',
        assignedProjects: 3,
        performance: {
            rating: 4.2,
            completedTasks: 15,
            totalTasks: 20
        }
    },
    {
        id: '4',
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.wilson@company.com',
        phone: '+1 (555) 456-7890',
        status: 'active',
        lastLogin: '2024-01-15T09:15:00Z',
        createdAt: '2023-03-10T10:15:00Z',
        updatedAt: '2024-01-15T09:15:00Z',
        assignedProjects: 15,
        performance: {
            rating: 4.9,
            completedTasks: 67,
            totalTasks: 70
        }
    },
    {
        id: '5',
        firstName: 'David',
        lastName: 'Brown',
        email: 'david.brown@company.com',
        phone: '+1 (555) 567-8901',
        status: 'inactive',
        lastLogin: '2023-12-20T14:30:00Z',
        createdAt: '2023-05-15T11:45:00Z',
        updatedAt: '2023-12-20T14:30:00Z',
        assignedProjects: 0,
        performance: {
            rating: 3.8,
            completedTasks: 28,
            totalTasks: 35
        }
    }
]

const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' }
]

export const Agents: React.FC = () => {
    const [agents, setAgents] = useState<Agent[]>(mockAgents)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const [newAgent, setNewAgent] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        status: 'pending' as const
    })

    const [editAgent, setEditAgent] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        status: 'active' as 'active' | 'inactive' | 'pending'
    })

    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({})

    // Filter agents based on search and filters
    const filteredAgents = agents.filter(agent => {
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
                    status={value === 'active' ? 'success' : value === 'pending' ? 'warning' : 'error'}
                >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
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
            render: (value: Agent['performance']) => (
                <div className="text-sm">
                    <div className="font-medium text-secondary-900">
                        ⭐ {value.rating}/5.0
                    </div>
                    <div className="text-secondary-500">
                        {value.completedTasks}/{value.totalTasks} tasks
                    </div>
                </div>
            )
        },
        {
            key: 'lastLogin' as keyof Agent,
            title: 'Last Login',
            render: (value: string) => (
                <span className="text-sm text-secondary-600">
                    {new Date(value).toLocaleDateString()}
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
                        variant={agent.status === 'active' ? 'error' : 'primary'}
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleToggleStatus(agent)
                        }}
                    >
                        {agent.status === 'active' ? 'Deactivate' : 'Activate'}
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
        if (!newAgent.phone.trim()) {
            newErrors.phone = 'Phone is required'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            const newAgentData: Agent = {
                id: Date.now().toString(),
                ...newAgent,
                lastLogin: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                assignedProjects: 0,
                performance: {
                    rating: 0,
                    completedTasks: 0,
                    totalTasks: 0
                }
            }

            setAgents([...agents, newAgentData])
            setNewAgent({
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
        if (!editAgent.phone.trim()) {
            newErrors.phone = 'Phone is required'
        }

        if (Object.keys(newErrors).length > 0) {
            setEditErrors(newErrors)
            return
        }

        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setAgents(agents.map(agent =>
                agent.id === editingAgent.id
                    ? { ...agent, ...editAgent, updatedAt: new Date().toISOString() }
                    : agent
            ))

            setEditAgent({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                status: 'active'
            })
            setEditErrors({})
            setEditingAgent(null)
            setIsEditModalOpen(false)
            setIsLoading(false)
        }, 1000)
    }

    const handleEdit = (agent: Agent) => {
        setEditingAgent(agent)
        setEditAgent({
            firstName: agent.firstName,
            lastName: agent.lastName,
            email: agent.email,
            phone: agent.phone,
            status: agent.status
        })
        setEditErrors({})
        setIsEditModalOpen(true)
    }

    const handleToggleStatus = async (agent: Agent) => {
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setAgents(agents.map(a =>
                a.id === agent.id
                    ? { ...a, status: a.status === 'active' ? 'inactive' : 'active', updatedAt: new Date().toISOString() }
                    : a
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
                    <h1 className="text-heading-1 mb-2">Agents</h1>
                    <p className="text-body-large text-secondary-600">
                        Manage your team of agents and their assignments.
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
                    Add Agent
                </Button>
            </div>

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
                            <p className="text-2xl font-semibold text-secondary-900">{agents.length}</p>
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
                                {agents.filter(a => a.status === 'active').length}
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
                                {agents.filter(a => a.status === 'pending').length}
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
                                {agents.reduce((sum, agent) => sum + agent.assignedProjects, 0)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Agents Table */}
            <DataTable
                data={filteredAgents}
                columns={columns}
                loading={isLoading}
                emptyMessage="No agents found. Click 'Add Agent' to create your first agent."
            />

            {/* Add Agent Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false)
                    setNewAgent({
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: '',
                        status: 'pending'
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
                            disabled={isLoading}
                        />
                        <Input
                            label="Last Name"
                            placeholder="Enter last name"
                            value={newAgent.lastName}
                            onChange={(e) => setNewAgent({ ...newAgent, lastName: e.target.value })}
                            error={errors.lastName}
                            required
                            disabled={isLoading}
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter email address"
                            value={newAgent.email}
                            onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                            error={errors.email}
                            required
                            disabled={isLoading}
                        />
                        <Input
                            label="Phone"
                            placeholder="Enter phone number"
                            value={newAgent.phone}
                            onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
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
                            setNewAgent({
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
                        phone: '',
                        status: 'active'
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
                            disabled={isLoading}
                        />
                        <Input
                            label="Last Name"
                            placeholder="Enter last name"
                            value={editAgent.lastName}
                            onChange={(e) => setEditAgent({ ...editAgent, lastName: e.target.value })}
                            error={editErrors.lastName}
                            required
                            disabled={isLoading}
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter email address"
                            value={editAgent.email}
                            onChange={(e) => setEditAgent({ ...editAgent, email: e.target.value })}
                            error={editErrors.email}
                            required
                            disabled={isLoading}
                        />
                        <Input
                            label="Phone"
                            placeholder="Enter phone number"
                            value={editAgent.phone}
                            onChange={(e) => setEditAgent({ ...editAgent, phone: e.target.value })}
                            error={editErrors.phone}
                            required
                            disabled={isLoading}
                        />
                        <div className="md:col-span-2">
                            <Select
                                label="Status"
                                placeholder="Select status"
                                value={editAgent.status}
                                onChange={(e) => setEditAgent({ ...editAgent, status: e.target.value as any })}
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
                            setEditAgent({
                                firstName: '',
                                lastName: '',
                                email: '',
                                phone: '',
                                status: 'active'
                            })
                            setEditErrors({})
                            setEditingAgent(null)
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
                            'Update Agent'
                        )}
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}
