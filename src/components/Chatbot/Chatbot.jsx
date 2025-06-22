import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Loader2, Bot, User, ExternalLink } from 'lucide-react';
import './ChatbotStyles.css';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm your PlanX assistant. How can I help you plan your day?", 
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const formatMessage = (text) => {
    // Simple URL detection and link formatting
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => 
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="chatbot-link">${url} <svg class="inline w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>`
    );
  };

  const groupMessagesByTime = (messages) => {
    const groups = [];
    let currentGroup = [];
    
    messages.forEach((message, index) => {
      if (index === 0) {
        currentGroup = [message];
      } else {
        const prevMessage = messages[index - 1];
        const timeDiff = message.timestamp - prevMessage.timestamp;
        const isSameSender = message.sender === prevMessage.sender;
        
        // Group messages if they're from the same sender and within 2 minutes
        if (isSameSender && timeDiff < 2 * 60 * 1000) {
          currentGroup.push(message);
        } else {
          groups.push([...currentGroup]);
          currentGroup = [message];
        }
      }
    });
    
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }
    
    return groups;
  };

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const simulateTyping = () => {
    setIsTyping(true);
    return new Promise(resolve => {
      setTimeout(() => {
        setIsTyping(false);
        resolve();
      }, 1000 + Math.random() * 1000); // Random typing duration
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !GEMINI_API_KEY) {
      if (!GEMINI_API_KEY) {
        console.error("Gemini API Key is missing.");
        const errorMessage = { 
          id: Date.now() + 1, 
          text: "AI Assistant is not configured. API key is missing.", 
          sender: 'bot', 
          isError: true,
          timestamp: new Date()
        };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }
      return;
    }

    const userMessage = { 
      id: Date.now(), 
      text: inputValue, 
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      await simulateTyping();

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
      
      const botMessage = { 
        id: Date.now() + 1, 
        text: botResponseText, 
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);

    } catch (error) {
      console.error("Error sending message to AI:", error);
      const errorMessage = { 
        id: Date.now() + 1, 
        text: `Error: ${error.message}`, 
        sender: 'bot', 
        isError: true,
        timestamp: new Date()
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChatbot}
        className="chatbot-fab"
        aria-label="Open chatbot"
      >
        <MessageSquare size={24} />
        <div className="chatbot-fab-pulse"></div>
      </button>
    );
  }

  const messageGroups = groupMessagesByTime(messages);

  return (
    <div className="chatbot-container">
      <header className="chatbot-header">
        <div className="chatbot-header-content">
          <div className="chatbot-avatar">
            <Bot size={20} />
          </div>
          <div className="chatbot-header-text">
            <h3 className="chatbot-title">PlanX Assistant</h3>
            <p className="chatbot-status">Online</p>
          </div>
        </div>
        <button onClick={toggleChatbot} className="chatbot-close-btn">
          <X size={20} />
        </button>
      </header>

      <div className="chatbot-messages">
        {messageGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="message-group">
            <div className={`message-group-container ${group[0].sender === 'user' ? 'user-group' : 'bot-group'}`}>
              <div className="message-avatar">
                {group[0].sender === 'user' ? (
                  <User size={16} />
                ) : (
                  <Bot size={16} />
                )}
              </div>
              <div className="message-group-content">
                {group.map((msg, msgIndex) => (
                  <div
                    key={msg.id}
                    className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'} ${
                      msg.isError ? 'error-message' : ''
                    }`}
                  >
                    <div 
                      className="message-content"
                      dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                    />
                    {msgIndex === group.length - 1 && (
                      <div className="message-timestamp">
                        {formatTime(msg.timestamp)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        {(isLoading || isTyping) && (
          <div className="message-group">
            <div className="message-group-container bot-group">
              <div className="message-avatar">
                <Bot size={16} />
              </div>
              <div className="message-group-content">
                <div className="message bot-message typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chatbot-input-form">
        <div className="chatbot-input-container">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="chatbot-input"
            disabled={isLoading}
            rows="1"
          />
          <button
            type="submit"
            className="chatbot-send-btn"
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;