import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/Footer';

// Theme Toggle Icons
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

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col transition-colors duration-300 relative">
      {/* Theme Toggle Button - Top Right */}
      <motion.button
        onClick={toggleTheme}
        className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors z-10 shadow-lg"
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle theme"
      >
        {isDark ? <IconSun className="w-4 h-4" /> : <IconMoon className="w-4 h-4" />}
      </motion.button>

      {/* Main Content - Scrollable */}
      <div className="flex-1 flex items-start justify-center px-4 py-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl my-auto"
      >
          <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200/60 dark:border-slate-700 transition-colors duration-300 flex flex-col ${isRegister ? 'p-5 sm:p-6' : 'px-4 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4'}`}>
          {/* Logo Section */}
          <div className={`flex justify-center flex-shrink-0 ${isRegister ? 'mb-4' : 'mb-3'}`}>
            <img 
              src="/images/tops-logo.png" 
              alt="TOPS TECHNOLOGIES Logo" 
              className={`w-auto max-w-[220px] sm:max-w-[280px] ${isRegister ? 'h-12 sm:h-14' : 'h-10 sm:h-12'}`}
              style={{ objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div className={`text-center flex-shrink-0 ${isRegister ? 'mb-4' : 'mb-3'}`}>
            <h1 className={`font-semibold text-slate-900 dark:text-slate-100 ${isRegister ? 'text-xl sm:text-2xl mb-1' : 'text-lg sm:text-xl mb-0.5'}`}>
              {isRegister 
                ? 'Student Registration' 
                : isAdminLogin 
                  ? 'Admin Login' 
                  : isCounsellorLogin 
                    ? 'Counsellor Login' 
                    : 'Welcome Back'}
            </h1>
            <p className={`text-slate-600 dark:text-slate-400 ${isRegister ? 'text-xs sm:text-sm' : 'text-xs sm:text-sm'}`}>
              {isRegister 
                ? 'Start your career profiling journey' 
                : isAdminLogin
                  ? 'Sign in to access admin dashboard'
                  : isCounsellorLogin
                    ? 'Sign in to access counsellor dashboard'
                : 'Sign in to continue your assessment'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col">
            <div>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-xs sm:text-sm ${isRegister ? 'mb-3' : 'mb-2'}`}
                >
                  {error}
                </motion.div>
              )}

              <div className={isRegister ? "space-y-3" : ""}>
                {isRegister ? (
                  <>
                    {/* Three-column layout for registration on large screens */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                      >
                        <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                          placeholder="John"
                          required
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3, delay: 0.05 }}
                      >
                        <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                          placeholder="Doe"
                          required
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Contact Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="contactNumber"
                          value={formData.contactNumber}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                          placeholder="1234567890"
                          pattern="[0-9]{10}"
                          required
                          minLength={10}
                          maxLength={10}
                        />
                      </motion.div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3, delay: 0.15 }}
                      >
                        <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Parent's Contact <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="parentContactNumber"
                          value={formData.parentContactNumber}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                          placeholder="1234567890"
                          pattern="[0-9]{10}"
                          required
                          minLength={10}
                          maxLength={10}
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                          placeholder="you@example.com"
                          required
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3, delay: 0.25 }}
                      >
                        <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          School/Institute <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="schoolInstituteName"
                          value={formData.schoolInstituteName}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                          placeholder="School name"
                          required
                        />
                      </motion.div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                      >
                        <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Current Education <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="currentEducation"
                          value={formData.currentEducation}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
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
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3, delay: 0.35 }}
                      >
                        <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Stream <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="stream"
                          value={formData.stream}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                          required
                        >
                          <option value="">Select stream</option>
                          <option value="Science">Science</option>
                          <option value="Commerce">Commerce</option>
                          <option value="Arts">Arts</option>
                        </select>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                      >
                        <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Annual Income <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="familyAnnualIncome"
                          value={formData.familyAnnualIncome}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
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
                      </motion.div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-2.5">
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 sm:mb-1.5">
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

                    <div className="mb-0">
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 sm:mb-1.5">
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
                    {!isRegister && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 sm:py-3 text-sm sm:text-base rounded-lg font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-5"
                        >
                          {loading ? 'Processing...' : 'Sign In'}
                        </motion.button>
                        {!isAdminLogin && !isCounsellorLogin && (
                        <div className="mt-1.5 text-center mb-0">
                          <button
                            type="button"
                            onClick={() => {
                              setError('');
                              navigate('/register');
                            }}
                            className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            Don't have an account? Sign up
                          </button>
                        </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {isRegister && (
            <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 mt-3 pt-3 space-y-2.5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 text-sm sm:text-base rounded-lg font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Create Account'}
              </motion.button>
              {/* Only show toggle link for student registration/login, not for admin/counsellor */}
              {!isAdminLogin && !isCounsellorLogin && (
              <div className="mt-2.5 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    navigate('/login');
                  }}
                  className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Already have an account? Sign in
                </button>
              </div>
              )}
            </div>
            )}
          </form>
        </div>
      </motion.div>
      </div>
      
      {/* Footer - Only show on login pages, not registration */}
      {!isRegister && <Footer />}
    </div>
  );
}

export default Login;

