"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HttpClient } from '../../lib/httpClient';
import { Lock, User, Mail } from 'lucide-react';
import Link from 'next/link';

const CadastroPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Verificar se já está autenticado
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/');
        }
    }, [router]);

    const handleCadastro = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Validações
        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Senha deve ter pelo menos 6 caracteres');
            setLoading(false);
            return;
        }

        try {
            const response = await HttpClient.post('/api/cadastro', { 
                username, 
                password,
                email: email || undefined
            });
            
            // Salvar token
            localStorage.setItem('token', response.data.token);
            
            setSuccess('Cadastro realizado com sucesso! Redirecionando...');
            setTimeout(() => {
                router.push('/');
            }, 1500);
        } catch (error: any) {
            console.error('Cadastro falhou:', error);
            setError(error?.message || 'Erro ao registrar usuário');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 from-purple-600 to-blue-600 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-[#1D3051] rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Criar Conta</h1>
                    <p className="text-gray-400 mt-2">Cadastre-se para usar o planner</p>
                </div>

                <form onSubmit={handleCadastro} className="space-y-6">
                    <div>
                        <label htmlFor="username" className=" block text-sm font-medium text-gray-400 mb-2">
                            Usuário
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center  pointer-events-none">
                                <User className="text-gray-400 " size={20} />
                            </div>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Escolha um usuário"
                                required
                                className="w-full pl-10 pr-4 py-3 border text-gray-400 border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition bg-gray-800"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                            Email (opcional)
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="text-gray-400" size={20} />
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                className="w-full pl-10 pr-4 py-3 border text-gray-400 border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition bg-gray-800"
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
                                placeholder="Mínimo 6 caracteres"
                                required
                                className="w-full pl-10 pr-4 py-3 border text-gray-400 border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition bg-gray-800"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-2">
                            Confirmar Senha
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="text-gray-400" size={20} />
                            </div>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirme sua senha"
                                required
                                className="w-full pl-10 pr-4 py-3 border text-gray-400 border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition bg-gray-800"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? 'Criando conta...' : 'Cadastrar'}
                    </button>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                            {success}
                        </div>
                    )}

                    <div className="text-center text-gray-400 text-sm">
                        Já tem uma conta?{' '}
                        <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
                            Faça login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CadastroPage;
