import React from 'react';

function MessageBubble({ message, botIcon, botColor }) {
  const { role, content, isError } = message;
  const isUser = role === 'user';

  const bubbleClasses = isUser
    ? 'bg-blue-500 text-white self-end'
    : 'bg-gray-200 text-gray-800 self-start';

  const errorClasses = isError ? 'bg-red-100 border border-red-400 text-red-700' : '';

  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          style={{ backgroundColor: botColor + '20' }}
          dangerouslySetInnerHTML={{ __html: botIcon }}
        />
      )}
      <div
        className={`max-w-md lg:max-w-lg px-4 py-2 rounded-lg shadow-sm ${bubbleClasses} ${errorClasses}`}
      >
        <div 
          className="whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}

export default MessageBubble;
