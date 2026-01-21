import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { create, findByUsername } from '../../../lib/server/userStore';

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

export async function POST(request: NextRequest) {
    try {
        const { username, password, email } = await request.json();

        // Validações básicas
        if (!username || !password) {
            return NextResponse.json(
                { message: 'Username e password são obrigatórios' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: 'Senha deve ter pelo menos 6 caracteres' },
                { status: 400 }
            );
        }

        // Verificar se usuário já existe
        const existingUser = await findByUsername(username);
        if (existingUser) {
            return NextResponse.json(
                { message: 'Usuário já existe' },
                { status: 409 }
            );
        }

        // Criar novo usuário
        const newUser = await create(username, password, email);
        
        if (!newUser) {
            return NextResponse.json(
                { message: 'Erro ao criar usuário' },
                { status: 500 }
            );
        }

        // Gerar token JWT
        const token = jwt.sign({ username: newUser.username }, SECRET_KEY, { expiresIn: '24h' });

        return NextResponse.json(
            { 
                message: 'Usuário criado com sucesso',
                token,
                user: { id: newUser.id, username: newUser.username, email: newUser.email }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Erro ao registrar:', error);
        return NextResponse.json(
            { message: 'Erro ao registrar usuário' },
            { status: 500 }
        );
    }
}
