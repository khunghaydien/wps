import React from 'react';

import { action } from '@storybook/addon-actions';

import Tab from '../components/Tab';

import ImgIconDummy from '../images/iconHeaderExp.png';

export default {
  title: 'commons',
};

export const _Tab = () => (
  <div role="tablist">
    <Tab
      icon={ImgIconDummy}
      label="Label 1"
      selected
      onSelect={action('onSelect')}
    />
    <Tab
      icon={ImgIconDummy}
      label="Label 2"
      selected={false}
      onSelect={action('onSelect')}
    />
  </div>
);

_Tab.parameters = {
  info: {
    text: `
選択状態を指定するにはselected(bool)を渡す

`,
    propTables: [Tab],
    inline: true,
    source: true,
  },
};

export const Tab通知あり = () => (
  <div role="tablist">
    <Tab
      icon={ImgIconDummy}
      label="Label 1"
      selected
      onSelect={action('onSelect')}
      notificationCount={3}
    />
    <Tab
      icon={ImgIconDummy}
      label="Label 2"
      selected={false}
      onSelect={action('onSelect')}
      notificationCount={100}
    />
  </div>
);

Tab通知あり.storyName = 'Tab - 通知あり';

Tab通知あり.parameters = {
  info: {
    text: `
notificationCountが1以上のときに、通知バッチを表示する  
100件以上の場合は「99+」に省略される
`,
    propTables: [Tab],
    inline: true,
    source: true,
  },
};
