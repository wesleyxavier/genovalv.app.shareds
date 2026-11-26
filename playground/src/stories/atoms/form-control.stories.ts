import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/FormControl',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Subdomínio da Lavanderia',
    hint: 'Usado para acesso exclusivo ao portal ERP.',
    error: '',
    required: true,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="max-width:440px;">
      <genova-form-control
        label=${args.label}
        hint=${args.hint}
        error=${args.error}
        ?required=${args.required}
      >
        <genova-input-group>
          <span slot="prefix">https://</span>
          <input type="text" placeholder="hotel-imperial" />
          <span slot="suffix">.genovacloud.com</span>
        </genova-input-group>
      </genova-form-control>
    </div>
  `,
};

export const WithError: Story = {
  args: {
    error: 'Este subdomínio já está em uso.',
  },
  render: Default.render,
};
