import '@genovalv/tokens/tokens.css';
import { registerGenovaElements } from '@genovalv/elements';
import type { Preview } from '@storybook/web-components';

registerGenovaElements();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'fullscreen',
  },
};

export default preview;
