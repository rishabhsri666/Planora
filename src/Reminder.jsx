import React, { useState } from 'react';

function Reminder() {
  const [reminders, setReminders] = useState([]);
  const [input, setInput] = useState('');

  const addReminder = () => {
    if (input.trim() !== '') {
      setReminders([...reminders, { id: Date.now(), text: input }]);
      setInput('');
    }
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  return (
    <div>
      <h2>Reminders</h2>
      <input
        type="text"
        placeholder="Add reminder..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={addReminder}>Add</button>

      <ul>
        {reminders.map(reminder => (
          <li key={reminder.id}>
            {reminder.text}
            <button onClick={() => deleteReminder(reminder.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Reminder;
