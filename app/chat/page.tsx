"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

const QUICK_PROMPTS = [
  "What is a good snack right now?",
  "My sugar is high, what do I do?",
  "Can I eat a banana?",
  "How to avoid morning spikes?"
];

export default function ChatScreen() {
  const { currentReading, profile } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: `Hi ${profile?.name || 'there'}! I'm Suggy, your AI diabetes coach. Your last reading was ${currentReading} mg/dL. How can I help you today?` }
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

  const generateAIResponse = (query: string): string => {
    const text = query.toLowerCase();
    
    if (text.includes('snack') || text.includes('eat') || text.includes('hungry')) {
      if (currentReading > 180) {
        return "Since your glucose is currently high, I recommend a zero-carb snack like almonds, walnuts, or some celery with a little peanut butter. Drink plenty of water as well!";
      } else if (currentReading < 70) {
        return "Your sugar is low! Please eat something fast-acting immediately: 15g of carbs, like a small juice box, 3-4 glucose tablets, or a tablespoon of honey. Check again in 15 minutes.";
      }
      return "A great balanced snack is an apple with a handful of almonds, or greek yogurt with berries. The protein and fat help slow down the carb absorption!";
    }
    
    if (text.includes('high')) {
      return "For a high reading, drinking 1-2 glasses of water and taking a 15-minute light walk can help bring it down organically. If you take insulin, follow your doctor's correction ratio.";
    }

    if (text.includes('banana')) {
      return "Bananas are great, but they can spike sugar fast! Try eating a slightly green one (less sugar, more resistant starch) and pair it with a handful of nuts to stabilize the spike.";
    }

    return "That's a great question! While I'm a simple AI demo right now, normally I would analyze this against the latest ADA guidelines and your personal medical history to give you a tailored answer.";
  };

  const handleSend = async (e?: React.FormEvent, promptOverride?: string) => {
    e?.preventDefault();
    const textToSend = promptOverride || input;
    if (!textToSend.trim()) return;

    // Add user msg
    const newMsg: Message = { id: Date.now().toString(), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate network delay
    setTimeout(() => {
      const response = generateAIResponse(textToSend);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: response }]);
      setIsTyping(false);
      
      // Auto speech for AI response
      const utterance = new SpeechSynthesisUtterance(response);
      window.speechSynthesis.speak(utterance);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[100dvh] md:h-screen bg-slate-50 relative">
      <header className="flex items-center gap-3 p-4 bg-white border-b border-slate-200 shrink-0 z-10 sticky top-0">
        <div className="w-10 h-10 bg-primary-gradient rounded-full flex items-center justify-center text-white shadow-md">
          <Bot size={20} />
        </div>
        <div>
          <h1 className="font-bold text-slate-800 text-lg flex items-center gap-1">Suggy AI <Sparkles size={14} className="text-amber-500"/></h1>
          <p className="text-xs font-semibold text-green-500">● Online and ready to help</p>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`max-w-[80%] rounded-[20px] px-5 py-3.5 shadow-sm text-[15px] font-medium leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-slate-100 rounded-[20px] rounded-tl-sm px-5 py-3.5 shadow-sm flex items-center gap-2 text-slate-400">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm font-semibold">Suggy is thinking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-3 pb-safe md:pb-4 shrink-0">
        
        {/* Quick Prompts */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-1 snap-x no-scrollbar shrink-0 -mx-3 px-3">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(undefined, prompt)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm font-semibold whitespace-nowrap snap-start transition-colors border border-slate-200/50"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about food, glucose, or health..."
            className="w-full bg-slate-50 border border-slate-200 rounded-full py-3.5 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-700 font-medium"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-slate-300 transition-colors shadow-sm"
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
