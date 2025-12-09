"use client";

import React, { useEffect, useState } from "react";
import { X, Clock, Tag, Star, AlertCircle, Check, BookOpen, ChevronDown, Trash2 } from "lucide-react";
import { updateEstudo, deleteEstudo } from '@/lib/estudoService';

type Estudo = {
  id: number;
  titulo: string;
  duracao: number;
  concluido: boolean;
  descricao?: string;
  categoria?: string;
  prioridade?: "baixa" | "media" | "alta";
};

type Props = {
  estudo: Estudo;
  onSave?: (dadosAtualizados: Estudo) => Promise<void> | void;
  onClose: () => void;
  onDelete?: () => void;
};

export default function EditarPopup({ estudo, onSave, onClose, onDelete }: Props) {
  const [form, setForm] = useState({
    titulo: estudo.titulo || "",
    duracao: String(estudo.duracao || 1),
    descricao: estudo.descricao || "",
    categoria: estudo.categoria || "",
    prioridade: estudo.prioridade || undefined,
    concluido: estudo.concluido || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      titulo: estudo.titulo || "",
      duracao: String(estudo.duracao || 1),
      descricao: estudo.descricao || "",
      categoria: estudo.categoria || "",
      prioridade: estudo.prioridade || undefined,
      concluido: estudo.concluido || false,
    });
  }, [estudo]);

  const duracoesSugeridas = [
    { value: "0.5", label: "30min" },
    { value: "1", label: "1h" },
    { value: "1.5", label: "1h30" },
    { value: "2", label: "2h" },
    { value: "3", label: "3h" },
  ];

  const prioridades = [
    { value: "baixa", label: "Baixa", color: "text-green-600", bg: "bg-green-100", hover: "hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/30" },
    { value: "media", label: "Média", color: "text-yellow-600", bg: "bg-yellow-100", hover: "hover:bg-yellow-100 hover:text-yellow-600 dark:hover:bg-yellow-900/30" },
    { value: "alta", label: "Alta", color: "text-red-600", bg: "bg-red-100", hover: "hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30" },
  ];

  const categoriasSugeridas = [
    "Frontend", "Backend", "Mobile", "DevOps", 
    "Banco de Dados", "UI/UX", "Testes", "Segurança", "Outro"
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.titulo.trim()) newErrors.titulo = "O título é obrigatório";
    if (!form.duracao || Number(form.duracao) <= 0) newErrors.duracao = "A duração deve ser maior que 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSave() {
    if (!validateForm()) return;

    const atualizado: Estudo = {
      ...estudo,
      titulo: form.titulo.trim(),
      duracao: Number(form.duracao) || estudo.duracao,
      descricao: form.descricao || undefined,
      categoria: form.categoria || undefined,
      prioridade: form.prioridade as any,
      concluido: Boolean(form.concluido),
    };

    try {
      setLoading(true);
      if (onSave) {
        await onSave(atualizado);
      } else {
        await updateEstudo(atualizado);
      }
    } catch (e) {
      setErrors({ submit: "Erro ao salvar. Tente novamente." });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja excluir este estudo?')) return;

    try {
      setLoading(true);
      if (onDelete) {
        await onDelete();
      } else {
        await deleteEstudo(estudo.id);
        onClose();
      }
    } catch (e) {
      console.error(e);
      setErrors({ submit: 'Erro ao excluir. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 animate-slideUp max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Editar Estudo</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Atualize os detalhes abaixo</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Fechar"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Formulário */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {errors.submit && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle size={20} />
                <span className="font-medium">{errors.submit}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Título do Estudo *</label>
            <input
              type="text"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border ${errors.titulo ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'} bg-transparent text-white placeholder-gray-300 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="Ex: Aprender Next.js 14"
              autoFocus
            />
            {errors.titulo && <p className="mt-2 text-sm text-red-600">{errors.titulo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium  dark:text-gray-300 mb-2 flex items-center gap-2">
              <Clock size={16} />
              Duração (horas) *
            </label>
            <div className="relative">
              <input
                type="number"
                min="0.5"
                max="24"
                step="0.5"
                value={form.duracao}
                onChange={(e) => setForm({ ...form, duracao: e.target.value })}
                className={`w-full px-4 py-3 pl-12 rounded-xl border ${errors.duracao ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'} bg-transparent text-white placeholder-gray-300 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Ex: 2.5"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Clock size={20} />
              </div>
            </div>
            {errors.duracao && <p className="mt-2 text-sm text-red-600">{errors.duracao}</p>}

            <div className="mt-3 grid grid-cols-5 gap-2">
              {duracoesSugeridas.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setForm({ ...form, duracao: d.value })}
                  className={`px-2 py-2 text-xs text-purple-300 rounded-lg border ${form.duracao === d.value ? 'bg-purple-100 border-purple-300 text-purple-700' : 'border-gray-200 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/40 dark:hover:text-purple-300'}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descrição (Opcional)</label>
            <textarea
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent text-white placeholder-gray-300 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Descreva o que você vai estudar..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><Tag size={16} /> Categoria</label>
              <div className="relative">
                <select
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent text-white placeholder-gray-300 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                >
                  <option value="">Selecione</option>
                  {categoriasSugeridas.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2"><Star size={16} /> Prioridade</label>
              <div className="grid grid-cols-3 gap-2">
                {prioridades.map((p) => (
                  <button
                    type="button"
                    key={p.value}
                    onClick={() => setForm({ ...form, prioridade: p.value as any })}
                    className={`group px-3 py-2 text-sm font-medium rounded-lg border ${form.prioridade === p.value ? `${p.bg} border-current ${p.color}` : `border-gray-200 dark:border-gray-700 bg-transparent text-white ${p.hover}`}`}
                  >
                    <Star size={14} className={form.prioridade === p.value ? p.color : 'text-white group-hover:text-current'} />
                    <span className={`ml-2 ${form.prioridade === p.value ? p.color : 'text-white group-hover:text-current'}`}>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Status Inicial</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setForm({ ...form, concluido: false })}
                className={`p-4 rounded-xl border-2 transition-all ${!form.concluido ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${!form.concluido ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <BookOpen size={20} className={!form.concluido ? 'text-blue-600' : 'text-gray-400'} />
                  </div>
                  <div className="text-left">
                    <p className={`font-medium ${!form.concluido ? 'text-blue-700' : 'text-gray-700'}`}>Em Andamento</p>
                    <p className="text-xs text-gray-500 mt-1">Vou começar agora</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, concluido: true })}
                className={`p-4 rounded-xl border-2 transition-all ${form.concluido ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-500 hover:bg-green-50 hover:text-green-700'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${form.concluido ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Check size={20} className={form.concluido ? 'text-green-600' : 'text-gray-400'} />
                  </div>
                  <div className="text-left">
                    <p className={`font-medium ${form.concluido ? 'text-green-700' : 'text-gray-700'}`}>Já Concluído</p>
                    <p className="text-xs text-gray-500 mt-1">Já finalizei este estudo</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-3 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-medium rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2 justify-center">
                  <Trash2 size={16} />
                  Excluir
                </div>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>

          </div>
        </div>

      </div>

      {/* Animações */}
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
        .animate-fadeIn { animation: fadeIn 0.15s ease-out; }
        .animate-slideUp { animation: slideUp 0.25s ease-out; }
        /* Make only the dropdown options background match the modal background; keep select itself transparent */
        select option {
          background: #ffffff;
          color: #111827;
        }

        /* Dark mode: match modal dark background for options */
        :global(.dark) select option {
          background: #1f2937;
          color: #f8fafc;
        }
      `}</style>
    </div>
  );
}
