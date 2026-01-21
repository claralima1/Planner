import { HttpClient } from './httpClient';

type Estudo = {
  id: number;
  titulo: string;
  duracao: number;
  concluido: boolean;
  descricao?: string;
  categoria?: string;
  prioridade?: "baixa" | "media" | "alta";
  dataCriacao: string;
};

const API = "/api/estudos";

let cache: Record<string, Estudo[] | null> = {};
const LOCAL_KEY = "planner_estudos_cache";

function ensureArray(value: any): Estudo[] {
  return Array.isArray(value) ? value : [];
}

function getUsernameFromToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload?.username || null;
  } catch {
    return null;
  }
}

function keyForUser(username: string | null) {
  return `${LOCAL_KEY}_${username || 'anon'}`;
}

function saveLocal(username: string | null, all: Estudo[]) {
  if (typeof window === 'undefined') return;
  const key = keyForUser(username);
  try { localStorage.setItem(key, JSON.stringify(all)); } catch {}
}

function loadLocal(username: string | null): Estudo[] | null {
  if (typeof window === 'undefined') return null;
  const key = keyForUser(username);
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
}

export async function listEstudos(): Promise<Estudo[]> {
  const username = getUsernameFromToken();

  if (typeof window !== 'undefined') {
    const userKey = keyForUser(username);
    if (cache[userKey]) return ensureArray(cache[userKey]);
    const local = loadLocal(username);
    if (local && Array.isArray(local)) {
      cache[userKey] = local;
      return local;
    }
    if (local && !Array.isArray(local)) {
      invalidateCache(username);
    }
  }
  const { data } = await HttpClient.get<Estudo[]>(API);
  const arr = ensureArray(data);
  const userKey = keyForUser(username);
  cache[userKey] = arr;
  if (typeof window !== 'undefined') saveLocal(username, arr);
  return arr;
}

export async function getEstudo(id: number): Promise<Estudo | null> {
  const all = await listEstudos();
  return all.find((e) => e.id === id) || null;
}

function invalidateCache(username?: string | null) {
  if (username === undefined) {
    // clear all caches
    cache = {};
    if (typeof window !== 'undefined') {
      try {
        Object.keys(localStorage)
          .filter((k) => k.startsWith(LOCAL_KEY))
          .forEach((k) => localStorage.removeItem(k));
      } catch {}
    }
    return;
  }

  const key = keyForUser(username);
  delete cache[key];
  if (typeof window !== 'undefined') {
    try { localStorage.removeItem(key); } catch {}
  }
}

export async function createEstudo(dados: {
  titulo: string;
  duracao: number;
  concluido: boolean;
  descricao?: string;
  categoria?: string;
  prioridade?: "baixa" | "media" | "alta";
}): Promise<Estudo> {
  const { data: created } = await HttpClient.post<Estudo>(API, dados);
  invalidateCache(getUsernameFromToken());
  return created;
}

export async function updateEstudo(dados: Estudo): Promise<Estudo> {
  const { data: updated } = await HttpClient.put<Estudo>(API, dados);
  invalidateCache(getUsernameFromToken());
  return updated;
}

export async function deleteEstudo(id: number): Promise<{ message?: string }> {
  const { data: out } = await HttpClient.delete<{ message?: string }>(API, { id });
  invalidateCache(getUsernameFromToken());
  return out;
}

export type { Estudo };
