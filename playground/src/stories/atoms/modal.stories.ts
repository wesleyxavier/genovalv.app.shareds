import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Modal',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    open: { control: 'boolean' },
    title: { control: 'text' },
    content: { control: 'text' },
  },
  args: {
    open: false,
    title: 'Detalhes do Pedido #1042',
    content: 'Lavagem hospitalar completa com 180 kg processados e entrega prevista às 17h.',
  },
};

export default meta;
type Story = StoryObj;

export const Interactive: Story = {
  render: (args) => html`
    <div>
      <genova-button
        @genova-press=${(e: Event) => {
          const el = (e.currentTarget as HTMLElement).parentElement?.querySelector('genova-modal') as (HTMLElement & { open: boolean }) | null;
          if (el) el.open = true;
        }}
      >
        Abrir Modal
      </genova-button>
      <genova-modal ?open=${args.open} title=${args.title}>
        ${args.content}
      </genova-modal>
    </div>
  `,
};
