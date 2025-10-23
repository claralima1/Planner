import Button from "../components/Button";
import { PlusIcon } from "lucide-react"; // opcional para ícone

export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      <div className="flex gap-300">
      <h1 className="text-3xl font-bold text-center">Minhas Matérias</h1>

        <button class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 4v16m8-8H4"></path>
          </svg>
          <span>Adicionar Matéria</span>
        </button>
      </div>

  
    </div>
  );
}
