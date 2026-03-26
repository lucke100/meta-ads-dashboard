// /api/meta/account - Dados da conta de anúncios
// SEGURANÇA: Rota server-side, credenciais nunca expostas ao client
import { NextResponse } from 'next/server';
import { getAccountInfo, MetaApiError } from '@/lib/meta';

export async function GET() {
  try {
    const account = await getAccountInfo();
    return NextResponse.json({ success: true, data: account });
  } catch (error) {
    if (error instanceof MetaApiError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
