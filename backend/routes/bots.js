const express = require('express');
const router = express.Router();
const { botConfigs } = require('../config/botConfigs');

// GET /api/bots
router.get('/', (req, res) => {
  const botsList = Object.values(botConfigs).map(bot => ({
    id: bot.id,
    name: bot.name,
    icon: bot.icon,
    description: bot.description,
    color: bot.color,
    suggestions: bot.suggestions,
    welcomeMessage: bot.welcomeMessage
  }));

  res.json(botsList);
});

// GET /api/bots/:botId
router.get('/:botId', (req, res) => {
  const { botId } = req.params;
  const bot = botConfigs[botId];

  if (!bot) {
    return res.status(404).json({ 
      error: 'Bot no encontrado' 
    });
  }

  res.json({
    id: bot.id,
    name: bot.name,
    icon: bot.icon,
    description: bot.description,
    color: bot.color,
    suggestions: bot.suggestions,
    welcomeMessage: bot.welcomeMessage
  });
});

module.exports = router;
