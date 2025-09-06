import { useMutation } from "@tanstack/react-query";
import { apiService } from "../services/apiService";
import type { StructuredResponse } from "../types/api";

export interface ReportField {
  id: string;
  name: string;
  value: any;
  type: string;
}

export interface ReportData {
  id: string;
  name: string;
  description: string;
  data: ReportField[];
}

export interface ReportSubmissionData {
  reportData: ReportData[];
  projectId: string;
  reportTemplateId: string;
  status: "SUBMITTED" | "DRAFT" | "PENDING";
}

export interface ReportSubmissionResponse {
  id: string;
  projectId: string;
  reportTemplateId: string;
  reportData: ReportData[];
  status: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export const useReportSubmission = () => {
  return useMutation<StructuredResponse, Error, ReportSubmissionData>({
    mutationFn: async (
      data: ReportSubmissionData
    ): Promise<StructuredResponse> => {
      const response: StructuredResponse = await apiService.post(
        "/reports",
        data
      );

      if (response.status && response.payload) {
        return response;
      } else {
        throw new Error(response.message || "Failed to submit report");
      }
    },
    onSuccess: (data) => {
      console.log("Report submitted successfully:", data);
    },
    onError: (error) => {
      console.error("Error submitting report:", error);
    },
  });
};
