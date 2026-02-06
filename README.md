<p align="center">
  <img src="https://acandido.com.br/wp-content/uploads/2021/12/logo-white-1024x219.png" alt="Grupo A.Cândido" width="420" />
</p>

<h1 align="center">Portal Qualidade — Grupo A.Cândido</h1>

<p align="center">
  Portal institucional do <strong>Setor Corporativo de Qualidade</strong>, criado para apresentar o setor e centralizar solicitações de apoio com registro automático no <strong>SharePoint</strong> via <strong>Power Automate</strong>.
</p>

<p align="center">
  <a href="#visão-geral">Visão Geral</a> •
  <a href="#principais-seções">Seções</a> •
  <a href="#formulário-de-solicitação">Formulário</a> •
  <a href="#integração-power-automate--sharepoint">Integração</a> •
  <a href="#configuração">Configuração</a> •
  <a href="#deploy">Deploy</a>
</p>

---

## Visão Geral

O **Portal Qualidade** foi desenvolvido para:
- Apresentar o **Setor Corporativo de Qualidade** do Grupo A.Cândido
- Exibir projetos e iniciativas de impacto
- Listar ferramentas e métodos utilizados pelo setor
- Permitir que áreas/empresas do grupo **solicitem apoio** por meio de um formulário moderno e responsivo
- Integrar automaticamente as solicitações em uma **lista do SharePoint** (via **Power Automate**)

---

## Principais Seções

- **Hero (Tela inicial)**: mensagem de impacto + CTA para solicitar apoio e ver projetos
- **O que fazemos**: visão do setor (metodologias, tecnologia, padronização e melhoria contínua)
- **Nossa Equipe**: visualização hierárquica com foto, nome, cargo e e-mail corporativo
- **Projetos**: cards com casos de sucesso e projetos em andamento
- **Ferramentas**: Microsoft 365 + automações e ferramentas de processos
- **Solicitar Apoio**: abertura de chamado via modal/formulário

---

## Formulário de Solicitação

O formulário coleta as seguintes informações:

1. **Solicitante** *(obrigatório)*
2. **E-mail do Solicitante** *(obrigatório)*
3. **Setor** *(obrigatório)*
4. **Cargo do Solicitante**
5. **Empresa** *(unidade/empresa para aplicação)*
6. **Necessidade do Setor** *(obrigatório)*
7. **Aplicação da Solicitação** *(obrigatório)*
8. **Prioridade** *(obrigatório)*: Crítico / Alta / Média / Baixa
9. **Informações Gerais** *(opcional)*

Após o envio, o usuário recebe feedback visual de **sucesso/erro** no próprio modal.

---

## Integração Power Automate + SharePoint

O fluxo funciona assim:

**Site → API → Power Automate (HTTP Trigger) → SharePoint (Create Item) → Response (200)**

A API recebe os dados do formulário e encaminha para a URL do Power Automate usando a variável de ambiente `POWER_AUTOMATE_URL`.

### Payload esperado (exemplo)
```json
{
  "solicitante": "Nome Sobrenome",
  "email": "email@empresa.com",
  "setor": "RH",
  "cargo": "Analista",
  "empresa": "A.Cândido",
  "necessidadeSetor": "Resumo curto da necessidade",
  "aplicacaoSolicitacao": "Descrição detalhada",
  "prioridade": "Alta",
  "informacoesGerais": "Texto opcional",
  "origem": "portal-qualidade",
  "timestamp": "2026-02-06T12:00:00-03:00"
}
