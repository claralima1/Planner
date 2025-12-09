"use client";

import React, { useState } from "react";
import { Plus, Clock, Tag, Star, AlertCircle, Check, X, BookOpen } from "lucide-react";
import { createEstudo } from '@/lib/estudoService';

type FormData = {
  titulo: string;
  duracao: string;
  concluido: boolean;
  descricao?: string;
  categoria?: string;
  prioridade?: "baixa" | "media" | "alta";
};

type Props = {
  onSave?: (dados: {
    titulo: string;
    duracao: number;
    concluido: boolean;
    descricao?: string;
    categoria?: string;
    prioridade?: "baixa" | "media" | "alta";
  }) => Promise<void>;
  onClose: () => void;
};

export default function AdicionarPopup({ onSave, onClose }: Props) {
  const [form, setForm] = useState<FormData>({
    titulo: "",
    duracao: "",
    concluido: false,
    descricao: "",
    categoria: "",
    prioridade: undefined
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Validar formulário
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.titulo.trim()) {
      newErrors.titulo = "O título é obrigatório";
    } else if (form.titulo.length < 3) {
      newErrors.titulo = "O título deve ter pelo menos 3 caracteres";
    }

    if (!form.duracao || parseFloat(form.duracao) <= 0) {
      newErrors.duracao = "A duração deve ser maior que 0";
    } else if (parseFloat(form.duracao) > 24) {
      newErrors.duracao = "A duração não pode ser maior que 24 horas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      const dadosParaCriar = {
        titulo: form.titulo,
        duracao: parseFloat(form.duracao),
        concluido: form.concluido,
        descricao: form.descricao,
        categoria: form.categoria,
        prioridade: form.prioridade
      };

      if (onSave) {
        await onSave(dadosParaCriar);
      } else {
        await createEstudo(dadosParaCriar);
      }
      
      // Reset form and close
      setForm({
        titulo: "",
        duracao: "",
        concluido: false,
        descricao: "",
        categoria: "",
        prioridade: undefined
      });
      onClose();
    } catch (error) {
      console.error("Erro ao adicionar estudo:", error);
      setErrors({ submit: "Erro ao salvar. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (field: keyof FormData, value: any) => {
    setForm({
      ...form,
      [field]: value
    });
    
    // Clear error for this field if exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Durações sugeridas
  const duracoesSugeridas = [
    { value: "0.5", label: "30min" },
    { value: "1", label: "1h" },
    { value: "1.5", label: "1h30" },
    { value: "2", label: "2h" },
    { value: "3", label: "3h" },
  ];

  // Prioridades disponíveis
  const prioridades = [
    { value: "baixa", label: "Baixa", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30" },
    { value: "media", label: "Média", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
    { value: "alta", label: "Alta", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" },
  ];

  // Categorias sugeridas
  const categoriasSugeridas = [
    "Frontend", "Backend", "Mobile", "DevOps", 
    "Banco de Dados", "UI/UX", "Testes", "Segurança", "Outro"
  ];

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
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Novo Estudo
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Preencha os detalhes abaixo
                </p>
              </div>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Erro geral */}
          {errors.submit && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle size={20} />
                <span className="font-medium">{errors.submit}</span>
              </div>
            </div>
          )}

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título do Estudo *
            </label>
            <input
              type="text"
              value={form.titulo}
              onChange={(e) => handleChange("titulo", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.titulo ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
              } bg-transparent text-white placeholder-gray-300 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="Ex: Aprender Next.js 14"
              autoFocus
            />
            {errors.titulo && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.titulo}
              </p>
            )}
          </div>

          {/* Duração */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
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
                onChange={(e) => handleChange("duracao", e.target.value)}
                className={`w-full px-4 py-3 pl-12 rounded-xl border ${
                  errors.duracao ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                } bg-transparent text-white placeholder-gray-300 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Ex: 2.5"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <Clock size={20} />
              </div>
            </div>
            {errors.duracao && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.duracao}
              </p>
            )}
            
            {/* Sugestões de duração */}
            <div className="mt-3 grid grid-cols-5 gap-2">
              {duracoesSugeridas.map((duracao) => (
                <button
                  type="button"
                  key={duracao.value}
                  onClick={() => handleChange("duracao", duracao.value)}
                  className={`px-2 py-2 text-xs text-purple-300 rounded-lg border ${
                    form.duracao === duracao.value
                      ? 'bg-purple-100 border-purple-300 text-purple-700'
                      : 'border-gray-200 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/40 dark:hover:text-purple-300'
                  }`}
                >
                  {duracao.label}
                </button>
              ))}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição (Opcional)
            </label>
            <textarea
              value={form.descricao}
              onChange={(e) => handleChange("descricao", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent text-white placeholder-gray-300 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Descreva o que você vai estudar, objetivos, recursos..."
              maxLength={500}
            />
            <p className="mt-2 text-xs text-gray-300 dark:text-gray-400">
              {500 - (form.descricao?.length || 0)} caracteres restantes
            </p>
          </div>

          {/* Grid: Categoria e Prioridade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Tag size={16} />
                Categoria
              </label>
              <div className="relative">
                <select
                  value={form.categoria || ""}
                  onChange={(e) => handleChange("categoria", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent text-purple-500 placeholder-gray-300 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                >
                  <option value="">Selecione uma categoria</option>
                  {categoriasSugeridas.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Prioridade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Star size={16} />
                Prioridade
              </label>
              <div className="grid grid-cols-3 gap-2">
                {prioridades.map((prio) => (
                  <button
                    type="button"
                    key={prio.value}
                    onClick={() => handleChange("prioridade", prio.value)}
                    className={`px-3 py-2.5 text-sm font-medium text-white rounded-lg border transition-all flex items-center justify-center gap-1 ${
                      form.prioridade === prio.value
                        ? `${prio.bg} border-current ${prio.color}`
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Star 
                      size={14} 
                      className={form.prioridade === prio.value ? prio.color : "text-gray-400"} 
                      fill={form.prioridade === prio.value ? "currentColor" : "none"}
                    />
                    {prio.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Status Inicial
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleChange("concluido", false)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  !form.concluido
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${!form.concluido ? "bg-blue-100 dark:bg-blue-900/40" : "bg-gray-100 dark:bg-gray-700"}`}>
                    <BookOpen size={20} className={!form.concluido ? "text-blue-600 dark:text-blue-400" : "text-gray-400"} />
                  </div>
                  <div className="text-left">
                    <p className={`font-medium ${!form.concluido ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"}`}>
                      Em Andamento
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Vou começar agora
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleChange("concluido", true)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  form.concluido
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${form.concluido ? "bg-green-100 dark:bg-green-900/40" : "bg-gray-100 dark:bg-gray-700"}`}>
                    <Check size={20} className={form.concluido ? "text-green-600 dark:text-green-400" : "text-gray-400"} />
                  </div>
                  <div className="text-left">
                    <p className={`font-medium ${form.concluido ? "text-green-700 dark:text-green-300" : "text-gray-700 dark:text-gray-300"}`}>
                      Já Concluído
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Já finalizei este estudo
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </form>

        {/* Footer com Ações */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adicionando...
                </>
              ) : (
                <>
    
                  Adicionar Estudo
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Estilos de animação */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}