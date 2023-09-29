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
   * 午前半休を使用する
   */
  useAMHalfDayLeave: boolean;

  /**
   * 午後半休を使用する
   */
  usePMHalfDayLeave: boolean;

  /**
   * 半休を使用する
   */
  useHalfDayLeave: boolean;

  /**
   * 半休休暇時間
   */
  halfDayLeaveHours: number | null;

  /**
   * 半日休暇時間帯の勤務を認める
   */
  allowWorkDuringHalfDayLeave: number | null;

  /**
   * 所定休日の労働時間をフレックス対象労働時間に含める
   */
  isIncludeHolidayWorkInPlainTime: boolean;

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
     * フレックス開始時刻
     */
    flexStartTime: number | null;

    /**
     * フレックス終了時刻
     */
    flexEndTime: number | null;

    /**
     * 所定労働時間
     */
    contractedWorkHours: number | null;

    /**
     * 午前半日
     */
    amContractedWorkHours: number | null;

    /**
     * 午後半日
     */
    pmContractedWorkHours: number | null;
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

export type JPFlex = $Common &
  WorkingType &
  WorkingTime &
  Request & {
    workSystem: WorkSystemTypeMap['JP_Flex'];
  };

// eslint-disable-next-line import/prefer-default-export
export const defaultValue: JPFlex = {
  workSystem: WORK_SYSTEM_TYPE.JP_Flex,
  // $Common
  ...$commonDefaultValue,
  // WorkingType
  startOfNightWork: '1320',
  endOfNightWork: '300',
  legalWorkTypeADay: '480',
  legalWorkTypeAWeek: '2400',
  useAMHalfDayLeave: false,
  usePMHalfDayLeave: false,
  useHalfDayLeave: false,
  halfDayLeaveHours: null,
  allowWorkDuringHalfDayLeave: null,
  isIncludeHolidayWorkInPlainTime: false,
  useLegalRestCheck1: false,
  useLegalRestCheck2: false,
  legalRestCheck1WorkTimeThreshold: null,
  legalRestCheck2WorkTimeThreshold: null,
  // WorkingTime
  flexStartTime: null,
  flexEndTime: null,
  contractedWorkHours: null,
  ...restTimeDefaultValue,
  amContractedWorkHours: null,
  ...amLeaveWorkingTimesDefaultValue,
  pmContractedWorkHours: null,
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
