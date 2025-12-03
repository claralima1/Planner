"use client";

import React from "react";
import { 
  X, Clock, BookOpen, CheckCircle, AlertCircle, 
  Calendar, FileText, Target, Tag, Star, 
  BarChart3, User, Hash, TrendingUp 
} from "lucide-react";

type Estudo = {
  id: number;
  titulo: string;
  duracao: number;
  concluido: boolean;
  descricao?: string;
  dataCriacao?: string;
  categoria?: string;
  prioridade?: "baixa" | "media" | "alta";
  progresso?: number;
  tags?: string[];
  dificuldade?: "iniciante" | "intermediario" | "avancado";
};

type Props = {
  estudo: Estudo | null;
  onClose: () => void;
};

export default function Detalhar({ estudo, onClose }: Props) {
  if (!estudo) return null;

  // Função para obter cor da prioridade
  const getPriorityColor = (prioridade?: string) => {
    switch (prioridade) {
      case "alta": return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
      case "media": return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      case "baixa": return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800";
      default: return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  // Função para obter ícone da prioridade
  const getPriorityIcon = (prioridade?: string) => {
    switch (prioridade) {
      case "alta": return "↑";
      case "media": return "→";
      case "baixa": return "↓";
      default: return "—";
    }
  };

  // Função para obter cor da dificuldade
  const getDificuldadeColor = (dificuldade?: string) => {
    switch (dificuldade) {
      case "iniciante": return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      case "intermediario": return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
      case "avancado": return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      default: return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
    }
  };

  // Formatar data
  const formatarData = (data?: string) => {
    if (!data) return "Não informada";
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcular progresso baseado no status
  const progresso = estudo.progresso || (estudo.concluido ? 100 : 60);

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 animate-slideUp max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com ID e status */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${
                  estudo.concluido 
                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
                    : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                }`}>
                  {estudo.concluido ? <CheckCircle size={24} /> : <BookOpen size={24} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">

                    {estudo.concluido && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                        Concluído
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
                    {estudo.titulo}
                  </h2>
                </div>
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

        {/* Conteúdo Principal */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Grid de Informações Principais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Duração */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-purple-100 dark:border-purple-900/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                  <Clock className="text-purple-600 dark:text-purple-400" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Duração</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    {estudo.duracao} {estudo.duracao === 1 ? 'hora' : 'horas'}
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className={`rounded-xl p-4 border ${
              estudo.concluido 
                ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 border-green-100 dark:border-green-900/30" 
                : "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 border-blue-100 dark:border-blue-900/30"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  estudo.concluido 
                    ? "bg-green-100 dark:bg-green-900/40" 
                    : "bg-blue-100 dark:bg-blue-900/40"
                }`}>
                  {estudo.concluido ? (
                    <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                  ) : (
                    <AlertCircle className="text-blue-600 dark:text-blue-400" size={20} />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <p className={`text-xl font-bold ${
                    estudo.concluido 
                      ? "text-green-700 dark:text-green-400" 
                      : "text-blue-700 dark:text-blue-400"
                  }`}>
                    {estudo.concluido ? "Concluído" : "Em Andamento"}
                  </p>
                </div>
              </div>
            </div>

            {/* Prioridade */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-orange-100 dark:border-orange-900/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
                  <Star className="text-orange-600 dark:text-orange-400" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Prioridade</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${
                      estudo.prioridade === "alta" 
                        ? "text-red-600 dark:text-red-400"
                        : estudo.prioridade === "media"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-green-600 dark:text-green-400"
                    }`}>
                      {getPriorityIcon(estudo.prioridade)}
                    </span>
                    <p className="text-xl font-bold text-gray-800 dark:text-white capitalize">
                      {estudo.prioridade || "Não definida"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Descrição (se existir) */}
          {estudo.descricao && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FileText className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                    Descrição
                  </h3>
                  <div className="mt-3">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                      {estudo.descricao}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Informações Adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categoria e Dificuldade */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                  <Tag size={16} />
                  Categoria
                </h4>
                {estudo.categoria ? (
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                        <Target className="text-purple-600 dark:text-purple-400" size={16} />
                      </div>
                      <p className="text-gray-800 dark:text-white font-medium">{estudo.categoria}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-3 text-gray-500 dark:text-gray-400 text-sm italic">
                    Não categorizado
                  </div>
                )}
              </div>

              {/* Dificuldade (se existir) */}
              {estudo.dificuldade && (
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                    <BarChart3 size={16} />
                    Nível de Dificuldade
                  </h4>
                  <div className={`rounded-lg px-4 py-3 ${getDificuldadeColor(estudo.dificuldade)}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-white/50 dark:bg-gray-900/50 rounded-md">
                        <TrendingUp size={16} />
                      </div>
                      <p className="font-medium capitalize">{estudo.dificuldade}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Progresso e Data */}
            <div className="space-y-4">
              {/* Progresso */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                  <TrendingUp size={16} />
                  Progresso
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {estudo.concluido ? "Completado" : "Em progresso"}
                    </span>
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      {progresso}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        estudo.concluido 
                          ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                          : "bg-gradient-to-r from-purple-500 to-blue-500"
                      }`}
                      style={{ width: `${progresso}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Data de Criação */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                  <Calendar size={16} />
                  Data de Criação
                </h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md">
                      <Calendar className="text-gray-600 dark:text-gray-400" size={16} />
                    </div>
                    <p className="text-gray-800 dark:text-white">
                      {formatarData(estudo.dataCriacao)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tags (se existirem) */}
          {estudo.tags && estudo.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                <Hash size={16} />
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {estudo.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-full border border-purple-200 dark:border-purple-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

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