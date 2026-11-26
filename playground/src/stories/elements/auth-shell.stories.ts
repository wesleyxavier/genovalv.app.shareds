import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Elements/Auth Shell & Card',
  argTypes: {
    locale: { control: 'select', options: ['pt-BR', 'en-US', 'es-ES'] },
    portalTitle: { control: 'text' },
    portalSubtitle: { control: 'text' },
  },
  args: {
    locale: 'pt-BR',
    portalTitle: 'Genova Cloud',
    portalSubtitle: 'Admin Console • Acesso Restrito',
  },
};

export default meta;
type Story = StoryObj;

export const DefaultShell: Story = {
  render: (args) => html`
    <genova-auth-shell locale=${args.locale}>
      <div slot="actions">
        <genova-locale-selector locale=${args.locale}></genova-locale-selector>
      </div>
      <genova-auth-card
        portal-title=${args.portalTitle}
        portal-subtitle=${args.portalSubtitle}
        locale=${args.locale}
      >
        <p style="margin:0;font-size:0.875rem;color:#475569;">
          Conteúdo interno do card de autenticação.
        </p>
      </genova-auth-card>
    </genova-auth-shell>
  `,
};

export const HeaderAndFooter: Story = {
  render: (args) => html`
    <div style="display:flex;flex-direction:column;gap:2rem;padding:1.5rem;">
      <genova-header locale=${args.locale}></genova-header>
      <genova-footer locale=${args.locale}></genova-footer>
    </div>
  `,
};
