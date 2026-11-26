import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const ICON_NAMES = ['check', 'close', 'plus', 'search', 'info', 'warning', 'chevron', 'user'] as const;

const meta: Meta = {
  title: 'Atoms/Icons',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    name: { control: 'select', options: [...ICON_NAMES] },
    size: { control: { type: 'range', min: 12, max: 48, step: 2 } },
    label: { control: 'text' },
  },
  args: {
    name: 'check',
    size: 24,
    label: 'Confirmar',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`<genova-icon name=${args.name} size=${args.size} label=${args.label}></genova-icon>`,
};

export const AllIcons: Story = {
  render: () => html`
    <div style="display:flex;gap:1.5rem;flex-wrap:wrap;align-items:center;">
      ${ICON_NAMES.map(
        (iconName) => html`
          <div style="display:flex;flex-direction:column;align-items:center;gap:0.35rem;font-size:0.75rem;color:#475569;">
            <genova-icon name=${iconName} size="22" label=${iconName}></genova-icon>
            <span>${iconName}</span>
          </div>
        `,
      )}
    </div>
  `,
};
