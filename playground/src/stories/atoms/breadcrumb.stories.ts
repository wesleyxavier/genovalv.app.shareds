import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Breadcrumb',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    items: [
      { label: 'Início', href: '#' },
      { label: 'Produção', href: '#' },
      { label: 'Lotes Ativos' },
    ],
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`<genova-breadcrumb .items=${args.items}></genova-breadcrumb>`,
};

export const DeepNavigation: Story = {
  args: {
    items: [
      { label: 'Genova Admin', href: '#' },
      { label: 'Empresas', href: '#' },
      { label: 'Hotel Imperial', href: '#' },
      { label: 'Certificado A1' },
    ],
  },
  render: Default.render,
};
