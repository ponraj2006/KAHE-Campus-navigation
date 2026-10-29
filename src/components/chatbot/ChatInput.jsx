import React, { useState } from 'react';

/**
 * ChatInput - text box and send button.
 */
export default function ChatInput({ onSend, disabled = false }) {
  const [value, setValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!value.trim()) return;
    onSend(value);
    setValue('');
  };

  return (
    <form className="kahe-input-bar" onSubmit={handleSubmit}>
      <input
        className="kahe-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Try S207, or ask who the HOD is"
        aria-label="Type your question"
        maxLength={2000}
        disabled={disabled}
      />
      <button
        type="submit"
        className="kahe-send"
        disabled={disabled || !value.trim()}
      >
        Send
      </button>
    </form>
  );
}
