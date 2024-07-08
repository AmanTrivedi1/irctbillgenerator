import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { format } from 'date-fns';

interface InputPair {
  detail: string;
  amount: string;
}

interface DefaultFields {
  orderNo: string;
  deliveryDateTime: string | null;
  deliveryTime: string | null;
  deliveryStation: string;
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
  const { defaultFields, inputPairs, totalAmount, gst, discount } = await request.json() as {
    defaultFields: DefaultFields;
    inputPairs: InputPair[];
    totalAmount: number;
    gst: string;
    discount: string;
  };

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const drawText = (text: string, x: number, y: number, size: number, isBold = false) => {
    page.drawText(text, { x, y, size, font: isBold ? boldFont : font });
  };

  const drawLine = (startX: number, startY: number, endX: number, endY: number) => {
    page.drawLine({
      start: { x: startX, y: startY },
      end: { x: endX, y: endY },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
  };

  let y = height - 80;

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



  y -= 20; // Add padding before line
  drawLine(50, y, width - 50, y);
  y -= 20; // Add padding after line

  // Items
  inputPairs.forEach((pair: InputPair) => {
    drawText(pair.detail, 50, y, 10);
    drawText(`INR ${pair.amount}`, width - 100, y, 10);
    y -= 20;
  });

  // Line before Order Summary


  drawText('Order Summary:', 50, y, 12, true);
  y -= 25;

  const subtotal = inputPairs.reduce((sum: number, pair: InputPair) => sum + (parseFloat(pair.amount) || 0), 0);
  drawText(`Subtotal: INR ${subtotal.toFixed(2)}`, 50, y, 10);
  y -= 20;

  // Always show GST, even if it's 0
  const gstPercentage = gst ? parseFloat(gst) : 0;
  const gstAmount = subtotal * (gstPercentage / 100);
  drawText(`GST (${gstPercentage}%): INR ${gstAmount.toFixed(2)}`, 50, y, 10);
  y -= 20;

  // Always show Discount, even if it's 0
  const discountAmount = discount ? parseFloat(discount) : 0;
  drawText(`Discount: INR ${discountAmount.toFixed(2)}`, 50, y, 10);
  y -= 20;

  drawField('Payment Mode', defaultFields.paymentMode);
  drawField('Customer Note', defaultFields.customerNote);

  y -= 20;
  drawLine(50, y, width - 50, y);
  y -= 20;

  // Calculate and display the final total
  const finalTotal = subtotal + gstAmount - discountAmount;
  drawText(`Total Amount: INR ${finalTotal.toFixed(2)}`, 50, y, 12, true);
  y -= 25;



  const pdfBytes = await pdfDoc.save();
  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=bill.pdf',
    },
  });
}