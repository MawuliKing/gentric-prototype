import React, { useState } from 'react'
import { Button, DataTable, Input, Modal, ModalBody, ModalFooter, Select, StatusBadge, Progress } from '../../../components'
import { useCustomers } from '../../../hooks/useCustomers'
import { useAgents } from '../../../hooks/useAgents'
import { useProjectTypes } from '../../../hooks/useProjectTypes'
import { useProjects } from '../../../hooks/useProjects'
import type { CreateCustomerRequest, CreateAgentRequest, CreateProjectRequest, UpdateProjectRequest, Project } from '../../../types/api'



const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CANCELLED', label: 'Cancelled' }
]

export const Projects: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('')
    const [typeFilter, setTypeFilter] = useState<string>('')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingProject, setEditingProject] = useState<Project | null>(null)

    // Modals for adding new customers and agents
    const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false)
    const [isAddAgentModalOpen, setIsAddAgentModalOpen] = useState(false)

    // Use hooks for customers, agents, project types, and projects
    const { customers, createCustomer, isCreating: isCreatingCustomer } = useCustomers({ page: 1, pageSize: 100 })
    const { agents, createAgent, isCreating: isCreatingAgent } = useAgents({ page: 1, pageSize: 100 })
    const { projectTypes, loading: projectTypesLoading } = useProjectTypes({ page: 1, pageSize: 100 })
    const { 
        projects, 
        loading: projectsLoading, 
        createProject, 
        updateProject,
        isCreating: isCreatingProject,
        isUpdating: isUpdatingProject
    } = useProjects({ page: 1, pageSize: 100 })

    const [newProject, setNewProject] = useState<CreateProjectRequest>({
        name: '',
        description: '',
        projectTypeId: '',
        assignedAgentId: '',
        customerId: '',
        dueDate: ''
    })

    const [editProject, setEditProject] = useState<UpdateProjectRequest>({
        name: '',
        description: '',
        projectTypeId: '',
        assignedAgentId: '',
        customerId: '',
        status: 'PENDING',
        dueDate: ''
    })

    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({})

    // State for new customer and agent forms
    const [newCustomer, setNewCustomer] = useState<CreateCustomerRequest>({
        firstName: '',
        lastName: '',
        otherName: '',
        email: '',
        phoneNumber: ''
    })

    const [newAgent, setNewAgent] = useState<CreateAgentRequest>({
        firstName: '',
        lastName: '',
        otherName: '',
        email: '',
        phoneNumber: ''
    })

    const [customerErrors, setCustomerErrors] = useState<{ [key: string]: string }>({})
    const [agentErrors, setAgentErrors] = useState<{ [key: string]: string }>({})

    // Transform project types for Select component
    const projectTypeOptions = projectTypes.map(pt => ({
        value: pt.id,
        label: pt.name
    }))

    // Filter projects based on search and filters
    const filteredProjects = projects.filter(project => {
        const matchesSearch = searchTerm === '' ||
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.projectType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (project.customer?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (project.assignedAgent?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === '' || project.status === statusFilter
        const matchesType = typeFilter === '' || project.projectType.id === typeFilter

        return matchesSearch && matchesStatus && matchesType
    })

    const columns = [
        {
            key: 'name' as keyof Project,
            title: 'Project',
            render: (_: any, project: Project) => (
                <div>
                    <div className="font-medium text-secondary-900">{project.name}</div>
                    <div className="text-sm text-secondary-500">{project.projectType.name}</div>
                </div>
            )
        },
        {
            key: 'customer' as keyof Project,
            title: 'Customer',
            render: (_: any, project: Project) => (
                <span className="text-sm font-medium text-secondary-900 truncate max-w-[120px] block" title={project.customer?.fullName || 'Unassigned'}>
                    {project.customer?.fullName || 'Unassigned'}
                </span>
            )
        },
        {
            key: 'assignedAgent' as keyof Project,
            title: 'Agent',
            render: (_: any, project: Project) => (
                <span className="text-sm font-medium text-secondary-900 truncate max-w-[120px] block" title={project.assignedAgent?.fullName || 'Unassigned'}>
                    {project.assignedAgent?.fullName || 'Unassigned'}
                </span>
            )
        },
        {
            key: 'status' as keyof Project,
            title: 'Status',
            render: (_: any, project: Project) => (
                <StatusBadge
                    status={project.status === 'ACTIVE' ? 'success' : project.status === 'COMPLETED' ? 'info' : project.status === 'PENDING' ? 'warning' : 'error'}
                >
                    {project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1).toLowerCase() : 'Pending'}
                </StatusBadge>
            )
        },
        {
            key: 'reportProgress' as keyof Project,
            title: 'Report Progress',
            render: (_: any, project: Project) => {
                const progress = project.reportProgress || { totalReports: 0, completedReports: 0, inProgressReports: 0, pendingReports: 0 }
                return (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-secondary-600">Progress</span>
                            <span className="font-medium text-secondary-900">
                                {progress.completedReports}/{progress.totalReports}
                            </span>
                        </div>
                        <Progress
                            value={progress.totalReports > 0 ? (progress.completedReports / progress.totalReports) * 100 : 0}
                            size="sm"
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-secondary-500">
                            <span>{progress.completedReports} completed</span>
                            <span>{progress.inProgressReports} in progress</span>
                            <span>{progress.pendingReports} pending</span>
                        </div>
                    </div>
                )
            }
        },
        {
            key: 'actions' as keyof Project,
            title: 'Actions',
            render: (_: any, project: Project) => (
                <div className="flex space-x-1 min-w-[120px]">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleView(project)
                        }}
                        className="text-xs px-2 py-1"
                    >
                        View
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(project)
                        }}
                        className="text-xs px-2 py-1"
                    >
                        Edit
                    </Button>
                </div>
            )
        }
    ]

    const handleAdd = async () => {
        // Validate form
        const newErrors: { [key: string]: string } = {}
        if (!newProject.name.trim()) {
            newErrors.name = 'Project name is required'
        }
        if (!newProject.projectTypeId) {
            newErrors.projectTypeId = 'Project type is required'
        }
        if (!newProject.description.trim()) {
            newErrors.description = 'Description is required'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            const result = await createProject(newProject)
            if (result) {
                setNewProject({
                    name: '',
                    description: '',
                    projectTypeId: '',
                    assignedAgentId: '',
                    customerId: '',
                    dueDate: ''
                })
                setErrors({})
                setIsAddModalOpen(false)
            }
        } catch (error) {
            console.error('Failed to create project:', error)
        }
    }

    const handleUpdate = async () => {
        if (!editingProject) return

        // Validate form
        const newErrors: { [key: string]: string } = {}
        if (!editProject.name?.trim()) {
            newErrors.name = 'Project name is required'
        }
        if (!editProject.projectTypeId) {
            newErrors.projectTypeId = 'Project type is required'
        }
        if (!editProject.description?.trim()) {
            newErrors.description = 'Description is required'
        }

        if (Object.keys(newErrors).length > 0) {
            setEditErrors(newErrors)
            return
        }

        try {
            const result = await updateProject(editingProject.id, editProject)
            if (result) {
                setEditProject({
                    name: '',
                    description: '',
                    projectTypeId: '',
                    assignedAgentId: '',
                    customerId: '',
                    status: 'PENDING',
                    dueDate: ''
                })
                setEditErrors({})
                setEditingProject(null)
                setIsEditModalOpen(false)
            }
        } catch (error) {
            console.error('Failed to update project:', error)
        }
    }

    const handleView = (project: Project) => {
        // TODO: Navigate to project details page
        console.log('View project:', project.id)
    }

    const handleEdit = (project: Project) => {
        setEditingProject(project)
        setEditProject({
            name: project.name,
            description: project.description,
            projectTypeId: project.projectType.id,
            assignedAgentId: project.assignedAgent?.id || '',
            customerId: project.customer?.id || '',
            status: project.status || 'PENDING',
            dueDate: project.dueDate || ''
        })
        setEditErrors({})
        setIsEditModalOpen(true)
    }

    const clearFilters = () => {
        setSearchTerm('')
        setStatusFilter('')
        setTypeFilter('')
    }

    // Handle creating new customer
    const handleCreateCustomer = async () => {
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
            setCustomerErrors(newErrors)
            return
        }

        try {
            const result = await createCustomer(newCustomer)
            if (result) {
                setNewCustomer({
                    firstName: '',
                    lastName: '',
                    otherName: '',
                    email: '',
                    phoneNumber: ''
                })
                setCustomerErrors({})
                setIsAddCustomerModalOpen(false)
            }
        } catch (err) {
            console.error('Unexpected error:', err)
        }
    }

    // Handle creating new agent
    const handleCreateAgent = async () => {
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
            setAgentErrors(newErrors)
            return
        }

        try {
            const result = await createAgent(newAgent)
            if (result) {
                setNewAgent({
                    firstName: '',
                    lastName: '',
                    otherName: '',
                    email: '',
                    phoneNumber: ''
                })
                setAgentErrors({})
                setIsAddAgentModalOpen(false)
            }
        } catch (err) {
            console.error('Unexpected error:', err)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-heading-1 mb-2">Projects</h1>
                    <p className="text-body-large text-secondary-600">
                        Manage your projects and track their report progress.
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setIsAddModalOpen(true)}
                    disabled={projectsLoading}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Project
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-lg border border-secondary-200 shadow-soft">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <Input
                            placeholder="Search projects..."
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
                    <div>
                        <Select
                            placeholder="Filter by type"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            options={[
                                { value: '', label: 'All Types' },
                                ...projectTypeOptions
                            ]}
                            disabled={projectTypesLoading}
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-secondary-600">Total Projects</p>
                            <p className="text-2xl font-semibold text-secondary-900">{projects.length}</p>
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
                            <p className="text-sm font-medium text-secondary-600">Active Projects</p>
                            <p className="text-2xl font-semibold text-secondary-900">
                                {projects.filter(p => p.status === 'ACTIVE').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-secondary-200 shadow-soft">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-info-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-info-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-secondary-600">Completed</p>
                            <p className="text-2xl font-semibold text-secondary-900">
                                {projects.filter(p => p.status === 'COMPLETED').length}
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
                            <p className="text-sm font-medium text-secondary-600">Pending</p>
                            <p className="text-2xl font-semibold text-secondary-900">
                                {projects.filter(p => p.status === 'PENDING').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects Table */}
            <div className="bg-white rounded-lg border border-secondary-200 shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <DataTable
                        data={filteredProjects}
                        columns={columns}
                        loading={projectsLoading}
                        emptyMessage="No projects found. Click 'Add Project' to create your first project."
                    />
                </div>
            </div>

            {/* Add Project Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false)
                    setNewProject({
                        name: '',
                        description: '',
                        projectTypeId: '',
                        assignedAgentId: '',
                        customerId: '',
                        dueDate: ''
                    })
                    setErrors({})
                }}
                title="Add New Project"
                size="lg"
            >
                <ModalBody>
                    <div className="space-y-4">
                        <Input
                            label="Project Name"
                            placeholder="Enter project name"
                            value={newProject.name}
                            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                            error={errors.name}
                            required
                            disabled={isCreatingProject}
                        />
                        <Select
                            label="Project Type"
                            placeholder="Select project type"
                            value={newProject.projectTypeId}
                            onChange={(e) => setNewProject({ ...newProject, projectTypeId: e.target.value })}
                            options={projectTypeOptions}
                            error={errors.projectTypeId}
                            required
                            disabled={isCreatingProject || projectTypesLoading}
                        />
                        <div>
                            <label className="form-label">Description</label>
                            <textarea
                                className="w-full px-3 py-2 text-sm border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-secondary-50 disabled:cursor-not-allowed"
                                placeholder="Enter project description"
                                value={newProject.description}
                                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                rows={3}
                                disabled={isCreatingProject}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-error-600">{errors.description}</p>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="form-label">Customer</label>
                                <div className="flex gap-2">
                                    <Select
                                        placeholder="Select customer"
                                        value={newProject.customerId}
                                        onChange={(e) => setNewProject({ ...newProject, customerId: e.target.value })}
                                        options={[
                                            { value: '', label: 'Select customer (optional)' },
                                            ...customers.map(customer => ({
                                                value: customer.id,
                                                label: `${customer.firstName} ${customer.lastName} (${customer.email})`
                                            }))
                                        ]}
                                        error={errors.customerId}
                                        disabled={isCreatingProject}
                                    />
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setIsAddCustomerModalOpen(true)}
                                        disabled={isCreatingProject}
                                        className="whitespace-nowrap"
                                    >
                                        Add New
                                    </Button>
                                </div>
                                {errors.customerId && (
                                    <p className="mt-1 text-sm text-error-600">{errors.customerId}</p>
                                )}
                            </div>
                            <div>
                                <label className="form-label">Agent</label>
                                <div className="flex gap-2">
                                    <Select
                                        placeholder="Select agent"
                                        value={newProject.assignedAgentId}
                                        onChange={(e) => setNewProject({ ...newProject, assignedAgentId: e.target.value })}
                                        options={[
                                            { value: '', label: 'Select agent (optional)' },
                                            ...agents.map(agent => ({
                                                value: agent.id,
                                                label: `${agent.firstName} ${agent.lastName} (${agent.email})`
                                            }))
                                        ]}
                                        error={errors.assignedAgentId}
                                        disabled={isCreatingProject}
                                    />
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setIsAddAgentModalOpen(true)}
                                        disabled={isCreatingProject}
                                        className="whitespace-nowrap"
                                    >
                                        Add New
                                    </Button>
                                </div>
                                {errors.agentId && (
                                    <p className="mt-1 text-sm text-error-600">{errors.agentId}</p>
                                )}
                            </div>
                        </div>
                        <Input
                            label="Due Date"
                            type="date"
                            value={newProject.dueDate}
                            onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                            error={errors.dueDate}
                            disabled={isCreatingProject}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setIsAddModalOpen(false)
                            setNewProject({
                                name: '',
                                description: '',
                                projectTypeId: '',
                                assignedAgentId: '',
                                customerId: '',
                                dueDate: ''
                            })
                            setErrors({})
                        }}
                        disabled={isCreatingProject}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleAdd}
                        disabled={isCreatingProject}
                    >
                        {isCreatingProject ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Adding...
                            </>
                        ) : (
                            'Add Project'
                        )}
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Edit Project Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setEditProject({
                        name: '',
                        description: '',
                        projectTypeId: '',
                        assignedAgentId: '',
                        customerId: '',
                        status: 'PENDING',
                        dueDate: ''
                    })
                    setEditErrors({})
                    setEditingProject(null)
                }}
                title="Edit Project"
                size="lg"
            >
                <ModalBody>
                    <div className="space-y-4">
                        <Input
                            label="Project Name"
                            placeholder="Enter project name"
                            value={editProject.name}
                            onChange={(e) => setEditProject({ ...editProject, name: e.target.value })}
                            error={editErrors.name}
                            required
                            disabled={isCreatingProject}
                        />
                        <Select
                            label="Project Type"
                            placeholder="Select project type"
                            value={editProject.projectTypeId}
                            onChange={(e) => setEditProject({ ...editProject, projectTypeId: e.target.value })}
                            options={projectTypeOptions}
                            error={editErrors.projectTypeId}
                            required
                            disabled={isUpdatingProject || projectTypesLoading}
                        />
                        <div>
                            <label className="form-label">Description</label>
                            <textarea
                                className="w-full px-3 py-2 text-sm border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-secondary-50 disabled:cursor-not-allowed"
                                placeholder="Enter project description"
                                value={editProject.description}
                                onChange={(e) => setEditProject({ ...editProject, description: e.target.value })}
                                rows={3}
                                disabled={isCreatingProject}
                            />
                            {editErrors.description && (
                                <p className="mt-1 text-sm text-error-600">{editErrors.description}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="form-label">Customer</label>
                                <Select
                                    placeholder="Select customer"
                                    value={editProject.customerId}
                                    onChange={(e) => setEditProject({ ...editProject, customerId: e.target.value })}
                                    options={[
                                        { value: '', label: 'Select customer (optional)' },
                                        ...customers.map(customer => ({
                                            value: customer.id,
                                            label: `${customer.firstName} ${customer.lastName} (${customer.email})`
                                        }))
                                    ]}
                                    error={editErrors.customerId}
                                    disabled={isUpdatingProject}
                                />
                            </div>
                            <div>
                                <label className="form-label">Agent</label>
                                <Select
                                    placeholder="Select agent"
                                    value={editProject.assignedAgentId}
                                    onChange={(e) => setEditProject({ ...editProject, assignedAgentId: e.target.value })}
                                    options={[
                                        { value: '', label: 'Select agent (optional)' },
                                        ...agents.map(agent => ({
                                            value: agent.id,
                                            label: `${agent.firstName} ${agent.lastName} (${agent.email})`
                                        }))
                                    ]}
                                    error={editErrors.assignedAgentId}
                                    disabled={isUpdatingProject}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Due Date"
                                type="date"
                                value={editProject.dueDate}
                                onChange={(e) => setEditProject({ ...editProject, dueDate: e.target.value })}
                                error={editErrors.dueDate}
                                required
                                disabled={isCreatingProject}
                            />
                            <Select
                                label="Status"
                                placeholder="Select status"
                                value={editProject.status}
                                onChange={(e) => setEditProject({ ...editProject, status: e.target.value as any })}
                                options={statusOptions}
                                disabled={isCreatingProject}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setIsEditModalOpen(false)
                            setEditProject({
                                name: '',
                                description: '',
                                projectTypeId: '',
                                assignedAgentId: '',
                                customerId: '',
                                status: 'PENDING',
                                dueDate: ''
                            })
                            setEditErrors({})
                            setEditingProject(null)
                        }}
                        disabled={isUpdatingProject}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleUpdate}
                        disabled={isUpdatingProject}
                    >
                        {isUpdatingProject ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                            </>
                        ) : (
                            'Update Project'
                        )}
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Add New Customer Modal */}
            <Modal
                isOpen={isAddCustomerModalOpen}
                onClose={() => {
                    setIsAddCustomerModalOpen(false)
                    setNewCustomer({
                        firstName: '',
                        lastName: '',
                        otherName: '',
                        email: '',
                        phoneNumber: ''
                    })
                    setCustomerErrors({})
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
                            error={customerErrors.firstName}
                            required
                            disabled={isCreatingCustomer}
                        />
                        <Input
                            label="Last Name"
                            placeholder="Enter last name"
                            value={newCustomer.lastName}
                            onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                            error={customerErrors.lastName}
                            required
                            disabled={isCreatingCustomer}
                        />
                        <Input
                            label="Other Name (Optional)"
                            placeholder="Enter other name"
                            value={newCustomer.otherName || ''}
                            onChange={(e) => setNewCustomer({ ...newCustomer, otherName: e.target.value })}
                            error={customerErrors.otherName}
                            disabled={isCreatingCustomer}
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter email address"
                            value={newCustomer.email}
                            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                            error={customerErrors.email}
                            required
                            disabled={isCreatingCustomer}
                        />
                        <div className="md:col-span-2">
                            <Input
                                label="Phone Number"
                                placeholder="Enter phone number"
                                value={newCustomer.phoneNumber}
                                onChange={(e) => setNewCustomer({ ...newCustomer, phoneNumber: e.target.value })}
                                error={customerErrors.phoneNumber}
                                required
                                disabled={isCreatingCustomer}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setIsAddCustomerModalOpen(false)
                            setNewCustomer({
                                firstName: '',
                                lastName: '',
                                otherName: '',
                                email: '',
                                phoneNumber: ''
                            })
                            setCustomerErrors({})
                        }}
                        disabled={isCreatingCustomer}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleCreateCustomer}
                        disabled={isCreatingCustomer}
                    >
                        {isCreatingCustomer ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </>
                        ) : (
                            'Create Customer'
                        )}
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Add New Agent Modal */}
            <Modal
                isOpen={isAddAgentModalOpen}
                onClose={() => {
                    setIsAddAgentModalOpen(false)
                    setNewAgent({
                        firstName: '',
                        lastName: '',
                        otherName: '',
                        email: '',
                        phoneNumber: ''
                    })
                    setAgentErrors({})
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
                            error={agentErrors.firstName}
                            required
                            disabled={isCreatingAgent}
                        />
                        <Input
                            label="Last Name"
                            placeholder="Enter last name"
                            value={newAgent.lastName}
                            onChange={(e) => setNewAgent({ ...newAgent, lastName: e.target.value })}
                            error={agentErrors.lastName}
                            required
                            disabled={isCreatingAgent}
                        />
                        <Input
                            label="Other Name (Optional)"
                            placeholder="Enter other name"
                            value={newAgent.otherName || ''}
                            onChange={(e) => setNewAgent({ ...newAgent, otherName: e.target.value })}
                            error={agentErrors.otherName}
                            disabled={isCreatingAgent}
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter email address"
                            value={newAgent.email}
                            onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                            error={agentErrors.email}
                            required
                            disabled={isCreatingAgent}
                        />
                        <div className="md:col-span-2">
                            <Input
                                label="Phone Number"
                                placeholder="Enter phone number"
                                value={newAgent.phoneNumber}
                                onChange={(e) => setNewAgent({ ...newAgent, phoneNumber: e.target.value })}
                                error={agentErrors.phoneNumber}
                                required
                                disabled={isCreatingAgent}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setIsAddAgentModalOpen(false)
                            setNewAgent({
                                firstName: '',
                                lastName: '',
                                otherName: '',
                                email: '',
                                phoneNumber: ''
                            })
                            setAgentErrors({})
                        }}
                        disabled={isCreatingAgent}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleCreateAgent}
                        disabled={isCreatingAgent}
                    >
                        {isCreatingAgent ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </>
                        ) : (
                            'Create Agent'
                        )}
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}
