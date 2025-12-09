import AdicionarPopup from "../componentes/AdicionarPopup";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdicionarPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Voltar
        </Link>
        <AdicionarPopup onClose={() => window.location.href = "/"} />
      </div>
    </main>
  );
}
