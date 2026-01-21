"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HttpClient } from '../../lib/httpClient';
import { Lock, User } from 'lucide-react';
import Link from 'next/link';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Verificar se já está autenticado
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/');
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const response = await HttpClient.post('/api/login', { username, password });
            localStorage.setItem('token', response.data.token);
            router.push('/'); // Redireciona após o login
        } catch (error) {
            console.error('Login failed:', error);
            setError('Usuário ou senha inválidos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 from-purple-600 to-blue-600 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-[#1D3051] rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-white">Bem-vindo</h1>
                    <p className="text-gray-400 mt-2">Faça login para acessar seu planner</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-2">
                            Usuário
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="text-gray-400" size={20} />
                            </div>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Digite seu usuário"
                                required
                                className="w-full pl-10 pr-4 py-3 border text-gray-400 border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                            Senha
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="text-gray-400" size={20} />
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Digite sua senha"
                                required
                                className="w-full pl-10 pr-4 py-3 border text-gray-400 border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="text-center text-gray-400 text-sm">
                        Não tem uma conta?{' '}
                        <Link href="/cadastro" className="text-purple-400 hover:text-purple-300 font-semibold">
                            Cadastre-se aqui
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
