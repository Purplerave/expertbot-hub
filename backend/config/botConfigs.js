const {
    plantGuruPrompt,
    styleBotPrompt,
    chefAIPrompt,
    fitCoachPrompt,
    homeHelperPrompt,
    moneyWisePrompt
} = require('./botPrompts');

const botConfigs = {
  flora: {
    id: 'flora',
    name: 'Flora',
    icon: '&#127811;', // Emoji de planta
    description: 'Experto en jardinería y cuidado de plantas',
    color: '#22c55e',
    model: 'models/gemma-3-4b-it',
    prompt: plantGuruPrompt,
    suggestions: [
      '¿Por qué se amarillean las hojas de mi planta?',
      '¿Cómo cuidar una suculenta?',
      'Mi planta tiene bichos pequeños, ¿qué hago?',
      '¿Cuándo debo regar mi potus?'
    ],
    welcomeMessage: '¡Hola! 🌱 Soy Flora, tu experta en jardinería. ¿Qué planta necesita ayuda hoy?'
  },
  
  stylo: {
    id: 'stylo',
    name: 'Stylo',
    icon: '&#10024;', // Emoji de chispas
    description: 'Consultor de moda y estilo personal',
    color: '#ec4899',
    model: 'models/gemma-3-4b-it',
    prompt: styleBotPrompt,
    suggestions: [
      '¿Qué me pongo para una primera cita?',
      'Ayúdame a combinar esta camisa azul',
      'Outfit casual para el trabajo',
      '¿Cómo vestirme para una boda?'
    ],
    welcomeMessage: '¡Hey! ✨ Soy Stylo, tu consultor de moda personal. ¿Qué look creamos hoy?'
  },
  
  delish: {
    id: 'delish',
    name: 'Delish',
    icon: '&#127859;', // Emoji de chef
    description: 'Asistente culinario y recetas personalizadas',
    color: '#f59e0b',
    model: 'models/gemma-3-4b-it',
    prompt: chefAIPrompt,
    suggestions: [
      'Tengo pollo y verduras, ¿qué cocino?',
      'Receta fácil para principiantes',
      '¿Cómo hacer pasta carbonara?',
      'Cena romántica en 30 minutos'
    ],
    welcomeMessage: '¡Hola chef! 👨‍🍳 Soy Delish. Cuéntame qué ingredientes tienes y creamos algo delicioso.'
  },
  
  pulse: {
    id: 'pulse',
    name: 'Pulse',
    icon: '&#127947;‍&#9792;', // Emoji de fitness
    description: 'Entrenador personal y rutinas de ejercicio',
    color: '#ef4444',
    model: 'models/gemma-3-4b-it',
    prompt: fitCoachPrompt,
    suggestions: [
      'Rutina de 20 minutos en casa',
      '¿Cómo empezar a hacer ejercicio?',
      'Ejercicios para fortalecer la espalda',
      'Plan de entrenamiento para principiantes'
    ],
    welcomeMessage: '¡Hola atleta! 🏋️‍♀️⚡ Soy Pulse, tu entrenador personal. ¿Listos para ponernos en forma?'
  },
  
  domus: {
    id: 'domus',
    name: 'Domus',
    icon: '&#128736;', // Emoji de herramientas
    description: 'Especialista en bricolaje y reparaciones',
    color: '#8b5cf6',
    model: 'models/gemma-3-4b-it',
    prompt: homeHelperPrompt,
    suggestions: [
      '¿Cómo arreglar una llave que gotea?',
      'Mi interruptor no funciona',
      'Quiero colgar un cuadro en la pared',
      '¿Cómo pintar una habitación?'
    ],
    welcomeMessage: '¡Hola! 🛠️ Soy Domus, tu experto en reparaciones. ¿Qué vamos a arreglar hoy?'
  },
  
  kash: {
    id: 'kash',
    name: 'Kash',
    icon: '&#128176;', // Emoji de dinero
    description: 'Consejero en finanzas personales básicas',
    color: '#10b981',
    model: 'models/gemma-3-4b-it',
    prompt: moneyWisePrompt,
    suggestions: [
      '¿Cómo hacer un presupuesto mensual?',
      'Tips para ahorrar dinero',
      '¿Cómo salir de deudas?',
      'Primeros pasos para invertir'
    ],
    welcomeMessage: '¡Hola! 💰 Soy Kash, tu consejero financiero. ¿Cómo podemos mejorar tus finanzas?'
  }
};

module.exports = { botConfigs };
