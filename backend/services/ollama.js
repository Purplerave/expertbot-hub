const NodeCache = require('node-cache');
const { botConfigs } = require('../config/botConfigs');
const fetch = require('node-fetch'); // Necesario para hacer peticiones HTTP a Ollama

const myCache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); // Cache por 10 minutos (600 segundos)

const OLLAMA_API_URL = 'http://localhost:11434/api/generate'; // URL por defecto de la API de Ollama

class OllamaService {
  constructor() {
    // No se necesita inicialización de API Key para Ollama local
  }

  async generateResponse(model, prompt, maxLength = 150) {
    const cacheKey = `ollama-${model}-${prompt}-${maxLength}`;
    const cachedResponse = myCache.get(cacheKey);
    if (cachedResponse) {
      console.log('Respuesta de Ollama obtenida de la caché.');
      return cachedResponse;
    }

    try {
      const response = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          stream: false, // No usar streaming para simplificar la respuesta
          options: {
            num_predict: maxLength, // Controla la longitud de la respuesta
            temperature: 0.7,
          },
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Ollama API Error: ${response.status} - ${errorBody}`);
      }

      const result = await response.json();
      
      // La respuesta de Ollama para /api/generate tiene el texto en result.response
      if (result && result.response) {
        const generatedText = result.response.trim();
        myCache.set(cacheKey, generatedText);
        return generatedText;
      } else {
        console.error('Ollama API Error: Respuesta inesperada de la API.', result);
        return "Disculpa, la IA no pudo generar una respuesta válida.";
      }
      
    } catch (error) {
      console.error('Ollama API Error:', error);
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

    // Usar el modelo de Ollama que confirmaste que funciona
    return await this.generateResponse('gemma3n:latest', fullPrompt, 100); // Usar el maxLength por defecto de generateResponse
  }
}

module.exports = new OllamaService();