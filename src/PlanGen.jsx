// import React, { useState } from 'react';
// import './PlanGen.css';
// import logo from './assets/planora-logo.png';
// import { generateStudyPlan } from './gemini.config';
// import { saveSchedule } from './scheduleService';
// import { useNavigate } from 'react-router-dom';

// const PlanGenerator = () => {
//   const [goalTitle, setGoalTitle] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [subjects, setSubjects] = useState([]);
//   const [subjectInput, setSubjectInput] = useState('');
//   const [studyHours, setStudyHours] = useState(15);
//   const [includeWeekends, setIncludeWeekends] = useState(true);
//   const [preferMorning, setPreferMorning] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [generatedSchedule, setGeneratedSchedule] = useState(null);
//   const [error, setError] = useState('');
//   const [planData, setPlanData] = useState(null);
//   const [saveSuccess, setSaveSuccess] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const navigate = useNavigate();
//   // Add subject to list
//   const addSubject = () => {
//     if (subjectInput.trim() && subjects.length < 10) {
//       setSubjects([...subjects, subjectInput.trim()]);
//       setSubjectInput('');
//     }
//   };

//   // Remove subject from list
//   const removeSubject = (index) => {
//     setSubjects(subjects.filter((_, i) => i !== index));
//   };

//   // Handle key press for adding subject
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       addSubject();
//     }
//   };

//   // Handle form submission
//   const handleGenerateSchedule = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSaveSuccess(false);

//     // Validate that at least one subject is added
//     if (subjects.length === 0) {
//       setError('Please add at least one subject.');
//       setLoading(false);
//       return;
//     }

//     // Prepare plan data
//     const currentPlanData = {
//       goalTitle,
//       startDate,
//       endDate,
//       subjects,
//       studyHours,
//       includeWeekends,
//       preferMorning
//     };

//     setPlanData(currentPlanData);
//     console.log('Generating schedule with:', currentPlanData);

//     try {
//       // Call Gemini AI to generate the schedule
//       const result = await generateStudyPlan(currentPlanData);

//       if (result.success) {
//         setGeneratedSchedule(result.schedule);
//         console.log('Generated Schedule:', result.schedule);
//       } else {
//         setError(result.error || 'Failed to generate schedule. Please try again.');
//       }
//     } catch (err) {
//       console.error('Error generating schedule:', err);
//       setError('An error occurred while generating the schedule.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle saving schedule to Firestore
//   const handleSaveSchedule = async () => {
//     if (!generatedSchedule || !planData) {
//       setError('No schedule to save');
//       return;
//     }

//     setSaving(true);
//     setSaveSuccess(false);
//     setError('');

//     try {
//       const result = await saveSchedule(generatedSchedule, planData);

//       if (result.success) {
//         setSaveSuccess(true);
//         setTimeout(() => setSaveSuccess(false), 3000);
//       } else {
//         setError(result.error || 'Failed to save schedule');
//       }
//     } catch (err) {
//       console.error('Error saving schedule:', err);
//       setError('An error occurred while saving the schedule.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="plan-generator-container">
//       {/* Header */}
//       <header className="plan-header">
//         <div className="header-left">
//           <img src={logo} alt="Planora Logo" className="header-logo" />
//           <h1 className="header-title">Planora</h1>
//         </div>
//         <nav className="header-nav">
//           <a onClick={() => navigate('/dashboard')} className="nav-link">Dashboard</a>
//           <button onClick={() => navigate('/settings')} className="profile-icon-btn" aria-label="Settings">
//             <div className="profile-icon"></div>
//           </button>
//         </nav>
//       </header>

//       {/* Main Content */}
//       <div className="plan-content">
//         {/* Left Section - Form */}
//         <div className="form-section">
//           <h2 className="page-title">Create Your Study Plan</h2>
//           <p className="page-subtitle">
//             Fill in the details below and let our AI generate the perfect schedule for you.
//           </p>

