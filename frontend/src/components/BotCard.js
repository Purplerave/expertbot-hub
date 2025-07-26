import React from 'react';

function BotCard({ bot, onSelect }) {
  return (
    <div 
      className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1"
      onClick={onSelect}
      style={{ borderColor: 'transparent' }} // Para que el borde no mueva el layout
      onMouseEnter={(e) => e.currentTarget.style.borderColor = bot.color}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
    >
      <div 
        className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4"
        style={{ backgroundColor: bot.color + '20' }}
        dangerouslySetInnerHTML={{ __html: bot.icon }}
      />
      <h3 className="text-xl font-bold text-gray-900 mb-2">{bot.name}</h3>
      <p className="text-gray-600 flex-grow">{bot.description}</p>
    </div>
  );
}

export default BotCard;
