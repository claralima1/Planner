"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';

interface UserMenuProps {
  className?: string;
}

export default function UserMenu({ className = '' }: UserMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decodificar token para pegar o username (sem verificação de assinatura no cliente)
        const decoded: any = JSON.parse(
          Buffer.from(token.split('.')[1], 'base64').toString('utf-8')
        );
        setUsername(decoded.username || null);
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading || !username) {
    return null;
  }

  const avatarLetter = username.charAt(0).toUpperCase();

  return (
    <div className={`relative ${className}`}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
        title={username}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-sm">
          {avatarLetter}
        </div>
        <span className="text-sm font-medium max-w-[150px] truncate">{username}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-700">
          <div className="px-4 py-3 border-b border-gray-700">
            <p className="text-xs text-gray-400">Conectado como</p>
            <p className="text-sm font-semibold text-white truncate">{username}</p>
          </div>

          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      )}

      {/* Close menu when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
