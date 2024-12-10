import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import pg from 'pg';
import PDFDocuments from 'pdfkit';
import {PassThrough} from 'stream';
import PDFDocument from 'pdfkit-table';


const {Client} = pg;

const s3 = new S3Client();
const BUCKET_NAME = "quokka-pdf"; // Replace with your bucket name

export const handler = async (event) => {
  try {
    const detail = event.detail;
    const reportId = detail.report_id || 9;

    if (!reportId) {
      throw new Error("Missing report_id in event detail");
    }

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

    console.log(`Generating PDF for report_id: ${reportId}`);

      let users;
      client.connect();
      console.log("Database connected!");
  
      console.log('Starting query!');
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

    const url = await getSignedUrl(s3, new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    }), { expiresIn: 3600 });  // URL valid for 1 hour

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "PDF generated and uploaded", 
                              downloadedURL: url, s3Key }),
    };
  } catch (error) {
    console.error("Error generating or uploading PDF:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate and upload PDF" }),
    };
  }
};
