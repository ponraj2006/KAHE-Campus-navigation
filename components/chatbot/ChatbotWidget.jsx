import React, { useState, useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatPills from './ChatPills';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import { QUICK_PILLS, INITIAL_MESSAGES, getSmartBotResponse } from '../../data/botKnowledge';
import '../../styles/chatbot.css';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const responseTimersRef = useRef(new Set());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isTyping, isOpen]);

  useEffect(() => () => {
    responseTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
  }, []);

  const handleSendMessage = (userText) => {
    if (!userText.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Realistic bot response delay
    const timerId = window.setTimeout(() => {
      responseTimersRef.current.delete(timerId);
      const responseData = getSmartBotResponse(userText);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: responseData.text,
        details: responseData.details,
        actions: responseData.actions,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(responseTimersRef.current.size > 0);
    }, 750);
    responseTimersRef.current.add(timerId);
  };

  const handleResetChat = () => {
    responseTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    responseTimersRef.current.clear();
    setMessages(INITIAL_MESSAGES);
    setIsTyping(false);
  };

  return (
    <div className="kahe-chatbot-wrapper">
      {/* Expanded Chatbot Modal */}
      {isOpen && (
        <div className="kahe-chat-window animate-slide-up">
          <ChatHeader
            onMinimize={() => setIsOpen(false)}
            onClose={() => setIsOpen(false)}
            onReset={handleResetChat}
          />

          <div className="kahe-chat-body">
            {/* Quick Action Pills at top */}
            <ChatPills
              pills={QUICK_PILLS}
              onSelect={(pillText) => handleSendMessage(pillText)}
            />

            {/* Conversation Flow */}
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onActionClick={(actionLabel) => handleSendMessage(actionLabel)}
              />
            ))}

            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput onSend={handleSendMessage} />
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        className="kahe-floating-launcher"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle KAHE Assistant"
      >
        <div className="launcher-inner">
          <span className="launcher-crest">✦</span>
          <span className="launcher-text">KAHE</span>
        </div>
      </button>
    </div>
  );
}