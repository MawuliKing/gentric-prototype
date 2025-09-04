import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, DataTable, Modal, ModalBody, ModalFooter, Input, StatusBadge } from '../../../components'

interface ProjectType {
    id: string
    name: string
    description: string
    status: 'active' | 'inactive'
    createdAt: string
    projectCount: number
    reportCount: number
}

export const ProjectTypes: React.FC = () => {
    const navigate = useNavigate()
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [projectTypes, setProjectTypes] = useState<ProjectType[]>([
        {
            id: '1',
            name: 'Web Development',
            description: 'Full-stack web applications and websites',
            status: 'active',
            createdAt: '2024-01-15',
            projectCount: 12,
            reportCount: 3
        },
        {
            id: '2',
            name: 'Mobile App',
            description: 'iOS and Android mobile applications',
            status: 'active',
            createdAt: '2024-01-10',
            projectCount: 8,
            reportCount: 2
        },
        {
            id: '3',
            name: 'Data Analytics',
            description: 'Data analysis and business intelligence projects',
            status: 'active',
            createdAt: '2024-01-05',
            projectCount: 5,
            reportCount: 4
        },
        {
            id: '4',
            name: 'E-commerce',
            description: 'Online stores and e-commerce platforms',
            status: 'inactive',
            createdAt: '2023-12-20',
            projectCount: 3,
            reportCount: 1
        },
        {
            id: '5',
            name: 'AI/ML',
            description: 'Artificial Intelligence and Machine Learning projects',
            status: 'active',
            createdAt: '2024-01-20',
            projectCount: 2,
            reportCount: 2
        }
    ])

    const [newProjectType, setNewProjectType] = useState({
        name: '',
        description: '',
        status: 'active' as 'active' | 'inactive'
    })

    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const columns = [
        {
            key: 'name' as keyof ProjectType,
            title: 'Name',
            sortable: true,
            render: (value: string, item: ProjectType) => (
                <div>
                    <div className="font-medium text-secondary-900">{value}</div>
                    <div className="text-sm text-secondary-500">{item.description}</div>
                </div>
            )
        },
        {
            key: 'status' as keyof ProjectType,
            title: 'Status',
            render: (value: string) => (
                <StatusBadge status={value === 'active' ? 'success' : 'warning'}>
                    {value === 'active' ? 'Active' : 'Inactive'}
                </StatusBadge>
            )
        },
        {
            key: 'projectCount' as keyof ProjectType,
            title: 'Projects',
            render: (value: number) => (
                <span className="text-sm font-medium text-secondary-900">{value}</span>
            )
        },
        {
            key: 'reportCount' as keyof ProjectType,
            title: 'Reports',
            render: (value: number) => (
                <span className="text-sm font-medium text-secondary-900">{value}</span>
            )
        },
        {
            key: 'createdAt' as keyof ProjectType,
            title: 'Created',
            render: (value: string) => (
                <span className="text-sm text-secondary-600">
                    {new Date(value).toLocaleDateString()}
                </span>
            )
        },
        {
            key: 'actions' as keyof ProjectType,
            title: 'Actions',
            render: (_: any, item: ProjectType) => (
                <div className="flex space-x-2">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleView(item)
                        }}
                    >
                        View
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(item)
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="error"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(item.id)
                        }}
                    >
                        Delete
                    </Button>
                </div>
            )
        }
    ]

    const handleAdd = () => {
        // Validate form
        const newErrors: { [key: string]: string } = {}
        if (!newProjectType.name.trim()) {
            newErrors.name = 'Name is required'
        }
        if (!newProjectType.description.trim()) {
            newErrors.description = 'Description is required'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        // Add new project type
        const projectType: ProjectType = {
            id: Date.now().toString(),
            name: newProjectType.name,
            description: newProjectType.description,
            status: newProjectType.status,
            createdAt: new Date().toISOString().split('T')[0],
            projectCount: 0,
            reportCount: 0
        }

        setProjectTypes([...projectTypes, projectType])
        setNewProjectType({ name: '', description: '', status: 'active' })
        setErrors({})
        setIsAddModalOpen(false)
    }

    const handleView = (projectType: ProjectType) => {
        navigate(`/admin/project-types/${projectType.id}`)
    }

    const handleEdit = (projectType: ProjectType) => {
        // TODO: Implement edit functionality
        console.log('Edit project type:', projectType)
    }

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this project type?')) {
            setProjectTypes(projectTypes.filter(pt => pt.id !== id))
        }
    }

    const handleRowClick = (item: ProjectType) => {
        console.log('Row clicked:', item)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-heading-1 mb-2">Project Types</h1>
                    <p className="text-body-large text-secondary-600">
                        Manage different types of projects in your system.
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Project Type
                </Button>
            </div>

            {/* Project Types Table */}
            <DataTable
                data={projectTypes}
                columns={columns}
                onRowClick={handleRowClick}
                emptyMessage="No project types found. Click 'Add Project Type' to create your first one."
            />

            {/* Add Project Type Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false)
                    setNewProjectType({ name: '', description: '', status: 'active' })
                    setErrors({})
                }}
                title="Add New Project Type"
                size="md"
            >
                <ModalBody>
                    <div className="space-y-4">
                        <Input
                            label="Name"
                            placeholder="Enter project type name"
                            value={newProjectType.name}
                            onChange={(e) => setNewProjectType({ ...newProjectType, name: e.target.value })}
                            error={errors.name}
                            required
                        />
                        <div>
                            <label className="form-label">Description</label>
                            <textarea
                                className="w-full px-3 py-2 text-sm border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Enter project type description"
                                value={newProjectType.description}
                                onChange={(e) => setNewProjectType({ ...newProjectType, description: e.target.value })}
                                rows={3}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-error-600">{errors.description}</p>
                            )}
                        </div>
                        <div>
                            <label className="form-label">Status</label>
                            <select
                                className="w-full px-3 py-2 text-sm border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                value={newProjectType.status}
                                onChange={(e) => setNewProjectType({ ...newProjectType, status: e.target.value as 'active' | 'inactive' })}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setIsAddModalOpen(false)
                            setNewProjectType({ name: '', description: '', status: 'active' })
                            setErrors({})
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleAdd}
                    >
                        Add Project Type
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}
