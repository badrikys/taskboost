// Netlify Serverless Function для отправки заявок в Telegram

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8034247997:AAGtAbPtsw03xVq_rzChJZ6P43Bh0nPj2zw';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-4717256214';

// Function to send message to Telegram
async function sendToTelegram(message) {
  const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(TELEGRAM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();

    if (!data.ok) {
      throw new Error(data.description || 'Failed to send message to Telegram');
    }

    return data;
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    throw error;
  }
}

// Format contact method emoji
function getContactMethodEmoji(method) {
  const emojis = {
    phone: '📞',
    telegram: '✈️',
    whatsapp: '💬',
    email: '📧'
  };
  return emojis[method] || '📝';
}

// Format contact method text
function getContactMethodText(method) {
  const texts = {
    phone: 'Звонок',
    telegram: 'Telegram',
    whatsapp: 'WhatsApp',
    email: 'Email'
  };
  return texts[method] || method;
}

// Netlify function handler
exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle OPTIONS request (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Method not allowed'
      })
    };
  }

  try {
    const { name, city, profile, contact_method, contact, notes } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !city || !profile || !contact_method || !contact) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Пожалуйста, заполните все обязательные поля'
        })
      };
    }

    // Format message for Telegram
    const emoji = getContactMethodEmoji(contact_method);
    const methodText = getContactMethodText(contact_method);

    const message = `
🎯 <b>Новая заявка с Taskboost!</b>

👤 <b>Имя:</b> ${name}
🏙 <b>Город:</b> ${city}
🔗 <b>Профиль:</b> ${profile}

${emoji} <b>Способ связи:</b> ${methodText}
📱 <b>Контакт:</b> ${contact}
${notes ? `\n📝 <b>Заметки:</b>\n${notes}` : ''}

⏰ <b>Дата:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'UTC' })}
    `.trim();

    // Send to Telegram
    await sendToTelegram(message);

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Заявка успешно отправлена! Мы свяжемся с вами в течение 24 часов.'
      })
    };

  } catch (error) {
    console.error('Error processing lead:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.'
      })
    };
  }
};
