import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Box',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'select', options: ['surface', 'muted', 'tint'] },
    padding: { control: 'text' },
    content: { control: 'text' },
  },
  args: {
    variant: 'surface',
    padding: '1rem',
    content: 'Contêiner base Genova Box',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="max-width:480px;">
      <genova-box variant=${args.variant} padding=${args.padding}>${args.content}</genova-box>
    </div>
  `,
};

export const Variants: Story = {
  render: () => html`
    <div style="max-width:480px;display:grid;gap:0.75rem;">
      <genova-box variant="surface">Surface (#FFFFFF)</genova-box>
      <genova-box variant="muted">Muted (#EEEBE4)</genova-box>
      <genova-box variant="tint">Tint (#F1EEFC)</genova-box>
    </div>
  `,
};
