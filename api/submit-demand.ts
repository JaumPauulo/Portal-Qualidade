
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Tratamento de CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  try {
    const {
      solicitante, email, setor, cargo, empresa,
      necessidade, aplicacao, prioridade, informacoesGerais
    } = req.body;

    // 2. Validação de Campos Obrigatórios
    const required = { solicitante, email, setor, necessidade, aplicacao, prioridade };
    for (const [key, value] of Object.entries(required)) {
      if (!value || String(value).trim() === '') {
        return res.status(400).json({ error: `O campo ${key} é obrigatório.` });
      }
    }

    // 3. Validação de E-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'E-mail corporativo inválido.' });
    }

    // 4. Normalização de Prioridade
    const validPriorities = ["Baixa", "Média", "Alta", "Crítico"];
    const normalizedPriority = validPriorities.includes(prioridade) ? prioridade : "Média";


    // 5. Montagem do Payload para Power Automate
    const payload = {
      solicitante: String(solicitante).trim(),
      email: String(email).trim().toLowerCase(),
      setor: String(setor).trim(),
      cargo: cargo ? String(cargo).trim() : "Não informado",
      empresa: empresa ? String(empresa).trim() : "Grupo A.Cândido",
      necessidadeSetor: String(necessidade).trim(),
      aplicacaoSolicitacao: String(aplicacao).trim(),
      prioridade: String(normalizedPriority).trim(),
      informacoesGerais: informacoesGerais ? String(informacoesGerais).trim() : "",
      origem: "portal-qualidade",
      timestamp: new Date().toISOString()
    };

    // 6. Envio para Power Automate (Variável de Ambiente)
    const flowUrl = process.env.POWER_AUTOMATE_URL;
    if (!flowUrl) {
      console.error('Config Error: POWER_AUTOMATE_URL não definida.');
      return res.status(500).json({ error: 'Erro de configuração no servidor de automação.' });
    }

    const response = await fetch(flowUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      return res.status(200).json({ message: 'Solicitação registrada com sucesso no SharePoint.' });
    } else {
      const errorDetail = await response.text();
      return res.status(502).json({
        error: 'O Power Automate recusou a requisição.',
        detail: errorDetail.substring(0, 1000)
      });
    }

  } catch (err: any) {
    console.error('Internal Error:', err);
    return res.status(500).json({ error: 'Erro interno ao processar demanda.', message: err.message });
  }
}
