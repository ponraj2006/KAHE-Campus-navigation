import React, { useState, useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatPills from './ChatPills';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import { QUICK_PILLS, INITIAL_MESSAGES } from '../../data/chatbotData';
import { getSmartBotResponse } from '../../services/chatApi';
import kaheLogo from '../../../assets/LOGO.png';
import '../../../styles/chatbot.css';
import '../../../styles/chatbot-extras.css'; // staff cards + map button

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const responseTimersRef = useRef(new Set());

  // Room number the bot is waiting to place in a block (set when it asks "which block?").
  // It is sent with the next message so that a click on "S Block" completes the question.
  const pendingRef = useRef(null);

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

    // Short delay before the request (it was 750 ms; the model's own time is added on top)
    const timerId = window.setTimeout(async () => {
      responseTimersRef.current.delete(timerId);

      try {
        // Send the saved room number along with the message
        const responseData = await getSmartBotResponse(userText, pendingRef.current);

        // Save it again only if the bot is still waiting for a block
        pendingRef.current = responseData.pending || null;

        const botMsg = {
          id: Date.now() + 1,
          sender: 'bot',
          text: responseData.text,
          details: responseData.details,
          actions: responseData.actions,      // block names -> clickable menu
          staff: responseData.staff,          // staff contact cards
          destination: responseData.destination, // Google Maps button
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, botMsg]);
      } catch (error) {
        pendingRef.current = null;
        setMessages((prev) => [...prev, {
          id: Date.now() + 1,
          sender: 'bot',
          text: error.message || 'Sorry, I could not generate a reply right now.',
          details: [],
          actions: [],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } finally {
        setIsTyping(responseTimersRef.current.size > 0);
      }
    }, 300);
    responseTimersRef.current.add(timerId);
  };

  return (
    <div className="kahe-chatbot-wrapper">
      {/* Expanded Chatbot Modal */}
      {isOpen && (
        <div className="kahe-chat-window animate-slide-up">
          <ChatHeader
            onClose={() => setIsOpen(false)}
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
                isLatest={msg.id === messages[messages.length - 1].id}
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
          <img className="launcher-logo" src={kaheLogo} alt="" />
        </div>
      </button>
    </div>
  );
}
