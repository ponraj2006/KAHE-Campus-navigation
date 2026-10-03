import React, { useState } from 'react';

export default function ChatInput({ onSend }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    console.log(text)
    setText('');
  };

  return (
    <form className="kahe-chat-footer" onSubmit={handleSubmit}>
      <input
        type="text"
        aria-label="Type your question"
        placeholder="Type your question..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="kahe-footer-icons">
        <button type="submit" className="send-btn" title="Send message" aria-label="Send message">
          ➤
        </button>
      </div>
    </form>
  );
}