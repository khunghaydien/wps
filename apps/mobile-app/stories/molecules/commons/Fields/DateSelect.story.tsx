import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { text, withKnobs } from '@storybook/addon-knobs';

import DateSelect from '../../../../components/molecules/commons/Fields/DateSelect';

export default {
  title: 'Components/molecules/commons/Fields/DateSelect',
  decorators: [withKnobs],
};

export const Basic = withInfo(`
    # Description

    date select コンポーネント

    # Propsについて

    HTML5 非標準のinputコンポーネント。Navigationなどに使う日付選択できるコンポーネントです。
  `)(() => (
  <DateSelect
    testId="unique-id"
    value={text('value', '2018-10-01')}
    onChange={action('onChange')}
  />
));
