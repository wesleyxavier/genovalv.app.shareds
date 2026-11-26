import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Drawer',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    open: { control: 'boolean' },
    title: { control: 'text' },
    placement: { control: 'select', options: ['left', 'right'] },
    content: { control: 'text' },
  },
  args: {
    open: false,
    title: 'Filtros Avançados',
    placement: 'right',
    content: 'Filtre por unidade operacional, período e status do lote.',
  },
};

export default meta;
type Story = StoryObj;

export const Interactive: Story = {
  render: (args) => html`
    <div>
      <genova-button
        variant="outline"
        @genova-press=${(e: Event) => {
          const el = (e.currentTarget as HTMLElement).parentElement?.querySelector('genova-drawer') as (HTMLElement & { open: boolean }) | null;
          if (el) el.open = true;
        }}
      >
        Abrir Drawer (${args.placement})
      </genova-button>
      <genova-drawer ?open=${args.open} title=${args.title} placement=${args.placement}>
        ${args.content}
      </genova-drawer>
    </div>
  `,
};

export const LeftPlacement: Story = {
  args: { placement: 'left', title: 'Menu Lateral' },
  render: Interactive.render,
};
