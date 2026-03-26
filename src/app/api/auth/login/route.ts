import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signJwt } from '@/lib/auth-utils';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Preencha todos os campos.' }, { status: 400 });
    }

    // Busca o usuário
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'Credenciais inválidas.' }, { status: 401 });
    }

    // Verifica a senha
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Credenciais inválidas.' }, { status: 401 });
    }

    // Gera o token
    const token = await signJwt({ id: user.id, email: user.email, name: user.name });

    // Salva o token em um cookie HttpOnly
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: '/',
    });

    return NextResponse.json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ success: false, error: 'Erro interno ao servidor.' }, { status: 500 });
  }
}
