import isNil from 'lodash/isNil';
import { createSelector } from 'reselect';

import {
  isPermissionSatisfied,
  Permission,
} from '../../../domain/models/access-control/Permission';
import AttRecord from '../models/AttRecord';
import DailyRequestConditions from '../models/DailyRequestConditions';
import * as AttDailyRequest from '@attendance/domain/models/AttDailyRequest';
import { DailyRequestNameMap } from '@attendance/domain/models/AttDailyRequestType';
import * as AttDailyRequestType from '@attendance/domain/models/AttDailyRequestType';
import {
  buildDailyActualWorkingPeriodListFromAttRecord,
  DailyActualWorkingTimePeriod,
} from '@attendance/domain/models/DailyActualWorkingTimePeriod';
import { AttSummary } from '@attendance/domain/models/DeprecatedAttSummary';
import * as TimeRange from '@attendance/domain/models/TimeRange';

import { State as TimesheetState } from './entities/timesheet';
import { State } from './index';

const hasPermissionForEdit = ({
  isByDelegate,
  userPermission,
}: {
  isByDelegate: boolean;
  userPermission: Permission;
}): boolean =>
  isPermissionSatisfied({
    isByDelegate,
    userPermission,
    allowIfByEmployee: true,
    requireIfByDelegate: ['editAttTimeSheetByDelegate'],
  });

export const isLoading = (state: State): boolean =>
  !!state.common.app.loadingDepth;

const selectIsSummaryLocked = (state: State): boolean =>
  !isNil(state.entities.timesheet.attSummary) &&
  state.entities.timesheet.attSummary.isLocked;

export const isByDelegate = (state: State): boolean =>
  state.common.proxyEmployeeInfo.isProxyMode;

export const employeeId: (state: State) => string = createSelector(
  (state: State) => state.common.userSetting.employeeId,
  (state: State) => state.common.proxyEmployeeInfo.id,
  isByDelegate,
  (employeeId, proxyEmployeeId, isByDelegate) =>
    isByDelegate ? proxyEmployeeId : employeeId
);

const selectUserPermission = (state: State): Permission =>
  state.common.accessControl.permission;

export const isTimesheetReadOnly: (arg0: State) => boolean = createSelector(
  selectIsSummaryLocked,
  isByDelegate,
  selectUserPermission,
  (isSummaryLocked, isByDelegate, userPermission) =>
    isSummaryLocked || !hasPermissionForEdit({ isByDelegate, userPermission })
);

const selectAttSummary = (state: State): null | AttSummary =>
  (state.entities.timesheet as TimesheetState).attSummary;
const selectAttRecordList = (state: State) =>
  (state.entities.timesheet as TimesheetState).attRecordList;
const selectAttDailyRequestMap = (state: State) =>
  (state.entities.timesheet as TimesheetState).attDailyRequestMap;
const selectAttDailyRequestTypeMap = (state: State) =>
  (state.entities.timesheet as TimesheetState).attDailyRequestTypeMap;

// 実労働時間をモデルのインスタンスとして構築して、日付をキーにしたマップとして返却する
// TODO: 処理タイミングを再考したい。
// - store格納時：state上では正規化して配置されるべき？
// - AttRecordのコンストラクタ：データの更新と必ず同期するが、無駄な処理が増える懸念がある
// - AttRecordのcreateFromParamメソッド：前項に比べて処理負荷は軽減されるが、同期漏れが発生しうる
export const buildDailyActualWorkingPeriodListMap: (arg0: State) => {
  [key: string]: DailyActualWorkingTimePeriod[];
} = createSelector(
  // $FlowFixMe v0.85
  selectAttRecordList,
  (attRecordList: AttRecord[]) => {
    if (!attRecordList) {
      return {};
    }

    return attRecordList.reduce((hash, attRecord) => {
      hash[attRecord.recordDate] =
        buildDailyActualWorkingPeriodListFromAttRecord(attRecord);
      return hash;
    }, {});
  }
);

// 予定されている勤務時刻をモデルのインスタンスとして構築して、日付をキーにしたマップとして返却する
// TODO: 処理タイミングを再考したい。※詳細は同上
export const buildDailyRequestedWorkingHoursMap: (arg0: State) => {
  [key: string]: TimeRange.TimeRange;
} = createSelector(
  selectAttDailyRequestMap,
  (attDailyRequestMap: Record<string, AttDailyRequest.AttDailyRequest>) => {
    const dailyRequestedWorkingHoursMap = Object.keys(attDailyRequestMap || {})
      .map((requestId) => attDailyRequestMap[requestId])
      .filter((request) =>
        AttDailyRequest.isEffectual(
          request,
          AttDailyRequestType.CODE.HolidayWork
        )
      )
      .reduce((hash, request) => {
        hash[request.startDate] = TimeRange.convert(request);
        return hash;
      }, {});

    return dailyRequestedWorkingHoursMap;
  }
);

// 日ごとの申請の状態をモデルのインスタンスとして構築して、日付をキーにしたマップとして返却する
export const buildDailyRequestConditionMap: (arg0: State) => {
  [key: string]: DailyRequestConditions;
} = createSelector(
  selectAttSummary,
  selectAttRecordList,
  selectAttDailyRequestMap,
  selectAttDailyRequestTypeMap,
  isByDelegate,
  selectUserPermission,
  (
    attSummary: AttSummary,
    attRecordList: AttRecord[],
    attDailyRequestMap: { [key: string]: AttDailyRequest.AttDailyRequest },
    attDailyRequestTypeMap: DailyRequestNameMap,
    isByDelegate: boolean,
    userPermission: Permission
  ) => {
    if (!attRecordList) {
      return {};
    }

    return attRecordList.reduce((hash, attRecord) => {
      hash[attRecord.recordDate] = DailyRequestConditions.createFromParams(
        attRecord,
        attDailyRequestMap,
        attDailyRequestTypeMap,
        {
          isSummaryLocked: isNil(attSummary) ? false : attSummary.isLocked,
          isByDelegate,
          userPermission,
        }
      );
      return hash;
    }, {});
  }
);

// @ts-ignore Remove this line after TS migration finished
const selectTargetDate = (state: State) => state.ui.dailyRequest.targetDate;

export const selectSelectedRequestConditions: (
  arg0: State
) => DailyRequestConditions = createSelector(
  buildDailyRequestConditionMap,
  selectTargetDate,
  (
    dailyRequestConditionsMap: {
      [key: string]: DailyRequestConditions;
    },
    targetDate: string
  ) => dailyRequestConditionsMap[targetDate]
);

const editingAttRecordId = (state: State): string =>
  state.ui.dailyAttTimeDialog;

export const editingAttRecord = createSelector(
  editingAttRecordId,
  selectAttRecordList,
  (id, records) => records?.find((record) => record.id === id)
);

export const editingDailyObjectivelyEventLog = createSelector(
  editingAttRecordId,
  (state: State) => state.entities.timesheet.dailyObjectivelyEventLogs,
  (recordId, records) => records?.find((record) => record.recordId === recordId)
);

const isDailyRecordLocked = (recordId: string) =>
  createSelector(
    selectAttRecordList,
    (records) => records?.find((record) => record.id === recordId)?.isLocked
  );

export const isDailyRecordReadOnly = (
  recordId: string
): ((state: State) => boolean) =>
  createSelector(
    isTimesheetReadOnly,
    isDailyRecordLocked(recordId),
    (isSummaryLocked, isDailyRecordLocked) =>
      isSummaryLocked || isDailyRecordLocked
  );
