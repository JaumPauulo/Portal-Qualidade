
export interface Env {
  POWER_AUTOMATE_URL: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // 1. CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    try {
      const body: any = await request.json();
      const { solicitante, email, setor, necessidade, aplicacao, prioridade } = body;

      // Validação simples
      if (!solicitante || !email || !setor || !necessidade || !aplicacao || !prioridade) {
        return new Response(JSON.stringify({ error: 'Campos obrigatórios ausentes.' }), { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      const payload = {
        solicitante_nome: solicitante,
        solicitante_email: email,
        area_solicitante: setor,
        cargo: body.cargo || "N/A",
        empresa: body.empresa || "Grupo A.Cândido",
        titulo: necessidade,
        descricao: aplicacao,
        prioridade: prioridade,
        informacoes_gerais: body.informacoesGerais || "N/A",
        data_solicitacao: new Date().toISOString()
      };

      const flowResponse = await fetch(env.POWER_AUTOMATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (flowResponse.ok) {
        return new Response(JSON.stringify({ message: 'Sucesso' }), { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      return new Response(JSON.stringify({ error: 'Erro no Flow' }), { 
        status: 502, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });

    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
  }
};
