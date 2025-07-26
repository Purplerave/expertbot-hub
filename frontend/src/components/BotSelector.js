import React from 'react';
import BotCard from './BotCard';

function BotSelector({ bots, onSelectBot }) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-gray-900">
          Elige tu Experto IA
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Cada bot está especializado en su área para darte la mejor ayuda posible
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bots.map((bot) => (
          <BotCard
            key={bot.id}
            bot={bot}
            onSelect={() => onSelectBot(bot.id)}
          />
        ))}
      </div>

      <div className="text-center mt-12">
        <div className="inline-block bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
          <div className="text-2xl mb-2">&#128640;</div>
          <h3 className="font-semibold text-gray-900 mb-1">
            Próximamente más expertos
          </h3>
          <p className="text-sm text-gray-600">
            PetCare, StudyBuddy, TechSupport y más...
          </p>
        </div>
      </div>
    </div>
  );
}

export default BotSelector;
