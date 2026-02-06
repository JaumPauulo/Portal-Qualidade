
import React from 'react';
import { PROJECTS } from '../constants';
import { Project, ProjectStatus } from '../types';

interface ProjectsProps {
  onOpenDetails: (project: Project) => void;
  isHighlighted: boolean;
}

const ProjectCard: React.FC<{ project: Project; onOpen: () => void }> = ({ project, onOpen }) => {
  const isCompleted = project.status === ProjectStatus.COMPLETED;

  return (
    <div className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
            isCompleted ? 'bg-green-100 text-green-700' : 'bg-[#F11E26] text-white'
          }`}>
            {project.status}
          </span>
          <span className="text-[10px] font-black text-[#00194C]/30 uppercase tracking-widest">{project.tag}</span>
        </div>
        
        <h3 className="text-2xl font-black text-[#00194C] mb-4 leading-tight uppercase tracking-tighter">{project.title}</h3>
        <p className="text-slate-500 mb-8 font-medium line-clamp-2">{project.description}</p>
        
        <button 
          onClick={onOpen}
          className="w-full py-4 bg-slate-50 group-hover:bg-[#00194C] text-[#00194C] group-hover:text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
        >
          Ver Detalhes do Impacto
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const Projects: React.FC<ProjectsProps> = ({ onOpenDetails, isHighlighted }) => {
  const completed = PROJECTS.filter(p => p.status === ProjectStatus.COMPLETED);
  const ongoing = PROJECTS.filter(p => p.status === ProjectStatus.ONGOING);

  return (
    <section id="projetos" className={`py-24 bg-slate-50 transition-all duration-700 ${isHighlighted ? 'highlight-pulse' : ''}`}>
      <div className="container mx-auto px-6">
        <div className="mb-20 text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-black text-[#00194C] mb-6 uppercase tracking-tighter">Projetos de Impacto</h2>
          <p className="text-xl text-slate-500 font-medium">
            Entregas reais que transformaram a operação do Grupo A.Cândido através da qualidade.
          </p>
        </div>

        <div className="mb-20">
          <h3 className="text-xs font-black text-[#00194C] uppercase tracking-[0.3em] mb-12 flex items-center">
            <span className="w-16 h-1.5 bg-[#F11E26] mr-6"></span>
            Cases de Sucesso (Finalizados)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {completed.map(project => (
              <ProjectCard key={project.id} project={project} onOpen={() => onOpenDetails(project)} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-black text-[#F11E26] uppercase tracking-[0.3em] mb-12 flex items-center">
            <span className="w-16 h-1.5 bg-[#00194C] mr-6"></span>
            Direcionadores (Em Andamento)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {ongoing.map(project => (
              <ProjectCard key={project.id} project={project} onOpen={() => onOpenDetails(project)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
