/* eslint-disable react/no-array-index-key */
import React from 'react';

import PropTypes from 'prop-types';

import AttRecordModel from '../../../../models/AttRecord';
import { LEAVE_RANGE } from '@attendance/domain/models/LeaveRange';
import { LEAVE_TYPE } from '@attendance/domain/models/LeaveType';

import Component from '../AttChart';
import {
  actualWorkingPeriods as actualWorkingPeriodList,
  createLeaveRequest,
  scheduledWorkingHours,
} from './mock-data/graphParams';

const AddGauge = (props) => {
  const units = [];
  for (let i = 0; i <= 24 * 2; i += 2) {
    units.push(
      <span style={{ flex: '0 0 40px', textAlign: 'center' }}>{i % 24}</span>
    );
  }
  return (
    <div>
      <div style={{ display: 'flex' }}>{units}</div>
      {props.children}
    </div>
  );
};
AddGauge.propTypes = { children: PropTypes.node.isRequired };

export default {
  title: 'attendance/timesheet-pc/MainContent/Timesheet/AttChart',
};

type Props = Omit<React.ComponentProps<typeof Component>, 'dayType'>;

const pattern: Props[] = [
  // 全ての値がない状態
  {
    startTime: null,
    endTime: null,
    scheduledWorkingHours: {
      startTime: null,
      endTime: null,
    },
    actualWorkingPeriodList: [],
    effectualLeaveRequestList: [],
    isHolLegalHoliday: false,
    isLeaveOfAbsence: false,
    isApprovedAbsence: false,
    isAllowWorkDuringLeaveOfAbsence: false,
  },
  // 予定時間だけ
  {
    startTime: null,
    endTime: null,
    scheduledWorkingHours,
    actualWorkingPeriodList: [],
    effectualLeaveRequestList: [],
    isHolLegalHoliday: false,
    isLeaveOfAbsence: false,
    isApprovedAbsence: false,
    isAllowWorkDuringLeaveOfAbsence: false,
  },
  // 勤務時間だけ
  {
    startTime: null,
    endTime: null,
    scheduledWorkingHours: {
      startTime: null,
      endTime: null,
    },
    actualWorkingPeriodList,
    effectualLeaveRequestList: [],
    isHolLegalHoliday: false,
    isLeaveOfAbsence: false,
    isApprovedAbsence: false,
    isAllowWorkDuringLeaveOfAbsence: false,
  },
  // 出退勤打刻+予定時間＋勤務時間
  {
    startTime: actualWorkingPeriodList.at(0).startTime,
    endTime: actualWorkingPeriodList.at(-1).endTime,
    actualWorkingPeriodList,
    scheduledWorkingHours,
    effectualLeaveRequestList: [],
    isHolLegalHoliday: false,
    isLeaveOfAbsence: false,
    isApprovedAbsence: false,
    isAllowWorkDuringLeaveOfAbsence: false,
  },
  // 優先法定休日が法定休日の場合
  {
    startTime: actualWorkingPeriodList.at(0).startTime,
    endTime: actualWorkingPeriodList.at(-1).endTime,
    actualWorkingPeriodList,
    scheduledWorkingHours,
    effectualLeaveRequestList: [],
    isHolLegalHoliday: true,
    isLeaveOfAbsence: false,
    isApprovedAbsence: false,
    isAllowWorkDuringLeaveOfAbsence: false,
  },
  // 休職休業
  {
    startTime: actualWorkingPeriodList.at(0).startTime,
    endTime: actualWorkingPeriodList.at(-1).endTime,
    actualWorkingPeriodList,
    scheduledWorkingHours,
    effectualLeaveRequestList: [],
    isHolLegalHoliday: false,
    isLeaveOfAbsence: true,
    isApprovedAbsence: false,
    isAllowWorkDuringLeaveOfAbsence: false,
  },
  // 欠勤
  {
    startTime: actualWorkingPeriodList.at(0).startTime,
    endTime: actualWorkingPeriodList.at(-1).endTime,
    actualWorkingPeriodList,
    scheduledWorkingHours,
    effectualLeaveRequestList: [],
    isHolLegalHoliday: false,
    isLeaveOfAbsence: false,
    isApprovedAbsence: true,
    isAllowWorkDuringLeaveOfAbsence: false,
  },
  // 出勤可能な欠勤（育児休業・産後パパ育休）
  {
    startTime: actualWorkingPeriodList.at(0).startTime,
    endTime: actualWorkingPeriodList.at(-1).endTime,
    actualWorkingPeriodList,
    scheduledWorkingHours,
    effectualLeaveRequestList: [],
    isHolLegalHoliday: false,
    isLeaveOfAbsence: false,
    isApprovedAbsence: false,
    isAllowWorkDuringLeaveOfAbsence: true,
  },
  // 全てのフラグを持っている状態
  {
    startTime: actualWorkingPeriodList.at(0).startTime,
    endTime: actualWorkingPeriodList.at(-1).endTime,
    actualWorkingPeriodList,
    scheduledWorkingHours,
    effectualLeaveRequestList: [],
    isHolLegalHoliday: true,
    isLeaveOfAbsence: true,
    isApprovedAbsence: true,
    isAllowWorkDuringLeaveOfAbsence: true,
  },
];

export const Workday = () => (
  <AddGauge>
    {pattern.map((props, idx) => (
      <Component
        key={idx}
        dayType={AttRecordModel.DAY_TYPE.WORKDAY}
        {...props}
      />
    ))}
  </AddGauge>
);

