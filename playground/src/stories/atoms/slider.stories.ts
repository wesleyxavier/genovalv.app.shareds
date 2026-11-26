import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Slider',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
  },
  args: {
    value: 65,
    min: 0,
    max: 100,
    step: 5,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="max-width:420px;">
      <genova-slider value=${args.value} min=${args.min} max=${args.max} step=${args.step}></genova-slider>
    </div>
  `,
};
