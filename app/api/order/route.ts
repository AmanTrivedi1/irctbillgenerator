import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

interface InputPair {
  detail: string;
  amount: string;
}

interface DefaultFields {
  orderNo: string;
  deliveryDateTime: string;
  deliveryStation: string;
  deliveryTime: string; 
  customerName: string;
  customerContact: string;
  trainNumber: string;
  pnrNumber: string;
  coach: string;
  seat: string;
  paymentMode: string;
  customerNote: string;
}

export async function POST(request: Request) {
  try {
    const { defaultFields, inputPairs, totalAmount } = await request.json() as { 
      defaultFields: DefaultFields, 
      inputPairs: InputPair[], 
      totalAmount: number 
    };

    const validPairs = inputPairs.filter(pair => pair.detail.trim() !== '' && pair.amount.trim() !== '');

    if (validPairs.length === 0) {
      return NextResponse.json({ error: 'No valid entries provided' }, { status: 400 });
    }

    const [date, time] = defaultFields.deliveryDateTime.split('T');
    const formattedTime = new Date(`${date}T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });


    const bill = await prisma.bill.create({
      data: {
        totalAmount,
        orderNo: defaultFields.orderNo,
        deliveryDateTime: new Date(defaultFields.deliveryDateTime),
        deliveryTime: formattedTime,
        deliveryStation: defaultFields.deliveryStation,
        customerName: defaultFields.customerName,
        customerContact: defaultFields.customerContact,
        trainNumber: defaultFields.trainNumber,
        pnrNumber: defaultFields.pnrNumber,
        coach: defaultFields.coach,
        seat: defaultFields.seat,
        amountPayable: totalAmount,
        paymentMode: defaultFields.paymentMode,
        customerNote: defaultFields.customerNote,
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