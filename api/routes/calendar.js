const express = require('express');
const { google } = require('googleapis');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Google Calendar setup
const calendar = google.calendar('v3');
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/calendar']
});

// Validation rules
const appointmentValidation = [
  body('name').notEmpty().trim().isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').isMobilePhone('pt-BR'),
  body('service').notEmpty().trim(),
  body('datetime').isISO8601(),
  body('duration').isInt({ min: 30, max: 180 })
];

// POST /api/calendar/book
router.post('/book', appointmentValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, service, datetime, duration, notes } = req.body;

    const authClient = await auth.getClient();
    google.options({ auth: authClient });

    const startTime = new Date(datetime);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    // Create calendar event
    const event = {
      summary: `${service} - ${name}`,
      description: `Cliente: ${name}\nTelefone: ${phone}\nEmail: ${email}\n\nObservações: ${notes || 'Nenhuma'}`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      attendees: [
        { email: email }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 }
        ]
      }
    };

    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    const response = await calendar.events.insert({
      calendarId: calendarId,
      resource: event,
      sendUpdates: 'all'
    });

    res.json({
      success: true,
      message: 'Agendamento realizado com sucesso!',
      eventId: response.data.id,
      eventLink: response.data.htmlLink
    });

  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ error: 'Erro ao processar agendamento' });
  }
});

// GET /api/calendar/availability
router.get('/availability', async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: 'Data é obrigatória' });
    }

    const authClient = await auth.getClient();
    google.options({ auth: authClient });

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });

    const events = response.data.items || [];
    const busySlots = events.map(event => ({
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date
    }));

    // Generate available slots based on business hours
    const dayOfWeek = new Date(date).getDay();
    let businessHours;

    if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday to Friday
      businessHours = { start: 6, end: 22 };
    } else if (dayOfWeek === 6) { // Saturday
      businessHours = { start: 7, end: 18 };
    } else { // Sunday
      businessHours = { start: 8, end: 16 };
    }

    const availableSlots = [];
    for (let hour = businessHours.start; hour < businessHours.end; hour++) {
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);
      
      const slotEnd = new Date(date);
      slotEnd.setHours(hour + 1, 0, 0, 0);

      // Check if slot conflicts with existing events
      const isAvailable = !busySlots.some(busy => {
        const busyStart = new Date(busy.start);
        const busyEnd = new Date(busy.end);
        return slotStart < busyEnd && slotEnd > busyStart;
      });

      if (isAvailable) {
        availableSlots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
          label: `${hour.toString().padStart(2, '0')}:00`
        });
      }
    }

    res.json({ availableSlots });

  } catch (error) {
    console.error('Erro ao buscar disponibilidade:', error);
    res.status(500).json({ error: 'Erro ao buscar disponibilidade' });
  }
});

module.exports = router;