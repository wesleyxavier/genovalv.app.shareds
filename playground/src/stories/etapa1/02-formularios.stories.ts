import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Etapa 1/02 - Formulários',
};

export default meta;
type Story = StoryObj;

export const FormsCatalog: Story = {
  render: () => html`
    <div style="padding:2rem;background:#faf7f0;display:grid;gap:1.25rem;max-width:520px;">
      <genova-input
        name="email"
        type="email"
        icon="email"
        label="E-mail Corporativo"
        placeholder="nome@empresa.com"
        required
      ></genova-input>
      <genova-form-control label="Subdomínio" hint="Usado para acesso exclusivo da lavanderia" required>
        <genova-input-group>
          <span slot="prefix">https://</span>
          <input type="text" placeholder="minha-lavanderia" />
          <span slot="suffix">.genovacloud.com</span>
        </genova-input-group>
      </genova-form-control>
      <genova-form-control label="Quantidade (kg)">
        <genova-number-input value="25" min="0" max="500" step="5"></genova-number-input>
      </genova-form-control>
      <genova-form-control label="Observações">
        <genova-textarea placeholder="Instruções de lavagem..."></genova-textarea>
      </genova-form-control>
      <genova-form-control label="Título editável">
        <genova-editable value="Lote Industrial #1042"></genova-editable>
      </genova-form-control>
    </div>
  `,
};
