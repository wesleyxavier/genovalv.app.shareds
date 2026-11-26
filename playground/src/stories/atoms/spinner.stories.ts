import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Spinner',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    size: { control: { type: 'range', min: 16, max: 64, step: 4 } },
  },
  args: {
    size: 28,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`<genova-spinner size=${args.size}></genova-spinner>`,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;align-items:center;gap:1.25rem;">
      <genova-spinner size="18"></genova-spinner>
      <genova-spinner size="28"></genova-spinner>
      <genova-spinner size="40"></genova-spinner>
      <genova-spinner size="56"></genova-spinner>
    </div>
  `,
};
