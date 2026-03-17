import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Mic, Bot, User, Loader2 } from 'lucide-react';

const Chatbot = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Namaste! I am AMRITKRISHI AI. How can I help you with your farm today?', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg = { 
      role: 'user', 
      text: input, 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    };
    
    setMessages([...messages, newMsg]);
    setInput('');
    setIsTyping(true);

    // Mock AI Response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: 'This is a mock response from the AI. Based on your inputs, I recommend checking the humidity levels and considering applying appropriate fungicides if early blight is a concern.', 
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const suggestions = [
    "Which crop should I grow?",
    "My tomato has spots",
    "Today's weather",
    "Latest PM-KISAN news"
  ];

  return (
    <div className="min-h-screen bg-[#ece5dd] flex flex-col lg:p-4">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col bg-white lg:rounded-2xl lg:shadow-xl overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="bg-[#075e54] text-white p-4 flex items-center justify-between shadow-md z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full text-[#075e54]">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="font-bold text-lg">AmritKrishi Assistant</h2>
              <p className="text-xs text-green-100 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span> Online
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <select className="bg-[#128c7e] text-white text-sm rounded border-none outline-none py-1 px-2 cursor-pointer">
              <option>EN</option>
              <option>தமிழ்</option>
              <option>हिंदी</option>
            </select>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-[#efeae2]" style={{ backgroundImage: "url('https://i.pinimg.com/originals/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')", opacity: 0.9 }}>
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-2 relative shadow-sm
                  ${msg.role === 'user' ? 'bg-[#dcf8c6] rounded-tr-none' : 'bg-white rounded-tl-none border border-gray-100'}
                `}>
                  <p className="text-sm text-gray-800 leading-relaxed">{msg.text}</p>
                  <span className={`text-[10px] text-gray-500 block text-right mt-1 ${msg.role === 'user' ? 'text-green-800/60' : ''}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1 border border-gray-100">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggestions & Input */}
        <div className="bg-[#f0f2f5] p-3 border-t border-gray-200">
          {/* Quick chips */}
          {messages.length < 3 && (
            <div className="flex gap-2 p-2 overflow-x-auto mb-2 no-scrollbar">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => setInput(s)} className="whitespace-nowrap text-xs bg-white text-[#075e54] border border-[#075e54]/30 px-3 py-1.5 rounded-full font-medium hover:bg-[#dcf8c6] transition-colors">
                  {s}
                </button>
              ))}
            </div>
          )}
          
          <div className="flex items-end gap-2">
            <button className="p-3 text-gray-500 hover:text-[#075e54] transition-colors">
              <Mic size={24} />
            </button>
            <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-sm flex border border-gray-200">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Type a message..." 
                className="w-full max-h-32 min-h-[44px] py-3 px-4 resize-none outline-none text-sm"
                rows={1}
              />
            </div>
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className={`p-3 rounded-full text-white shadow-md flex-shrink-0 transition-transform ${input.trim() ? 'bg-[#128c7e] hover:bg-[#075e54]' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              <Send size={20} className="ml-0.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Chatbot;
