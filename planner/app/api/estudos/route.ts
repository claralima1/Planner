import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import * as store from '@/lib/server/estudoStore';

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

function getUsername(req: Request): string | null {
  const auth = req.headers.get('authorization');
  if (!auth) return null;
  const token = auth.split(' ')[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { username?: string };
    return decoded.username || null;
  } catch (e) {
    return null;
  }
}

// CREATE
export async function POST(req: Request) {
  const username = getUsername(req);
  if (!username) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const { titulo, duracao, concluido, descricao, categoria, prioridade } = await req.json();
  const novo = store.create({ titulo, duracao, concluido, descricao, categoria, prioridade, username });
  return NextResponse.json(novo);
}

// listar todos
export async function GET(req: Request) {
  const username = getUsername(req);
  if (!username) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  return NextResponse.json(store.listAll(username));
}

// UPDATE
export async function PUT(req: Request) {
  const username = getUsername(req);
  if (!username) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const dados = await req.json();
  const atualizado = store.update({ ...dados, username });
  if (!atualizado) return NextResponse.json({ error: "Estudo não encontrado" }, { status: 404 });
  return NextResponse.json(atualizado);
}

// DELETE
export async function DELETE(req: Request) {
  const username = getUsername(req);
  if (!username) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const { id } = await req.json();
  store.remove(id, username);
  return NextResponse.json({ message: "Estudo removido" });
}
