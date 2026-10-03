import React from 'react';

export default function ChatPills({ pills, onSelect }) {
  return (
    <div className="kahe-pills-container">
      {pills.map((pill, idx) => (
        <button
          key={idx}
          className="kahe-pill"
          onClick={() => onSelect(pill)}
        >
          {pill}
        </button>
      ))}
    </div>
  );
}