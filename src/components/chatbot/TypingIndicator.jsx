import React from "react";
import collegeLogo from "../../../assets/LOGO.png";

export default function TypingIndicator() {
  return (
    <div className="kahe-message-row bot-row typing-row">
      <img className="kahe-bot-avatar" src={collegeLogo} alt="KAHE" />
      <div className="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
