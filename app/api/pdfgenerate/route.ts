// import { NextResponse } from 'next/server';
// import { PDFDocument } from 'pdf-lib';

// export async function POST(request: Request) {
//   const { inputPairs, totalAmount } = await request.json();

//   const pdfDoc = await PDFDocument.create();
//   const page = pdfDoc.addPage();

//   const { width, height } = page.getSize();
//   let y = height - 50;

//   const currentDate = new Date();
//   const formattedDate = currentDate.toLocaleDateString();
//   const formattedTime = currentDate.toLocaleTimeString();


//   page.drawText(`Date: ${formattedDate}`, { x: width - 100, y: height - 20, size: 12 });

//   page.drawText(`Time: ${formattedTime}`, { x: 50, y: height - 20, size: 12 });

//   page.drawText('-----------------------------------IRCTC BILL RECEIPT-----------------------------------', { x: 50, y, size: 16 });
//   y -= 30;

//   inputPairs.forEach((pair: { detail: string; amount: string }) => {
//     page.drawText(pair.detail, { x: 50, y, size: 12 });
//     page.drawText(`INR  ${pair.amount}`, { x: width - 100, y, size: 12 });
//     y -= 20;
//   });

//   page.drawText(`Total Amount: INR  ${totalAmount}`, { x:50 , y:10 , size: 16 });
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
import { PDFDocument, rgb } from 'pdf-lib';
import { format } from 'date-fns';

export async function POST(request: Request) {
  const { defaultFields, inputPairs, totalAmount } = await request.json();

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const { width, height } = page.getSize();
  let y = height - 50;

  const currentDate = new Date();
  const formattedDate = format(currentDate, 'yyyy-MM-dd');
  const formattedTime = format(currentDate, 'HH:mm:ss');

  page.drawText(`Date: ${formattedDate}`, { x: width - 150, y: height - 20, size: 10 });
  page.drawText(`Time: ${formattedTime}`, { x: width - 150, y: height - 35, size: 10 });

  page.drawText("The Chef's Touch", { x: 50, y, size: 16 });
  y -= 30;

  // Draw default fields
  const drawField = (label: string, value: string) => {
    page.drawText(`${label}: ${value}`, { x: 50, y, size: 10 });
    y -= 15;
  };

  drawField('Order No', defaultFields.orderNo);
  drawField('Delivery Date/Time', format(new Date(defaultFields.deliveryDateTime), 'yyyy-MM-dd HH:mm'));
  drawField('Delivery Station', defaultFields.deliveryStation);
  drawField('Customer Name', defaultFields.customerName);
  drawField('Customer Contact', defaultFields.customerContact);
  drawField('Train Number', defaultFields.trainNumber);
  drawField('PNR Number', defaultFields.pnrNumber);
  drawField('Coach', defaultFields.coach);
  drawField('Seat', defaultFields.seat);

  y -= 15;
  page.drawText('Items:', { x: 50, y, size: 12 });
  y -= 20;

  inputPairs.forEach((pair: { detail: string; amount: string }) => {
    page.drawText(pair.detail, { x: 50, y, size: 10 });
    page.drawText(`INR ${pair.amount}`, { x: width - 100, y, size: 10 });
    y -= 15;
  });

  y -= 15;
  page.drawText(`Total Amount: INR ${totalAmount}`, { x: 50, y, size: 12 });
  y -= 20;
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