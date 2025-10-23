"use client";

import { useEffect, useState } from "react";

type Estudo = {
  id: number;
  titulo: string;
  duracao: number;
  concluido: boolean;
};

export default function PlannerEstudos() {
  const [estudos, setEstudos] = useState<Estudo[]>([]);
  const [selecionado, setSelecionado] = useState<Estudo | null>(null);
  const [form, setForm] = useState({ titulo: "", duracao: "", concluido: false });

  // Buscar estudos
  async function carregarEstudos() {
    const res = await fetch("/api/estudos");
    const data = await res.json();
    setEstudos(data);
  }

  useEffect(() => {
    carregarEstudos();
  }, []);

  // Adicionar
  async function adicionarEstudo() {
    if (!form.titulo || !form.duracao) return;
    await fetch("/api/estudos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: form.titulo,
        duracao: parseFloat(form.duracao),
        concluido: form.concluido,
      }),
    });
    setForm({ titulo: "", duracao: "", concluido: false });
    carregarEstudos();
  }

  // Atualizar
  async function atualizarEstudo() {
    if (!selecionado) return;
    await fetch("/api/estudos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selecionado.id,
        titulo: form.titulo,
        duracao: parseFloat(form.duracao),
        concluido: form.concluido,
      }),
    });
    setSelecionado(null);
    setForm({ titulo: "", duracao: "", concluido: false });
    carregarEstudos();
  }

  // Remover
  async function removerEstudo(id: number) {
    await fetch("/api/estudos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    carregarEstudos();
  }

  // Detalhar
  function detalharEstudo(estudo: Estudo) {
    setSelecionado(estudo);
    setForm({
      titulo: estudo.titulo,
      duracao: estudo.duracao.toString(),
      concluido: estudo.concluido,
    });
  }

  return (
    <main className="max-w-2xl mx-auto p-6 bg-[#F8F8FF] pt-10 rounded">
      <h1 className="text-3xl font-bold mb-4 text-center text-[#4B0082]"> Planner de Estudos</h1>

      {/* Formulário */}
      <div className="border p-4 rounded mb-6 shadow border border-white">
        <h2 className="text-xl mb-3 font-semibold text-[#4B0082]">
          {selecionado ? "Editar Estudo" : "Novo Estudo"}
        </h2>

        <div className="flex flex-col gap-2 ">
          <input
            className="border p-2 border-white border p-2 border-white focus:border-[#9370DB] focus:ring-2 focus:ring-[#9370DB33] rounded-lg p-2 outline-none transition"
            placeholder="Título do estudo"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />

          <input
            className="border p-2 border-white focus:border-[#9370DB] focus:ring-2 focus:ring-[#9370DB33] rounded-lg p-2 outline-none transition"
            type="number"
            placeholder="Duração (em horas)"
            value={form.duracao}
            onChange={(e) => setForm({ ...form, duracao: e.target.value })}
          />

          <label className="flex items-center gap-2 ">
            <input
      
              type="checkbox"
              checked={form.concluido}
              onChange={(e) => setForm({ ...form, concluido: e.target.checked })}
            />
            Concluído
          </label>

          <div className="flex gap-2">
            {selecionado ? (
              <>
                <button
                  onClick={atualizarEstudo}
                  className="bg-[#9370DB] text-white px-4 py-2 rounded"
                >
                  Atualizar
                </button>
  

                <button
                  onClick={() => {
                    setSelecionado(null);
                    setForm({ titulo: "", duracao: "", concluido: false });
                  }}
                  className="bg-[#BDA1F5] text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={adicionarEstudo}
                className="text-white px-4 py-2 rounded bg-[#9370DB]"
              >
                Adicionar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lista de estudos */}
      <h2 className="text-2xl font-semibold mb-3 text-[#4B0082]">Meus Estudos</h2>
      <table className="w-full border  border-white p-4 rounded mb-6 shadow">
        <thead>
          <tr className="text-left bg-[#4B0082] ">
            <th className="p-2 text-white">Título</th>
            <th className="p-2 text-white">Duração (h)</th>
            <th className="p-2 text-white">Concluído</th>
            <th className="p-2 text-white">Ações</th>
          </tr>
        </thead>
        <tbody className="">
          {estudos.map((e) => (
            <tr key={e.id} className="border border-[#ffffff]">
              <td className="p-2">{e.titulo}</td>
              <td className="p-2">{e.duracao}</td>
              <td className="p-2">{e.concluido ? "Sim" : " Não"}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => detalharEstudo(e)}
                  className="bg-[#8A2BE2] text-white px-2 py-1 rounded"
                >
                  Detalhar
                </button>
                <button
                  onClick={() => removerEstudo(e.id)}
                  className="bg-[#7B68EE] text-white px-2 py-1 rounded"
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
          {estudos.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center  p-4">
                Nenhum estudo cadastrado ainda 
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
