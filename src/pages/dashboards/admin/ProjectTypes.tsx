import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, DataTable, Input, Modal, ModalBody, ModalFooter } from '../../../components'
import { useProjectTypes } from '../../../hooks/useProjectTypes'
import type { CreateProjectTypeRequest, ProjectType, UpdateProjectTypeRequest } from '../../../types/api'

export const ProjectTypes: React.FC = () => {
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(10)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingProjectType, setEditingProjectType] = useState<ProjectType | null>(null)

    const {
        projectTypes,
        loading,
        error,
        total,
        totalPages,
        createProjectType,
        updateProjectType,
        deleteProjectType,
        isCreating,
        isUpdating,
        isDeleting
    } = useProjectTypes({ page: currentPage, pageSize })

    const [newProjectType, setNewProjectType] = useState<CreateProjectTypeRequest>({
        name: '',
        description: ''
    })

    const [editProjectType, setEditProjectType] = useState<UpdateProjectTypeRequest>({
        name: '',
        description: ''
    })

    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({})

    const clearError = () => {
        // Error is managed by React Query, no need for manual clearing
    }

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
            key: 'reports' as keyof ProjectType,
            title: 'Reports',
            render: (value: any[] | undefined) => (
                <span className="text-sm font-medium text-secondary-900">{value?.length || 0}</span>
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
            key: 'updatedAt' as keyof ProjectType,
            title: 'Updated',
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
        }
    }

    const handleUpdate = async () => {
        if (!editingProjectType) return

        // Validate form
        const newErrors: { [key: string]: string } = {}
        if (!editProjectType.name.trim()) {
            newErrors.name = 'Name is required'
        }
        if (!editProjectType.description.trim()) {
            newErrors.description = 'Description is required'
        }

        if (Object.keys(newErrors).length > 0) {
            setEditErrors(newErrors)
            return
        }

        try {
            const result = await updateProjectType(editingProjectType.id, editProjectType)

            if (result) {
                // Success - reset form and close modal
                setEditProjectType({ name: '', description: '' })
                setEditErrors({})
                setEditingProjectType(null)
                setIsEditModalOpen(false)
            } else {
                // Error is already set in the hook
                console.error('Failed to update project type')
            }
        } catch (err) {
            console.error('Unexpected error:', err)
        }
    }

    const handleView = (projectType: ProjectType) => {
        navigate(`/admin/project-types/${projectType.id}`)
    }

    const handleEdit = (projectType: ProjectType) => {
        setEditingProjectType(projectType)
        setEditProjectType({
            name: projectType.name,
            description: projectType.description
        })
        setEditErrors({})
        setIsEditModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this project type?')) {
            const success = await deleteProjectType(id)
            if (!success) {
                console.error('Failed to delete project type')
            }
        }
    }


    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
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
                onRowClick={handleView}
                emptyMessage="No project types found. Click 'Add Project Type' to create your first one."
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-secondary-200 bg-white px-4 py-3 sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <Button
                            variant="secondary"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1 || loading}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages || loading}
                        >
                            Next
                        </Button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-secondary-700">
                                Showing{' '}
                                <span className="font-medium">
                                    {Math.min((currentPage - 1) * pageSize + 1, total)}
                                </span>{' '}
                                to{' '}
                                <span className="font-medium">
                                    {Math.min(currentPage * pageSize, total)}
                                </span>{' '}
                                of{' '}
                                <span className="font-medium">{total}</span>{' '}
                                results
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <Button
                                    variant="secondary"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1 || loading}
                                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-secondary-400 ring-1 ring-inset ring-secondary-300 hover:bg-secondary-50 focus:z-20 focus:outline-offset-0"
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                    </svg>
                                </Button>

                                {/* Page Numbers */}
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={currentPage === pageNum ? "primary" : "secondary"}
                                            onClick={() => handlePageChange(pageNum)}
                                            disabled={loading}
                                            className="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-secondary-300 hover:bg-secondary-50 focus:z-20 focus:outline-offset-0"
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                })}

                                <Button
                                    variant="secondary"
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages || loading}
                                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-secondary-400 ring-1 ring-inset ring-secondary-300 hover:bg-secondary-50 focus:z-20 focus:outline-offset-0"
                                >
                                    <span className="sr-only">Next</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                    </svg>
                                </Button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

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

            {/* Edit Project Type Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setEditProjectType({ name: '', description: '' })
                    setEditErrors({})
                    setEditingProjectType(null)
                    clearError()
                }}
                title="Edit Project Type"
                size="md"
            >
                <ModalBody>
                    <div className="space-y-4">
                        <Input
                            label="Name"
                            placeholder="Enter project type name"
                            value={editProjectType.name}
                            onChange={(e) => setEditProjectType({ ...editProjectType, name: e.target.value })}
                            error={editErrors.name}
                            required
                            disabled={isUpdating}
                        />
                        <div>
                            <label className="form-label">Description</label>
                            <textarea
                                className="w-full px-3 py-2 text-sm border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-secondary-50 disabled:cursor-not-allowed"
                                placeholder="Enter project type description"
                                value={editProjectType.description}
                                onChange={(e) => setEditProjectType({ ...editProjectType, description: e.target.value })}
                                rows={3}
                                disabled={isUpdating}
                            />
                            {editErrors.description && (
                                <p className="mt-1 text-sm text-error-600">{editErrors.description}</p>
                            )}
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setIsEditModalOpen(false)
                            setEditProjectType({ name: '', description: '' })
                            setEditErrors({})
                            setEditingProjectType(null)
                            clearError()
                        }}
                        disabled={isUpdating}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleUpdate}
                        disabled={isUpdating}
                    >
                        {isUpdating ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                            </>
                        ) : (
                            'Update Project Type'
                        )}
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}
