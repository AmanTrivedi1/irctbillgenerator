import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface InputPair {
  detail: string;
  amount: string;
}

export async function POST(request: Request) {
  try {
    const { inputPairs } = await request.json() as { inputPairs: InputPair[] };

    const validPairs = inputPairs.filter(pair => pair.detail.trim() !== '' && pair.amount.trim() !== '');

    if (validPairs.length === 0) {
      return NextResponse.json({ error: 'No valid entries provided' }, { status: 400 });
    }

    const totalAmount = validPairs.reduce((sum, pair) => sum + parseFloat(pair.amount), 0);

    const bill = await prisma.bill.create({
      data: {
        totalAmount,
        entries: {
          create: validPairs.map((pair) => ({
            detail: pair.detail,
            amount: parseFloat(pair.amount),
          })),
        },
      },
      include: {
        entries: true,
      },
    });

    return NextResponse.json({ message: 'Data saved successfully', bill }, { status: 200 });
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json({ error: 'Error saving data' }, { status: 500 });
  }
}