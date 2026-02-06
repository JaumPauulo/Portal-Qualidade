
import React from 'react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[#00194C]/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-500">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center hover:bg-[#F11E26] hover:text-white transition-all z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 bg-[#00194C] p-10 text-white flex flex-col justify-center">
            <span className="px-3 py-1 bg-[#F11E26] text-white text-[10px] font-black uppercase tracking-widest rounded-md self-start mb-6">
              {project.tag}
            </span>
            <h2 className="text-4xl font-black mb-6 leading-tight uppercase tracking-tighter">{project.title}</h2>
            <p className="text-white/70 font-medium leading-relaxed mb-8">
              {project.description}
            </p>
            
            {project.sectors && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#F11E26]">Setores Impactados</h4>
                <div className="flex flex-wrap gap-2">
                  {project.sectors.map(s => (
                    <span key={s} className="px-2 py-1 bg-white/10 rounded text-xs font-bold uppercase tracking-wider">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 p-10 bg-slate-50 flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-slate-300">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cenário Anterior</h4>
                <p className="text-[#00194C] font-semibold leading-relaxed">{project.before}</p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-[#F11E26]">
                <h4 className="text-[10px] font-black text-[#F11E26] uppercase tracking-widest mb-2">Cenário Atual</h4>
                <p className="text-[#00194C] font-semibold leading-relaxed">{project.after}</p>
              </div>
            </div>

            <div className="mt-auto bg-[#00194C] p-6 rounded-2xl text-white shadow-xl shadow-[#00194C]/20 border-b-4 border-[#F11E26]">
              <h4 className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Impacto Final</h4>
              <p className="text-xl font-black leading-snug">{project.result}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
