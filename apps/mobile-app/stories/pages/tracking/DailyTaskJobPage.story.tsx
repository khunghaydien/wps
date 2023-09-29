import React from 'react';

import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import { withInfo } from '@storybook/addon-info';
import { object, text, withKnobs } from '@storybook/addon-knobs';

import DailyTaskJobPage from '../../../components/pages/tracking/DailyTaskJobPage';

interface FCStory extends React.FC {
  storyName?: string;
  parameters?: unknown;
}

export default {
  title: 'Components/pages/tracking',
  decorators: [withKnobs, withInfo],
};

export const _DailyTaskJobPage: FCStory = () => (
  <DailyTaskJobPage
    selectedJob={{
      id: 'b',
      code: '00b',
      name: 'selectedJobId',
      parentId: 'hoge',
      workCategories: [],
      hasJobType: true,
      hasChildren: false,
      isDirectCharged: false,
      isEditLocked: false,
    }}
    workCategories={object('workCategories', [
      {
        label: 'Work Category A',
        value: 'a',
      },
      {
        label: 'Work Category B',
        value: 'b',
      },
      {
        label: 'Work Category C',
        value: 'c',
      },
    ])}
    selectedWorkCategoryId={text('selectedWorkCategoryId', 'c')}
    onSelectWorkCategory={action('onSelectWorkCategory')}
    onChangeTaskTime={action('onChangeTaskTime')}
    onClickDiscard={action('onClickDiscard')}
    onClickJob={action('onClickJob')}
    onClickSave={action('onClickSave')}
    taskTime="11:00"
  />
);

_DailyTaskJobPage.storyName = 'DailyTaskJobPage';
_DailyTaskJobPage.parameters = {
  info: {
    inline: false,
    styles: (stylesheet) => ({
      ...stylesheet,
      button: {
        ...stylesheet.button,
        topRight: {
          bottom: 0,
          right: 0,
          borderRadius: '5px 0 0 0',
        },
      },
    }),
    text: `
      # Description

      ジョブを追加登録するページ
    `,
  },
};
