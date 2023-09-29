import { WORK_SYSTEM_TYPE, WorkSystemTypeMap } from '../../WorkingType';
import { $Common, defaultValue as $commonDefaultValue } from './$Common';
import {
  $AbsentRequest,
  $DirectApplyRequest,
  $EarlyStartWorkRequest,
  $LeaveRequest,
  $LeaveRequestSubstituteLeave,
  $OvertimeWorkRequest,
  absentRequestDefaultValue,
  directApplyRequestDefaultValue,
  earlyStartWorkRequestDefaultValue,
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
     * 労働時間の目安
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
  $DirectApplyRequest & {
    /**
     * 申請者本人による承認者の選択を認める
     */
    allowToChangeApproverSelf: boolean;
  };

export type JPManager = $Common &
  WorkingType &
  WorkingTime &
  Request & {
    workSystem: WorkSystemTypeMap['JP_Manager'];
  };

// eslint-disable-next-line import/prefer-default-export
export const defaultValue: JPManager = {
  workSystem: WORK_SYSTEM_TYPE.JP_Manager,
  // $Common
  ...$commonDefaultValue,
  // WorkingType
  startOfNightWork: '1320',
  endOfNightWork: '300',
  legalWorkTypeADay: '480',
  legalWorkTypeAWeek: '2400',
  // WorkingTime
  startTime: null,
  endTime: null,
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
  ...directApplyRequestDefaultValue,
};
