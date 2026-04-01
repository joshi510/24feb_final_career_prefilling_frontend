import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Rocket, Sparkles, Clock, Lightbulb, User, GraduationCap, Target, BarChart3, BookOpen, TrendingUp } from 'lucide-react';
import Footer from '../components/Footer';
import CareerProfilingVideo from '../components/CareerProfilingVideo';

/**
 * Student login/register left panel:
 * - Set to a path under `public/` (e.g. '/images/auth-sidebar-bg.jpg') for a photo + tinted overlay (white text).
 * - Set to null for a soft transparent / glass look (no image).
 */
const STUDENT_AUTH_SIDEBAR_IMAGE_URL = null;

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  
  // Determine mode based on URL path
  // Root path "/" and "/register" show registration (for students)
  // "/admin/login" and "/counsellor/login" show login only
  const isRegisterMode = location.pathname === '/' || location.pathname === '/register';
  const isAdminLogin = location.pathname === '/admin/login';
  const isCounsellorLogin = location.pathname === '/counsellor/login';
  const [isRegister, setIsRegister] = useState(isRegisterMode);
  
  // Sync state with URL when route changes and clear form
  useEffect(() => {
    setIsRegister(isRegisterMode);
    // Clear form data when switching modes or when component mounts
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      contactNumber: '',
      parentContactNumber: '',
      schoolInstituteName: '',
      currentEducation: '',
      stream: '',
      familyAnnualIncome: ''
    });
    setError('');
    setLoading(false);
  }, [isRegisterMode, location.pathname]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    contactNumber: '',
    parentContactNumber: '',
    schoolInstituteName: '',
    currentEducation: '',
    stream: '',
    familyAnnualIncome: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        // Only allow registration on student paths
        if (isAdminLogin || isCounsellorLogin) {
          setError('Registration is only available for students. Please use the student registration page.');
          setLoading(false);
          return;
        }

        // Validate contact numbers are exactly 10 digits
        const contactDigits = formData.contactNumber.replace(/\D/g, '');
        const parentContactDigits = formData.parentContactNumber.replace(/\D/g, '');
        
        if (contactDigits.length !== 10) {
          setError('Contact Number must be exactly 10 digits');
          setLoading(false);
          return;
        }
        
        if (parentContactDigits.length !== 10) {
          setError("Parent's Contact Number must be exactly 10 digits");
          setLoading(false);
          return;
        }

        await register(
          formData.email,
          formData.password,
          formData.firstName,
          formData.lastName,
          formData.contactNumber,
          formData.parentContactNumber,
          formData.schoolInstituteName,
          formData.currentEducation,
          formData.stream,
          formData.familyAnnualIncome
        );
      } else {
        await login(formData.email, formData.password);
      }

      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        // Clear form data after successful authentication
        setFormData({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          contactNumber: '',
          parentContactNumber: '',
          schoolInstituteName: '',
          currentEducation: '',
          stream: '',
          familyAnnualIncome: ''
        });
        
        if (user.role === 'STUDENT') {
          navigate('/student');
        } else if (user.role === 'COUNSELLOR' || user.role === 'COUNSELOR') {
          navigate('/counsellor');
        } else if (user.role === 'ADMIN') {
          navigate('/admin');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    let value = e.target.value;
    
    // For phone number fields, only allow digits
    if (e.target.name === 'contactNumber' || e.target.name === 'parentContactNumber') {
      value = value.replace(/\D/g, '').slice(0, 10); // Only digits, max 10
    }
    
    setFormData({
      ...formData,
      [e.target.name]: value
    });
    setError('');
  };

  // Check if this is student registration/login (not admin/counsellor)
  const isStudentAuth = !isAdminLogin && !isCounsellorLogin;
  const sidebarUsesPhoto = Boolean(STUDENT_AUTH_SIDEBAR_IMAGE_URL);
  const side = {
    heading: sidebarUsesPhoto ? 'text-white' : 'text-slate-900 dark:text-slate-50',
    sub: sidebarUsesPhoto ? 'text-white/85' : 'text-slate-600 dark:text-slate-400',
    iconBox: sidebarUsesPhoto ? 'bg-white/20' : 'bg-blue-100/90 dark:bg-blue-900/50',
    icon: sidebarUsesPhoto ? 'text-white' : 'text-blue-600 dark:text-blue-300',
    sparkle: sidebarUsesPhoto ? 'text-white' : 'text-blue-500 dark:text-blue-400'
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col transition-colors duration-300">
      {/* Header - Only for student auth */}
      {isStudentAuth && (
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <img 
                  src="/images/logo-transparent.png" 
                  alt="TOPS TECHNOLOGIES Logo" 
                  className="h-10 w-auto max-w-[200px]"
                  style={{ objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              
              {/* Right Side - Login Button */}
              <div className="flex items-center gap-3">
                {/* Login Button */}
                {isRegister && (
                  <motion.button
                    onClick={() => {
                      navigate('/login');
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Login
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Two-column layout for student auth, single column for admin/counsellor */}
        {isStudentAuth ? (
          <>
            {/* Left Sidebar — optional image + overlay, or transparent glass (see STUDENT_AUTH_SIDEBAR_IMAGE_URL) */}
            <div className="order-2 lg:order-1 flex w-full lg:w-1/3 relative overflow-hidden p-4 sm:p-6 lg:p-8 flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200/70 dark:border-slate-700/60">
              {sidebarUsesPhoto ? (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${STUDENT_AUTH_SIDEBAR_IMAGE_URL})` }}
                    aria-hidden
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-blue-800/60 to-indigo-900/75 dark:from-blue-950/80 dark:via-indigo-950/70 dark:to-slate-950/80"
                    aria-hidden
                  />
                </>
              ) : (
                <div
                  className="absolute inset-0 bg-gradient-to-br from-slate-50/90 via-blue-50/35 to-indigo-100/45 dark:from-slate-900/85 dark:via-slate-900/75 dark:to-blue-950/40 backdrop-blur-md"
                  aria-hidden
                />
              )}
              <div className="relative z-10 flex flex-col justify-between flex-1 min-h-0 overflow-y-auto">
                {/* Top Section */}
                <div>
                  <div className="flex gap-2 mb-6">
                    <Sparkles className={`w-6 h-6 ${side.sparkle}`} />
                    <Sparkles className={`w-6 h-6 ${side.sparkle}`} />
                  </div>

                  <h2 className={`text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 leading-tight ${side.heading}`}>
                    Discover Your Perfect Career Match.
                  </h2>

                  <div className="w-full h-40 sm:h-56 lg:h-64 mb-6 sm:mb-8">
                    <CareerProfilingVideo />
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="hidden sm:flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${side.iconBox}`}>
                      <Lightbulb className={`w-6 h-6 ${side.icon}`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold text-lg mb-1 ${side.heading}`}>Discover Your Career Path</h3>
                      <p className={`text-sm ${side.sub}`}>
                        Comprehensive RIASEC-based personality assessment to identify your ideal career fields.
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${side.iconBox}`}>
                      <Sparkles className={`w-6 h-6 ${side.icon}`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold text-lg mb-1 ${side.heading}`}>Personalized Career Guidance</h3>
                      <p className={`text-sm ${side.sub}`}>
                        Get tailored recommendations based on your strengths, interests, and personality traits.
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${side.iconBox}`}>
                      <Target className={`w-6 h-6 ${side.icon}`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold text-lg mb-1 ${side.heading}`}>Career Field Matching</h3>
                      <p className={`text-sm ${side.sub}`}>
                        Map your personality to specific career fields using Holland&apos;s vocational theory framework.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${side.iconBox}`}>
                      <BarChart3 className={`w-6 h-6 ${side.icon}`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold text-lg mb-1 ${side.heading}`}>Detailed Performance Analysis</h3>
                      <p className={`text-sm ${side.sub}`}>
                        Receive comprehensive insights on your cognitive reasoning, aptitude, and learning style.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${side.iconBox}`}>
                      <BookOpen className={`w-6 h-6 ${side.icon}`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold text-lg mb-1 ${side.heading}`}>Professional Development</h3>
                      <p className={`text-sm ${side.sub}`}>
                        Access resources and guidance to build your career roadmap and achieve your goals.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${side.iconBox}`}>
                      <TrendingUp className={`w-6 h-6 ${side.icon}`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold text-lg mb-1 ${side.heading}`}>Track Your Progress</h3>
                      <p className={`text-sm ${side.sub}`}>
                        Monitor your assessment results and career readiness scores over time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - White Form (2/3 width) */}
            <div className="order-1 lg:order-2 flex-1 lg:w-2/3 bg-white dark:bg-slate-900 p-6 sm:p-8 lg:p-12 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl mx-auto"
              >
                {/* Mobile-only compact promo block so students still see key value quickly */}
                {isStudentAuth && (
                  <div className="lg:hidden mb-6 rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50/80 dark:bg-slate-800/60">
                    <p className={`text-sm font-semibold mb-3 ${side.heading}`}>Discover Your Perfect Career Match.</p>
                    <div className="w-full h-36 sm:h-44 rounded-lg overflow-hidden">
                      <CareerProfilingVideo />
                    </div>
                  </div>
                )}

                {/* Page Title */}
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {isRegister ? 'Complete Your Professional Profile' : 'Welcome Back'}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  {isRegister 
                    ? 'Start your career profiling journey with our comprehensive RIASEC-based assessment system.'
                    : 'Sign in to continue your career journey and view your personalized results'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  {isRegister ? (
                    <>
                      {/* Personal Information Section */}
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Personal Information</h2>
                        </div>
                        <div className="border-b border-slate-200 dark:border-slate-700 mb-6"></div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                              placeholder="Jane"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                              placeholder="Doe"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="jane.doe@university.edu"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Contact Number <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              name="contactNumber"
                              value={formData.contactNumber}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                              placeholder="1234567890"
                              pattern="[0-9]{10}"
                              required
                              minLength={10}
                              maxLength={10}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Parent's Contact <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              name="parentContactNumber"
                              value={formData.parentContactNumber}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                              placeholder="1234567890"
                              pattern="[0-9]{10}"
                              required
                              minLength={10}
                              maxLength={10}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Educational Background Section */}
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Educational Background</h2>
                        </div>
                        <div className="border-b border-slate-200 dark:border-slate-700 mb-6"></div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            School/Institute <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="schoolInstituteName"
                            value={formData.schoolInstituteName}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="School name"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Current Education <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="currentEducation"
                              value={formData.currentEducation}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                              required
                            >
                              <option value="">Select education</option>
                              <option value="10th">10th</option>
                              <option value="11th">11th</option>
                              <option value="12th">12th</option>
                              <option value="Diploma">Diploma</option>
                              <option value="Under Graduate">Under Graduate</option>
                              <option value="Post Graduate">Post Graduate</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Stream <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="stream"
                              value={formData.stream}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                              required
                            >
                              <option value="">Select stream</option>
                              <option value="Science">Science</option>
                              <option value="Commerce">Commerce</option>
                              <option value="Arts">Arts</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Annual Income <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="familyAnnualIncome"
                              value={formData.familyAnnualIncome}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                              required
                            >
                              <option value="">Select income</option>
                              <option value="<4 Lacs">&lt;4 Lacs</option>
                              <option value="4 to 6 Lacs">4 to 6 Lacs</option>
                              <option value="6 to 8 Lacs">6 to 8 Lacs</option>
                              <option value="10 to 12 Lacs">10 to 12 Lacs</option>
                              <option value="12 to 14 Lacs">12 to 14 Lacs</option>
                              <option value=">14 Lacs">&gt;14 Lacs</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      {/* Password Section */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      
                      {/* Submit Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Processing...' : 'Create Account'}
                      </motion.button>
                      
                      {/* Login Link */}
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setError('');
                            navigate('/login');
                          }}
                          className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          Already have an account? Sign in
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Login Form */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="you@example.com"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Password
                          </label>
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Processing...' : 'Sign In'}
                      </motion.button>
                      
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setError('');
                            navigate('/register');
                          }}
                          className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          Don't have an account? Sign up
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </motion.div>
            </div>
          </>
        ) : (
          /* Admin/Counsellor Login - Simple centered form */
          <div className="flex-1 flex items-center justify-center px-4 py-4 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md"
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200/60 dark:border-slate-700 p-6 sm:p-8">
                {/* Logo Section */}
                <div className="flex justify-center flex-shrink-0 mb-4">
                  <img 
                    src="/images/logo-transparent.png" 
                    alt="TOPS TECHNOLOGIES Logo" 
                    className="w-auto max-w-[220px] sm:max-w-[280px] h-12 sm:h-14"
                    style={{ objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                
                <div className="text-center flex-shrink-0 mb-4">
                  <h1 className="font-semibold text-slate-900 dark:text-slate-100 text-xl sm:text-2xl mb-1">
                    {isAdminLogin ? 'Admin Login' : 'Counsellor Login'}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                    {isAdminLogin
                      ? 'Sign in to access admin dashboard'
                      : 'Sign in to access counsellor dashboard'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-xs sm:text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 sm:py-3 text-sm sm:text-base rounded-lg font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-5"
                  >
                    {loading ? 'Processing...' : 'Sign In'}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </div>
      
      {/* Footer - Show on all student auth pages */}
      {isStudentAuth && <Footer />}
    </div>
  );
}

export default Login;

