import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Editable',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    value: { control: 'text' },
  },
  args: {
    value: 'Lote Industrial #1042',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="max-width:420px;">
      <genova-editable value=${args.value}></genova-editable>
    </div>
  `,
};
