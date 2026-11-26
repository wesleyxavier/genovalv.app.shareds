import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Collapse',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    open: { control: 'boolean' },
    content: { control: 'text' },
  },
  args: {
    open: true,
    content: 'Detalhes adicionais do processo operacional exibidos quando expandido.',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="max-width:480px;display:grid;gap:0.75rem;">
      <genova-button
        variant="outline"
        size="sm"
        @genova-press=${(e: Event) => {
          const el = (e.currentTarget as HTMLElement).parentElement?.querySelector('genova-collapse') as (HTMLElement & { open: boolean }) | null;
          if (el) el.open = !el.open;
        }}
      >
        Alternar Collapse
      </genova-button>
      <genova-collapse ?open=${args.open}>${args.content}</genova-collapse>
    </div>
  `,
};
