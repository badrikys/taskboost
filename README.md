# Taskboost - Landing Page с интеграцией Telegram

Лендинг для продвижения профилей на Taskrabbit с автоматической отправкой заявок в Telegram.

## ⚡ БЫСТРЫЙ СТАРТ (рекомендуется)

### Вариант 1: Деплой на Vercel (САМЫЙ ПРОСТОЙ) ⭐

1. Зарегистрируйтесь на [Vercel](https://vercel.com) (бесплатно)
2. Нажмите **"New Project"**
3. Импортируйте репозиторий с GitHub
4. Vercel автоматически определит настройки
5. Нажмите **"Deploy"**

**Готово!** Ваш сайт будет работать с Telegram интеграцией через 1-2 минуты.

### Вариант 2: Деплой на Netlify

1. Зарегистрируйтесь на [Netlify](https://netlify.com) (бесплатно)
2. Нажмите **"Add new site" → "Import an existing project"**
3. Выберите ваш GitHub репозиторий
4. Netlify автоматически определит настройки из `netlify.toml`
5. Нажмите **"Deploy site"**

**Готово!** Ваш сайт будет работать автоматически.

### ⚠️ ВАЖНО: Почему заявки не отправляются?

Если вы опубликовали сайт на **GitHub Pages** или **обычном хостинге** - заявки **НЕ БУДУТ** отправляться в Telegram, потому что:

- GitHub Pages поддерживает только **статические HTML файлы**
- Для работы с Telegram нужен **backend сервер** или **serverless функции**

**Решение:** Используйте Vercel или Netlify (см. выше) - они бесплатные и работают "из коробки".

---

## 🚀 Возможности

- ✅ Адаптивный дизайн (desktop, tablet, mobile)
- ✅ Форма заявки с отправкой в Telegram
- ✅ Валидация полей формы
- ✅ Красивые уведомления об успехе/ошибке
- ✅ Автоматическая отправка уведомлений в Telegram группу
- ✅ Работает на serverless платформах (Vercel, Netlify)

## 📋 Требования

**Для serverless (Vercel/Netlify):**
- Аккаунт на Vercel или Netlify (бесплатно)
- Telegram бот токен
- ID группы в Telegram

**Для локальной разработки:**
- Node.js (версия 14 или выше)
- npm или yarn

## 🔧 Установка

1. Клонируйте репозиторий:
```bash
git clone <your-repo-url>
cd taskboost
```

2. Установите зависимости:
```bash
npm install
```

3. Настройте переменные окружения:
Файл `.env` уже создан с вашими данными:
```env
TELEGRAM_BOT_TOKEN=8034247997:AAGtAbPtsw03xVq_rzChJZ6P43Bh0nPj2zw
TELEGRAM_CHAT_ID=-4717256214
PORT=3000
```

## 🎯 Запуск

### Режим разработки
```bash
npm start
```

Сайт будет доступен по адресу: `http://localhost:3000`

### Production

Для production рекомендуется использовать PM2 или аналогичный процесс-менеджер:

```bash
# Установка PM2
npm install -g pm2

# Запуск
pm2 start server.js --name taskboost

# Автозапуск при перезагрузке системы
pm2 startup
pm2 save
```

## 📱 Настройка Telegram бота

### 1. Создание бота (если еще не создан)

1. Откройте Telegram и найдите [@BotFather](https://t.me/BotFather)
2. Отправьте команду `/newbot`
3. Следуйте инструкциям и получите токен бота
4. Сохраните токен в файле `.env`

### 2. Добавление бота в группу

1. Создайте группу в Telegram (если еще не создана)
2. Добавьте вашего бота в группу
3. Сделайте бота администратором группы (важно!)
4. Получите ID группы одним из способов:
   - Используйте [@userinfobot](https://t.me/userinfobot)
   - Или отправьте любое сообщение в группу и проверьте через API

### 3. Проверка настроек

Отправьте тестовое сообщение через API:
```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage?chat_id=<YOUR_CHAT_ID>&text=Test"
```

## 📝 Структура проекта

```
taskboost/
├── index.html                      # Главная страница (лендинг)
├── server.js                       # Node.js сервер (для локального запуска)
├── package.json                    # Зависимости проекта
├── .env                           # Переменные окружения (токены, ID)
├── .gitignore                     # Игнорируемые файлы для git
│
├── api/                           # Serverless функции для Vercel
│   └── submit-lead.js             # API endpoint для отправки в Telegram
│
├── netlify/                       # Serverless функции для Netlify
│   └── functions/
│       └── submit-lead.js         # API endpoint для отправки в Telegram
│
├── vercel.json                    # Конфигурация Vercel
├── netlify.toml                   # Конфигурация Netlify
├── img/                           # Изображения
└── README.md                      # Документация
```

### Какой файл используется на какой платформе?

- **Vercel** → использует `api/submit-lead.js` (автоматически)
- **Netlify** → использует `netlify/functions/submit-lead.js` (автоматически)
- **Локальная разработка / VPS** → использует `server.js`

## 🔐 Безопасность

⚠️ **ВАЖНО**:
- Файл `.env` содержит секретные данные и **не должен** коммититься в git
- Файл `.gitignore` уже настроен для игнорирования `.env`
- Для production используйте переменные окружения сервера

## 📧 Формат сообщений в Telegram

При отправке заявки в Telegram приходит сообщение в следующем формате:

```
🎯 Новая заявка с Taskboost!

👤 Имя: Иван Иванов
🏙 Город: Нью-Йорк
🔗 Профиль: https://www.taskrabbit.com/profile/...

✈️ Способ связи: Telegram
📱 Контакт: @username

📝 Заметки:
Хочу увеличить доход, работаю в категории сборка мебели

⏰ Дата: 29.10.2025, 09:34:22
```

## 🛠️ API Endpoints

### POST /api/submit-lead
Отправка новой заявки

**Request Body:**
```json
{
  "name": "Имя",
  "city": "Город",
  "profile": "https://taskrabbit.com/profile/...",
  "contact_method": "telegram|phone|whatsapp|email",
  "contact": "Контактные данные",
  "notes": "Дополнительная информация (опционально)"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Заявка успешно отправлена! Мы свяжемся с вами в течение 24 часов."
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Текст ошибки"
}
```

### GET /api/health
Проверка работоспособности сервера

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-29T06:34:22.000Z"
}
```

## 🐛 Отладка

### Проблемы с отправкой в Telegram

1. Проверьте токен бота:
```bash
curl "https://api.telegram.org/bot<YOUR_TOKEN>/getMe"
```

2. Проверьте права бота в группе (должен быть администратором)

3. Проверьте логи сервера:
```bash
# Если запущен через PM2
pm2 logs taskboost

# Если запущен напрямую
# Логи будут в консоли
```

### Проблемы с формой

1. Откройте Developer Tools в браузере (F12)
2. Перейдите на вкладку Console
3. Отправьте тестовую заявку
4. Проверьте ошибки в консоли

## 📊 Мониторинг

Рекомендуется настроить мониторинг сервера:

```bash
# Статус PM2
pm2 status

# Логи в реальном времени
pm2 logs taskboost --lines 100

# Мониторинг ресурсов
pm2 monit
```

## 🚀 Деплой на VPS/Хостинг

### Вариант 1: Традиционный VPS

1. Подключитесь к серверу:
```bash
ssh user@your-server.com
```

2. Клонируйте проект и установите зависимости (см. раздел "Установка")

3. Настройте nginx как reverse proxy:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. Запустите через PM2:
```bash
pm2 start server.js --name taskboost
pm2 startup
pm2 save
```

### Вариант 2: Heroku

1. Создайте файл `Procfile`:
```
web: node server.js
```

2. Деплой:
```bash
heroku create taskboost
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set TELEGRAM_CHAT_ID=your_chat_id
git push heroku main
```

### Вариант 3: Vercel / Netlify

Потребуется адаптация под serverless функции. Рекомендуется использовать VPS для этого проекта.

## 📞 Поддержка

Если возникли вопросы или проблемы, создайте issue в репозитории.

## 📄 Лицензия

ISC

---

**Разработано для Taskboost** 🚀
