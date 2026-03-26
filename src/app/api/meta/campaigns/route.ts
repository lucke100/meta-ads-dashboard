// /api/meta/campaigns - Lista campanhas com insights
// SEGURANÇA: Rota server-side, credenciais nunca expostas ao client
import { NextRequest, NextResponse } from 'next/server';
import { getCampaigns, MetaApiError } from '@/lib/meta';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const dateFrom = searchParams.get('date_from') || undefined;
    const dateTo = searchParams.get('date_to') || undefined;
    const status = searchParams.get('status') || undefined;

    const campaigns = await getCampaigns(dateFrom, dateTo, status);
    return NextResponse.json({ success: true, data: campaigns });
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
