import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

type User = {
  id: number;
  username: string;
  password: string; // hash
  email?: string;
  dataCriacao: string;
};

type UsersFile = {
  nextId: number;
  users: User[];
};

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(USERS_FILE)) {
      const initial: UsersFile = { nextId: 1, users: [] };
      fs.writeFileSync(USERS_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    }
  } catch (e) {
    console.error('Erro ao garantir arquivo de usuários:', e);
  }
}

function readStore(): UsersFile {
  ensureDataFile();
  const raw = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeStore(store: UsersFile) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

export async function findByUsername(username: string): Promise<User | null> {
  const store = readStore();
  return store.users.find((u) => u.username === username) || null;
}

export async function findById(id: number): Promise<User | null> {
  const store = readStore();
  return store.users.find((u) => u.id === id) || null;
}

export async function create(username: string, password: string, email?: string): Promise<User | null> {
  const store = readStore();
  
  // Verificar se usuário já existe
  if (store.users.some((u) => u.username === username)) {
    return null;
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 10);

  const novo: User = {
    id: store.nextId++,
    username,
    password: hashedPassword,
    email,
    dataCriacao: new Date().toISOString(),
  };

  store.users.push(novo);
  writeStore(store);
  return novo;
}

export async function verifyPassword(username: string, password: string): Promise<boolean> {
  const user = await findByUsername(username);
  if (!user) return false;
  return bcrypt.compare(password, user.password);
}

export type { User };
