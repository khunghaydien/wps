import React from 'react';

import PropTypes from 'prop-types';

import { action } from '@storybook/addon-actions';

import { CoreProvider } from '../../../../../../core';

// FIXME: API未加工のモデルは使いたくないが古い実装に合わせるために仕方なく使用している
import { DailyRecord as AttDailyRecordFromRemote } from '@attendance/repositories/models/DailyRecord';

import defaultPermission from '../../../../../../domain/models/access-control/Permission';
import AttRecord from '../../../../models/AttRecord';
import DailyRequestConditions from '../../../../models/DailyRequestConditions';
import { UserSetting } from '@apps/domain/models/UserSetting';
import {
  defaultValue,
  STATUS,
} from '@attendance/domain/models/AttDailyRequest/BaseAttDailyRequest';
import { convertFromBase as createLeaveRequest } from '@attendance/domain/models/AttDailyRequest/LeaveRequest';
import { CODE as REQUEST_TYPE_CODE } from '@attendance/domain/models/AttDailyRequestType';

import { withProvider } from '../../../../../../../.storybook/decorator/Provider';
import configureStore from '../../../../store/configureStore';
import storeMock from '../../../__stories__/mock-data/storeMock';
import DailyRow from '../DailyRow';
import { TIMESHEET_VIEW_TYPE } from '../TimesheetViewType';
import attRecordList from './mock-data/attRecordList';
import dailyRequestConditionsMap from './mock-data/dailyRequestConditionsMap';

const createAttRecordFromPartial = (
  param: Partial<AttDailyRecordFromRemote>
): AttRecord => {
  return AttRecord.createFromParam(
    {
      approver01Name: '',
      ciliTimePeriods: [],
      ciloTimePeriods: [],
      coliTimePeriods: [],
      coloTimePeriods: [],
      contractedDetail: undefined,
      earlyLeaveEndTime: undefined,
      earlyStartWorkApplyDefaultEndTime: undefined,
      endStampTime: undefined,
      id: '',
      isLeaveOfAbsence: false,
      lateArrivalStartTime: undefined,
      overtimeWorkApplyDefaultStartTime: undefined,
      realWorkTime: undefined,
      recordDate: '2017-01-01',
      remarks: undefined,
      requestTypeCodes: [],
      dailyRestList: [],
      restHours: undefined,
      otherRestReason: null,
      startStampTime: undefined,
      dayType: AttRecord.DAY_TYPE.WORKDAY,
      insufficientRestTime: null,
      outInsufficientMinimumWorkHours: null,
      startTime: null,
      endTime: null,
      useManageLateArrivalPersonalReason: false,
      useManageEarlyLeavePersonalReason: false,
      workSystem: null,
      flexStartTime: null,
      flexEndTime: null,
      withoutCoreTime: false,
      outStartTime: null,
      outEndTime: null,
      requestIds: [],
      fixDailyRequest: {
        id: undefined,
        status: undefined,
        approver01Name: undefined,
        performableActionForFix: undefined,
      },
      requestDayType: 'Holiday',
      isDirectInputTimeRequest: false,
      isLocked: false,
      isHolLegalHoliday: false,
      isFlexWithoutCore: false,
      isFlexWithoutCoreRequireEarlyLeaveApply: false,
      personalReasonEarlyLeaveEndTime: null,
      objectiveReasonEarlyLeaveEndTime: null,
      lateArrivalEarlyLeaveReasonId: '',
      commuteForwardCount: null,
      commuteBackwardCount: null,
      ...param,
    },
    {
      isSummaryLocked: false,
      useFixDailyRequest: false,
    }
  );
};

// @ts-ignore Model統合後、mock更新でエラーが解消される
const store = configureStore(storeMock);

const DummyTable = (props) => (
  <table
    style={{
      boxSizing: 'border-box',
      position: 'relative',
      width: '100%',
      minWidth: '1024px',
      borderCollapse: 'separate',
      transition: 'height 0.3s ease-out',
    }}
  >
    <tbody>{props.children}</tbody>
  </table>
);

DummyTable.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

const userSetting: UserSetting = {
  organizationSetting: undefined,
  useCompanyVendor: false,
  usePersonalVendor: false,
  expTaxRoundingSetting: undefined,
  allowApproveExpInDiffCompany: false,
  allowTaxExcludedAmountInput: false,
  belongsToResourceGroup: false,
  locale: '',
  organization: undefined,
  ...storeMock.common.userSetting,
  useWorkTime: false,
  viewAttDailyRequestApproval: true,
  viewAttRequestApproval: true,
  viewAttLegalAgreementRequestApproval: true,
  viewAttFixDailyRequestApproval: true,
};

