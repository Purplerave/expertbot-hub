import React, { useState, useEffect } from 'react';
import BotSelector from './components/BotSelector';
import ChatInterface from './components/ChatInterface';
import { getBots } from './services/api';

function App() {
  const [selectedBot, setSelectedBot] = useState(null);
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState({});

  useEffect(() => {
    const loadBots = async () => {
      try {
        const botsData = await getBots();
        setBots(botsData);
      } catch (error) {
        console.error('Error loading bots:', error);
        setError(`No se pudo cargar la lista de bots. Error técnico: ${error.message}. Asegúrate de que el backend (la primera terminal) esté funcionando y refresca la página.`);
      } finally {
        setLoading(false);
      }
    };
    loadBots();
  }, []);

  const handleSelectBot = (botId) => {
    setSelectedBot(botId);
    if (!conversations[botId]) {
      const bot = bots.find(b => b.id === botId);
      setConversations(prev => ({
        ...prev,
        [botId]: [{
          role: 'assistant',
          content: bot?.welcomeMessage || `¡Hola! Soy ${bot?.name}`, // Guardar solo el string HTML
          timestamp: new Date()
        }]
      }));
    }
  };

  const updateConversation = (botId, newMessage) => {
    setConversations(prev => ({
      ...prev,
      [botId]: [...(prev[botId] || []), newMessage]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 mt-4">Cargando ExpertBot Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">&#129302;</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  SkillSphere
                </h1>
                <p className="text-sm text-gray-600">
                  Tu experto IA para cualquier tema
                </p>
                <p className="text-sm text-blue-600 font-semibold mt-1">
                  Límite de uso: 30 solicitudes por minuto. ¡Uso gratuito!
                </p>
              </div>
            </div>
            
            {selectedBot && (
              <button
                onClick={() => setSelectedBot(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                &larr; Cambiar Bot
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error ? (
          <div className="text-center p-8 bg-red-100 text-red-700 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Error de Conexión</h2>
            <p>{error}</p>
          </div>
        ) : !selectedBot ? (
          <BotSelector 
            bots={bots} 
            onSelectBot={handleSelectBot}
          />
        ) : (
          <ChatInterface
            bot={(() => {
              const bot = bots.find(b => b.id === selectedBot);
              return bot ? {
                id: bot.id,
                name: bot.name,
                description: bot.description,
                icon: bot.icon,
                color: bot.color,
                suggestions: bot.suggestions,
                welcomeMessage: bot.welcomeMessage
              } : null;
            })()}
            conversation={conversations[selectedBot] || []}
            onUpdateConversation={(message) => updateConversation(selectedBot, message)}
          />
        )}
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>ExpertBot Hub - Tu asistente IA especializado</p>
          <p className="text-sm mt-2">Desarrollado con &#10084;&#65039; usando tecnología Open Source</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
