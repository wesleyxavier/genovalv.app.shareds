import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/ControlBox',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    shape: { control: 'select', options: ['square', 'circle'] },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    shape: 'square',
    checked: true,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <genova-control-box shape=${args.shape} ?checked=${args.checked} ?disabled=${args.disabled}>
      ${args.checked ? html`<genova-icon name="check" size="14"></genova-icon>` : ''}
    </genova-control-box>
  `,
};

export const States: Story = {
  render: () => html`
    <div style="display:flex;gap:1rem;align-items:center;">
      <genova-control-box shape="square"></genova-control-box>
      <genova-control-box shape="square" checked><genova-icon name="check" size="14"></genova-icon></genova-control-box>
      <genova-control-box shape="circle"></genova-control-box>
      <genova-control-box shape="circle" checked><genova-icon name="check" size="14"></genova-icon></genova-control-box>
      <genova-control-box shape="square" checked disabled><genova-icon name="check" size="14"></genova-icon></genova-control-box>
    </div>
  `,
};
