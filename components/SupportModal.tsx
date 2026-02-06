
import React, { useState } from 'react';
import { COMPANIES, PRIORITIES } from '../constants';

interface SupportModalProps {
  onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ onClose }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const raw = Object.fromEntries(formData.entries());

    const data = {
      solicitante: String(raw.solicitante || '').trim(),
      email: String(raw.email || '').trim(),
      setor: String(raw.setor || '').trim(),
      cargo: String(raw.cargo || '').trim(),
      empresa: String(raw.empresa || '').trim(),
      necessidade: String(raw.necessidade || '').trim(),
      aplicacao: String(raw.aplicacao || '').trim(),
      prioridade: String(raw.prioridade || '').trim(),
      informacoesGerais: String(raw.informacoesGerais || '').trim(),
    };

    // Reset e Validação Visual
    setErrors({});
    const newErrors: Record<string, string> = {};

    if (!data.solicitante) newErrors.solicitante = "Obrigatório";
    if (!data.email) newErrors.email = "Obrigatório";
    if (!data.setor) newErrors.setor = "Obrigatório";
    if (!data.necessidade) newErrors.necessidade = "Obrigatório";
    if (!data.aplicacao) newErrors.aplicacao = "Obrigatório";
    if (!data.prioridade) newErrors.prioridade = "Obrigatório";


    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/submit-demand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const text = await response.text();
      let result: any = {};
      try { result = text ? JSON.parse(text) : {}; } catch { }


      if (response.ok) {
        setStatus('success');
      } else {
        setErrorMessage(result.error || 'Houve um problema ao processar sua solicitação.');
        setStatus('error');
      }
    } catch (err) {
      setErrorMessage('Erro de conexão com o servidor. Tente novamente.');
      setStatus('error');
    }
  };

  const inputClass = (name: string) => `
    w-full px-4 py-3 rounded-xl border-2 transition-all outline-none font-medium text-[#00194C]
    ${errors[name] ? 'border-red-500 bg-red-50' : 'border-slate-100 focus:border-[#00194C] focus:ring-4 focus:ring-[#00194C]/5 bg-white shadow-sm'}
  `;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#00194C]/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-20 duration-500">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center hover:bg-[#F11E26] hover:text-white transition-all z-20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="overflow-y-auto p-10 md:p-16 custom-scroll">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-4xl font-black text-[#00194C] uppercase tracking-tighter mb-4">Solicitação Enviada!</h2>
              <p className="text-xl text-[#00194C]/60 font-medium max-w-md">Os dados foram integrados à lista do SharePoint. Em breve retornaremos via e-mail.</p>
              <button
                onClick={onClose}
                className="mt-10 px-12 py-4 bg-[#00194C] text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#F11E26] transition-all"
              >
                Fechar Portal
              </button>
            </div>
          ) : (
            <>
              <div className="mb-12">
                <h2 className="text-4xl font-black text-[#00194C] uppercase tracking-tighter leading-none mb-4">
                  Abrir <span className="text-[#F11E26]">Chamado Corporativo</span>
                </h2>
                <p className="text-slate-500 font-medium">Preencha os dados abaixo para registro oficial no Microsoft 365.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-[#00194C]">Solicitante*</label>
                    <input name="solicitante" placeholder="Nome completo" className={inputClass('solicitante')} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-[#00194C]">E-mail Corporativo*</label>
                    <input name="email" type="email" placeholder="email@acandidotransportes.com.br" className={inputClass('email')} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-[#00194C]">Setor*</label>
                    <input name="setor" placeholder="Ex: Financeiro, RH..." className={inputClass('setor')} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-[#00194C]">Cargo</label>
                    <input name="cargo" placeholder="Seu cargo atual" className={inputClass('cargo')} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#00194C]">Empresa</label>
                  <select name="empresa" className={inputClass('empresa') + " appearance-none cursor-pointer"}>
                    <option value="">Selecione a unidade</option>
                    {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#00194C]">Título da Demanda*</label>
                  <input name="necessidade" placeholder="O que você precisa?" className={inputClass('necessidade')} />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#00194C]">Descrição Detalhada*</label>
                  <textarea name="aplicacao" rows={4} placeholder="Descreva o problema ou melhoria desejada..." className={inputClass('aplicacao') + " resize-none"}></textarea>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-[#00194C]">Prioridade*</label>
                  <div className="flex flex-wrap gap-4">
                    {PRIORITIES.map(p => (
                      <label key={p} className="flex-1 min-w-[120px] cursor-pointer group">
                        <input type="radio" name="prioridade" value={p} className="hidden peer" required />
                        <div className="w-full text-center py-4 rounded-2xl border-2 border-slate-100 font-bold text-[#00194C] peer-checked:bg-[#00194C] peer-checked:text-white peer-checked:border-[#00194C] hover:border-[#F11E26]/30 transition-all">
                          {p}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#00194C]">Informações Extras</label>
                  <input name="informacoesGerais" placeholder="Algum detalhe adicional?" className={inputClass('informacoesGerais')} />
                </div>

                {status === 'error' && (
                  <div className="p-4 bg-red-100 text-red-700 rounded-xl font-bold text-center">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={`
                    w-full py-6 rounded-[2rem] font-black text-xl uppercase tracking-[0.2em] transition-all shadow-2xl shadow-red-500/30 flex items-center justify-center gap-4
                    ${status === 'loading' ? 'bg-slate-400 cursor-not-allowed opacity-70' : 'bg-[#F11E26] text-white hover:bg-[#00194C] active:scale-95'}
                  `}
                >
                  {status === 'loading' ? 'Enviando ao SharePoint...' : 'Enviar Solicitação'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