export default {
  title: 'attendance/timesheet-pc/MainContent/Timesheet/DailyRow',
  decorators: [
    withProvider(store),
    (story) => <CoreProvider>{story()}</CoreProvider>,
  ],
  parameters: {
    info: { propTables: [DailyRow], inline: true, source: true },
  },
};

export const Default = () => (
  <DummyTable>
    {attRecordList.map((attRecord, index) => (
      <DailyRow
        viewType={TIMESHEET_VIEW_TYPE.GRAPH}
        key={index}
        today={''}
        attRecord={attRecord}
        requestConditions={dailyRequestConditionsMap[attRecord.recordDate]}
        onClickRequestButton={action('Click Request button')}
        onClickAttentionsButton={action('Click Attentions button')}
        onClickTimeButton={action('Click Time button')}
        onClickRemarksButton={action('Click Remarks button')}
        onDragChartStart={action('Drag Chart Start')}
        onChangeCommuteCount={action('Change Commute Count')}
        attentionMessages={(() => {
          if (index === 2) {
            return ['Attention message text here.'];
          } else if (index === 5) {
            return [
              'Attention message text 1 here.',
              'Attention message text 2 here.',
            ];
          }
          return null;
        })()}
        userSetting={userSetting}
        TableCellsContainer={() => null}
      />
    ))}
  </DummyTable>
);

Default.storyName = 'default';

export const All = () => (
  <DummyTable>
    {attRecordList.map((attRecord, index) => (
      <DailyRow
        viewType={TIMESHEET_VIEW_TYPE.GRAPH}
        key={attRecord.recordDate}
        today={''}
        attRecord={attRecord}
        requestConditions={dailyRequestConditionsMap[attRecord.recordDate]}
        onClickRequestButton={action('Click Request button')}
        onClickAttentionsButton={action('Click Attentions button')}
        onClickTimeButton={action('Click Time button')}
        onClickRemarksButton={action('Click Remarks button')}
        onDragChartStart={action('Drag Chart Start')}
        onChangeCommuteCount={action('Change Commute Count')}
        attentionMessages={(() => {
          if (index === 2) {
            return ['Attention message text here.'];
          } else if (index === 5) {
            return [
              'Attention message text 1 here.',
              'Attention message text 2 here.',
            ];
          }
          return null;
        })()}
        workingType={
          {
            useManageCommuteCount: true,
          } as unknown as React.ComponentProps<typeof DailyRow>['workingType']
        }
        dailyWorkingType={
          {
            useManageCommuteCount: true,
          } as unknown as React.ComponentProps<
            typeof DailyRow
          >['dailyWorkingType']
        }
        userSetting={{
          ...userSetting,
          useWorkTime: true,
        }}
        TableCellsContainer={() => null}
      />
    ))}
  </DummyTable>
);

export const UseManageCommuteCount = () => (
  <DummyTable>
    {attRecordList.map((attRecord, index) => (
      <DailyRow
        viewType={TIMESHEET_VIEW_TYPE.GRAPH}
        key={attRecord.recordDate}
        today={''}
        attRecord={attRecord}
        requestConditions={dailyRequestConditionsMap[attRecord.recordDate]}
        onClickRequestButton={action('Click Request button')}
        onClickAttentionsButton={action('Click Attentions button')}
        onClickTimeButton={action('Click Time button')}
        onClickRemarksButton={action('Click Remarks button')}
        onDragChartStart={action('Drag Chart Start')}
        onChangeCommuteCount={action('Change Commute Count')}
        attentionMessages={(() => {
          if (index === 2) {
            return ['Attention message text here.'];
          } else if (index === 5) {
            return [
              'Attention message text 1 here.',
              'Attention message text 2 here.',
            ];
          }
          return null;
        })()}
        workingType={
          {
            useManageCommuteCount: true,
          } as unknown as React.ComponentProps<typeof DailyRow>['workingType']
        }
        dailyWorkingType={
          {
            useManageCommuteCount: true,
          } as unknown as React.ComponentProps<
            typeof DailyRow
          >['dailyWorkingType']
        }
        userSetting={userSetting}
        TableCellsContainer={() => null}
      />
    ))}
  </DummyTable>
);

UseManageCommuteCount.storyName = '通勤回数管理を使用する';

