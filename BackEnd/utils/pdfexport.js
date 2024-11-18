const PDFDocument = require('pdfkit');
const path = require('path');

const exportpdf = (res, data, filename) => {
  // Create a new PDF document
  const doc = new PDFDocument();

  // Set the headers for the PDF file download
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.type('application/pdf');

  // Pipe the PDF document to the response
  doc.pipe(res);

  // Add a title
  doc.fontSize(16).text('INVOICE', 50, 60, { align: 'left' });
//   doc.fontSize(16).text('INVOICE', 100, 50, { align: 'right' });
  // Add an image (adjust the path to your image)
  const imagePath = path.join(__dirname, '../assets/logo.jpeg'); // Replace with the correct image path
  doc.image(imagePath, 460, 30, { width: 100 })

  // Add some space after title
  doc.moveDown(2);

  data.forEach((row) => {
    // Add invoice details
    doc.fontSize(10);
    doc.text(`Name:`, 50, 120);
    doc.text(`${row.name}`, 100, 120);
    doc.text(`Project Status:`, 300, 120);
    doc.text(`${row.project_status}`, 380, 120);
    doc.text(`Invoice Number: ${row.invoices_num}`, 300, 135);
    doc.text(`Vehicle: ${row.vehicle}`, 50, 135);
    doc.text(`Location: ${row.Location}`, 50, 150);
    doc.text(`Date: ${row.date}`, 50, 165);
});
// Add some space before the table
  doc.moveDown(1);

  
  // Define table headers and positions
  const tableTop = 280;
  const descriptionX = 50;
  const advanceX = 300;
  const pendingX = 380;
  const amountX = 460;

  // Draw headers
  doc.font('Helvetica-Bold');
  doc.text('Description', descriptionX, tableTop);
  doc.text('Advance', advanceX, tableTop);
  doc.text('Pending', pendingX, tableTop);
  doc.text('Amount', amountX, tableTop);
  doc.font('Helvetica');

  // Draw a line under the headers
  doc.moveTo(50, tableTop + 20).lineTo(550, tableTop + 20).stroke();

  // Add table content
  let yPosition = tableTop + 40;
  data.forEach((row) => {
    doc.text((row).description, descriptionX, yPosition);
    doc.text((row).advance.toString(), advanceX, yPosition);
    doc.text((row).pending.toFixed(2), pendingX, yPosition);
    // doc.text((row).amount.toFixed(2), amountX, yPosition);
    yPosition += 20;
  });

  // Add totals
  yPosition += 20;
  doc.text('Subtotal', 380, yPosition);
//   doc.text(data.subtotal.toFixed(2), amountX, yPosition);
  
  yPosition += 20;
  doc.text(`Total Sales Tax ${data.taxRate}%`, 380, yPosition);
//   doc.text(data.totalTax.toFixed(2), amountX, yPosition);
  
  yPosition += 20;
  doc.font('Helvetica-Bold');
  doc.text('Amount Due USD', 380, yPosition);
//   doc.text(data.amountDue.toFixed(2), amountX, yPosition);

  // Finalize the PDF and end the stream
  doc.end();
};

module.exports = exportpdf;
