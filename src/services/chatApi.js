
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export async function getSmartBotResponse(userQuery, pending = null, history = []) {
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
        message: trimmedQuery,
        pending,
        history
      })
    });
  } catch {
    throw new Error("Unable to contact KAHE Assistant. Please try again later.");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Unable to contact KAHE Assistant.");
  }

  if (!data || typeof data !== "object") {
    throw new Error("The assistant returned an invalid response. Please try again.");
  }

  const options = Array.isArray(data.options)
    ? data.options.filter(option => option && typeof option.label === "string")
    : [];

  return {
    text: typeof data.answer === "string" && data.answer.trim()
      ? data.answer
      : "I’m here to help with campus navigation.",
    details: Array.isArray(data.details) ? data.details : [],
    actions: options.map(option => option.label),
    staff: Array.isArray(data.staff) ? data.staff : [],
    destination: data.destination && typeof data.destination === "object"
      ? data.destination
      : null,
    type: data.type || "rag",
    sources: Array.isArray(data.sources) ? data.sources : [],
    pending: data.type === "clarify" ? data.pending : null
  };
}
