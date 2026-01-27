import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Phone, Mail, MapPin, Home, Key, TrendingUp, Heart, Shield, Users, CheckCircle, Facebook, Instagram, ChevronRight, ArrowRight, Sparkles, MessageSquare, PenTool, Send, Loader2, Bot, Building2, Youtube } from 'lucide-react';

// --- ŚCIEŻKI DO ZDJĘĆ (Zaktualizowane dla folderu public) ---
// Te ścieżki działają tylko, gdy zdjęcia są w folderze "public" na GitHubie
const logo = "/white_icon_color1_background.png";
const profileImg = "/image00001.jpeg";
const heroBg = "/image00019.jpeg";
const serviceSaleImg = "/image00011.jpeg";
const serviceBuyImg = "/image00012.jpeg";
const catFlatImg = "/image00007.jpeg";
const catHouseImg = "/image00018.jpeg";
const catPlotImg = "/image00011.jpeg"; // Użyte ponownie jako placeholder
const catOtherImg = "/image00019.jpeg"; // Użyte ponownie jako placeholder

const Website = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState('sell'); // 'sell' or 'buy'
  
  // AI State
  const [isAIWidgetOpen, setIsAIWidgetOpen] = useState(false);
  const [aiMode, setAiMode] = useState('menu'); // 'menu', 'chat', 'generator'
  const [chatMessages, setChatMessages] = useState([
    { role: 'system', text: 'Dzień dobry! Jestem wirtualną asystentką biura Zychowicz Nieruchomości. W czym mogę Ci dzisiaj pomóc? 😊' }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);
  
  // Generator State
  const [genData, setGenData] = useState({ type: '', area: '', rooms: '', features: '' });
  const [generatedDescription, setGeneratedDescription] = useState('');

  const chatEndRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, aiMode]);

  // --- GEMINI API INTEGRATION ---
  const callGeminiAPI = async (prompt, systemInstruction = "") => {
    const apiKey = ""; // TUTAJ WKLEJ SWÓJ KLUCZ API
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] }
          })
        }
      );
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Przepraszam, wystąpił błąd po stronie AI. Spróbuj ponownie.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Przepraszam, wystąpił problem z połączeniem. Sprawdź internet i spróbuj ponownie.";
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    const newMessage = { role: 'user', text: userMessage };
    setChatMessages(prev => [...prev, newMessage]);
    setUserMessage('');
    setIsAILoading(true);

    const systemContext = `
      Jesteś inteligentną i empatyczną wirtualną asystentką na stronie biura Zychowicz Nieruchomości (właścicielka: Paulina Zychowicz, działa w Namysłowie i okolicach).
      Twoim celem jest wstępna pomoc klientom, odpowiadanie na pytania o usługi i zachęcanie do kontaktu.
      
      Informacje o firmie:
      - Ceni empatię, szczerość, profesjonalizm.
      - Traktuje każdą transakcję indywidualnie.
      - Oferuje pomoc w sprzedaży (home staging, zdjęcia, marketing, negocjacje) i kupnie (wyszukiwanie, weryfikacja prawna).
      - Kontakt: +48 533 578 422, biuro@zychowicz.online, ul. Brzozowa 7, Wilków.
      
      Styl wypowiedzi:
      - Ciepły, profesjonalny, pomocny.
      - Używaj emoji, ale z umiarem.
      - Jeśli ktoś pyta o konkretną ofertę, poproś o kontakt telefoniczny z Pauliną.
      - Odpowiadaj zwięźle.
    `;

    // Construct conversation history for context (last 5 messages)
    const history = chatMessages.slice(-5).map(m => `${m.role === 'user' ? 'Klient' : 'Asystent'}: ${m.text}`).join('\n');
    const prompt = `${history}\nKlient: ${newMessage.text}\nAsystent:`;

    const reply = await callGeminiAPI(prompt, systemContext);
    
    setChatMessages(prev => [...prev, { role: 'system', text: reply }]);
    setIsAILoading(false);
  };

  const handleGenerateDescription = async () => {
    if (!genData.type || !genData.area) return;
    setIsAILoading(true);
    setGeneratedDescription('');

    const prompt = `
      Napisz atrakcyjny, sprzedażowy opis nieruchomości do ogłoszenia internetowego.
      
      Dane nieruchomości:
      - Typ: ${genData.type}
      - Metraż: ${genData.area} m2
      - Liczba pokoi: ${genData.rooms}
      - Główne atuty/szczegóły: ${genData.features}
      - Lokalizacja: Okolice Namysłowa (domyślna, jeśli nie podano innej).
      
      Styl:
      - Emocjonalny, działający na wyobraźnię ("język korzyści").
      - Profesjonalny, ale przystępny.
      - Podziel tekst na akapity, użyj wypunktowań dla atutów.
      - Wciel się w rolę eksperta z biura Zychowicz Nieruchomości.
    `;

    const description = await callGeminiAPI(prompt);
    setGeneratedDescription(description);
    setIsAILoading(false);
  };

  // --- RENDER HELPERS ---
  const renderAIWidget = () => (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end transition-all duration-300 ${isAIWidgetOpen ? 'translate-y-0' : 'translate-y-0'}`}>
      
      {/* Main Widget Container */}
      {isAIWidgetOpen && (
        <div className="mb-4 bg-white w-[350px] sm:w-[400px] h-[500px] rounded-2xl shadow-2xl border border-[#175579]/10 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 ring-1 ring-black/5">
          
          {/* Header */}
          <div className="bg-[#175579] text-white p-5 flex justify-between items-center bg-gradient-to-r from-[#0f3a53] to-[#175579]">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-1.5 rounded-lg backdrop-blur-sm">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="font-serif font-medium tracking-wide text-sm">
                {aiMode === 'menu' ? 'Strefa Klienta AI' : aiMode === 'chat' ? 'Wirtualna Asystentka' : 'Generator Opisów'}
              </span>
            </div>
            {aiMode !== 'menu' && (
              <button onClick={() => setAiMode('menu')} className="text-white/70 hover:text-white text-[10px] uppercase font-bold px-2 tracking-widest transition-colors">
                Wróć
              </button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-slate-50 p-5 relative">
            
            {/* MENU MODE */}
            {aiMode === 'menu' && (
              <div className="flex flex-col gap-4 h-full justify-center">
                <p className="text-center text-slate-500 mb-4 text-xs uppercase tracking-widest font-semibold">Wybierz narzędzie</p>
                
                <button 
                  onClick={() => setAiMode('chat')}
                  className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:border-[#175579]/30 hover:shadow-md transition-all flex items-center gap-4 group text-left"
                >
                  <div className="bg-[#175579]/5 p-3 rounded-full text-[#175579] group-hover:bg-[#175579] group-hover:text-white transition-colors duration-300">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Zapytaj Asystentkę</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Masz pytania o proces? Chcesz umówić spotkanie?</p>
                  </div>
                </button>

                <button 
                  onClick={() => setAiMode('generator')}
                  className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:border-[#175579]/30 hover:shadow-md transition-all flex items-center gap-4 group text-left"
                >
                  <div className="bg-[#175579]/5 p-3 rounded-full text-[#175579] group-hover:bg-[#175579] group-hover:text-white transition-colors duration-300">
                    <PenTool size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Opisz Nieruchomość</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Sprzedajesz? Stwórz profesjonalny opis w 5 sekund.</p>
                  </div>
                </button>
              </div>
            )}

            {/* CHAT MODE */}
            {aiMode === 'chat' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 space-y-4 mb-4 overflow-y-auto pr-1">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-[#175579] text-white rounded-br-none shadow-md' 
                          : 'bg-white border border-gray-100 text-slate-600 rounded-bl-none shadow-sm'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isAILoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-2 items-center">
                        <Loader2 size={16} className="animate-spin text-[#175579]" />
                        <span className="text-xs text-slate-400">Piszę...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleChatSubmit} className="relative mt-auto">
                  <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Wpisz wiadomość..."
                    className="w-full px-5 py-3.5 pr-12 rounded-full border border-gray-200 focus:border-[#175579] focus:ring-1 focus:ring-[#175579] outline-none text-sm shadow-sm bg-white transition-all"
                  />
                  <button type="submit" disabled={isAILoading} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#175579] p-2 hover:bg-[#175579]/5 rounded-full disabled:opacity-50 transition-colors">
                    <Send size={18} />
                  </button>
                </form>
              </div>
            )}

            {/* GENERATOR MODE */}
            {aiMode === 'generator' && (
              <div className="h-full overflow-y-auto pr-1">
                {!generatedDescription ? (
                  <div className="space-y-5">
                    <p className="text-xs text-slate-500 mb-2 font-medium tracking-wide uppercase text-center">Wypełnij dane nieruchomości</p>
                    
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Rodzaj</label>
                      <select 
                        className="w-full mt-1.5 p-3 rounded-xl border border-gray-200 text-sm bg-white focus:ring-1 focus:ring-[#175579] focus:border-[#175579] outline-none transition-all shadow-sm"
                        value={genData.type}
                        onChange={(e) => setGenData({...genData, type: e.target.value})}
                      >
                        <option value="">Wybierz...</option>
                        <option value="Mieszkanie">Mieszkanie</option>
                        <option value="Dom wolnostojący">Dom wolnostojący</option>
                        <option value="Działka">Działka</option>
                        <option value="Lokal użytkowy">Lokal użytkowy</option>
                      </select>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Metraż (m²)</label>
                        <input 
                          type="number" 
                          className="w-full mt-1.5 p-3 rounded-xl border border-gray-200 text-sm bg-white focus:ring-1 focus:ring-[#175579] focus:border-[#175579] outline-none transition-all shadow-sm"
                          value={genData.area}
                          onChange={(e) => setGenData({...genData, area: e.target.value})}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Pokoje</label>
                        <input 
                          type="number" 
                          className="w-full mt-1.5 p-3 rounded-xl border border-gray-200 text-sm bg-white focus:ring-1 focus:ring-[#175579] focus:border-[#175579] outline-none transition-all shadow-sm"
                          value={genData.rooms}
                          onChange={(e) => setGenData({...genData, rooms: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Atuty</label>
                      <textarea 
                        className="w-full mt-1.5 p-3 rounded-xl border border-gray-200 text-sm h-24 bg-white focus:ring-1 focus:ring-[#175579] focus:border-[#175579] outline-none transition-all shadow-sm resize-none"
                        placeholder="np. duży balkon, blisko parku, po remoncie..."
                        value={genData.features}
                        onChange={(e) => setGenData({...genData, features: e.target.value})}
                      />
                    </div>

                    <button 
                      onClick={handleGenerateDescription}
                      disabled={isAILoading || !genData.type || !genData.area}
                      className="w-full bg-[#175579] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#0e3a53] transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider"
                    >
                      {isAILoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                      {isAILoading ? 'Generuję...' : 'Stwórz Opis'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 h-full flex flex-col">
                    <div className="bg-white p-5 rounded-xl border border-[#175579]/10 shadow-sm text-sm text-slate-600 whitespace-pre-line leading-relaxed flex-1 overflow-y-auto">
                      {generatedDescription}
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => setGeneratedDescription('')} 
                        className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold uppercase tracking-wide hover:bg-slate-50 transition-colors"
                      >
                        Wróć
                      </button>
                      <button 
                        onClick={() => {navigator.clipboard.writeText(generatedDescription); alert('Skopiowano do schowka!');}}
                        className="flex-1 py-3 bg-[#175579] text-white rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-[#0e3a53] shadow-md transition-all"
                      >
                        Kopiuj
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsAIWidgetOpen(!isAIWidgetOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 z-50 ${isAIWidgetOpen ? 'bg-slate-900 rotate-90' : 'bg-gradient-to-r from-[#175579] to-[#0f3a53] animate-bounce-slow border-2 border-white/20'}`}
      >
        {isAIWidgetOpen ? <X className="text-white" size={24} /> : <Bot className="text-white" size={28} />}
      </button>

    </div>
  );
};

export default Website;
