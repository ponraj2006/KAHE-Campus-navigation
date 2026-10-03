import React from "react";
import collegeLogo from "../../assets/LOGO.png";

export default function ChatMessage({ message, onActionClick }) {
  const isBot = message.sender === "bot";

  return (
    <div className={`kahe-message-row ${isBot ? "bot-row" : "user-row"}`}>
      {isBot && (
        <img className="kahe-bot-avatar" src={collegeLogo} alt="KAHE" />
      )}

      <div className={`kahe-bubble ${isBot ? "bot-bubble" : "user-bubble"}`}>
        <p className="bubble-text">{message.text}</p>

        {/* Structured bullet points */}
        {message.details && (
          <ul className="bubble-details-list">
            {message.details.map((detail, idx) => (
              <li key={idx}>{detail}</li>
            ))}
          </ul>
        )}

        {/* Action buttons inside message bubble */}
        {message.actions && (
          <div className="bubble-action-buttons">
            {message.actions.map((act, idx) => (
              <button
                key={idx}
                className="bubble-action-btn"
                onClick={() => onActionClick(act.label)}
              >
                {act.label} →
              </button>
            ))}
          </div>
        )}

        <span className="bubble-time">{message.time}</span>
      </div>
    </div>
  );
}
