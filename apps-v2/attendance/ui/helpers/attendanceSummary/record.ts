import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import TimeUtil from '@apps/commons/utils/TimeUtil';

import { DAY_TYPE, DayType } from '@attendance/domain/models/AttDailyRecord';
import {
  COMMUTE_STATE,
  CommuteState,
} from '@attendance/domain/models/CommuteCount';

export const date = (dateString: string, mdw = false): string =>
  DateUtil.getDate(dateString) === 1 || mdw === true
    ? DateUtil.formatMDW(dateString)
    : DateUtil.formatDW(dateString);

const dayTypeTranslations: {
  [name: string]: keyof ReturnType<typeof msg>;
} = {
  [DAY_TYPE.Workday]: 'Att_Lbl_Workday',
  [DAY_TYPE.Holiday]: 'Att_Lbl_Holiday',
  [DAY_TYPE.PreferredLegalHoliday]: 'Att_Lbl_PreferredLegalHoliday',
  [DAY_TYPE.LegalHoliday]: 'Att_Lbl_LegalHoliday',
} as const;

export const dayType = (dayType: DayType): string => {
  const msgId = dayTypeTranslations[dayType];
  return msgId ? msg()[msgId] : '';
};

export const duration = (durationInMinutes: number | null): string => {
  return durationInMinutes !== null ? TimeUtil.toHHmm(durationInMinutes) : '';
};

export const time = (timeInMinutes: number | null): string => {
  return timeInMinutes !== null ? TimeUtil.toHHmm(timeInMinutes) : '';
};

export const durationTotal = (totalInMinutes: number | null): string => {
  return TimeUtil.toHHmm(totalInMinutes || 0);
};

const commuteCountTranslations: {
  [K in CommuteState]: keyof ReturnType<typeof msg>;
} = {
  [COMMUTE_STATE.UNENTERED]: 'Att_Lbl_CommuteCountUnentered',
  [COMMUTE_STATE.NONE]: 'Att_Lbl_CommuteCountNone',
  [COMMUTE_STATE.BOTH_WAYS]: 'Att_Lbl_CommuteCountBothWays',
  [COMMUTE_STATE.FORWARD]: 'Att_Lbl_CommuteCountForward',
  [COMMUTE_STATE.BACKWARD]: 'Att_Lbl_CommuteCountBackward',
} as const;

export const commuteState = (state: CommuteState): string => {
  const msgId = commuteCountTranslations[state];
  return msgId ? msg()[msgId] : '';
};
