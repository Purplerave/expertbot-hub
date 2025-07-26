const express = require('express');
const router = express.Router();
const geminiService = require('../services/gemini');
const { botConfigs } = require('../config/botConfigs');

// POST /api/chat
router.post('/', async (req, res) => {
  console.log('Solicitud de chat recibida.');
  try {
    const { botId, message, conversationHistory = [] } = req.body;

    if (!botId || !message) {
      return res.status(400).json({ 
        error: 'Bot ID y mensaje son requeridos' 
      });
    }

    if (!botConfigs[botId]) {
      return res.status(404).json({ 
        error: 'Bot no encontrado' 
      });
    }

    const response = await geminiService.chatWithBot(
      botId, 
      message, 
      conversationHistory
    );

    res.json({
      botId,
      response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

module.exports = router;
