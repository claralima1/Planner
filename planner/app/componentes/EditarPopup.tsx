
"use client";

import React from "react";

type Estudo = {
  id: number;
  titulo: string;
  duracao: number;
  concluido: boolean;
};

type FormData = {
  titulo: string;
  duracao: string;
  concluido: boolean;
};

type Props = {
  form: FormData;
  setForm: (form: FormData) => void;
  selecionado: Estudo;
  onAtualizar: () => void;
  onCancelar: () => void;
};

export default function Editar({
  form,
  setForm,
  selecionado,
  onAtualizar,
  onCancelar,
}: Props) {
  return (
    <div className="border p-4 rounded mb-6 shadow border-white">
      <h2 className="text-xl mb-3 font-semibold text-[#4B0082]">
        Editar Estudo: {selecionado.titulo}
      </h2>

      <div className="flex flex-col gap-2">
        <input
          className="border p-2 border-white focus:border-[#9370DB] focus:ring-2 focus:ring-[#9370DB33] rounded-lg outline-none transition"
          placeholder="Título do estudo"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
        />

        <input
          className="border p-2 border-white focus:border-[#9370DB] focus:ring-2 focus:ring-[#9370DB33] rounded-lg outline-none transition"
          type="number"
          placeholder="Duração (em horas)"
          value={form.duracao}
          onChange={(e) => setForm({ ...form, duracao: e.target.value })}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.concluido}
            onChange={(e) => setForm({ ...form, concluido: e.target.checked })}
          />
          Concluído
        </label>

        <div className="flex gap-2">
          <button
            onClick={onAtualizar}
            className="bg-[#9370DB] text-white px-4 py-2 rounded"
          >
            Atualizar
          </button>
          <button
            onClick={onCancelar}
            className="bg-[#BDA1F5] text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
