import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { appointmentAPI } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { Calendar, Clock, User, Phone, Building, CheckCircle, XCircle, AlertCircle, Filter, ChevronDown, X, Search } from 'lucide-react';

// Skeleton Loader for Appointments Table
const AppointmentSkeletonRow = () => (
  <tr className="animate-pulse border-b border-slate-200/50 dark:border-slate-700/50">
    <td className="px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
        </div>
      </div>
    </td>
    <td className="px-4 py-3">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
    </td>
    <td className="px-4 py-3">
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-28"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
      </div>
    </td>
    <td className="px-4 py-3">
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
    </td>
  </tr>
);

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25); // Reduced default for faster loading
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState('all'); // 'all', 'today', 'week', 'month', 'custom'
  const [pagination, setPagination] = useState({
    total_records: 0,
    total_pages: 1,
    current_page: 1,
    limit: 25
  });

  // Use useCallback to prevent unnecessary re-renders
  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await appointmentAPI.getAdminAppointments(page, pageSize, statusFilter);
      setAppointments(response.appointments || []);
      setPagination(response.pagination || {
        total_records: 0,
        total_pages: 1,
        current_page: 1,
        limit: pageSize
      });
    } catch (err) {
      setError(err.message || 'Failed to load appointments');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, statusFilter]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // Group appointments by date (using filtered appointments)
  const groupedAppointments = useMemo(() => {
    if (!groupByDate) {
      return { all: filteredAppointments };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const groups = {
      today: [],
      tomorrow: [],
      thisWeek: [],
      nextWeek: [],
      later: []
    };

    filteredAppointments.forEach(appointment => {
      try {
        const appointmentDate = new Date(`${appointment.appointment_date}T${appointment.appointment_time || '00:00'}`);
        appointmentDate.setHours(0, 0, 0, 0);

        if (appointmentDate.getTime() === today.getTime()) {
          groups.today.push(appointment);
        } else if (appointmentDate.getTime() === tomorrow.getTime()) {
          groups.tomorrow.push(appointment);
        } else if (appointmentDate >= today && appointmentDate < nextWeek) {
          groups.thisWeek.push(appointment);
        } else if (appointmentDate >= nextWeek && appointmentDate < new Date(nextWeek.getTime() + 7 * 24 * 60 * 60 * 1000)) {
          groups.nextWeek.push(appointment);
        } else {
          groups.later.push(appointment);
        }
      } catch (e) {
        groups.later.push(appointment);
      }
    });

    return groups;
  }, [filteredAppointments, groupByDate]);

  // Filter appointments by search query
  const filteredAppointments = useMemo(() => {
    if (!searchQuery.trim()) return appointments;
    
    const query = searchQuery.toLowerCase();
    return appointments.filter(appointment => {
      const student = appointment.student;
      const studentProfile = student?.studentProfile;
      const name = (student?.full_name || `${studentProfile?.first_name || ''} ${studentProfile?.last_name || ''}`).toLowerCase();
      const college = (studentProfile?.school_institute_name || '').toLowerCase();
      const contact = (studentProfile?.contact_number || '').toLowerCase();
      
      return name.includes(query) || college.includes(query) || contact.includes(query);
    });
  }, [appointments, searchQuery]);

  // Render appointment row for table view
  const renderAppointmentRow = (appointment, index) => {
    const { date, time } = formatDateTime(appointment.appointment_date, appointment.appointment_time);
    const student = appointment.student;
    const studentProfile = student?.studentProfile;

    return (
      <motion.tr
        key={appointment.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: Math.min(index * 0.02, 0.3) }}
        className="group border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
              {(student?.full_name || `${studentProfile?.first_name || ''} ${studentProfile?.last_name || ''}`.trim() || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {student?.full_name || `${studentProfile?.first_name || ''} ${studentProfile?.last_name || ''}`.trim() || 'Unknown Student'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{studentProfile?.school_institute_name}</div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{studentProfile?.contact_number || '-'}</td>
        <td className="px-4 py-3">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{date}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{time}</div>
        </td>
        <td className="px-4 py-3">{getStatusBadge(appointment.status)}</td>
        <td className="px-4 py-3">
          {appointment.status === 'PENDING' && (
            <div className="flex gap-2">
              <motion.button
                onClick={() => handleStatusUpdate(appointment.id, 'CONFIRMED')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 text-xs font-semibold bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
              >
                Confirm
              </motion.button>
              <motion.button
                onClick={() => handleStatusUpdate(appointment.id, 'CANCELLED')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 text-xs font-semibold bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
              >
                Cancel
              </motion.button>
            </div>
          )}
          {appointment.status === 'CONFIRMED' && (
            <motion.button
              onClick={() => handleStatusUpdate(appointment.id, 'COMPLETED')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 text-xs font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
            >
              Complete
            </motion.button>
          )}
          {appointment.status === 'COMPLETED' && (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 italic">No actions available</span>
          )}
          {appointment.status === 'CANCELLED' && (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 italic">No actions available</span>
          )}
        </td>
      </motion.tr>
    );
  };

  // Mobile-first card rendering
  const renderAppointmentCard = (appointment, index) => {
    const { date, time } = formatDateTime(appointment.appointment_date, appointment.appointment_time);
    const student = appointment.student;
    const studentProfile = student?.studentProfile;
    const studentName =
      student?.full_name || `${studentProfile?.first_name || ''} ${studentProfile?.last_name || ''}`.trim() || 'Unknown Student';

    return (
      <motion.div
        key={appointment.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index * 0.03, 0.25) }}
        className="rounded-xl border border-slate-200/70 dark:border-slate-700/70 bg-white dark:bg-slate-800 p-4 shadow-sm"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{studentName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{studentProfile?.school_institute_name || '-'}</p>
          </div>
          <div className="flex-shrink-0">{getStatusBadge(appointment.status)}</div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:text-sm">
          <p className="text-slate-600 dark:text-slate-300"><span className="font-medium">Contact:</span> {studentProfile?.contact_number || '-'}</p>
          <p className="text-slate-600 dark:text-slate-300"><span className="font-medium">Date:</span> {date}</p>
          <p className="text-slate-600 dark:text-slate-300"><span className="font-medium">Time:</span> {time}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {appointment.status === 'PENDING' && (
            <>
              <motion.button
                onClick={() => handleStatusUpdate(appointment.id, 'CONFIRMED')}
                whileTap={{ scale: 0.98 }}
                className="flex-1 min-h-[40px] px-3 py-2 text-xs font-semibold bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
              >
                Confirm
              </motion.button>
              <motion.button
                onClick={() => handleStatusUpdate(appointment.id, 'CANCELLED')}
                whileTap={{ scale: 0.98 }}
                className="flex-1 min-h-[40px] px-3 py-2 text-xs font-semibold bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
              >
                Cancel
              </motion.button>
            </>
          )}
          {appointment.status === 'CONFIRMED' && (
            <motion.button
              onClick={() => handleStatusUpdate(appointment.id, 'COMPLETED')}
              whileTap={{ scale: 0.98 }}
              className="w-full min-h-[40px] px-3 py-2 text-xs font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
            >
              Complete
            </motion.button>
          )}
          {(appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED') && (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 italic">No actions available</span>
          )}
        </div>
      </motion.div>
    );
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await appointmentAPI.updateAppointmentStatus(appointmentId, newStatus);
      loadAppointments(); // Reload appointments
    } catch (err) {
      setError(err.message || 'Failed to update appointment status');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-300', icon: AlertCircle },
      CONFIRMED: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', icon: CheckCircle },
      CANCELLED: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300', icon: XCircle },
      COMPLETED: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300', icon: CheckCircle }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const formatDateTime = (date, time) => {
    try {
      if (!date || !time) {
        return {
          date: 'Date not set',
          time: 'Time not set'
        };
      }

      // Handle date - could be Date object, ISO string, or YYYY-MM-DD string
      let dateStr = '';
      if (date instanceof Date) {
        dateStr = date.toISOString().split('T')[0];
      } else if (typeof date === 'string') {
        // If it's an ISO string with time, extract just the date part
        if (date.includes('T')) {
          dateStr = date.split('T')[0];
        } else if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // Already in YYYY-MM-DD format
          dateStr = date;
        } else {
          // Try to parse it
          const parsed = new Date(date);
          if (!isNaN(parsed.getTime())) {
            dateStr = parsed.toISOString().split('T')[0];
          } else {
            dateStr = date;
          }
        }
      } else {
        dateStr = String(date);
      }

      // Handle time - could be TIME string (HH:MM:SS) or just HH:MM
      let timeStr = '';
      if (typeof time === 'string') {
        // Remove seconds if present (HH:MM:SS -> HH:MM)
        const timeParts = time.split(':');
        if (timeParts.length >= 2) {
          timeStr = `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}`;
        } else {
          timeStr = time;
        }
      } else {
        timeStr = String(time);
      }

      // Combine date and time
      const dateTimeStr = `${dateStr}T${timeStr}`;
      const dateObj = new Date(dateTimeStr);
      
      if (isNaN(dateObj.getTime())) {
        // Fallback: format date and time separately
        try {
          const dateOnly = new Date(dateStr + 'T00:00:00');
          if (!isNaN(dateOnly.getTime())) {
            return {
              date: dateOnly.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
              time: timeStr || 'Invalid Time'
            };
          }
        } catch (e) {
          // Ignore
        }
        
        return {
          date: dateStr || 'Invalid Date',
          time: timeStr || 'Invalid Time'
        };
      }

      return {
        date: dateObj.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
        time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      };
    } catch (error) {
      console.error('Error formatting date/time:', error, { date, time });
      return {
        date: date ? String(date).split('T')[0] : 'Invalid Date',
        time: time ? String(time).split(':').slice(0, 2).join(':') : 'Invalid Time'
      };
    }
  };


  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/30">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">Appointments</h1>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">Manage student counselling appointments</p>
            </div>
          </div>

          {/* Sticky Filters Bar */}
          <div className="sticky top-20 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-4 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Left: Search and Filters */}
              <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                {/* Search */}
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, college, contact..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-200/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none text-sm font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                    >
                      <X className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  )}
                </div>

                {/* Status Filter */}
                <div className="relative group">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                    className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border-2 border-slate-200/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none shadow-lg hover:shadow-xl hover:border-purple-300/50 dark:hover:border-purple-600/50 transition-all duration-300 font-semibold text-sm cursor-pointer min-w-[160px]"
                  >
                    <option value="all">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                  </div>
                </div>
              </div>

            </div>

            {/* Active Filters Chips */}
            {(statusFilter !== 'all' || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Filters:</span>
                {statusFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium">
                    Status: {statusFilter}
                    <button onClick={() => setStatusFilter('all')} className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3">
          {loading && appointments.length === 0 ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-slate-200/70 dark:border-slate-700/70 bg-white dark:bg-slate-800 p-4">
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
                <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            ))
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center rounded-xl border border-slate-200/70 dark:border-slate-700/70 bg-white dark:bg-slate-800 p-8">
              <p className="text-sm text-slate-600 dark:text-slate-400">No appointments found</p>
            </div>
          ) : (
            filteredAppointments.map((appointment, index) => renderAppointmentCard(appointment, index))
          )}
        </div>

        {/* Appointments List - Desktop Table */}
        <div className="hidden lg:block overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border-b border-slate-200/50 dark:border-slate-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Student</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Date & Time</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && appointments.length === 0 ? (
                // Show skeleton loaders while loading
                Array.from({ length: 5 }).map((_, i) => <AppointmentSkeletonRow key={i} />)
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-12">
                      <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <Calendar className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 font-medium">No appointments found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment, index) => {
                  return renderAppointmentRow(appointment, index);
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination with Page Size Selector */}
        {pagination.total_pages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{((page - 1) * pageSize) + 1}</span> to <span className="font-semibold text-slate-900 dark:text-slate-100">{Math.min(page * pageSize, pagination.total_records)}</span> of <span className="font-semibold text-slate-900 dark:text-slate-100">{pagination.total_records}</span> appointments
              </p>
              
              {/* Page Size Selector */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Per page:</label>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => setPage(1)}
                disabled={page === 1}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-semibold text-sm shadow-sm"
              >
                First
              </motion.button>
              <motion.button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all font-semibold shadow-sm hover:shadow-md"
              >
                Previous
              </motion.button>
              <span className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Page {page} of {pagination.total_pages}
              </span>
              <motion.button
                onClick={() => setPage(p => Math.min(pagination.total_pages, p + 1))}
                disabled={page === pagination.total_pages}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all font-semibold shadow-sm hover:shadow-md"
              >
                Next
              </motion.button>
              <motion.button
                onClick={() => setPage(pagination.total_pages)}
                disabled={page === pagination.total_pages}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-semibold text-sm shadow-sm"
              >
                Last
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default Appointments;

