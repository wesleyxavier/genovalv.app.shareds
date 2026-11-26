import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Heading',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    level: { control: { type: 'number', min: 1, max: 6, step: 1 } },
    text: { control: 'text' },
  },
  args: {
    size: 'lg',
    level: 2,
    text: 'Gestão Operacional Genova',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`<genova-heading size=${args.size} level=${args.level}>${args.text}</genova-heading>`,
};

export const Scale: Story = {
  render: () => html`
    <div style="display:grid;gap:0.75rem;">
      <genova-heading size="xl" level="1">Heading XL — Plus Jakarta Sans</genova-heading>
      <genova-heading size="lg" level="2">Heading LG — Plus Jakarta Sans</genova-heading>
      <genova-heading size="md" level="3">Heading MD — Plus Jakarta Sans</genova-heading>
      <genova-heading size="sm" level="4">Heading SM — Plus Jakarta Sans</genova-heading>
      <genova-heading size="xs" level="5">Heading XS — Plus Jakarta Sans</genova-heading>
    </div>
  `,
};
