import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const defaultItems = [
  'Entrada de Roupa Suja',
  'Pesagem & Triagem',
  'Lavagem Pesada',
  'Centrifugação & Secagem',
];

const meta: Meta = {
  title: 'Atoms/List',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    ordered: { control: 'boolean' },
    plain: { control: 'boolean' },
  },
  args: {
    ordered: false,
    plain: false,
    items: defaultItems,
  },
};

export default meta;
type Story = StoryObj;

export const Unordered: Story = {
  render: (args) => html`<genova-list .items=${args.items} ?ordered=${args.ordered} ?plain=${args.plain}></genova-list>`,
};

export const Ordered: Story = {
  args: { ordered: true },
  render: Unordered.render,
};

export const Plain: Story = {
  args: { plain: true },
  render: Unordered.render,
};
