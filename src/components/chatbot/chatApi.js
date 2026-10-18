/**
 * chatApi.js - talks to the KAHE backend.
 *
 * getSmartBotResponse(userText, pending) returns the shape your widget already uses:
 *   { text, details, actions }
 * plus a few extra fields:
 *   actions     -> block names for the "which block?" menu (clickable buttons)
 *   staff       -> staff members to show as contact cards
 *   destination -> { mapsUrl, ... } when the room has a verified location
 *   pending     -> room number the bot is waiting to place in a block (or null)
 *
 * If your current chatApi.js exports other functions, keep them and replace
 * only getSmartBotResponse with the version below.
 */

// Change this if your backend runs somewhere else
const API_URL = "http://127.0.0.1:5000";

export async function getSmartBotResponse(userText, pending = null) {
  let response;

  try {
    response = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText, pending })
    });
  } catch {
    // Network error: the server is not running or not reachable
    throw new Error("I could not reach the server. Check that the backend is running.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Sorry, I could not generate a reply right now.");
  }

  return {
    text: data.answer,
    details: [],

    // "Which block?" menu: each block name becomes a clickable action.
    // Clicking sends the block name (for example "S Block") and the server
    // combines it with the pending room number.
    actions: Array.isArray(data.options) ? data.options.map(option => option.label) : [],

    staff: Array.isArray(data.staff) ? data.staff : [],
    destination: data.destination || null,
    type: data.type,

    // Remember the room number only while the bot is waiting for a block
    pending: data.type === "clarify" ? data.pending : null
  };
}
