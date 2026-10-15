
const API_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:5000").replace(/\/+$/, "");

export async function getSmartBotResponse(userQuery) {
  const trimmedQuery = typeof userQuery === "string" ? userQuery.trim() : "";

  if (!trimmedQuery) {
    throw new Error("Please enter a message before sending.");
  }

  let response;

  try {
    response = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: trimmedQuery
      })
    });
  } catch (error) {
    throw new Error("Unable to contact KAHE Assistant. Please try again later.");
  }

  let data = {};

  try {
    data = await response.json();
  } catch (error) {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || "Unable to contact KAHE Assistant.");
  }

  const destination = data.destination && typeof data.destination === "object" ? data.destination : null;
  const mapsUrl = destination?.mapsUrl || null;

  return {
    text: typeof data.answer === "string" && data.answer.trim() ? data.answer : "I’m here to help with campus navigation.",
    details: Array.isArray(data.details) ? data.details : [],
    actions: mapsUrl
      ? [
          {
            label: "Open Directions in Google Maps",
            link: mapsUrl
          }
        ]
      : [],
    intent: data.type || "rag",
    sources: Array.isArray(data.sources) ? data.sources : [],
    destination
  };
}
