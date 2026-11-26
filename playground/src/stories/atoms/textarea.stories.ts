import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Textarea',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    rows: { control: 'number' },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    value: '',
    placeholder: 'Descreva as instruções de lavagem ou observações fiscais...',
    rows: 4,
    invalid: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="max-width:480px;">
      <genova-textarea
        value=${args.value}
        placeholder=${args.placeholder}
        rows=${args.rows}
        ?invalid=${args.invalid}
        ?disabled=${args.disabled}
      ></genova-textarea>
    </div>
  `,
};

export const States: Story = {
  render: () => html`
    <div style="max-width:480px;display:grid;gap:0.75rem;">
      <genova-textarea placeholder="Campo padrão"></genova-textarea>
      <genova-textarea value="Texto com erro de validação" invalid></genova-textarea>
      <genova-textarea value="Somente leitura / desabilitado" disabled></genova-textarea>
    </div>
  `,
};
