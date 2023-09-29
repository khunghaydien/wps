import React from 'react';

import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import { withInfo } from '@storybook/addon-info';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';

import STATUS from '../../../../domain/models/approval/request/Status';

import DailyTaskInputCard from '../../../components/organisms/tracking/DailyTaskInputCard';

interface FCStory extends React.FC {
  storyName?: string;
  parameters?: unknown;
}

export default {
  title: 'Components/organisms/tracking',
  decorators: [withKnobs, withInfo],
};

export const InputTrackingCard: FCStory = () => (
  <DailyTaskInputCard
    hasWorkCategory
    listEditing={false}
    workCategoryName={text('job', 'V5勤怠')}
    job={text('jobType', '開発')}
    code={text('code', 'WSP-00000002')}
    timeOrRatioValue={'ratio'}
    onClickDeleteButton={action('onClickDeleteButton')}
    onClickInputModeButton={action('onClickInputModeButton')}
    onChangeTaskTime={action('onChangeTaskTime')}
    onChangeRatio={action('onChangeRatio')}
    ratio={number('ratio', 30)}
    taskTime={number('taskTime', 150)}
    multipleRatiosExist={boolean('multipleRatiosExist', true)}
    isInvalidInput={boolean('isInvalidInput', false)}
    requestStatus={STATUS.NotRequested}
  />
);

InputTrackingCard.storyName = 'InputTrackingCard';
InputTrackingCard.parameters = {
  info: {
    text: `
      # Description

      工数を入力するカード
    `,
  },
};

export const InputTrackingCardRequestApproved: FCStory = () => (
  <DailyTaskInputCard
    hasWorkCategory
    listEditing={false}
    workCategoryName={text('job', 'V5勤怠')}
    job={text('jobType', '開発')}
    code={text('code', 'WSP-00000002')}
    timeOrRatioValue={'ratio'}
    onClickDeleteButton={action('onClickDeleteButton')}
    onClickInputModeButton={action('onClickInputModeButton')}
    onChangeTaskTime={action('onChangeTaskTime')}
    onChangeRatio={action('onChangeRatio')}
    ratio={number('ratio', 30)}
    taskTime={number('taskTime', 150)}
    multipleRatiosExist={boolean('multipleRatiosExist', true)}
    isInvalidInput={boolean('isInvalidInput', false)}
    requestStatus={STATUS.Approved}
  />
);

InputTrackingCardRequestApproved.storyName =
  'InputTrackingCard - Request Approved';

export const InputTrackingCardListEditing: FCStory = () => (
  <DailyTaskInputCard
    hasWorkCategory
    listEditing
    workCategoryName={text('job', 'V5勤怠')}
    job={text('jobType', '開発')}
    code={text('code', 'WSP-00000002')}
    timeOrRatioValue={'ratio'}
    onClickDeleteButton={action('onClickDeleteButton')}
    onClickInputModeButton={action('onClickInputModeButton')}
    onChangeTaskTime={action('onChangeTaskTime')}
    onChangeRatio={action('onChangeRatio')}
    ratio={number('ratio', 30)}
    taskTime={number('taskTime', 150)}
    multipleRatiosExist={boolean('multipleRatiosExist', true)}
    isInvalidInput={boolean('isInvalidInput', false)}
    requestStatus={STATUS.NotRequested}
  />
);

InputTrackingCardListEditing.storyName = 'InputTrackingCard - List Editing';
InputTrackingCardListEditing.parameters = {
  info: {
    text: `
      # Description

      In Edit mode
    `,
  },
};
