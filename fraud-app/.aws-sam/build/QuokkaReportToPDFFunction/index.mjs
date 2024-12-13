import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import pg from 'pg';
import PDFDocuments from 'pdfkit';
import {PassThrough} from 'stream';
import PDFDocument from 'pdfkit-table';

const {Client} = pg;

const s3 = new S3Client();
const BUCKET_NAME = "quokka-pdf"; // Replace with your bucket name

export const handler = async (event) => {
  console.log("Lambda Started")

  const reportId = event.queryStringParameters?.report_id || 208;

  const client = new Client({
    host: process.env.Host,
    database: process.env.Name,
    user: process.env.Username,
    password: process.env.Password,
    port: 5432
  })

  if (!client.user || !client.password) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Database credentials are missing' }),
    };
  }

  try {

    console.log("start of test try catch")

    // check if there is already a pdf in the s3 bucket with the same name
    const filename = `reports/${reportId}.pdf`;
    console.log("before headobject command")
    console.log(filename);

    try{
      const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: filename });
      const s3Response = await s3.send(command);
  
      // Stream the response to collect the file content
      const chunks = [];
      for await (const chunk of s3Response.Body) {
        chunks.push(chunk);
      }
      const pdfBuffer = Buffer.concat(chunks);
  
      // Return the PDF file as a base64-encoded string
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${filename}"`,
          "Access-Control-Allow-Origin": "*",
        },
        body: pdfBuffer.toString("base64"),
        isBase64Encoded: true, // Indicate that the response is base64-encoded
      };
    }catch(err){
      console.log("no existing file in database");
      let users;
    client.connect();
    console.log("Database connected!");

    console.log('Starting query!');

    console.log(reportId);

    const { rows } = await client.query('SELECT * FROM "reports" WHERE report_id = $1', [reportId]);

    if(rows.length === 0)
    {
      throw new Error("That report is not found in the database...");
    }

    // check if there is data (rows) in the DB
      console.log("row length is greater than 0")

      const doc = new PDFDocument();
      const stream = new PassThrough();

      let pdfBuffer = [];
      stream.on('data', (chunk) => {
        pdfBuffer.push(chunk);
      });

      doc.pipe(stream);

      console.log("doc pipe stream works")

      // pdf layout
      doc.fontSize(20).font('Helvetica-Bold').text('Report', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12).text(`Report ID: ${reportId}`, { align: 'left' });
      doc.text(`Generated On: ${new Date().toLocaleDateString()}`, { align: 'left' });
      doc.moveDown(2);

      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

      doc.moveDown();
      doc.fontSize(16).text('Report Data', { underline: true });
      doc.moveDown();

      const dataTable = {
        headers: ['Ticket Number', 'Report Type', 'Description', 'Status', 'Priority','Damages'],
        rows: rows.map((row) => [row.ticket_number,
                                 row.report_type,
                                 row.description,
                                 row.status,
                                 row.priority,
                                 row.monetary_damage ]),
      };
      


      await doc.table(dataTable, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(12),
        prepareRow: (row, index) => doc.font('Helvetica').fontSize(10),
      });

      
      /*doc.moveDown(2);
      doc.fontSize(10).text(`Page ${doc.pageNumber}`, 50, 750, {
        align: 'center',
        width: 500,
      });*/

      console.log("content added to pdf")

      doc.end();

      console.log("doc has been ended")
      // Collect the PDF data from the stream
      await new Promise((resolve, reject) => {
        stream.on('end', resolve);
        stream.on('error', reject);
      });

      console.log("promise finished");
  
      pdfBuffer = Buffer.concat(pdfBuffer);

      // Define the S3 object key
    const s3Key = `reports/${reportId}.pdf`;

    // Upload the PDF to S3
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: pdfBuffer,
        ContentType: "application/pdf",
      })
    );

    console.log(`PDF stored in S3 at ${s3Key}`);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="report-${reportId}.pdf"`,
      },
      isBase64Encoded: true,
      body: pdfBuffer.toString('base64'),
    };
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to generate PDF', error: e.message }),
    };
  } finally {
    client.end();
  }
};