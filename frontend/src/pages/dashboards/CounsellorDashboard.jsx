import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { testAPI, counsellorAPI } from '../../services/api';
import RIASECProfile from '../../components/RIASECProfile';
import RIASECCareerPathways from '../../components/RIASECCareerPathways';
import RIASECDimensionCard from '../../components/RIASECDimensionCard';
import RIASECDimensionsOverview from '../../components/RIASECDimensionsOverview';
import { generatePDF } from '../../utils/pdfGenerator';
import ResultPDF from '../../components/ResultPDF';
import Footer from '../../components/Footer';

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
          return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', label: 'High Risk' };
        case 'MEDIUM':
          return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', label: 'Medium Risk' };
        case 'LOW':
          return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', label: 'Low Risk' };
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
        const interpretationScore = data.score !== undefined && data.score !== null
          ? Number(data.score)
          : (data.overall_percentage !== undefined && data.overall_percentage !== null
            ? Number(data.overall_percentage)
            : null);
        
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
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{interpretation.score || 'N/A'}%</p>
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
                    
                    {/* RIASEC Career Pathways */}
                    {riasecReport && riasecReport.dimensions && riasecReport.dimensions.length > 0 && (
                      <RIASECCareerPathways 
                        careerPathways={riasecReport.careerPathways} 
                        dimensions={riasecReport.dimensions}
                      />
                    )}
                    
                    {/* RIASEC Dimensions - Individual Cards */}
                    {riasecReport.dimensions && riasecReport.dimensions.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                          Detailed Dimension Analysis
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
const IconLogout = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const IconChevronDown = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const IconSun = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const IconMoon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

// Main Dashboard Component
function CounsellorDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]); // Store all students for stats
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    testsCompleted: 0,
    testsInProgress: 0,
    highRisk: 0
  });
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [readinessFilter, setReadinessFilter] = useState('all');
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
  const buildFilters = (search, status, readiness, risk) => {
    const filters = {};

    if (search && search.trim() !== '') {
      filters.search = search.trim();
    }

    if (status && status !== 'all') {
      filters.status = status;
    }

    if (readiness && readiness !== 'all') {
      filters.readiness = readiness;
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
      
      const filterParams = buildFilters(debouncedSearch, statusFilter, readinessFilter, riskFilter);
      console.log('🔵 Loading students with filters:', filterParams);
      
      // For stats, use max allowed limit (100), not 1000
      const limitForQuery = forStats ? 100 : pageSize;
      const response = await counsellorAPI.getStudents(pageNum, limitForQuery, filterParams);

      const studentsList = response.students || [];
      
      // Ensure each student's score is properly extracted and not using a fallback
      const studentsWithScores = studentsList.map(student => {
        // Explicitly extract score from the student object, ensuring it's tied to test_attempt_id
        const studentScore = student.score !== undefined && student.score !== null 
          ? Number(student.score) 
          : null;
        
        // Log for debugging (remove in production if needed)
        if (student.test_attempt_id && studentScore !== null) {
          console.log(`🔵 Student ${student.id} (Attempt ${student.test_attempt_id}): Score = ${studentScore}`);
        }
        
        return {
          ...student,
          score: studentScore // Ensure score is explicitly set per student
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
  }, [pageSize, debouncedSearch, statusFilter, readinessFilter, riskFilter]);

  // Load students for display
  useEffect(() => {
    loadStudents(1, false);
  }, [debouncedSearch, statusFilter, readinessFilter, riskFilter, pageSize]);

  // Load all students for stats (without filters, fetch all pages if needed)
  useEffect(() => {
    const loadStats = async () => {
      try {
        // Use max allowed limit (100) per page
        const limitPerPage = 100;
        
        // First, get the first page to know total count
        const firstPageResponse = await counsellorAPI.getStudents(1, limitPerPage, {});
        const totalRecords = firstPageResponse.pagination?.total_records || 0;
        const totalPages = firstPageResponse.pagination?.total_pages || 1;
        
        let allStudentsData = firstPageResponse.students || [];
        
        // If there are more pages, fetch them all
        if (totalPages > 1) {
          const additionalPages = [];
          for (let page = 2; page <= totalPages; page++) {
            try {
              const pageResponse = await counsellorAPI.getStudents(page, limitPerPage, {});
              if (pageResponse.students) {
                additionalPages.push(...pageResponse.students);
              }
            } catch (pageErr) {
              console.error(`Failed to load page ${page} for stats:`, pageErr);
            }
          }
          allStudentsData = [...allStudentsData, ...additionalPages];
        }
        
        console.log('🔵 Loaded students for stats:', {
          totalRecords,
          totalPages,
          studentsLoaded: allStudentsData.length
        });
        
        setAllStudents(allStudentsData);
      } catch (err) {
        console.error('Failed to load stats:', err);
        setAllStudents([]);
      }
    };
    loadStats();
  }, []);

  // Calculate stats from all students
  useEffect(() => {
    if (allStudents.length === 0) {
      setStats({
        totalAssigned: 0,
        testsCompleted: 0,
        testsInProgress: 0,
        highRisk: 0
      });
      return;
    }

    // Count total assigned students (all students returned by API)
    const totalAssigned = allStudents.length;
    
    // Count completed tests - check both test_status and has_completed_test
    const testsCompleted = allStudents.filter(s => {
      return s.test_status === 'COMPLETED' || s.has_completed_test === true;
    }).length;
    
    // Count in-progress tests - check test_status is IN_PROGRESS
    const testsInProgress = allStudents.filter(s => {
      return s.test_status === 'IN_PROGRESS';
    }).length;
    
    // Count high-risk students - check risk_level is HIGH
    const highRisk = allStudents.filter(s => {
      return s.risk_level === 'HIGH';
    }).length;

    console.log('🔵 Calculated stats:', {
      totalAssigned,
      testsCompleted,
      testsInProgress,
      highRisk,
      sampleStudent: allStudents[0] ? {
        test_status: allStudents[0].test_status,
        has_completed_test: allStudents[0].has_completed_test,
        risk_level: allStudents[0].risk_level
      } : null
    });

    setStats({
      totalAssigned,
      testsCompleted,
      testsInProgress,
      highRisk
    });
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="flex items-center justify-center flex-shrink-0"
              >
                <img 
                  src="/images/tops-logo.png" 
                  alt="TOPS TECHNOLOGIES Logo" 
                  className="h-8 sm:h-10 w-auto max-w-[150px] sm:max-w-[200px]"
                  style={{ objectFit: 'contain' }}
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = 'flex';
                    }
                  }}
                />
                <div style={{ display: 'none' }} className="flex items-center gap-2.5 flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">CP</span>
                  </div>
                  <span className="text-slate-900 dark:text-slate-100 font-semibold text-sm">Career Profiling</span>
                </div>
              </motion.div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className="p-2 sm:p-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle theme"
              >
                {isDark ? <IconSun className="w-5 h-5" /> : <IconMoon className="w-5 h-5" />}
              </motion.button>

              {/* Role Badge */}
              <span className="hidden sm:inline-flex px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                COUNSELLOR
              </span>

              {/* Profile Dropdown */}
              <div className="relative">
                <motion.button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors touch-manipulation min-w-[44px] min-h-[44px]"
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
                    {user?.full_name?.charAt(0).toUpperCase() || 'C'}
                  </div>
                  <IconChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400 hidden sm:block" />
                </motion.button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {user?.full_name || 'Counsellor'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors touch-manipulation cursor-pointer relative z-50"
                        type="button"
                      >
                        <IconLogout className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Click outside to close dropdown */}
      {profileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProfileDropdownOpen(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
            title="High-Risk Students"
            value={stats.highRisk}
            subtitle="Need immediate attention"
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
                  placeholder="Search by student name, email, or attempt ID..."
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
                  value={readinessFilter}
                  onChange={(e) => {
                    setReadinessFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="all">All Readiness</option>
                  <option value="ready">Ready</option>
                  <option value="partially_ready">Partially Ready</option>
                  <option value="not_ready">Not Ready</option>
                </select>
                <select
                  value={riskFilter}
                  onChange={(e) => {
                    setRiskFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="high">High Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="low">Low Risk</option>
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
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Attempt ID</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Test Status</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Score</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Readiness</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Risk Level</th>
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
                            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                              {student.test_attempt_id ? `#${student.test_attempt_id}` : '—'}
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
                            <StatusBadge status={student.readiness_status} type="readiness" />
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
                                View Interpretation
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
                      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Attempt ID</span>
                          <div className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100">
                            {student.test_attempt_id ? `#${student.test_attempt_id}` : '—'}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Score</span>
                          <div className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100">
                            {student.score !== null ? `${student.score}%` : '—'}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
                        <StatusBadge status={student.test_status || (isCompleted ? 'COMPLETED' : 'NOT_STARTED')} type="test_status" />
                        <StatusBadge status={student.readiness_status} type="readiness" />
                        <StatusBadge status={student.risk_level} type="risk" />
                      </div>
                      {isCompleted ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleViewInterpretation(student)}
                          className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                        >
                          View Interpretation
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
      <Footer />
    </div>
  );
}

export default CounsellorDashboard;