export const Holiday = () => (
  <AddGauge>
    {pattern.map((props, idx) => (
      <Component
        key={idx}
        dayType={AttRecordModel.DAY_TYPE.HOLIDAY}
        {...props}
      />
    ))}
  </AddGauge>
);

export const LegalHoliday = () => (
  <AddGauge>
    {pattern.map((props, idx) => (
      <Component
        key={idx}
        dayType={AttRecordModel.DAY_TYPE.LEGAL_HOLIDAY}
        {...props}
      />
    ))}
  </AddGauge>
);

export const PreferredLegalHoliday = () => (
  <AddGauge>
    {pattern.map((props, idx) => (
      <Component
        key={idx}
        dayType={AttRecordModel.DAY_TYPE.PREFERRED_LEGAL_HOLIDAY}
        {...props}
      />
    ))}
  </AddGauge>
);

export const LeaveHalf = () => (
  <AddGauge>
    {[
      // 半休
      ...Object.values(LEAVE_TYPE).map((leaveType) => ({
        startTime: actualWorkingPeriodList.at(0).startTime,
        endTime: actualWorkingPeriodList.at(-1).endTime,
        actualWorkingPeriodList,
        scheduledWorkingHours,
        effectualLeaveRequestList: [
          createLeaveRequest({
            startTime: 9 * 60,
            endTime: 14 * 60,
            leaveType,
            leaveRange: LEAVE_RANGE.Half,
          }),
        ],
        isHolLegalHoliday: false,
        isLeaveOfAbsence: false,
        isApprovedAbsence: false,
        isAllowWorkDuringLeaveOfAbsence: false,
      })),
      // 半休 * 2
      ...Object.values(LEAVE_TYPE).map((leaveType) => ({
        startTime: actualWorkingPeriodList.at(0).startTime,
        endTime: actualWorkingPeriodList.at(-1).endTime,
        actualWorkingPeriodList,
        scheduledWorkingHours,
        effectualLeaveRequestList: [
          createLeaveRequest({
            startTime: 9 * 60,
            endTime: 14 * 60,
            leaveType,
            leaveRange: LEAVE_RANGE.Half,
          }),
          createLeaveRequest({
            startTime: 9 * 60,
            endTime: 14 * 60,
            leaveType: LEAVE_TYPE.Annual,
            leaveRange: LEAVE_RANGE.Half,
          }),
        ],
        isHolLegalHoliday: false,
        isLeaveOfAbsence: false,
        isApprovedAbsence: false,
        isAllowWorkDuringLeaveOfAbsence: false,
      })),
    ].map((props, idx) => (
      <Component
        key={idx}
        dayType={AttRecordModel.DAY_TYPE.WORKDAY}
        {...props}
      />
    ))}
  </AddGauge>
);

export const Leave = () => (
  <AddGauge>
    {[
      // 午前休
      ...Object.values(LEAVE_TYPE).map((leaveType) => ({
        startTime: actualWorkingPeriodList.at(0).startTime,
        endTime: actualWorkingPeriodList.at(-1).endTime,
        actualWorkingPeriodList,
        scheduledWorkingHours,
        effectualLeaveRequestList: [
          createLeaveRequest({
            startTime: null,
            endTime: 14 * 60,
            leaveType,
            leaveRange: LEAVE_RANGE.AM,
          }),
        ],
        isHolLegalHoliday: false,
        isLeaveOfAbsence: false,
        isApprovedAbsence: false,
        isAllowWorkDuringLeaveOfAbsence: false,
      })),
      // 午後休
      ...Object.values(LEAVE_TYPE).map((leaveType) => ({
        startTime: actualWorkingPeriodList.at(0).startTime,
        endTime: actualWorkingPeriodList.at(-1).endTime,
        actualWorkingPeriodList,
        scheduledWorkingHours,
        effectualLeaveRequestList: [
          createLeaveRequest({
            startTime: 14 * 60,
            endTime: null,
            leaveType,
            leaveRange: LEAVE_RANGE.PM,
          }),
        ],
        isHolLegalHoliday: false,
        isLeaveOfAbsence: false,
        isApprovedAbsence: false,
        isAllowWorkDuringLeaveOfAbsence: false,
      })),
      ...Object.values(LEAVE_TYPE).map((leaveType) => ({
        startTime: actualWorkingPeriodList.at(0).startTime,
        endTime: actualWorkingPeriodList.at(-1).endTime,
        actualWorkingPeriodList,
        scheduledWorkingHours,
        effectualLeaveRequestList: [
          createLeaveRequest({
            startTime: 14 * 60,
            endTime: 15 * 60,
            leaveType,
            leaveRange: LEAVE_RANGE.Time,
          }),
        ],
        isHolLegalHoliday: false,
        isLeaveOfAbsence: false,
        isApprovedAbsence: false,
        isAllowWorkDuringLeaveOfAbsence: false,
      })),
      // 全日休
      ...Object.values(LEAVE_TYPE).map((leaveType) => ({
        startTime: actualWorkingPeriodList.at(0).startTime,
        endTime: actualWorkingPeriodList.at(-1).endTime,
        actualWorkingPeriodList,
        scheduledWorkingHours,
        effectualLeaveRequestList: [
          createLeaveRequest({
            startTime: null,
            endTime: null,
            leaveType,
            leaveRange: LEAVE_RANGE.Day,
          }),
        ],
        isHolLegalHoliday: false,
        isLeaveOfAbsence: false,
        isApprovedAbsence: false,
        isAllowWorkDuringLeaveOfAbsence: false,
      })),
    ].map((props, idx) => (
      <Component
        key={idx}
        dayType={AttRecordModel.DAY_TYPE.WORKDAY}
        {...props}
      />
    ))}
  </AddGauge>
);