//           <form onSubmit={handleGenerateSchedule} className="plan-form">
//             {/* Goal Title */}
//             <div className="form-group">
//               <label htmlFor="goalTitle">Goal Title</label>
//               <input
//                 type="text"
//                 id="goalTitle"
//                 placeholder="e.g., Midterm Prep"
//                 value={goalTitle}
//                 onChange={(e) => setGoalTitle(e.target.value)}
//                 required
//               />
//             </div>

//             {/* Date Range */}
//             <div className="date-group">
//               <div className="form-group">
//                 <label htmlFor="startDate">Start Date</label>
//                 <input
//                   type="date"
//                   id="startDate"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="endDate">End Date</label>
//                 <input
//                   type="date"
//                   id="endDate"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>

//             {/* Subjects/Topics */}
//             <div className="form-group">
//               <label>Subjects / Topics</label>
//               <div className="subjects-container">
//                 {subjects.map((subject, index) => (
//                   <div key={index} className="subject-tag">
//                     {subject}
//                     <button
//                       type="button"
//                       onClick={() => removeSubject(index)}
//                       className="remove-subject"
//                       aria-label="Remove subject"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ))}
//               </div>
//               <div className="add-subject-row">
//                 <input
//                   type="text"
//                   placeholder="Enter a subject"
//                   value={subjectInput}
//                   onChange={(e) => setSubjectInput(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   className="subject-input"
//                 />
//                 <button
//                   type="button"
//                   onClick={addSubject}
//                   className="add-subject-btn"
//                   disabled={!subjectInput.trim()}
//                 >
//                   + Add Subject
//                 </button>
//               </div>
//             </div>

//             {/* Study Hours Slider */}
//             <div className="form-group">
//               <label htmlFor="studyHours">Study Hours per Week</label>
//               <div className="slider-container">
//                 <input
//                   type="range"
//                   id="studyHours"
//                   min="5"
//                   max="40"
//                   value={studyHours}
//                   onChange={(e) => setStudyHours(e.target.value)}
//                   className="slider"
//                 />
//                 <div className="slider-value">{studyHours} hrs</div>
//               </div>
//             </div>

//             {/* Toggle Options */}
//             <div className="form-group">
//               <div className="toggle-row">
//                 <label htmlFor="includeWeekends">Include Weekends</label>
//                 <label className="toggle-switch">
//                   <input
//                     type="checkbox"
//                     id="includeWeekends"
//                     checked={includeWeekends}
//                     onChange={(e) => setIncludeWeekends(e.target.checked)}
//                   />
//                   <span className="toggle-slider"></span>
//                 </label>
//               </div>
//             </div>

//             <div className="form-group">
//               <div className="toggle-row">
//                 <label htmlFor="preferMorning">Prefer Morning Sessions</label>
//                 <label className="toggle-switch">
//                   <input
//                     type="checkbox"
//                     id="preferMorning"
//                     checked={preferMorning}
//                     onChange={(e) => setPreferMorning(e.target.checked)}
//                   />
//                   <span className="toggle-slider"></span>
//                 </label>
//               </div>
//             </div>

//             {/* Generate Button */}
//             <button type="submit" className="generate-btn" disabled={loading}>
//               {loading ? (
//                 <>
//                   <span className="loading-spinner"></span>
//                   Generating...
//                 </>
//               ) : (
//                 <>
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <path d="M12 2L2 7l10 5 10-5-10-5z" />
//                     <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
//                   </svg>
//                   Generate Schedule
//                 </>
//               )}
//             </button>
//           </form>
//         </div>

//         {/* Right Section - Preview/Results */}
//         <div className="preview-section">
//           {error && (
//             <div className="error-display">
//               <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <circle cx="12" cy="12" r="10" />
//                 <line x1="12" y1="8" x2="12" y2="12" />
//                 <line x1="12" y1="16" x2="12.01" y2="16" />
//               </svg>
//               <h3>Generation Failed</h3>
//               <p>{error}</p>
//               <button onClick={() => setError('')} className="retry-btn">Try Again</button>
//             </div>
//           )}

