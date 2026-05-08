import { useGetAnalysisQuery } from "@/redux/api/resumeApi";

export const useAnalysis = (analysisId: string) => {
  const { data, isLoading, error, refetch } = useGetAnalysisQuery(analysisId, {
    skip: !analysisId,
  });

  return {
    analysis: data?.data || data, // Handle different response structures
    isLoading,
    error,
    refetch,
  };
};
