import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Bot, Send, User, Flame, Mic, ShieldAlert, Sparkles, Languages, Check, Copy } from 'lucide-react';
import { RiskBadge } from './ui/RiskBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function AdminPage() {
  const { settings } = useTheme();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am the SafeGas AI Assistant. Describe an incident or potential leak, and I will assess the risk level and provide emergency recommendations.' }
  ]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState(settings?.language || 'English');
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const suggestedPrompts = [
    "Hissing sound near the main pipeline",
    "Strong smell of sulfur in the basement",
    "Pressure drop reported in sector 4",
    "Routine maintenance query"
  ];

  const handleSend = async (text) => {
    if (!text.trim()) return;
    
    const newMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/assess', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          incident_description: text, 
          language,
          model: settings?.aiModel || 'gemini-1.5-pro',
          creativity: settings?.creativity ? parseInt(settings.creativity) : 30
        })
      });
      
      if (!response.ok) throw new Error('Assessment failed');
      const data = await response.json();
      
      if (data.risk_level === 'CRITICAL') {
        // Critical Alert Sound (respects settings.criticalSound)
        if (settings?.criticalSound !== false) {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.5);
          gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 1);
        }

        // Browser desktop notification
        if (settings?.browserNotif && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('CRITICAL INCIDENT DETECTED', {
            body: data.incident_summary,
            icon: '/favicon.ico'
          });
        }
      }
      
      let finalContent = data.incident_summary;
      if (data.risk_level === 'CRITICAL' || data.risk_level === 'HIGH') {
         finalContent += `\n\n**Emergency Contacts:**\n- Fire/Ambulance: ${settings?.fireDept || '911'}\n- Police: ${settings?.policeContact || '911'}\n- Gas Provider: ${settings?.gasProvider || '1-800-GAS-LEAK'}`;
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: finalContent,
        risk: data.risk_level
      }]);

      // Voice Synthesized Response
      if (settings?.voiceResponse && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(data.incident_summary);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Error processing the request. Please check the system connection.",
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleRecording = () => {
    setRecording(!recording);
    if (!recording) {
      // Mock recording duration
      setTimeout(() => {
        setRecording(false);
        setInput("Audio transcribed: Strong smell of rotten eggs near the valve.");
      }, 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-textPrimary flex items-center gap-3">
            <Sparkles className="text-[#8b5cf6]" size={32} />
            AI Safety Assistant
          </h1>
          <p className="text-textSecondary mt-1">Real-time emergency assessment and decision support.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-1.5 shadow-sm">
          <Languages size={18} className="text-textSecondary" />
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-sm text-textPrimary focus:outline-none cursor-pointer"
          >
            <option className="bg-surface">English</option>
            <option className="bg-surface">Spanish</option>
            <option className="bg-surface">French</option>
            <option className="bg-surface">Hindi</option>
          </select>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-border bg-surface/40 backdrop-blur-xl shadow-2xl">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === 'user' ? 'bg-primary text-white' : 'bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/30'
                }`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                
                <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.risk && (
                    <div className="mb-1">
                      <RiskBadge level={msg.risk} />
                    </div>
                  )}
                  <div className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm relative group ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : msg.isError 
                        ? 'bg-danger/10 text-danger border border-danger/20 rounded-tl-none' 
                        : 'bg-black/5 dark:bg-white/5 text-textPrimary border border-border rounded-tl-none'
                  }`}>
                    {msg.content}
                    
                    {msg.role === 'assistant' && (
                      <button 
                        onClick={() => handleCopy(msg.content, idx)}
                        className="absolute -right-10 top-2 p-1.5 rounded-md bg-surface border border-border text-textSecondary opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary"
                      >
                        {copiedIndex === idx ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/30 flex items-center justify-center shrink-0">
                <Bot size={20} />
              </div>
              <div className="px-5 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border rounded-tl-none flex items-center gap-1.5">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-[#8b5cf6] rounded-full"></motion.div>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-[#8b5cf6] rounded-full"></motion.div>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-[#8b5cf6] rounded-full"></motion.div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="p-4 border-t border-border bg-surface/50 backdrop-blur-md">
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestedPrompts.map((p, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(p)}
                  className="px-3 py-1.5 rounded-full border border-primary/30 text-primary bg-primary/5 text-xs font-medium hover:bg-primary/20 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}
          
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }} 
            className="relative flex items-center gap-3"
          >
            <button 
              type="button"
              onClick={toggleRecording}
              className={`absolute left-3 p-1.5 rounded-full transition-all ${recording ? 'bg-danger/20 text-danger animate-pulse' : 'text-textSecondary hover:bg-black/10 dark:hover:bg-white/10'}`}
            >
              <Mic size={18} />
            </button>
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe the incident..."
              className="pl-12 pr-14 py-4 rounded-xl border-border bg-black/40 text-[15px] focus:ring-primary focus:border-primary w-full shadow-inner"
              disabled={loading || recording}
            />
            <Button 
              type="submit" 
              disabled={loading || !input.trim() || recording}
              className="absolute right-2 h-10 w-10 p-0 rounded-lg flex items-center justify-center bg-primary hover:bg-primary/90 text-white shadow-lg"
            >
              <Send size={18} className="ml-1" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
