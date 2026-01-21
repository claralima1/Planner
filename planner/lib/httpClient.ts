type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export async function httpJson<T>(url: string, method: HttpMethod = "GET", body?: any): Promise<{ data: T; status: number }> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  // Anexa token se existir no cliente
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const init: RequestInit = {
    method,
    headers,
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

  let data;
  if (contentType.includes("application/json")) {
    data = (await res.json()) as T;
  } else {
    data = (await res.text()) as unknown as T;
  }

  return { data, status: res.status };
}

export const HttpClient = {
  get: <T>(url: string) => httpJson<T>(url, "GET"),
  post: <T>(url: string, body: any) => httpJson<T>(url, "POST", body),
  put: <T>(url: string, body: any) => httpJson<T>(url, "PUT", body),
  delete: <T>(url: string, body: any) => httpJson<T>(url, "DELETE", body),
};
