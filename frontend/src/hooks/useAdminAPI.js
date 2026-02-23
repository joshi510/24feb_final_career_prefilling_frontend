import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI, testAPI } from '../services/api';

// Query keys for cache management
export const adminQueryKeys = {
  students: (page, limit, filters) => ['admin', 'students', page, limit, filters],
  studentResult: (studentId, resultId) => ['admin', 'students', studentId, 'result', resultId],
  studentResultFull: (studentId, resultId) => ['admin', 'students', studentId, 'result', resultId, 'full'],
  studentTestAttempts: (studentId) => ['admin', 'students', studentId, 'test-attempts'],
  analytics: () => ['admin', 'analytics'],
};

// Hook for fetching students list with pagination and filters
export function useStudents(page = 1, limit = 10, filters = {}) {
  return useQuery({
    queryKey: adminQueryKeys.students(page, limit, filters),
    queryFn: () => adminAPI.getStudents(page, limit, filters),
    staleTime: 2 * 60 * 1000, // 2 minutes - students list changes more frequently
    cacheTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true, // Keep previous data while fetching new page
  });
}

// Hook for fetching full student result (optimized endpoint)
export function useStudentResultFull(studentId, resultId, options = {}) {
  return useQuery({
    queryKey: adminQueryKeys.studentResultFull(studentId, resultId),
    queryFn: async () => {
      try {
        // Try the optimized /full endpoint first
        console.log('🔵 Fetching from /full endpoint:', studentId, resultId);
        const result = await adminAPI.getStudentResultFull(studentId, resultId);
        console.log('✅ /full endpoint success');
        return result;
      } catch (error) {
        console.error('❌ /full endpoint error:', error);
        // If /full endpoint returns 404 or fails, fall back to regular endpoint
        if (error.message && (error.message.includes('404') || error.message.includes('Not Found'))) {
          console.warn('⚠️ /full endpoint not found, falling back to regular endpoint');
          try {
            // Fetch both regular result and interpretation in parallel
            const [regularResult, interpretation] = await Promise.all([
              adminAPI.getStudentResult(studentId, resultId),
              testAPI.getInterpretation(resultId)
            ]);
            // Combine results to match full endpoint format
            return {
              ...regularResult,
              overall_percentage: interpretation?.overall_percentage,
              readiness_status: interpretation?.readiness_status,
              readiness_explanation: interpretation?.readiness_explanation,
              risk_level: interpretation?.risk_level,
              risk_explanation: interpretation?.risk_explanation,
              risk_explanation_human: interpretation?.risk_explanation_human,
              career_confidence_level: interpretation?.career_confidence_level,
              career_confidence_explanation: interpretation?.career_confidence_explanation,
              do_now_actions: interpretation?.do_now_actions,
              do_later_actions: interpretation?.do_later_actions,
              counsellor_summary: interpretation?.counsellor_summary,
              readiness_action_guidance: interpretation?.readiness_action_guidance
            };
          } catch (fallbackError) {
            console.error('❌ Fallback endpoint also failed:', fallbackError);
            throw fallbackError;
          }
        }
        throw error;
      }
    },
    enabled: !!(studentId && resultId) && (options.enabled !== false), // Only fetch if IDs are provided
    staleTime: 10 * 60 * 1000, // 10 minutes - results don't change often
    cacheTime: 30 * 60 * 1000, // 30 minutes - keep in cache longer
    retry: 1, // Retry once for important data
  });
}

// Hook for fetching student test attempts
export function useStudentTestAttempts(studentId, options = {}) {
  return useQuery({
    queryKey: adminQueryKeys.studentTestAttempts(studentId),
    queryFn: () => adminAPI.getStudentTestAttempts(studentId),
    enabled: !!studentId && (options.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Hook for fetching analytics
export function useAnalytics(options = {}) {
  return useQuery({
    queryKey: adminQueryKeys.analytics(),
    queryFn: () => adminAPI.getAnalytics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    enabled: options.enabled !== false,
  });
}

// Hook for adding counsellor note (mutation)
export function useAddCounsellorNote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ studentId, testAttemptId, notes }) =>
      adminAPI.addCounsellorNote(studentId, testAttemptId, notes),
    onSuccess: (data, variables) => {
      // Invalidate and refetch the student result
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.studentResultFull(variables.studentId, variables.testAttemptId),
      });
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.studentResult(variables.studentId, variables.testAttemptId),
      });
    },
  });
}

// Hook for allowing test retake (mutation)
export function useAllowRetake() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (studentId) => adminAPI.allowRetake(studentId),
    onSuccess: (data, studentId) => {
      // Invalidate students list to show updated status
      queryClient.invalidateQueries({
        queryKey: ['admin', 'students'],
      });
      // Invalidate student test attempts
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.studentTestAttempts(studentId),
      });
    },
  });
}

