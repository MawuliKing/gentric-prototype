import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FormBuilder, FormCategory } from '../../../components'

export const FormBuilderPage: React.FC = () => {
    const { projectTypeId, templateId } = useParams<{ projectTypeId: string; templateId: string }>()
    const navigate = useNavigate()
    const [categories, setCategories] = useState<FormCategory[]>([])
    const [templateName, setTemplateName] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // In a real app, this would fetch the template data from an API
        // For now, we'll simulate loading and use sample data
        const loadTemplate = async () => {
            setIsLoading(true)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500))

            // Sample data - in real app, this would come from API based on templateId
            const sampleCategories: FormCategory[] = [
                {
                    id: '1',
                    name: 'Basic Information',
                    description: 'Basic project information',
                    order: 0,
                    fields: [
                        {
                            id: '1',
                            type: 'text',
                            label: 'Project Name',
                            required: true,
                            placeholder: 'Enter project name',
                            order: 0,
                            categoryId: '1'
                        },
                        {
                            id: '2',
                            type: 'textarea',
                            label: 'Project Description',
                            required: true,
                            placeholder: 'Describe the project',
                            order: 1,
                            categoryId: '1'
                        }
                    ]
                },
                {
                    id: '2',
                    name: 'Technical Details',
                    description: 'Technical specifications and requirements',
                    order: 1,
                    fields: [
                        {
                            id: '3',
                            type: 'dropdown',
                            label: 'Technology Stack',
                            required: true,
                            options: ['React', 'Vue', 'Angular', 'Node.js', 'Python'],
                            order: 0,
                            categoryId: '2'
                        },
                        {
                            id: '4',
                            type: 'number',
                            label: 'Estimated Hours',
                            required: false,
                            placeholder: 'Enter estimated hours',
                            order: 1,
                            categoryId: '2'
                        }
                    ]
                }
            ]

            setCategories(sampleCategories)
            setTemplateName('Project Requirements Template')
            setIsLoading(false)
        }

        loadTemplate()
    }, [templateId])

    const handleSave = async () => {
        try {
            // In a real app, this would save to the API
            console.log('Saving template:', {
                templateId,
                projectTypeId,
                templateName,
                categories
            })

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Navigate back to project type details
            navigate(`/admin/project-types/${projectTypeId}`)
        } catch (error) {
            console.error('Error saving template:', error)
            // Handle error (show toast, etc.)
        }
    }

    const handleCancel = () => {
        // Navigate back to project type details
        navigate(`/admin/project-types/${projectTypeId}`)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 bg-primary-200 rounded-full mx-auto mb-4 animate-pulse"></div>
                    <p className="text-body text-secondary-600">Loading form builder...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-secondary-50">
            <FormBuilder
                categories={categories}
                onCategoriesChange={setCategories}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        </div>
    )
}
