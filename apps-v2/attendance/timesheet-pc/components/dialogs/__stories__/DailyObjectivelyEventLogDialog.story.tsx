import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import {
  defaultValue as dummyObjectivelyEventLog,
  setting as sources,
} from '@attendance/domain/models/__tests__/mocks/ObjectivelyEventLog.mock';

import Component from '../DailyObjectivelyEventLogDialog';

export default {
  title: 'attendance/timesheet-pc/dialogs/DailyObjectivelyEventLogDialog',
  decorators: [withKnobs],
};

export const Default = (): React.ReactElement => {
  return (
    <Component
      targetDate={text('targetDate', '2022-02-22')}
      loading={boolean('loading', false)}
      readOnly={boolean('readOnly', false)}
      onSubmit={action('Submit')}
      onCancel={action('Cancel')}
      sources={sources}
      records={dummyObjectivelyEventLog}
      expanded={boolean('expanded', false)}
      onClickToggleDisplay={action('onClickToggleDisplay')}
      onCheckRecord={action('onCheckRecord')}
      onClickAdd={action('onClickAdd')}
      onClickRemove={action('onClickRemove')}
      allowedEditLogs={boolean('allowedEditLogs', true)}
      allowedSetToApplied={boolean('allowedSetToApplied', true)}
    />
  );
};

export const loading = (): React.ReactElement => {
  return (
    <Component
      targetDate={'2022-02-22'}
      loading={true}
      readOnly={false}
      onSubmit={action('Submit')}
      onCancel={action('Cancel')}
      sources={sources}
      records={dummyObjectivelyEventLog}
      expanded={boolean('expanded', false)}
      onClickToggleDisplay={action('onClickToggleDisplay')}
      onCheckRecord={action('onCheckRecord')}
      onClickAdd={action('onClickAdd')}
      onClickRemove={action('onClickRemove')}
      allowedEditLogs={true}
      allowedSetToApplied={true}
    />
  );
};

export const readOnly = (): React.ReactElement => {
  return (
    <Component
      targetDate={'2022-02-22'}
      loading={false}
      readOnly={true}
      onSubmit={action('Submit')}
      onCancel={action('Cancel')}
      sources={sources}
      records={dummyObjectivelyEventLog}
      expanded={false}
      onClickToggleDisplay={action('onClickToggleDisplay')}
      onCheckRecord={action('onCheckRecord')}
      onClickAdd={action('onClickAdd')}
      onClickRemove={action('onClickRemove')}
      allowedEditLogs={true}
      allowedSetToApplied={true}
    />
  );
};

export const canNotSetToApplied = (): React.ReactElement => {
  return (
    <Component
      targetDate={'2022-02-22'}
      loading={false}
      readOnly={false}
      onSubmit={action('Submit')}
      onCancel={action('Cancel')}
      sources={sources}
      records={dummyObjectivelyEventLog}
      expanded={false}
      onClickToggleDisplay={action('onClickToggleDisplay')}
      onCheckRecord={action('onCheckRecord')}
      onClickAdd={action('onClickAdd')}
      onClickRemove={action('onClickRemove')}
      allowedEditLogs={true}
      allowedSetToApplied={false}
    />
  );
};

export const Empty = (): React.ReactElement => {
  return (
    <Component
      targetDate={'2022-02-22'}
      loading={false}
      readOnly={false}
      onSubmit={action('Submit')}
      onCancel={action('Cancel')}
      sources={sources}
      records={[]}
      expanded={false}
      onClickToggleDisplay={action('onClickToggleDisplay')}
      onCheckRecord={action('onCheckRecord')}
      onClickAdd={action('onClickAdd')}
      onClickRemove={action('onClickRemove')}
      allowedEditLogs={true}
      allowedSetToApplied={true}
    />
  );
};

export const OneRecord = (): React.ReactElement => {
  return (
    <Component
      targetDate={'2022-02-22'}
      loading={false}
      readOnly={false}
      onSubmit={action('Submit')}
      onCancel={action('Cancel')}
      sources={sources}
      records={[dummyObjectivelyEventLog[0]]}
      expanded={false}
      onClickToggleDisplay={action('onClickToggleDisplay')}
      onCheckRecord={action('onCheckRecord')}
      onClickAdd={action('onClickAdd')}
      onClickRemove={action('onClickRemove')}
      allowedEditLogs={true}
      allowedSetToApplied={true}
    />
  );
};

export const UnderMinHeight = (): React.ReactElement => {
  return (
    <Component
      targetDate={'2022-02-22'}
      loading={false}
      readOnly={false}
      onSubmit={action('Submit')}
      onCancel={action('Cancel')}
      sources={sources}
      records={[dummyObjectivelyEventLog[0], dummyObjectivelyEventLog[1]]}
      expanded={false}
      onClickToggleDisplay={action('onClickToggleDisplay')}
      onCheckRecord={action('onCheckRecord')}
      onClickAdd={action('onClickAdd')}
      onClickRemove={action('onClickRemove')}
      allowedEditLogs={true}
      allowedSetToApplied={true}
    />
  );
};

export const WithScroll = (): React.ReactElement => {
  return (
    <Component
      targetDate={'2022-02-22'}
      loading={false}
      readOnly={false}
      onSubmit={action('Submit')}
      onCancel={action('Cancel')}
      sources={sources}
      records={[...dummyObjectivelyEventLog, ...dummyObjectivelyEventLog]}
      expanded={false}
      onClickToggleDisplay={action('onClickToggleDisplay')}
      onCheckRecord={action('onCheckRecord')}
      onClickAdd={action('onClickAdd')}
      onClickRemove={action('onClickRemove')}
      allowedEditLogs={true}
      allowedSetToApplied={true}
    />
  );
};

