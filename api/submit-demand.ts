// api/submit-demand.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

type IncomingBody = {
  solicitante?: unknown;
  email?: unknown;
  setor?: unknown;
  cargo?: unknown;
  empresa?: unknown;

  // Form do site (nomes atuais)
  necessidade?: unknown; // Título
  aplicacao?: unknown;   // Descrição
  prioridade?: unknown;

  // Não existe mais no site, mas o Flow tem no schema
  informacoesGerais?: unknown;
};

const ALLOWED_PRIORITIES = ["Baixa", "Média", "Alta", "Crítico"] as const;

const toStr = (v: unknown) => (v === null || v === undefined ? "" : String(v));
const clean = (v: unknown) => toStr(v).trim();
const isNonEmpty = (v: unknown) => clean(v).length > 0;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setCors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
  res.setHeader("Access-Control-Max-Age", "86400");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido. Use POST." });

  try {
    const body = (req.body || {}) as IncomingBody;

    const solicitante = clean(body.solicitante);
    const email = clean(body.email).toLowerCase();
    const setor = clean(body.setor);
    const cargo = isNonEmpty(body.cargo) ? clean(body.cargo) : "Não informado";
    const empresa = isNonEmpty(body.empresa) ? clean(body.empresa) : "Grupo A.Cândido";

    // Site
    const titulo = clean(body.necessidade);     // Título*
    const descricao = clean(body.aplicacao);    // Descrição*
    const prioridadeRaw = clean(body.prioridade);

    // Flow tem no schema, mas seu site não usa: mantém vazio
    const informacoesGerais = isNonEmpty(body.informacoesGerais) ? clean(body.informacoesGerais) : "";

    // Obrigatórios
    const missing: string[] = [];
    if (!solicitante) missing.push("solicitante");
    if (!email) missing.push("email");
    if (!setor) missing.push("setor");
    if (!titulo) missing.push("necessidade (Título)");
    if (!descricao) missing.push("aplicacao (Descrição)");
    if (!prioridadeRaw) missing.push("prioridade");

    if (missing.length) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes.", fields: missing });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "E-mail corporativo inválido." });
    }

    const normalizedPriority = (ALLOWED_PRIORITIES as readonly string[]).includes(prioridadeRaw)
      ? prioridadeRaw
      : "Média";

    // ✅ Payload 100% compatível com o schema do seu gatilho HTTP
    // - necessidadeSetor: vamos usar como "Nome da Tarefa" (Título)
    // - aplicacaoSolicitacao: vamos usar como "Necessidade do Setor" e/ou "Aplicação da Solicitação" (Descrição)
    const payload = {
      solicitante,
      email,
      setor,
      cargo,
      empresa,
      necessidadeSetor: titulo,
      aplicacaoSolicitacao: descricao,
      prioridade: normalizedPriority,
      informacoesGerais,
      origem: "portal-qualidade",
      timestamp: new Date().toISOString(),
    };

    const flowUrl = process.env.POWER_AUTOMATE_URL;
    if (!flowUrl || !flowUrl.trim()) {
      return res.status(500).json({ error: "POWER_AUTOMATE_URL não definida na Vercel." });
    }

    const flowResp = await fetch(flowUrl.trim(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const flowText = await flowResp.text().catch(() => "");

    if (!flowResp.ok) {
      return res.status(502).json({
        error: "O Power Automate recusou a requisição.",
        flowStatus: flowResp.status,
        detail: flowText?.slice(0, 2000),
      });
    }

    return res.status(200).json({ message: "Solicitação enviada com sucesso." });
  } catch (err: any) {
    return res.status(500).json({ error: "Erro interno.", message: err?.message || String(err) });
  }
}
