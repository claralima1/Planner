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

let cache: Estudo[] | null = null;
const LOCAL_KEY = "planner_estudos_cache";

function saveLocal(all: Estudo[]) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(all)); } catch {}
}

function loadLocal(): Estudo[] | null {
  try { const v = localStorage.getItem(LOCAL_KEY); return v ? JSON.parse(v) : null; } catch { return null; }
}

export async function listEstudos(): Promise<Estudo[]> {
  if (typeof window !== 'undefined') {
    if (cache) return cache;
    const local = loadLocal();
    if (local) { cache = local; return local; }
  }
  const data = await HttpClient.get<Estudo[]>(API);
  cache = data;
  if (typeof window !== 'undefined') saveLocal(data);
  return data;
}

export async function getEstudo(id: number): Promise<Estudo | null> {
  const all = await listEstudos();
  return all.find((e) => e.id === id) || null;
}

function invalidateCache() {
  cache = null;
  try { localStorage.removeItem(LOCAL_KEY); } catch {}
}

export async function createEstudo(dados: {
  titulo: string;
  duracao: number;
  concluido: boolean;
  descricao?: string;
  categoria?: string;
  prioridade?: "baixa" | "media" | "alta";
}): Promise<Estudo> {
  const created = await HttpClient.post<Estudo>(API, dados);
  invalidateCache();
  return created;
}

export async function updateEstudo(dados: Estudo): Promise<Estudo> {
  const updated = await HttpClient.put<Estudo>(API, dados);
  invalidateCache();
  return updated;
}

export async function deleteEstudo(id: number): Promise<{ message?: string }> {
  const out = await HttpClient.delete<{ message?: string }>(API, { id });
  invalidateCache();
  return out;
}

export type { Estudo };
