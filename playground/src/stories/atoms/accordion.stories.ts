import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const defaultItems = [
  { id: 'fiscal', title: 'Configuração Fiscal NF-e', content: 'Certificado A1 válido até 2027 com emissão em contingência ativa.' },
  { id: 'iot', title: 'Integração IoT / EMQX', content: '12 equipamentos conectados recebendo telemetria em tempo real.' },
  { id: 'billing', title: 'Assinatura & Faturamento', content: 'Plano Enterprise ativo sem faturas pendentes.' },
];

const meta: Meta = {
  title: 'Atoms/Accordion',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    openId: { control: 'text', description: 'ID do item inicialmente aberto' },
  },
  args: {
    openId: 'fiscal',
    items: defaultItems,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="max-width:560px;">
      <genova-accordion openId=${args.openId} .items=${args.items}></genova-accordion>
    </div>
  `,
};

export const AllCollapsed: Story = {
  args: { openId: '' },
  render: Default.render,
};
