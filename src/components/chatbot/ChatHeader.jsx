import React from 'react';
import kaheLogo from '../../../assets/LOGO.png';

/**
 * ChatHeader - title bar with a close button.
 */
export default function ChatHeader({ onClose }) {
  return (
    <header className="kahe-chat-header">
      <div className="kahe-chat-heading">
        <span className="kahe-chat-logo-wrap">
          <img className="kahe-chat-logo" src={kaheLogo} alt="" />
        </span>
        <span className="kahe-chat-brand">
          <h2 className="kahe-chat-title">KAHE Campus Assistant</h2>
          <p className="kahe-chat-subtitle">Find blocks, rooms and staff</p>
        </span>
      </div>

      <div className="kahe-chat-controls">
        <button type="button" onClick={onClose} aria-label="Close chat" title="Close">
          &times;
        </button>
      </div>
    </header>
  );
}
