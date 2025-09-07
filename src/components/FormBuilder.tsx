import React, { useState } from 'react'
import { Button, Card, Input, Select, ExcelUpload } from './index'
import { Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react'

export interface FormField {
    id: string
    type: 'text' | 'number' | 'textarea' | 'boolean' | 'checkbox' | 'dropdown' | 'image' | 'date' | 'datetime' | 'daterange' | 'time' | 'email' | 'password' | 'url' | 'tel' | 'color' | 'file'
    label: string
    required: boolean
    placeholder?: string
    options?: string[] // For dropdown
    order: number
    categoryId: string
}

export interface FormCategory {
    id: string
    name: string
    description?: string
    order: number
    fields: FormField[]
}

interface FormBuilderProps {
    categories: FormCategory[]
    onCategoriesChange: (categories: FormCategory[]) => void
    onSave: () => void
    onCancel: () => void
    templateName?: string
    templateDescription?: string
    projectTypeName?: string
    createdAt?: string
    updatedAt?: string
    isSaving?: boolean
    saveError?: string | null
}

const FIELD_TYPES = [
    { value: 'text', label: 'Text Input', icon: '📝' },
    { value: 'number', label: 'Number Input', icon: '🔢' },
    { value: 'textarea', label: 'Text Area', icon: '📄' },
    { value: 'email', label: 'Email Input', icon: '📧' },
    { value: 'password', label: 'Password Input', icon: '🔒' },
    { value: 'url', label: 'URL Input', icon: '🔗' },
    { value: 'tel', label: 'Phone Number', icon: '📞' },
    { value: 'date', label: 'Date Picker', icon: '📅' },
    { value: 'datetime', label: 'Date & Time', icon: '🕐' },
    { value: 'daterange', label: 'Date Range', icon: '📆' },
    { value: 'time', label: 'Time Picker', icon: '⏰' },
    { value: 'color', label: 'Color Picker', icon: '🎨' },
    { value: 'boolean', label: 'True/False', icon: '✅' },
    { value: 'checkbox', label: 'Checkbox', icon: '☑️' },
    { value: 'dropdown', label: 'Dropdown', icon: '📋' },
    { value: 'file', label: 'File Upload', icon: '📎' },
    { value: 'image', label: 'Image Selector', icon: '🖼️' }
]

export const FormBuilder: React.FC<FormBuilderProps> = ({
    categories,
    onCategoriesChange,
    onSave,
    onCancel,
    templateName,
    templateDescription,
    projectTypeName,
    createdAt,
    updatedAt,
    isSaving = false,
    saveError
}) => {
    const [selectedFieldType, setSelectedFieldType] = useState<string>('')
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [editingField, setEditingField] = useState<FormField | null>(null)
    const [editingCategory, setEditingCategory] = useState<FormCategory | null>(null)
    const [showAddCategory, setShowAddCategory] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState('')
    const [newCategoryDescription, setNewCategoryDescription] = useState('')

    const handleExcelFormGenerated = (newCategories: FormCategory[]) => {
        // Replace existing categories with the ones generated from Excel
        onCategoriesChange(newCategories)

        // Reset other form states
        setSelectedFieldType('')
        setSelectedCategory('')
        setEditingField(null)
        setEditingCategory(null)
        setShowAddCategory(false)
        setNewCategoryName('')
        setNewCategoryDescription('')
    }

    const addCategory = () => {
        if (!newCategoryName.trim()) return

        const newCategory: FormCategory = {
            id: Date.now().toString(),
            name: newCategoryName,
            description: newCategoryDescription,
            order: categories.length,
            fields: []
        }

        onCategoriesChange([...categories, newCategory])
        setNewCategoryName('')
        setNewCategoryDescription('')
        setShowAddCategory(false)
    }

    const addField = () => {
        if (!selectedFieldType || !selectedCategory) return

        const category = categories.find(c => c.id === selectedCategory)
        if (!category) return

        const newField: FormField = {
            id: Date.now().toString(),
            type: selectedFieldType as FormField['type'],
            label: `New ${FIELD_TYPES.find(f => f.value === selectedFieldType)?.label || 'Field'}`,
            required: false,
            order: category.fields.length,
            categoryId: selectedCategory
        }

        const updatedCategories = categories.map(cat => {
            if (cat.id === selectedCategory) {
                return {
                    ...cat,
                    fields: [...cat.fields, newField]
                }
            }
            return cat
        })

        onCategoriesChange(updatedCategories)
        setSelectedFieldType('')
        setSelectedCategory('')
    }

    const updateField = (fieldId: string, updates: Partial<FormField>) => {
        const updatedCategories = categories.map(category => ({
            ...category,
            fields: category.fields.map(field =>
                field.id === fieldId ? { ...field, ...updates } : field
            )
        }))
        onCategoriesChange(updatedCategories)
        setEditingField(null)
    }

    const updateCategory = (categoryId: string, updates: Partial<FormCategory>) => {
        const updatedCategories = categories.map(category =>
            category.id === categoryId ? { ...category, ...updates } : category
        )
        onCategoriesChange(updatedCategories)
        setEditingCategory(null)
    }

    const deleteField = (fieldId: string) => {
        const updatedCategories = categories.map(category => ({
            ...category,
            fields: category.fields.filter(field => field.id !== fieldId)
        }))
        onCategoriesChange(updatedCategories)
    }

    const deleteCategory = (categoryId: string) => {
        onCategoriesChange(categories.filter(category => category.id !== categoryId))
    }

    const moveField = (fieldId: string, direction: 'up' | 'down') => {
        const updatedCategories = categories.map(category => {
            const fieldIndex = category.fields.findIndex(f => f.id === fieldId)
            if (fieldIndex === -1) return category

            const fields = [...category.fields]
            const newIndex = direction === 'up' ? fieldIndex - 1 : fieldIndex + 1

            if (newIndex < 0 || newIndex >= fields.length) return category

            // Swap fields
            const temp = fields[fieldIndex]
            fields[fieldIndex] = fields[newIndex]
            fields[newIndex] = temp

            // Update order
            fields.forEach((field, index) => {
                field.order = index
            })

            return { ...category, fields }
        })

        onCategoriesChange(updatedCategories)
    }

    const renderFieldPreview = (field: FormField) => {
        const baseClasses = "w-full px-3 py-2 border border-secondary-300 rounded-md"

        switch (field.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        className={baseClasses}
                        placeholder={field.placeholder || field.label}
                        disabled
                    />
                )
            case 'number':
                return (
                    <input
                        type="number"
                        className={baseClasses}
                        placeholder={field.placeholder || field.label}
                        disabled
                    />
                )
            case 'email':
                return (
                    <input
                        type="email"
                        className={baseClasses}
                        placeholder={field.placeholder || "Enter email address"}
                        disabled
                    />
                )
            case 'password':
                return (
                    <input
                        type="password"
                        className={baseClasses}
                        placeholder={field.placeholder || "Enter password"}
                        disabled
                    />
                )
            case 'url':
                return (
                    <input
                        type="url"
                        className={baseClasses}
                        placeholder={field.placeholder || "https://example.com"}
                        disabled
                    />
                )
            case 'tel':
                return (
                    <input
                        type="tel"
                        className={baseClasses}
                        placeholder={field.placeholder || "+1 (555) 123-4567"}
                        disabled
                    />
                )
            case 'date':
                return (
                    <input
                        type="date"
                        className={baseClasses}
                        disabled
                    />
                )
            case 'datetime':
                return (
                    <input
                        type="datetime-local"
                        className={baseClasses}
                        disabled
                    />
                )
            case 'daterange':
                return (
                    <div className="space-y-2">
                        <input
                            type="date"
                            className={baseClasses}
                            placeholder="Start date"
                            disabled
                        />
                        <input
                            type="date"
                            className={baseClasses}
                            placeholder="End date"
                            disabled
                        />
                    </div>
                )
            case 'time':
                return (
                    <input
                        type="time"
                        className={baseClasses}
                        disabled
                    />
                )
            case 'color':
                return (
                    <div className="flex items-center space-x-2">
                        <input
                            type="color"
                            className="h-10 w-16 border border-secondary-300 rounded-md cursor-pointer"
                            disabled
                        />
                        <span className="text-sm text-secondary-600">Choose color</span>
                    </div>
                )
            case 'textarea':
                return (
                    <textarea
                        className={baseClasses}
                        placeholder={field.placeholder || field.label}
                        rows={3}
                        disabled
                    />
                )
            case 'boolean':
                return (
                    <select className={baseClasses} disabled>
                        <option>Select...</option>
                        <option>True</option>
                        <option>False</option>
                    </select>
                )
            case 'checkbox':
                return (
                    <div className="flex items-center space-x-2">
                        <input type="checkbox" disabled />
                        <span className="text-sm text-secondary-600">{field.label}</span>
                    </div>
                )
            case 'dropdown':
                return (
                    <select className={baseClasses} disabled>
                        <option>Select {field.label}...</option>
                        {field.options?.map((option, index) => (
                            <option key={index}>{option}</option>
                        ))}
                    </select>
                )
            case 'file':
                return (
                    <div className="border-2 border-dashed border-secondary-300 rounded-md p-4 text-center">
                        <svg className="w-8 h-8 mx-auto text-secondary-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-sm text-secondary-500">Click to upload file</span>
                    </div>
                )
            case 'image':
                return (
                    <div className="border-2 border-dashed border-secondary-300 rounded-md p-4 text-center">
                        <svg className="w-8 h-8 mx-auto text-secondary-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-secondary-500">Click to upload image</span>
                    </div>
                )
            default:
                return <div className="text-sm text-secondary-500">Unknown field type</div>
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-secondary-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-heading-1">
                            {templateName ? `Form Builder - ${templateName}` : 'Form Builder'}
                        </h1>
                        <p className="text-body text-secondary-600 mt-1">
                            {templateDescription || 'Create and customize your report template'}
                        </p>
                        {(projectTypeName || createdAt || updatedAt) && (
                            <div className="flex items-center space-x-4 mt-2 text-sm text-secondary-500">
                                {projectTypeName && <span>Project Type: {projectTypeName}</span>}
                                {createdAt && <span>Created: {new Date(createdAt).toLocaleDateString()}</span>}
                                {updatedAt && <span>Updated: {new Date(updatedAt).toLocaleDateString()}</span>}
                            </div>
                        )}
                    </div>
                    <div className="flex space-x-3">
                        <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={onSave} disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                'Save Template'
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {saveError && (
                <div className="bg-error-50 border border-error-200 px-6 py-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-error-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-error-800">
                                    Error Saving Template
                                </h3>
                                <div className="mt-2 text-sm text-error-700">
                                    {saveError}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Panel - Excel Upload & Field Types */}
                        <div className="space-y-4">

                            <Card>
                                <div className="p-4">
                                    <h3 className="text-heading-4 mb-4">Add Field</h3>

                                    <div className="space-y-3">
                                        <Select
                                            label="Field Type"
                                            value={selectedFieldType}
                                            onChange={(e) => setSelectedFieldType(e.target.value)}
                                            options={[
                                                { value: '', label: 'Select field type...' },
                                                ...FIELD_TYPES.map(type => ({
                                                    value: type.value,
                                                    label: `${type.icon} ${type.label}`
                                                }))
                                            ]}
                                        />

                                        <Select
                                            label="Category"
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            options={[
                                                { value: '', label: 'Select category...' },
                                                ...categories.map(cat => ({
                                                    value: cat.id,
                                                    label: cat.name
                                                }))
                                            ]}
                                        />

                                        <Button
                                            variant="primary"
                                            onClick={addField}
                                            disabled={!selectedFieldType || !selectedCategory}
                                            className="w-full"
                                        >
                                            Add Field
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            <Card>
                                <div className="p-4">
                                    <h3 className="text-heading-4 mb-4">Categories</h3>

                                    {!showAddCategory ? (
                                        <Button
                                            variant="secondary"
                                            onClick={() => setShowAddCategory(true)}
                                            className="w-full"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add Category
                                        </Button>
                                    ) : (
                                        <div className="space-y-3">
                                            <Input
                                                label="Category Name"
                                                value={newCategoryName}
                                                onChange={(e) => setNewCategoryName(e.target.value)}
                                                placeholder="Enter category name"
                                            />
                                            <Input
                                                label="Description"
                                                value={newCategoryDescription}
                                                onChange={(e) => setNewCategoryDescription(e.target.value)}
                                                placeholder="Enter description (optional)"
                                            />
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="primary"
                                                    onClick={addCategory}
                                                    disabled={!newCategoryName.trim()}
                                                    size="sm"
                                                >
                                                    Add
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => {
                                                        setShowAddCategory(false)
                                                        setNewCategoryName('')
                                                        setNewCategoryDescription('')
                                                    }}
                                                    size="sm"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>


                            <Card>
                                <div className="p-4">
                                    <h3 className="text-heading-4 mb-4">Generate from Excel</h3>
                                    <ExcelUpload
                                        onFormGenerated={handleExcelFormGenerated}
                                        disabled={isSaving}
                                    />
                                </div>
                            </Card>
                        </div>

                        {/* Center Panel - Form Preview */}
                        <div className="lg:col-span-2">
                            <Card>
                                <div className="p-6">
                                    <h3 className="text-heading-4 mb-6">Form Preview</h3>

                                    {categories.length === 0 ? (
                                        <div className="text-center py-8">
                                            <div className="w-12 h-12 bg-secondary-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <p className="text-body text-secondary-600">No categories yet. Add a category to get started.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {categories.map((category) => (
                                                <div key={category.id} className="border border-secondary-200 rounded-lg p-4">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <div>
                                                            <h4 className="text-heading-5 text-secondary-900">{category.name}</h4>
                                                            {category.description && (
                                                                <p className="text-sm text-secondary-600">{category.description}</p>
                                                            )}
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                variant="secondary"
                                                                size="sm"
                                                                onClick={() => setEditingCategory(category)}
                                                                className="p-2"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="error"
                                                                size="sm"
                                                                onClick={() => deleteCategory(category.id)}
                                                                className="p-2"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        {category.fields.length === 0 ? (
                                                            <p className="text-sm text-secondary-500 italic">No fields in this category</p>
                                                        ) : (
                                                            category.fields
                                                                .sort((a, b) => a.order - b.order)
                                                                .map((field) => (
                                                                    <div key={field.id} className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-md">
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center space-x-2 mb-2">
                                                                                <span className="text-sm font-medium text-secondary-900">
                                                                                    {field.label}
                                                                                    {field.required && <span className="text-error-500 ml-1">*</span>}
                                                                                </span>
                                                                                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                                                                                    {FIELD_TYPES.find(f => f.value === field.type)?.label}
                                                                                </span>
                                                                            </div>
                                                                            {renderFieldPreview(field)}
                                                                        </div>
                                                                        <div className="flex flex-col space-y-2">
                                                                            <div className="flex space-x-1">
                                                                                <Button
                                                                                    variant="secondary"
                                                                                    size="sm"
                                                                                    onClick={() => setEditingField(field)}
                                                                                    className="p-2"
                                                                                >
                                                                                    <Edit className="w-4 h-4" />
                                                                                </Button>
                                                                                <Button
                                                                                    variant="error"
                                                                                    size="sm"
                                                                                    onClick={() => deleteField(field.id)}
                                                                                    className="p-2"
                                                                                >
                                                                                    <Trash2 className="w-4 h-4" />
                                                                                </Button>
                                                                            </div>
                                                                            <div className="flex flex-col space-y-1">
                                                                                <Button
                                                                                    variant="secondary"
                                                                                    size="sm"
                                                                                    onClick={() => moveField(field.id, 'up')}
                                                                                    disabled={field.order === 0}
                                                                                    className="p-2"
                                                                                >
                                                                                    <ChevronUp className="w-4 h-4" />
                                                                                </Button>
                                                                                <Button
                                                                                    variant="secondary"
                                                                                    size="sm"
                                                                                    onClick={() => moveField(field.id, 'down')}
                                                                                    disabled={field.order === category.fields.length - 1}
                                                                                    className="p-2"
                                                                                >
                                                                                    <ChevronDown className="w-4 h-4" />
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Field Properties Modal */}
            {editingField && (
                <FieldPropertiesModal
                    field={editingField}
                    onSave={(updates) => updateField(editingField.id, updates)}
                    onCancel={() => setEditingField(null)}
                />
            )}

            {/* Category Properties Modal */}
            {editingCategory && (
                <CategoryPropertiesModal
                    category={editingCategory}
                    onSave={(updates) => updateCategory(editingCategory.id, updates)}
                    onCancel={() => setEditingCategory(null)}
                />
            )}
        </div>
    )
}

// Field Properties Modal Component
interface FieldPropertiesModalProps {
    field: FormField
    onSave: (updates: Partial<FormField>) => void
    onCancel: () => void
}

const FieldPropertiesModal: React.FC<FieldPropertiesModalProps> = ({ field, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        label: field.label,
        required: field.required,
        placeholder: field.placeholder || '',
        options: field.options?.join(', ') || ''
    })

    const handleSave = () => {
        const updates: Partial<FormField> = {
            label: formData.label,
            required: formData.required,
            placeholder: formData.placeholder || undefined
        }

        if (field.type === 'dropdown' && formData.options) {
            updates.options = formData.options.split(',').map(opt => opt.trim()).filter(opt => opt)
        }

        onSave(updates)
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onCancel} />
                <div className="relative bg-white rounded-lg shadow-strong w-full max-w-md">
                    <div className="p-6">
                        <h3 className="text-heading-3 mb-4">Field Properties</h3>

                        <div className="space-y-4">
                            <Input
                                label="Field Label"
                                value={formData.label}
                                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                            />

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="required"
                                    checked={formData.required}
                                    onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                                />
                                <label htmlFor="required" className="text-sm font-medium text-secondary-700">
                                    Required field
                                </label>
                            </div>

                            <Input
                                label="Placeholder"
                                value={formData.placeholder}
                                onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
                            />

                            {field.type === 'dropdown' && (
                                <div>
                                    <label className="form-label">Options (comma-separated)</label>
                                    <textarea
                                        className="w-full px-3 py-2 text-sm border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        value={formData.options}
                                        onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                                        rows={3}
                                        placeholder="Option 1, Option 2, Option 3"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-secondary-200 flex justify-end space-x-3">
                            <Button variant="secondary" onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleSave}>
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Category Properties Modal Component
interface CategoryPropertiesModalProps {
    category: FormCategory
    onSave: (updates: Partial<FormCategory>) => void
    onCancel: () => void
}

const CategoryPropertiesModal: React.FC<CategoryPropertiesModalProps> = ({ category, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: category.name,
        description: category.description || ''
    })

    const handleSave = () => {
        onSave({
            name: formData.name,
            description: formData.description || undefined
        })
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onCancel} />
                <div className="relative bg-white rounded-lg shadow-strong w-full max-w-md">
                    <div className="p-6">
                        <h3 className="text-heading-3 mb-4">Category Properties</h3>

                        <div className="space-y-4">
                            <Input
                                label="Category Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />

                            <div>
                                <label className="form-label">Description</label>
                                <textarea
                                    className="w-full px-3 py-2 text-sm border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-secondary-200 flex justify-end space-x-3">
                            <Button variant="secondary" onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleSave}>
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}