import React from 'react';

import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import { withInfo } from '@storybook/addon-info';
import { object, withKnobs } from '@storybook/addon-knobs';

import GlobalFooter from '@mobile/components/organisms/commons/GlobalFooter';

export default {
  title: 'Components/organisms/commons/GlobalFooter',
  decorators: [withKnobs],
};

export const Basic = withInfo({
  inline: false,
  text: `
        expenseのglobal footerです。
`,
})(() => (
  <GlobalFooter
    tabs={object('tabs', [
      { label: 'tab1', handleOnClick: action('onClick tab1'), key: 'tab1' },
      { label: 'tab2', handleOnClick: action('onClick tab2'), key: 'tab2' },
    ])}
    activeTab={'tab1'}
  />
));
