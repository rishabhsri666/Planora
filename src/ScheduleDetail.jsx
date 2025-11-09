import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ScheduleDetail.css';
import logo from './assets/planora-logo.png';
import { getScheduleById } from './scheduleService';

const ScheduleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSchedule();
  }, [id]);

  const loadSchedule = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await getScheduleById(id);

      if (result.success) {
        setSchedule(result.schedule);
      } else {
        setError(result.error || 'Failed to load schedule');
      }
    } catch (err) {
      console.error('Error loading schedule:', err);
      setError('An error occurred while loading the schedule');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="schedule-detail-container">
        <div className="detail-loading">
          <div className="loading-spinner"></div>
          <p>Loading schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="schedule-detail-container">
        <div className="detail-error">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h3>Error Loading Schedule</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/my-schedules')} className="back-btn">
            Back to My Schedules
          </button>
        </div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="schedule-detail-container">
        <div className="detail-error">
          <h3>Schedule Not Found</h3>
          <button onClick={() => navigate('/my-schedules')} className="back-btn">
            Back to My Schedules
          </button>
        </div>
      </div>
    );
  }

  const scheduleData = schedule.schedule;

  return (
    <div className="schedule-detail-container">
      {/* Header */}
      <header className="detail-header">
        <div className="header-left">
          <img src={logo} alt="Planora Logo" className="header-logo" />
          <h1 className="header-title">Planora</h1>
        </div>
        <nav className="header-nav">
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/my-schedules" className="nav-link">My Schedules</a>
          <a href="/plan-generator" className="nav-link">AI Planner</a>
          <button className="profile-icon-btn" onClick={() => navigate('/settings')}>
            <div className="profile-icon"></div>
          </button>
        </nav>
      </header>

      {/* Content */}
      <div className="detail-content">
        <button onClick={() => navigate('/my-schedules')} className="back-link">
          ← Back to My Schedules
        </button>

        <div className="detail-header-section">
          <div>
            <h2>{schedule.goalTitle}</h2>
            <p className="detail-subtitle">
              {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
            </p>
          </div>
        </div>

        {/* Plan Details */}
        <div className="plan-details">
          <div className="detail-card">
            <h3>Study Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Study Hours per Week</span>
                <span className="detail-value">{schedule.studyHours} hours</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Include Weekends</span>
                <span className="detail-value">{schedule.includeWeekends ? 'Yes' : 'No'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Prefer Morning Sessions</span>
                <span className="detail-value">{schedule.preferMorning ? 'Yes' : 'No'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Created On</span>
                <span className="detail-value">{formatDate(schedule.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3>Subjects</h3>
            <div className="subjects-list">
              {schedule.subjects.map((subject, index) => (
                <span key={index} className="subject-badge">
                  {subject}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Generated Schedule */}
        <div className="generated-schedule">
          <h3>Your Study Schedule</h3>

          {scheduleData && scheduleData.parsed !== false ? (
            <>
              {/* Weekly Schedule */}
              {scheduleData.weeklySchedule && (
                <div className="weekly-schedule">
                  {scheduleData.weeklySchedule.map((day, index) => (
                    <div key={index} className="day-card">
                      <h4 className="day-title">{day.day}</h4>
                      <div className="sessions">
                        {day.sessions.map((session, sessionIndex) => (
                          <div key={sessionIndex} className="session-item">
                            <div className="session-header">
                              <span className="session-subject">{session.subject}</span>
                              <span className="session-duration">{session.duration}</span>
                            </div>
                            <div className="session-time">{session.timeSlot}</div>
                            {session.topics && session.topics.length > 0 && (
                              <div className="session-topics">
                                {session.topics.join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Study Tips */}
              {scheduleData.studyTips && scheduleData.studyTips.length > 0 && (
                <div className="study-tips">
                  <h4 className="tips-title">Study Tips</h4>
                  <ul className="tips-list">
                    {scheduleData.studyTips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Subject Distribution */}
              {scheduleData.subjectDistribution && (
                <div className="subject-distribution">
                  <h4 className="distribution-title">Time Distribution</h4>
                  <div className="distribution-bars">
                    {Object.entries(scheduleData.subjectDistribution).map(([subject, percentage]) => (
                      <div key={subject} className="distribution-item">
                        <div className="distribution-label">
                          <span>{subject}</span>
                          <span>{percentage}</span>
                        </div>
                        <div className="distribution-bar">
                          <div 
                            className="distribution-fill" 
                            style={{ width: percentage }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="raw-schedule">
              <pre>{scheduleData?.rawSchedule || 'No schedule data available'}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetail;