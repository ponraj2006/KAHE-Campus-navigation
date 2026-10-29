import React from 'react';
import BotExtras from './BotExtras';

// Block names like "S Block" are shown as signboard tiles with a big letter
const BLOCK_LABEL = /^([A-Za-z]) Block$/i;

/**
 * ChatMessage - one chat bubble.
 *  - text and optional details lines
 *  - staff cards and the Google Maps button (through BotExtras)
 *  - clickable menu from message.actions (only on the newest bot message)
 *
 * Props:
 *   message        { sender, text, details, actions, staff, destination, time }
 *   onActionClick  called with the action label when a menu button is clicked
 *   isLatest       true only for the newest message, so old menus disappear
 */
export default function ChatMessage({
  message,
  onActionClick,
  isLatest = true,
  actionsDisabled = false
}) {
  const isBot = message.sender === 'bot';
  const details = Array.isArray(message.details) ? message.details : [];
  const actions = Array.isArray(message.actions) ? message.actions : [];

  return (
    <div className={`kahe-msg kahe-msg-${isBot ? 'bot' : 'user'}`}>
      <div className="kahe-bubble">
        <p className="kahe-bubble-text">{message.text}</p>

        {details.length > 0 && (
          <ul className="kahe-details">
            {details.map((item, index) => (
              <li key={index}>
                {typeof item === 'string'
                  ? item
                  : [item.label, item.value].filter(Boolean).join(': ')}
              </li>
            ))}
          </ul>
        )}
      </div>

      {isBot && <BotExtras message={message} />}

      {isBot && isLatest && actions.length > 0 && (
        <ul className="kahe-actions" aria-label="Choose an option">
          {actions.map((action) => {
            const label = typeof action === 'string' ? action : action.label;
            const block = BLOCK_LABEL.exec(label);

            return (
              <li key={label}>
                <button
                  type="button"
                  className={block ? 'kahe-tile' : 'kahe-action'}
                  onClick={() => onActionClick(label)}
                  disabled={actionsDisabled}
                >
                  {block && (
                    <span className="kahe-tile-letter" aria-hidden="true">
                      {block[1].toUpperCase()}
                    </span>
                  )}
                  <span className="kahe-tile-label">{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {message.time && <span className="kahe-time">{message.time}</span>}
    </div>
  );
}
