import React, { ReactElement } from 'react';

import moment from 'moment';

import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

import EventEditPopup from '../../components/EventEditPopup';
import JobSelect from '../../components/EventEditPopup/JobSelect';

import WorkCategoryDropdown from '../../../time-tracking/common/components/WorkCategoryDropdownDeprecated';

const Center = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
`;

const newEvent = {
  id: '',
  title: '',
  start: moment('2019-10-01T06:00:00.000Z'),
  end: moment('2019-10-07T07:00:00.000Z'),
  calculateCapacity: false,
  isAllDay: false,
  isOrganizer: true,
  isOuting: false,
  location: '',
  remarks: '',
  createdServiceBy: 'teamspirit',
  externalEventId: null,
  job: {
    id: '',
    name: '',
    code: '',
  },
  workCategoryId: '',
  workCategoryName: '',
  workCategoryCode: '',
  layout: {
    colSpan: 1,
    colIndex: 2,
    startMinutesOfDay: 900,
    endMinutesOfDay: 960,
    visibleInMonthlyView: true,
    containsAllDay: false,
  },
};

const allDayEvent = {
  ...newEvent,
  isAllDay: true,
};

const hasTitle = {
  ...newEvent,
  id: 'id',
  title: 'CW1',
  remarks: 'This is description',
};

export default {
  title: 'planner-pc/EventEditPopup',
  decorators: [(story: Function): ReactElement => <Center>{story()}</Center>],
};

export const NewEvent = (): ReactElement => (
  <EventEditPopup
    event={newEvent}
    useWorkTime
    useCalculateCapacity
    onClickClose={action('onClickClose')}
    onClickSave={action('onClickSave')}
    onClickDelete={action('onClickDelete')}
    onChange={action('onChange')}
    renderJobSelect={(): ReactElement => (
      <JobSelect
        options={[]}
        onClickSearch={action('onClickSearch')}
        onSelect={action('onSelect')}
      />
    )}
    renderWorkCategory={(): ReactElement => (
      <WorkCategoryDropdown
        onError={action('onError')}
        onSelect={action('onSelect')}
        jobId="0zdfdgd0000aaa"
        selected={{
          workCategoryCode: '',
          workCategoryId: '',
          workCategoryName: '',
        }}
        targetDate="2020-05-01"
      />
    )}
  />
);

NewEvent.storyName = 'new event';

export const AllDayEvent = (): ReactElement => (
  <EventEditPopup
    event={allDayEvent}
    useWorkTime
    useCalculateCapacity
    onClickClose={action('onClickClose')}
    onClickSave={action('onClickSave')}
    onClickDelete={action('onClickDelete')}
    onChange={action('onChange')}
    renderJobSelect={(): ReactElement => (
      <JobSelect
        options={[]}
        onClickSearch={action('onClickSearch')}
        onSelect={action('onSelect')}
      />
    )}
    renderWorkCategory={(): ReactElement => (
      <WorkCategoryDropdown
        onError={action('onError')}
        onSelect={action('onSelect')}
        jobId="0zdfdgd0000aaa"
        selected={{
          workCategoryCode: '',
          workCategoryId: '',
          workCategoryName: '',
        }}
        targetDate="2020-05-01"
      />
    )}
  />
);

AllDayEvent.storyName = 'all day event';

export const EditEvent = (): ReactElement => (
  <EventEditPopup
    event={hasTitle}
    useWorkTime
    useCalculateCapacity
    onClickClose={action('onClickClose')}
    onClickSave={action('onClickSave')}
    onClickDelete={action('onClickDelete')}
    onChange={action('onChange')}
    renderJobSelect={(): ReactElement => (
      <JobSelect
        options={[
          { jobId: '1', jobCode: '1', jobName: 'AAA' },
          { jobId: '2', jobCode: '2', jobName: 'BBB' },
          { jobId: '3', jobCode: '3', jobName: 'CCC' },
        ]}
        onClickSearch={action('onClickSearch')}
        onSelect={action('onSelect')}
      />
    )}
    renderWorkCategory={(): ReactElement => (
      <WorkCategoryDropdown
        onError={action('onError')}
        onSelect={action('onSelect')}
        jobId="0zdfdgd0000aaa"
        selected={{
          workCategoryCode: '',
          workCategoryId: '',
          workCategoryName: '',
        }}
        targetDate="2020-05-01"
      />
    )}
  />
);

EditEvent.storyName = 'edit event';
