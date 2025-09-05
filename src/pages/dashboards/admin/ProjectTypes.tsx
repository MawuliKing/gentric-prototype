import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, DataTable, Modal, ModalBody, ModalFooter, Input, StatusBadge } from '../../../components'
import { useProjectTypes } from '../../../hooks/useProjectTypes'
import type { ProjectType, CreateProjectTypeRequest } from '../../../types/api'

export const ProjectTypes: React.FC = () => {
    const navigate = useNavigate()
    const { projectTypes, loading, error, createProjectType, getProjectTypes, clearError } = useProjectTypes()
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)

    const [newProjectType, setNewProjectType] = useState<CreateProjectTypeRequest>({
        name: '',
        description: ''
    })

    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    // Load project types on component mount
    useEffect(() => {
        getProjectTypes()
    }, [getProjectTypes])

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

    const handleAdd = async () => {
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

        setIsCreating(true)
        clearError()

        try {
            const result = await createProjectType(newProjectType)

            if (result) {
                // Success - reset form and close modal
                setNewProjectType({ name: '', description: '' })
                setErrors({})
                setIsAddModalOpen(false)
            } else {
                // Error is already set in the hook
                console.error('Failed to create project type')
            }
        } catch (err) {
            console.error('Unexpected error:', err)
        } finally {
            setIsCreating(false)
        }
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
            // TODO: Implement delete functionality with API
            console.log('Delete project type:', id)
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
                    disabled={loading}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Project Type
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
                                Error
                            </h3>
                            <div className="mt-2 text-sm text-error-700">
                                {error}
                            </div>
                            <div className="mt-4">
                                <div className="-mx-2 -my-1.5 flex">
                                    <button
                                        type="button"
                                        className="bg-error-50 px-2 py-1.5 rounded-md text-sm font-medium text-error-800 hover:bg-error-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-error-50 focus:ring-error-600"
                                        onClick={clearError}
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                    setNewProjectType({ name: '', description: '' })
                    setErrors({})
                    clearError()
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
                            disabled={isCreating}
                        />
                        <div>
                            <label className="form-label">Description</label>
                            <textarea
                                className="w-full px-3 py-2 text-sm border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-secondary-50 disabled:cursor-not-allowed"
                                placeholder="Enter project type description"
                                value={newProjectType.description}
                                onChange={(e) => setNewProjectType({ ...newProjectType, description: e.target.value })}
                                rows={3}
                                disabled={isCreating}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-error-600">{errors.description}</p>
                            )}
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setIsAddModalOpen(false)
                            setNewProjectType({ name: '', description: '' })
                            setErrors({})
                            clearError()
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
                                Creating...
                            </>
                        ) : (
                            'Add Project Type'
                        )}
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}
