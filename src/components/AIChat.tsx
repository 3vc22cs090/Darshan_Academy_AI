import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, User, Bot, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openAIChat', handleOpen);
    return () => window.removeEventListener('openAIChat', handleOpen);
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant for Darshan LMS. How can I help you with your learning journey today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Connect to the Hugging Face Space
      // @ts-ignore
      const { Client } = await import('https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js');
      const client = await Client.connect("Kiran143/LMS_AI");
      
      const result = await client.predict("/respond", { 		
        message: input, 		
        system_message: "You are a friendly Chatbot.", 		
        max_tokens: 512, 		
        temperature: 0.7, 		
        top_p: 0.95, 
      });

      const aiText = result.data[0];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText || "I'm sorry, I couldn't process that request.",
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting to my brain right now. Please try again later.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button 
          className="chat-trigger glass"
          onClick={() => setIsOpen(true)}
          title="Chat with AI"
        >
          <Sparkles size={24} className="sparkle-icon" />
          <span>Chat with AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window glass">
          <div className="chat-header">
            <div className="header-info">
              <div className="ai-avatar">
                <Sparkles size={16} />
              </div>
              <div>
                <h3>AI Assistant</h3>
                <span className="status">Online</span>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="messages-container">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                <div className="avatar">
                  {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className="message-bubble">
                  <p>{msg.text}</p>
                  <span className="timestamp">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message-wrapper ai">
                <div className="avatar">
                  <Bot size={16} />
                </div>
                <div className="message-bubble typing">
                  <Loader2 size={16} className="animate-spin" />
                  <span>AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              placeholder="Ask anything about our courses..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="send-btn" onClick={handleSend} disabled={!input.trim() || isTyping}>
              <Send size={20} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        .chat-trigger {
          position: fixed;
          bottom: 30px;
          right: 30px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          border-radius: 100px;
          cursor: pointer;
          z-index: 1000;
          transition: all 0.3s ease;
          color: white;
          font-weight: 700;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .chat-trigger:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          background: rgba(255, 255, 255, 0.15);
        }

        .sparkle-icon {
          color: #FFD700;
          filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
        }

        .chat-window {
          position: fixed;
          bottom: 100px;
          right: 30px;
          width: 400px;
          height: 600px;
          display: flex;
          flex-direction: column;
          z-index: 1000;
          overflow: hidden;
          animation: slideIn 0.3s ease-out;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(20, 20, 30, 0.95) !important;
        }

        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .chat-header {
          padding: 15px 20px;
          background: rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ai-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #6e8efb, #a777e3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .chat-header h3 {
          font-size: 16px;
          margin: 0;
          font-weight: 700;
        }

        .status {
          font-size: 11px;
          color: #4ade80;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .status::before {
          content: '';
          display: block;
          width: 6px;
          height: 6px;
          background: currentColor;
          border-radius: 50%;
        }

        .close-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          transition: color 0.2s;
        }

        .close-btn:hover {
          color: white;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .messages-container::-webkit-scrollbar {
          width: 6px;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .message-wrapper {
          display: flex;
          gap: 12px;
          max-width: 85%;
        }

        .message-wrapper.user {
          flex-direction: row-reverse;
          align-self: flex-end;
        }

        .message-wrapper.ai {
          align-self: flex-start;
        }

        .avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
          flex-shrink: 0;
        }

        .message-bubble {
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 14px;
          position: relative;
        }

        .user .message-bubble {
          background: #4b1a78;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .ai .message-bubble {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
          border-bottom-left-radius: 4px;
        }

        .timestamp {
          display: block;
          font-size: 10px;
          margin-top: 5px;
          opacity: 0.5;
        }

        .typing {
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0.7;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .chat-input-area {
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .chat-input-area input {
          flex: 1;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px 16px;
          color: white;
          outline: none;
          transition: border-color 0.2s;
        }

        .chat-input-area input:focus {
          border-color: rgba(255, 255, 255, 0.3);
        }

        .send-btn {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: white;
          color: #1a0a2a;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .send-btn:hover:not(:disabled) {
          transform: scale(1.05);
          background: #f0f0f0;
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.5);
        }

        @media (max-width: 500px) {
          .chat-window {
            width: calc(100vw - 40px);
            right: 20px;
            bottom: 90px;
            height: 500px;
          }
          .chat-trigger {
            bottom: 20px;
            right: 20px;
          }
        }
      `}</style>
    </>
  );
};

export default AIChat;
