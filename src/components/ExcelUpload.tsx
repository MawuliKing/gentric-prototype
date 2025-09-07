import React, { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { Button, Select, Checkbox } from './index'
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, X, Eye, EyeOff, Trash2 } from 'lucide-react'
import { type FormCategory, type FormField } from './FormBuilder'

interface ExcelUploadProps {
    onFormGenerated: (categories: FormCategory[]) => void
    disabled?: boolean
}


interface DetectedField extends FormField {
    included: boolean
    originalType: FormField['type']
    sheetName: string
}

interface FieldSelectionModalProps {
    detectedFields: DetectedField[]
    onConfirm: (selectedFields: DetectedField[]) => void
    onCancel: () => void
    fileName: string
}

export const ExcelUpload: React.FC<ExcelUploadProps> = ({ onFormGenerated, disabled = false }) => {
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string>('')
    const [showFieldSelection, setShowFieldSelection] = useState(false)
    const [detectedFields, setDetectedFields] = useState<DetectedField[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)


    const detectFieldsFromExcel = (workbook: XLSX.WorkBook): DetectedField[] => {
        const allDetectedFields: DetectedField[] = []

        workbook.SheetNames.forEach((sheetName, sheetIndex) => {
            const worksheet = workbook.Sheets[sheetName]
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

            if (jsonData.length === 0) return

            // Convert to a more workable format - get all non-empty cells with their positions
            const allCells: Array<{ row: number, col: number, value: any, label?: string }> = []

            jsonData.forEach((row: unknown, rowIndex) => {
                (row as any[]).forEach((cell, colIndex) => {
                    if (cell !== null && cell !== undefined && String(cell).trim() !== '') {
                        allCells.push({
                            row: rowIndex,
                            col: colIndex,
                            value: cell
                        })
                    }
                })
            })

            if (allCells.length === 0) return

            // Analyze the structure to identify form fields
            const formFields = extractFormFields(allCells, jsonData)

            // Convert to DetectedField format
            const detectedFieldsForSheet: DetectedField[] = formFields.map((field, index) => ({
                ...field,
                id: `field-${Date.now()}-${sheetIndex}-${index}`,
                included: true, // Include all fields by default
                originalType: field.type,
                sheetName: sheetName || `Sheet ${sheetIndex + 1}`,
                categoryId: `category-${sheetName}-${sheetIndex}`,
                order: index
            }))

            allDetectedFields.push(...detectedFieldsForSheet)
        })

        return allDetectedFields
    }

    const generateFormFromDetectedFields = (selectedFields: DetectedField[]): FormCategory[] => {
        const categories: FormCategory[] = []
        const categoriesMap = new Map<string, FormCategory>()

        selectedFields.forEach((field) => {
            if (!field.included) return

            if (!categoriesMap.has(field.sheetName)) {
                const category: FormCategory = {
                    id: field.categoryId,
                    name: field.sheetName,
                    description: `Generated from Excel sheet: ${field.sheetName}`,
                    order: categories.length,
                    fields: []
                }
                categoriesMap.set(field.sheetName, category)
                categories.push(category)
            }

            const category = categoriesMap.get(field.sheetName)!
            category.fields.push({
                ...field,
                order: category.fields.length
            })
        })

        return categories
    }


    // Helper method to extract form fields from complex layouts
    const extractFormFields = (allCells: Array<{ row: number, col: number, value: any }>, jsonData: any[]): FormField[] => {
        const fields: FormField[] = []
        const processedCells = new Set<string>()

        // Strategy 1: Look for label-value pairs (common in forms)
        allCells.forEach((cell, index) => {
            const cellKey = `${cell.row}-${cell.col}`
            if (processedCells.has(cellKey)) return

            const cellValue = String(cell.value).trim()

            // Skip if this looks like just a value without context
            if (!isNaN(Number(cellValue)) && cellValue.length < 3) return

            // Look for adjacent cells that might be values
            const rightCell = allCells.find(c => c.row === cell.row && c.col === cell.col + 1)
            const belowCell = allCells.find(c => c.row === cell.row + 1 && c.col === cell.col)

            let fieldLabel = cellValue
            let fieldValue = null
            let fieldType: FormField['type'] = 'text'

            // Check if this cell is followed by a colon (indicating it's a label)
            if (cellValue.endsWith(':') || cellValue.includes(':')) {
                const labelPart = cellValue.replace(':', '').trim()
                if (labelPart.length > 0) {
                    fieldLabel = labelPart

                    // Look for the value in adjacent cells
                    if (rightCell) {
                        fieldValue = rightCell.value
                        processedCells.add(`${rightCell.row}-${rightCell.col}`)
                    } else if (belowCell) {
                        fieldValue = belowCell.value
                        processedCells.add(`${belowCell.row}-${belowCell.col}`)
                    }
                }
            }
            // Check if next cell looks like a value for this label
            else if (rightCell && looksLikeLabel(cellValue)) {
                fieldValue = rightCell.value
                processedCells.add(`${rightCell.row}-${rightCell.col}`)
            }
            // Check if cell below looks like a value
            else if (belowCell && looksLikeLabel(cellValue)) {
                fieldValue = belowCell.value
                processedCells.add(`${belowCell.row}-${belowCell.col}`)
            }
            // If no clear value pair, treat as a standalone field
            else if (looksLikeLabel(cellValue)) {
                // This might be a field that expects user input
                fieldValue = null
            } else {
                // Skip cells that don't look like labels
                return
            }

            // Determine field type based on the value or label
            if (fieldValue !== null) {
                fieldType = detectFieldTypeFromValue(fieldValue)
            } else {
                fieldType = detectFieldTypeFromLabel(fieldLabel)
            }

            // Create the form field
            const field: FormField = {
                id: `field-${Date.now()}-${index}`,
                type: fieldType,
                label: fieldLabel,
                required: false,
                placeholder: `Enter ${fieldLabel.toLowerCase()}`,
                order: fields.length,
                categoryId: '' // Will be set by parent
            }

            // Add options for dropdown if we detected specific values
            if (fieldType === 'dropdown' && fieldValue) {
                field.options = [String(fieldValue)]
            }

            fields.push(field)
            processedCells.add(cellKey)
        })

        // Strategy 2: Look for table-like structures
        const tableFields = extractTableFields(jsonData)
        fields.push(...tableFields)

        return fields
    }

    // Helper to detect if a cell value looks like a label
    const looksLikeLabel = (value: string): boolean => {
        const val = String(value).trim()

        // Must be at least 2 characters
        if (val.length < 2) return false

        // Exclude pure numbers
        if (!isNaN(Number(val))) return false

        // Exclude very short values that are likely data
        if (val.length < 3 && !val.endsWith(':')) return false

        // Include common label patterns
        if (val.includes(':') || val.endsWith(':')) return true
        if (val.match(/^[A-Z][a-z].*/) || val.includes(' ')) return true

        return true
    }

    // Helper to detect field type from a specific value
    const detectFieldTypeFromValue = (value: any): FormField['type'] => {
        if (value === null || value === undefined) return 'text'

        const str = String(value).trim().toLowerCase()

        // Check for boolean-like values
        if (['yes', 'no', 'true', 'false', 'y', 'n', '1', '0'].includes(str)) {
            return 'boolean'
        }

        // Check for numbers
        if (!isNaN(Number(value))) {
            return 'number'
        }

        // Check for dates
        if (str.match(/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/) || str.includes('/')) {
            return 'text' // Could be date but we'll keep as text for now
        }

        // Check for long text
        if (str.length > 50) {
            return 'textarea'
        }

        return 'text'
    }

    // Helper to detect field type from label text
    const detectFieldTypeFromLabel = (label: string): FormField['type'] => {
        const lowerLabel = label.toLowerCase()

        // Date-related fields
        if (lowerLabel.includes('date') || lowerLabel.includes('time')) {
            return 'text' // Could be date input but keeping as text for compatibility
        }

        // Number-related fields
        if (lowerLabel.includes('number') || lowerLabel.includes('qty') ||
            lowerLabel.includes('quantity') || lowerLabel.includes('amount') ||
            lowerLabel.includes('weight') || lowerLabel.includes('size')) {
            return 'number'
        }

        // Boolean-related fields
        if (lowerLabel.includes('approved') || lowerLabel.includes('complete') ||
            lowerLabel.includes('check') || lowerLabel.includes('confirm') ||
            lowerLabel.includes('pass') || lowerLabel.includes('fail')) {
            return 'boolean'
        }

        // Description/comment fields
        if (lowerLabel.includes('description') || lowerLabel.includes('comment') ||
            lowerLabel.includes('note') || lowerLabel.includes('summary') ||
            lowerLabel.includes('detail')) {
            return 'textarea'
        }

        return 'text'
    }

    // Helper to extract fields from table-like structures
    const extractTableFields = (jsonData: any[]): FormField[] => {
        const fields: FormField[] = []

        // Look for rows that look like table headers
        for (let rowIndex = 0; rowIndex < jsonData.length - 1; rowIndex++) {
            const row = jsonData[rowIndex] as any[]
            const nextRow = jsonData[rowIndex + 1] as any[]

            if (!row || !nextRow) continue

            // Check if this row has multiple non-empty cells (potential header)
            const headerCells = row.filter(cell => cell !== null && cell !== undefined && String(cell).trim() !== '')

            if (headerCells.length >= 3) { // At least 3 columns for a table
                // This might be a table header, create fields for each column
                row.forEach((header, colIndex) => {
                    if (header && String(header).trim()) {
                        const field: FormField = {
                            id: `table-field-${Date.now()}-${rowIndex}-${colIndex}`,
                            type: 'text',
                            label: String(header).trim(),
                            required: false,
                            placeholder: `Enter ${String(header).toLowerCase()}`,
                            order: fields.length,
                            categoryId: '' // Will be set by parent
                        }
                        fields.push(field)
                    }
                })
                break // Only process the first table found
            }
        }

        return fields
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setIsProcessing(true)
        setError(null)
        setSuccess(null)
        setFileName(file.name)

        try {
            // Validate file type
            const validTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
                'application/vnd.ms-excel', // .xls
                'text/csv' // .csv
            ]

            if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
                throw new Error('Please upload a valid Excel file (.xlsx, .xls) or CSV file (.csv)')
            }

            // Read file
            const arrayBuffer = await file.arrayBuffer()
            const workbook = XLSX.read(arrayBuffer, { type: 'array' })

            if (workbook.SheetNames.length === 0) {
                throw new Error('No sheets found in the Excel file')
            }


            // Detect all fields from the Excel file
            const detectedFieldsArray = detectFieldsFromExcel(workbook)

            if (detectedFieldsArray.length === 0) {
                throw new Error('No valid data found to generate form fields')
            }

            // Debug information
            console.log('Detected fields:', detectedFieldsArray)
            console.log('Total fields found:', detectedFieldsArray.length)
            detectedFieldsArray.forEach((field, index) => {
                console.log(`  Field ${index + 1}: "${field.label}" (${field.type}) - Sheet: ${field.sheetName}`)
            })

            // Set detected fields and show selection modal
            setDetectedFields(detectedFieldsArray)
            setShowFieldSelection(true)

            // Show initial success message
            setSuccess(`Successfully analyzed Excel file! Found ${detectedFieldsArray.length} field(s). Please review and select the fields you want to include.`)

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process Excel file')
        } finally {
            setIsProcessing(false)
            // Reset file input
            event.target.value = ''
        }
    }

    const handleFieldSelectionConfirm = (selectedFields: DetectedField[]) => {
        try {
            // Generate form categories from selected fields
            const categories = generateFormFromDetectedFields(selectedFields)

            // Pass generated form to parent
            onFormGenerated(categories)

            // Close modal and update success message
            setShowFieldSelection(false)
            const includedCount = selectedFields.filter(f => f.included).length
            setSuccess(`Form generated successfully! Included ${includedCount} field(s) from your Excel file.`)

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate form from selected fields')
        }
    }

    const handleFieldSelectionCancel = () => {
        setShowFieldSelection(false)
        setDetectedFields([])
        setSuccess(null)
    }

    return (
        <div className="space-y-4">
            <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center">
                <div className="space-y-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full mx-auto flex items-center justify-center">
                        <FileSpreadsheet className="w-6 h-6 text-primary-600" />
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-secondary-900 mb-2">
                            Upload Excel File
                        </h3>
                        <p className="text-sm text-secondary-600 mb-4">
                            Upload an Excel file (.xlsx, .xls) or CSV file to automatically generate form fields from the column headers and data.
                        </p>
                    </div>

                    <div className="relative">
                        <input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileUpload}
                            disabled={disabled || isProcessing}
                            className="hidden"
                            ref={fileInputRef}
                        />
                        <Button
                            variant="primary"
                            disabled={disabled || isProcessing}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {isProcessing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Choose Excel File
                                </>
                            )}
                        </Button>
                    </div>

                    <p className="text-xs text-secondary-500">
                        Supported formats: .xlsx, .xls, .csv (max 10MB)
                    </p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-error-50 border border-error-200 rounded-md p-4">
                    <div className="flex">
                        <AlertCircle className="h-5 w-5 text-error-400 flex-shrink-0" />
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-error-800">
                                Upload Error
                            </h3>
                            <div className="mt-1 text-sm text-error-700">
                                {error}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="bg-success-50 border border-success-200 rounded-md p-4">
                    <div className="flex">
                        <CheckCircle className="h-5 w-5 text-success-400 flex-shrink-0" />
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-success-800">
                                Form Generated Successfully
                            </h3>
                            <div className="mt-1 text-sm text-success-700">
                                {success}
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Field Selection Modal */}
            {showFieldSelection && (
                <FieldSelectionModal
                    detectedFields={detectedFields}
                    onConfirm={handleFieldSelectionConfirm}
                    onCancel={handleFieldSelectionCancel}
                    fileName={fileName}
                />
            )}
        </div>
    )
}

