import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminAPI, testAPI, counsellorAPI } from '../../services/api';
import { useStudentResultFull, useStudentTestAttempts, useAddCounsellorNote } from '../../hooks/useAdminAPI';
import AdminLayout from '../../components/admin/AdminLayout';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import Toast from '../../components/admin/Toast';
import RIASECProfile from '../../components/RIASECProfile';
import RIASECCareerPathways from '../../components/RIASECCareerPathways';
import RIASECDimensionCard from '../../components/RIASECDimensionCard';
import RIASECDimensionsOverview from '../../components/RIASECDimensionsOverview';
import ScoreSummary from '../../components/ScoreSummary';
import CounsellorSummary from '../../components/CounsellorSummary';
import KeyTakeaway from '../../components/KeyTakeaway';
import ReadinessActionGuidance from '../../components/ReadinessActionGuidance';
import ReadinessStatus from '../../components/ReadinessStatus';
import CareerConfidence from '../../components/CareerConfidence';
import DoNowDoLater from '../../components/DoNowDoLater';
import { generatePDF } from '../../utils/pdfGenerator';
import ResultPDF from '../../components/ResultPDF';

// Premium Icons
const IconArrowLeft = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const IconSave = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const IconFileText = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const IconClock = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

function AdminStudentResult() {
  const { studentId: rawStudentId, resultId: rawResultId } = useParams();
  const navigate = useNavigate();
  const [noteText, setNoteText] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [downloading, setDownloading] = useState(false);
  const pdfRef = useRef(null);
  const [riasecReport, setRiasecReport] = useState(null);
  const [loadingRIASEC, setLoadingRIASEC] = useState(false);
  const [riasecError, setRiasecError] = useState(null);

  // Clean and parse IDs
  const cleanStudentIdString = rawStudentId ? String(rawStudentId).trim().split(':')[0].split('/')[0].split(' ')[0] : null;
  const cleanResultIdString = rawResultId ? String(rawResultId).trim().split(':')[0].split('/')[0].split(' ')[0] : null;
  const parsedStudentId = cleanStudentIdString ? parseInt(cleanStudentIdString, 10) : null;
  const parsedResultId = cleanResultIdString ? parseInt(cleanResultIdString, 10) : null;
  const finalStudentId = parsedStudentId && !isNaN(parsedStudentId) ? parsedStudentId : null;
  const finalResultId = parsedResultId && !isNaN(parsedResultId) ? parsedResultId : null;

  // React Query hooks
  const { 
    data: resultData, 
    isLoading: loading, 
    error: queryError,
    refetch: refetchResult
  } = useStudentResultFull(finalStudentId, finalResultId, {
    enabled: !!(finalStudentId && finalResultId)
  });

  const { 
    data: attemptsData, 
    isLoading: loadingAttempts 
  } = useStudentTestAttempts(finalStudentId, {
    enabled: !!finalStudentId
  });

  const addNoteMutation = useAddCounsellorNote();

  // Transform result data
  const result = resultData || null;
  const interpretation = result ? {
    overall_percentage: result.overall_percentage,
    interpretation_text: result.interpretation_text,
    strengths: result.strengths,
    areas_for_improvement: result.areas_for_improvement,
    readiness_status: result.readiness_status,
    readiness_explanation: result.readiness_explanation,
    risk_level: result.risk_level,
    risk_explanation: result.risk_explanation,
    risk_explanation_human: result.risk_explanation_human,
    career_confidence_level: result.career_confidence_level,
    career_confidence_explanation: result.career_confidence_explanation,
    do_now_actions: result.do_now_actions,
    do_later_actions: result.do_later_actions,
    counsellor_summary: result.counsellor_summary
  } : null;

  const testAttempts = attemptsData?.attempts || [];
  const counsellorNote = result?.counsellor_notes && result.counsellor_notes.length > 0 
    ? result.counsellor_notes[0] 
    : null;

  // Store IDs in sessionStorage for refresh handling
  useEffect(() => {
    if (finalStudentId && finalResultId) {
      sessionStorage.setItem('currentAdminStudentId', finalStudentId.toString());
      sessionStorage.setItem('currentAdminResultId', finalResultId.toString());
    }
  }, [finalStudentId, finalResultId]);

  // Handle URL restoration on mount
  useEffect(() => {
    const currentPath = window.location.pathname;
    const isOnResultPage = currentPath.includes('/admin/students/') && currentPath.includes('/result/');
    
    if (isOnResultPage && (!rawStudentId || !rawResultId)) {
      const storedStudentId = sessionStorage.getItem('currentAdminStudentId');
      const storedResultId = sessionStorage.getItem('currentAdminResultId');
      
      if (storedStudentId && storedResultId) {
        navigate(`/admin/students/${storedStudentId}/result/${storedResultId}`, { replace: true });
      }
    }
  }, [rawStudentId, rawResultId, navigate]);

  // Set initial note text when counsellor note is available
  useEffect(() => {
    if (counsellorNote) {
      setNoteText(counsellorNote.notes || '');
    }
  }, [counsellorNote]);

  // Load RIASEC report from result data or fetch separately
  useEffect(() => {
    if (result?.riasec_report) {
      const riasecData = result.riasec_report;
      if (riasecData.report) {
        setRiasecReport(riasecData.report);
      } else if (riasecData.scores) {
        setRiasecReport(null);
      }
    } else if (finalResultId) {
      // Fetch RIASEC report if not in result
      (async () => {
        try {
          setLoadingRIASEC(true);
          setRiasecError(null);
          const riasecData = await testAPI.getRIASECReport(finalResultId);
          if (riasecData && riasecData.report) {
            setRiasecReport(riasecData.report);
          } else {
            setRiasecReport(null);
          }
        } catch (e) {
          console.error('❌ RIASEC report error:', e);
          setRiasecError(e.message || 'Failed to load RIASEC report');
          setRiasecReport(null);
        } finally {
          setLoadingRIASEC(false);
        }
      })();
    }
  }, [result, finalResultId]);

  const handleSaveNote = async () => {
    if (!noteText.trim()) {
      setToast({
        visible: true,
        message: 'Please enter a note before saving',
        type: 'warning'
      });
      return;
    }

    if (!finalStudentId || !result?.test_attempt_id) {
      setToast({
        visible: true,
        message: 'Invalid student ID or test attempt ID',
        type: 'error'
      });
      return;
    }

    try {
      await addNoteMutation.mutateAsync({
        studentId: finalStudentId,
        testAttemptId: result.test_attempt_id,
        notes: noteText.trim()
      });
      setToast({
        visible: true,
        message: 'Counsellor note saved successfully',
        type: 'success'
      });
      // React Query will automatically refetch the result
    } catch (err) {
      setToast({
        visible: true,
        message: `Failed to save note: ${err.message}`,
        type: 'error'
      });
    }
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    
    try {
      setDownloading(true);
      await generatePDF(pdfRef.current, result?.student || {}, interpretation, counsellorNote, riasecReport);
    } catch (err) {
      setToast({
        visible: true,
        message: 'Failed to generate PDF. Please try again.',
        type: 'error'
      });
      console.error('PDF generation error:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loading message="Loading student result..." />
      </AdminLayout>
    );
  }

  if (queryError && !result) {
    return (
      <AdminLayout>
        <Error message={queryError.message || 'Failed to load student result'} onRetry={() => refetchResult()} />
      </AdminLayout>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 py-3 sm:py-4 -mx-3 sm:-mx-6 px-3 sm:px-6 border-b border-slate-200 dark:border-slate-700 mb-4 sm:mb-6">
          <div className="flex items-start sm:items-center gap-2 sm:gap-4">
            <motion.button
              onClick={() => navigate('/admin/students')}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconArrowLeft className="w-5 h-5" />
            </motion.button>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Student Test Result
                </h1>
                <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Admin View
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">
                {result.student.full_name} • {result.student.email}
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1.5 sm:mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Test Attempt ID: <span className="font-medium text-slate-700 dark:text-slate-300">{result.test_attempt_id}</span></span>
                {result.created_at && (
                  <span className="hidden sm:inline">Test Date: <span className="font-medium text-slate-700 dark:text-slate-300">
                    {new Date(result.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span></span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PDF Container - Hidden for PDF generation */}
        <div 
          ref={pdfRef}
          id="pdf-container"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            width: '800px',
            zIndex: -1,
            opacity: 0,
            pointerEvents: 'none'
          }}
        >
          <ResultPDF 
            interpretation={interpretation} 
            counsellorNote={counsellorNote}
            user={result?.student || {}}
            riasecReport={riasecReport}
          />
        </div>

        {/* Report Content - Match student side exactly */}
        <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-10 border border-slate-200/60 dark:border-slate-700 space-y-4 sm:space-y-6 md:space-y-8">
          {/* RIASEC Profile Section - At the very top if available */}
          {loadingRIASEC ? (
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-6 sm:p-8 mb-4 sm:mb-6">
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-600"></div>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Generating RIASEC career profile...</p>
              </div>
            </div>
          ) : riasecReport ? (
            <>
              {/* LLM Boundary Guardrail */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2.5 sm:p-3 mb-3 sm:mb-4">
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong>Interpretation Safety Note:</strong> LLM-generated content is strictly interpretive and never modifies calculated scores or classifications.
                </p>
              </div>
              <RIASECProfile riasecReport={riasecReport} />
              
              {/* RIASEC Dimensions Overview - Colorful Hexagonal/Card Layout */}
              {riasecReport.dimensions && riasecReport.dimensions.length > 0 && (
                <RIASECDimensionsOverview dimensions={riasecReport.dimensions} />
              )}
              
              {/* RIASEC Dimensions - Individual Cards */}
              {riasecReport.dimensions && riasecReport.dimensions.length > 0 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6">
                    Detailed Dimension Analysis
                  </h2>
                  {riasecReport.dimensions.map((dimension, index) => (
                    <RIASECDimensionCard key={dimension.code} dimension={dimension} />
                  ))}
                </div>
              )}
              
              {/* Divider */}
              <div className="border-t border-slate-200 dark:border-slate-700 my-8"></div>
            </>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                <strong>Note:</strong> RIASEC career profile report is not available for this test.
                {riasecError && (
                  <>
                    <span className="block mt-2 text-red-600 dark:text-red-400">
                      <strong>Error:</strong> {riasecError}
                    </span>
                  </>
                )}
                {!riasecError && (
                  <span className="block mt-2">
                    This may occur if RIASEC sections (5-10) questions are not properly categorized with RIASEC codes (R, I, A, S, E, C), or if the test attempt doesn't have answers for sections 5-10.
                    <span className="block mt-2 text-xs italic">
                      No answers → Returns 0% for display baseline (indicating insufficient response data). Invalid answer → Defaults to neutral value (3). Missing/skipped answer → Excluded from calculations.
                    </span>
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Counsellor Summary - At the very top */}
          {interpretation?.counsellor_summary && (
            <CounsellorSummary counsellorSummary={interpretation.counsellor_summary} />
          )}

          {/* Score Summary */}
          {interpretation && interpretation.overall_percentage !== undefined && (
            <ScoreSummary interpretation={interpretation} />
          )}

          {/* Key Takeaway - Single Line Summary */}
          {interpretation && (
            <KeyTakeaway 
              readinessStatus={interpretation.readiness_status}
              overallPercentage={interpretation.overall_percentage}
            />
          )}

          {/* Readiness Action Guidance */}
          {interpretation?.readiness_action_guidance && interpretation.readiness_action_guidance.length > 0 && (
            <ReadinessActionGuidance 
              readinessActionGuidance={interpretation.readiness_action_guidance}
              readinessStatus={interpretation.readiness_status}
            />
          )}

          {/* Readiness Status and Risk Level */}
          {interpretation && (
            <ReadinessStatus
              readinessStatus={interpretation.readiness_status}
              readinessExplanation={interpretation.readiness_explanation}
              riskLevel={interpretation.risk_level}
              riskExplanation={interpretation.risk_explanation}
              riskExplanationHuman={interpretation.risk_explanation_human}
            />
          )}

          {/* Career Confidence Indicator */}
          {interpretation?.career_confidence_level && interpretation.career_confidence_explanation && (
            <CareerConfidence
              careerConfidenceLevel={interpretation.career_confidence_level}
              careerConfidenceExplanation={interpretation.career_confidence_explanation}
            />
          )}

          {/* Do Now vs Do Later */}
          {((interpretation?.do_now_actions && interpretation.do_now_actions.length > 0) || 
            (interpretation?.do_later_actions && interpretation.do_later_actions.length > 0)) && (
            <DoNowDoLater
              doNowActions={interpretation.do_now_actions}
              doLaterActions={interpretation.do_later_actions}
            />
          )}

          {/* Potential Career Pathways - Before Counsellor Notes */}
          {riasecReport && riasecReport.dimensions && riasecReport.dimensions.length > 0 && (
            <RIASECCareerPathways 
              careerPathways={riasecReport.careerPathways} 
              dimensions={riasecReport.dimensions}
            />
          )}

        {/* Test Attempts Timeline */}
        {testAttempts.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <IconClock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
                Test Attempts Timeline
              </h2>
            </div>
            <div className="space-y-3">
              {testAttempts.map((attempt, index) => {
                const isCurrent = attempt.id === result?.test_attempt_id;
                return (
                  <div
                    key={attempt.id}
                    className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 rounded-lg border ${
                      isCurrent
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                        : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-3 h-3 rounded-full ${
                      isCurrent ? 'bg-blue-600 dark:bg-blue-400' : 'bg-slate-400 dark:bg-slate-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100">
                          Attempt #{attempt.id}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {attempt.completed_at
                          ? new Date(attempt.completed_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : attempt.created_at
                          ? new Date(attempt.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'Date not available'}
                      </p>
                    </div>
                    {!isCurrent && (
                      <motion.button
                        onClick={() => navigate(`/admin/students/${rawStudentId}/result/${attempt.id}`)}
                        className="w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors touch-manipulation min-h-[44px] min-w-[60px] flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View
                      </motion.button>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

          {/* Counsellor Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-purple-200 dark:border-purple-800"
          >
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">Counsellor's Expert Notes</h2>
            </div>

            {counsellorNote ? (
              <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-3 sm:p-4 border border-purple-200 dark:border-purple-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3">
                  <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                    By {counsellorNote.counsellor_name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(counsellorNote.created_at).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {counsellorNote.notes}
                </p>
              </div>
            ) : (
              <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 sm:p-6 border border-purple-200 dark:border-purple-800 text-center">
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic">
                  No counsellor notes added yet
                </p>
              </div>
            )}

            {/* Add/Edit Note - Admin can always edit */}
            <div className="mt-3 sm:mt-4">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add your professional notes and insights about this student's assessment results..."
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm rounded-lg border border-purple-300 dark:border-purple-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 min-h-[150px] resize-y"
              />
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {addNoteMutation.isLoading && (
                  <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Saving...</span>
                )}
                <motion.button
                  onClick={handleSaveNote}
                  disabled={addNoteMutation.isLoading || !noteText.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto sm:ml-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addNoteMutation.isLoading ? 'Saving...' : counsellorNote ? 'Update Notes' : 'Save Notes'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Test Attempts Timeline - Admin specific */}

        {/* Parent-Friendly Disclaimer - Same as student side */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-700"
        >
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 sm:p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
              Important Information for Parents and Students
            </h3>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                <strong>What this report means:</strong> This assessment provides insights into the student's current career exploration stage, strengths, and areas for development. The results are based on the student's responses and reflect their current level of readiness for career decision-making.
              </p>
              <p>
                <strong>What this report does NOT mean:</strong> This is not a test of intelligence or ability. A lower score does not indicate failure or lack of potential. It simply means the student is in an earlier stage of career exploration and needs more time to develop clarity.
              </p>
              <p>
                <strong>Next steps:</strong> The roadmap provided in this report offers a clear path forward. Work with a qualified career counsellor to understand these results better and create a personalized plan. Remember, career development is a journey, not a destination.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-4">
                This assessment is designed to provide general career guidance and insights. Results are intended for informational purposes only and should not be considered as definitive career decisions or professional diagnoses. We strongly recommend consulting with a qualified career counsellor to discuss these results in detail.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </AdminLayout>
  );
}

export default AdminStudentResult;

