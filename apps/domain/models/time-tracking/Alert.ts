import isNil from 'lodash/isNil';

/**
 * @NOTE
 * Alert is used in only time tracking currently. If you will need Alert model,
 * then please consider to move Alert under a proper domain.
 */
type AlertCodeType = 'TIME_ATT_CONSISTENCY';

export const AlertCode: {
  [key: string]: AlertCodeType;
} = {
  TimeAttConsistency: 'TIME_ATT_CONSISTENCY',
};

type AlertLevelType = 'Warn';

export const AlertLevel: {
  [key: string]: AlertLevelType;
} = {
  Warn: 'Warn',
};

export type Alert = {
  code: typeof AlertCode[keyof typeof AlertCode];
  level: typeof AlertLevel[keyof typeof AlertLevel];
};

export type Alerts = {
  [date: string]: ReadonlyArray<Alert>;
};

export const defaultValue = {};

export const isConsistentWithAttTime = (
  alerts: ReadonlyArray<Alert> = [],
  totalTaskTime: number | null | undefined,
  workTime: number | null | undefined
): boolean => {
  const timeAttConsistencyAlerts = alerts
    .filter((alert) => alert.code === AlertCode.TimeAttConsistency)
    .filter((alert) => alert.level === AlertLevel.Warn);
  if (timeAttConsistencyAlerts.length === 0) {
    return true;
  }

  const isEmptyTotalTaskTime = !isNil(workTime) && isNil(totalTaskTime);
  const isEmptyWorkTime = isNil(workTime) && !isNil(totalTaskTime);
  const isMismatchedTotalTaskTimeWithWorkTime =
    !isNil(workTime) && !isNil(totalTaskTime) && workTime !== totalTaskTime;

  return (
    !isEmptyTotalTaskTime &&
    !isEmptyWorkTime &&
    !isMismatchedTotalTaskTimeWithWorkTime
  );
};
