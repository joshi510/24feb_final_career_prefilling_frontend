import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Toast from '../../components/admin/Toast';
import AIQuestionGenerator from '../../components/admin/AIQuestionGenerator';

// Icons
const IconSearch = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const IconPlus = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const IconEdit = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const IconTrash = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const IconCheck = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const IconX = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconChevronLeft = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const IconChevronRight = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const IconFilter = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const IconSparkles = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const IconClock = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconUpload = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const IconDownload = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

// Enhanced Skeleton Loader
const SkeletonRow = () => (
  <tr className="border-b border-slate-100 dark:border-slate-800">
    <td className="px-3 sm:px-4 py-3 sm:py-4">
      <div className="h-4 w-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
    </td>
    <td className="px-3 sm:px-4 py-3 sm:py-4">
      <div className="h-4 w-8 bg-slate-100 dark:bg-slate-800 rounded animate-pulse mx-auto"></div>
    </td>
    <td className="px-3 sm:px-4 py-3 sm:py-4">
      <div className="space-y-2">
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4 animate-pulse"></div>
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2 animate-pulse"></div>
      </div>
    </td>
    <td className="px-3 sm:px-4 py-3 sm:py-4">
      <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-full w-24 animate-pulse"></div>
    </td>
    <td className="px-3 sm:px-4 py-3 sm:py-4">
      <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-20 animate-pulse"></div>
    </td>
    <td className="px-3 sm:px-4 py-3 sm:py-4">
      <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-16 animate-pulse"></div>
    </td>
    <td className="px-3 sm:px-4 py-3 sm:py-4">
      <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-full w-24 animate-pulse"></div>
    </td>
    <td className="px-3 sm:px-4 py-3 sm:py-4">
      <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-full w-20 animate-pulse"></div>
    </td>
    <td className="px-3 sm:px-4 py-3 sm:py-4">
      <div className="flex items-center justify-end gap-2">
        <div className="h-8 w-8 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
        <div className="h-8 w-8 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
        <div className="h-8 w-8 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
      </div>
    </td>
  </tr>
);

