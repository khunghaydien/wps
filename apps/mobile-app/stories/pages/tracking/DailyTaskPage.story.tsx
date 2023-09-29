import React from 'react';

import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import { withInfo } from '@storybook/addon-info';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import STATUS from '../../../../domain/models/approval/request/Status';

import DailyTaskHeader from '../../../components/organisms/tracking/DailyTaskHeader';
import DailyTaskPage from '../../../components/pages/tracking/DailyTaskPage';

interface FCStory extends React.FC {
  storyName?: string;
  parameters?: unknown;
}

export default {
  title: 'Components/pages/tracking',
  decorators: [withKnobs, withInfo],
};

export const DailyTrackPage: FCStory = () => (
  <DailyTaskPage
    requestStatus={STATUS.NotRequested}
    listEditing={false}
    today={text('today', '2018-10-01')}
    totalRatio={100}
    taskList={[
      {
        id: 'a',
        jobId: 'aa',
        jobCode: 'XXXXX',
        jobName: 'FOOBAR',
        workCategoryName: 'V5 勤怠',
        workCategoryCode: 'ASSS',
        workCategoryId: 'aaa',
        isDirectInput: true,
        hasJobType: true,
        graphRatio: 100,
        taskTime: 100,
        taskNote: 'FFBAR',
        ratio: 100,
        order: 1,
        isDirectCharged: false,
        isRecorded: false,
        color: {},
        eventTaskTime: 0,
      },
      {
        id: 'b',
        jobId: 'aa',
        jobCode: 'XXXXX',
        jobName: 'FOOBAR',
        workCategoryName: 'V5 勤怠',
        workCategoryCode: 'ASSS',
        workCategoryId: 'aaa',
        isDirectInput: true,
        hasJobType: true,
        graphRatio: 100,
        taskTime: 15,
        taskNote: 'FFBAR',
        ratio: 100,
        order: 1,
        isDirectCharged: false,
        isRecorded: false,
        color: {},
        eventTaskTime: 0,
      },
      {
        id: 'c',
        jobId: 'aa',
        jobCode: 'XXXXX',
        jobName: 'FOOBAR',
        workCategoryName: 'V5 勤怠',
        workCategoryCode: 'ASSS',
        workCategoryId: 'aaa',
        isDirectInput: false,
        hasJobType: true,
        graphRatio: 100,
        taskTime: 35,
        taskNote: 'FFBAR',
        ratio: 100,
        order: 1,
        isDirectCharged: false,
        isRecorded: false,
        color: {},
        eventTaskTime: 0,
      },
      {
        id: 'd',
        jobId: 'aa',
        jobCode: 'XXXXX',
        jobName: 'FOOBAR',
        workCategoryName: 'V5 勤怠',
        workCategoryCode: 'ASSS',
        workCategoryId: 'aaa',
        isDirectInput: true,
        hasJobType: true,
        graphRatio: 100,
        taskTime: 35,
        taskNote: 'FFBAR',
        ratio: 100,
        order: 1,
        isDirectCharged: false,
        isRecorded: false,
        color: {},
        eventTaskTime: 0,
      },
      {
        id: 'e',
        jobId: 'aa',
        jobCode: 'XXXXX',
        jobName: 'FOOBAR',
        workCategoryName: 'V5 勤怠',
        workCategoryCode: 'ASSS',
        workCategoryId: 'aaa',
        isDirectInput: true,
        hasJobType: true,
        graphRatio: 100,
        taskTime: 35,
        taskNote: 'FFBAR',
        ratio: 100,
        order: 1,
        isDirectCharged: false,
        isRecorded: false,
        color: {},
        eventTaskTime: 0,
      },
    ]}
    save={action('save')}
    onChangeDate={action('onChangeDate')}
    onClickAddJob={action('onClickAddJob')}
    onClickPrevDate={action('onClickPrevDate')}
    onClickNextDate={action('onClickNextDate')}
    onToggleEditing={action('onToggleEditing')}
    onClickRefresh={action('onClickRefresh')}
    editRatio={action('editRatio')}
    editTaskTime={action('editTaskTime')}
    deleteTask={action('deleteTask')}
    toggleDirectInput={action('toggleDirectInput')}
    hasMultipleRatios={boolean('hasMultipleRatios', true)}
    renderDailyTaskHeader={
      <DailyTaskHeader
        isTemporaryWorkTime={false}
        includesNonDirectInputTask
        timeOfAttendance={510}
        timeOfTimeTracking={510}
        totalRatio={100}
      />
    }
  />
);

DailyTrackPage.storyName = 'DailyTrackPage';
DailyTrackPage.parameters = {
  info: {
    inline: false,
    text: `
      # Description

      工数を入力するカード
    `,
  },
};
