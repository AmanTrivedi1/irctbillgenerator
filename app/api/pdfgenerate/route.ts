
// import { NextResponse } from 'next/server';
// import { PDFDocument, rgb } from 'pdf-lib';
// import { format } from 'date-fns';

// export async function POST(request: Request) {
//   const { defaultFields, inputPairs, totalAmount } = await request.json();

//   const pdfDoc = await PDFDocument.create();
//   const page = pdfDoc.addPage();

//   const { width, height } = page.getSize();
//   let y = height - 50;

//   const currentDate = new Date();
//   const formattedDate = format(currentDate, 'yyyy-MM-dd');
//   const formattedTime = format(currentDate, 'HH:mm:ss');

//   page.drawText(`Date: ${formattedDate}`, { x: width - 150, y: height - 20, size: 10 });
//   page.drawText(`Time: ${formattedTime}`, { x: width - 150, y: height - 35, size: 10 });

//   page.drawText("The Chef's Touch", { x: 50, y, size: 16 });
//   y -= 30;

//   // Draw default fields
//   const drawField = (label: string, value: string) => {
//     page.drawText(`${label}: ${value}`, { x: 50, y, size: 10 });
//     y -= 15;
//   };

//   drawField('Order No', defaultFields.orderNo);
//   drawField('Delivery Date/Time', format(new Date(defaultFields.deliveryDateTime), 'yyyy-MM-dd HH:mm'));
//   drawField('Delivery Station', defaultFields.deliveryStation);
//   drawField('Customer Name', defaultFields.customerName);
//   drawField('Customer Contact', defaultFields.customerContact);
//   drawField('Train Number', defaultFields.trainNumber);
//   drawField('PNR Number', defaultFields.pnrNumber);
//   drawField('Coach', defaultFields.coach);
//   drawField('Seat', defaultFields.seat);

//   y -= 15;
//   page.drawText('Items:', { x: 50, y, size: 12 });
//   y -= 20;

//   inputPairs.forEach((pair: { detail: string; amount: string }) => {
//     page.drawText(pair.detail, { x: 50, y, size: 10 });
//     page.drawText(`INR ${pair.amount}`, { x: width - 100, y, size: 10 });
//     y -= 15;
//   });

//   y -= 15;
//   page.drawText(`Total Amount: INR ${totalAmount}`, { x: 50, y, size: 12 });
//   y -= 20;
//   drawField('Payment Mode', defaultFields.paymentMode);
//   drawField('Customer Note', defaultFields.customerNote);

//   const pdfBytes = await pdfDoc.save();
//   return new NextResponse(pdfBytes, {
//     status: 200,
//     headers: {
//       'Content-Type': 'application/pdf',
//       'Content-Disposition': 'attachment; filename=bill.pdf',
//     },
//   });
// }

// import { NextResponse } from 'next/server';
// import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
// import { format } from 'date-fns';

// export async function POST(request: Request) {
//   const { defaultFields, inputPairs, totalAmount } = await request.json();

//   const pdfDoc = await PDFDocument.create();
//   const page = pdfDoc.addPage();
//   const { width, height } = page.getSize();
//   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//   let y = height - 50;

//   const currentDate = new Date();
//   const formattedDate = format(currentDate, 'yyyy-MM-dd');
//   const formattedTime = format(currentDate, 'HH:mm:ss');

//   const drawText = (text: string, x: number, y: number, size: number) => {
//     page.drawText(text, { x, y, size, font });
//   };

//   const drawField = (label: string, value: string | null | undefined) => {
//     if (value) {
//       drawText(`${label}: ${value}`, 50, y, 10);
//       y -= 15;
//     }
//   };

//   // Header
//   drawText("The Chef's Touch", 50, y, 16);
//   y -= 30;

//   drawText(`Date: ${formattedDate}`, width - 150, height - 20, 10);
//   drawText(`Time: ${formattedTime}`, width - 150, height - 35, 10);

//   // Default Fields
//   drawField('Order No', defaultFields.orderNo);
//   drawField('Delivery Date', defaultFields.deliveryDateTime ? format(new Date(defaultFields.deliveryDateTime), 'yyyy-MM-dd') : '');
//   drawField('Delivery Time', defaultFields.deliveryTime);
//   drawField('Delivery Station', defaultFields.deliveryStation);
//   drawField('Customer Name', defaultFields.customerName);
//   drawField('Customer Contact', defaultFields.customerContact);
//   drawField('Train Number', defaultFields.trainNumber);
//   drawField('PNR Number', defaultFields.pnrNumber);
//   drawField('Coach', defaultFields.coach);
//   drawField('Seat', defaultFields.seat);

//   y -= 15;
//   drawText('Items:', 50, y, 12);
//   y -= 20;

//   // Items
//   inputPairs.forEach((pair: { detail: string; amount: string }) => {
//     drawText(pair.detail, 50, y, 10);
//     drawText(`INR ${pair.amount}`, width - 100, y, 10);
//     y -= 15;
//   });

//   y -= 15;
//   drawText(`Total Amount: INR ${totalAmount}`, 50, y, 12);
//   y -= 20;

//   drawField('Payment Mode', defaultFields.paymentMode);
//   drawField('Customer Note', defaultFields.customerNote);

//   const pdfBytes = await pdfDoc.save();
//   return new NextResponse(pdfBytes, {
//     status: 200,
//     headers: {
//       'Content-Type': 'application/pdf',
//       'Content-Disposition': 'attachment; filename=bill.pdf',
//     },
//   });
// }

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