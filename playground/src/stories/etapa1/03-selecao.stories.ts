import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Etapa 1/03 - Seleção',
};

export default meta;
type Story = StoryObj;

export const SelectionCatalog: Story = {
  render: () => html`
    <div style="padding:2rem;background:#faf7f0;display:grid;gap:1.25rem;max-width:520px;">
      <genova-checkbox-group
        direction="row"
        .options=${[{ label: 'Lavagem', value: 'wash' }, { label: 'Secagem', value: 'dry' }, { label: 'Passadoria', value: 'iron' }]}
        .value=${['wash']}
      ></genova-checkbox-group>
      <div style="display:flex;gap:1rem;">
        <genova-radio name="turno" value="manha" label="Manhã" checked></genova-radio>
        <genova-radio name="turno" value="noite" label="Noite"></genova-radio>
      </div>
      <genova-radio-button-group
        .options=${[{ label: 'Diário', value: 'd' }, { label: 'Semanal', value: 'w' }, { label: 'Mensal', value: 'm' }]}
        value="w"
      ></genova-radio-button-group>
      <genova-select
        .options=${[{ label: 'Matriz - SP', value: 'sp' }, { label: 'Filial - RJ', value: 'rj' }]}
        value="sp"
      ></genova-select>
      <genova-switch label="Modo Sandbox Ativo" checked></genova-switch>
      <genova-slider value="65" min="0" max="100"></genova-slider>
    </div>
  `,
};
