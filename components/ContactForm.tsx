
import React, { useState, useMemo } from 'react';
import { COMPANIES, PRIORITIES } from '../constants';

interface FormData {
  solicitante: string;
  email: string;
  setor: string;
  cargo: string;
  empresa: string;
  necessidade: string;
  aplicacao: string;
  prioridade: string;
  informacoesGerais: string;
}

const initialData: FormData = {
  solicitante: '',
  email: '',
  setor: '',
  cargo: '',
  empresa: '',
  necessidade: '',
  aplicacao: '',
  prioridade: '',
  informacoesGerais: '',
};

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.solicitante.trim()) newErrors.solicitante = 'Solicitante é obrigatório.';
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido.';
    }
    if (!formData.setor.trim()) newErrors.setor = 'Setor é obrigatório.';
    if (!formData.cargo.trim()) newErrors.cargo = 'Cargo é obrigatório.';
    if (!formData.empresa) newErrors.empresa = 'Selecione uma empresa.';
    if (!formData.necessidade.trim()) newErrors.necessidade = 'Necessidade é obrigatória.';
    if (!formData.aplicacao.trim()) newErrors.aplicacao = 'Aplicação é obrigatória.';
    if (!formData.prioridade) newErrors.prioridade = 'Selecione a prioridade.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const progress = useMemo(() => {
    const requiredFields: (keyof FormData)[] = ['solicitante', 'email', 'setor', 'cargo', 'empresa', 'necessidade', 'aplicacao', 'prioridade'];
    const filled = requiredFields.filter(f => !!formData[f].trim()).length;
    return (filled / requiredFields.length) * 100;
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      const firstError = document.querySelector('.text-red-500');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setStatus('loading');
    
    // Simulando envio para API
    setTimeout(() => {
      setStatus('success');
      setFormData(initialData);
    }, 2000);
  };

  if (status === 'success') {
    return (
      <section id="solicitar-apoio" className="py-24 bg-white scroll-mt-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-slate-50 border-2 border-[#00194C]/10 p-12 rounded-3xl text-center shadow-2xl animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-[#00194C] mb-4 uppercase tracking-tight">Solicitação enviada com sucesso!</h2>
            <p className="text-lg text-[#00194C]/70 mb-10 font-medium">
              Em breve retornaremos com o alinhamento da sua demanda.
            </p>
            <button 
              onClick={() => setStatus('idle')}
              className="px-12 py-4 bg-[#00194C] text-white rounded-xl font-black hover:bg-[#F11E26] transition-all uppercase tracking-widest text-sm"
            >
              Nova Solicitação
            </button>
          </div>
        </div>
      </section>
    );
  }

  const inputClass = (field: keyof FormData) => `
    w-full px-4 py-3 rounded-xl border-2 transition-all outline-none font-medium text-[#00194C]
    ${errors[field] ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-[#00194C] focus:ring-4 focus:ring-[#00194C]/5'}
  `;

  const labelClass = "block text-xs font-black text-[#00194C] uppercase tracking-widest mb-2 flex justify-between";

  return (
    <section id="solicitar-apoio" className="py-24 bg-white scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <h2 className="text-5xl font-extrabold text-[#00194C] mb-6 uppercase tracking-tighter leading-none">
                Solicitar <br/><span className="text-[#F11E26]">Apoio</span>
              </h2>
              <p className="text-lg text-[#00194C]/80 mb-10 leading-relaxed font-medium">
                Sua demanda é nossa prioridade. Preencha o formulário detalhadamente para que possamos entender como a Qualidade Corporativa pode otimizar seu setor.
              </p>
              
              <div className="space-y-6">
                {[
                  { t: "Padronização", d: "Criamos fluxos claros e eficientes." },
                  { t: "Automação", d: "Reduzimos tarefas manuais repetitivas." },
                  { t: "Governança", d: "Asseguramos conformidade e resultados." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-hover hover:shadow-lg">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#F11E26] shadow-sm flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-black text-[#00194C] uppercase text-xs tracking-widest mb-1">{item.t}</h4>
                      <p className="text-sm text-[#00194C]/60 font-medium">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white p-1 md:p-2 rounded-[2rem] border-2 border-slate-100 shadow-2xl relative overflow-hidden">
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 h-1.5 bg-[#F11E26] transition-all duration-500 ease-out z-20" style={{ width: `${progress}%` }}></div>
              
              <div className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Grid 1: Identificação */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>
                        <span>1) Solicitante</span>
                        {errors.solicitante && <span className="text-red-500 font-bold lowercase italic">{errors.solicitante}</span>}
                      </label>
                      <input 
                        name="solicitante"
                        value={formData.solicitante}
                        onChange={handleChange}
                        type="text" 
                        placeholder="Insira seu nome e sobrenome."
                        className={inputClass('solicitante')}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        <span>2) E-mail do Solicitante</span>
                        {errors.email && <span className="text-red-500 font-bold lowercase italic">{errors.email}</span>}
                      </label>
                      <input 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="text" 
                        placeholder="Insira seu email."
                        className={inputClass('email')}
                      />
                    </div>
                  </div>

                  {/* Grid 2: Setor e Cargo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>
                        <span>3) Setor?</span>
                        {errors.setor && <span className="text-red-500 font-bold lowercase italic">{errors.setor}</span>}
                      </label>
                      <input 
                        name="setor"
                        value={formData.setor}
                        onChange={handleChange}
                        type="text" 
                        placeholder="Insira o setor que você faz parte."
                        className={inputClass('setor')}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        <span>4) Cargo do Solicitante</span>
                        {errors.cargo && <span className="text-red-500 font-bold lowercase italic">{errors.cargo}</span>}
                      </label>
                      <input 
                        name="cargo"
                        value={formData.cargo}
                        onChange={handleChange}
                        type="text" 
                        placeholder="Insira o seu cargo."
                        className={inputClass('cargo')}
                      />
                    </div>
                  </div>

                  {/* Empresa */}
                  <div>
                    <label className={labelClass}>
                      <span>5) Empresa</span>
                      {errors.empresa && <span className="text-red-500 font-bold lowercase italic">{errors.empresa}</span>}
                    </label>
                    <p className="text-[10px] text-[#00194C]/40 mb-2 italic">Qual empresa deverá ser aplicada?</p>
                    <select 
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleChange}
                      className={inputClass('empresa') + " bg-white appearance-none cursor-pointer"}
                    >
                      <option value="" disabled>Selecionar sua resposta</option>
                      {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Necessidade */}
                  <div>
                    <label className={labelClass}>
                      <span>6) Necessidade do Setor</span>
                      {errors.necessidade && <span className="text-red-500 font-bold lowercase italic">{errors.necessidade}</span>}
                    </label>
                    <input 
                      name="necessidade"
                      value={formData.necessidade}
                      onChange={handleChange}
                      type="text" 
                      placeholder="Detalhe um pouco da necessidade do seu setor."
                      className={inputClass('necessidade')}
                    />
                  </div>

                  {/* Aplicação */}
                  <div>
                    <label className={labelClass}>
                      <span>7) Aplicação da Solicitação</span>
                      {errors.aplicacao && <span className="text-red-500 font-bold lowercase italic">{errors.aplicacao}</span>}
                    </label>
                    <p className="text-[10px] text-[#00194C]/50 mb-3 bg-blue-50 p-2 rounded-lg border-l-2 border-[#00194C]">
                      Explica para a gente o que você espera que sua solicitação resolva, assim, conseguimos alinhar melhor as expectativas
                    </p>
                    <textarea 
                      name="aplicacao"
                      value={formData.aplicacao}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Insira sua resposta"
                      className={inputClass('aplicacao') + " resize-none"}
                    ></textarea>
                  </div>

                  {/* Prioridade */}
                  <div>
                    <label className={labelClass}>
                      <span>8) Prioridade?</span>
                      {errors.prioridade && <span className="text-red-500 font-bold lowercase italic">{errors.prioridade}</span>}
                    </label>
                    <p className="text-[10px] text-[#00194C]/40 mb-4 italic">Para você qual a prioridade de entrega dessa demanda?</p>
                    <div className="flex flex-wrap gap-3">
                      {PRIORITIES.map(p => (
                        <label 
                          key={p} 
                          className={`
                            flex-1 min-w-[100px] cursor-pointer text-center py-3 rounded-xl border-2 font-bold text-sm transition-all
                            ${formData.prioridade === p 
                              ? 'bg-[#00194C] text-white border-[#00194C]' 
                              : 'border-slate-100 text-[#00194C]/50 hover:border-[#F11E26]/30'}
                          `}
                        >
                          <input 
                            type="radio" 
                            name="prioridade" 
                            value={p} 
                            checked={formData.prioridade === p}
                            onChange={handleChange}
                            className="hidden"
                          />
                          {p}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Informações Gerais */}
                  <div>
                    <label className={labelClass}>
                      <span>9) Informações Gerais</span>
                    </label>
                    <p className="text-[10px] text-[#00194C]/40 mb-2 italic">Caso tenha algo a acrescentar, por favor, detalhe aqui.</p>
                    <input 
                      name="informacoesGerais"
                      value={formData.informacoesGerais}
                      onChange={handleChange}
                      type="text" 
                      placeholder="Insira sua resposta"
                      className={inputClass('informacoesGerais')}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={status === 'loading'}
                    className={`
                      w-full py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-red-500/20 uppercase tracking-[0.2em] flex items-center justify-center gap-3
                      ${status === 'loading' 
                        ? 'bg-slate-400 cursor-not-allowed opacity-70' 
                        : 'bg-[#F11E26] text-white hover:bg-[#00194C] active:scale-[0.98]'}
                    `}
                  >
                    {status === 'loading' ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      'Enviar Solicitação'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
