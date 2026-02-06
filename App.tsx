
import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import WhatWeDo from './components/WhatWeDo';
import Projects from './components/Projects';
import Team from './components/Team';
import Tools from './components/Tools';
import Footer from './components/Footer';
import SupportModal from './components/SupportModal';
import ProjectModal from './components/ProjectModal';
import { Project } from './types';

function App() {
  const [activeModal, setActiveModal] = useState<'support' | 'project' | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  const openSupport = () => setActiveModal('support');
  const closeModals = () => {
    setActiveModal(null);
    setSelectedProject(null);
  };

  const openProjectDetails = (project: Project) => {
    setSelectedProject(project);
    setActiveModal('project');
  };

  const handleNav = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setHighlightedSection(sectionId);
      setTimeout(() => setHighlightedSection(null), 1500);
    }
  };

  return (
    <div className={`min-h-screen selection:bg-[#F11E26] selection:text-white ${activeModal ? 'overflow-hidden' : ''}`}>
      <Header onOpenSupport={openSupport} onNav={handleNav} />
      
      <main>
        <Hero onOpenSupport={openSupport} onNav={handleNav} />
        <WhatWeDo />
        <Projects 
          onOpenDetails={openProjectDetails} 
          isHighlighted={highlightedSection === 'projetos'} 
        />
        <Team isHighlighted={highlightedSection === 'equipe'} />
        <Tools isHighlighted={highlightedSection === 'ferramentas'} />
        
        <section className="py-24 bg-[#00194C] relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#F11E26] opacity-0 group-hover:opacity-5 transition-opacity duration-700"></div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-white text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none max-w-5xl mx-auto transform transition-transform group-hover:scale-[1.02]">
              "Garantimos que o crescimento do Grupo A.Cândido seja sustentado por processos sólidos, inovação constante e governança de excelência."
            </h2>
          </div>
        </section>
      </main>

      <Footer onNav={handleNav} onOpenSupport={openSupport} />

      {activeModal === 'support' && <SupportModal onClose={closeModals} />}
      {activeModal === 'project' && selectedProject && (
        <ProjectModal project={selectedProject} onClose={closeModals} />
      )}
    </div>
  );
}

export default App;
