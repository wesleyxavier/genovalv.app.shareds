import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Avatar',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    name: { control: 'text' },
    src: { control: 'text' },
    size: { control: { type: 'range', min: 24, max: 96, step: 4 } },
  },
  args: {
    name: 'Wesley Xavier',
    src: '',
    size: 40,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <genova-avatar name=${args.name} src=${args.src} size=${args.size}></genova-avatar>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;align-items:center;gap:1rem;">
      <genova-avatar name="Ana Clara" size="28"></genova-avatar>
      <genova-avatar name="Wesley Xavier" size="40"></genova-avatar>
      <genova-avatar name="Genova Admin" size="56"></genova-avatar>
      <genova-avatar name="Operação Sul" size="72"></genova-avatar>
    </div>
  `,
};