//           {!error && generatedSchedule && (
//             <div className="schedule-display">
//               <div className="schedule-header">
//                 <h3 className="schedule-title">Your Personalized Study Plan</h3>
//                 <button 
//                   onClick={handleSaveSchedule} 
//                   className="save-schedule-btn"
//                   disabled={saving}
//                 >
//                   {saving ? (
//                     <>
//                       <span className="loading-spinner-small"></span>
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
//                         <polyline points="17 21 17 13 7 13 7 21" />
//                         <polyline points="7 3 7 8 15 8" />
//                       </svg>
//                       Save Schedule
//                     </>
//                   )}
//                 </button>
//               </div>

//               {saveSuccess && (
//                 <div className="save-success-message">
//                   ✓ Schedule saved successfully!
//                 </div>
//               )}
              
//               {generatedSchedule.parsed === false ? (
//                 <div className="schedule-content">
//                   <pre className="raw-schedule">{generatedSchedule.rawSchedule}</pre>
//                 </div>
//               ) : (
//                 <div className="schedule-content">
//                   {/* Weekly Schedule */}
//                   {generatedSchedule.weeklySchedule && (
//                     <div className="weekly-schedule">
//                       {generatedSchedule.weeklySchedule.map((day, index) => (
//                         <div key={index} className="day-card">
//                           <h4 className="day-title">{day.day}</h4>
//                           <div className="sessions">
//                             {day.sessions.map((session, sessionIndex) => (
//                               <div key={sessionIndex} className="session-item">
//                                 <div className="session-header">
//                                   <span className="session-subject">{session.subject}</span>
//                                   <span className="session-duration">{session.duration}</span>
//                                 </div>
//                                 <div className="session-time">{session.timeSlot}</div>
//                                 {session.topics && session.topics.length > 0 && (
//                                   <div className="session-topics">
//                                     {session.topics.join(", ")}
//                                   </div>
//                                 )}
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   {/* Study Tips */}
//                   {generatedSchedule.studyTips && generatedSchedule.studyTips.length > 0 && (
//                     <div className="study-tips">
//                       <h4 className="tips-title">Study Tips</h4>
//                       <ul className="tips-list">
//                         {generatedSchedule.studyTips.map((tip, index) => (
//                           <li key={index}>{tip}</li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}

//                   {/* Subject Distribution */}
//                   {generatedSchedule.subjectDistribution && (
//                     <div className="subject-distribution">
//                       <h4 className="distribution-title">Time Distribution</h4>
//                       <div className="distribution-bars">
//                         {Object.entries(generatedSchedule.subjectDistribution).map(([subject, percentage]) => (
//                           <div key={subject} className="distribution-item">
//                             <div className="distribution-label">
//                               <span>{subject}</span>
//                               <span>{percentage}</span>
//                             </div>
//                             <div className="distribution-bar">
//                               <div 
//                                 className="distribution-fill" 
//                                 style={{ width: percentage }}
//                               ></div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}

//           {!error && !generatedSchedule && (
//             <div className="empty-state">
//               <div className="calendar-icon">
//                 <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//                   <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
//                   <line x1="16" y1="2" x2="16" y2="6" />
//                   <line x1="8" y1="2" x2="8" y2="6" />
//                   <line x1="3" y1="10" x2="21" y2="10" />
//                 </svg>
//               </div>
//               <h3>Your Schedule Awaits</h3>
//               <p>Fill in your goals on the left to generate a personalized study plan with our AI.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlanGenerator;
import React, { useState } from 'react';
import './PlanGen.css';
import logo from './assets/planora-logo.png';
import { generateStudyPlan } from './gemini.config';
import { saveSchedule } from './scheduleService';
import { useNavigate } from 'react-router-dom';

