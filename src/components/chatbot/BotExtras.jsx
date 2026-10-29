import React, { useState } from 'react';

function StaffPhoto({ person }) {
  const [hasError, setHasError] = useState(false);
  const initials = String(person.name || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();

  return (
    <span className="kahe-staff-photo">
      {person.image && !hasError
        ? <img src={person.image} alt="" onError={() => setHasError(true)} />
        : <span className="kahe-staff-initials">{initials}</span>}
    </span>
  );
}

function StaffCard({ person }) {
  const metadata = [
    ['Qualification', person.qualification],
    ['Teaching experience', person.teachingExperience],
    ['Research experience', person.researchExperience],
    ['Specialization', person.specialization],
    ['Publications', person.publications],
    ['Scopus', person.scopus],
    ['Peer reviewed', person.peerReviewed],
    ['Ph.D produced', person.phdProduced],
    ['Ph.D guiding', person.phdGuiding]
  ].filter(([, value]) => value);

  return (
    <li className="kahe-staff-card">
      <StaffPhoto person={person} />
      <div className="kahe-staff-info">
        <p className="kahe-staff-name">{person.name}</p>

        {(person.designation || person.department) && (
          <p className="kahe-staff-role">
            {[person.designation, person.department].filter(Boolean).join(', ')}
          </p>
        )}

        {(person.building || person.room) && (
          <p className="kahe-staff-where">
            {[person.building, person.room && `Room ${person.room}`]
              .filter(Boolean)
              .join(', ')}
          </p>
        )}

        {metadata.length > 0 && (
          <ul className="kahe-staff-meta">
            {metadata.map(([label, value]) => (
              <li key={label}><strong>{label}:</strong> {value}</li>
            ))}
          </ul>
        )}

        {(person.phone || person.email) && (
          <p className="kahe-staff-contact">
            {person.phone && (
              <a href={`tel:${String(person.phone).replace(/\s+/g, '')}`}>{person.phone}</a>
            )}
            {person.email && <a href={`mailto:${person.email}`}>{person.email}</a>}
          </p>
        )}
      </div>
    </li>
  );
}

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
            <StaffCard key={`${person.name}-${index}`} person={person} />
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