export const DefaultForEmployee = (): React.ReactElement => {
  return (
    <Component
      targetDate={text('targetDate', '2022-02-22')}
      loading={boolean('loading', false)}
      readOnly={boolean('readOnly', false)}
      onSubmit={action('Submit')}
      onCancel={action('Cancel')}
      sources={sources}
      records={dummyObjectivelyEventLog}
      expanded={false}
      onClickToggleDisplay={action('onClickToggleDisplay')}
      onCheckRecord={action('onCheckRecord')}
      onClickAdd={action('onClickAdd')}
      onClickRemove={action('onClickRemove')}
      allowedEditLogs={false}
      allowedSetToApplied={boolean('allowedSetToApplied', true)}
    />
  );
};

export const loadingForEmployee = (): React.ReactElement => {
  return (
    <Component
      targetDate={'2022-02-22'}
      loading={true}
      readOnly={false}
      onSubmit={action('Submit')}
      onCancel={action('Cancel')}
      sources={sources}
      records={dummyObjectivelyEventLog}
      expanded={false}
      onClickToggleDisplay={action('onClickToggleDisplay')}
      onCheckRecord={action('onCheckRecord')}
      onClickAdd={action('onClickAdd')}
      onClickRemove={action('onClickRemove')}
      allowedEditLogs={false}
      allowedSetToApplied={true}
    />
  );
};

export const readOnlyForEmployee = (): React.ReactElement => {
  return (
    <Component
      targetDate={'2022-02-22'}
      loading={false}
      readOnly={true}
      onSubmit={action('Submit')}
      onCancel={action('Cancel')}
      sources={sources}
      records={dummyObjectivelyEventLog}
      expanded={false}
      onClickToggleDisplay={action('onClickToggleDisplay')}
      onCheckRecord={action('onCheckRecord')}
      onClickAdd={action('onClickAdd')}
      onClickRemove={action('onClickRemove')}
      allowedEditLogs={false}
      allowedSetToApplied={true}
    />
  );
};

export const canNotSetToAppliedForEmployee = (): React.ReactElement => {
  return (
    <Component
      targetDate={'2022-02-22'}
      loading={false}
      readOnly={false}
      onSubmit={action('Submit')}
      onCancel={action('Cancel')}
      sources={sources}
      records={dummyObjectivelyEventLog}
      expanded={false}
      onClickToggleDisplay={action('onClickToggleDisplay')}
      onCheckRecord={action('onCheckRecord')}
      onClickAdd={action('onClickAdd')}
      onClickRemove={action('onClickRemove')}
      allowedEditLogs={false}
      allowedSetToApplied={false}
    />
  );
};

export const EmptyForEmployee = (): React.ReactElement => {
  return (
    <Component
      targetDate={'2022-02-22'}
      loading={false}
      readOnly={false}
      onSubmit={action('Submit')}
      onCancel={action('Cancel')}
      sources={sources}
      records={[]}
      expanded={false}
      onClickToggleDisplay={action('onClickToggleDisplay')}
      onCheckRecord={action('onCheckRecord')}
      onClickAdd={action('onClickAdd')}
      onClickRemove={action('onClickRemove')}
      allowedEditLogs={false}
      allowedSetToApplied={true}
    />
  );
};

export const OneRecordForEmployee = (): React.ReactElement => {
  return (
    <Component
      targetDate={'2022-02-22'}
      loading={false}
      readOnly={false}
      onSubmit={action('Submit')}
      onCancel={action('Cancel')}
      sources={sources}
      records={[dummyObjectivelyEventLog[0]]}
      expanded={false}
      onClickToggleDisplay={action('onClickToggleDisplay')}
      onCheckRecord={action('onCheckRecord')}
      onClickAdd={action('onClickAdd')}
      onClickRemove={action('onClickRemove')}
      allowedEditLogs={false}
      allowedSetToApplied={true}
    />
  );
};

export const UnderMinHeightForEmployee = (): React.ReactElement => {
  return (
    <Component
      targetDate={'2022-02-22'}
      loading={false}
      readOnly={false}
      onSubmit={action('Submit')}
      onCancel={action('Cancel')}
      sources={sources}
      records={[dummyObjectivelyEventLog[0], dummyObjectivelyEventLog[1]]}
      expanded={false}
      onClickToggleDisplay={action('onClickToggleDisplay')}
      onCheckRecord={action('onCheckRecord')}
      onClickAdd={action('onClickAdd')}
      onClickRemove={action('onClickRemove')}
      allowedEditLogs={false}
      allowedSetToApplied={true}
    />
  );
};

export const WithScrollForEmployee = (): React.ReactElement => {
  return (
    <Component
      targetDate={'2022-02-22'}
      loading={false}
      readOnly={false}
      onSubmit={action('Submit')}
      onCancel={action('Cancel')}
      sources={sources}
      records={[
        ...dummyObjectivelyEventLog,
        ...dummyObjectivelyEventLog,
        ...dummyObjectivelyEventLog,
      ]}
      expanded={false}
      onClickToggleDisplay={action('onClickToggleDisplay')}
      onCheckRecord={action('onCheckRecord')}
      onClickAdd={action('onClickAdd')}
      onClickRemove={action('onClickRemove')}
      allowedEditLogs={false}
      allowedSetToApplied={true}
    />
  );
};
