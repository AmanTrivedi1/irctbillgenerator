// app/api/earnings/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');

const month = searchParams.get('month');

let startDate, endDate;

if (month) {
  startDate = new Date(parseInt(year || new Date().getFullYear().toString()), parseInt(month) - 1, 1);
  endDate = new Date(parseInt(year || new Date().getFullYear().toString()), parseInt(month), 0);
} else {
  startDate = new Date(parseInt(year || new Date().getFullYear().toString()), 0, 1);
  endDate = new Date(parseInt(year || new Date().getFullYear().toString()), 11, 31);
}

  try {
    const earnings = await prisma.bill.groupBy({
      by: ['createdAt'],
      _sum: {
        totalAmount: true,
      },
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const formattedEarnings = earnings.map((entry) => ({
      date: entry.createdAt.toISOString().split('T')[0],
      amount: entry._sum.totalAmount || 0,
    }));

    return NextResponse.json(formattedEarnings);
  } catch (error) {
    console.error('Error fetching earnings:', error);
    return NextResponse.json({ error: 'Error fetching earnings' }, { status: 500 });
  }
}