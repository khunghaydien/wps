import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { text, withKnobs } from '@storybook/addon-knobs';

import DailyHeader from '../../../../../components/molecules/commons/Headers/DailyHeader';

interface FCStory extends React.FC {
  storyName?: string;
  parameters?: unknown;
}

export default {
  title: 'Components/molecules/commons/Headers',
  decorators: [withKnobs, withInfo],
};

export const _DailyHeader: FCStory = () => (
  <DailyHeader
    currentDate={text('currentDate', '2018-10-01')}
    title={text('title', 'TITLE TITLE')}
    backButtonLabel={text('backButtonLabel', 'Oct 2018')}
    onClickBackMonth={action('onClickBackMonth')}
    onChangeDate={action('onChangeDate')}
    onClickPrevDate={action('onClickPrevDate')}
    onClickNextDate={action('onClickNextDate')}
  />
);

_DailyHeader.storyName = 'DailyHeader';
_DailyHeader.parameters = {
  info: {
    inline: false,
    text: `
  日付ページングがついたヘッダー
`,
  },
};
