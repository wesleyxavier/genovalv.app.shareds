import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Stats',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    helpText: { control: 'text' },
  },
  args: {
    label: 'Kg Processados Hoje',
    value: '4.280 kg',
    helpText: '+12% vs ontem',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="max-width:260px;">
      <genova-stats label=${args.label} value=${args.value} helpText=${args.helpText}></genova-stats>
    </div>
  `,
};

export const MetricsGrid: Story = {
  render: () => html`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;max-width:720px;">
      <genova-stats label="Kg Processados Hoje" value="4.280 kg" helpText="+12% vs ontem"></genova-stats>
      <genova-stats label="Lotes Ativos" value="18" helpText="3 em secagem"></genova-stats>
      <genova-stats label="NF-e Emitidas" value="142" helpText="100% autorizadas"></genova-stats>
    </div>
  `,
};
