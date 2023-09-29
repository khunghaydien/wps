import React from 'react';

import { action } from '@storybook/addon-actions';

import { CoreProvider } from '../../../../../../core';

import { withProvider } from '../../../../../../../.storybook/decorator/Provider';
import configureStore from '../../../../store/configureStore';
import storeMock from '../../../__stories__/mock-data/storeMock';
import Timesheet from '..';
import HeadingRowFixedCell from '../HeadingRow/FixedCells';
import { TIMESHEET_VIEW_TYPE } from '../TimesheetViewType';
import attRecordList from './mock-data/attRecordList';
import dailyActualWorkingPeriodListMap from './mock-data/dailyActualWorkingPeriodListMap';
import dailyAttentionMessagesMap from './mock-data/dailyAttentionMessagesMap';
import dailyContractedDetailMap from './mock-data/dailyContractedDetailMap';
import dailyRequestConditionsMap from './mock-data/dailyRequestConditionsMap';
import dailyRequestedWorkingHoursMap from './mock-data/dailyRequestedWorkingHoursMap';

// @ts-ignore Model統合後、mock更新でエラーが解消される
const store = configureStore(storeMock);

export default {
  title: 'attendance/timesheet-pc/MainContent/Timesheet',
  decorators: [withProvider(store)],
};

export const Index = () => (
  <CoreProvider>
    <Timesheet
      viewType={TIMESHEET_VIEW_TYPE.GRAPH}
      onClickRequestButton={action('onClickRequestButton')}
      onClickTimeButton={action('onClickTimeButton')}
      onClickRemarksButton={action('onClickRemarksButton')}
      onClickAttentionsButton={action('onClickAttentionsButton')}
      onChangeCommuteCount={action('onChangeCommuteCount')}
      today={'2020-02-07'}
      attRecordList={attRecordList}
      dailyContractedDetailMap={dailyContractedDetailMap}
      dailyRequestedWorkingHoursMap={dailyRequestedWorkingHoursMap}
      dailyActualWorkingPeriodListMap={dailyActualWorkingPeriodListMap}
      dailyRequestConditionsMap={dailyRequestConditionsMap}
      dailyAttentionMessagesMap={dailyAttentionMessagesMap}
      isManHoursGraphOpened={false}
      workingType={
        {
          useManageCommuteCount: true,
          useFixDailyRequest: true,
        } as unknown as React.ComponentProps<typeof Timesheet>['workingType']
      }
      workingTypes={
        [
          {
            startDate: '2020-02-01',
            endDate: '2020-02-29',
            useManageCommuteCount: true,
            useFixDailyRequest: true,
          },
        ] as unknown as React.ComponentProps<typeof Timesheet>['workingTypes']
      }
      // @ts-ignore
      userSetting={storeMock.common.userSetting}
      Containers={{
        HeadingRowFixedCellsContainer: () => (
          <HeadingRowFixedCell
            {...{
              type: TIMESHEET_VIEW_TYPE.GRAPH,
              useAllowanceManagement: false,
              useFixDailyRequest: true,
              useManageCommuteCount: true,
              useWorkTime: true,
            }}
          />
        ),
        HeadingRowTableCellsContainer: () => null,
        DailyRowTableCellsContainer: () => null,
      }}
    />
  </CoreProvider>
);

Index.storyName = 'index';
Index.parameters = {
  info: { propTables: [Timesheet], inline: true, source: true },
};
