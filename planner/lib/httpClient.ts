type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export async function httpJson<T>(url: string, method: HttpMethod = "GET", body?: any): Promise<T> {
  const init: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  const res = await fetch(url, init);
  const contentType = res.headers.get("content-type") || "";

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      if (contentType.includes("application/json")) {
        const err = await res.json();
        message = err?.error || err?.message || message;
      } else {
        const text = await res.text();
        message = text || message;
      }
    } catch {}
    throw new Error(message);
  }

  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  // Fallback: try text
  return (await res.text()) as unknown as T;
}

export const HttpClient = {
  get: <T>(url: string) => httpJson<T>(url, "GET"),
  post: <T>(url: string, body: any) => httpJson<T>(url, "POST", body),
  put: <T>(url: string, body: any) => httpJson<T>(url, "PUT", body),
  delete: <T>(url: string, body: any) => httpJson<T>(url, "DELETE", body),
};
