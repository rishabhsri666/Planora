// UpcomingTasks.js
import React from 'react';
import './UpcommingTasks.css';
function UpcomingTasks({ tasks }) {
  return (
    <div className='upcoming-tasks'>
      <h4>Upcoming Schedules</h4>
      <ul>
        {tasks && tasks.length > 0 ? (
          tasks.map((task, idx) => <li key={idx}>{task}</li>)
        ) : (
          <li>No upcoming tasks</li>
        )}
      </ul>
    </div>
  );
}

export default UpcomingTasks;
