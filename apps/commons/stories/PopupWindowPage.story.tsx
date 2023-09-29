import React from 'react';

import PopupWindowNavbar from '../components/PopupWindowNavbar';
import PopupWindowPage from '../components/PopupWindowPage';

export default {
  title: 'commons',
};

export const _PopupWindowPage = () => (
  <div>
    {/*
    // @ts-ignore */}
    <PopupWindowNavbar title="Page Title" />
    <PopupWindowPage>Page Content</PopupWindowPage>
  </div>
);

_PopupWindowPage.storyName = 'PopupWindowPage';

_PopupWindowPage.parameters = {
  info: {
    text: `
Container component for contents in popup windows. See also PopupWindowNavbar.
  `,
    propTables: [PopupWindowPage],
    inline: true,
    source: true,
  },
};
