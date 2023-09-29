import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { text, withKnobs } from '@storybook/addon-knobs';

import MonthlyHeader from '../../../../../components/molecules/commons/Headers/MonthlyHeader';

interface FCStory extends React.FC {
  storyName?: string;
  parameters?: unknown;
}

export default {
  title: 'Components/molecules/commons/Headers',
  decorators: [withKnobs, withInfo],
};

export const _MonthlyHeader: FCStory = () => (
  <MonthlyHeader
    currentYearMonth={text('currentYearMonth', '2018-10')}
    yearMonthOptions={[
      {
        label: '2018-09',
        value: '2018-09',
      },
      {
        label: '2018-10',
        value: '2018-10',
      },
      {
        label: '2018-11',
        value: '2018-11',
      },
    ]}
    title={text('title', 'TITLE TITLE')}
    onChangeMonth={action('onChangeMonth')}
    onClickRefresh={action('onClickRefresh')}
    onClickPrevMonth={action('onClickPrevMonth')}
    onClickNextMonth={action('onClickNextMonth')}
  />
);

_MonthlyHeader.storyName = 'MonthlyHeader';
_MonthlyHeader.parameters = {
  info: {
    inline: false,
    text: `
      月のページングがついたヘッダー
    `,
  },
};
