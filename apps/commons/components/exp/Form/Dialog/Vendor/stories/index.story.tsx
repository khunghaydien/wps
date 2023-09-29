import React from 'react';

import { createGlobalStyle } from 'styled-components';

// eslint-disable-next-line storybook/story-exports
const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
  }
`;

export default {
  title: 'expenses-pc/Form/Dialog/Vendor',

  decorators: [
    (story) => (
      <>
        <div className="ts-expenses">
          <GlobalStyle />
          {story()}
        </div>
      </>
    ),
  ],
};
