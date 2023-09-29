import React from 'react';

import { action } from '@storybook/addon-actions';

import CoreProvider from '@apps/core/contexts';

import { data, jobPickList } from '../../stories/mocks/allocateResultList';
import Content from '../index';

export default {
  title: 'time-tracking/AutoHoursAllocateResultDialog/Content',
};

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ width: 1200 }}>{children}</div>
);

export const Standard = () => (
  <CoreProvider>
    <Wrapper>
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
    </Wrapper>
  </CoreProvider>
);