function QuestionsList() {
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const [questions, setQuestions] = useState([]);
  const [sections, setSections] = useState([]);
  const [pagination, setPagination] = useState({
    total_records: 0,
    total_pages: 0,
    current_page: 1,
    limit: 25
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [onlyPending, setOnlyPending] = useState(false);
  const [pageSize, setPageSize] = useState(25);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [focusedRowIndex, setFocusedRowIndex] = useState(-1);
  const [uploadingExcel, setUploadingExcel] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadSections();
    loadQuestions(1);
  }, []);

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Reset and reload when filters change
  useEffect(() => {
    setCurrentPage(1);
    loadQuestions(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, sectionFilter, statusFilter, typeFilter, difficultyFilter, onlyPending, pageSize]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (focusedRowIndex < 0 || !questions.length) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedRowIndex(prev => Math.min(prev + 1, questions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedRowIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && focusedRowIndex >= 0) {
        e.preventDefault();
        navigate(`/admin/questions/${questions[focusedRowIndex].id}/edit`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedRowIndex, questions, navigate]);

  const loadSections = async () => {
    try {
      const data = await adminAPI.getSections();
      setSections(data);
    } catch (err) {
      console.error('Failed to load sections:', err);
    }
  };

  const loadQuestions = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: page,
        limit: pageSize,
        search: debouncedSearchQuery || undefined,
        section_id: sectionFilter !== 'all' ? sectionFilter : undefined,
        status: onlyPending ? undefined : (statusFilter !== 'all' ? statusFilter : undefined),
        question_type: typeFilter !== 'all' ? typeFilter : undefined,
        difficulty_level: difficultyFilter !== 'all' ? difficultyFilter : undefined,
        only_pending: onlyPending ? 'true' : undefined
      };
      
      const response = await adminAPI.getQuestions(params);
      
      setQuestions(response.questions || []);
      setPagination(response.pagination || {
        total_records: 0,
        total_pages: 0,
        current_page: 1,
        limit: pageSize
      });
    } catch (err) {
      setError(err.message || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  }, [pageSize, debouncedSearchQuery, sectionFilter, statusFilter, typeFilter, difficultyFilter, onlyPending]);


  const handlePageChange = (page) => {
    const totalPages = pagination.total_pages || 1;
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    loadQuestions(page);
    setFocusedRowIndex(-1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
    loadQuestions(1);
  };

  const handleDelete = (question) => {
    setSelectedQuestion(question);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedQuestion) return;

    // Handle bulk delete (array of IDs)
    if (Array.isArray(selectedQuestion)) {
      try {
        const promises = selectedQuestion.map(id => adminAPI.deleteQuestion(id));
        await Promise.all(promises);
        
        setToast({
          visible: true,
          message: `${selectedQuestion.length} question(s) deleted successfully`,
          type: 'success'
        });
        setSelectedQuestionIds(new Set());
        setSelectedQuestion(null);
        setShowConfirmModal(false);
        loadQuestions(currentPage);
      } catch (err) {
        setToast({
          visible: true,
          message: `Failed to delete questions: ${err.message}`,
          type: 'error'
        });
      }
      return;
    }

    // Handle single delete
    try {
      await adminAPI.deleteQuestion(selectedQuestion.id);
      setToast({
        visible: true,
        message: 'Question deleted successfully',
        type: 'success'
      });
      setShowConfirmModal(false);
      setSelectedQuestion(null);
      loadQuestions(currentPage);
    } catch (err) {
      setToast({
        visible: true,
        message: `Failed to delete question: ${err.message}`,
        type: 'error'
      });
    }
  };

  const handleBulkActivate = async () => {
    if (selectedQuestionIds.size === 0) return;
    
    try {
      const questionIds = Array.from(selectedQuestionIds);
      const promises = questionIds.map(id => adminAPI.activateQuestion(id));
      await Promise.all(promises);
      
      setToast({
        visible: true,
        message: `${questionIds.length} question(s) activated successfully`,
        type: 'success'
      });
      setSelectedQuestionIds(new Set());
      loadQuestions(currentPage);
    } catch (err) {
      setToast({
        visible: true,
        message: `Failed to activate questions: ${err.message}`,
        type: 'error'
      });
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedQuestionIds.size === 0) return;
    
    try {
      const questionIds = Array.from(selectedQuestionIds);
      const promises = questionIds.map(id => adminAPI.deactivateQuestion(id));
      await Promise.all(promises);
      
      setToast({
        visible: true,
        message: `${questionIds.length} question(s) deactivated successfully`,
        type: 'success'
      });
      setSelectedQuestionIds(new Set());
      loadQuestions(currentPage);
    } catch (err) {
      setToast({
        visible: true,
        message: `Failed to deactivate questions: ${err.message}`,
        type: 'error'
      });
    }
  };

  const handleExcelUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isExcel = file.name.endsWith('.xlsx') || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const isCSV = file.name.endsWith('.csv') || file.type === 'text/csv' || file.type === 'application/vnd.ms-excel';
    
    if (!isExcel && !isCSV) {
      setToast({
        visible: true,
        message: 'Please upload a valid .xlsx or .csv file',
        type: 'error'
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setToast({
        visible: true,
        message: 'File size must be less than 10MB',
        type: 'error'
      });
      return;
    }

    setUploadingExcel(true);
    try {
      const response = await adminAPI.uploadExcelQuestions(file);
      
      setToast({
        visible: true,
        message: response.message || `Successfully uploaded ${response.summary?.inserted || 0} question(s)`,
        type: 'success'
      });

      // Show detailed summary if available
      if (response.summary) {
        console.log('Upload Summary:', response.summary);
        if (response.errors && response.errors.length > 0) {
          console.warn('Upload Errors:', response.errors);
        }
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Reload questions
      loadQuestions(currentPage);
    } catch (err) {
      setToast({
        visible: true,
        message: `Upload failed: ${err.message}`,
        type: 'error'
      });
    } finally {
      setUploadingExcel(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDownloadExcelTemplate = () => {
    try {
      // Create sample data with all 10 sections - 70 questions total (7 per section)
      const sampleData = [];
      
      // Section 1: Intelligence Test (Cognitive Reasoning) - 14 questions
      const section1Questions = [
        { question: 'What is the next number in the sequence: 2, 4, 8, 16, ?', type: 'MULTIPLE_CHOICE', difficulty: 'Medium', options: 'A) 24|B) 32|C) 28|D) 30', correct_answer: 'B', category: 'Numerical Reasoning' },
        { question: 'If all roses are flowers and some flowers are red, which statement is true?', type: 'MULTIPLE_CHOICE', difficulty: 'Hard', options: 'A) All roses are red|B) Some roses are red|C) No roses are red|D) Cannot be determined', correct_answer: 'B', category: 'Logical Reasoning' },
        { question: 'Complete the analogy: Book is to Library as Car is to ?', type: 'MULTIPLE_CHOICE', difficulty: 'Easy', options: 'A) Road|B) Garage|C) Driver|D) Engine', correct_answer: 'B', category: 'Verbal Reasoning' },
        { question: 'What pattern do you see in: Circle, Square, Triangle, Circle, ?', type: 'MULTIPLE_CHOICE', difficulty: 'Medium', options: 'A) Square|B) Circle|C) Triangle|D) Rectangle', correct_answer: 'A', category: 'Abstract Reasoning' },
        { question: 'If 3x + 5 = 20, what is the value of x?', type: 'MULTIPLE_CHOICE', difficulty: 'Easy', options: 'A) 3|B) 5|C) 7|D) 9', correct_answer: 'B', category: 'Numerical Reasoning' },
        { question: 'I can easily identify patterns in complex problems.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Cognitive Reasoning' },
        { question: 'Which word does not belong: Apple, Orange, Banana, Carrot', type: 'MULTIPLE_CHOICE', difficulty: 'Easy', options: 'A) Apple|B) Orange|C) Banana|D) Carrot', correct_answer: 'D', category: 'Verbal Reasoning' },
        { question: 'I enjoy solving puzzles and brain teasers.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Abstract Reasoning' },
        { question: 'What is 25% of 80?', type: 'MULTIPLE_CHOICE', difficulty: 'Easy', options: 'A) 15|B) 20|C) 25|D) 30', correct_answer: 'B', category: 'Numerical Reasoning' },
        { question: 'I can quickly understand complex instructions.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Logical Reasoning' },
        { question: 'If CAT is coded as 3120, how is DOG coded?', type: 'MULTIPLE_CHOICE', difficulty: 'Hard', options: 'A) 4157|B) 4156|C) 4158|D) 4159', correct_answer: 'A', category: 'Abstract Reasoning' },
        { question: 'I find it easy to analyze and break down complex information.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Cognitive Reasoning' },
        { question: 'What comes next: A, C, E, G, ?', type: 'MULTIPLE_CHOICE', difficulty: 'Easy', options: 'A) H|B) I|C) J|D) K', correct_answer: 'B', category: 'Abstract Reasoning' },
        { question: 'I can think logically and make sound decisions quickly.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Logical Reasoning' }
      ];
      section1Questions.forEach(q => {
        sampleData.push({ ...q, section: 'Section 1: Intelligence Test (Cognitive Reasoning)', status: 'approved', source: 'ADMIN' });
      });

      // Section 2: Aptitude Test - 14 questions
      const section2Questions = [
        { question: 'If a train travels 60 km/h for 2 hours, how far does it travel?', type: 'MULTIPLE_CHOICE', difficulty: 'Easy', options: 'A) 100 km|B) 120 km|C) 140 km|D) 160 km', correct_answer: 'B', category: 'Numerical Aptitude' },
        { question: 'I have strong mathematical problem-solving abilities.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Numerical Aptitude' },
        { question: 'What is the area of a rectangle with length 8cm and width 5cm?', type: 'MULTIPLE_CHOICE', difficulty: 'Easy', options: 'A) 13 cm²|B) 26 cm²|C) 40 cm²|D) 45 cm²', correct_answer: 'C', category: 'Spatial Aptitude' },
        { question: 'I can visualize objects in three dimensions easily.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Spatial Aptitude' },
        { question: 'If 5 workers can complete a task in 10 days, how many days will 10 workers take?', type: 'MULTIPLE_CHOICE', difficulty: 'Medium', options: 'A) 3 days|B) 5 days|C) 7 days|D) 10 days', correct_answer: 'B', category: 'Logical Aptitude' },
        { question: 'I excel at understanding and interpreting written information.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Verbal Aptitude' },
        { question: 'What is the missing number: 2, 6, 12, 20, 30, ?', type: 'MULTIPLE_CHOICE', difficulty: 'Medium', options: 'A) 40|B) 42|C) 44|D) 46', correct_answer: 'B', category: 'Numerical Aptitude' },
        { question: 'I can quickly identify mechanical problems and solutions.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Mechanical Aptitude' },
        { question: 'If the price of an item increases by 20% and then decreases by 20%, what is the net change?', type: 'MULTIPLE_CHOICE', difficulty: 'Hard', options: 'A) No change|B) 4% decrease|C) 4% increase|D) 20% decrease', correct_answer: 'B', category: 'Numerical Aptitude' },
        { question: 'I have good spatial awareness and can navigate directions well.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Spatial Aptitude' },
        { question: 'Which shape can be formed by folding a square in half twice?', type: 'MULTIPLE_CHOICE', difficulty: 'Medium', options: 'A) Triangle|B) Rectangle|C) Smaller square|D) Pentagon', correct_answer: 'C', category: 'Spatial Aptitude' },
        { question: 'I can understand complex technical instructions easily.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Mechanical Aptitude' },
        { question: 'What is the synonym of "abundant"?', type: 'MULTIPLE_CHOICE', difficulty: 'Easy', options: 'A) Scarce|B) Plentiful|C) Limited|D) Rare', correct_answer: 'B', category: 'Verbal Aptitude' },
        { question: 'I can solve problems by breaking them into smaller parts.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Logical Aptitude' }
      ];
      section2Questions.forEach(q => {
        sampleData.push({ ...q, section: 'Section 2: Aptitude Test', status: 'approved', source: 'ADMIN' });
      });

      // Section 3: Study Habits - 14 questions
      const section3Questions = [
        { question: 'I maintain a consistent study schedule every week.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Consistency' },
        { question: 'I can concentrate on my studies for extended periods without distraction.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Concentration' },
        { question: 'I manage my time effectively to balance study and other activities.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Time Management' },
        { question: 'I feel well-prepared before taking exams.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Exam Preparedness' },
        { question: 'I can resist distractions while studying.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Self-discipline' },
        { question: 'I review my notes regularly after classes.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Consistency' },
        { question: 'I create study plans before starting my preparation.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Time Management' },
        { question: 'I can focus on my studies even in noisy environments.', type: 'LIKERT_SCALE', difficulty: 'Hard', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Concentration' },
        { question: 'I complete my assignments well before the deadline.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Time Management' },
        { question: 'I feel confident about my exam preparation strategies.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Exam Preparedness' },
        { question: 'I stick to my study goals even when it gets difficult.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Self-discipline' },
        { question: 'I study at the same time every day.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Consistency' },
        { question: 'I can maintain focus during long study sessions.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Concentration' },
        { question: 'I have effective strategies for exam preparation.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Exam Preparedness' }
      ];
      section3Questions.forEach(q => {
        sampleData.push({ ...q, section: 'Section 3: Study Habits', status: 'approved', source: 'ADMIN' });
      });

      // Section 4: Learning Style - 14 questions
      const section4Questions = [
        { question: 'I prefer learning through visual aids and diagrams.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Visual' },
        { question: 'I learn better by listening to lectures and discussions.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Auditory' },
        { question: 'I understand concepts better when I read about them.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Reading/Writing' },
        { question: 'I learn best through hands-on activities and experiments.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Kinesthetic' },
        { question: 'Charts, graphs, and visual presentations help me understand better.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Visual' },
        { question: 'I remember information better when I hear it explained.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Auditory' },
        { question: 'Taking notes helps me retain information effectively.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Reading/Writing' },
        { question: 'I prefer learning by doing practical exercises.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Kinesthetic' },
        { question: 'I can visualize concepts in my mind easily.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Visual' },
        { question: 'I learn well from audio recordings and podcasts.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Auditory' },
        { question: 'I prefer reading textbooks over watching videos.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Reading/Writing' },
        { question: 'I understand better when I can physically manipulate objects.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Kinesthetic' },
        { question: 'Color-coding and highlighting help me study effectively.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Visual' },
        { question: 'I prefer group discussions over individual reading.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'Auditory' }
      ];
      section4Questions.forEach(q => {
        sampleData.push({ ...q, section: 'Section 4: Learning Style', status: 'approved', source: 'ADMIN' });
      });

      // Section 5: Realistic - 7 questions
      const section5Questions = [
        { question: 'I enjoy working with tools and machinery.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'R' },
        { question: 'I like working outdoors and with my hands.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'R' },
        { question: 'I enjoy building and fixing things.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'R' },
        { question: 'I prefer practical, hands-on work over theoretical work.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'R' },
        { question: 'I enjoy working with mechanical equipment.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'R' },
        { question: 'I like jobs that involve physical activity.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'R' },
        { question: 'I am good at operating machinery and equipment.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'R' }
      ];
      section5Questions.forEach(q => {
        sampleData.push({ ...q, section: 'Section 5: Realistic', status: 'approved', source: 'ADMIN' });
      });

      // Section 6: Investigative - 7 questions
      const section6Questions = [
        { question: 'I like to investigate and research new topics.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'I' },
        { question: 'I enjoy solving complex scientific problems.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'I' },
        { question: 'I am interested in understanding how things work scientifically.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'I' },
        { question: 'I enjoy analyzing data and conducting experiments.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'I' },
        { question: 'I like to explore abstract ideas and theories.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'I' },
        { question: 'I am curious about how things work and why they happen.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'I' },
        { question: 'I enjoy reading scientific journals and research papers.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'I' }
      ];
      section6Questions.forEach(q => {
        sampleData.push({ ...q, section: 'Section 6: Investigative', status: 'approved', source: 'ADMIN' });
      });

      // Section 7: Artistic - 7 questions
      const section7Questions = [
        { question: 'I enjoy creative activities like art, music, or writing.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'A' },
        { question: 'I am drawn to artistic and creative expression.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'A' },
        { question: 'I enjoy expressing myself through creative mediums.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'A' },
        { question: 'I like to create original and innovative work.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'A' },
        { question: 'I enjoy performing arts like acting, dancing, or music.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'A' },
        { question: 'I appreciate beauty and aesthetics in my work.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'A' },
        { question: 'I enjoy designing and creating visual content.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'A' }
      ];
      section7Questions.forEach(q => {
        sampleData.push({ ...q, section: 'Section 7: Artistic', status: 'approved', source: 'ADMIN' });
      });

      // Section 8: Social - 7 questions
      const section8Questions = [
        { question: 'I like helping and teaching others.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'S' },
        { question: 'I enjoy working with people and providing support.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'S' },
        { question: 'I like to help people solve their problems.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'S' },
        { question: 'I enjoy working in teams and collaborating with others.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'S' },
        { question: 'I am good at understanding and empathizing with others.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'S' },
        { question: 'I enjoy mentoring and guiding others.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'S' },
        { question: 'I like to contribute to the well-being of others.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'S' }
      ];
      section8Questions.forEach(q => {
        sampleData.push({ ...q, section: 'Section 8: Social', status: 'approved', source: 'ADMIN' });
      });

      // Section 9: Enterprising - 7 questions
      const section9Questions = [
        { question: 'I enjoy leading and managing projects.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'E' },
        { question: 'I like persuading and influencing others.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'E' },
        { question: 'I enjoy taking on leadership roles.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'E' },
        { question: 'I like to start and run my own business or projects.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'E' },
        { question: 'I enjoy sales and marketing activities.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'E' },
        { question: 'I am good at negotiating and making deals.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'E' },
        { question: 'I enjoy taking calculated risks in business.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'E' }
      ];
      section9Questions.forEach(q => {
        sampleData.push({ ...q, section: 'Section 9: Enterprising', status: 'approved', source: 'ADMIN' });
      });

      // Section 10: Conventional - 7 questions
      const section10Questions = [
        { question: 'I prefer organized and structured work environments.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'C' },
        { question: 'I prefer following established procedures and routines.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'C' },
        { question: 'I enjoy working with data and numbers in an organized way.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'C' },
        { question: 'I like to maintain accurate records and documentation.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'C' },
        { question: 'I prefer clear instructions and well-defined tasks.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'C' },
        { question: 'I enjoy administrative and clerical work.', type: 'LIKERT_SCALE', difficulty: 'Easy', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'C' },
        { question: 'I like to work in a systematic and methodical way.', type: 'LIKERT_SCALE', difficulty: 'Medium', options: 'Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree', correct_answer: '', category: 'C' }
      ];
      section10Questions.forEach(q => {
        sampleData.push({ ...q, section: 'Section 10: Conventional', status: 'approved', source: 'ADMIN' });
      });

      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // Convert data to worksheet
      const ws = XLSX.utils.json_to_sheet(sampleData);
      
      // Set column widths for better readability
      const colWidths = [
        { wch: 50 }, // question
        { wch: 45 }, // section
        { wch: 18 }, // type
        { wch: 12 }, // difficulty
        { wch: 12 }, // status
        { wch: 10 }, // source
        { wch: 60 }, // options
        { wch: 15 }, // correct_answer
        { wch: 25 }  // category
      ];
      ws['!cols'] = colWidths;
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Questions Template');
      
      // Create instructions sheet
      const instructions = [
        { Column: 'question', Description: 'The question text (REQUIRED)', Example: 'What is the capital of France?' },
        { Column: 'section', Description: 'Section name (REQUIRED). Use exact section name from: Section 1: Intelligence Test (Cognitive Reasoning), Section 2: Aptitude Test, Section 3: Study Habits, Section 4: Learning Style, Section 5: Realistic, Section 6: Investigative, Section 7: Artistic, Section 8: Social, Section 9: Enterprising, Section 10: Conventional', Example: 'Section 1: Intelligence Test (Cognitive Reasoning)' },
        { Column: 'type', Description: 'Question type (REQUIRED): MULTIPLE_CHOICE or LIKERT_SCALE', Example: 'MULTIPLE_CHOICE' },
        { Column: 'difficulty', Description: 'Difficulty level (Optional): Easy, Medium, or Hard. Default: Medium', Example: 'Medium' },
        { Column: 'status', Description: 'Status (Optional): pending, approved, rejected, or inactive. Default: approved', Example: 'approved' },
        { Column: 'source', Description: 'Source (Optional): ADMIN or AI. Default: ADMIN', Example: 'ADMIN' },
        { Column: 'options', Description: 'Options separated by | (pipe) (REQUIRED for MULTIPLE_CHOICE). For MULTIPLE_CHOICE: "A) Option 1|B) Option 2|C) Option 3|D) Option 4". For LIKERT_SCALE: "Strongly Disagree|Disagree|Neutral|Agree|Strongly Agree"', Example: 'A) London|B) Berlin|C) Paris|D) Madrid' },
        { Column: 'correct_answer', Description: 'Correct answer (REQUIRED for MULTIPLE_CHOICE: A, B, C, or D). Leave empty for LIKERT_SCALE', Example: 'C' },
        { Column: 'category', Description: 'Question category (OPTIONAL). For Sections 5-10 (RIASEC), use the corresponding code: Section 5=R, Section 6=I, Section 7=A, Section 8=S, Section 9=E, Section 10=C. For other sections, any category name', Example: 'Geography' }
      ];
      
      const wsInstructions = XLSX.utils.json_to_sheet(instructions);
      wsInstructions['!cols'] = [{ wch: 20 }, { wch: 80 }, { wch: 50 }];
      XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instructions');
      
      // Generate Excel file and download
      const fileName = 'Question_Template.xlsx';
      XLSX.writeFile(wb, fileName);
      
      setToast({
        visible: true,
        message: 'Excel template downloaded successfully!',
        type: 'success'
      });
    } catch (err) {
      console.error('Error generating Excel template:', err);
      setToast({
        visible: true,
        message: `Failed to generate template: ${err.message}`,
        type: 'error'
      });
    }
  };

  const handleBulkDelete = () => {
    if (selectedQuestionIds.size === 0) return;
    
    const questionIds = Array.from(selectedQuestionIds);
    setSelectedQuestion(questionIds);
    setShowConfirmModal(true);
  };

  const handleToggleStatus = async (question) => {
    try {
      // Ensure is_active is treated as boolean (handle 0/1 from DB)
      const isActive = question.is_active === true || question.is_active === 1 || question.is_active === '1';
      
      // Simplified: All questions can be activated/deactivated (no status check needed)
      if (isActive) {
        await adminAPI.deactivateQuestion(question.id);
        setToast({
          visible: true,
          message: 'Question deactivated successfully',
          type: 'success'
        });
      } else {
        await adminAPI.activateQuestion(question.id);
        setToast({
          visible: true,
          message: 'Question activated successfully',
          type: 'success'
        });
      }
      loadQuestions(currentPage);
    } catch (err) {
      setToast({
        visible: true,
        message: `Failed to update question status: ${err.message}`,
        type: 'error'
      });
    }
  };

  const handleBulkApprove = () => {
    // Removed - approval workflow simplified
  };


  // Handle individual question selection
  const handleSelectQuestion = (questionId) => {
    setSelectedQuestionIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  // Handle Select All checkbox - selects/deselects all currently visible questions
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      // Select all currently visible question IDs
      const visibleIds = new Set(questions.map(q => q.id));
      setSelectedQuestionIds(visibleIds);
    } else {
      // Clear selection
      setSelectedQuestionIds(new Set());
    }
  };

  // Check if all visible questions are selected
  const areAllVisibleSelected = questions.length > 0 && 
    questions.every(q => selectedQuestionIds.has(q.id));


  const getStatusBadge = (question) => {
    // Ensure is_active is treated as boolean (handle 0/1 from DB)
    const isActive = question.is_active === true || question.is_active === 1 || question.is_active === '1';
    const styles = {
      active: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      inactive: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${isActive ? styles.active : styles.inactive}`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const styles = {
      'MULTIPLE_CHOICE': 'text-blue-600 dark:text-blue-400',
      'LIKERT_SCALE': 'text-purple-600 dark:text-purple-400',
      'TEXT': 'text-slate-600 dark:text-slate-400'
    };
    
    return (
      <span className={`text-xs font-medium ${styles[type] || styles.TEXT}`}>
        {type.replace('_', ' ')}
      </span>
    );
  };

  const getDifficultyBadge = (difficulty) => {
    if (!difficulty) {
      return (
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
          Medium
        </span>
      );
    }
    
    const styles = {
      'Easy': 'text-emerald-600 dark:text-emerald-400',
      'Medium': 'text-amber-600 dark:text-amber-400',
      'Hard': 'text-rose-600 dark:text-rose-400'
    };
    
    return (
      <span className={`text-xs font-medium ${styles[difficulty] || 'text-slate-600 dark:text-slate-400'}`}>
        {difficulty}
      </span>
    );
  };

  const getSourceBadge = (source) => {
    if (source === 'AI' || source === 'ai') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
          🤖 AI Generated
        </span>
      );
    } else if (source === 'ADMIN' || source === 'admin') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          👤 Admin
        </span>
      );
    }
    // Fallback for unknown source
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
        {source || '—'}
      </span>
    );
  };

  const startRecord = pagination.total_records > 0 ? (pagination.current_page - 1) * pagination.limit + 1 : 0;
  const endRecord = Math.min(pagination.current_page * pagination.limit, pagination.total_records);

  const getPageNumbers = () => {
    const pages = [];
    const total = pagination.total_pages;
    const current = pagination.current_page;
    
    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(total);
      }
    }
    return pages;
  };

  if (error && questions.length === 0) {
    return (
      <AdminLayout>
        <Error message={error} onRetry={() => loadQuestions(currentPage)} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">Questions</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Manage and review test questions
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
              onChange={handleExcelUpload}
              className="hidden"
            />
            <motion.button
              onClick={handleDownloadExcelTemplate}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm sm:text-base font-medium transition-all hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm touch-manipulation min-h-[44px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <IconDownload className="w-4 h-4" />
              <span className="hidden sm:inline">Download Excel Template</span>
              <span className="sm:hidden">Template</span>
            </motion.button>
            <motion.button
              onClick={triggerFileInput}
              disabled={uploadingExcel}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm sm:text-base font-medium transition-all hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: uploadingExcel ? 1 : 1.02 }}
              whileTap={{ scale: uploadingExcel ? 1 : 0.98 }}
            >
              <IconUpload className="w-4 h-4" />
              {uploadingExcel ? (
                <span className="hidden sm:inline">Uploading...</span>
              ) : (
                <>
                  <span className="hidden sm:inline">Upload Question</span>
                  <span className="sm:hidden">Upload</span>
                </>
              )}
            </motion.button>
            <motion.button
              onClick={() => setShowAIGenerator(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm sm:text-base font-medium transition-all hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm touch-manipulation min-h-[44px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <IconSparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Generate with AI</span>
              <span className="sm:hidden">AI</span>
            </motion.button>
            <motion.button
              onClick={() => navigate('/admin/questions/new')}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm sm:text-base font-medium transition-all hover:bg-slate-800 dark:hover:bg-slate-100 shadow-sm touch-manipulation min-h-[44px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <IconPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Question</span>
              <span className="sm:hidden">Add</span>
            </motion.button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-3 sm:p-4">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <IconSearch className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 focus:border-transparent transition-all"
              />
            </div>

            {/* Pending Only Toggle */}
            <label className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
              <input
                type="checkbox"
                checked={onlyPending}
                onChange={(e) => setOnlyPending(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer"
              />
              <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                Show Pending Only
              </span>
            </label>

            {/* Filter Toggle */}
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-all text-xs sm:text-sm ${
                showFilters || sectionFilter !== 'all' || statusFilter !== 'all' || typeFilter !== 'all' || difficultyFilter !== 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                  : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <IconFilter className="w-4 h-4" />
              <span className="font-medium">Filters</span>
            </motion.button>
          </div>

          {/* Expandable Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-700">
                  <select
                    value={sectionFilter}
                    onChange={(e) => setSectionFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 focus:border-transparent"
                  >
                    <option value="all">All Sections</option>
                    {sections.map(section => (
                      <option key={section.id} value={section.id}>{section.name}</option>
                    ))}
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                    <option value="LIKERT_SCALE">Likert Scale</option>
                    <option value="TEXT">Text</option>
                  </select>

                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 focus:border-transparent"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bulk Action Bar */}
        {selectedQuestionIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-100">
                {selectedQuestionIds.size} question{selectedQuestionIds.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <motion.button
                onClick={handleBulkActivate}
                disabled={selectedQuestionIds.size === 0}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-emerald-600 dark:bg-emerald-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: selectedQuestionIds.size === 0 ? 1 : 1.02 }}
                whileTap={{ scale: selectedQuestionIds.size === 0 ? 1 : 0.98 }}
              >
                <IconCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Activate Selected</span>
                <span className="sm:hidden">Activate</span>
              </motion.button>
              <motion.button
                onClick={handleBulkDeactivate}
                disabled={selectedQuestionIds.size === 0}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-amber-600 dark:bg-amber-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: selectedQuestionIds.size === 0 ? 1 : 1.02 }}
                whileTap={{ scale: selectedQuestionIds.size === 0 ? 1 : 0.98 }}
              >
                <IconX className="w-4 h-4" />
                <span className="hidden sm:inline">Deactivate Selected</span>
                <span className="sm:hidden">Deactivate</span>
              </motion.button>
              <motion.button
                onClick={handleBulkDelete}
                disabled={selectedQuestionIds.size === 0}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-rose-600 dark:bg-rose-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-rose-700 dark:hover:bg-rose-600 transition-colors touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: selectedQuestionIds.size === 0 ? 1 : 1.02 }}
                whileTap={{ scale: selectedQuestionIds.size === 0 ? 1 : 0.98 }}
              >
                <IconTrash className="w-4 h-4" />
                <span className="hidden sm:inline">Delete Selected</span>
                <span className="sm:hidden">Delete</span>
              </motion.button>
              <button
                onClick={() => setSelectedQuestionIds(new Set())}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors touch-manipulation min-h-[44px]"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}

        {/* Questions Table */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table ref={tableRef} className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider w-12">
                    <input
                      type="checkbox"
                      checked={areAllVisibleSelected}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer"
                    />
                  </th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider w-12">#</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Question</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Section</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Difficulty</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Source</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <AnimatePresence>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                  ) : questions.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-3 sm:px-4 py-8 sm:py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                            <IconSearch className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
                          </div>
                          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">No questions found</p>
                          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">Try adjusting your filters or create a new question</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    questions.map((question, index) => (
                      <motion.tr
                        key={question.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${
                          focusedRowIndex === index ? 'bg-blue-50 dark:bg-blue-900/10 ring-2 ring-blue-500 dark:ring-blue-400' : ''
                        } ${
                          (question.source === 'AI' || question.source === 'ai') ? 'bg-purple-50/30 dark:bg-purple-900/5' : ''
                        }`}
                        onClick={() => setFocusedRowIndex(index)}
                        tabIndex={0}
                      >
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          <input
                            type="checkbox"
                            checked={selectedQuestionIds.has(question.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelectQuestion(question.id);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 text-blue-600 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer"
                          />
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-center text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                          {startRecord + index}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          <div className="max-w-md">
                            <div className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
                              {question.question_text}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                            {question.section?.name || '—'}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          {getTypeBadge(question.question_type)}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          {getDifficultyBadge(question.difficulty_level)}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          {getStatusBadge(question)}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          {getSourceBadge(question.source)}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          <div className="flex items-center justify-end gap-1">
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/admin/questions/${question.id}/edit`);
                              }}
                              className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Edit"
                            >
                              <IconEdit className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStatus(question);
                              }}
                              className={`p-2 rounded transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center ${
                                (question.is_active === true || question.is_active === 1 || question.is_active === '1')
                                  ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                                  : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                              }`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title={(question.is_active === true || question.is_active === 1 || question.is_active === '1') ? 'Deactivate' : 'Activate'}
                            >
                              {(question.is_active === true || question.is_active === 1 || question.is_active === '1') ? (
                                <IconX className="w-4 h-4" />
                              ) : (
                                <IconCheck className="w-4 h-4" />
                              )}
                            </motion.button>
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(question);
                              }}
                              className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Delete"
                            >
                              <IconTrash className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-slate-200 dark:divide-slate-700">
            {loading ? (
              <div className="p-4 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse space-y-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20"></div>
                      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : questions.length === 0 ? (
              <div className="px-3 sm:px-4 py-8 sm:py-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    <IconSearch className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
                  </div>
                  <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">No questions found</p>
                  <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">Try adjusting your filters or create a new question</p>
                </div>
              </div>
            ) : (
              questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`p-3 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${
                    (question.source === 'AI' || question.source === 'ai') ? 'bg-purple-50/30 dark:bg-purple-900/5' : ''
                  }`}
                >
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <input
                        type="checkbox"
                        checked={selectedQuestionIds.has(question.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectQuestion(question.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1 w-4 h-4 text-blue-600 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer flex-shrink-0"
                      />
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 w-6 text-center flex-shrink-0 mt-1">
                        {startRecord + index}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5 line-clamp-2">
                          {question.question_text}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        Section: <span className="font-medium text-slate-700 dark:text-slate-300">{question.section?.name || '—'}</span>
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      {getTypeBadge(question.question_type)}
                      <span className="text-xs text-slate-400">•</span>
                      {getDifficultyBadge(question.difficulty_level)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(question)}
                        {getSourceBadge(question.source)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <motion.button
                          onClick={() => navigate(`/admin/questions/${question.id}/edit`)}
                          className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                          whileTap={{ scale: 0.9 }}
                          title="Edit"
                        >
                          <IconEdit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleToggleStatus(question)}
                          className={`p-2 rounded transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center ${
                            (question.is_active === true || question.is_active === 1 || question.is_active === '1')
                              ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                              : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                          }`}
                          whileTap={{ scale: 0.9 }}
                          title={(question.is_active === true || question.is_active === 1 || question.is_active === '1') ? 'Deactivate' : 'Activate'}
                        >
                          {(question.is_active === true || question.is_active === 1 || question.is_active === '1') ? (
                            <IconX className="w-4 h-4" />
                          ) : (
                            <IconCheck className="w-4 h-4" />
                          )}
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(question)}
                          className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                          whileTap={{ scale: 0.9 }}
                          title="Delete"
                        >
                          <IconTrash className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>


          {/* Pagination Controls */}
          {questions.length > 0 && pagination.total_pages > 1 && (
            <div className="px-3 sm:px-4 py-2 sm:py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Showing {startRecord} to {endRecord} of {pagination.total_records} questions
                  </span>
                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
                    disabled={loading}
                  >
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      const prevPage = (pagination.current_page || 1) - 1;
                      if (prevPage >= 1) {
                        handlePageChange(prevPage);
                      }
                    }}
                    disabled={(pagination.current_page || 1) <= 1 || loading}
                    className="px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-600 touch-manipulation min-h-[36px] min-w-[70px] sm:min-w-[80px]"
                    whileHover={{ scale: (pagination.current_page || 1) <= 1 || loading ? 1 : 1.02 }}
                    whileTap={{ scale: (pagination.current_page || 1) <= 1 || loading ? 1 : 0.98 }}
                  >
                    Previous
                  </motion.button>
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 px-2">
                    Page {pagination.current_page || 1} of {pagination.total_pages || 1}
                  </span>
                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      const nextPage = (pagination.current_page || 1) + 1;
                      const totalPages = pagination.total_pages || 1;
                      if (nextPage <= totalPages) {
                        handlePageChange(nextPage);
                      }
                    }}
                    disabled={(pagination.current_page || 1) >= (pagination.total_pages || 1) || loading}
                    className="px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-600 touch-manipulation min-h-[36px] min-w-[70px] sm:min-w-[80px]"
                    whileHover={{ scale: (pagination.current_page || 1) >= (pagination.total_pages || 1) || loading ? 1 : 1.02 }}
                    whileTap={{ scale: (pagination.current_page || 1) >= (pagination.total_pages || 1) || loading ? 1 : 0.98 }}
                  >
                    Next
                  </motion.button>
                </div>
              </div>
            </div>
          )}
          
          {/* Results Count (when no pagination) */}
          {questions.length > 0 && pagination.total_pages <= 1 && (
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Showing {pagination.total_records} question{pagination.total_records !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setSelectedQuestion(null);
        }}
        onConfirm={confirmDelete}
        title={Array.isArray(selectedQuestion) ? "Delete Questions" : "Delete Question"}
        message={Array.isArray(selectedQuestion) 
          ? `Are you sure you want to delete ${selectedQuestion.length} question(s)? This will set them to Inactive status.`
          : `Are you sure you want to delete this question? This will set it to Inactive status.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />


      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />

      {/* AI Question Generator Modal */}
      {showAIGenerator && (
        <AIQuestionGenerator
          sections={sections}
          onQuestionsGenerated={() => {
            loadQuestions(currentPage);
          }}
          onClose={() => setShowAIGenerator(false)}
        />
      )}
    </AdminLayout>
  );
}

export default QuestionsList;
