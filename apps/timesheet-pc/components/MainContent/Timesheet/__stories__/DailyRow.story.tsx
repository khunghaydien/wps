import React from 'react';

import PropTypes from 'prop-types';

import { action } from '@storybook/addon-actions';

import { CoreProvider } from '../../../../../core';

import defaultPermission from '../../../../../domain/models/access-control/Permission';
import STATUS from '../../../../../domain/models/approval/request/Status';
import { defaultValue } from '../../../../../domain/models/attendance/AttDailyRequest/BaseAttDailyRequest';
import { create as createDirectRequest } from '../../../../../domain/models/attendance/AttDailyRequest/DirectRequest';
import { create as createLeaveRequest } from '../../../../../domain/models/attendance/AttDailyRequest/LeaveRequest';
import AttRecord from '../../../../models/AttRecord';
import DailyRequestConditions from '../../../../models/DailyRequestConditions';
import { AttDailyRecordFromRemote } from '@apps/domain/models/attendance/AttDailyRecord';
import { UserSetting } from '@apps/domain/models/UserSetting';

import { withProvider } from '../../../../../../.storybook/decorator/Provider';
import configureStore from '../../../../store/configureStore';
import storeMock from '../../../__stories__/mock-data/storeMock';
import DailyRow from '../DailyRow';
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
      rest1EndTime: undefined,
      rest1StartTime: undefined,
      rest2EndTime: undefined,
      rest2StartTime: undefined,
      rest3EndTime: undefined,
      rest3StartTime: undefined,
      rest4EndTime: undefined,
      rest4StartTime: undefined,
      rest5EndTime: undefined,
      rest5StartTime: undefined,
      restHours: undefined,
      startStampTime: undefined,
      dayType: AttRecord.DAY_TYPE.WORKDAY,
      insufficientRestTime: null,
      startTime: null,
      endTime: null,
      outStartTime: null,
      outEndTime: null,
      requestIds: [],
      commuteForwardCount: null,
      commuteBackwardCount: null,
      ...param,
    },
    false
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
  allowTaxExcludedAmount: false,
  belongsToResourceGroup: false,
  locale: '',
  organization: undefined,
  ...storeMock.common.userSetting,
  useWorkTime: false,
};

export default {
  title: 'timesheet-pc/MainContent/Timesheet/DailyRow',
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
        key={index}
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
      />
    ))}
  </DummyTable>
);

Default.storyName = 'default';

export const All = () => (
  <DummyTable>
    {attRecordList.map((attRecord, index) => (
      <DailyRow
        key={index}
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
        useManageCommuteCount={true}
        userSetting={{
          ...userSetting,
          useWorkTime: true,
        }}
      />
    ))}
  </DummyTable>
);

export const UseManageCommuteCount = () => (
  <DummyTable>
    {attRecordList.map((attRecord, index) => (
      <DailyRow
        key={index}
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
        useManageCommuteCount={true}
        userSetting={userSetting}
      />
    ))}
  </DummyTable>
);

UseManageCommuteCount.storyName = '通勤回数管理を使用する';

export const UseTimeTracking = () => (
  <DummyTable>
    {attRecordList.map((attRecord, index) => (
      <DailyRow
        key={index}
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
        attRecord={attRecord}
        requestConditions={DailyRequestConditions.createFromParams(
          attRecord,
          {
            dummy1: createLeaveRequest({
              ...defaultValue,
              requestTypeCode: 'Leave',
              status: STATUS.Approved,
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
        attRecord={attRecord}
        requestConditions={DailyRequestConditions.createFromParams(
          attRecord,
          {
            dummy1: createLeaveRequest({
              ...defaultValue,
              requestTypeCode: 'Leave',
              status: STATUS.Approved,
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
        attRecord={attRecord}
        requestConditions={DailyRequestConditions.createFromParams(
          attRecord,
          {
            dummy1: createLeaveRequest({
              ...defaultValue,
              requestTypeCode: 'Leave',
              status: STATUS.Approved,
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
        attRecord={attRecord}
        requestConditions={DailyRequestConditions.createFromParams(
          attRecord,
          {
            dummy1: createLeaveRequest({
              ...defaultValue,
              requestTypeCode: 'Leave',
              status: STATUS.Approved,
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
    isSummaryLocked: false,
    lateArrivalStartTime: undefined,
    outEndTime: undefined,
    outStartTime: undefined,
    overtimeWorkApplyDefaultStartTime: undefined,
    realWorkTime: undefined,
    remarks: undefined,
    requestIds: [],
    requestTypeCodes: [],
    rest1EndTime: undefined,
    rest1StartTime: undefined,
    rest2EndTime: undefined,
    rest2StartTime: undefined,
    rest3EndTime: undefined,
    rest3StartTime: undefined,
    rest4EndTime: undefined,
    rest4StartTime: undefined,
    rest5EndTime: undefined,
    rest5StartTime: undefined,
    restHours: undefined,
    startStampTime: undefined,
    startTime: undefined,
    recordDate: '2017-07-03',
    dayType: AttRecord.DAY_TYPE.WORKDAY,
    isLeaveOfAbsence: true,
    commuteForwardCount: null,
    commuteBackwardCount: null,
  });
  return (
    <DummyTable>
      <DailyRow
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
    isSummaryLocked: false,
    lateArrivalStartTime: undefined,
    outEndTime: undefined,
    outStartTime: undefined,
    overtimeWorkApplyDefaultStartTime: undefined,
    realWorkTime: undefined,
    remarks: undefined,
    requestIds: ['directId'],
    requestTypeCodes: [],
    rest1EndTime: undefined,
    rest1StartTime: undefined,
    rest2EndTime: undefined,
    rest2StartTime: undefined,
    rest3EndTime: undefined,
    rest3StartTime: undefined,
    rest4EndTime: undefined,
    rest4StartTime: undefined,
    rest5EndTime: undefined,
    rest5StartTime: undefined,
    restHours: undefined,
    startStampTime: undefined,
    startTime: undefined,
    recordDate: '2017-07-03',
    dayType: AttRecord.DAY_TYPE.WORKDAY,
    isLeaveOfAbsence: true,
    commuteForwardCount: null,
    commuteBackwardCount: null,
  });
  return (
    <DummyTable>
      <DailyRow
        attRecord={attRecord}
        requestConditions={DailyRequestConditions.createFromParams(
          attRecord,
          {
            directId: createDirectRequest({
              ...defaultValue,
              id: 'directId',
              requestTypeName: '直行直帰申請',
              requestTypeCode: 'Direct',
              status: STATUS.Approved,
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
      />
    </DummyTable>
  );
};

SuspensionWithWork.storyName = '休職・休業：産後パパ育休';
