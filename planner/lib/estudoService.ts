type Estudo = {
  id: number;
  titulo: string;
  duracao: number;
  concluido: boolean;
  descricao?: string;
  categoria?: string;
  prioridade?: "baixa" | "media" | "alta";
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

  const res = await fetch(API);
  if (!res.ok) throw new Error("Erro ao listar estudos");
  const data = await res.json();
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
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error("Erro ao criar estudo");
  const created = await res.json();
  invalidateCache();
  return created;
}

export async function updateEstudo(dados: Estudo): Promise<Estudo> {
  const res = await fetch(API, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error("Erro ao atualizar estudo");
  const updated = await res.json();
  invalidateCache();
  return updated;
}

export async function deleteEstudo(id: number): Promise<{ message?: string }> {
  const res = await fetch(API, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Erro ao deletar estudo");
  const out = await res.json();
  invalidateCache();
  return out;
}

export type { Estudo };
