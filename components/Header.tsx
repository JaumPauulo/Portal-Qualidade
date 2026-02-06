
import React, { useState, useEffect } from 'react';

interface HeaderProps {
  onOpenSupport: () => void;
  onNav: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSupport, onNav }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'O que fazemos', id: 'o-que-fazemos' },
    { label: 'Projetos', id: 'projetos' },
    { label: 'Equipe', id: 'equipe' },
    { label: 'Ferramentas', id: 'ferramentas' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-xl py-2' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => onNav('início')}>
          <img 
            src="https://acandido.com.br/wp-content/uploads/2021/12/logo-white-1024x219.png" 
            alt="Grupo A.Cândido" 
            className={`h-10 md:h-12 w-auto transition-all duration-300 object-contain ${
              isScrolled ? 'brightness-0' : 'brightness-100'
            }`}
          />
          <div className="hidden sm:flex flex-col border-l border-white/20 pl-4 h-8 justify-center">
            <span className={`font-black tracking-tight leading-none text-xs ${isScrolled ? 'text-[#00194C]' : 'text-white'}`}>
              QUALIDADE
            </span>
            <span className={`text-[8px] font-bold tracking-[0.2em] text-[#F11E26]`}>
              CORPORATIVA
            </span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center space-x-10">
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => onNav(item.id)}
              className={`text-sm font-black uppercase tracking-widest transition-all hover:text-[#F11E26] ${
                isScrolled ? 'text-[#00194C]' : 'text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button 
            onClick={onOpenSupport}
            className="bg-[#F11E26] text-white px-8 py-3 rounded-xl text-sm font-black hover:bg-[#00194C] transition-all shadow-xl shadow-red-500/20 uppercase tracking-[0.15em] active:scale-95"
          >
            Solicitar Apoio
          </button>
        </nav>

        {/* Mobile menu trigger could go here if needed, keeping it clean for now */}
      </div>
    </header>
  );
};

export default Header;
