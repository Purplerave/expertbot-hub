const { CohereClient } = require('cohere-ai');
const NodeCache = require('node-cache');
const { botConfigs } = require('../config/botConfigs');

const myCache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); // Cache por 10 minutos (600 segundos)

class CohereService {
  constructor() {
    this.cohere = new CohereClient({
      token: process.env.COHERE_API_KEY || 'WKbM0OWPWAqT9mbDRu0aeVYtTyOFvkAtK07pCR6H',
    });
  }

  async generateResponse(model, prompt, maxLength = 250) {
    const cacheKey = `cohere-${model}-${prompt}-${maxLength}`;
    const cachedResponse = myCache.get(cacheKey);
    if (cachedResponse) {
      console.log('Respuesta de Cohere obtenida de la caché.');
      return cachedResponse;
    }

    try {
      const response = await this.cohere.generate({
        model: model,
        prompt: prompt,
        max_tokens: maxLength,
        temperature: 0.7,
        stop_sequences: ['\nUsuario:', '\nAssistant:'], // Para controlar la longitud de la respuesta
      });

      console.log('Cohere API Full Response Object:', response);
      
      if (response && response.generations && response.generations.length > 0) {
        const generatedText = response.generations[0].text.trim();
        myCache.set(cacheKey, generatedText);
        return generatedText;
      } else {
        console.error('Cohere API Error: Respuesta inesperada de la API.', response);
        return "Disculpa, la IA no pudo generar una respuesta válida.";
      }
      
    } catch (error) {
      console.error('Cohere API Error:', error);
      return "Disculpa, hay un problema técnico con la IA. Inténtalo de nuevo.";
    }
  }

  async chatWithBot(botId, message, conversationHistory = []) {
    const botConfig = botConfigs[botId];
    if (!botConfig) {
      throw new Error('Bot no encontrado');
    }

    let conversationContext = '';
    if (conversationHistory.length > 0) {
      conversationContext = conversationHistory
        .slice(-4) 
        .map(msg => `${msg.role === 'user' ? 'Usuario' : botConfig.name}: ${msg.content}`)
        .join('\n');
    }

    const fullPrompt = `${botConfig.prompt}
    
Conversación previa:
${conversationContext}

Usuario: ${message}

${botConfig.name}:`;

    // Usar el modelo de Cohere, que es 'command' o 'command-light'
    // Por ahora, usaremos 'command' para todos los bots.
    return await this.generateResponse('command', fullPrompt, 250);
  }
}

module.exports = new CohereService();