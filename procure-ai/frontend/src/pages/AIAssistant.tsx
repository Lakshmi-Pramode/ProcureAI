import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import { api } from '../services/api';

export default function AIAssistant() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Hello! I am ProcureAI Assistant. How can I help you with your procurement tasks today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      // Basic context for the demo
      const context = "Tender CPCL/IT/2026/001 is active. Vendors ABC Technologies, Bharat Digital Systems, and Nova Infotech Solutions have submitted bids. ABC is highly compliant, Bharat has turnover failure, and Nova has items for manual review.";
      
      const response = await api.ai.chat(userMessage, context);
      
      setMessages(prev => [...prev, { role: 'assistant', content: (response as any).reply || (response as any).answer || response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting to my knowledge base right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-80px)] space-y-4">
      <PageHeader
        title="ProcureAI Assistant"
        subtitle="Your AI-powered procurement copilot for query resolution and clause interpretation"
        breadcrumbs={[{ label: 'AI Assistant' }]}
      />

      <div className="flex-1 bg-surface rounded-xl border border-border shadow-sm flex flex-col overflow-hidden">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-primary-600" />
                </div>
              )}
              
              <div className={`max-w-[70%] p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-primary-600 text-white rounded-br-none' 
                  : 'bg-surface-secondary border border-border text-text-primary rounded-bl-none'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-surface-secondary border border-border flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-text-secondary" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
              </div>
              <div className="max-w-[70%] p-4 rounded-2xl bg-surface-secondary border border-border text-text-primary rounded-bl-none flex items-center gap-2">
                 <span className="text-sm text-text-secondary italic">Analyzing procurement context...</span>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-surface">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about tender CPCL/IT/2026/001 or compliance statuses..."
              className="flex-1 bg-surface-secondary border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white p-3 rounded-xl transition flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-[10px] text-text-tertiary mt-2">
            AI-assisted decision-support output. Verify regulatory facts against standard GFR guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}
