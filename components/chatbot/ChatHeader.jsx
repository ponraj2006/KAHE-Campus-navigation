import React from "react";
import collegeLogo from "../../assets/LOGO.png";

export default function ChatHeader({ onMinimize, onClose, onReset }) {
  return (
    <div className="kahe-chat-header">
      <div className="kahe-header-left">
        <div className="kahe-header-logo-box">
          <img
            className="kahe-header-logo"
            src={collegeLogo}
            alt="Karpagam Academy of Higher Education"
          />
        </div>
        <div className="kahe-header-titles">
          <h3>KAHE Smart Assistant</h3>
          <span className="kahe-status">
            <span className="online-dot"></span> online
          </span>
        </div>
      </div>
      <div className="kahe-header-actions">
        <button
          className="kahe-header-btn"
          onClick={onReset}
          title="Clear conversation"
        >
          ↺
        </button>
        <button
          className="kahe-header-btn"
          onClick={onMinimize}
          title="Minimize"
        >
          —
        </button>
        <button className="kahe-header-btn" onClick={onClose} title="Close">
          ✕
        </button>
      </div>
    </div>
  );
}
