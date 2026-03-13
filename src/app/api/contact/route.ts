import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, phone, service, message } = await request.json();

    // Валидация
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Отправка email через Resend
    const emailData = {
      from: `Globe Audit Hub <${process.env.FROM_EMAIL || 'onboarding@resend.dev'}>`,
      to: 'intelligent.swallow.aybm@mask.me',
      replyTo: email,
      subject: `Новая заявка: ${service} от ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #3b82f6;">📬 Новая заявка с сайта</h2>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Информация о клиенте:</h3>
            <p><strong>Имя:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Телефон:</strong> ${phone || 'Не указан'}</p>
            <p><strong>Услуга:</strong> ${service}</p>
          </div>
          
          <div style="background: #e0e7ff; padding: 20px; border-radius: 8px;">
            <h3 style="margin-top: 0;">Сообщение:</h3>
            <p style="white-space: pre-wrap;">${message || 'Без сообщения'}</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            Заявка отправлена с сайта Globe Audit Hub<br>
            ${new Date().toLocaleString('ru-RU')}
          </p>
        </div>
      `
    };

    const emailResult = await resend.emails.send(emailData);

    // Авто-ответ клиенту
    if (email) {
      await resend.emails.send({
        from: `Globe Audit Hub <${process.env.FROM_EMAIL || 'onboarding@resend.dev'}>`,
        to: email,
        subject: 'Ваша заявка принята',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2 style="color: #3b82f6;">Здравствуйте, ${name}! 👋</h2>
            
            <p>Благодарим за обращение в Globe Audit Hub!</p>
            
            <p>Ваша заявка успешно отправлена. Наш менеджер свяжется с вами в течение 15 минут в рабочее время.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Детали заявки:</h3>
              <p><strong>Услуга:</strong> ${service}</p>
              <p><strong>Дата:</strong> ${new Date().toLocaleString('ru-RU')}</p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              С уважением,<br>
              Команда Globe Audit Hub
            </p>
          </div>
        `
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