const PlanGenerator = () => {
  const [customPrompt, setCustomPrompt] = useState("");
  const [goalTitle, setGoalTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [subjectInput, setSubjectInput] = useState('');
  const [studyHours, setStudyHours] = useState(15);
  const [includeWeekends, setIncludeWeekends] = useState(true);
  const [preferMorning, setPreferMorning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedSchedule, setGeneratedSchedule] = useState(null);
  const [error, setError] = useState('');
  const [planData, setPlanData] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Add subject to list
  const addSubject = () => {
    if (subjectInput.trim() && subjects.length < 10) {
      setSubjects([...subjects, subjectInput.trim()]);
      setSubjectInput('');
    }
  };

  // Remove subject from list
  const removeSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  // Handle key press for adding subject
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSubject();
    }
  };

  // Handle form submission
  const handleGenerateSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSaveSuccess(false);

    // Validate that at least one subject is added
    if (subjects.length === 0) {
      setError('Please add at least one subject.');
      setLoading(false);
      return;
    }

    // Prepare plan data
    const currentPlanData = {
      goalTitle,
      startDate,
      endDate,
      subjects,
      studyHours,
      includeWeekends,
      preferMorning,
      customPrompt: customPrompt.trim() || null
    };

    setPlanData(currentPlanData);
    console.log('Generating schedule with:', currentPlanData);

    try {
      // Call Gemini AI to generate the schedule
      const result = await generateStudyPlan(currentPlanData);

      if (result.success) {
        setGeneratedSchedule(result.schedule);
        console.log('Generated Schedule:', result.schedule);
      } else {
        setError(result.error || 'Failed to generate schedule. Please try again.');
      }
    } catch (err) {
      console.error('Error generating schedule:', err);
      setError('An error occurred while generating the schedule.');
    } finally {
      setLoading(false);
    }
  };

  // Handle saving schedule to Firestore
  const handleSaveSchedule = async () => {
    if (!generatedSchedule || !planData) {
      setError('No schedule to save');
      return;
    }

    setSaving(true);
    setSaveSuccess(false);
    setError('');

    try {
      const result = await saveSchedule(generatedSchedule, planData);

      if (result.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(result.error || 'Failed to save schedule');
      }
    } catch (err) {
      console.error('Error saving schedule:', err);
      setError('An error occurred while saving the schedule.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="plan-generator-container">
      {/* Header */}
      <header className="plan-header">
        <div className="header-left">
          <img src={logo} alt="Planora Logo" className="header-logo" />
          <h1 className="header-title">Planora</h1>
        </div>
        <nav className="header-nav">
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <button className="profile-icon-btn" aria-label="Settings" onClick={()=>navigate('/settings')}>
            <div className="profile-icon"></div>
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <div className="plan-content">
        {/* Left Section - Form */}
        <div className="form-section">
          <h2 className="page-title">Create Your Study Plan</h2>
          <p className="page-subtitle">
            Fill in the details below and let our AI generate the perfect schedule for you.
          </p>

          <form onSubmit={handleGenerateSchedule} className="plan-form">
            {/* Goal Title */}
            <div className="form-group">
              <label htmlFor="goalTitle">Goal Title</label>
              <input
                type="text"
                id="goalTitle"
                placeholder="e.g., Midterm Prep"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                required
              />
            </div>

            {/* Date Range */}
            <div className="date-group">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Subjects/Topics */}
            <div className="form-group">
              <label>Subjects / Topics</label>
              <div className="subjects-container">
                {subjects.map((subject, index) => (
                  <div key={index} className="subject-tag">
                    {subject}
                    <button
                      type="button"
                      onClick={() => removeSubject(index)}
                      className="remove-subject"
                      aria-label="Remove subject"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="add-subject-row">
                <input
                  type="text"
                  placeholder="Enter a subject"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="subject-input"
                />
                <button
                  type="button"
                  onClick={addSubject}
                  className="add-subject-btn"
                  disabled={!subjectInput.trim()}
                >
                  + Add Subject
                </button>
              </div>
            </div>

            {/* Custom Prompt / Constraints (Optional) */}
            <div className="form-group">
              <label htmlFor="customPrompt">
                Custom Instructions (Optional)
                <span className="optional-badge">Optional</span>
              </label>
              <textarea
                id="customPrompt"
                placeholder="Add any specific requirements, constraints, or preferences... (e.g., 'Focus more on practical problems', 'I have exams on Friday', 'Avoid scheduling on weekends')"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="custom-prompt-input"
                rows="4"
                maxLength="500"
              />
              <div className="char-count">
                {customPrompt.length}/500 characters
              </div>
            </div>

            {/* Study Hours Slider */}
            <div className="form-group">
              <label htmlFor="studyHours">Study Hours per Week</label>
              <div className="slider-container">
                <input
                  type="range"
                  id="studyHours"
                  min="5"
                  max="40"
                  value={studyHours}
                  onChange={(e) => setStudyHours(e.target.value)}
                  className="slider"
                />
                <div className="slider-value">{studyHours} hrs</div>
              </div>
            </div>

            {/* Toggle Options */}
            <div className="form-group">
              <div className="toggle-row">
                <label htmlFor="includeWeekends">Include Weekends</label>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    id="includeWeekends"
                    checked={includeWeekends}
                    onChange={(e) => setIncludeWeekends(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <div className="toggle-row">
                <label htmlFor="preferMorning">Prefer Morning Sessions</label>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    id="preferMorning"
                    checked={preferMorning}
                    onChange={(e) => setPreferMorning(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <button type="submit" className="generate-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Generating...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  Generate Schedule
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Section - Preview/Results */}
        <div className="preview-section">
          {error && (
            <div className="error-display">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <h3>Generation Failed</h3>
              <p>{error}</p>
              <button onClick={() => setError('')} className="retry-btn">Try Again</button>
            </div>
          )}

          {!error && generatedSchedule && (
            <div className="schedule-display">
              <div className="schedule-header">
                <h3 className="schedule-title">Your Personalized Study Plan</h3>
                <button 
                  onClick={handleSaveSchedule} 
                  className="save-schedule-btn"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="loading-spinner-small"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                      </svg>
                      Save Schedule
                    </>
                  )}
                </button>
              </div>

              {saveSuccess && (
                <div className="save-success-message">
                  ✓ Schedule saved successfully!
                </div>
              )}
              
              {generatedSchedule.parsed === false ? (
                <div className="schedule-content">
                  <pre className="raw-schedule">{generatedSchedule.rawSchedule}</pre>
                </div>
              ) : (
                <div className="schedule-content">
                  {/* Weekly Schedule */}
                  {generatedSchedule.weeklySchedule && (
                    <div className="weekly-schedule">
                      {generatedSchedule.weeklySchedule.map((day, index) => (
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
                                    {session.topics.join(", ")}
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
                  {generatedSchedule.studyTips && generatedSchedule.studyTips.length > 0 && (
                    <div className="study-tips">
                      <h4 className="tips-title">Study Tips</h4>
                      <ul className="tips-list">
                        {generatedSchedule.studyTips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Subject Distribution */}
                  {generatedSchedule.subjectDistribution && (
                    <div className="subject-distribution">
                      <h4 className="distribution-title">Time Distribution</h4>
                      <div className="distribution-bars">
                        {Object.entries(generatedSchedule.subjectDistribution).map(([subject, percentage]) => (
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
                </div>
              )}
            </div>
          )}

          {!error && !generatedSchedule && (
            <div className="empty-state">
              <div className="calendar-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3>Your Schedule Awaits</h3>
              <p>Fill in your goals on the left to generate a personalized study plan with our AI.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanGenerator;