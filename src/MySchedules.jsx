import React, { useState, useEffect } from 'react';
import './MySchedules.css';
import logo from './assets/planora-logo.png';
import { getUserSchedules, deleteSchedule } from './scheduleService';
import { useNavigate } from 'react-router-dom';

const MySchedules = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Load schedules on mount
  useEffect(() => {
    loadSchedules();
  }, []);

  // Filter and sort schedules when search or sort changes
  useEffect(() => {
    filterAndSortSchedules();
  }, [schedules, searchQuery, sortBy]);

  const loadSchedules = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await getUserSchedules();

      if (result.success) {
        setSchedules(result.schedules);
      } else {
        setError(result.error || 'Failed to load schedules');
      }
    } catch (err) {
      console.error('Error loading schedules:', err);
      setError('An error occurred while loading schedules');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortSchedules = () => {
    let filtered = [...schedules];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(schedule =>
        schedule.goalTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.subjects.some(subject =>
          subject.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredSchedules(filtered);
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      const result = await deleteSchedule(scheduleId);

      if (result.success) {
        // Remove from local state
        setSchedules(schedules.filter(s => s.id !== scheduleId));
        setDeleteConfirm(null);
      } else {
        setError(result.error || 'Failed to delete schedule');
      }
    } catch (err) {
      console.error('Error deleting schedule:', err);
      setError('An error occurred while deleting the schedule');
    }
  };

  const handleViewSchedule = (schedule) => {
    // Navigate to schedule detail view
    navigate(`/schedule/${schedule.id}`);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
    const currentDay = today.getDate();

    return { daysInMonth, startingDayOfWeek, isCurrentMonth, currentDay };
  };

  const previousMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1));
  };

  return (
    <div className="my-schedules-container">
      {/* Header */}
      <header className="schedules-header">
        <div className="header-left">
          <img src={logo} alt="Planora Logo" className="header-logo" />
          <h1 className="header-title">Planora</h1>
        </div>
        <nav className="header-nav">
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/my-schedules" className="nav-link active">My Schedules</a>
          <a href="/plan-generator" className="nav-link">AI Planner</a>
          <button className="profile-icon-btn" onClick={() => navigate('/settings')}>
            <div className="profile-icon"></div>
          </button>
        </nav>
      </header>

      <div className="schedules-layout">
        {/* Left Sidebar - Filters */}
        <aside className="filters-sidebar">
          <div className="filters-section">
            <h3>Filters</h3>
            <p className="filters-subtitle">Refine your schedules</p>

            {/* Sort By */}
            <div className="filter-group">
              <label>Sort by</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Date Created (Newest)</option>
                <option value="oldest">Date Created (Oldest)</option>
              </select>
            </div>

            {/* Date Range Calendar */}
            {/* <div className="filter-group">
              <label>Date Range</label>
              <div className="calendar-widget">
                <div className="calendar-header">
                  <button onClick={previousMonth} className="calendar-nav">‹</button>
                  <span className="calendar-month">
                    {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button onClick={nextMonth} className="calendar-nav">›</button>
                </div>
                <div className="calendar-grid">
                  <div className="calendar-day-header">S</div>
                  <div className="calendar-day-header">M</div>
                  <div className="calendar-day-header">T</div>
                  <div className="calendar-day-header">W</div>
                  <div className="calendar-day-header">T</div>
                  <div className="calendar-day-header">F</div>
                  <div className="calendar-day-header">S</div>
                  
                  {(() => {
                    const { daysInMonth, startingDayOfWeek, isCurrentMonth, currentDay } = getDaysInMonth(selectedMonth);
                    const days = [];
                    
                    // Empty cells before first day
                    for (let i = 0; i < startingDayOfWeek; i++) {
                      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
                    }
                    
                    // Days of the month
                    for (let day = 1; day <= daysInMonth; day++) {
                      const isToday = isCurrentMonth && day === currentDay;
                      days.push(
                        <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`}>
                          {day}
                        </div>
                      );
                    }
                    
                    return days;
                  })()}
                </div>
              </div>
            </div> */}
          </div>
        </aside>

        {/* Main Content */}
        <main className="schedules-content">
          {/* Page Header */}
          <div className="page-header">
            <div>
              <h2>My Schedules</h2>
              <p className="page-subtitle">View and manage your AI-generated schedules.</p>
            </div>
            <button className="generate-new-btn" onClick={() => navigate('/plan-generator')}>
              + Generate New Schedule
            </button>
          </div>

          {/* Search and View Toggle */}
          <div className="controls-bar">
            <div className="search-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search schedules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                List
              </button>
              <button
                className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                onClick={() => setViewMode('calendar')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Calendar
              </button>
            </div> */}
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="schedules-loading">
              <div className="loading-spinner"></div>
              <p>Loading schedules...</p>
            </div>
          )}

          {/* Schedules List */}
          {!loading && filteredSchedules.length > 0 && (
            <div className="schedules-list">
              {filteredSchedules.map((schedule) => (
                <div key={schedule.id} className="schedule-card">
                  <div className="schedule-card-header">
                    <div className="schedule-checkbox">
                      <div className="checkbox-circle"></div>
                    </div>
                    <div className="schedule-info">
                      <h3 onClick={() => handleViewSchedule(schedule)}>{schedule.goalTitle}</h3>
                      <p className="schedule-date">
                        {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
                      </p>
                      <div className="schedule-tags">
                        {schedule.subjects.map((subject, index) => (
                          <span key={index} className="tag">
                            #{subject}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="schedule-actions">
                      {/* <button
                        className="action-btn edit-btn"
                        onClick={() => handleViewSchedule(schedule)}
                        title="View/Edit"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button> */}
                      <button
                        className="action-btn delete-btn"
                        onClick={() => setDeleteConfirm(schedule.id)}
                        title="Delete"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredSchedules.length === 0 && !error && (
            <div className="empty-state">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <h3>No Schedules Found</h3>
              <p>
                {searchQuery
                  ? 'No schedules match your search. Try different keywords.'
                  : 'Start by creating your first AI-generated study schedule!'}
              </p>
              <button className="empty-state-btn" onClick={() => navigate('/plan-generator')}>
                Generate Your First Schedule
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Schedule?</h3>
            <p>Are you sure you want to delete this schedule? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="modal-btn cancel-btn" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button
                className="modal-btn delete-confirm-btn"
                onClick={() => handleDeleteSchedule(deleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySchedules;