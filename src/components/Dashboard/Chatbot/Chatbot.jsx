import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRef = useRef(null);
  

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const userMessage = { role: "user", content: inputMessage };
    setMessages([...messages, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    
    try {
      const botResponses = [
        "I'm here to help you with your planning and tasks!",
        "Need help organizing your day? Try using the Focus mode feature.",
        "You can add tasks by using the 'Add Task' button on the Tasks page.",
        "Try categorizing your tasks by priority to stay organized.",
        "Remember to take breaks between focus sessions for optimal productivity.",
        "You can view your task statistics in the Analytics section.",
        "Need to remember something? Try adding it as a note in the Notes section."
      ];
      

      await new Promise(resolve => setTimeout(resolve, 1000));
      

      let botResponse = "";
      
      if (inputMessage.toLowerCase().includes("hello") || inputMessage.toLowerCase().includes("hi")) {
        botResponse = "Hello there! How can I help you today?";
      } else if (inputMessage.toLowerCase().includes("task")) {
        botResponse = "To manage tasks, go to the Tasks page and use the 'Add Task' button. You can set priorities and deadlines.";
      } else if (inputMessage.toLowerCase().includes("focus")) {
        botResponse = "The Focus mode helps you stay productive using the Pomodoro technique. Try 25 minutes of focus followed by a 5-minute break.";
      } else if (inputMessage.toLowerCase().includes("note")) {
        botResponse = "You can create and manage notes in the Notes section. It's great for keeping track of ideas and information.";
      } else {
        botResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      }
      
      const botMessage = { role: "assistant", content: botResponse };
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage = { 
        role: "assistant", 
        content: "Sorry, I'm having trouble right now. Please try again later."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg w-80 h-96 flex flex-col overflow-hidden border border-gray-200">

          <div className="bg-[#2190ff] text-white p-3 flex justify-between items-center">
            <div className="flex items-center">
              <Bot size={20} className="mr-2" />
              <span className="font-medium">Assistant</span>
            </div>
            <button onClick={toggleChat} className="hover:bg-blue-600 rounded-full p-1">
              <X size={18} />
            </button>
          </div>
          

          <div className="flex-1 p-3 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">
                <Bot size={36} className="mx-auto mb-2" />
                <p>How can I help you today?</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`mb-3 ${msg.role === "user" ? "text-right" : "text-left"}`}
                >
                  <div 
                    className={`inline-block px-3 py-2 rounded-lg max-w-[80%] ${
                      msg.role === "user" 
                        ? "bg-blue-500 text-white rounded-br-none" 
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="text-left mb-3">
                <div className="inline-block px-3 py-2 bg-gray-100 rounded-lg rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: "0.2s"}}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: "0.4s"}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 flex">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="bg-[#2190ff] text-white px-3 py-2 rounded-r-lg hover:bg-blue-600 disabled:bg-blue-300"
              disabled={!inputMessage.trim() || isLoading}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-[#2190ff] hover:bg-blue-600 text-white p-3 rounded-full flex items-center shadow-lg transition-colors"
        >
          <Bot size={24} />
        </button>
      )}
    </div>
  );
};

export default Chatbot;