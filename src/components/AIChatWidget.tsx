import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '안녕하세요! Healus AI 주치의입니다. 최근 건강 데이터나 당뇨 관리에 대해 궁금한 점이 있으신가요?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        message: input.trim(),
        history: messages.filter(m => m.role !== 'system').map(m => ({
          sender: m.role,
          text: m.content
        }))
      });
      
      if (response.data.reply) {
        setMessages([...newMessages, { role: 'assistant', content: response.data.reply }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: response.data.error || '오류가 발생했습니다.' }]);
      }
    } catch (error) {
      console.error('Chat API Error:', error);
      setMessages([...newMessages, { role: 'assistant', content: '서버 연결에 실패했습니다. 다시 시도해 주세요.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[380px] max-w-[calc(100vw-3rem)] h-[700px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[#17409c] text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-blue-100" />
              <div>
                <h3 className="font-bold text-lg leading-tight">Healus AI 주치의</h3>
                <p className="text-blue-100 text-xs">개인화된 건강 상담</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-blue-100 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#17409c] text-white rounded-tr-sm shadow-md' 
                      : 'bg-white text-gray-800 rounded-tl-sm shadow-md border border-gray-100'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-3 shadow-md border border-gray-100 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#17409c]" />
                  <span className="text-sm text-gray-500">분석 중...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="궁금한 점을 물어보세요..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400 py-1"
                disabled={isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="ml-2 text-[#17409c] hover:text-blue-800 disabled:text-gray-400 transition-colors p-1"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-[#17409c] text-white w-16 h-16 rounded-full shadow-[0_10px_25px_rgba(23,64,156,0.4)] flex items-center justify-center hover:shadow-[0_15px_35px_rgba(23,64,156,0.6)] transition-all hover:scale-110 active:scale-95 group relative"
          title="Healus AI 주치의"
        >
          <Bot className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
          <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
        </button>
      )}
    </div>
  );
}
