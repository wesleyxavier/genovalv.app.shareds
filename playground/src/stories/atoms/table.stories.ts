import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const columns = ['Cliente', 'CNPJ', 'Unidade', 'Status'];
const rows = [
  ['Hotel Imperial', '12.345.678/0001-95', 'Matriz - SP', 'Ativo'],
  ['Hospital Central', '98.765.432/0001-10', 'Filial - RJ', 'Sandbox'],
  ['Resort Costa Verde', '45.123.987/0001-33', 'Campinas', 'Ativo'],
];

const meta: Meta = {
  title: 'Atoms/Table',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    columns,
    rows,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="max-width:760px;">
      <genova-table .columns=${args.columns} .rows=${args.rows}></genova-table>
    </div>
  `,
};
