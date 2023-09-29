import { WORK_SYSTEM_TYPE, WorkSystemTypeMap } from '../../WorkingType';
import { $Common, defaultValue as $commonDefaultValue } from './$Common';
import {
  $AbsentRequest,
  $DirectApplyRequest,
  $EarlyStartWorkRequest,
  $LeaveRequest,
  $LeaveRequestCompensatoryLeave,
  $LeaveRequestSubstituteLeave,
  $OvertimeWorkRequest,
  absentRequestDefaultValue,
  directApplyRequestDefaultValue,
  earlyStartWorkRequestDefaultValue,
  leaveRequestCompensatoryLeaveRequestDefaultValue,
  leaveRequestDefaultValue,
  leaveRequestSubstituteLeaveDefaultValue,
  overtimeWorkRequestDefaultValue,
} from './$Request';
import {
  $AMLeaveWorkingTimes,
  $PMLeaveWorkingTimes,
  $RestTimes,
  amLeaveWorkingTimesDefaultValue,
  pmLeaveWorkingTimesDefaultValue,
  restTimeDefaultValue,
} from './$WorkingTime';

type WorkingType = {
  /**
   * 深夜勤務開始時刻
   */
  startOfNightWork: '1320';

  /**
   * 深夜勤務終了時刻
   */
  endOfNightWork: '300';

  /**
   * １日の法定労働時間
   */
  legalWorkTypeADay: '480';

  /**
   * 	１週の法定労働時間
   */
  legalWorkTypeAWeek: '2400';

  /**
   * 所定休日の労働時間を裁量労働時間に含める
   */
  isIncludeHolidayWorkInDeemedTime: boolean;

  /**
   * 法定休憩時間チェック1を使用する
   */
  useLegalRestCheck1: boolean;

  /**
   * 法定休憩時間チェック2を使用する
   */
  useLegalRestCheck2: boolean;

  /**
   * 法定休憩時間チェック1労働時間閾値
   */
  legalRestCheck1WorkTimeThreshold: number | null;

  /**
   * 法定休憩時間チェック2労働時間閾値
   */
  legalRestCheck2WorkTimeThreshold: number | null;
};

type WorkingTime = $RestTimes &
  $AMLeaveWorkingTimes &
  $PMLeaveWorkingTimes & {
    /**
     * 始業時刻
     */
    startTime: number | null;

    /**
     * 終業時刻
     */
    endTime: number | null;

    /**
     * みなし労働時間
     */
    deemedWorkHours: number | null;

    /**
     * うち残業時間
     */
    deemedOvertimeHours: number | null;
  };

type Request = $EarlyStartWorkRequest &
  $OvertimeWorkRequest &
  $AbsentRequest &
  $LeaveRequest &
  $LeaveRequestSubstituteLeave &
  $LeaveRequestCompensatoryLeave &
  $DirectApplyRequest & {
    /**
     * 申請者本人による承認者の選択を認める
     */
    allowToChangeApproverSelf: boolean;
  };

export type JPDiscretion = $Common &
  WorkingType &
  WorkingTime &
  Request & {
    workSystem: WorkSystemTypeMap['JP_Discretion'];
  };

// eslint-disable-next-line import/prefer-default-export
export const defaultValue: JPDiscretion = {
  workSystem: WORK_SYSTEM_TYPE.JP_Discretion,
  // $Common
  ...$commonDefaultValue,
  // WorkingType
  startOfNightWork: '1320',
  endOfNightWork: '300',
  legalWorkTypeADay: '480',
  legalWorkTypeAWeek: '2400',
  isIncludeHolidayWorkInDeemedTime: false,
  useLegalRestCheck1: false,
  useLegalRestCheck2: false,
  legalRestCheck1WorkTimeThreshold: null,
  legalRestCheck2WorkTimeThreshold: null,
  // WorkingTime
  startTime: null,
  endTime: null,
  deemedWorkHours: null,
  deemedOvertimeHours: null,
  ...restTimeDefaultValue,
  ...amLeaveWorkingTimesDefaultValue,
  ...pmLeaveWorkingTimesDefaultValue,
  // Request
  allowToChangeApproverSelf: false,
  ...earlyStartWorkRequestDefaultValue,
  ...overtimeWorkRequestDefaultValue,
  ...absentRequestDefaultValue,
  ...leaveRequestDefaultValue,
  ...leaveRequestSubstituteLeaveDefaultValue,
  ...leaveRequestCompensatoryLeaveRequestDefaultValue,
  ...directApplyRequestDefaultValue,
};
