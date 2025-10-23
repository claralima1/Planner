import { NextResponse } from "next/server";

type Estudo = {
  id: number;
  titulo: string;
  duracao: number;
  concluido: boolean;
};

// Armazenamento em memória
let estudos: Estudo[] = [];
let nextId = 1;

// 🟢 CREATE
export async function POST(req: Request) {
  const { titulo, duracao, concluido } = await req.json();
  const novoEstudo: Estudo = { id: nextId++, titulo, duracao, concluido };
  estudos.push(novoEstudo);
  return NextResponse.json(novoEstudo);
}

// 🔵 READ (listar todos)
export async function GET() {
  return NextResponse.json(estudos);
}

// 🟠 UPDATE
export async function PUT(req: Request) {
  const { id, titulo, duracao, concluido } = await req.json();
  const estudo = estudos.find((e) => e.id === id);
  if (!estudo) return NextResponse.json({ error: "Estudo não encontrado" }, { status: 404 });

  estudo.titulo = titulo;
  estudo.duracao = duracao;
  estudo.concluido = concluido;

  return NextResponse.json(estudo);
}

// 🔴 DELETE
export async function DELETE(req: Request) {
  const { id } = await req.json();
  estudos = estudos.filter((e) => e.id !== id);
  return NextResponse.json({ message: "Estudo removido" });
}
