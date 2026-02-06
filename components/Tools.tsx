
import React from 'react';
import { TOOLS_CATEGORIES } from '../constants';

interface ToolsProps {
  isHighlighted: boolean;
}

const Tools: React.FC<ToolsProps> = ({ isHighlighted }) => {
  return (
    <section id="ferramentas" className={`py-24 bg-[#00194C] relative overflow-hidden transition-all duration-700 ${isHighlighted ? 'highlight-pulse' : ''}`}>
      <div className="absolute inset-0 tech-grid opacity-10"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mb-20">
          <h2 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter">Ferramentas & <span className="text-[#F11E26]">Métodos</span></h2>
          <p className="text-xl text-white/50 font-medium leading-relaxed">
            Nossa stack tecnológica e metodológica garante segurança e transparência em cada processo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {TOOLS_CATEGORIES.map((cat, i) => (
            <div key={cat.name} className="space-y-6">
              <h4 className="text-[10px] font-black text-[#F11E26] uppercase tracking-[0.4em] ml-2">{cat.name}</h4>
              <div className="space-y-4">
                {cat.items.map(item => (
                  <div key={item.name} className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:bg-[#F11E26] transition-all duration-500 group cursor-default">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-3xl filter group-hover:brightness-0 group-hover:invert transition-all">{item.icon}</span>
                      <h3 className="text-xl font-bold text-white uppercase tracking-tighter">{item.name}</h3>
                    </div>
                    <p className="text-white/40 group-hover:text-white/80 font-medium text-sm transition-colors">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tools;
