import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { findByUsername, verifyPassword } from '../../../lib/server/userStore';

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

export async function POST(request: NextRequest) {
    const { username, password } = await request.json();
    
    // Validar credenciais
    const isValid = await verifyPassword(username, password);
    
    if (isValid) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '24h' });
        return NextResponse.json({ token });
    }
    
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
}
