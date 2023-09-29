import React from 'react';

import { action } from '@storybook/addon-actions';

import CoreProvider from '@apps/core/contexts';

import Content from '../Content';
import DialogFrame from '../DialogFrame';
import { data, jobPickList } from './mocks/allocateResultList';

export default {
  title:
    'time-tracking/AutoHoursAllocateResultDialog/AutoHoursAllocateResultDialog',
};

export const Standard = () => {
  return (
    <CoreProvider>
      <DialogFrame
        onClose={action('onClose')}
        onApply={action('onApply')}
        targetDate="2022-3-15"
        timeOfAttendance={100}
        timeOfExternalTaskTime={100}
        selectedTime={200}
        empId={''}
      >
        <Content
          empId={''}
          targetDate="2022-2-21"
          jobList={jobPickList}
          resultList={data}
          checkAll={true}
          selectJob={action('selectJob')}
          selectWork={action('selectWork')}
          onOkForJobSelectDialog={action('onOkForJobSelectDialog')}
          onErrorForJobSelectDialog={action('onErrorForJobSelectDialog')}
          toggleCheckAll={action('toggleCheckAll')}
          toggleCheckbox={action('toggleCheckbox')}
          selectTaskTime={action('selectTaskTime')}
        />
      </DialogFrame>
    </CoreProvider>
  );
};
