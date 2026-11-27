export interface BaseModuleCatalogEntry {
  readonly code: string;
  readonly name: string;
  readonly description: string;
  readonly sortOrder: number;
  readonly active: boolean;
}

export const BASE_MODULE_CATALOG: readonly BaseModuleCatalogEntry[] = [
  { code: 'REGISTRATIONS', name: 'Cadastros', description: 'Clientes, fornecedores, peças e tabelas base', sortOrder: 10, active: true },
  { code: 'PRODUCTION', name: 'Produção', description: 'Ordens de serviço, receitas e processos', sortOrder: 20, active: true },
  { code: 'FACTORY_FLOOR', name: 'Chão de fábrica', description: 'Apontamentos, máquinas e IoT', sortOrder: 30, active: true },
  { code: 'PURCHASING_INVENTORY', name: 'Compras e estoque', description: 'Insumos, almoxarifado e compras', sortOrder: 40, active: true },
  { code: 'SALES', name: 'Vendas', description: 'Orçamentos, pedidos e faturamento comercial', sortOrder: 50, active: true },
  { code: 'FINANCE', name: 'Financeiro', description: 'Contas a pagar, receber e fluxo de caixa', sortOrder: 60, active: true },
  { code: 'HR', name: 'RH', description: 'Colaboradores, turnos e produtividade', sortOrder: 70, active: true },
  { code: 'TRANSPORT', name: 'Transporte', description: 'Coletas, entregas e romaneios', sortOrder: 80, active: true },
  { code: 'DASHBOARDS', name: 'Painéis', description: 'Indicadores gerenciais e relatórios', sortOrder: 90, active: true },
  { code: 'FISCAL', name: 'Fiscal', description: 'Emissão de NF-e, NFS-e e impostos', sortOrder: 100, active: false },
];
