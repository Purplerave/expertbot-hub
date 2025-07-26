import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { sendMessage } from '../services/api';

function ChatInterface({ bot, conversation, onUpdateConversation }) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [conversation]);

  const handleSendMessage = async (messageText = message) => {
    if (!messageText.trim() || isLoading) return;

    // Create a plain user message object
    const userMessage = {
      role: 'user',
      content: messageText.trim(),
      // Ensure timestamp is a serializable string
      timestamp: new Date().toISOString() 
    };
    
    onUpdateConversation(userMessage);
    setMessage('');
    setIsLoading(true);

    try {
      // Deep copy bot.id to ensure no React object reference is passed
       

      // Ensure conversationHistory contains only plain serializable data
      const serializableConversationHistory = conversation.slice(-8).map(msg => {
        // Create explicitly a new plain object with only necessary properties
        return {
          role: msg.role,
          content: msg.content,
          // Ensure timestamp is a serializable string
          timestamp: msg.timestamp ? new Date(msg.timestamp).toISOString() : undefined 
        };
      });

      try {
        console.log("Bot object before payload construction (JSON.stringify):");
        console.log(JSON.stringify(bot));
      } catch (e) {
        console.error("Error stringifying bot object:", e);
      }
      console.log("Bot object before payload construction:", bot);
      const payload = {
        botId: bot.id,
        message: messageText.trim(),
        conversationHistory: serializableConversationHistory
      };

      console.log("Payload a serializar:", payload); // Añadido para depuración

      const response = await sendMessage(payload);

      // Create a plain bot message object
      const botMessage = {
        role: 'assistant',
        content: response.response,
        // Ensure timestamp is a serializable string
        timestamp: new Date().toISOString() 
      };
      
      onUpdateConversation(botMessage);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Create a plain error message object
      const errorMessage = {
        role: 'assistant',
        content: 'Lo siento, hay un problema técnico. ¿Puedes intentar de nuevo?',
        // Ensure timestamp is a serializable string
        timestamp: new Date().toISOString(), 
        isError: true
      };
      
      onUpdateConversation(errorMessage);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion);
    handleSendMessage(suggestion);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Bot Header */}
      <div className="bg-white rounded-lg shadow-sm border mb-6 p-6">
        <div className="flex items-center space-x-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
            style={{ backgroundColor: bot.color + '20' }}
            dangerouslySetInnerHTML={{ __html: bot.icon }}
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {bot.name}
            </h2>
            <p className="text-gray-600">
              {bot.description}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-lg shadow-sm border flex flex-col" style={{height: '60vh'}}>
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation.map((msg, index) => (
            <MessageBubble
              key={index}
              message={msg}
              botIcon={bot.icon}
              botColor={bot.color}
            />
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {bot.suggestions && conversation.length <= 1 && (
          <div className="p-4 border-t">
            <div className="flex flex-wrap gap-2">
              {bot.suggestions.map((s, i) => (
                <button key={i} onClick={() => handleSuggestionClick(s)} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center bg-white border rounded-lg shadow-sm">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Escribe tu mensaje para ${bot.name}...`}
              className="w-full p-3 resize-none focus:outline-none rounded-l-lg"
              rows="1"
            />
            <button onClick={() => handleSendMessage()} disabled={isLoading || !message.trim()} className="px-6 py-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors">
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
