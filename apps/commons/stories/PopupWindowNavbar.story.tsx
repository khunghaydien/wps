import React from 'react';

import Button from '../components/buttons/Button';
import PopupWindowNavbar from '../components/PopupWindowNavbar';

export default {
  title: 'commons',
};

export const _PopupWindowNavbar = () => (
  // @ts-ignore
  <PopupWindowNavbar title="Popup Window Title" />
);

_PopupWindowNavbar.storyName = 'PopupWindowNavbar';

_PopupWindowNavbar.parameters = {
  info: {
    text: `
Navigation bar component for popup windows. See also PopupWindowPage.
`,
    propTables: [PopupWindowNavbar],
    inline: true,
    source: true,
  },
};

export const PopupWindowNavbarWithButtons = () => (
  <PopupWindowNavbar title="Popup Window Title">
    <Button>Page Action</Button>
  </PopupWindowNavbar>
);

PopupWindowNavbarWithButtons.storyName = 'PopupWindowNavbar - with buttons';

PopupWindowNavbarWithButtons.parameters = {
  info: {
    text: `
You can place your components on right side of the title.
`,
    propTables: [PopupWindowNavbar],
    inline: true,
    source: true,
  },
};
