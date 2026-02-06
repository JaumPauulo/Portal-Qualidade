// api/submit-demand.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

type IncomingBody = {
  solicitante?: unknown;
  email?: unknown;
  setor?: unknown;
  cargo?: unknown;
  empresa?: unknown;
  necessidade?: unknown;
  aplicacao?: unknown;
  prioridade?: unknown;
  informacoesGerais?: unknown;
};

const ALLOWED_PRIORITIES = ["Baixa", "Média", "Alta", "Crítico"] as const;

function toStr(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v);
}

function clean(v: unknown): string {
  return toStr(v).trim();
}

function isNonEmpty(v: unknown): boolean {
  return clean(v).length > 0;
}

function isValidEmail(email: string): boolean {
  // simples e suficiente p/ corporativo
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setCors(res: VercelResponse) {
  // Se quiser travar no seu domínio, troque '*' pelo domínio do portal
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.setHeader("Access-Control-Max-Age", "86400");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido. Use POST." });
  }

  try {
    const body = (req.body || {}) as IncomingBody;

    // 1) Ler e limpar campos
    const solicitante = clean(body.solicitante);
    const email = clean(body.email).toLowerCase();
    const setor = clean(body.setor);
    const cargo = isNonEmpty(body.cargo) ? clean(body.cargo) : "Não informado";
    const empresa = isNonEmpty(body.empresa) ? clean(body.empresa) : "Grupo A.Cândido";
    const necessidade = clean(body.necessidade);
    const aplicacao = clean(body.aplicacao);
    const prioridadeRaw = clean(body.prioridade);
    const informacoesGerais = isNonEmpty(body.informacoesGerais)
      ? clean(body.informacoesGerais)
      : "";

    // 2) Validação de obrigatórios (iguais ao seu formulário)
    const missing: string[] = [];
    if (!solicitante) missing.push("solicitante");
    if (!email) missing.push("email");
    if (!setor) missing.push("setor");
    if (!necessidade) missing.push("necessidade");
    if (!aplicacao) missing.push("aplicacao");
    if (!prioridadeRaw) missing.push("prioridade");

    if (missing.length) {
      return res.status(400).json({
        error: "Campos obrigatórios ausentes.",
        fields: missing,
      });
    }

    // 3) Validação de e-mail
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "E-mail corporativo inválido." });
    }

    // 4) Normalização de prioridade
    const normalizedPriority = (ALLOWED_PRIORITIES as readonly string[]).includes(prioridadeRaw)
      ? prioridadeRaw
      : "Média";

    // 5) Payload EXATAMENTE no seu padrão (o mesmo JSON que você passou pro Flow)
    // ATENÇÃO: seu Flow deve estar com esquema gerado para estas chaves.
    const payload = {
      solicitante,
      email,
      setor,
      cargo,
      empresa,
      tituloDemanda: necessidade, // título da demanda
      aplicacaoSolicitacao: aplicacao, // descrição detalhada
      prioridade: normalizedPriority,
      informacoesGerais,
      origem: "portal-qualidade",
      timestamp: new Date().toISOString(),
    };

    // 6) URL do Flow
    const flowUrl = process.env.POWER_AUTOMATE_URL;
    if (!flowUrl || !flowUrl.trim()) {
      console.error("Config Error: POWER_AUTOMATE_URL não definida.");
      return res.status(500).json({
        error: "Erro de configuração no servidor de automação.",
        hint: "Defina POWER_AUTOMATE_URL nas variáveis de ambiente da Vercel.",
      });
    }

    // 7) Enviar para Power Automate e registrar o retorno (para diagnosticar 502)
    const flowResp = await fetch(flowUrl.trim(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const flowText = await flowResp.text(); // sempre leia o corpo (ajuda a descobrir o motivo real)

    if (!flowResp.ok) {
      console.error("Power Automate error:", {
        status: flowResp.status,
        body: flowText?.slice(0, 2000),
      });

      // repassa o status do Flow para facilitar debug
      return res.status(502).json({
        error: "O Power Automate recusou a requisição.",
        flowStatus: flowResp.status,
        detail: flowText?.slice(0, 2000),
      });
    }

    // Se o Flow responder JSON, ok. Se responder vazio, ok também.
    return res.status(200).json({
      message: "Solicitação enviada com sucesso.",
      // útil só para debug (pode remover depois)
      flowStatus: flowResp.status,
    });
  } catch (err: any) {
    console.error("Internal Error:", err);
    return res.status(500).json({
      error: "Erro interno ao processar demanda.",
      message: err?.message || String(err),
    });
  }
}
