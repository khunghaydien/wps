import React from 'react';

import { action } from '@storybook/addon-actions';

import { CoreProvider } from '../../../../../core';

import Timesheet from '..';
import storeMock from '../../../__stories__/mock-data/storeMock';
import { withProvider } from '../../../../../../.storybook/decorator/Provider';
import configureStore from '../../../../store/configureStore';
import attRecordList from './mock-data/attRecordList';
import dailyActualWorkingPeriodListMap from './mock-data/dailyActualWorkingPeriodListMap';
import dailyAttentionMessagesMap from './mock-data/dailyAttentionMessagesMap';
import dailyContractedDetailMap from './mock-data/dailyContractedDetailMap';
import dailyRequestConditionsMap from './mock-data/dailyRequestConditionsMap';
import dailyRequestedWorkingHoursMap from './mock-data/dailyRequestedWorkingHoursMap';

// @ts-ignore Model統合後、mock更新でエラーが解消される
const store = configureStore(storeMock);

export default {
  title: 'timesheet-pc/MainContent/Timesheet',
  decorators: [withProvider(store)],
};

export const Index = () => (
  <CoreProvider>
    <Timesheet
      onClickRequestButton={action('onClickRequestButton')}
      onClickTimeButton={action('onClickTimeButton')}
      onClickRemarksButton={action('onClickRemarksButton')}
      onClickAttentionsButton={action('onClickAttentionsButton')}
      onChangeCommuteCount={action('onChangeCommuteCount')}
      attRecordList={attRecordList}
      dailyContractedDetailMap={dailyContractedDetailMap}
      dailyRequestedWorkingHoursMap={dailyRequestedWorkingHoursMap}
      dailyActualWorkingPeriodListMap={dailyActualWorkingPeriodListMap}
      dailyRequestConditionsMap={dailyRequestConditionsMap}
      dailyAttentionMessagesMap={dailyAttentionMessagesMap}
      isManHoursGraphOpened={false}
      useManageCommuteCount={true}
      // @ts-ignore
      userSetting={storeMock.common.userSetting}
    />
  </CoreProvider>
);

Index.storyName = 'index';
Index.parameters = {
  info: { propTables: [Timesheet], inline: true, source: true },
};
