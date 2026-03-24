import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { testAPI, counsellorAPI } from '../../services/api';
import RIASECProfile from '../../components/RIASECProfile';
import RIASECCareerPathways from '../../components/RIASECCareerPathways';
import CareerArchetypeSection from '../../components/CareerArchetypeSection';
import RIASECDimensionCard from '../../components/RIASECDimensionCard';
import RIASECDimensionsOverview from '../../components/RIASECDimensionsOverview';
import { generatePDF } from '../../utils/pdfGenerator';
import ResultPDF from '../../components/ResultPDF';
import CounsellorLayout from '../../components/counsellor/CounsellorLayout';

// Stat Card Component
const StatCard = ({ icon, title, value, subtitle, gradient, delay = 0 }) => {
  const iconWithSize = React.isValidElement(icon) 
    ? React.cloneElement(icon, { 
        className: `${icon.props.className || ''} w-5 h-5 sm:w-6 sm:h-6`.trim()
      })
    : icon;
  
  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
      className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all ${gradient}`}
  >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-xl ${gradient.includes('from-blue') ? 'bg-blue-100 dark:bg-blue-900/30' : gradient.includes('from-purple') ? 'bg-purple-100 dark:bg-purple-900/30' : gradient.includes('from-amber') ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
          {iconWithSize}
      </div>
    </div>
    <div>
        <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">{value}</p>
        <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
      {subtitle && <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{subtitle}</p>}
    </div>
  </motion.div>
);
};

// Status Badge Component
const StatusBadge = ({ status, type = 'readiness' }) => {
  const getStatusConfig = () => {
    if (type === 'readiness') {
      switch (status) {
        case 'READY':
          return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', label: 'Ready' };
        case 'PARTIALLY READY':
          return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', label: 'Partially Ready' };
        case 'NOT READY':
          return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', label: 'Not Ready' };
        default:
          return { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-400', label: 'Pending' };
      }
    } else if (type === 'risk') {
      switch (status) {
        case 'HIGH':
          return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', label: 'Needs Guidance' };
        case 'MEDIUM':
          return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', label: 'Getting Clearer' };
        case 'LOW':
          return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', label: 'Career Clear' };
        default:
          return { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-400', label: 'Unknown' };
      }
    } else if (type === 'test_status') {
      switch (status) {
        case 'COMPLETED':
          return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', label: 'Completed' };
        case 'IN_PROGRESS':
          return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', label: 'In Progress' };
        case 'NOT_STARTED':
          return { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-400', label: 'Not Started' };
        default:
          return { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-400', label: 'Unknown' };
      }
    }
  };

  const config = getStatusConfig();
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.bg.replace('bg-', 'border-').replace('/30', '/50')}`}>
      {config.label}
    </span>
  );
};

