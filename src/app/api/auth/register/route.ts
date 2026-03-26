export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Preencha todos os campos.' }, { status: 400 });
    }

    if (!email.endsWith('@empreendeai.com.br')) {
      return NextResponse.json(
        { success: false, error: 'Apenas e-mails da Empreende Aí são permitidos.' },
        { status: 403 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'A senha deve ter pelo menos 6 caracteres.' },
        { status: 400 }
      );
    }

    // Verifica se usuário existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'E-mail já cadastrado.' }, { status: 400 });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ success: true, data: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Erro no registro:', error);
    return NextResponse.json({ success: false, error: 'Erro interno ao servidor.' }, { status: 500 });
  }
}
