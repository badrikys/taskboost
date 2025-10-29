const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Telegram API configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

// Function to send message to Telegram
async function sendToTelegram(message) {
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

// API endpoint to handle form submissions
app.post('/api/submit-lead', async (req, res) => {
  try {
    const { name, city, profile, contact_method, contact, notes } = req.body;

    // Validate required fields
    if (!name || !city || !profile || !contact_method || !contact) {
      return res.status(400).json({
        success: false,
        message: 'Пожалуйста, заполните все обязательные поля'
      });
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
    res.json({
      success: true,
      message: 'Заявка успешно отправлена! Мы свяжемся с вами в течение 24 часов.'
    });

  } catch (error) {
    console.error('Error processing lead:', error);
    res.status(500).json({
      success: false,
      message: 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📱 Telegram Bot Token: ${TELEGRAM_BOT_TOKEN ? '✓ Set' : '✗ Not set'}`);
  console.log(`💬 Telegram Chat ID: ${TELEGRAM_CHAT_ID ? '✓ Set' : '✗ Not set'}`);
});
