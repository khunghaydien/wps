import { DAY_TYPE, DayType } from '../../AttDailyRecord';

export type $Identification = {
  /**
   * ID
   */
  id: string;

  /**
   * Base ID
   */
  baseId: string;

  /**
   * Comment
   * 改定理由
   */
  comment: string;

  /**
   * Working Hours Type name (L0)
   * 勤務体系名 (L0)
   */
  /* eslint-disable camelcase */
  name_L0: string;

  /**
   * Working Hours Type name (L1)
   * 勤務体系名 (L1)
   */
  name_L1: string;

  /**
   * Working Hours Type name (L2)
   * 勤務体系名 (L2)
   */
  name_L2: string;
  /* eslint-enable camelcase */
};

export type $ValidDate = {
  /**
   * Valid Date to
   * 有効開始日
   */
  validDateFrom: string;

  /**
   * Valid Date to
   * 有効終了日
   */
  validDateTo: string;
};

export type $Weekly = {
  /**
   * Day Type at Sunday
   * 曜日種別・日
   */
  weeklyDayTypeSUN: DayType;

  /**
   * Day Type at Monday
   * 曜日種別・月
   */
  weeklyDayTypeMON: DayType;

  /**
   * Day Type at Tuesday
   * 曜日種別・火
   */
  weeklyDayTypeTUE: DayType;

  /**
   * Day Type at Wednesday
   * 曜日種別・水
   */
  weeklyDayTypeWED: DayType;

  /**
   * Day Type at Thursday
   * 曜日種別・木
   */
  weeklyDayTypeTHU: DayType;

  /**
   * Day Type at Friday
   * 曜日種別・金
   */
  weeklyDayTypeFRI: DayType;

  /**
   * Day Type at Saturday
   * 曜日種別・土
   */
  weeklyDayTypeSAT: DayType;
};

export type $Leave = {
  /**
   * List of Leave Code
   * 休暇コードリスト
   */
  leaveCodeList: string[];
};

export type $Common = $Identification & $ValidDate & $Weekly & $Leave;

// eslint-disable-next-line import/prefer-default-export
export const defaultValue: $Common = {
  id: '',
  baseId: '',
  validDateFrom: '',
  validDateTo: '',
  comment: '',
  /* eslint-disable @typescript-eslint/naming-convention */
  name_L0: '',
  name_L1: '',
  name_L2: '',
  /* eslint-enable @typescript-eslint/naming-convention */
  weeklyDayTypeSUN: DAY_TYPE.Workday,
  weeklyDayTypeMON: DAY_TYPE.Workday,
  weeklyDayTypeTUE: DAY_TYPE.Workday,
  weeklyDayTypeWED: DAY_TYPE.Workday,
  weeklyDayTypeTHU: DAY_TYPE.Workday,
  weeklyDayTypeFRI: DAY_TYPE.Workday,
  weeklyDayTypeSAT: DAY_TYPE.Workday,
  leaveCodeList: [],
};
