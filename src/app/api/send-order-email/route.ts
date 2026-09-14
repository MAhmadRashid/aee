import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { orderNumber, email, name, total, paymentMethod } = await req.json();

    // Create a generic test account on ethereal.email if no SMTP config is provided
    let transporter;
    
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Fallback for development testing
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 40px; border-radius: 8px;">
        <h1 style="text-align: center; color: #d4af37; font-size: 28px; letter-spacing: 2px;">ZERO TO ONE</h1>
        <hr style="border: 1px solid #333; margin: 20px 0;" />
        
        <h2 style="font-size: 20px;">Order Confirmation</h2>
        <p>Dear ${name},</p>
        <p>Thank you for choosing Zero to One. Your luxury experience is being prepared.</p>
        
        <div style="background-color: #111; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Order Number:</strong> ${orderNumber}</p>
          <p style="margin: 5px 0;"><strong>Total Amount:</strong> Rs. ${total}</p>
          <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
        </div>
        
        <p style="color: #aaa; font-size: 12px; text-align: center; margin-top: 40px;">
          This is an automated message. Please do not reply directly to this email.
        </p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: '"Zero to One Luxury" <no-reply@zerotoone.com>',
      to: email,
      subject: `Order Confirmed - ${orderNumber}`,
      html: htmlContent,
    });

    console.log("Message sent: %s", info.messageId);
    
    // In ethereal, we can get a preview URL
    if (!process.env.SMTP_USER) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}
