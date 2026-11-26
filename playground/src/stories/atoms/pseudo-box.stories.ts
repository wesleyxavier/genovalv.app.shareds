import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/PseudoBox',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    disabled: false,
    label: 'Passe o mouse, clique ou foque com Tab (hover / active / focus)',
  },
};

export default meta;
type Story = StoryObj;

export const Interactive: Story = {
  render: (args) => html`
    <div style="max-width:460px;">
      <genova-pseudo-box ?disabled=${args.disabled}>${args.label}</genova-pseudo-box>
    </div>
  `,
};

export const Disabled: Story = {
  args: { disabled: true, label: 'Estado desabilitado' },
  render: Interactive.render,
};
