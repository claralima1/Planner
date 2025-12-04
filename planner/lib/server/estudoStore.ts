type Estudo = {
  id: number;
  titulo: string;
  duracao: number;
  concluido: boolean;
  descricao?: string;
  categoria?: string;
  prioridade?: "baixa" | "media" | "alta";
};

let estudos: Estudo[] = [];
let nextId = 1;

export function listAll(): Estudo[] {
  return estudos;
}

export function create(dados: Omit<Estudo, 'id'>): Estudo {
  const novo: Estudo = { id: nextId++, ...dados };
  estudos.push(novo);
  return novo;
}

export function update(dados: Estudo): Estudo | null {
  const idx = estudos.findIndex(e => e.id === dados.id);
  if (idx === -1) return null;
  estudos[idx] = { ...estudos[idx], ...dados };
  return estudos[idx];
}

export function remove(id: number) {
  estudos = estudos.filter(e => e.id !== id);
}

export function resetStore() {
  estudos = [];
  nextId = 1;
}

export type { Estudo };
