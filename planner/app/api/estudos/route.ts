import { NextResponse } from "next/server";
import * as store from '@/lib/server/estudoStore';

// CREATE
export async function POST(req: Request) {
  const { titulo, duracao, concluido, descricao, categoria, prioridade } = await req.json();
  const novo = store.create({ titulo, duracao, concluido, descricao, categoria, prioridade });
  return NextResponse.json(novo);
}

// listar todos
export async function GET() {
  return NextResponse.json(store.listAll());
}

// UPDATE
export async function PUT(req: Request) {
  const dados = await req.json();
  const atualizado = store.update(dados);
  if (!atualizado) return NextResponse.json({ error: "Estudo não encontrado" }, { status: 404 });
  return NextResponse.json(atualizado);
}

// DELETE
export async function DELETE(req: Request) {
  const { id } = await req.json();
  store.remove(id);
  return NextResponse.json({ message: "Estudo removido" });
}
