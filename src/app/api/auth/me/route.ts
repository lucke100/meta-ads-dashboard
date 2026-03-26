import { NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 });

  const payload = await verifyJwt(token);
  if (!payload) return NextResponse.json({ success: false, error: 'Token inválido' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user) return NextResponse.json({ success: false, error: 'Usuário não encontrado' }, { status: 404 });

  return NextResponse.json({ success: true, data: { id: user.id, name: user.name, email: user.email } });
}

export async function PUT(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 });

  const payload = await verifyJwt(token);
  if (!payload) return NextResponse.json({ success: false, error: 'Token inválido' }, { status: 401 });

  const body = await req.json();
  const { name, currentPassword, newPassword } = body;

  try {
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return NextResponse.json({ success: false, error: 'Usuário não encontrado' }, { status: 404 });

    const dataToUpdate: any = {};

    if (name) dataToUpdate.name = name;

    if (newPassword && currentPassword) {
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) return NextResponse.json({ success: false, error: 'Senha atual incorreta' }, { status: 400 });
      dataToUpdate.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, data: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email } });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Erro ao atualizar perfil' }, { status: 500 });
  }
}
