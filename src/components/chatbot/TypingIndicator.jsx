import React from 'react';

/**
 * TypingIndicator - three dots shown while the bot is working on a reply.
 */
export default function TypingIndicator() {
  return (
    <div className="kahe-msg kahe-msg-bot" role="status" aria-label="The assistant is typing">
      <div className="kahe-bubble kahe-typing">
        <span className="kahe-dot" />
        <span className="kahe-dot" />
        <span className="kahe-dot" />
      </div>
    </div>
  );
}