export const UseTimeTracking = () => (
  <DummyTable>
    {attRecordList.map((attRecord, index) => (
      <DailyRow
        viewType={TIMESHEET_VIEW_TYPE.GRAPH}
        key={attRecord.recordDate}
        today={''}
        attRecord={attRecord}
        requestConditions={dailyRequestConditionsMap[attRecord.recordDate]}
        onClickRequestButton={action('Click Request button')}
        onClickAttentionsButton={action('Click Attentions button')}
        onClickTimeButton={action('Click Time button')}
        onClickRemarksButton={action('Click Remarks button')}
        onDragChartStart={action('Drag Chart Start')}
        onChangeCommuteCount={action('Change Commute Count')}
        attentionMessages={(() => {
          if (index === 2) {
            return ['Attention message text here.'];
          } else if (index === 5) {
            return [
              'Attention message text 1 here.',
              'Attention message text 2 here.',
            ];
          }
          return null;
        })()}
        userSetting={{
          ...userSetting,
          useWorkTime: true,
        }}
        TableCellsContainer={() => null}
      />
    ))}
  </DummyTable>
);

UseTimeTracking.storyName = '工数を使用する';

export const LeaveTypeNone = () => {
  const attRecord = createAttRecordFromPartial({
    recordDate: '2017-07-03',
    dayType: AttRecord.DAY_TYPE.WORKDAY,
  });
  return (
    <DummyTable>
      <DailyRow
        viewType={TIMESHEET_VIEW_TYPE.GRAPH}
        today={''}
        attRecord={attRecord}
        requestConditions={DailyRequestConditions.createFromParams(
          attRecord,
          {},
          {},
          {
            isSummaryLocked: false,
            isByDelegate: false,
            userPermission: defaultPermission,
          }
        )}
        userSetting={userSetting}
        onClickRequestButton={action('Click Request button')}
        onClickAttentionsButton={action('Click Attentions button')}
        onClickTimeButton={action('Click Time button')}
        onClickRemarksButton={action('Click Remarks button')}
        onDragChartStart={action('Drag Chart Start')}
        onChangeCommuteCount={action('Change Commute Count')}
        TableCellsContainer={() => null}
      />
    </DummyTable>
  );
};

LeaveTypeNone.storyName = '休暇タイプ - 午前：なし, 午後：なし';

export const LeaveTypePaidNone = () => {
  const attRecord = createAttRecordFromPartial({
    recordDate: '2017-07-03',
    dayType: AttRecord.DAY_TYPE.WORKDAY,
    requestIds: ['dummy1'],
  });
  return (
    <DummyTable>
      <DailyRow
        viewType={TIMESHEET_VIEW_TYPE.GRAPH}
        today={''}
        attRecord={attRecord}
        requestConditions={DailyRequestConditions.createFromParams(
          attRecord,
          {
            dummy1: createLeaveRequest({
              ...defaultValue,
              requestTypeCode: 'Leave',
              status: STATUS.APPROVED,
              leaveRange: 'AM',
              startTime: 600,
              endTime: 840,
              leaveType: 'Paid',
            }),
          },
          {},
          {
            isSummaryLocked: false,
            isByDelegate: false,
            userPermission: defaultPermission,
          }
        )}
        userSetting={userSetting}
        onClickRequestButton={action('Click Request button')}
        onClickAttentionsButton={action('Click Attentions button')}
        onClickTimeButton={action('Click Time button')}
        onClickRemarksButton={action('Click Remarks button')}
        onDragChartStart={action('Drag Chart Start')}
        onChangeCommuteCount={action('Change Commute Count')}
        TableCellsContainer={() => null}
      />
    </DummyTable>
  );
};

LeaveTypePaidNone.storyName = '休暇タイプ - 午前：有給, 午後：なし';

export const LeaveTypeUnpaidNone = () => {
  const attRecord = createAttRecordFromPartial({
    recordDate: '2017-07-03',
    dayType: AttRecord.DAY_TYPE.WORKDAY,
    requestIds: ['dummy1'],
  });
  return (
    <DummyTable>
      <DailyRow
        viewType={TIMESHEET_VIEW_TYPE.GRAPH}
        today={''}
        attRecord={attRecord}
        requestConditions={DailyRequestConditions.createFromParams(
          attRecord,
          {
            dummy1: createLeaveRequest({
              ...defaultValue,
              requestTypeCode: 'Leave',
              status: STATUS.APPROVED,
              leaveRange: 'AM',
              startTime: 600,
              endTime: 840,
              leaveType: 'Unpaid',
            }),
          },
          {},
          {
            isSummaryLocked: false,
            isByDelegate: false,
            userPermission: defaultPermission,
          }
        )}
        userSetting={userSetting}
        onClickRequestButton={action('Click Request button')}
        onClickAttentionsButton={action('Click Attentions button')}
        onClickTimeButton={action('Click Time button')}
        onClickRemarksButton={action('Click Remarks button')}
        onDragChartStart={action('Drag Chart Start')}
        onChangeCommuteCount={action('Change Commute Count')}
        TableCellsContainer={() => null}
      />
    </DummyTable>
  );
};

