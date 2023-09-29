import React from 'react';

import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

import CoreProvider from '@apps/core/contexts';

import {
  allocateDicList,
  allocateDicListFromResult,
  allocateDicListHasError,
  basicSettingData,
  jobPickList,
  validationErrors,
} from '@apps/time-tracking/AutoHoursAllocateDictDialog/components/stories/mocks/autoHoursAllocateDictList';

import Content from '../index';

export default {
  title: 'time-tracking/AutoHoursAllocateDictDialog/Content',
};

const Wrapper = styled.div`
  width: 65vw;
  min-width: 1200px;
  background-color: #fff;
  padding-top: 56px;
`;

export const Standard = () => (
  <CoreProvider>
    <Wrapper>
      <Content
        empId=""
        targetDate="2020-3-15"
        jobList={jobPickList}
        dictList={allocateDicList}
        dictListAllKeys={Object.keys(allocateDicList)}
        basicSetting={basicSettingData}
        errors={[]}
        selectJob={action('selectJob')}
        selectWorkCategory={action('selectWorkCategory')}
        editPriority={action('editPriority')}
        editItemField={action('editItemField')}
        addItem={action('addItem')}
        deleteItem={action('selectBasicJob')}
        onOkForJobSelectDialog={action('onOkForJobSelectDialog')}
        selectBasicJob={action('selectBasicJob')}
        editBasicWorkCategory={action('editBasicWorkCategory')}
        editOverlappingEvent={action('editOverlappingEvent')}
        editExceedActWorkHour={action('editExceedActWorkHour')}
        onOkForBasicJobSelectDialog={action('onOkForBasicJobSelectDialog')}
        onErrorForJobSelectDialog={action('onErrorForJobSelectDialog')}
      />
    </Wrapper>
  </CoreProvider>
);

export const FromResult = () => (
  <CoreProvider>
    <Wrapper>
      <Content
        empId=""
        targetDate="2020-3-15"
        jobList={jobPickList}
        dictList={allocateDicListFromResult}
        dictListAllKeys={Object.keys(allocateDicListFromResult)}
        basicSetting={basicSettingData}
        errors={[]}
        selectJob={action('selectJob')}
        selectWorkCategory={action('selectWorkCategory')}
        editPriority={action('editPriority')}
        editItemField={action('editItemField')}
        addItem={action('addItem')}
        deleteItem={action('selectBasicJob')}
        onOkForJobSelectDialog={action('onOkForJobSelectDialog')}
        selectBasicJob={action('selectBasicJob')}
        editBasicWorkCategory={action('editBasicWorkCategory')}
        editOverlappingEvent={action('editOverlappingEvent')}
        editExceedActWorkHour={action('editExceedActWorkHour')}
        onOkForBasicJobSelectDialog={action('onOkForBasicJobSelectDialog')}
        onErrorForJobSelectDialog={action('onErrorForJobSelectDialog')}
      />
    </Wrapper>
  </CoreProvider>
);

export const ValidationError = () => (
  <CoreProvider>
    <Wrapper>
      <Content
        empId=""
        targetDate="2020-3-15"
        jobList={{ byId: {}, allIds: [] }}
        dictList={allocateDicListHasError}
        dictListAllKeys={Object.keys(allocateDicListHasError)}
        basicSetting={basicSettingData}
        errors={validationErrors}
        selectJob={action('selectJob')}
        selectWorkCategory={action('selectWorkCategory')}
        editPriority={action('editPriority')}
        editItemField={action('editItemField')}
        addItem={action('addItem')}
        deleteItem={action('selectBasicJob')}
        onOkForJobSelectDialog={action('onOkForJobSelectDialog')}
        selectBasicJob={action('selectBasicJob')}
        editBasicWorkCategory={action('editBasicWorkCategory')}
        editOverlappingEvent={action('editOverlappingEvent')}
        editExceedActWorkHour={action('editExceedActWorkHour')}
        onOkForBasicJobSelectDialog={action('onOkForBasicJobSelectDialog')}
        onErrorForJobSelectDialog={action('onErrorForJobSelectDialog')}
      />
    </Wrapper>
  </CoreProvider>
);
