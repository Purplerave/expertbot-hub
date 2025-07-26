const { GoogleGenerativeAI } = require('@google/generative-ai');
const NodeCache = require('node-cache');
const { botConfigs } = require('../config/botConfigs');
const fetch = require('node-fetch'); // Necesario para la llamada directa a la API REST de modelos

const myCache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); // Cache por 10 minutos (600 segundos)

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      // Usar la clave hardcodeada si no está en las variables de entorno (solo para desarrollo)
      this.apiKey = 'AIzaSyASJ7Fn_rsjGZKXePQAUdXQADhr6qNliE8'; 
      console.warn('Advertencia: GEMINI_API_KEY no definida en .env, usando clave hardcodeada.');
    } else {
      this.apiKey = process.env.GEMINI_API_KEY;
    }
    this.genAI = new GoogleGenerativeAI(this.apiKey);
  }

  /**
   * Obtiene una instancia de un modelo generativo específico.
   * @param {string} modelName - El nombre del modelo (ej. 'gemini-pro').
   * @returns La instancia del modelo.
   */
  getModel(modelName = 'gemini-pro') {
    return this.genAI.getGenerativeModel({ model: modelName });
  }

  async generateResponse(modelName, contents, maxLength = 200) {
    console.log('Iniciando generateResponse para modelo:', modelName);
    console.log('Contenido enviado a generateResponse:', JSON.stringify(contents, null, 2));
    const cacheKey = `gemini-${modelName}-${JSON.stringify(contents)}-${maxLength}`;
    const cachedResponse = myCache.get(cacheKey);
    if (cachedResponse) {
      console.log('Respuesta de Gemini obtenida de la caché.');
      return cachedResponse;
    }

    try {
      const geminiModel = this.getModel(modelName);
      
      const timeoutPromise = new Promise((resolve, reject) => {
        const id = setTimeout(() => {
          clearTimeout(id);
          reject(new Error('Gemini API Timeout: La IA tardó demasiado en responder.'));
        }, 30000); // 30 segundos de timeout
      });

      const resultPromise = geminiModel.generateContent({
        contents: contents,
        generationConfig: {
          temperature: 0.5, // Ajustado a 0.5
          maxOutputTokens: maxLength,
        },
      });

      const result = await Promise.race([resultPromise, timeoutPromise]);
      const response = await result.response;
      
      if (response && response.text) {
        const generatedText = response.text().trim();
        myCache.set(cacheKey, generatedText);
        return generatedText;
      } else {
        console.error('Gemini API Error: Respuesta inesperada de la API.', response);
        return "Disculpa, la IA no pudo generar una respuesta válida.";
      }
      
    } catch (error) {
      console.error('Gemini API Error:', error);
      return "Disculpa, hay un problema técnico con la IA. Inténtalo de nuevo.";
    }
  }

  async chatWithBot(botId, message, conversationHistory = []) {
    const botConfig = botConfigs[botId];
    if (!botConfig) {
      throw new Error('Bot no encontrado');
    }

    let contents = [];
    // Añadir el prompt del bot como primer mensaje del usuario
    contents.push({ role: 'user', parts: [{ text: botConfig.prompt }] });

    // Añadir el historial de conversación
    if (conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model', // Gemini usa 'model' para las respuestas del bot
          parts: [{ text: msg.content }]
        });
      });
    }

    // Añadir el mensaje actual del usuario
    contents.push({ role: 'user', parts: [{ text: message }] });

    // console.log('Contents enviados a Gemini:', JSON.stringify(contents, null, 2)); // Para depuración

    // Usar el modelo configurado en botConfigs, o 'models/gemma-3-4b-it' por defecto
    return await this.generateResponse(botConfig.model || 'models/gemma-3-4b-it', contents, 200); // maxLength ajustado a 200
  }
}

module.exports = new GeminiService();
