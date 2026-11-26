import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/AlertDialog',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    open: { control: 'boolean' },
    title: { control: 'text' },
    confirmLabel: { control: 'text' },
    cancelLabel: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    open: false,
    title: 'Confirmar exclusão do vínculo?',
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar',
    description: 'Esta ação removerá o vínculo selecionado permanentemente.',
  },
};

export default meta;
type Story = StoryObj;

export const Interactive: Story = {
  render: (args) => html`
    <div>
      <genova-button
        variant="danger"
        @genova-press=${(e: Event) => {
          const host = (e.currentTarget as HTMLElement).parentElement?.querySelector('genova-alert-dialog') as (HTMLElement & { open: boolean }) | null;
          if (host) host.open = true;
        }}
      >
        Abrir AlertDialog
      </genova-button>
      <genova-alert-dialog
        ?open=${args.open}
        title=${args.title}
        confirmLabel=${args.confirmLabel}
        cancelLabel=${args.cancelLabel}
      >
        ${args.description}
      </genova-alert-dialog>
    </div>
  `,
};
