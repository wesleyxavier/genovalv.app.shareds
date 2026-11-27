import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const ADMIN_NAV = [
  { id: 'home', label: 'Início', href: '#inicio', active: true },
  {
    id: 'registrations',
    label: 'Cadastros',
    items: [
      { id: 'companies', label: 'Empresas', disabled: true },
      { id: 'users', label: 'Usuários', href: '#users' },
      { id: 'permissions', label: 'Permissões', disabled: true },
      { id: 'general', label: 'Gerais', disabled: true },
    ],
  },
  { id: 'plans', label: 'Planos', disabled: true, hasDropdownIndicator: true },
  { id: 'monitoring', label: 'Monitoramento', disabled: true, hasDropdownIndicator: true },
];

const USER_MENU = [
  { id: 'account', label: 'Minha conta', icon: 'user' as const, disabled: true },
  { id: 'preferences', label: 'Preferências', icon: 'sliders' as const, disabled: true },
  {
    id: 'sandbox',
    label: 'Acessar sandbox',
    description: 'ERP com empresa fictícia',
    icon: 'box' as const,
    highlight: true,
    dividerBefore: true,
  },
  { id: 'logout', label: 'Sair', icon: 'logout' as const, danger: true, dividerBefore: true },
];

const meta: Meta = {
  title: 'Etapa 1/04 - App Header',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const AdminDefault: Story = {
  render: () => html`
    <div style="min-height:360px;background:#faf7f0;">
      <genova-app-header
        brand-href="#inicio"
        .navItems=${ADMIN_NAV}
        .searchConfig=${{ visible: true, placeholder: 'Buscar empresa', shortcut: 'Ctrl K', disabled: true }}
        environment-label="development"
        notification-count="3"
        notifications-visible
        notifications-disabled
        user-name="Administrador"
        user-email="admin@empresa.com.br"
        .userMenuItems=${USER_MENU}
      ></genova-app-header>
    </div>
  `,
};

export const ProductionEnvironment: Story = {
  render: () => html`
    <div style="min-height:240px;background:#faf7f0;">
      <genova-app-header
        brand-href="#inicio"
        .navItems=${ADMIN_NAV}
        .searchConfig=${{ visible: true, placeholder: 'Buscar empresa', shortcut: 'Ctrl K', disabled: true }}
        environment-label="production"
        notification-count="0"
        notifications-visible
        notifications-disabled
        user-name="Administrador"
        user-email="admin@empresa.com.br"
        .userMenuItems=${USER_MENU}
      ></genova-app-header>
    </div>
  `,
};
