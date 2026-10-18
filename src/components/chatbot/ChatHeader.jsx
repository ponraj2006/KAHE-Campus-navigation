import React from 'react';

/**
 * ChatHeader - title bar with reset, minimize and close buttons.
 */
export default function ChatHeader({ onMinimize, onClose, onReset }) {
  return (
    <header className="kahe-chat-header">
      <div className="kahe-chat-heading">
        <h2 className="kahe-chat-title">KAHE Campus Assistant</h2>
        <p className="kahe-chat-subtitle">Find blocks, rooms and staff</p>
      </div>

      <div className="kahe-chat-controls">
        <button type="button" onClick={onReset} aria-label="Start a new chat" title="New chat">
          New chat
        </button>
        <button type="button" onClick={onMinimize} aria-label="Minimize chat" title="Minimize">
          &minus;
        </button>
        <button type="button" onClick={onClose} aria-label="Close chat" title="Close">
          &times;
        </button>
      </div>
    </header>
  );
}
