import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Card, Modal, ModalBody, ModalFooter, Input } from '../../../components'
import { useProjectTypeDetails } from '../../../hooks/useProjectTypeDetails'
import { useReportTemplates } from '../../../hooks/useReportTemplates'
import type {
    ReportTemplate,
    CreateReportTemplateRequest
} from '../../../types/api'

interface ReportTemplateFormData {
    name: string;
    description: string;
}

export const ProjectTypeDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [isAddReportModalOpen, setIsAddReportModalOpen] = useState(false)
    const [isEditReportModalOpen, setIsEditReportModalOpen] = useState(false)
    const [editingTemplate, setEditingTemplate] = useState<ReportTemplate | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(10)

    // Fetch project type details
    const {
        projectType,
        loading: projectTypeLoading,
        error: projectTypeError
    } = useProjectTypeDetails(id || '')

    // Fetch report templates with pagination
    const {
        reportTemplates,
        loading: templatesLoading,
        error: templatesError,
        total,
        totalPages,
        createReportTemplate,
        updateReportTemplate,
        deleteReportTemplate,
        isCreating,
        isUpdating,
        isDeleting
    } = useReportTemplates({
        projectTypeId: id || '',
        page: currentPage,
        pageSize
    })

    const [newReportTemplate, setNewReportTemplate] = useState<ReportTemplateFormData>({
        name: '',
        description: ''
    })

    const [editReportTemplate, setEditReportTemplate] = useState<ReportTemplateFormData>({
        name: '',
        description: ''
    })

    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({})

    const handleAddReportTemplate = async () => {
        // Validate form
        const newErrors: { [key: string]: string } = {}
        if (!newReportTemplate.name.trim()) {
            newErrors.name = 'Name is required'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            const createData: CreateReportTemplateRequest = {
                ...newReportTemplate,
                projectTypeId: id || '',
                sections: [] // Empty sections array as specified
            }

            const result = await createReportTemplate(createData)

            if (result) {
                // Success - reset form and close modal
                setNewReportTemplate({ name: '', description: '' })
                setErrors({})
                setIsAddReportModalOpen(false)
            } else {
                // Error is already set in the hook
                console.error('Failed to create report template')
            }
        } catch (err) {
            console.error('Unexpected error:', err)
        }
    }

    const handleEditReportTemplate = (template: ReportTemplate) => {
        setEditingTemplate(template)
        setEditReportTemplate({
            name: template.name,
            description: template.description
        })
        setEditErrors({})
        setIsEditReportModalOpen(true)
    }

    const handleEditForm = (template: ReportTemplate) => {
        // Navigate to the form builder page
        navigate(`/admin/project-types/${id}/templates/${template.id}/edit`)
    }

    const handleUpdateReportTemplate = async () => {
        if (!editingTemplate) return

        // Validate form
        const newErrors: { [key: string]: string } = {}
        if (!editReportTemplate.name.trim()) {
            newErrors.name = 'Name is required'
        }

        if (Object.keys(newErrors).length > 0) {
            setEditErrors(newErrors)
            return
        }

        try {
            const result = await updateReportTemplate(editingTemplate.id, editReportTemplate)

            if (result) {
                // Success - close modal and reset state
                setIsEditReportModalOpen(false)
                setEditingTemplate(null)
                setEditReportTemplate({ name: '', description: '' })
                setEditErrors({})
            } else {
                // Error is already set in the hook
                console.error('Failed to update report template')
            }
        } catch (err) {
            console.error('Unexpected error:', err)
        }
    }

    const handleDeleteReportTemplate = async (templateId: string) => {
        if (window.confirm('Are you sure you want to delete this report template?')) {
            const success = await deleteReportTemplate(templateId)
            if (!success) {
                console.error('Failed to delete report template')
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


    // Show loading state
    if (projectTypeLoading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-secondary-600">Loading project type details...</p>
                </div>
            </div>
        )
    }

    // Show error state
    if (projectTypeError || !projectType) {
        return (
            <div className="text-center py-12">
                <div className="w-12 h-12 bg-error-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-heading-3 text-secondary-900 mb-2">Error Loading Project Type</h3>
                <p className="text-body text-secondary-600 mb-4">
                    {projectTypeError || 'Project type not found'}
                </p>
                <Button
                    variant="primary"
                    onClick={() => navigate('/admin/project-types')}
                >
                    Back to Project Types
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/admin/project-types')}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Project Types
                    </Button>
                    <div>
                        <h1 className="text-heading-1">{projectType.name}</h1>
                        <p className="text-body-large text-secondary-600">{projectType.description}</p>
                    </div>
                </div>
                <div className="text-sm text-secondary-600">
                    Created {new Date(projectType.createdAt).toLocaleDateString()}
                </div>
            </div>

            {/* Error Display */}
            {templatesError && (
                <div className="bg-error-50 border border-error-200 rounded-md p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-error-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-error-800">
                                Error Loading Report Templates
                            </h3>
                            <div className="mt-2 text-sm text-error-700">
                                {templatesError}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Project Type Details */}
            <Card>
                <div className="p-6">
                    <h2 className="text-heading-3 mb-4">Project Type Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="text-sm font-medium text-secondary-600">Created Date</label>
                            <p className="text-body text-secondary-900">
                                {new Date(projectType.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-secondary-600">Last Updated</label>
                            <p className="text-body text-secondary-900">
                                {projectType.updatedAt ? new Date(projectType.updatedAt).toLocaleDateString() : 'Never'}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-secondary-600">Report Templates</label>
                            <p className="text-body text-secondary-900">
                                {templatesLoading ? 'Loading...' : total}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Report Templates Section */}
            <Card>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-heading-3">Report Templates</h2>
                        <Button
                            variant="primary"
                            onClick={() => setIsAddReportModalOpen(true)}
                            disabled={templatesLoading}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Report Template
                        </Button>
                    </div>

                    {templatesLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                            <p className="text-body text-secondary-600">Loading report templates...</p>
                        </div>
                    ) : reportTemplates.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 bg-secondary-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-6 h-6 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-body text-secondary-600 mb-4">No report templates found</p>
                            <Button
                                variant="primary"
                                onClick={() => setIsAddReportModalOpen(true)}
                            >
                                Create Your First Report Template
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reportTemplates.map((template) => (
                                <div key={template.id} className="border border-secondary-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-heading-4 text-secondary-900 mb-2">{template.name}</h3>
                                            <p className="text-body text-secondary-600 mb-3">{template.description}</p>
                                            <div className="flex items-center space-x-4 text-sm text-secondary-500">
                                                <span>{template.sections.length} sections</span>
                                                <span>{template.sections.reduce((acc, section) => acc + section.fields.length, 0)} fields</span>
                                                <span>Created {new Date(template.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleEditReportTemplate(template)}
                                                disabled={isUpdating}
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit
                                            </Button>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleEditForm(template)}
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Edit Form
                                            </Button>
                                            <Button
                                                variant="error"
                                                size="sm"
                                                onClick={() => handleDeleteReportTemplate(template.id)}
                                                disabled={isDeleting}
                                            >
                                                {isDeleting ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Deleting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Delete
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-secondary-200 bg-white px-4 py-3 sm:px-6 mt-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <Button
                                    variant="secondary"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1 || templatesLoading}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages || templatesLoading}
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
                                            disabled={currentPage === 1 || templatesLoading}
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
                                                    disabled={templatesLoading}
                                                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-secondary-300 hover:bg-secondary-50 focus:z-20 focus:outline-offset-0"
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        })}

                                        <Button
                                            variant="secondary"
                                            onClick={handleNextPage}
                                            disabled={currentPage === totalPages || templatesLoading}
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
                </div>
            </Card>

            {/* Add Report Template Modal */}
            <Modal
                isOpen={isAddReportModalOpen}
                onClose={() => {
                    setIsAddReportModalOpen(false)
                    setNewReportTemplate({ name: '', description: '' })
                    setErrors({})
                }}
                title="Add New Report Template"
                size="md"
            >
                <ModalBody>
                    <div className="space-y-4">
                        <Input
                            label="Template Name"
                            placeholder="Enter template name"
                            value={newReportTemplate.name}
                            onChange={(e) => setNewReportTemplate({ ...newReportTemplate, name: e.target.value })}
                            error={errors.name}
                            required
                            disabled={isCreating}
                        />
                        <div>
                            <label className="form-label">Description</label>
                            <textarea
                                className="w-full px-3 py-2 text-sm border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-secondary-50 disabled:cursor-not-allowed"
                                placeholder="Enter template description"
                                value={newReportTemplate.description}
                                onChange={(e) => setNewReportTemplate({ ...newReportTemplate, description: e.target.value })}
                                rows={3}
                                disabled={isCreating}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setIsAddReportModalOpen(false)
                            setNewReportTemplate({ name: '', description: '' })
                            setErrors({})
                        }}
                        disabled={isCreating}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleAddReportTemplate}
                        disabled={!newReportTemplate.name.trim() || isCreating}
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
                            'Create Template'
                        )}
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Edit Report Template Modal */}
            <Modal
                isOpen={isEditReportModalOpen}
                onClose={() => {
                    setIsEditReportModalOpen(false)
                    setEditingTemplate(null)
                    setEditReportTemplate({ name: '', description: '' })
                    setEditErrors({})
                }}
                title="Edit Report Template"
                size="md"
            >
                <ModalBody>
                    <div className="space-y-4">
                        <Input
                            label="Template Name"
                            placeholder="Enter template name"
                            value={editReportTemplate.name}
                            onChange={(e) => setEditReportTemplate({ ...editReportTemplate, name: e.target.value })}
                            error={editErrors.name}
                            required
                            disabled={isUpdating}
                        />
                        <div>
                            <label className="form-label">Description</label>
                            <textarea
                                className="w-full px-3 py-2 text-sm border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-secondary-50 disabled:cursor-not-allowed"
                                placeholder="Enter template description"
                                value={editReportTemplate.description}
                                onChange={(e) => setEditReportTemplate({ ...editReportTemplate, description: e.target.value })}
                                rows={3}
                                disabled={isUpdating}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setIsEditReportModalOpen(false)
                            setEditingTemplate(null)
                            setEditReportTemplate({ name: '', description: '' })
                            setEditErrors({})
                        }}
                        disabled={isUpdating}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleUpdateReportTemplate}
                        disabled={!editReportTemplate.name.trim() || isUpdating}
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
                            'Update Template'
                        )}
                    </Button>
                </ModalFooter>
            </Modal>

        </div>
    )
}
