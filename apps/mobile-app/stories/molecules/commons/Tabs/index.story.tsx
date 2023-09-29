import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import { Tab, Tabs } from '../../../../components/molecules/commons/Tabs';

export default {
  title: 'Components/molecules/commons/Tabs',
  decorators: [withKnobs],
};

export const Basic = withInfo(`
    # Description

    Tabs component

    ~~~js
    <Tabs>
      <Tab ... label="FOOBAR" />
      <Tab ... label="HOGE" />
      <Tab ... label="FUGA" />
    </Tabs>
    ~~~
  `)(() => (
  <Tabs
    position={text('position', undefined)}
    className={text('className', undefined)}
  >
    <Tab
      onClick={action('[FOOBAR] onClick')}
      label={text('[FOOBAR] label', 'FOOBAR')}
      active={boolean('[FOOBAR] active', false)}
    />
    <Tab
      onClick={action('[FUGA] onClick')}
      label={text('[FUGA] label', 'FUGA')}
      active={boolean('[FUGA] active', true)}
    />
    <Tab
      onClick={action('[HOGE] onClick')}
      label={text('[HOGE] label', 'HOGE')}
      active={boolean('[HOGE] active', false)}
    />
  </Tabs>
));
