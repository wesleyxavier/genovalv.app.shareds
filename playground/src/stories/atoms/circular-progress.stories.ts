import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Circular Progress',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: { type: 'range', min: 32, max: 96, step: 4 } },
  },
  args: {
    value: 72,
    size: 56,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`<genova-circular-progress value=${args.value} size=${args.size}></genova-circular-progress>`,
};

export const ProgressSteps: Story = {
  render: () => html`
    <div style="display:flex;gap:1.25rem;align-items:center;">
      <genova-circular-progress value="25" size="48"></genova-circular-progress>
      <genova-circular-progress value="50" size="56"></genova-circular-progress>
      <genova-circular-progress value="75" size="64"></genova-circular-progress>
      <genova-circular-progress value="100" size="72"></genova-circular-progress>
    </div>
  `,
};
