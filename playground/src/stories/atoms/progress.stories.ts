import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Progress',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
  args: {
    value: 68,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="max-width:440px;">
      <genova-progress value=${args.value}></genova-progress>
    </div>
  `,
};

export const Steps: Story = {
  render: () => html`
    <div style="max-width:440px;display:grid;gap:0.75rem;">
      <genova-progress value="20"></genova-progress>
      <genova-progress value="55"></genova-progress>
      <genova-progress value="90"></genova-progress>
    </div>
  `,
};
