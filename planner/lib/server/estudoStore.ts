import fs from 'fs';
import path from 'path';

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

type StoreFile = {
  nextId: number;
  estudos: Estudo[];
};

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'estudos.json');

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(DATA_FILE)) {
      const initial: StoreFile = { nextId: 1, estudos: [] };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    }
  } catch (e) {
    console.error('Erro ao garantir arquivo de dados:', e);
  }
}

function readStore(): StoreFile {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeStore(store: StoreFile) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

export function listAll(): Estudo[] {
  const store = readStore();
  return store.estudos;
}

export function create(dados: Omit<Estudo, 'id' | 'dataCriacao'>): Estudo {
  const store = readStore();
  const novo: Estudo = {
    id: store.nextId++,
    ...dados,
    dataCriacao: new Date().toISOString(),
  };
  store.estudos.push(novo);
  writeStore(store);
  return novo;
}

export function update(dados: Estudo): Estudo | null {
  const store = readStore();
  const idx = store.estudos.findIndex((e) => e.id === dados.id);
  if (idx === -1) return null;
  store.estudos[idx] = { ...store.estudos[idx], ...dados };
  writeStore(store);
  return store.estudos[idx];
}

export function remove(id: number) {
  const store = readStore();
  store.estudos = store.estudos.filter((e) => e.id !== id);
  writeStore(store);
}

export function resetStore() {
  const initial: StoreFile = { nextId: 1, estudos: [] };
  writeStore(initial);
}

export type { Estudo };
