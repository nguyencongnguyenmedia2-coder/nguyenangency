import { NextRequest, NextResponse } from 'next/server';
import { createUnifiedBooking } from '@/lib/booking-engine';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      select: {
        id: true,
        title: true,
        slug: true,
        group: true,
        shortDesc: true,
        priceLabel: true,
        startingPrice: true,
        isFeatured: true,
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ ok: true, services });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    const result = await createUnifiedBooking({
      fullName: body.fullName || body.name || '',
      phone: body.phone || '',
      email: body.email || '',
      companyName: body.companyName || body.company || '',
      address: body.address || '',
      serviceId: body.serviceId || '',
      serviceName: body.serviceName || body.serviceType || '',
      projectTitle: body.projectTitle || body.serviceName || body.serviceType || 'Yêu cầu dịch vụ từ Website',
      projectDescription: body.projectDescription || body.message || '',
      budgetRange: body.budgetRange || body.budget || '',
      budgetMin: typeof body.budgetMin === 'number' ? body.budgetMin : undefined,
      budgetMax: typeof body.budgetMax === 'number' ? body.budgetMax : undefined,
      preferredStartDate: body.preferredStartDate || '',
      preferredContactTime: body.preferredContactTime || '',
      customerNotes: body.customerNotes || '',
      source: body.source === 'TELEGRAM' || body.source === 'ADMIN' ? body.source : 'WEBSITE',
      pageSource: body.pageSource || '/contact',
      websiteHoneypot: body.websiteHoneypot || '',
      ipAddress,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi xử lý dữ liệu đặt dịch vụ.',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
      },
      { status: 500 }
    );
  }
}

