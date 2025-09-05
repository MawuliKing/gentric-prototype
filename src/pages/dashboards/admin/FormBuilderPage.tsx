import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormBuilder } from '../../../components/FormBuilder';
import type { FormCategory } from '../../../components/FormBuilder';
import { useReportTemplateDetails } from '../../../hooks/useReportTemplateDetails';
import { useReportTemplateSections } from '../../../hooks/useReportTemplateSections';
import { Button } from '../../../components';

export const FormBuilderPage: React.FC = () => {
    const { projectTypeId, templateId } = useParams<{ projectTypeId: string; templateId: string }>();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<FormCategory[]>([]);

    // Fetch report template details
    const {
        reportTemplate,
        loading,
        error
    } = useReportTemplateDetails(templateId || '');

    // Update report template sections
    const {
        updateTemplateSections,
        isUpdating,
        error: updateError
    } = useReportTemplateSections();

    // Convert sections to categories when data is loaded
    useEffect(() => {
        if (reportTemplate) {
            if (reportTemplate.sections && reportTemplate.sections.length > 0) {
                // Convert sections to FormCategory format
                const convertedCategories: FormCategory[] = reportTemplate.sections.map((section, index) => ({
                    id: section.id,
                    name: section.name,
                    description: '', // Sections don't have description in the API response
                    order: section.order || index,
                    fields: section.fields.map((field, fieldIndex) => ({
                        id: field.id,
                        type: field.type as any, // Type conversion
                        label: field.label,
                        required: field.required,
                        placeholder: field.placeholder,
                        options: field.options,
                        order: field.order || fieldIndex,
                        categoryId: section.id
                    }))
                }));
                setCategories(convertedCategories);
            } else {
                // Create default category with template name when no sections exist
                const defaultCategory: FormCategory = {
                    id: Date.now().toString(),
                    name: reportTemplate.name,
                    description: reportTemplate.description || '',
                    order: 0,
                    fields: []
                };
                setCategories([defaultCategory]);
            }
        }
    }, [reportTemplate]);

    const handleSave = async () => {
        if (!templateId) return;

        // Convert categories back to sections format
        const sections = categories.map((category, index) => ({
            id: category.id,
            name: category.name,
            order: category.order || index,
            fields: category.fields.map((field, fieldIndex) => ({
                id: field.id,
                type: field.type,
                label: field.label,
                required: field.required,
                placeholder: field.placeholder,
                options: field.options,
                order: field.order || fieldIndex
            }))
        }));

        try {
            const result = await updateTemplateSections(templateId, sections);

            if (result) {
                // Success - navigate back to project type details
                navigate(`/admin/project-types/${projectTypeId}`);
            } else {
                // Error is already set in the hook
                console.error('Failed to save template');
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        }
    };

    const handleCancel = () => {
        navigate(`/admin/project-types/${projectTypeId}`);
    };

    // Show loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-secondary-600">Loading report template...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error || !reportTemplate) {
        return (
            <div className="text-center py-12">
                <div className="w-12 h-12 bg-error-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-heading-3 text-secondary-900 mb-2">Error Loading Report Template</h3>
                <p className="text-body text-secondary-600 mb-4">
                    {error || 'Report template not found'}
                </p>
                <Button
                    variant="primary"
                    onClick={() => navigate(`/admin/project-types/${projectTypeId}`)}
                >
                    Back to Project Type
                </Button>
            </div>
        );
    }

    return (
        <FormBuilder
            categories={categories}
            onCategoriesChange={setCategories}
            onSave={handleSave}
            onCancel={handleCancel}
            templateName={reportTemplate.name}
            templateDescription={reportTemplate.description}
            projectTypeName={reportTemplate.projectType.name}
            createdAt={reportTemplate.createdAt}
            updatedAt={reportTemplate.updatedAt}
            isSaving={isUpdating}
            saveError={updateError}
        />
    );
};