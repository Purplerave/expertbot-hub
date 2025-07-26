const fetch = require('node-fetch');
const { botConfigs } = require('../config/botConfigs');

const HF_API_URL = 'https://api-inference.huggingface.co/models/';

class HuggingFaceService {
  constructor() {
    this.token = process.env.HUGGING_FACE_TOKEN || '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';
    this.validateToken(); // Llamar a la validación al construir el servicio
  }

  async validateToken() {
    if (!this.token) {
      console.warn('Advertencia: No se ha configurado el token de Hugging Face. Las llamadas a la API fallarán.');
      return;
    }
    try {
      const response = await fetch('https://api-inference.huggingface.co/models', {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });
      if (response.ok) {
        console.log('Hugging Face Token Validado: El token es válido para la API de inferencia.');
      } else {
        const errorBody = await response.text();
        console.error(`Error al validar Hugging Face Token: ${response.status} - ${errorBody}`);
        console.error('Asegúrate de que el token sea válido y tenga los permisos correctos (read o write).');
      }
    } catch (error) {
      console.error('Error de red al validar Hugging Face Token:', error.message);
    }
  }

  async generateResponse(model, prompt, maxLength = 200) {
    try {
      const response = await fetch(HF_API_URL + model, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: maxLength,
            temperature: 0.7,
            return_full_text: false,
            do_sample: true,
            top_p: 0.9
          }
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorBody}`);
      }

      const result = await response.json();
      return result[0]?.generated_text || "Lo siento, no pude generar una respuesta.";
      
    } catch (error) {
      console.error('Hugging Face API Error:', error);
      return "Disculpa, hay un problema técnico. Inténtalo de nuevo.";
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

    return await this.generateResponse(botConfig.model, fullPrompt, 250);
  }
}

module.exports = new HuggingFaceService();