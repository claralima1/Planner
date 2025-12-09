"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, X, Check, Clock, BookOpen, Eye } from "lucide-react";
import AdicionarPopup from "./componentes/AdicionarPopup"; // Importe o novo componente
import { listEstudos, createEstudo, deleteEstudo } from '@/lib/estudoService';

type Estudo = {
  id: number;
  titulo: string;
  duracao: number;
  concluido: boolean;
  descricao?: string;
  dataCriacao?: string;
  categoria?: string;
  prioridade?: "baixa" | "media" | "alta";
};

export default function PlannerEstudos() {
  const [estudos, setEstudos] = useState<Estudo[]>([]);
  const [adicionando, setAdicionando] = useState(false); // Novo estado para popup de adicionar
  const [loading, setLoading] = useState(true);

  // Buscar estudos
  async function carregarEstudos() {
    try {
      setLoading(true);
      const data = await listEstudos();
      setEstudos(data);
    } catch (error) {
      console.error("Erro ao carregar estudos:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarEstudos();
  }, []);

  // Adicionar estudo (atualizada para receber objeto completo)
  async function adicionarEstudo(dados: {
    titulo: string;
    duracao: number;
    concluido: boolean;
    descricao?: string;
    categoria?: string;
    prioridade?: "baixa" | "media" | "alta";
  }) {
    try {
      await createEstudo(dados);
      await carregarEstudos();
    } catch (error) {
      console.error("Erro ao adicionar estudo:", error);
      throw error;
    }
  }

  // Remover estudo
  async function removerEstudo(id: number) {
    if (!confirm("Tem certeza que deseja remover este estudo?")) return;
    
    try {
      await deleteEstudo(id);
      await carregarEstudos();
    } catch (error) {
      console.error("Erro ao remover estudo:", error);
    }
  }

  // Calcular métricas
  const totalHoras = estudos.reduce((acc, estudo) => acc + estudo.duracao, 0);
  const estudosConcluidos = estudos.filter(e => e.concluido).length;
  const progresso = estudos.length > 0 ? (estudosConcluidos / estudos.length) * 100 : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header com botão de adicionar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Planner de Estudos
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Organize seus estudos de forma eficiente
              </p>
            </div>
            
            {/* Botão de Adicionar Estudo */}
            <button
              onClick={() => setAdicionando(true)}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              <span>Adicionar Estudo</span>
            </button>
          </div>

          {/* Cards de métricas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total de Estudos */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <BookOpen className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
                <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {estudos.length}
                </span>
              </div>
              <h3 className="text-gray-600 dark:text-gray-300 font-medium">
                Total de Estudos
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {estudosConcluidos} concluídos
              </p>
            </div>

            {/* Total de Horas */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Clock className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {totalHoras}h
                </span>
              </div>
              <h3 className="text-gray-600 dark:text-gray-300 font-medium">
                Horas de Estudo
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Tempo total planejado
              </p>
            </div>

            {/* Progresso */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Check className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {progresso.toFixed(0)}%
                </span>
              </div>
              <h3 className="text-gray-600 dark:text-gray-300 font-medium">
                Progresso Geral
              </h3>
              <div className="mt-3">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progresso}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de estudos (sem sidebar de formulário) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Meus Estudos
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  {estudos.length} estudos cadastrados • {totalHoras}h totais
                </p>
              </div>
              
              {/* Botão de adicionar para mobile */}
              <button
                onClick={() => setAdicionando(true)}
                className="sm:hidden inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm"
              >
                <Plus size={16} />
                Adicionar
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-4">Carregando estudos...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {estudos.map((estudo) => (
                <div
                  key={estudo.id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          estudo.concluido 
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        }`}>
                          {estudo.concluido ? <Check size={20} /> : <BookOpen size={20} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-gray-800 dark:text-white">
                              {estudo.titulo}
                            </h3>
                            {estudo.concluido && (
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                                Concluído
                              </span>
                            )}
                            {estudo.prioridade && (
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                estudo.prioridade === "alta" 
                                  ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                                  : estudo.prioridade === "media"
                                  ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                                  : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                              }`}>
                                {estudo.prioridade}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span>{estudo.duracao}h</span>
                            </div>
                            {estudo.categoria && (
                              <div className="flex items-center gap-1">
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                  {estudo.categoria}
                                </span>
                              </div>
                            )}
                            {estudo.descricao && (
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                                  {estudo.descricao}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/detalhar/${estudo.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
                        title="Ver detalhes"
                      >
                        <Eye size={16} />
                        Detalhar
                      </Link>
                      
                      <Link
                        href={`/editar/${estudo.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors text-sm font-medium"
                        title="Editar estudo"
                      >
                        <Edit2 size={16} />
                        Editar
                      </Link>
                      
                      <button
                        onClick={() => removerEstudo(estudo.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Remover estudo"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {estudos.length === 0 && !loading && (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 mb-6">
                    <BookOpen className="text-purple-600 dark:text-purple-400" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                    Nenhum estudo cadastrado
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                    Comece adicionando seu primeiro estudo para organizar sua rotina de aprendizado
                  </p>
                  <button
                    onClick={() => setAdicionando(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg"
                  >
                    <Plus size={18} />
                    Adicionar Primeiro Estudo
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Adicionar */}
      {adicionando && (
        <AdicionarPopup
          onSave={async (dados) => {
            try {
              await adicionarEstudo(dados);
              setAdicionando(false);
            } catch (error) {
              // Erro já é tratado no popup
            }
          }}
          onClose={() => setAdicionando(false)}
        />
      )}
    </main>
  );
}