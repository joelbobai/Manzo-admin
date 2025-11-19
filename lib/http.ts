export async function parseJSON<T>(response: Response): Promise<T> {
  try {
    const text = await response.text();
    if (!text) {
      return {} as T;
    }
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Unable to read the server response.");
  }
}

export async function getResponseErrorMessage(response: Response): Promise<string> {
  let fallback = response.statusText || "Unexpected server error.";

  try {
    const data = await response.clone().json();
    if (data && typeof data === "object") {
      const record = data as Record<string, unknown>;
      const message = record.message ?? record.error;
      if (typeof message === "string" && message.trim().length > 0) {
        return message;
      }
    }
  } catch {
    const text = await response.clone().text().catch(() => "");
    if (text) {
      fallback = text;
    }
  }

  return fallback;
}
