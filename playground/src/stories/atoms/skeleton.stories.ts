import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Skeleton',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    width: { control: 'text' },
    height: { control: 'text' },
  },
  args: {
    width: '70%',
    height: '1.25rem',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="max-width:460px;">
      <genova-skeleton width=${args.width} height=${args.height}></genova-skeleton>
    </div>
  `,
};

export const CardPlaceholder: Story = {
  render: () => html`
    <div style="max-width:420px;display:grid;gap:0.75rem;padding:1.25rem;background:#fff;border-radius:0.75rem;border:1px solid #e7e2d8;">
      <genova-skeleton width="45%" height="1.25rem"></genova-skeleton>
      <genova-skeleton width="100%" height="0.875rem"></genova-skeleton>
      <genova-skeleton width="85%" height="0.875rem"></genova-skeleton>
    </div>
  `,
};
