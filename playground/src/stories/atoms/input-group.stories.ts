import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Input Group',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    prefix: { control: 'text' },
    suffix: { control: 'text' },
    placeholder: { control: 'text' },
  },
  args: {
    prefix: 'https://',
    suffix: '.genovacloud.com',
    placeholder: 'minha-lavanderia',
  },
};

export default meta;
type Story = StoryObj;

export const DomainInput: Story = {
  render: (args) => html`
    <div style="max-width:440px;">
      <genova-input-group>
        <span slot="prefix">${args.prefix}</span>
        <input type="text" placeholder=${args.placeholder} />
        <span slot="suffix">${args.suffix}</span>
      </genova-input-group>
    </div>
  `,
};

export const CurrencyInput: Story = {
  args: {
    prefix: 'R$',
    suffix: '/ kg',
    placeholder: '12,50',
  },
  render: DomainInput.render,
};