// Interpretation Modal Component
const InterpretationModal = ({ isOpen, onClose, student, attemptId, testStatus }) => {
  const [interpretation, setInterpretation] = useState(null);
  const [note, setNote] = useState('');
  const [savedNote, setSavedNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [error, setError] = useState('');
  const [riasecReport, setRiasecReport] = useState(null);
  const [loadingRIASEC, setLoadingRIASEC] = useState(false);
  const [riasecError, setRiasecError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const pdfRef = useRef(null);

  useEffect(() => {
    if (isOpen && attemptId && testStatus === 'COMPLETED') {
      setRiasecReport(null);
      setRiasecError(null);
      setLoadingRIASEC(true);
      loadInterpretation();
    } else if (isOpen && testStatus !== 'COMPLETED') {
      setError('Test must be completed before viewing interpretation.');
      setLoading(false);
      setLoadingRIASEC(false);
    }
  }, [isOpen, attemptId, testStatus]);

  const loadInterpretation = async () => {
    if (testStatus !== 'COMPLETED') {
      setError('Test is still in progress. Please wait for completion.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Load interpretation and RIASEC report in parallel
      const [interpretationData, riasecData] = await Promise.allSettled([
        testAPI.getInterpretation(attemptId),
        testAPI.getRIASECReport(parseInt(attemptId))
      ]);
      
      // Handle interpretation data
      if (interpretationData.status === 'fulfilled') {
        const data = interpretationData.value;
        const interpretationScoreRaw =
          data.score !== undefined && data.score !== null
            ? Number(data.score)
            : data.overall_percentage !== undefined && data.overall_percentage !== null
              ? Number(data.overall_percentage)
              : null;
        const interpretationScore =
          interpretationScoreRaw !== null && Number.isFinite(interpretationScoreRaw)
            ? Math.round(interpretationScoreRaw)
            : null;

        console.log(`🔵 Interpretation for attempt ${attemptId}: Score = ${interpretationScore}`);

        setInterpretation({
          ...data,
          score: interpretationScore
        });
      } else {
        throw interpretationData.reason;
      }
      
      // Handle RIASEC report data
      if (riasecData.status === 'fulfilled' && riasecData.value) {
        console.log('🔵 RIASEC report data received:', riasecData.value);
        if (riasecData.value.report) {
          setRiasecReport(riasecData.value.report);
          setRiasecError(null);
        } else {
          setRiasecReport(null);
        }
      } else {
        console.warn('⚠️ RIASEC report not available:', riasecData.reason);
        setRiasecReport(null);
        if (riasecData.reason?.message?.includes('rate limit')) {
          setRiasecError('Gemini API rate limit exceeded. Please try again later.');
        } else {
          setRiasecError(null);
        }
      }
      
      await loadNote();
    } catch (err) {
      // User-friendly error messages
      if (err.message?.includes('completed') || err.message?.includes('not ready')) {
        setError('Test is still in progress. Interpretation will be available once the test is completed.');
      } else if (err.message?.includes('not found')) {
        setError('Interpretation not found. The test may still be processing.');
      } else {
        setError('Failed to load interpretation. Please try again later.');
      }
      console.error('Interpretation load error:', err);
    } finally {
      setLoading(false);
      setLoadingRIASEC(false);
    }
  };

  const loadNote = async () => {
    if (!attemptId) return;
    try {
      const noteData = await counsellorAPI.getNote(attemptId);
      if (noteData) {
        setSavedNote(noteData);
        setNote(noteData.notes);
      } else {
        setSavedNote(null);
        setNote('');
      }
    } catch (err) {
      // Note might not exist, that's okay
      setSavedNote(null);
      setNote('');
    }
  };

  const saveNote = async () => {
    if (!attemptId) return;
    try {
      setSavingNote(true);
      setError('');
      const noteData = await counsellorAPI.saveNote(attemptId, note);
      setSavedNote(noteData);
    } catch (err) {
      setError('Failed to save note. Please try again.');
      console.error('Note save error:', err);
    } finally {
      setSavingNote(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current || !interpretation || !student) return;
    
    try {
      setDownloading(true);
      
      // Prepare interpretation data for PDF (ensure overall_percentage is set)
      const pdfInterpretation = {
        ...interpretation,
        overall_percentage: interpretation.score || interpretation.overall_percentage || 0
      };
      
      // Prepare counsellor note
      const counsellorNote = savedNote ? {
        notes: note,
        counsellor_name: savedNote.counsellor_name || 'Counsellor',
        created_at: savedNote.created_at,
        updated_at: savedNote.updated_at
      } : null;
      
      // Generate PDF
      await generatePDF(
        pdfRef.current,
        student,
        pdfInterpretation,
        counsellorNote,
        riasecReport
      );
    } catch (err) {
      console.error('PDF generation error:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
          interpretation={interpretation ? {
            ...interpretation,
            overall_percentage: interpretation.score || interpretation.overall_percentage || 0
          } : null}
          counsellorNote={savedNote ? {
            notes: note,
            counsellor_name: savedNote.counsellor_name || 'Counsellor',
            created_at: savedNote.created_at,
            updated_at: savedNote.updated_at
          } : null}
          user={student || {}}
          riasecReport={riasecReport}
          showDiscussionForCounsellor={true}
        />
      </div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center z-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Student Interpretation</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {student?.full_name} • Attempt #{attemptId}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {testStatus === 'COMPLETED' && interpretation && (
                <button
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {downloading ? 'Generating PDF...' : 'Download PDF'}
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {testStatus !== 'COMPLETED' ? (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Test In Progress</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  This test is still in progress. Interpretation will be available once the student completes the test.
                </p>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error && !interpretation ? (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                {error}
              </div>
            ) : interpretation ? (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Score</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {interpretation.score != null && Number.isFinite(Number(interpretation.score))
                        ? `${Math.round(Number(interpretation.score))}%`
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* RIASEC Profile Section */}
                {loadingRIASEC ? (
                  <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-8">
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <p className="text-slate-600 dark:text-slate-400">Generating RIASEC career profile...</p>
                    </div>
                  </div>
                ) : riasecReport ? (
                  <div className="space-y-6">
                    <RIASECProfile riasecReport={riasecReport} />
                    
                    {/* RIASEC Dimensions Overview - Colorful Hexagonal/Card Layout */}
                    {riasecReport.dimensions && riasecReport.dimensions.length > 0 && (
                      <RIASECDimensionsOverview dimensions={riasecReport.dimensions} />
                    )}
                    
                    {/* Career archetype + pathways */}
                    {riasecReport && riasecReport.dimensions && riasecReport.dimensions.length > 0 && (
                      <>
                        <CareerArchetypeSection dimensions={riasecReport.dimensions} />
                        <RIASECCareerPathways
                          careerPathways={riasecReport.careerPathways}
                          dimensions={riasecReport.dimensions}
                          showDiscussionForCounsellor={true}
                        />
                      </>
                    )}
                    
                    {/* RIASEC Dimensions - Individual Cards */}
                    {riasecReport.dimensions && riasecReport.dimensions.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                          What Each Type Means For You
                        </h3>
                        <div className="space-y-4">
                          {riasecReport.dimensions.map((dimension) => (
                            <RIASECDimensionCard key={dimension.code} dimension={dimension} />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Divider */}
                    <div className="border-t border-slate-200 dark:border-slate-700 my-6"></div>
                  </div>
                ) : riasecError ? (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      <strong>Note:</strong> RIASEC career profile report is not available for this test.
                      {riasecError && (
                        <span className="block mt-1">
                          <strong>Error:</strong> {riasecError}
                        </span>
                      )}
                    </p>
                  </div>
                ) : null}

                {/* AI Interpretation */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">AI Interpretation Summary</h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{interpretation.summary || 'No interpretation available.'}</p>
                </div>

                {/* Strengths & Areas for Growth */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-green-200 dark:border-green-800">
                    <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {(interpretation.strengths || []).map((strength, idx) => (
                        <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-amber-200 dark:border-amber-800">
                    <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Areas for Growth
                    </h3>
                    <ul className="space-y-2">
                      {(interpretation.weaknesses || []).map((weakness, idx) => (
                        <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5">•</span>
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Counsellor Notes */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">Your Notes</h3>
                  {savedNote && (
                    <div className="mb-3 p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-purple-200 dark:border-purple-800">
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Last updated: {new Date(savedNote.updated_at || savedNote.created_at).toLocaleString()}
                      </p>
                    </div>
                  )}
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add your professional notes and insights about this student's assessment results..."
                    className="w-full px-4 py-3 rounded-lg border border-purple-300 dark:border-purple-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 min-h-[150px] resize-y"
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={saveNote}
                      disabled={savingNote || !note.trim()}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {savingNote ? 'Saving...' : savedNote ? 'Update Notes' : 'Save Notes'}
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Icon Components

// Main Dashboard Component
function CounsellorDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]); // Store all students for stats
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false); // Separate loading state for stats
  const [stats, setStats] = useState({
    totalAssigned: 0,
    testsCompleted: 0,
    testsInProgress: 0,
    highRisk: 0
  });
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [pagination, setPagination] = useState({
    total_records: 0,
    total_pages: 1,
    current_page: 1,
    limit: 25
  });
  
  // Modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Helper function to build clean filters
  const buildFilters = (search, status, risk) => {
    const filters = {};

    if (search && search.trim() !== '') {
      filters.search = search.trim();
    }

    if (status && status !== 'all') {
      filters.status = status;
    }

    if (risk && risk !== 'all') {
      filters.risk = risk;
    }

    return filters;
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load students
  const loadStudents = useCallback(async (pageNum = 1, forStats = false) => {
    try {
      if (!forStats) {
        setLoading(true);
      }
      
      const filterParams = buildFilters(debouncedSearch, statusFilter, riskFilter);
      
      // For stats, use max allowed limit (100), not 1000
      const limitForQuery = forStats ? 100 : pageSize;
      const response = await counsellorAPI.getStudents(pageNum, limitForQuery, filterParams);

      const studentsList = response.students || [];
      
      // Ensure each student's score is properly extracted and not using a fallback
      const studentsWithScores = studentsList.map((student) => {
        // Explicitly extract score from the student object, ensuring it's tied to test_attempt_id
        const raw =
          student.score !== undefined && student.score !== null ? Number(student.score) : null;
        const studentScore =
          raw !== null && Number.isFinite(raw) ? Math.round(raw) : null;

        return {
          ...student,
          score: studentScore
        };
      });
      
      const paginationData = response.pagination || {
        total_records: studentsList.length,
        total_pages: 1,
        current_page: pageNum,
        limit: pageSize
      };

      if (forStats) {
        // Store all students for stats calculation
        setAllStudents(studentsWithScores);
      } else {
        setStudents(studentsWithScores);
        setPagination(paginationData);
        setPage(pageNum);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
      if (!forStats) {
        // Show user-friendly error
        setStudents([]);
      }
    } finally {
      if (!forStats) {
        setLoading(false);
      }
    }
  }, [pageSize, debouncedSearch, statusFilter, riskFilter]);

  // Load students for display
  useEffect(() => {
    loadStudents(1, false);
  }, [debouncedSearch, statusFilter, riskFilter, pageSize]);

  // Load stats efficiently - only fetch summary data, not all students
  const statsLoadingRef = useRef(false);
  useEffect(() => {
    const loadStats = async () => {
      // Prevent duplicate calls
      if (statsLoadingRef.current) return;
      statsLoadingRef.current = true;
      setStatsLoading(true);

      try {
        // Only fetch first page with max limit to get total count and calculate initial stats
        // This is much faster than fetching all pages
        const limitPerPage = 100;
        const firstPageResponse = await counsellorAPI.getStudents(1, limitPerPage, {});
        const totalRecords = firstPageResponse.pagination?.total_records || 0;
        const firstPageStudents = firstPageResponse.students || [];
        
        // Calculate stats from first page only (for quick display)
        let testsCompleted = 0;
        let testsInProgress = 0;
        let highRisk = 0;
        
        for (const student of firstPageStudents) {
          if (student.test_status === 'COMPLETED' || student.has_completed_test === true) {
            testsCompleted++;
          }
          if (student.test_status === 'IN_PROGRESS') {
            testsInProgress++;
          }
          if (student.risk_level === 'HIGH') {
            highRisk++;
          }
        }
        
        // Set initial stats from first page
        setStats({
          totalAssigned: totalRecords, // Use total from pagination
          testsCompleted: testsCompleted, // Will be approximate from first page
          testsInProgress: testsInProgress,
          highRisk: highRisk
        });
        
        // Only fetch additional pages if there are more and we need accurate stats
        // But do it in the background after initial render
        if (firstPageResponse.pagination?.total_pages > 1 && totalRecords <= 500) {
          // Only fetch all if reasonable number of students (<= 500)
          setTimeout(async () => {
            try {
              const totalPages = firstPageResponse.pagination?.total_pages || 1;
              const pageNumbers = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
              
              const pagePromises = pageNumbers.map(page => 
                counsellorAPI.getStudents(page, limitPerPage, {}).catch(err => {
                  console.error(`Failed to load page ${page} for stats:`, err);
                  return { students: [] };
                })
              );
              
              const pageResponses = await Promise.all(pagePromises);
              const additionalStudents = pageResponses.flatMap(response => response.students || []);
              const allStudentsData = [...firstPageStudents, ...additionalStudents];
              
              // Recalculate accurate stats
              let accurateTestsCompleted = 0;
              let accurateTestsInProgress = 0;
              let accurateHighRisk = 0;
              
              for (const student of allStudentsData) {
                if (student.test_status === 'COMPLETED' || student.has_completed_test === true) {
                  accurateTestsCompleted++;
                }
                if (student.test_status === 'IN_PROGRESS') {
                  accurateTestsInProgress++;
                }
                if (student.risk_level === 'HIGH') {
                  accurateHighRisk++;
                }
              }
              
              setStats({
                totalAssigned: allStudentsData.length,
                testsCompleted: accurateTestsCompleted,
                testsInProgress: accurateTestsInProgress,
                highRisk: accurateHighRisk
              });
              
              setAllStudents(allStudentsData);
            } catch (err) {
              console.error('Failed to load additional stats:', err);
            }
          }, 2000); // Load full stats after 2 seconds (non-blocking)
        } else {
          // For large datasets, just use first page stats
          setAllStudents(firstPageStudents);
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
        setAllStudents([]);
      } finally {
        setStatsLoading(false);
        statsLoadingRef.current = false;
      }
    };
    
    // Load stats after a delay to not block initial render (increased delay)
    const timer = setTimeout(() => {
      loadStats();
    }, 500); // Increased from 100ms to 500ms
    
    return () => clearTimeout(timer);
  }, []);

  // Stats are now calculated directly in the loadStats function
  // This useEffect is no longer needed, but keeping it for backward compatibility
  // if allStudents is updated from elsewhere
  useEffect(() => {
    // Only recalculate if allStudents changes and we have data
    // This is mainly for when filters change
    if (allStudents.length > 0) {
      let testsCompleted = 0;
      let testsInProgress = 0;
      let highRisk = 0;
      
      for (const student of allStudents) {
        if (student.test_status === 'COMPLETED' || student.has_completed_test === true) {
          testsCompleted++;
        }
        if (student.test_status === 'IN_PROGRESS') {
          testsInProgress++;
        }
        if (student.risk_level === 'HIGH') {
          highRisk++;
        }
      }

      setStats({
        totalAssigned: allStudents.length,
        testsCompleted,
        testsInProgress,
        highRisk
      });
    }
  }, [allStudents]);

  const handleViewInterpretation = (student) => {
    // Only allow viewing interpretation for completed tests
    if (!student.test_attempt_id) {
      return; // Button should be disabled, but double-check
    }

    if (student.test_status !== 'COMPLETED' && !student.has_completed_test) {
      // Should not happen if button is disabled, but show friendly message
      return;
    }

    setSelectedStudent(student);
    setShowModal(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      loadStudents(newPage, false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isTestCompleted = (student) => {
    return student.test_status === 'COMPLETED' || student.has_completed_test;
  };


  return (
    <CounsellorLayout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Welcome back, {user?.full_name || 'Counsellor'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {user?.center ? `Center: ${user.center}` : 'Career Profiling Dashboard'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            icon={
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            title="Total Assigned Students"
            value={stats.totalAssigned}
            subtitle="All students under your care"
            gradient="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
            delay={0}
          />
          <StatCard
            icon={
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Tests Completed"
            value={stats.testsCompleted}
            subtitle="Ready for interpretation"
            gradient="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
            delay={0.1}
          />
          <StatCard
            icon={
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Tests In Progress"
            value={stats.testsInProgress}
            subtitle="Currently taking test"
            gradient="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
            delay={0.2}
          />
          <StatCard
            icon={
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
            title="Needs Guidance"
            value={stats.highRisk}
            subtitle="Career clarity — needs support"
            gradient="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20"
            delay={0.3}
          />
        </div>

        {/* Student List Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Header with Search and Filters */}
          <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 mb-3 sm:mb-4">
              {/* Search */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by student name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="not_started">Not Started</option>
                </select>
                <select
                  value={riskFilter}
                  onChange={(e) => {
                    setRiskFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="all">All career clarity</option>
                  <option value="high">Needs Guidance</option>
                  <option value="medium">Getting Clearer</option>
                  <option value="low">Career Clear</option>
                </select>
              </div>
            </div>

            {/* Pagination Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <span>Showing {students.length} of {pagination.total_records} students</span>
              <div className="flex items-center gap-2">
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                  className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No students found</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Student</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Test Status</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Score</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Career Clarity</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {students.map((student, index) => {
                      const isCompleted = isTestCompleted(student);
                      return (
                        <motion.tr
                          key={student.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                        >
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs sm:text-sm mr-2 sm:mr-3">
                                {student.full_name?.charAt(0)?.toUpperCase() || 'S'}
                              </div>
                              <div>
                                <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {student.full_name || 'Unknown'}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                  {student.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <StatusBadge status={student.test_status || (isCompleted ? 'COMPLETED' : 'NOT_STARTED')} type="test_status" />
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100">
                              {student.score !== null ? `${student.score}%` : '—'}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <StatusBadge status={student.risk_level} type="risk" />
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                            {isCompleted ? (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleViewInterpretation(student)}
                                className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                              >
                                View
                              </motion.button>
                            ) : (
                              <button
                                disabled
                                className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg font-medium cursor-not-allowed"
                              >
                                Test In Progress
                              </button>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-700">
                {students.map((student, index) => {
                  const isCompleted = isTestCompleted(student);
                  return (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="p-3 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <div className="flex items-center flex-1">
                          <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base mr-2 sm:mr-3">
                            {student.full_name?.charAt(0)?.toUpperCase() || 'S'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
                              {student.full_name || 'Unknown'}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mb-2 sm:mb-3">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Score</span>
                        <div className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100">
                          {student.score !== null ? `${student.score}%` : '—'}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
                        <StatusBadge status={student.test_status || (isCompleted ? 'COMPLETED' : 'NOT_STARTED')} type="test_status" />
                        <StatusBadge status={student.risk_level} type="risk" />
                      </div>
                      {isCompleted ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleViewInterpretation(student)}
                          className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                        >
                          View
                        </motion.button>
                      ) : (
                        <button
                          disabled
                          className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg font-medium cursor-not-allowed"
                        >
                          Test In Progress
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1 || loading}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Page {pagination.current_page} of {pagination.total_pages}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= pagination.total_pages || loading}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Interpretation Modal */}
      <InterpretationModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        attemptId={selectedStudent?.test_attempt_id}
        testStatus={selectedStudent?.test_status || (selectedStudent?.has_completed_test ? 'COMPLETED' : 'IN_PROGRESS')}
      />
    </CounsellorLayout>
  );
}

export default CounsellorDashboard;
