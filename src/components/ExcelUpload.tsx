import React, { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { Button } from './index'
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react'
import { type FormCategory, type FormField } from './FormBuilder'

interface ExcelUploadProps {
    onFormGenerated: (categories: FormCategory[]) => void
    disabled?: boolean
}

interface ExcelPreview {
    sheetName: string
    headers: string[]
    sampleData: any[]
    rowCount: number
}

export const ExcelUpload: React.FC<ExcelUploadProps> = ({ onFormGenerated, disabled = false }) => {
    const [isProcessing, setIsProcessing] = useState(false)
    const [preview, setPreview] = useState<ExcelPreview[]>([])
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string>('')
    const fileInputRef = useRef<HTMLInputElement>(null)


    const generateFormFromExcel = (workbook: XLSX.WorkBook): FormCategory[] => {
        const categories: FormCategory[] = []

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

            if (formFields.length === 0) return

            // Create category for this sheet
            const category: FormCategory = {
                id: `category-${Date.now()}-${sheetIndex}`,
                name: sheetName || `Sheet ${sheetIndex + 1}`,
                description: `Generated from Excel sheet: ${sheetName}`,
                order: sheetIndex,
                fields: formFields.map(field => ({ ...field, categoryId: `category-${Date.now()}-${sheetIndex}` }))
            }

            categories.push(category)
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
        setPreview([])
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

            // Generate preview
            const previews: ExcelPreview[] = workbook.SheetNames.map(sheetName => {
                const worksheet = workbook.Sheets[sheetName]
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

                if (jsonData.length === 0) {
                    return {
                        sheetName,
                        headers: [],
                        sampleData: [],
                        rowCount: 0
                    }
                }

                const headers = jsonData[0] as string[]
                const sampleData = jsonData.slice(1, 4) // First 3 data rows for preview

                return {
                    sheetName,
                    headers: headers || [],
                    sampleData,
                    rowCount: jsonData.length - 1
                }
            })

            setPreview(previews)

            // Generate form structure
            const categories = generateFormFromExcel(workbook)

            if (categories.length === 0) {
                throw new Error('No valid data found to generate form fields')
            }

            // Debug information
            console.log('Generated categories:', categories)
            console.log('Total categories found:', categories.length)
            categories.forEach((cat, index) => {
                console.log(`\nSheet ${index + 1} (${cat.name}): ${cat.fields.length} fields`)
                cat.fields.forEach((field, fieldIndex) => {
                    console.log(`  Field ${fieldIndex + 1}: "${field.label}" (${field.type})`)
                })
            })

            // Show success message
            setSuccess(`Successfully analyzed Excel file! Found ${categories.length} sheet(s) with ${categories.reduce((total, cat) => total + cat.fields.length, 0)} field(s).`)

            // Pass generated form to parent
            onFormGenerated(categories)

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process Excel file')
        } finally {
            setIsProcessing(false)
            // Reset file input
            event.target.value = ''
        }
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

            {/* Preview */}
            {preview.length > 0 && (
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-secondary-900">File Preview</h4>
                    <div className="text-xs text-secondary-600 mb-2">File: {fileName}</div>

                    {preview.map((sheet, index) => (
                        <div key={index} className="border border-secondary-200 rounded-md p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h5 className="text-sm font-medium text-secondary-800">
                                    {sheet.sheetName}
                                </h5>
                                <span className="text-xs text-secondary-500">
                                    {sheet.rowCount} rows, {sheet.headers.length} columns
                                </span>
                            </div>

                            {sheet.headers.length > 0 && (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-xs">
                                        <thead>
                                            <tr className="bg-secondary-50">
                                                {sheet.headers.map((header, i) => (
                                                    <th key={i} className="px-2 py-1 text-left text-secondary-600 font-medium">
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sheet.sampleData.slice(0, 3).map((row: any[], rowIndex) => (
                                                <tr key={rowIndex} className="border-t border-secondary-100">
                                                    {sheet.headers.map((_, colIndex) => (
                                                        <td key={colIndex} className="px-2 py-1 text-secondary-700">
                                                            {row[colIndex] !== null && row[colIndex] !== undefined
                                                                ? String(row[colIndex]).substring(0, 20) + (String(row[colIndex]).length > 20 ? '...' : '')
                                                                : '-'
                                                            }
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {sheet.rowCount > 3 && (
                                        <div className="text-xs text-secondary-500 mt-2 text-center">
                                            ... and {sheet.rowCount - 3} more rows
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
