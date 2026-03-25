import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { testAPI, counsellorAPI, appointmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ResultHeader from '../components/ResultHeader';
import ScoreSummary from '../components/ScoreSummary';
import ReadinessStatus from '../components/ReadinessStatus';
import KeyTakeaway from '../components/KeyTakeaway';
import CounsellorSummary from '../components/CounsellorSummary';
import CareerConfidence from '../components/CareerConfidence';
import DoNowDoLater from '../components/DoNowDoLater';
import AlertModal from '../components/AlertModal';
import Toast from '../components/Toast';
import { useAlert } from '../hooks/useAlert';
import { generatePDF } from '../utils/pdfGenerator';
import ResultPDF from '../components/ResultPDF';
import RIASECProfile from '../components/RIASECProfile';
import RIASECCareerPathways from '../components/RIASECCareerPathways';
import CareerArchetypeSection from '../components/CareerArchetypeSection';
import RIASECDimensionCard from '../components/RIASECDimensionCard';
import RIASECDimensionsOverview from '../components/RIASECDimensionsOverview';
import AppointmentFormModal from '../components/AppointmentFormModal';
import { getRiasecConfidenceForDisplay } from '../utils/careerEngine.js';

function ResultPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [interpretation, setInterpretation] = useState(null);
  const [riasecReport, setRiasecReport] = useState(null);
  const [loadingRIASEC, setLoadingRIASEC] = useState(false);
  const [riasecError, setRiasecError] = useState(null);
  const [counsellorNote, setCounsellorNote] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const reportRef = useRef(null);
  const pdfRef = useRef(null);
  const { modalState, toastState, showToast, closeToast } = useAlert();

  const riasecConfidenceDisplay = useMemo(
    () =>
      riasecReport?.dimensions?.length ? getRiasecConfidenceForDisplay(riasecReport.dimensions) : null,
    [riasecReport]
  );

  useEffect(() => {
    if (attemptId) {
      // Validate attemptId is a valid number
      const parsedAttemptId = parseInt(attemptId, 10);
      if (isNaN(parsedAttemptId)) {
        setError('Invalid test attempt ID');
        setLoading(false);
        return;
      }
      loadInterpretation();
    } else {
      setError('No test attempt ID provided');
      setLoading(false);
    }
  }, [attemptId]);

  const loadInterpretation = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Validate attemptId before making API call
      const parsedAttemptId = parseInt(attemptId, 10);
      if (isNaN(parsedAttemptId)) {
        throw new Error('Invalid test attempt ID');
      }
      
      // Store the attemptId in sessionStorage to prevent redirects
      sessionStorage.setItem('currentResultAttemptId', parsedAttemptId.toString());
      
      // Load interpretation first (this is the main content)
      const data = await testAPI.getInterpretation(parsedAttemptId);
      
      // IMPORTANT: Validate overall_percentage from API (calculated once in backend, stored in scores table)
      // Do NOT recalculate - use value directly from backend
      if (!data || typeof data.overall_percentage !== 'number') {
        throw new Error('Invalid interpretation data: missing overall_percentage');
      }
      
      if (data.overall_percentage < 0 || data.overall_percentage > 100) {
        throw new Error(`Invalid score value: ${data.overall_percentage}. Must be between 0-100.`);
      }
      
      console.log('📱 Interpretation data received:', {
        has_student_contact: !!data.student_contact_number,
        student_contact_number: data.student_contact_number,
        all_keys: Object.keys(data)
      });
      setInterpretation(data);
      
      // Extract student data for appointment form
      if (data) {
        setStudentData({
          full_name: user?.full_name || data.student_name || '',
          school_institute_name: data.student_school_institute_name || data.school_institute_name || '',
          contact_number: data.student_contact_number || data.contact_number || '',
          first_name: data.student_first_name || '',
          last_name: data.student_last_name || ''
        });
      }
      
      setLoading(false); // Show page immediately with interpretation
      
      // Load RIASEC report and counsellor note in parallel (non-blocking)
      // These will appear when ready
      Promise.all([
        // Load RIASEC report in background
        (async () => {
          try {
            setLoadingRIASEC(true);
            setRiasecError(null); // Clear previous error
            console.log('🔵 Loading RIASEC report for attempt:', attemptId);
            const riasecData = await testAPI.getRIASECReport(parseInt(attemptId));
            console.log('🔵 RIASEC report data received:', riasecData);
            if (riasecData && riasecData.report) {
              console.log('✅ Setting RIASEC report:', riasecData.report);
              setRiasecReport(riasecData.report);
            } else if (riasecData && riasecData.scores) {
              console.warn('⚠️ RIASEC scores available but report generation failed:', riasecData);
              setRiasecReport(null);
            } else {
              console.warn('⚠️ RIASEC report data structure invalid:', riasecData);
              setRiasecReport(null);
            }
          } catch (e) {
            console.error('❌ RIASEC report error:', e);
            // Log the full error for debugging
            if (e.message) {
              console.error('Error message:', e.message);
            }
            // Store the error message to display to user
            setRiasecError(e.message || 'Failed to load RIASEC report');
            // Check if it's a 400 error (scoring error) vs 500 (report generation error)
            if (e.message && e.message.includes('No answers found')) {
              console.error('⚠️ Test attempt has no RIASEC section answers (sections 5-10)');
            } else if (e.message && e.message.includes('not properly categorized')) {
              console.error('⚠️ RIASEC section questions missing categories');
            } else {
              console.error('⚠️ Unknown error loading RIASEC report');
            }
            setRiasecReport(null);
          } finally {
            setLoadingRIASEC(false);
          }
        })(),
        // Load counsellor note in background
        (async () => {
          try {
            const note = await counsellorAPI.getNote(parseInt(attemptId));
            setCounsellorNote(note);
            setNoteText(note ? note.notes : '');
          } catch (e) {
            setCounsellorNote(null);
            setNoteText('');
          }
        })()
      ]).catch(err => {
        console.error('Error loading additional data:', err);
      });
    } catch (err) {
      setError(err.message || 'Failed to load interpretation');
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    
    try {
      setDownloading(true);
      await generatePDF(pdfRef.current, user, interpretation, counsellorNote);
    } catch (err) {
      setError('Failed to generate PDF. Please try again.');
      console.error('PDF generation error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!attemptId || !noteText.trim()) return;

    try {
      setSavingNote(true);
      setError('');
      const savedNote = await counsellorAPI.saveNote(parseInt(attemptId), noteText);
      setCounsellorNote(savedNote);
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  const handleBookAppointment = async (formData) => {
    try {
      await appointmentAPI.createAppointment(formData);
      showToast('Appointment booked successfully!', 'success');
      setShowAppointmentModal(false);
    } catch (err) {
      showToast(err.message || 'Failed to book appointment', 'error');
      throw err;
    }
  };

  const isCounsellor = user?.role === 'COUNSELLOR';
  const canEditNote = isCounsellor;
  const hasNoteChanged = counsellorNote ? noteText !== counsellorNote.notes : noteText.trim() !== '';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        <Navbar />
        <div className="max-w-7xl mx-auto py-12 px-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 md:p-10 border border-slate-200/60 dark:border-slate-700">
            <div className="animate-pulse space-y-8">
              <div className="text-center space-y-4">
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto"></div>
                <div className="flex justify-center gap-3">
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-full w-32"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-full w-32"></div>
                </div>
              </div>
              <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">Loading your results...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !interpretation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-4 transition-colors duration-300">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700 max-w-md w-full text-center">
          <div className="text-red-500 dark:text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Error Loading Results</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/student')}
            className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!interpretation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 flex flex-col overflow-x-hidden">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full py-4 sm:py-6 lg:py-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        {/* Result Header */}
        <ResultHeader
          user={user}
          interpretation={interpretation}
          onDownloadPDF={handleDownloadPDF}
          downloading={downloading}
        />

        {/* Sticky Download Button for Mobile */}
        <div className="fixed bottom-4 left-4 right-4 z-50 sm:hidden">
          <motion.button
            onClick={handleDownloadPDF}
            disabled={downloading}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {downloading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download PDF</span>
              </>
            )}
          </motion.button>
        </div>

        {/* PDF Component - Hidden for PDF generation */}
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
            user={user}
            riasecReport={riasecReport}
            showDiscussionForCounsellor={false}
          />
        </div>

        {/* Report Content - Visible UI */}
        <div ref={reportRef} className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-10 border border-slate-200/60 dark:border-slate-700 print:shadow-none print:border-none transition-colors duration-300 space-y-6 sm:space-y-8 overflow-x-hidden">
          {/* RIASEC Profile Section - At the very top if available */}
          {loadingRIASEC ? (
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-6 sm:p-8 mb-4 sm:mb-6">
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-600"></div>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Generating your RIASEC career profile...</p>
              </div>
            </div>
          ) : riasecReport ? (
            <>
              <RIASECProfile riasecReport={riasecReport} />
              
              {/* RIASEC Dimensions Overview - Colorful Hexagonal/Card Layout */}
              {riasecReport.dimensions && riasecReport.dimensions.length > 0 && (
                <RIASECDimensionsOverview dimensions={riasecReport.dimensions} />
              )}
              
              {/* RIASEC Dimensions - Individual Cards */}
              {riasecReport.dimensions && riasecReport.dimensions.length > 0 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6">
                    What Each Type Means For You
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
                    {riasecError.includes('rate limit') && (
                      <div className="mt-3">
                        <button
                          onClick={() => {
                            setRiasecError(null);
                            setRiasecReport(null);
                            loadInterpretation();
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Retry Now
                        </button>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                          The system will automatically retry with exponential backoff. You can also wait a few minutes and refresh the page.
                        </p>
                      </div>
                    )}
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
          {interpretation.counsellor_summary && (
            <CounsellorSummary counsellorSummary={interpretation.counsellor_summary} />
          )}

          {/* Score Summary */}
          <ScoreSummary interpretation={interpretation} />

          {/* Key Takeaway - Single Line Summary */}
          <KeyTakeaway 
            readinessStatus={interpretation.readiness_status}
            overallPercentage={interpretation.overall_percentage}
          />

          {/* Readiness Status and Risk Level */}
          <ReadinessStatus
            readinessStatus={interpretation.readiness_status}
            readinessExplanation={interpretation.readiness_explanation}
            riskLevel={interpretation.risk_level}
            riskExplanation={interpretation.risk_explanation}
            riskExplanationHuman={interpretation.risk_explanation_human}
          />

          {/* Career Confidence — RIASEC engine when dimensions exist (same as PDF), else API interpretation */}
          {((riasecConfidenceDisplay?.level && riasecConfidenceDisplay?.explanation) ||
            (interpretation.career_confidence_level && interpretation.career_confidence_explanation)) && (
            <CareerConfidence
              careerConfidenceLevel={
                riasecConfidenceDisplay?.level ?? interpretation.career_confidence_level
              }
              careerConfidenceExplanation={
                riasecConfidenceDisplay?.explanation ?? interpretation.career_confidence_explanation
              }
            />
          )}

          {/* Do Now vs Do Later */}
          {((interpretation.do_now_actions && interpretation.do_now_actions.length > 0) || 
            (interpretation.do_later_actions && interpretation.do_later_actions.length > 0)) && (
            <DoNowDoLater
              doNowActions={interpretation.do_now_actions}
              doLaterActions={interpretation.do_later_actions}
            />
          )}

          {/* Career archetype + pathways (RIASEC) */}
          {riasecReport && riasecReport.dimensions && riasecReport.dimensions.length > 0 && (
            <>
              <CareerArchetypeSection dimensions={riasecReport.dimensions} />
              <RIASECCareerPathways
                careerPathways={riasecReport.careerPathways}
                dimensions={riasecReport.dimensions}
                showDiscussionForCounsellor={false}
              />
            </>
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
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                  No counsellor notes added yet
                </p>
              </div>
            )}

            {canEditNote && (
              <div className="mt-4">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add your professional notes and insights about this student's assessment results..."
                  className="w-full px-3 sm:px-4 py-3 rounded-lg border border-purple-300 dark:border-purple-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm sm:text-base text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 min-h-[150px] resize-y"
                />
                <div className="mt-4 flex items-center justify-between">
                  {noteSaved && (
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">✓ Notes saved successfully</span>
                  )}
                  <motion.button
                    onClick={handleSaveNote}
                    disabled={savingNote || !hasNoteChanged || !noteText.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="ml-auto px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingNote ? 'Saving...' : counsellorNote ? 'Update Notes' : 'Save Notes'}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-700"
          >
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <motion.button
                onClick={handleDownloadPDF}
                disabled={downloading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base min-h-[48px] touch-manipulation"
              >
                {downloading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="whitespace-nowrap">Download PDF Report</span>
                  </>
                )}
              </motion.button>

              <motion.button
                onClick={() => setShowAppointmentModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base min-h-[48px] touch-manipulation"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="whitespace-nowrap">Book Counsellor Appointment</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Parent-Friendly Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Important Information for Parents and Students
              </h3>
              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>
                  <strong>What this report means:</strong> This report shows the student&apos;s personality type, strengths,
                  and best-fit career areas based on their answers.
                </p>
                <p>
                  <strong>What this report does NOT mean:</strong> This is not an intelligence test. A lower score does not
                  mean failure. It just means the student needs more time to explore.
                </p>
                <p>
                  <strong>Next steps:</strong> Talk to a career counsellor to understand these results better and make a plan.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-4">
                  This report gives general career guidance only. Please talk to a qualified career counsellor for detailed
                  advice.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={modalState.isOpen}
        message={modalState.message}
        type={modalState.type}
        onConfirm={modalState.onConfirm}
        onCancel={modalState.onCancel}
        showCancel={modalState.showCancel}
      />

      {/* Toast Notification */}
      <Toast
        isOpen={toastState.isOpen}
        message={toastState.message}
        type={toastState.type}
        onClose={closeToast}
      />

      {/* Appointment Form Modal */}
      <AppointmentFormModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        onSubmit={handleBookAppointment}
        studentData={studentData}
      />

      <Footer />
    </div>
  );
}

export default ResultPage;
