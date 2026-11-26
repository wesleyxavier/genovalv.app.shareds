import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Radio',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    name: { control: 'text' },
    value: { control: 'text' },
    label: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    name: 'turno',
    value: 'manha',
    label: 'Turno Manhã (06h - 14h)',
    checked: true,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <genova-radio
      name=${args.name}
      value=${args.value}
      label=${args.label}
      ?checked=${args.checked}
      ?disabled=${args.disabled}
    ></genova-radio>
  `,
};

export const GroupExample: Story = {
  render: () => html`
    <div style="display:flex;gap:1.25rem;flex-wrap:wrap;">
      <genova-radio name="turno-demo" value="manha" label="Manhã" checked></genova-radio>
      <genova-radio name="turno-demo" value="tarde" label="Tarde"></genova-radio>
      <genova-radio name="turno-demo" value="noite" label="Noite" disabled></genova-radio>
    </div>
  `,
};
