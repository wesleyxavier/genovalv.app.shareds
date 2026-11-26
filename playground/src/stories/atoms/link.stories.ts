import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Link',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    href: { control: 'text' },
    external: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    href: 'https://genovacloud.com',
    external: true,
    label: 'Acessar Genova Cloud →',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`<genova-link href=${args.href} ?external=${args.external}>${args.label}</genova-link>`,
};

export const InternalLink: Story = {
  args: { href: '#dashboard', external: false, label: 'Voltar para o painel' },
  render: Default.render,
};
