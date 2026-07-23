'use client';

import { MessageCircle, Send, X, Minimize2, Maximize2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const aiResponses: { [key: string]: string } = {
  'hello': 'Hello! 👋 Welcome to Moderate Business Systems Ltd. I\'m your AI assistant here to help you learn about our services, answer questions about the company, or guide you through our website. How can I help you today?',
  'hi': 'Hello! 👋 Welcome to Moderate Business Systems Ltd. I\'m your AI assistant here to help you learn about our services, answer questions about the company, or guide you through our website. How can I help you today?',
  'services': 'We offer four main service areas:\n\n1. **Engineering Services** - Electrical, mechanical, civil and technical support\n2. **Procurement Solutions** - End-to-end sourcing and vendor management\n3. **Facility Management** - Building maintenance and operational support\n4. **Technology Solutions** - IT infrastructure and business technology support\n\nWould you like to learn more about any of these services?',
  'engineering': 'Our Engineering Services include:\n- Electrical engineering and power systems\n- Mechanical engineering support\n- Civil engineering and infrastructure\n- Facility maintenance and preventive support\n\nThese are delivered with precision and compliance to ensure your operations run smoothly. Would you like to request a quote for engineering services?',
  'procurement': 'Our Procurement Services provide:\n- Industrial equipment sourcing\n- Office supplies procurement\n- Computer hardware supply\n- Specialized procurement for complex requirements\n\nWe offer reliable supply chains and value-led sourcing strategies tailored to your needs. Interested in learning more?',
  'facility': 'Our Facility Management services include:\n- Building maintenance and upkeep\n- Equipment maintenance for sustained performance\n- Operational support for business continuity\n- Preventive maintenance programs\n\nWe ensure safe, reliable and proactive building and asset management. Would you like more details?',
  'hseq': 'HSEQ (Health, Safety, Environment, Quality) is central to everything we do. We:\n- Follow rigorous safety protocols\n- Ensure regulatory compliance\n- Maintain high-quality standards\n- Prioritize environmental responsibility\n\nAll our projects and operations adhere to the highest HSEQ standards. Visit our HSEQ page for more information!',
  'quote': 'I can help you get started with a quote! 📝\n\nYou can:\n1. Click the "Request Quote" button in our navigation menu\n2. Fill out our quick quote form with your requirements\n3. Or contact us directly:\n   📞 +234 814 323 3472\n   📧 moderatebiz@yahoo.com\n   💬 WhatsApp: https://wa.me/2348143233472\n\nWould you like to visit the Request Quote page?',
  'contact': 'Here\'s how you can reach us:\n\n📞 **Phone**: +234 814 323 3472\n📧 **Email**: moderatebiz@yahoo.com\n📍 **Address**: 7 Tajudeen Anjorin Street, Ikeja, Lagos\n💬 **WhatsApp**: https://wa.me/2348143233472\n\nWe typically respond to inquiries within 24 hours. How can I help you get in touch?',
  'about': 'Moderate Business Systems Ltd (MBS) is a leading provider of engineering, procurement, facility management and technology solutions. Founded in 1998, we serve multinational corporations, government institutions, and large organizations across Nigeria.\n\nOur mission: Delivering excellence through partnership\nOur vision: To be the leading provider in Nigeria, recognized for excellence and innovation\n\nWould you like to learn more about our company?',
  'industries': 'We serve a wide range of industries including:\n- Manufacturing\n- Banking\n- Government\n- Oil & Gas\n- Telecommunications\n- Healthcare\n\nOur flexible delivery models work for high-compliance environments and time-sensitive operations. What industry are you in?',
  'testimonials': 'Our clients consistently praise us for reliability, quality excellence, technical expertise, and customer satisfaction. Visit our Testimonials page to read what organizations across Nigeria have to say about working with us!\n\nWould you like to share your own experience?',
  'careers': 'Are you interested in joining our team? We\'re always looking for talented professionals in engineering, procurement, facility management, and technology.\n\nVisit our Careers page to explore current opportunities or learn more about working at MBS.\n\nWhat area interests you?',
  'help': 'I can help you with:\n- 📚 Information about our services\n- 🏢 Company background and history\n- 📋 Request a quote process\n- 📞 Contact information\n- 🗺️ Website navigation\n- 💼 Career opportunities\n- ✅ HSEQ and compliance\n\nWhat would you like to know about?',
  'default': 'Thanks for your question! I can help with information about our services, company background, contact details, and more. Feel free to ask about:\n- Our services (engineering, procurement, facilities, technology)\n- Company information\n- How to request a quote\n- Contact details\n- Website navigation\n\nWhat interests you?'
};

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! 👋 I\'m your AI Assistant for Moderate Business Systems Ltd. How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim();
    
    // Check for exact or partial matches
    for (const [key, response] of Object.entries(aiResponses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    
    return aiResponses['default'];
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(input),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 600);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group fixed bottom-28 sm:bottom-32 right-6 sm:right-8 z-30 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/50 transition duration-300 hover:shadow-xl hover:shadow-brand-500/70 hover:scale-110 active:scale-95"
        title="Open AI Assistant"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 opacity-0 animate-pulse" />
        <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-28 sm:bottom-32 right-6 sm:right-8 z-30 w-screen max-w-sm sm:w-96 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Chat Window */}
      <div
        className={`rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl overflow-hidden transition-all duration-300 ${
          isMinimized ? 'max-h-16' : 'max-h-96'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 bg-gradient-to-r from-brand-600 to-brand-700 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-2 w-2 items-center justify-center rounded-full bg-green-400" />
            <h3 className="text-sm sm:text-base font-semibold text-white truncate">MBS AI Assistant</h3>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 text-white hover:bg-white/10 rounded transition"
              title={isMinimized ? 'Maximize' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" /> : <Minimize2 className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-white hover:bg-white/10 rounded transition"
              title="Close"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        {!isMinimized && (
          <>
            <div className="h-56 sm:h-64 overflow-y-auto space-y-3 p-4 sm:p-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm leading-relaxed ${
                      message.sender === 'user'
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-800 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {message.text.split('\n').map((line, i) => (
                      <div key={i}>
                        {line.includes('**') ? (
                          <>
                            {line.split('**').map((part, j) =>
                              j % 2 === 1 ? (
                                <strong key={j}>{part}</strong>
                              ) : (
                                <span key={j}>{part}</span>
                              )
                            )}
                          </>
                        ) : (
                          line
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-lg bg-slate-800 border border-slate-700 px-4 py-3">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="h-2 w-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="h-2 w-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-800 bg-slate-950/50 p-3 sm:p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 p-2 text-white transition hover:from-brand-600 hover:to-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Send message"
                >
                  <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </form>
              <div className="mt-2 text-xs text-slate-500 text-center">
                Need live support? <a href="https://wa.me/2348143233472" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300">Chat on WhatsApp</a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
