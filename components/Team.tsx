
import React from 'react';
import { TEAM } from '../constants';
import { TeamMember } from '../types';

interface TeamProps {
  isHighlighted: boolean;
}

const MemberCard: React.FC<{ member: TeamMember }> = ({ member }) => {
  const isL1 = member.level === 1;

  return (
    <div className={`
      group flex flex-col md:flex-row items-center gap-6 p-6 md:p-8 rounded-[2rem] transition-all duration-500 shadow-xl 
      ${isL1 ? 'bg-[#00194C] text-white border-2 border-[#F11E26] max-w-2xl' : 'bg-white text-[#00194C] border border-slate-100 hover:border-[#00194C]/10 max-w-xl'}
      animate-in fade-in slide-in-from-bottom-8 delay-${member.level * 200}
    `}>
      {/* Foto à esquerda */}
      <div className={`
        relative flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-lg 
        ${isL1 ? 'border-2 border-white/20' : 'border-2 border-slate-50'}
      `}>
        <img 
          src={member.image} 
          alt={member.name} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
        />
        {/* Subtle overlay for L1 */}
        {isL1 && <div className="absolute inset-0 bg-[#00194C]/20 pointer-events-none group-hover:opacity-0 transition-opacity"></div>}
      </div>

      {/* Informações à direita */}
      <div className="flex flex-col text-center md:text-left">
        <span className={`text-[9px] font-black uppercase tracking-[0.3em] mb-1 ${isL1 ? 'text-[#F11E26]' : 'text-slate-400'}`}>
          {member.category}
        </span>
        <h3 className={`${isL1 ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'} font-black uppercase tracking-tighter leading-tight mb-1`}>
          {member.name}
        </h3>
        <p className={`text-[11px] md:text-xs font-bold uppercase tracking-widest mb-4 ${isL1 ? 'text-white/70' : 'text-[#00194C]/50'}`}>
          {member.role}
        </p>
        
        <div className="flex items-center justify-center md:justify-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isL1 ? 'text-[#F11E26]' : 'text-[#00194C]/30'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <a 
            href={`mailto:${member.email}`}
            className={`text-[11px] md:text-xs font-semibold hover:underline break-all ${isL1 ? 'text-white/60 hover:text-white' : 'text-[#00194C]/60 hover:text-[#F11E26]'}`}
          >
            {member.email}
          </a>
        </div>
      </div>
    </div>
  );
};

const Team: React.FC<TeamProps> = ({ isHighlighted }) => {
  const l1 = TEAM.filter(m => m.level === 1);
  const l2 = TEAM.filter(m => m.level === 2);
  const l3 = TEAM.filter(m => m.level === 3);

  return (
    <section id="equipe" className={`py-32 bg-slate-50 relative overflow-hidden transition-all duration-700 ${isHighlighted ? 'highlight-pulse' : ''}`}>
      {/* Visual background accents */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-white skew-y-2 -translate-y-20 origin-top-left"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-24 text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-black text-[#00194C] mb-6 uppercase tracking-tighter leading-none">
            Governança <span className="text-[#F11E26]">&</span> <br/> Estrutura Humana
          </h2>
          <p className="text-xl text-slate-500 font-medium leading-relaxed italic">
            "A qualidade é feita por pessoas, para pessoas."
          </p>
        </div>

        {/* Organogram Structure - Vertical Stack with connections */}
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-20">
          
          {/* Level 1 - Liderança */}
          <div className="relative flex justify-center w-full">
            {l1.map(m => <MemberCard key={m.name} member={m} />)}
            {/* Connector Line down */}
            <div className="absolute top-[100%] left-1/2 w-0.5 h-20 bg-gradient-to-b from-[#F11E26] to-slate-200 transform -translate-x-1/2 -z-0"></div>
          </div>

          {/* Level 2 - Analistas */}
          <div className="relative flex justify-center w-full">
            <div className="flex flex-col gap-8 w-full items-center">
              {l2.map(m => (
                <div key={m.name} className="relative flex justify-center w-full">
                  <MemberCard member={m} />
                  {/* Connector Line down */}
                  <div className="absolute top-[100%] left-1/2 w-0.5 h-20 bg-slate-200 transform -translate-x-1/2"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Level 3 - Operacional */}
          <div className="relative flex flex-col items-center w-full">
             <div className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Fretamento</div>
             <div className="flex justify-center w-full">
               {l3.map(m => <MemberCard key={m.name} member={m} />)}
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Team;