LeaveTypeUnpaidNone.storyName = '休暇タイプ - 午前：無給, 午後：なし';

export const LeaveTypeNonePaid = () => {
  const attRecord = createAttRecordFromPartial({
    recordDate: '2017-07-03',
    dayType: AttRecord.DAY_TYPE.WORKDAY,
    requestIds: ['dummy1'],
  });
  return (
    <DummyTable>
      <DailyRow
        viewType={TIMESHEET_VIEW_TYPE.GRAPH}
        today={''}
        attRecord={attRecord}
        requestConditions={DailyRequestConditions.createFromParams(
          attRecord,
          {
            dummy1: createLeaveRequest({
              ...defaultValue,
              requestTypeCode: 'Leave',
              status: STATUS.APPROVED,
              leaveRange: 'PM',
              startTime: 840,
              endTime: 1080,
              leaveType: 'Paid',
            }),
          },
          {},
          {
            isSummaryLocked: false,
            isByDelegate: false,
            userPermission: defaultPermission,
          }
        )}
        userSetting={userSetting}
        onClickRequestButton={action('Click Request button')}
        onClickAttentionsButton={action('Click Attentions button')}
        onClickTimeButton={action('Click Time button')}
        onClickRemarksButton={action('Click Remarks button')}
        onDragChartStart={action('Drag Chart Start')}
        onChangeCommuteCount={action('Change Commute Count')}
        TableCellsContainer={() => null}
      />
    </DummyTable>
  );
};

LeaveTypeNonePaid.storyName = '休暇タイプ - 午前：なし, 午後：有給';

export const LeaveTypeNoneUnpaid = () => {
  const attRecord = createAttRecordFromPartial({
    recordDate: '2017-07-03',
    dayType: AttRecord.DAY_TYPE.WORKDAY,
    requestIds: ['dummy1'],
  });
  return (
    <DummyTable>
      <DailyRow
        viewType={TIMESHEET_VIEW_TYPE.GRAPH}
        today={''}
        attRecord={attRecord}
        requestConditions={DailyRequestConditions.createFromParams(
          attRecord,
          {
            dummy1: createLeaveRequest({
              ...defaultValue,
              requestTypeCode: 'Leave',
              status: STATUS.APPROVED,
              leaveRange: 'PM',
              startTime: 840,
              endTime: 1080,
              leaveType: 'Unpaid',
            }),
          },
          {},
          {
            isSummaryLocked: false,
            isByDelegate: false,
            userPermission: defaultPermission,
          }
        )}
        userSetting={userSetting}
        onClickRequestButton={action('Click Request button')}
        onClickAttentionsButton={action('Click Attentions button')}
        onClickTimeButton={action('Click Time button')}
        onClickRemarksButton={action('Click Remarks button')}
        onDragChartStart={action('Drag Chart Start')}
        onChangeCommuteCount={action('Change Commute Count')}
        TableCellsContainer={() => null}
      />
    </DummyTable>
  );
};

LeaveTypeNoneUnpaid.storyName = '休暇タイプ - 午前：なし, 午後：無給';

