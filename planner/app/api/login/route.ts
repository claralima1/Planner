import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const SECRET_KEY = 'your_secret_key';

export async function POST(request: NextRequest) {
    const { username, password } = await request.json();
    // Aqui você deve validar o usuário e a senha com seu banco de dados
    if (username === 'admin' && password === 'admin') { // Exemplo de validação
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        return NextResponse.json({ token });
    }
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
}
