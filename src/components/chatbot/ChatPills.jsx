import React from 'react';

/**
 * ChatPills - quick questions shown at the top of the chat.
 * `pills` is an array of strings. Clicking one sends it as a message.
 */
export default function ChatPills({ pills = [], onSelect, disabled = false }) {
  if (pills.length === 0) return null;

  return (
    <ul className="kahe-pills" aria-label="Quick questions">
      {pills.map(pill => (
        <li key={pill}>
          <button
            type="button"
            className="kahe-pill"
            onClick={() => onSelect(pill)}
            disabled={disabled}
          >
            {pill}
          </button>
        </li>
      ))}
    </ul>
  );
}
