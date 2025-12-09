"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { listEstudos } from "@/lib/estudoService";
import EditarPopup from "@/app/componentes/EditarPopup";

type Estudo = {
  id: number;
  titulo: string;
  duracao: number;
  concluido: boolean;
  descricao?: string;
  categoria?: string;
  prioridade?: "baixa" | "media" | "alta";
};

export default function EditarPage() {
  const params = useParams();
  const router = useRouter();
  const [estudo, setEstudo] = useState<Estudo | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarEstudo() {
      try {
        setLoading(true);
        const id = Number(params.id);
        
        if (isNaN(id)) {
          setErro("ID inválido");
          return;
        }

        const estudos = await listEstudos();
        const encontrado = estudos.find((e) => e.id === id);

        if (encontrado) {
          setEstudo(encontrado);
        } else {
          setErro("Estudo não encontrado");
        }
      } catch (error) {
        console.error("Erro ao carregar estudo:", error);
        setErro("Erro ao carregar os dados");
      } finally {
        setLoading(false);
      }
    }

    carregarEstudo();
  }, [params.id]);

  const handleClose = () => {
    router.back();
  };

  const handleSave = async () => {
    // Após salvar, redireciona de volta ou para a listagem
    router.push("/");
  };

  const handleDelete = async () => {
    // Após deletar, redireciona para a listagem
    router.push("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
          </div>
        </div>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium mb-4"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <p className="text-red-700 dark:text-red-300 font-medium">{erro}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>
        {estudo && (
          <EditarPopup
            estudo={estudo}
            onSave={handleSave}
            onClose={handleClose}
            onDelete={handleDelete}
          />
        )}
      </div>
    </main>
  );
}
