import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Input,
  Select,
  Textarea,
  Checkbox,
} from "../../../components";
import { useReportTemplateDetails } from "../../../hooks/useReportTemplateDetails";
import { useReportSubmission } from "../../../hooks/useReportSubmission";
import type { FormField } from "../../../types/api";

interface FormData {
  [fieldId: string]: any;
}

export const ReportSubmission: React.FC = () => {
  const { templateId, projectId } = useParams<{
    templateId: string;
    projectId: string;
  }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({});

  // Fetch report template details
  const {
    template,
    loading: templateLoading,
    error: templateError,
  } = useReportTemplateDetails({
    templateId: templateId || "",
  });

  // Report submission mutation
  const reportSubmission = useReportSubmission();

  // Utility function to clean form data and remove circular references
  const cleanFormData = (data: any): any => {
    if (data === null || data === undefined) {
      return data;
    }

    if (
      typeof data === "string" ||
      typeof data === "number" ||
      typeof data === "boolean"
    ) {
      return data;
    }

    if (data instanceof File) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(cleanFormData);
    }

    if (typeof data === "object") {
      // Skip objects that might have circular references (like DOM elements)
      if (
        data.constructor &&
        data.constructor.name &&
        (data.constructor.name.includes("HTML") ||
          data.constructor.name.includes("Element") ||
          data.constructor.name.includes("Node"))
      ) {
        return "[DOM Element]";
      }

      const cleaned: any = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          cleaned[key] = cleanFormData(data[key]);
        }
      }
      return cleaned;
    }

    return data;
  };

  const handleInputChange = (fieldId: string, value: any) => {
    // Ensure we only store primitive values, not DOM elements
    let cleanValue = value;

    // If it's an event object, extract the value
    if (value && typeof value === "object" && value.target) {
      // Check if it's a checkbox event with checked property
      if (value.target.checked !== undefined) {
        cleanValue = value.target.checked;
      } else {
        cleanValue = value.target.value;
      }
    }
    // If it's a direct boolean value (from checkbox component), use it directly
    else if (typeof value === "boolean") {
      cleanValue = value;
    }

    // Clean the value to remove any potential circular references
    cleanValue = cleanFormData(cleanValue);

    setFormData((prev) => ({
      ...prev,
      [fieldId]: cleanValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!template || !projectId || !templateId) {
      return;
    }

    try {
      // Clean the form data to remove any circular references
      const cleanedFormData = cleanFormData(formData);

      // Process form data and replace image fields with hardcoded URL
      const processedFormData = Object.keys(cleanedFormData).reduce(
        (acc, key) => {
          const field = template.sections
            ?.flatMap((section) => section.fields)
            ?.find((f) => f.id === key);

          if (field?.type === "image") {
            acc[key] =
              "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
          } else {
            acc[key] = cleanedFormData[key];
          }
          return acc;
        },
        {} as Record<string, any>
      );

      // Structure data according to backend API specification
      const reportData: Array<{
        id: string;
        name: string;
        description: string;
        data: Array<{
          id: string;
          name: string;
          value: any;
          type: string;
        }>;
      }> = [];

      template.sections?.forEach((section) => {
        const sectionFields: Array<{
          id: string;
          name: string;
          value: any;
          type: string;
        }> = [];

        section.fields?.forEach((field) => {
          if (processedFormData[field.id] !== undefined) {
            // Convert all values to strings as required by the backend
            let stringValue = processedFormData[field.id];

            // Handle different data types
            if (typeof stringValue === "boolean") {
              stringValue = stringValue.toString();
            } else if (typeof stringValue === "number") {
              stringValue = stringValue.toString();
            } else if (stringValue === null || stringValue === undefined) {
              stringValue = "";
            } else {
              stringValue = String(stringValue);
            }

            sectionFields.push({
              id: field.id,
              name: field.label,
              value: stringValue,
              type: field.type,
            });
          }
        });

        if (sectionFields.length > 0) {
          reportData.push({
            id: section.id,
            name: section.name,
            description: section.name, // Using section name as description
            data: sectionFields,
          });
        }
      });

      // Create payload according to backend API specification
      const payload = {
        reportData,
        projectId,
        reportTemplateId: templateId,
        status: "SUBMITTED" as const,
      };

      // Safely log the payload without circular references
      console.log("Submitting report:", JSON.parse(JSON.stringify(payload)));

      // Submit the report using the mutation
      await reportSubmission.mutateAsync(payload);

      // Navigate back to project details on success
      navigate(`/agent/projects/${projectId}`);
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || "";

    switch (field.type) {
      case "text":
        return (
          <Input
            key={field.id}
            label={field.label}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );

      case "number":
        return (
          <Input
            key={field.id}
            label={field.label}
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );

      case "textarea":
        return (
          <Textarea
            key={field.id}
            label={field.label}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );

      case "dropdown":
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-secondary-700">
              {field.label}
              {field.required && <span className="text-error-500 ml-1">*</span>}
            </label>
            <Select
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              options={[
                { value: "", label: `Select ${field.label}...` },
                ...(field.options?.map((option) => ({
                  value: option,
                  label: option,
                })) || []),
              ]}
              required={field.required}
            />
          </div>
        );

      case "boolean":
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-secondary-700">
              {field.label}
              {field.required && <span className="text-error-500 ml-1">*</span>}
            </label>
            <Select
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              options={[
                { value: "", label: "Select..." },
                { value: "true", label: "True" },
                { value: "false", label: "False" },
              ]}
              required={field.required}
            />
          </div>
        );

      case "checkbox":
        return (
          <div key={field.id} className="space-y-2">
            <Checkbox
              label={field.label}
              checked={value || false}
              onChange={(checked) => handleInputChange(field.id, checked)}
              required={field.required}
            />
          </div>
        );

      case "image":
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-secondary-700">
              {field.label}
              {field.required ? (
                <span className="text-error-500 ml-1">*</span>
              ) : null}
            </label>
            <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center hover:border-secondary-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Convert file to base64 for preview
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      handleInputChange(field.id, event.target?.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
                id={`image-${field.id}`}
                required={field.required}
              />
              <label
                htmlFor={`image-${field.id}`}
                className="cursor-pointer block"
              >
                {value ? (
                  <div className="space-y-2">
                    <img
                      src={value}
                      alt="Selected image"
                      className="max-h-32 mx-auto rounded-md"
                    />
                    <p className="text-sm text-secondary-600">
                      Click to change image
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <svg
                      className="w-8 h-8 mx-auto text-secondary-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-secondary-600">
                      Click to upload image
                    </p>
                    <p className="text-xs text-secondary-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>
        );

      default:
        return (
          <div key={field.id} className="text-sm text-secondary-500">
            Unsupported field type: {field.type}
          </div>
        );
    }
  };

  if (templateLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (templateError || !template) {
    return (
      <div className="text-center py-12">
        <div className="text-secondary-500 mb-4">
          {templateError || "Report template not found"}
        </div>
        <Button onClick={() => navigate(`/agent/projects/${projectId}`)}>
          Back to Project
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/agent/projects/${projectId}`)}
            className="p-2 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-heading-1 mb-2">{template.name}</h1>
            <p className="text-body-large text-secondary-600">
              {template.description}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {template.sections?.map((section) => (
            <div key={section.id} className="space-y-6">
              <div className="border-b border-secondary-200 pb-4">
                <h2 className="text-heading-3 text-secondary-900">
                  {section.name}
                </h2>
                {section.fields?.length > 0 && (
                  <p className="text-sm text-secondary-600 mt-1">
                    {section.fields.length} field
                    {section.fields.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                {section.fields
                  ?.sort((a, b) => a.order - b.order)
                  .map((field) => renderField(field))}
              </div>
            </div>
          ))}

          {/* Submit Section */}
          <div className="border-t border-secondary-200 pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-secondary-600">
                <span className="text-error-500">*</span> Required fields
              </div>
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(`/agent/projects/${projectId}`)}
                  disabled={reportSubmission.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={reportSubmission.isPending}
                >
                  {reportSubmission.isPending ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>

        {/* Error Display */}
        {reportSubmission.error && (
          <div className="mt-4 bg-error-50 border border-error-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-error-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-error-800">
                  Error Submitting Report
                </h3>
                <div className="mt-2 text-sm text-error-700">
                  {reportSubmission.error.message || "Failed to submit report"}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
