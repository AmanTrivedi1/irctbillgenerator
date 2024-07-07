
import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { format } from 'date-fns';

export async function POST(request: Request) {
  const { defaultFields, inputPairs, totalAmount } = await request.json();

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const drawText = (text: string, x: number, y: number, size: number, isBold = false) => {
    page.drawText(text, { x, y, size, font: isBold ? boldFont : font });
  };

  const drawField = (label: string, value: string | null | undefined) => {
    if (value) {
      drawText(`${label}: ${value}`, 50, y, 10);
      y -= 20;
    }
  };

  // Header
  const currentDate = new Date();
  drawText(`Date: ${format(currentDate, 'yyyy-MM-dd')}`, width - 150, height - 20, 10);
  drawText(`Time: ${format(currentDate, 'HH:mm:ss')}`, width - 150, height - 35, 10);

  drawText("The Chef's Touch", width / 2 - 50, height - 50, 16, true);

  let y = height - 80;

  // Order details
  drawField('Order No', defaultFields.orderNo);
  drawField('Delivery Date', defaultFields.deliveryDateTime ? format(new Date(defaultFields.deliveryDateTime), 'yyyy-MM-dd') : '');
  drawField('Delivery Time', defaultFields.deliveryTime);
  drawField('Delivery Station', defaultFields.deliveryStation);
  drawField('Customer Name', defaultFields.customerName);
  drawField('Customer Contact', defaultFields.customerContact);
  drawField('Train Number', defaultFields.trainNumber);
  drawField('PNR Number', defaultFields.pnrNumber);
  drawField('Coach', defaultFields.coach);
  drawField('Seat', defaultFields.seat);

  y -= 10;
  drawText('Items:', 50, y, 12, true);
  y -= 25;

  // Items
  inputPairs.forEach((pair: { detail: string; amount: string }) => {
    drawText(pair.detail, 50, y, 10);
    drawText(`INR ${pair.amount}`, width - 100, y, 10);
    y -= 20;
  });

  y -= 10;
  drawText(`Total Amount: INR ${totalAmount}`, 50, y, 12, true);
  y -= 25;

  drawField('Payment Mode', defaultFields.paymentMode);
  drawField('Customer Note', defaultFields.customerNote);

  const pdfBytes = await pdfDoc.save();
  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=bill.pdf',
    },
  });
}