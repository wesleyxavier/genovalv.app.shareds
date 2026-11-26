import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Image',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    fallbackText: { control: 'text' },
  },
  args: {
    src: '',
    alt: 'Pré-visualização do ativo',
    fallbackText: 'Imagem indisponível',
  },
};

export default meta;
type Story = StoryObj;

export const FallbackPlaceholder: Story = {
  render: (args) => html`
    <genova-image
      src=${args.src}
      alt=${args.alt}
      fallbackText=${args.fallbackText}
      style="width:260px;height:140px;"
    ></genova-image>
  `,
};
