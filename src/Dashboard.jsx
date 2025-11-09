// import React, { useState } from 'react';
// import './Dashboard.css';
// import MyDate from './MyDate';
// import logoo from './assets/planora-logo.png';
// import calendar from './assets/calendar.png';
// import settings from './assets/settings.png';
// import dashboard from './assets/dashboard.png';
// import fire from './assets/fire.png';
// import aiIcon from './assets/ai.png';
// import task from './assets/checklist.png';
// import ProgressBar from './ProgressBar';
// import Streak from './Streak';
// import UpcomingTasks from './UpcommingTask';
// import PlanGenerator from './PlanGen';
// import Settings from './Settings';
// import MySchedules from './MySchedules';
// // import ScheduleDetail from './ScheduleDetail';
// // import Dashboard from './Dashboard';
// import { useNavigate } from 'react-router-dom';
// import { useUserName } from './useUserName';

// function Dashboard() {
//   const navigate = useNavigate();
//   const { userName, loading } = useUserName();

//   const [date, setDate] = useState(new Date());
//   const tasks = [
//     'Submit Physics Lab Report',
//     'Study for History Midterm',
//     'Complete Math Homework 5',
//   ];
//   return (
//     <div className="dashboard-bg">
//       <aside className="sidebar">
//         <div className="logo-container">
//           <img id="app_logo" src={logoo} alt="Logo" />

//           <div className="logo">Planora</div></div>
//         <nav>
//           <a href="/dashboard" className="active"><img src={dashboard} alt='dashboard' id='iconDashboard' />Dashboard</a>
//           <a href="/my-schedules"><img src={calendar} alt='calendar' id='iconcalendar' />My Schedule</a>
//           <a href="/plan-generator"><img src={aiIcon} alt='ai' id='iconai' />AI Genarator</a>
//           {/* <a href="#"><img src={task} alt='task' id='icontask'/>My Task</a> */}
//           <a href="/settings"><img src={settings} alt='settings' id='iconsettings' />Settings</a>
//         </nav>
//       </aside>
//       <main className="main-content">
//         <h1>
//           {loading ? (
//             'Welcome back!'
//           ) : (
//             `Welcome back, ${userName}!`
//           )}
//         </h1>
//         <div className="date-text"><MyDate /></div>
//         <div className="top-cards">
//           <div className="card">
//             <UpcomingTasks tasks={tasks} />
//           </div>
//           <div className="card">
//             <div className="card-title">Study Streak <img src={fire} alt='fire' id='fire_logo' /></div>
//             <div className="card-stat"><Streak /></div>
//           </div>
//         </div>
//         <div className="main-grid">
//           <div className="overview-card">
//             <div className="section-title">Progress Overview</div>
//             <div className="progress-circle-wrap">
//               <ProgressBar progress={75} />
//             </div>
//           </div>
//           <div>
//             <div className="quick-actions-card">
//               <div className="section-title">Quick Actions</div>
//               <button className="primary-btn" onClick={() => navigate('/plan-generator')}>Plan My Week with AI</button>
//               {/* <button className="secondary-btn">Add New Task</button> */}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import MyDate from './MyDate';
import logoo from './assets/planora-logo.png';
import calendar from './assets/calendar.png';
import settings from './assets/settings.png';
import dashboard from './assets/dashboard.png';
import fire from './assets/fire.png';
import aiIcon from './assets/ai.png';
import task from './assets/checklist.png';
import ProgressBar from './ProgressBar';
import Streak from './Streak';
import UpcomingTasks from './UpcommingTask';
import { useNavigate } from 'react-router-dom';
import { useUserName } from './useUserName';
import { getUserSchedules } from './scheduleService';

function Dashboard() {
  const navigate = useNavigate();
  const { userName, loading } = useUserName();
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const [date, setDate] = useState(new Date());

  // Fetch recent schedules for upcoming tasks
  useEffect(() => {
    fetchRecentSchedules();
  }, []);

  const fetchRecentSchedules = async () => {
    setLoadingTasks(true);
    try {
      const result = await getUserSchedules();
      
      if (result.success && result.schedules.length > 0) {
        // Get the 3 most recent schedule goal titles
        const recentTitles = result.schedules
          .slice(0, 3)
          .map(schedule => schedule.goalTitle);
        
        setTasks(recentTitles);
      } else {
        // No schedules found, show default/empty message
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  return (
    <div className="dashboard-bg">
      <aside className="sidebar">
        <div className="logo-container">
          <img id="app_logo" src={logoo} alt="Logo" />
          <div className="logo">Planora</div>
        </div>
        <nav>
          <a href="/dashboard" className="active">
            <img src={dashboard} alt='dashboard' id='iconDashboard'/>
            Dashboard
          </a>
          <a href="/my-schedules">
            <img src={calendar} alt='calendar' id='iconcalendar'/>
            My Schedule
          </a>
          <a href="/plan-generator">
            <img src={aiIcon} alt='ai' id='iconai'/>
            AI Generator
          </a>
          {/* <a href="#"><img src={task} alt='task' id='icontask'/>My Task</a> */}
          <a href="/settings">
            <img src={settings} alt='settings' id='iconsettings'/>
            Settings
          </a>
        </nav>
      </aside>
      <main className="main-content">
        <h1>
          {loading ? (
            'Welcome back!'
          ) : (
            `Welcome back, ${userName}!`
          )}
        </h1>
        <div className="date-text"><MyDate /></div>
        <div className="top-cards">
          <div className="card">
            {loadingTasks ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ 
                  width: '30px', 
                  height: '30px', 
                  border: '3px solid rgba(79, 124, 255, 0.2)',
                  borderRadius: '50%',
                  borderTopColor: '#4f7cff',
                  animation: 'spin 0.8s linear infinite',
                  margin: '0 auto'
                }}></div>
              </div>
            ) : tasks.length > 0 ? (
              <UpcomingTasks tasks={tasks} />
            ) : (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '10px', fontSize: '18px' }}>No Schedules Yet</h3>
                <p style={{ color: '#a8b1d6', fontSize: '14px', marginBottom: '15px' }}>
                  Create your first AI-powered study schedule!
                </p>
                <button 
                  onClick={() => navigate('/plan-generator')}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #5c8aff 0%, #4f7cff 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Generate Schedule
                </button>
              </div>
            )}
          </div>
          <div className="card">
            <div className="card-title">
              Study Streak <img src={fire} alt='fire' id='fire_logo'/>
            </div>
            <div className="card-stat"><Streak /></div>
          </div>
        </div>
        <div className="main-grid">
          <div className="overview-card">
            <div className="section-title">Progress Overview</div>
            <div className="progress-circle-wrap">
              <ProgressBar progress={75}/>
            </div>
          </div>
          <div>
            <div className="quick-actions-card">
              <div className="section-title">Quick Actions</div>
              <button className="primary-btn" onClick={() => navigate('/plan-generator')}>
                Plan My Week with AI
              </button>
              {/* <button className="secondary-btn">Add New Task</button> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;