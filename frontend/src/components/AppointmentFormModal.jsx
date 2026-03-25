import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock } from 'lucide-react';

function AppointmentFormModal({ isOpen, onClose, onSubmit, studentData }) {
  const [formData, setFormData] = useState({
    appointment_date: '',
    appointment_time: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.appointment_date) {
      newErrors.appointment_date = 'Appointment date is required';
    } else {
      const selectedDate = new Date(formData.appointment_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.appointment_date = 'Appointment date cannot be in the past';
      }
    }

    if (!formData.appointment_time) {
      newErrors.appointment_time = 'Appointment time is required';
    } else if (formData.appointment_date) {
      // Check if date and time combination is in the past
      const appointmentDateTime = new Date(`${formData.appointment_date}T${formData.appointment_time}`);
      if (appointmentDateTime < new Date()) {
        newErrors.appointment_time = 'Appointment date and time must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        appointment_date: '',
        appointment_time: '',
        notes: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting appointment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      appointment_date: '',
      appointment_time: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 dark:from-black/90 dark:via-slate-900/90 dark:to-black/90 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl shadow-slate-900/50 dark:shadow-black/50 w-full max-w-md border border-slate-200/50 dark:border-slate-700/50"
        >
          {/* Gradient Header Background */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600"></div>

          {/* Header */}
          <div className="bg-gradient-to-b from-white/80 to-white/40 dark:from-slate-900/80 dark:to-slate-900/40 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl shadow-lg shadow-purple-500/30">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Book Appointment
              </h2>
            </div>
            <motion.button
              onClick={handleClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 rounded-xl transition-all duration-300 touch-manipulation min-w-[40px] min-h-[40px] flex items-center justify-center group overflow-hidden bg-slate-50/50 dark:bg-slate-800/50 hover:bg-gradient-to-br hover:from-red-50 hover:via-pink-50 hover:to-rose-50 dark:hover:from-red-900/30 dark:hover:via-pink-900/30 dark:hover:to-rose-900/30 border border-slate-200/50 dark:border-slate-700/50 hover:border-red-200/50 dark:hover:border-red-800/50 hover:shadow-lg hover:shadow-red-500/20"
              aria-label="Close modal"
            >
              {/* Animated background gradient on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-pink-500/10 to-purple-500/10 rounded-xl"
              ></motion.div>
              
              {/* Shine effect on hover */}
              <motion.div
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-xl"
              ></motion.div>
              
              {/* Icon with gradient effect and glow */}
              <div className="relative z-10">
                <X 
                  className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-all duration-300 group-hover:drop-shadow-lg group-hover:drop-shadow-red-500/50" 
                  strokeWidth={2.5}
                />
              </div>
              
              {/* Pulsing ring effect on hover */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1.2, opacity: 0.3 }}
                className="absolute inset-0 rounded-xl border-2 border-red-400/50 dark:border-red-500/50"
              ></motion.div>
            </motion.button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 sm:space-y-4">
            {/* Student Info Display */}
            {studentData && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative bg-gradient-to-br from-purple-50/80 via-pink-50/80 to-indigo-50/80 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-indigo-900/20 rounded-lg sm:rounded-xl p-3 sm:p-3.5 space-y-2 border border-purple-200/50 dark:border-purple-800/30 shadow-sm backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Student Information
                  </p>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 min-w-[70px]">Name:</span>
                    <span className="text-slate-800 dark:text-slate-200">{studentData.full_name || `${studentData.first_name} ${studentData.last_name}`}</span>
                  </div>
                  {studentData.school_institute_name && (
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 min-w-[70px]">College:</span>
                      <span className="text-slate-800 dark:text-slate-200">{studentData.school_institute_name}</span>
                    </div>
                  )}
                  {studentData.contact_number && (
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 min-w-[70px]">Contact:</span>
                      <span className="text-slate-800 dark:text-slate-200">{studentData.contact_number}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Date Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <div className="p-1 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-md shadow-sm">
                  <Calendar className="w-3 h-3 text-white" />
                </div>
                <span>Appointment Date</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleChange}
                  min={today}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-2.5 text-sm rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                    errors.appointment_date
                      ? 'border-red-300 dark:border-red-700/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-900/10'
                      : 'border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 bg-slate-50/50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600'
                  } focus:outline-none text-slate-900 dark:text-slate-100 touch-manipulation shadow-sm hover:shadow-md`}
                />
              </div>
              {errors.appointment_date && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.appointment_date}
                </motion.p>
              )}
            </motion.div>

            {/* Time Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <div className="p-1 bg-gradient-to-br from-pink-500 to-rose-500 rounded-md shadow-sm">
                  <Clock className="w-3 h-3 text-white" />
                </div>
                <span>Appointment Time</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  name="appointment_time"
                  value={formData.appointment_time}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-2.5 text-sm rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                    errors.appointment_time
                      ? 'border-red-300 dark:border-red-700/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-900/10'
                      : 'border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 bg-slate-50/50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600'
                  } focus:outline-none text-slate-900 dark:text-slate-100 touch-manipulation shadow-sm hover:shadow-md`}
                />
              </div>
              {errors.appointment_time && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.appointment_time}
                </motion.p>
              )}
            </motion.div>

            {/* Notes Field (Optional) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <div className="p-1 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-md shadow-sm">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <span>Additional Notes <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span></span>
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Any additional information you'd like to share with your counsellor..."
                className="w-full px-3 sm:px-4 py-2.5 text-sm rounded-lg sm:rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 resize-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm hover:shadow-md placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-3 sm:pt-3.5 border-t border-slate-200/50 dark:border-slate-700/50"
            >
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="flex-1 px-4 sm:px-5 py-2.5 sm:py-2.5 text-sm font-semibold rounded-lg sm:rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="group relative flex-1 px-4 sm:px-5 py-2.5 sm:py-2.5 text-sm font-semibold rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation min-h-[44px] overflow-hidden active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                {submitting ? (
                  <>
                    <div className="relative z-10 animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span className="relative z-10">Booking...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Book Appointment</span>
                    <svg className="relative z-10 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AppointmentFormModal;

