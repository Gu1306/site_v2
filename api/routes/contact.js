const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const { Pool } = require('pg');

const router = express.Router();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Email transporter
const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Validation rules
const contactValidation = [
  body('name').notEmpty().trim().isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').isMobilePhone('pt-BR'),
  body('objective').notEmpty().trim(),
  body('message').notEmpty().trim().isLength({ min: 10, max: 1000 })
];

// POST /api/contact
router.post('/', contactValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, objective, message } = req.body;

    // Save to database
    const query = `
      INSERT INTO contacts (name, email, phone, objective, message, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id, created_at
    `;
    const result = await pool.query(query, [name, email, phone, objective, message]);

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'contato@carefitrunbase.com.br',
      subject: `Novo contato: ${objective}`,
      html: `
        <h2>Novo contato recebido</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${phone}</p>
        <p><strong>Objetivo:</strong> ${objective}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${message}</p>
        <hr>
        <p><small>Recebido em: ${new Date().toLocaleString('pt-BR')}</small></p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Mensagem enviada com sucesso!',
      id: result.rows[0].id
    });

  } catch (error) {
    console.error('Erro ao processar contato:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/contact (for admin)
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT id, name, email, phone, objective, message, created_at
      FROM contacts
      ORDER BY created_at DESC
      LIMIT 50
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;