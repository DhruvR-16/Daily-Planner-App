import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Loader2 } from 'lucide-react';


const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you plan your day?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const toggleChatbot = () => setIsOpen(!isOpen);

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !GEMINI_API_KEY) {
      if (!GEMINI_API_KEY) {
        console.error("Gemini API Key is missing.");
        const errorMessage = { id: Date.now() + 1, text: "AI Assistant is not configured. API key is missing.", sender: 'bot', isError: true };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }
      return;
    }

    const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: currentInput }] }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API Error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to get response from AI');
      }

      const data = await response.json();
      
      let botResponseText = "Sorry, I couldn't understand that.";
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
        botResponseText = data.candidates[0].content.parts[0].text;
      }
      
      const botMessage = { id: Date.now() + 1, text: botResponseText, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botMessage]);

    } catch (error) {
      console.error("Error sending message to AI:", error);
      const errorMessage = { id: Date.now() + 1, text: `Error: ${error.message}`, sender: 'bot', isError: true };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChatbot}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 z-50"
        aria-label="Open chatbot"
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-[28rem] bg-white rounded-lg shadow-xl flex flex-col z-50 border border-gray-300">
      <header className="bg-indigo-600 text-white p-3 flex justify-between items-center rounded-t-lg">
        <h3 className="font-semibold text-md">PlanX Assistant</h3>
        <button onClick={toggleChatbot} className="hover:bg-indigo-700 p-1 rounded-full">
          <X size={20} />
        </button>
      </header>

      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] p-2.5 rounded-lg text-sm break-words ${
                msg.sender === 'user'
                  ? 'bg-indigo-500 text-white rounded-br-none'
                  : msg.isError 
                    ? 'bg-red-100 text-red-700 rounded-bl-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 p-2.5 rounded-lg rounded-bl-none inline-flex items-center">
              <Loader2 size={18} className="animate-spin mr-2" />
              <span>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Ask something..."
          className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-r-md disabled:opacity-50"
          disabled={isLoading || !inputValue.trim()}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;