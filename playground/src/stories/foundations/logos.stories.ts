import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import logoCabecalho from '@genovalv/tokens/logo/genova-cabecalho.svg';
import logoCabecalhoEscuro from '@genovalv/tokens/logo/genova-cabecalho-escuro.svg';
import logoHorizontal from '@genovalv/tokens/logo/genova-cloud-horizontal.svg';
import logoHorizontalEscuro from '@genovalv/tokens/logo/genova-cloud-horizontal-escuro.svg';
import logoSimbolo from '@genovalv/tokens/logo/genova-simbolo.svg';
import logoSimboloReduzido from '@genovalv/tokens/logo/genova-simbolo-reduzido.svg';
import logoPrancha from '@genovalv/tokens/logo/genova-logo-prancha.svg';

const meta: Meta = {
  title: 'Foundations/Logos',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const BrandLogos: Story = {
  render: () => html`
    <div style="display:grid;gap:1.5rem;max-width:960px;">
      <genova-heading size="lg">Logos Genova nas cores do projeto (#715FAF / #FAF7F0)</genova-heading>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;">
        <div style="padding:1.25rem;background:#ffffff;border:1px solid #e7e2d8;border-radius:0.75rem;display:grid;gap:0.75rem;">
          <strong style="font-size:0.75rem;color:#475569;">genova-cabecalho.svg</strong>
          <img src=${logoCabecalho} alt="Genova Cabeçalho" style="max-height:48px;width:auto;" />
        </div>
        <div style="padding:1.25rem;background:#0f172a;border:1px solid #1e293b;border-radius:0.75rem;display:grid;gap:0.75rem;">
          <strong style="font-size:0.75rem;color:#cbd5e1;">genova-cabecalho-escuro.svg</strong>
          <img src=${logoCabecalhoEscuro} alt="Genova Cabeçalho Escuro" style="max-height:48px;width:auto;" />
        </div>
        <div style="padding:1.25rem;background:#ffffff;border:1px solid #e7e2d8;border-radius:0.75rem;display:grid;gap:0.75rem;">
          <strong style="font-size:0.75rem;color:#475569;">genova-cloud-horizontal.svg</strong>
          <img src=${logoHorizontal} alt="Genova Cloud Horizontal" style="max-height:56px;width:auto;" />
        </div>
        <div style="padding:1.25rem;background:#0f172a;border:1px solid #1e293b;border-radius:0.75rem;display:grid;gap:0.75rem;">
          <strong style="font-size:0.75rem;color:#cbd5e1;">genova-cloud-horizontal-escuro.svg</strong>
          <img src=${logoHorizontalEscuro} alt="Genova Cloud Horizontal Escuro" style="max-height:56px;width:auto;" />
        </div>
        <div style="padding:1.25rem;background:#ffffff;border:1px solid #e7e2d8;border-radius:0.75rem;display:flex;align-items:center;gap:1.5rem;">
          <div style="display:grid;gap:0.5rem;">
            <strong style="font-size:0.75rem;color:#475569;">genova-simbolo.svg</strong>
            <img src=${logoSimbolo} alt="Genova Símbolo" style="height:56px;width:auto;" />
          </div>
          <div style="display:grid;gap:0.5rem;">
            <strong style="font-size:0.75rem;color:#475569;">genova-simbolo-reduzido.svg</strong>
            <img src=${logoSimboloReduzido} alt="Genova Símbolo Reduzido" style="height:40px;width:auto;" />
          </div>
        </div>
      </div>
      <div style="padding:1.25rem;background:#ffffff;border:1px solid #e7e2d8;border-radius:0.75rem;display:grid;gap:0.75rem;">
        <strong style="font-size:0.75rem;color:#475569;">genova-logo-prancha.svg</strong>
        <img src=${logoPrancha} alt="Prancha Completa de Logos Genova" style="width:100%;height:auto;" />
      </div>
    </div>
  `,
};
