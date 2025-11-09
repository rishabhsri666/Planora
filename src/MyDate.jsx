import React, { useState, useEffect } from 'react';

function DateDayDisplay() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // update every minute

    return () => clearInterval(timer);
  }, []);

  // Extract date parts explicitly
  const weekday = currentDate.toLocaleString('en-US', { weekday: 'long' });
  const month = currentDate.toLocaleString('en-US', { month: 'long' });
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();

  const formattedDate = `${weekday}, ${month} ${day}, ${year}`;

  return <p>{formattedDate}</p>;
}

export default DateDayDisplay;
