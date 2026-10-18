import React from 'react';

/**
 * BotExtras - staff contact cards and the "Open in Google Maps" button.
 *
 * Add it ONCE inside ChatMessage.jsx, right under the bot's text:
 *
 *     import BotExtras from './BotExtras';
 *     ...
 *     <BotExtras message={message} />
 *
 * It shows nothing when the message has no staff and no map link.
 */
export default function BotExtras({ message }) {
  const staff = Array.isArray(message.staff) ? message.staff : [];
  const mapsUrl = message.destination && message.destination.mapsUrl;

  if (staff.length === 0 && !mapsUrl) return null;

  return (
    <div className="kahe-extras">
      {staff.length > 0 && (
        <ul className="kahe-staff-list">
          {staff.map((person, index) => (
            <li key={`${person.name}-${index}`} className="kahe-staff-card">
              <p className="kahe-staff-name">{person.name}</p>

              <p className="kahe-staff-role">
                {[person.designation, person.department].filter(Boolean).join(', ')}
              </p>

              {(person.building || person.room) && (
                <p className="kahe-staff-where">
                  {[person.building, person.room && `Room ${person.room}`]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              )}

              {(person.phone || person.email) && (
                <p className="kahe-staff-contact">
                  {person.phone && (
                    <a href={`tel:${person.phone.replace(/\s+/g, '')}`}>{person.phone}</a>
                  )}
                  {person.email && <a href={`mailto:${person.email}`}>{person.email}</a>}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {mapsUrl && (
        <a className="kahe-map-btn" href={mapsUrl} target="_blank" rel="noreferrer">
          Open in Google Maps
        </a>
      )}
    </div>
  );
}
