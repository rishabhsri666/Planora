import React, { useState, useEffect } from 'react';

function Streak() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const streakKey = 'site_streak';
    const lastVisitKey = 'last_visit';

    // Get stored streak and last visit date
    const storedStreak = Number(localStorage.getItem(streakKey) || 0);
    const lastVisit = localStorage.getItem(lastVisitKey);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let incrementedStreak = storedStreak;

    if (lastVisit) {
      const lastDate = new Date(lastVisit);
      lastDate.setHours(0, 0, 0, 0);

      const daysDiff = (today - lastDate) / (1000 * 60 * 60 * 24);

      if (daysDiff === 1) {
        // Visited on consecutive day
        incrementedStreak = storedStreak + 1;
      } else if (daysDiff > 1) {
        // Streak broken
        incrementedStreak = 1;
      }
      // If daysDiff === 0, do nothing (same day, don't re-increment)
    } else {
      incrementedStreak = 1; // First visit
    }

    localStorage.setItem(streakKey, incrementedStreak);
    localStorage.setItem(lastVisitKey, today.toISOString());
    setStreak(incrementedStreak);
  }, []);

  return (
    <div>
      <p><strong>{streak}</strong> {streak === 1 ? 'day' : 'days'}</p>
      <p>You are {streak}% better!!!</p>
    </div>
  );
}

export default Streak;
