import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        const { firstName, lastName, email, phone, message } = await request.json();

        if (!firstName || !lastName || !email || !message) {
            return new Response(JSON.stringify({ message: 'Missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"Contact Form" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `New message from ${firstName} ${lastName}`,
            html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
        };

        await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({ message: 'Message sent successfully!' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return new Response(JSON.stringify({ message: 'Failed to send message' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}