export const Suspension = () => {
  const attRecord = new AttRecord({
    approver01Name: '',
    ciliTimePeriods: [],
    ciloTimePeriods: [],
    coliTimePeriods: [],
    coloTimePeriods: [],
    contractedDetail: undefined,
    earlyLeaveEndTime: undefined,
    earlyStartWorkApplyDefaultEndTime: undefined,
    endStampTime: undefined,
    endTime: undefined,
    id: '',
    insufficientRestTime: undefined,
    outInsufficientMinimumWorkHours: undefined,
    isSummaryLocked: false,
    lateArrivalStartTime: undefined,
    outEndTime: undefined,
    outStartTime: undefined,
    overtimeWorkApplyDefaultStartTime: undefined,
    realWorkTime: undefined,
    remarks: undefined,
    requestIds: [],
    requestTypeCodes: [],
    dailyRestList: [],
    restHours: undefined,
    otherRestReason: null,
    startStampTime: undefined,
    startTime: undefined,
    recordDate: '2017-07-03',
    dayType: AttRecord.DAY_TYPE.WORKDAY,
    isLeaveOfAbsence: true,
    useManageLateArrivalPersonalReason: false,
    useManageEarlyLeavePersonalReason: false,
    workSystem: null,
    flexStartTime: null,
    flexEndTime: null,
    withoutCoreTime: false,
    fixDailyRequest: {
      id: undefined,
      status: undefined,
      approver01Name: undefined,
      performableActionForFix: undefined,
    },
    requestDayType: 'Holiday',
    isDirectInputTimeRequest: false,
    isLocked: false,
    useFixDailyRequest: false,
    isHolLegalHoliday: false,
    isFlexWithoutCore: false,
    isFlexWithoutCoreRequireEarlyLeaveApply: false,
    personalReasonEarlyLeaveEndTime: null,
    objectiveReasonEarlyLeaveEndTime: null,
    lateArrivalEarlyLeaveReasonId: '',
    commuteCount: null,
  });
  return (
    <DummyTable>
      <DailyRow
        viewType={TIMESHEET_VIEW_TYPE.GRAPH}
        today={''}
        attRecord={attRecord}
        requestConditions={DailyRequestConditions.createFromParams(
          attRecord,
          {},
          {},
          {
            isSummaryLocked: false,
            isByDelegate: false,
            userPermission: defaultPermission,
          }
        )}
        userSetting={userSetting}
        onClickRequestButton={action('Click Request button')}
        onClickAttentionsButton={action('Click Attentions button')}
        onClickTimeButton={action('Click Time button')}
        onClickRemarksButton={action('Click Remarks button')}
        onDragChartStart={action('Drag Chart Start')}
        onChangeCommuteCount={action('Change Commute Count')}
        TableCellsContainer={() => null}
      />
    </DummyTable>
  );
};

Suspension.storyName = '休職・休業';

export const SuspensionWithWork = () => {
  const attRecord = new AttRecord({
    approver01Name: '',
    ciliTimePeriods: [],
    ciloTimePeriods: [],
    coliTimePeriods: [],
    coloTimePeriods: [],
    contractedDetail: undefined,
    earlyLeaveEndTime: undefined,
    earlyStartWorkApplyDefaultEndTime: undefined,
    endStampTime: undefined,
    endTime: undefined,
    id: '',
    insufficientRestTime: undefined,
    outInsufficientMinimumWorkHours: undefined,
    isSummaryLocked: false,
    lateArrivalStartTime: undefined,
    outEndTime: undefined,
    outStartTime: undefined,
    overtimeWorkApplyDefaultStartTime: undefined,
    realWorkTime: undefined,
    remarks: undefined,
    requestIds: ['pattern'],
    requestTypeCodes: [],
    dailyRestList: [],
    restHours: undefined,
    otherRestReason: null,
    startStampTime: undefined,
    startTime: undefined,
    recordDate: '2017-07-03',
    dayType: AttRecord.DAY_TYPE.WORKDAY,
    isLeaveOfAbsence: true,
    useManageLateArrivalPersonalReason: false,
    useManageEarlyLeavePersonalReason: false,
    workSystem: null,
    flexStartTime: null,
    flexEndTime: null,
    withoutCoreTime: false,
    fixDailyRequest: {
      id: undefined,
      status: undefined,
      approver01Name: undefined,
      performableActionForFix: undefined,
    },
    requestDayType: 'Holiday',
    isDirectInputTimeRequest: false,
    isLocked: false,
    useFixDailyRequest: false,
    isHolLegalHoliday: false,
    isFlexWithoutCore: false,
    isFlexWithoutCoreRequireEarlyLeaveApply: false,
    personalReasonEarlyLeaveEndTime: null,
    objectiveReasonEarlyLeaveEndTime: null,
    lateArrivalEarlyLeaveReasonId: '',
    commuteCount: null,
  });
  return (
    <DummyTable>
      <DailyRow
        viewType={TIMESHEET_VIEW_TYPE.GRAPH}
        today={''}
        attRecord={attRecord}
        requestConditions={DailyRequestConditions.createFromParams(
          attRecord,
          {
            pattern: createLeaveRequest({
              ...defaultValue,
              requestTypeCode: REQUEST_TYPE_CODE.Pattern,
              status: STATUS.APPROVED,
            }),
          },
          {},
          {
            isSummaryLocked: false,
            isByDelegate: false,
            userPermission: defaultPermission,
          }
        )}
        userSetting={userSetting}
        onClickRequestButton={action('Click Request button')}
        onClickAttentionsButton={action('Click Attentions button')}
        onClickTimeButton={action('Click Time button')}
        onClickRemarksButton={action('Click Remarks button')}
        onDragChartStart={action('Drag Chart Start')}
        onChangeCommuteCount={action('Change Commute Count')}
        TableCellsContainer={() => null}
      />
    </DummyTable>
  );
};

SuspensionWithWork.storyName = '休職・休業：就業可能';