// Field Selection Modal Component
const FieldSelectionModal: React.FC<FieldSelectionModalProps> = ({
    detectedFields,
    onConfirm,
    onCancel,
    fileName
}) => {
    const [fields, setFields] = useState<DetectedField[]>(detectedFields)
    const [selectAll, setSelectAll] = useState(true)
    const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null)

    const FIELD_TYPES = [
        { value: 'text', label: 'Text Input', icon: '📝' },
        { value: 'number', label: 'Number Input', icon: '🔢' },
        { value: 'textarea', label: 'Text Area', icon: '📄' },
        { value: 'boolean', label: 'True/False', icon: '✅' },
        { value: 'checkbox', label: 'Checkbox', icon: '☑️' },
        { value: 'dropdown', label: 'Dropdown', icon: '📋' },
        { value: 'image', label: 'Image Selector', icon: '🖼️' }
    ]

    const handleToggleField = (fieldId: string) => {
        setFields(prev => prev.map(field =>
            field.id === fieldId
                ? { ...field, included: !field.included }
                : field
        ))
    }

    const handleFieldTypeChange = (fieldId: string, newType: FormField['type']) => {
        setFields(prev => prev.map(field =>
            field.id === fieldId
                ? { ...field, type: newType }
                : field
        ))
    }

    const handleDeleteField = (fieldId: string) => {
        setFields(prev => prev.filter(field => field.id !== fieldId))
    }

    const handleDeleteSection = (sheetName: string) => {
        setDeleteConfirmation(sheetName)
    }

    const confirmDeleteSection = () => {
        if (deleteConfirmation) {
            setFields(prev => prev.filter(field => field.sheetName !== deleteConfirmation))
            setDeleteConfirmation(null)
        }
    }

    const cancelDeleteSection = () => {
        setDeleteConfirmation(null)
    }

    const handleToggleAll = () => {
        const newSelectAll = !selectAll
        setSelectAll(newSelectAll)
        setFields(prev => prev.map(field => ({ ...field, included: newSelectAll })))
    }

    const handleConfirm = () => {
        onConfirm(fields)
    }

    const includedCount = fields.filter(f => f.included).length
    const groupedBySheet = fields.reduce((acc, field) => {
        if (!acc[field.sheetName]) {
            acc[field.sheetName] = []
        }
        acc[field.sheetName].push(field)
        return acc
    }, {} as Record<string, DetectedField[]>)

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-strong w-full max-w-4xl max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-secondary-200">
                        <div>
                            <h3 className="text-heading-3 text-secondary-900">
                                Select Form Fields
                            </h3>
                            <p className="text-sm text-secondary-600 mt-1">
                                File: {fileName} • {fields.length} fields detected • {includedCount} selected
                            </p>
                        </div>
                        <button
                            onClick={onCancel}
                            className="p-2 hover:bg-secondary-100 rounded-md transition-colors"
                        >
                            <X className="w-5 h-5 text-secondary-400" />
                        </button>
                    </div>

                    {/* Controls */}
                    <div className="p-6 border-b border-secondary-200 bg-secondary-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleToggleAll}
                                    className="flex items-center space-x-2 text-sm font-medium text-primary-700 hover:text-primary-800"
                                >
                                    {selectAll ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    <span>{selectAll ? 'Deselect All' : 'Select All'}</span>
                                </button>
                                <div className="text-sm text-secondary-600">
                                    {includedCount} of {fields.length} fields selected
                                </div>
                            </div>
                            <div className="text-xs text-secondary-500">
                                💡 Tip: You can change field types, toggle inclusion, delete individual fields, or delete entire sections
                            </div>
                        </div>
                    </div>

                    {/* Field List */}
                    <div className="flex-1 overflow-y-auto max-h-96 p-6">
                        {fields.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-secondary-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <FileSpreadsheet className="w-8 h-8 text-secondary-400" />
                                </div>
                                <h4 className="text-lg font-medium text-secondary-900 mb-2">No fields remaining</h4>
                                <p className="text-secondary-600">All fields have been deleted. Please cancel and try again.</p>
                            </div>
                        ) : (
                            Object.entries(groupedBySheet).map(([sheetName, sheetFields]) => (
                                <div key={sheetName} className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-lg font-semibold text-secondary-800 flex items-center">
                                            <FileSpreadsheet className="w-5 h-5 mr-2 text-primary-600" />
                                            {sheetName}
                                            <span className="ml-2 text-sm font-normal text-secondary-500">
                                                ({sheetFields.length} fields)
                                            </span>
                                        </h4>
                                        <button
                                            onClick={() => handleDeleteSection(sheetName)}
                                            className="p-2 text-error-400 hover:text-error-600 hover:bg-error-50 rounded-md transition-colors"
                                            title={`Delete all fields from ${sheetName}`}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {sheetFields.map((field) => (
                                            <div
                                                key={field.id}
                                                className={`border rounded-lg p-4 transition-all ${field.included
                                                    ? 'border-primary-200 bg-primary-50'
                                                    : 'border-secondary-200 bg-secondary-50 opacity-60'
                                                    }`}
                                            >
                                                <div className="flex items-start space-x-4">
                                                    {/* Include/Exclude Toggle */}
                                                    <div className="flex items-center pt-1">
                                                        <Checkbox
                                                            checked={field.included}
                                                            onChange={() => handleToggleField(field.id)}
                                                            label=""
                                                        />
                                                    </div>

                                                    {/* Field Info */}
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <h5 className="font-medium text-secondary-900">
                                                                {field.label}
                                                            </h5>
                                                            {field.type !== field.originalType && (
                                                                <span className="text-xs bg-warning-100 text-warning-700 px-2 py-1 rounded">
                                                                    Modified
                                                                </span>
                                                            )}
                                                        </div>

                                                        {field.placeholder && (
                                                            <p className="text-sm text-secondary-600 mb-2">
                                                                Placeholder: {field.placeholder}
                                                            </p>
                                                        )}

                                                        {field.options && field.options.length > 0 && (
                                                            <div className="text-sm text-secondary-600 mb-2">
                                                                <span className="font-medium">Options:</span> {field.options.join(', ')}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Field Type Selector */}
                                                    <div className="w-48">
                                                        <Select
                                                            label=""
                                                            value={field.type}
                                                            onChange={(e) => handleFieldTypeChange(field.id, e.target.value as FormField['type'])}
                                                            options={FIELD_TYPES.map(type => ({
                                                                value: type.value,
                                                                label: `${type.icon} ${type.label}`
                                                            }))}
                                                            disabled={!field.included}
                                                        />
                                                    </div>

                                                    {/* Delete Button */}
                                                    <div className="flex items-center">
                                                        <button
                                                            onClick={() => handleDeleteField(field.id)}
                                                            className="p-2 text-error-400 hover:text-error-600 hover:bg-error-50 rounded-md transition-colors"
                                                            title="Delete field"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-secondary-200 bg-secondary-50">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-secondary-600">
                                {includedCount} field(s) will be added to your form
                            </div>
                            <div className="flex space-x-3">
                                <Button variant="secondary" onClick={onCancel}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleConfirm}
                                    disabled={includedCount === 0 || fields.length === 0}
                                >
                                    Generate Form ({includedCount} fields)
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Section Confirmation Dialog */}
            {deleteConfirmation && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                    <div className="bg-white rounded-lg shadow-strong p-6 max-w-md mx-4">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-error-100 rounded-full flex items-center justify-center">
                                    <Trash2 className="w-5 h-5 text-error-600" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-secondary-900 mb-2">
                                    Delete Section
                                </h3>
                                <p className="text-sm text-secondary-600 mb-4">
                                    Are you sure you want to delete all fields from "{deleteConfirmation}"?
                                    This action cannot be undone.
                                </p>
                                <div className="flex space-x-3">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={cancelDeleteSection}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="error"
                                        size="sm"
                                        onClick={confirmDeleteSection}
                                    >
                                        Delete Section
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
