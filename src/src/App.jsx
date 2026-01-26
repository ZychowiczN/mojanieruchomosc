import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Phone, Mail, MapPin, Home, Key, TrendingUp, Heart, Shield, Users, CheckCircle, Facebook, Instagram, ChevronRight, ArrowRight, Sparkles, MessageSquare, PenTool, Send, Loader2, Bot, Building2, Youtube } from 'lucide-react';

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
    const apiKey = ""; // TUTAJ WKLEJ SWÓJ KLUCZ API, JEŚLI CHCESZ AI
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

  return (
    <div className="font-sans text-slate-800 bg-white relative selection:bg-[#175579]/20 selection:text-[#175579]">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-md shadow-sm z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24"> {/* Zwiększona wysokość dla logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => scrollToSection('home')}>
              {/* Logo */}
              <img 
                src="white_icon_color1_background.png" 
                alt="Logo" 
                className="h-14 w-auto mr-4 object-contain rounded-full shadow-sm ring-1 ring-gray-100 group-hover:scale-105 transition-transform duration-300" 
              />
              
              <div className="flex flex-col">
                <span className="text-xl font-serif text-slate-900 tracking-tight leading-tight group-hover:text-[#175579] transition-colors">
                  Zychowicz <span className="text-[#175579] font-medium">Nieruchomości</span>
                </span>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-10 items-center">
              {['Strona Główna', 'O mnie', 'Usługi', 'Oferty'].map((item, idx) => {
                const sectionId = item === 'Strona Główna' ? 'home' : 
                                  item === 'O mnie' ? 'about' : 
                                  item === 'Usługi' ? 'services' : 'offers';
                return (
                  <button 
                    key={idx}
                    onClick={() => scrollToSection(sectionId)} 
                    className="text-slate-500 hover:text-[#175579] transition-all duration-300 font-medium text-sm tracking-wide relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#175579] after:left-0 after:-bottom-1 after:transition-all hover:after:w-full"
                  >
                    {item}
                  </button>
                );
              })}
              <button onClick={() => scrollToSection('contact')} className="bg-[#175579] text-white px-7 py-3 rounded-full hover:bg-[#0e3a53] transition-all duration-300 shadow-lg hover:shadow-xl text-xs font-bold tracking-wider uppercase transform hover:-translate-y-0.5">
                Kontakt
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-slate-800 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-2xl animate-in slide-in-from-top-5 duration-300">
            <div className="px-6 pt-4 pb-8 space-y-3 text-center">
              {['Strona Główna', 'O mnie', 'Usługi', 'Oferty'].map((item, idx) => {
                 const sectionId = item === 'Strona Główna' ? 'home' : 
                 item === 'O mnie' ? 'about' : 
                 item === 'Usługi' ? 'services' : 'offers';
                 return (
                  <button 
                    key={idx}
                    onClick={() => scrollToSection(sectionId)} 
                    className="block w-full py-4 text-slate-600 hover:text-[#175579] hover:bg-[#175579]/5 rounded-xl transition-all font-medium"
                  >
                    {item}
                  </button>
                 );
              })}
              <button onClick={() => scrollToSection('contact')} className="block w-full py-4 text-white font-bold bg-[#175579] rounded-xl mt-4 shadow-md uppercase tracking-wider text-sm">
                Kontakt
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen min-h-[700px] flex items-center justify-center bg-slate-900 overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f2d40]/90 to-[#175579]/60 z-10 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        
        {/* Background Image with Parallax-like fix */}
        <div className="absolute inset-0 bg-[url('image00019.jpeg')] bg-cover bg-center bg-no-repeat fixed-bg transform scale-105"></div>
        
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-20 animate-in fade-in zoom-in duration-1000">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight drop-shadow-2xl tracking-tight">
            Nieruchomości <br className="hidden md:block"/> w Namysłowie.
          </h1>
          <div className="w-24 h-1 bg-white/30 mx-auto mb-8 rounded-full"></div>
          <p className="text-lg md:text-2xl text-gray-100 mb-12 max-w-3xl mx-auto font-light drop-shadow-md leading-relaxed opacity-90">
            Zaufanie, empatia i skuteczność.<br/>
            <span className="text-white/80 text-base md:text-lg mt-2 block">Twój partner w bezpiecznej zmianie życiowej.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <button onClick={() => scrollToSection('offers')} className="bg-[#175579] hover:bg-white hover:text-[#175579] text-white px-10 py-4 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-xl border-2 border-[#175579] flex items-center gap-3 group">
              <Home size={18} className="group-hover:scale-110 transition-transform" /> Zobacz Oferty
            </button>
            <button onClick={() => scrollToSection('contact')} className="bg-transparent hover:bg-white hover:text-[#175579] text-white px-10 py-4 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 border-2 border-white/30 hover:border-white backdrop-blur-sm">
              Umów spotkanie
            </button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce text-white/50">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                <div className="w-1 h-2 bg-white/50 rounded-full"></div>
            </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="order-2 md:order-1 relative">
              {/* Decorative elements */}
              <div className="absolute -top-10 -left-10 w-40 h-40 border-[20px] border-[#175579]/5 rounded-full z-0"></div>
              <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-[#175579]/5 rounded-full blur-3xl z-0"></div>
              
              {/* Portrait Image Area */}
              <div className="relative group z-10">
                <div className="absolute inset-0 bg-[#175579] rounded-[3rem] rotate-3 opacity-10 transition-transform group-hover:rotate-6 duration-500"></div>
                <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[3/4] bg-slate-100">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#175579]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>
                  <img src="image00001.jpeg" alt="Paulina Zychowicz" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                
                {/* Floating Experience Card */}
                <div className="absolute bottom-10 -right-4 md:-right-10 bg-white p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 border border-gray-50">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#175579] p-3 rounded-full text-white shadow-lg shadow-[#175579]/30">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ekspert</p>
                            <p className="text-[#175579] font-serif text-xl">Namysłów i okolice</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-3 mb-6">
                <span className="w-12 h-[1px] bg-[#175579]"></span>
                <span className="text-[#175579] font-bold tracking-[0.2em] uppercase text-xs">O mnie</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif text-slate-900 mb-10 leading-none tracking-tight">Więcej niż pośrednik.<br/><span className="text-[#175579] italic">Twój partner.</span></h2>
              
              <div className="space-y-8 text-slate-600 leading-loose text-lg font-light">
                <p>
                  Nazywam się <strong className="text-slate-900 font-medium">Paulina Zychowicz</strong>. Prywatnie jestem żoną, mamą, córką i przyjaciółką. Te role nauczyły mnie, że <span className="text-[#175579]">dom to emocje</span>, a nie tylko ściany.
                </p>
                <p>
                  Wiem, że rynek nieruchomości to coś więcej niż transakcje – to ludzkie marzenia, bezpieczeństwo i przyszłość. Moim celem jest, abyś w procesie sprzedaży lub zakupu w Namysłowie czuł się <span className="underline decoration-[#175579]/30 underline-offset-4">spokojnie i pewnie</span>.
                </p>
                
                <div className="bg-slate-50 p-8 rounded-tr-3xl rounded-bl-3xl border-l-4 border-[#175579]">
                    <p className="italic text-slate-800 font-medium text-lg leading-relaxed">
                    "Profesjonalizm, uczciwość i otwarta komunikacja – to fundamenty mojej pracy."
                    </p>
                </div>
              </div>
              
              <div className="mt-12 grid grid-cols-3 gap-8 border-t border-gray-100 pt-10">
                <div className="text-center group cursor-default">
                  <Shield className="text-[#175579] mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" size={32} strokeWidth={1.5} />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Bezpieczeństwo</span>
                </div>
                <div className="text-center border-l border-gray-100 group cursor-default">
                  <Heart className="text-[#175579] mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" size={32} strokeWidth={1.5} />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Empatia</span>
                </div>
                <div className="text-center border-l border-gray-100 group cursor-default">
                  <Key className="text-[#175579] mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" size={32} strokeWidth={1.5} />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Skuteczność</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-[#175579]/5 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#175579_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="text-[#175579] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Oferta</span>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6 tracking-tight">Jak mogę Ci pomóc?</h2>
            <div className="w-20 h-1 bg-[#175579] mx-auto rounded-full mb-6"></div>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg font-light">Kompleksowe wsparcie dopasowane do Twoich potrzeb.</p>
          </div>

          {/* Toggle Switch */}
          <div className="flex justify-center mb-16">
            <div className="bg-white p-2 rounded-full shadow-lg border border-gray-100 inline-flex relative">
              <div 
                className={`absolute top-2 bottom-2 w-[calc(50%-8px)] bg-[#175579] rounded-full transition-all duration-300 ease-in-out ${activeService === 'sell' ? 'left-2' : 'left-[calc(50%+4px)]'}`}
              ></div>
              <button 
                onClick={() => setActiveService('sell')}
                className={`relative z-10 px-12 py-4 rounded-full text-xs font-bold tracking-[0.15em] uppercase transition-colors duration-300 ${activeService === 'sell' ? 'text-white' : 'text-slate-500 hover:text-[#175579]'}`}
              >
                Sprzedaż
              </button>
              <button 
                onClick={() => setActiveService('buy')}
                className={`relative z-10 px-12 py-4 rounded-full text-xs font-bold tracking-[0.15em] uppercase transition-colors duration-300 ${activeService === 'buy' ? 'text-white' : 'text-slate-500 hover:text-[#175579]'}`}
              >
                Zakup
              </button>
            </div>
          </div>

          {/* Content Card */}
          <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-500 border border-gray-100">
            {activeService === 'sell' && (
              <div className="grid md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="p-12 md:p-20 flex flex-col justify-center">
                  <h3 className="text-3xl font-serif text-slate-900 mb-8 leading-tight">Sprzedaż – <br/><span className="text-[#175579]">szybko, bezpiecznie i z zyskiem</span></h3>
                  <p className="text-slate-600 mb-10 text-lg leading-relaxed font-light">
                    Sprzedaż nieruchomości to proces wymagający wiedzy i przygotowania. Dzięki mojej pomocy unikniesz stresu, a cały proces będzie przejrzysty.
                  </p>
                  <ul className="space-y-6 mb-12">
                    {[
                      "Rzetelna wycena i analiza rynku",
                      "Profesjonalna sesja zdjęciowa i Home Staging",
                      "Skuteczny marketing w internecie",
                      "Wsparcie prawne i negocjacje ceny"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4 group">
                        <div className="bg-[#175579]/5 p-1.5 rounded-full text-[#175579] mt-0.5 group-hover:bg-[#175579] group-hover:text-white transition-colors duration-300"><CheckCircle size={18} /></div>
                        <span className="text-slate-700 font-medium group-hover:text-[#175579] transition-colors">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => scrollToSection('contact')} className="text-[#175579] font-bold text-sm tracking-widest uppercase flex items-center gap-3 hover:gap-6 transition-all group border-b border-transparent hover:border-[#175579] pb-1 w-fit">
                    Zgłoś ofertę <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                {/* Zdjęcie Usługi */}
                <div className="bg-slate-100 min-h-[400px] md:min-h-full relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[#175579]/20 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
                    <img src="image00011.jpeg" alt="Sprzedaż nieruchomości" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" />
                </div>
              </div>
            )}

            {activeService === 'buy' && (
              <div className="grid md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="p-12 md:p-20 flex flex-col justify-center">
                  <h3 className="text-3xl font-serif text-slate-900 mb-8 leading-tight">Zakup – <br/><span className="text-[#175579]">spełnij marzenie o własnym domu</span></h3>
                  <p className="text-slate-600 mb-10 text-lg leading-relaxed font-light">
                    Zakup nieruchomości to jedna z najważniejszych decyzji w życiu. Jestem tu, by Cię wesprzeć i zadbać o bezpieczeństwo Twoich finansów.
                  </p>
                  <ul className="space-y-6 mb-12">
                    {[
                      "Dostęp do sprawdzonych ofert z regionu",
                      "Weryfikacja stanu prawnego (Księgi Wieczyste)",
                      "Pomoc w twardych negocjacjach cenowych",
                      "Opieka nad formalnościami notarialnymi"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4 group">
                        <div className="bg-[#175579]/5 p-1.5 rounded-full text-[#175579] mt-0.5 group-hover:bg-[#175579] group-hover:text-white transition-colors duration-300"><CheckCircle size={18} /></div>
                        <span className="text-slate-700 font-medium group-hover:text-[#175579] transition-colors">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => scrollToSection('contact')} className="text-[#175579] font-bold text-sm tracking-widest uppercase flex items-center gap-3 hover:gap-6 transition-all group border-b border-transparent hover:border-[#175579] pb-1 w-fit">
                    Umów spotkanie <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                {/* Zdjęcie Usługi */}
                <div className="bg-slate-100 min-h-[400px] md:min-h-full relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[#175579]/20 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
                    <img src="image00012.jpeg" alt="Zakup nieruchomości" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Offers Categories */}
      <section id="offers" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
            <div>
                <span className="text-[#175579] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Kategorie</span>
                <h2 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight">Przeglądaj Oferty</h2>
            </div>
            <p className="text-slate-500 max-w-sm text-right hidden md:block font-light">Znajdź idealną przestrzeń dla siebie i swojej rodziny.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Mieszkania", icon: <Home size={32} />, image: "image00007.jpeg" },
              { title: "Domy", icon: <Shield size={32} />, image: "image00018.jpeg" },
              { title: "Działki", icon: <MapPin size={32} />, image: "image00011.jpeg" }, 
              { title: "Inne", icon: <TrendingUp size={32} />, image: "image00019.jpeg" } 
            ].map((cat, idx) => (
              <div key={idx} className="group relative h-[450px] rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-700">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f2d40]/50 to-[#0f2d40] z-10 opacity-70 group-hover:opacity-90 transition duration-500"></div>
                <img src={cat.image} alt={cat.title} className="absolute inset-0 w-full h-full object-cover transition duration-1000 group-hover:scale-110" />
                
                <div className="absolute bottom-0 left-0 p-8 z-20 text-white w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="w-12 h-1 bg-[#175579] mb-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="mb-4 text-white/80 group-hover:text-white transform transition duration-500">{cat.icon}</div>
                  <h3 className="text-3xl font-serif font-medium flex justify-between items-center">
                    {cat.title}
                    <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition duration-500 hover:bg-white hover:text-[#175579]">
                        <ChevronRight size={20} />
                    </div>
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
        {/* Background Image Parallax */}
        <div className="absolute inset-0 bg-[url('image00019.jpeg')] bg-cover bg-center opacity-10 fixed-bg mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-slate-900"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-serif mb-8 tracking-tight">Dlaczego warto mi zaufać?</h2>
            <div className="w-20 h-1 bg-[#175579] mx-auto rounded-full mb-8"></div>
            <p className="text-slate-300 max-w-2xl mx-auto text-xl font-light leading-relaxed">Jestem Twoim partnerem w Namysłowie. Otrzymujesz nie tylko usługę, ale przede wszystkim wsparcie.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
                {icon: <Users size={32} />, title: "Indywidualne podejście", desc: "Każdą transakcję traktuję jak osobistą sprawę. Nie stosuję szablonów, bo każdy klient jest inny."},
                {icon: <Shield size={32} />, title: "Transparentność", desc: "Pełna jasność działań i dbałość o Twoje interesy. Żadnych ukrytych kosztów i drobnego druku."},
                {icon: <TrendingUp size={32} />, title: "Współpraca z ekspertami", desc: "Doradcy kredytowi, notariusze i prawnicy czuwają nad przebiegiem procesu, zapewniając spokój."}
            ].map((item, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md p-10 rounded-[2rem] border border-white/10 hover:border-[#175579]/50 hover:bg-white/10 transition duration-500 group hover:-translate-y-2">
                <div className="bg-[#175579]/20 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#175579] transition duration-500 shadow-inner">
                    <div className="text-[#175579] group-hover:text-white transition duration-500">{item.icon}</div>
                </div>
                <h3 className="text-2xl font-serif mb-4">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed font-light group-hover:text-slate-300">{item.desc}</p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-32 bg-[#175579]/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-0 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden bg-white">
            
            {/* Contact Info */}
            <div className="lg:col-span-2 p-12 lg:p-16 bg-[#175579] text-white flex flex-col justify-between relative overflow-hidden">
                {/* Decor */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
                
                <div className="relative z-10">
                    <h2 className="text-4xl font-serif mb-8 leading-tight">Porozmawiajmy o Twoich planach</h2>
                    <p className="text-white/80 mb-16 text-lg leading-relaxed font-light">
                    Masz pytania? Chcesz sprzedać lub kupić nieruchomość w Namysłowie i okolicach? Jestem do Twojej dyspozycji.
                    </p>
                    
                    <div className="space-y-10">
                    <div className="flex items-start gap-6 group">
                        <div className="bg-white/10 p-4 rounded-2xl group-hover:bg-white group-hover:text-[#175579] transition-all duration-300">
                            <MapPin size={24} />
                        </div>
                        <div>
                        <h4 className="font-bold text-sm uppercase tracking-widest mb-1 opacity-70">Biuro</h4>
                        <p className="text-xl font-serif">ul. Brzozowa 7<br/>46-113 Wilków</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-6 group">
                        <div className="bg-white/10 p-4 rounded-2xl group-hover:bg-white group-hover:text-[#175579] transition-all duration-300">
                            <Phone size={24} />
                        </div>
                        <div>
                        <h4 className="font-bold text-sm uppercase tracking-widest mb-1 opacity-70">Telefon</h4>
                        <p className="text-xl font-serif">+48 533 578 422</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-6 group">
                        <div className="bg-white/10 p-4 rounded-2xl group-hover:bg-white group-hover:text-[#175579] transition-all duration-300">
                            <Mail size={24} />
                        </div>
                        <div>
                        <h4 className="font-bold text-sm uppercase tracking-widest mb-1 opacity-70">E-mail</h4>
                        <p className="text-xl font-serif">biuro@zychowicz.online</p>
                        </div>
                    </div>
                    </div>
                </div>
                
                <div className="mt-20 relative z-10">
                    <p className="text-xs text-white/60 mb-6 font-bold uppercase tracking-widest">Social Media</p>
                    <div className="flex gap-4 flex-wrap">
                      {/* Facebook */}
                      <a 
                        href="[https://www.facebook.com/profile.php?id=61566167150801](https://www.facebook.com/profile.php?id=61566167150801)" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#1877F2] transition duration-300"
                        title="Facebook"
                      >
                        <Facebook size={24} />
                      </a>
                      
                      {/* Instagram */}
                      <a 
                        href="[https://www.instagram.com/zychowicz.paulina/](https://www.instagram.com/zychowicz.paulina/)" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#E4405F] transition duration-300"
                        title="Instagram"
                      >
                        <Instagram size={24} />
                      </a>

                      {/* YouTube */}
                      <a 
                        href="[https://www.youtube.com/channel/UCLOUmsiPiDtcMLGgZy0mTSA](https://www.youtube.com/channel/UCLOUmsiPiDtcMLGgZy0mTSA)" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#FF0000] transition duration-300"
                        title="YouTube"
                      >
                        <Youtube size={24} />
                      </a>

                      {/* TikTok */}
                      <a 
                        href="[https://www.tiktok.com/@zychowicz.paulina](https://www.tiktok.com/@zychowicz.paulina)" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#000000] transition duration-300"
                        title="TikTok"
                      >
                        {/* Custom TikTok SVG Icon */}
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                        </svg>
                      </a>
                    </div>
                </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3 p-12 lg:p-20 bg-white">
              <h3 className="text-3xl font-serif text-slate-900 mb-10">Napisz do mnie</h3>
              <form className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="group">
                        <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest group-focus-within:text-[#175579] transition-colors">Imię i Nazwisko</label>
                        <input type="text" className="w-full px-0 py-4 border-b-2 border-gray-200 bg-transparent focus:border-[#175579] outline-none transition-all font-medium text-lg placeholder-gray-300" placeholder="Jan Kowalski" />
                    </div>
                    <div className="group">
                        <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest group-focus-within:text-[#175579] transition-colors">Telefon</label>
                        <input type="tel" className="w-full px-0 py-4 border-b-2 border-gray-200 bg-transparent focus:border-[#175579] outline-none transition-all font-medium text-lg placeholder-gray-300" placeholder="+48 000 000 000" />
                    </div>
                </div>
                <div className="group">
                  <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest group-focus-within:text-[#175579] transition-colors">Temat</label>
                  <select className="w-full px-0 py-4 border-b-2 border-gray-200 bg-transparent focus:border-[#175579] outline-none transition-all font-medium text-lg text-slate-700 cursor-pointer">
                    <option>Chcę sprzedać nieruchomość</option>
                    <option>Chcę kupić nieruchomość</option>
                    <option>Szukam porady eksperta</option>
                    <option>Inny temat</option>
                  </select>
                </div>
                <div className="group">
                  <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest group-focus-within:text-[#175579] transition-colors">Wiadomość</label>
                  <textarea rows="4" className="w-full px-0 py-4 border-b-2 border-gray-200 bg-transparent focus:border-[#175579] outline-none transition-all font-medium text-lg placeholder-gray-300 resize-none" placeholder="Opisz krótko, jak mogę Ci pomóc..."></textarea>
                </div>
                <button type="submit" className="w-full md:w-auto bg-[#175579] text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-[#0e3a53] transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 mt-4">
                  Wyślij wiadomość
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-16">
                <div className="flex items-center gap-5 group cursor-default">
                     {/* Footer Logo */}
                    <img src="white_icon_color1_background.png" alt="Logo" className="h-16 w-auto opacity-90 rounded-full shadow-sm grayscale group-hover:grayscale-0 transition-all duration-500" />
                    
                    <div className="text-2xl font-serif text-slate-900 tracking-tight">
                        Zychowicz <span className="text-[#175579]">Nieruchomości</span>
                    </div>
                </div>
                <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-slate-500 font-medium text-sm tracking-wide">
                    {['Start', 'Usługi', 'Oferty', 'Kontakt'].map((item) => {
                        const sectionId = item === 'Start' ? 'home' : 
                                  item === 'Usługi' ? 'services' : 
                                  item === 'Oferty' ? 'offers' : 'contact';
                        return (
                            <button key={item} onClick={() => scrollToSection(sectionId)} className="hover:text-[#175579] transition-colors uppercase text-xs font-bold tracking-widest">{item}</button>
                        )
                    })}
                </div>
            </div>
            
            <div className="border-t border-gray-100 pt-10 flex flex-col md:flex-row justify-between items-center text-slate-400 text-xs font-medium uppercase tracking-wider">
                <div className="text-center md:text-left mb-4 md:mb-0">
                    &copy; {new Date().getFullYear()} Zychowicz Nieruchomości.
                </div>
                <div className="flex gap-8">
                    <a href="#" className="hover:text-[#175579] transition-colors">Polityka Prywatności</a>
                    <a href="#" className="hover:text-[#175579] transition-colors">Regulamin</a>
                </div>
            </div>
        </div>
      </footer>
      
      {/* AI Widget Component */}
      {renderAIWidget()}
    </div>
  );
};
