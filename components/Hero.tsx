
import React from 'react';

interface HeroProps {
  onOpenSupport: () => void;
  onNav: (id: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenSupport, onNav }) => {
  return (
    <section id="início" className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-bg pt-20">
      {/* Dynamic Background */}
      <div className="absolute inset-0 tech-grid opacity-30"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-[#F11E26] rounded-full floating" style={{animationDelay: '0s'}}></div>
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-white rounded-full floating" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-[#F11E26] rounded-full floating" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="inline-block px-6 py-2 mb-8 rounded-full glass-card text-white text-xs font-black tracking-[0.3em] uppercase border border-white/10 animate-in fade-in slide-in-from-top-4 duration-1000">
          Setor Corporativo de Qualidade
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter uppercase animate-in zoom-in duration-700">
          Qualidade que <br/>
          <span className="hero-title-gradient">padroniza.</span><br />
          Inovação que <br/>
          <span className="hero-title-gradient">acelera.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          Promovendo padronização e melhoria contínua transversalmente em todas as empresas do Grupo A.Cândido.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
          <button 
            onClick={onOpenSupport}
            className="w-full sm:w-auto px-12 py-5 bg-[#F11E26] text-white rounded-2xl font-black text-xl hover:bg-white hover:text-[#00194C] transition-all shadow-2xl shadow-red-500/30 flex items-center justify-center group uppercase tracking-widest"
          >
            Solicitar Apoio
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <button 
            onClick={() => onNav('projetos')}
            className="w-full sm:w-auto px-12 py-5 border-4 border-white/20 text-white rounded-2xl font-black text-xl hover:bg-white/10 transition-all uppercase tracking-widest flex items-center justify-center backdrop-blur-md"
          >
            Ver Projetos
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer" onClick={() => onNav('o-que-fazemos')}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
