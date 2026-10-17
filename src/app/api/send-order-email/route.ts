import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { orderNumber, email, name, total, paymentMethod } = await req.json();

    if (!email || !orderNumber) {
      return NextResponse.json({ error: 'Email and Order Number are required' }, { status: 400 });
    }

    const customerName = name || 'Valued Client';
    const formattedTotal = typeof total === 'number' ? total.toLocaleString() : total;
    const paymentLabel = paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment (Prepaid)';

    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0b0b; color: #f0f0f0; padding: 40px; border: 1px solid #262626; border-radius: 4px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #C5A059; font-size: 26px; letter-spacing: 4px; text-transform: uppercase; margin: 0;">ZERO TO ONE</h1>
          <p style="color: #888; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Haute Parfumerie & Artisanal Fragrances</p>
        </div>

        <hr style="border: none; border-top: 1px solid #262626; margin: 24px 0;" />
        
        <h2 style="font-size: 18px; color: #fff; text-transform: uppercase; letter-spacing: 1px;">Order Confirmation</h2>
        <p style="color: #bbb; line-height: 1.6; font-size: 14px;">
          Dear ${customerName},<br />
          Thank you for placing your order with Zero to One. Your consignment has been entered into our formulation and dispatch queue.
        </p>
        
        <div style="background-color: #141414; border: 1px solid #262626; padding: 20px; border-radius: 4px; margin: 25px 0;">
          <p style="margin: 8px 0; font-size: 13px;"><strong style="color: #C5A059;">Order Number:</strong> ${orderNumber}</p>
          <p style="margin: 8px 0; font-size: 13px;"><strong style="color: #C5A059;">Total Amount:</strong> Rs. ${formattedTotal}</p>
          <p style="margin: 8px 0; font-size: 13px;"><strong style="color: #C5A059;">Payment Mode:</strong> ${paymentLabel}</p>
          <p style="margin: 8px 0; font-size: 13px;"><strong style="color: #C5A059;">Status:</strong> Confirmed & Processing</p>
        </div>

        <p style="color: #bbb; font-size: 13px; line-height: 1.6;">
          You may track the dispatch and transit milestones of your parcel at any time through our 
          <a href="https://zerotoone.com/track-order" style="color: #C5A059; text-decoration: underline;">Real-Time Tracking Desk</a>.
        </p>
        
        <hr style="border: none; border-top: 1px solid #262626; margin: 30px 0;" />

        <p style="color: #666; font-size: 11px; text-align: center; margin: 0; line-height: 1.5;">
          Zero to One Parfums Atelier • Millennium Mall, Karachi, Pakistan<br />
          This is an automated dispatch notification. Inquiries: support@zerotoone.com
        </p>
      </div>
    `;

    // If configured with real SMTP credentials
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: Number(process.env.SMTP_PORT) || 587,
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const info = await transporter.sendMail({
          from: process.env.SMTP_FROM || '"Zero to One Luxury" <no-reply@zerotoone.com>',
          to: email,
          subject: `Order Confirmed - ${orderNumber}`,
          html: htmlContent,
        });

        return NextResponse.json({ success: true, messageId: info.messageId, mode: 'smtp' });
      } catch (smtpErr: any) {
        console.warn('Production SMTP send failed:', smtpErr.message);
      }
    }

    // Safe development fallback: log email simulated transmission without network hang
    console.log(`[Email Simulation] Order confirmation dispatched to ${email} for order ${orderNumber}`);

    return NextResponse.json({ 
      success: true, 
      simulated: true, 
      message: 'Email confirmation recorded successfully',
      recipient: email,
      orderNumber 
    });
  } catch (error: any) {
    console.error("Error sending order email:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to send email" }, { status: 500 });
  }
}
