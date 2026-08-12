import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, message } = body;

    // Validate inputs
    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // WHATSAPP AUTOMATION - TWILIO / META API INTEGRATION POINT
    // ---------------------------------------------------------
    // To enable actual WhatsApp messages, you need to sign up for a provider (e.g. Twilio)
    // Add your keys to the .env file and uncomment this block.
    /*
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;
    const ADMIN_WHATSAPP_NUMBER = process.env.ADMIN_WHATSAPP_NUMBER; // Your number

    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
      const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      
      await client.messages.create({
        body: `New Consultation Request!\nName: ${firstName} ${lastName || ''}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nMessage: ${message}`,
        from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${ADMIN_WHATSAPP_NUMBER}`
      });
      console.log('WhatsApp notification sent successfully');
    }
    */

    // For now, we will simulate a successful backend process
    console.log('Received contact submission:', body);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json(
      { success: true, message: 'Message received and processed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
