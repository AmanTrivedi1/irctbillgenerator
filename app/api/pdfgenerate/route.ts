import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: Request) {
  const { inputPairs, totalAmount } = await request.json();

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const { width, height } = page.getSize();
  let y = height - 50;

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString();


  page.drawText(`Date: ${formattedDate}`, { x: width - 100, y: height - 20, size: 12 });

  page.drawText(`Time: ${formattedTime}`, { x: 50, y: height - 20, size: 12 });

  page.drawText('-----------------------------------IRCTC BILL RECEIPT-----------------------------------', { x: 50, y, size: 16 });
  y -= 30;

  inputPairs.forEach((pair: { detail: string; amount: string }) => {
    page.drawText(pair.detail, { x: 50, y, size: 12 });
    page.drawText(`INR  ${pair.amount}`, { x: width - 100, y, size: 12 });
    y -= 20;
  });

  page.drawText(`Total Amount: INR  ${totalAmount}`, { x:50 , y:10 , size: 16 });
  const pdfBytes = await pdfDoc.save();
  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=bill.pdf',
    },
  });
}