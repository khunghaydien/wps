import React from 'react';

import { action } from '@storybook/addon-actions';

import CoreProvider from '@apps/core/contexts';

import Content from '../Content';
import DialogFrame from '../DialogFrame';
import {
  allocateDicList,
  allocateDicListFromResult,
  allocateDicListHasError,
  basicSettingData,
  jobPickList,
  validationErrors,
} from './mocks/autoHoursAllocateDictList';

export default {
  title:
    'time-tracking/AutoHoursAllocateDictDialog/AutoHoursAllocateDictDialog',
};

export const Standard = () => (
  <CoreProvider>
    <DialogFrame
      onClose={action('onClose')}
      onClickSaveButton={action('onClickSaveButton')}
    >
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
    </DialogFrame>
  </CoreProvider>
);

export const FromResult = () => (
  <CoreProvider>
    <DialogFrame
      onClose={action('onClose')}
      onClickSaveButton={action('onClickSaveButton')}
    >
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
    </DialogFrame>
  </CoreProvider>
);

export const ValidationError = () => (
  <CoreProvider>
    <DialogFrame
      onClose={action('onClose')}
      onClickSaveButton={action('onClickSaveButton')}
    >
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
    </DialogFrame>
  </CoreProvider>
);
