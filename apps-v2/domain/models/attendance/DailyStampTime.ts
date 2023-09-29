import Api from '../../../commons/api';

export const CLOCK_TYPE = {
  CLOCK_IN: 'CLOCK_IN',
  CLOCK_OUT: 'CLOCK_OUT',
  CLOCK_REIN: 'CLOCK_REIN',
} as const;

export type ClockType = typeof CLOCK_TYPE[keyof typeof CLOCK_TYPE];

export const STAMP_ACTION = {
  IN: 'in',
  OUT: 'out',
  REIN: 'rein',
} as const;

export type StampAction = typeof STAMP_ACTION[keyof typeof STAMP_ACTION];

export const STAMP_SOURCE = {
  WEB: 'web',
  MOBILE: 'mobile',
} as const;

export type StampSource = typeof STAMP_SOURCE[keyof typeof STAMP_SOURCE];

export type DailyStampTime = {
  isEnableStartStamp: boolean;
  isEnableEndStamp: boolean;
  isEnableRestartStamp: boolean;
  defaultAction: StampAction | null | undefined;
  commuteForwardCount: number;
  commuteBackwardCount: number;
};

export type EditingDailyStampTime = {
  isEnableStartStamp: boolean;
  isEnableEndStamp: boolean;
  isEnableRestartStamp: boolean;
  mode: ClockType | null | undefined;
  message: string;
};

export type DailyStampTimeResult = {
  insufficientRestTime: number | null | undefined;
};

type FromRemote = {
  isEnableStartStamp: boolean;
  isEnableEndStamp: boolean;
  isEnableRestartStamp: boolean;
  defaultAction: StampAction | null | undefined;
  commuteForwardCount: number;
  commuteBackwardCount: number;
};

const convertFromRemote = (fromRemote: FromRemote) => ({
  isEnableStartStamp: fromRemote.isEnableStartStamp,
  isEnableEndStamp: fromRemote.isEnableEndStamp,
  isEnableRestartStamp: fromRemote.isEnableRestartStamp,
  defaultAction: fromRemote.defaultAction,
  commuteForwardCount: fromRemote.commuteForwardCount,
  commuteBackwardCount: fromRemote.commuteBackwardCount,
});

export const fetchDailyStampTime = (
  employeeId: string | null | undefined = null
): Promise<DailyStampTime> =>
  Api.invoke({
    path: '/att/daily-time/get',
    param: {
      empId: employeeId,
    },
  }).then((response: FromRemote) => convertFromRemote(response));

export type PostStampRequest = {
  mode: ClockType;
  comment?: string | null | undefined;
  latitude?: number;
  longitude?: number;
  commuteForwardCount?: number;
  commuteBackwardCount?: number;
};

export const postStamp = (
  stampWidget: PostStampRequest,
  source: StampSource,
  useManageCommuteCount?: boolean
): Promise<DailyStampTimeResult> => {
  const CLOCK_TYPE_MAP = {
    [CLOCK_TYPE.CLOCK_IN]: STAMP_ACTION.IN,
    [CLOCK_TYPE.CLOCK_OUT]: STAMP_ACTION.OUT,
    [CLOCK_TYPE.CLOCK_REIN]: STAMP_ACTION.REIN,
  };
  const req = {
    path: '/att/daily-time/stamp',
    param: {
      clockType: CLOCK_TYPE_MAP[stampWidget.mode],
      comment: stampWidget.comment,
      latitude:
        stampWidget.latitude !== null && stampWidget.latitude !== undefined
          ? stampWidget.latitude
          : null,
      longitude:
        stampWidget.longitude !== null && stampWidget.longitude !== undefined
          ? stampWidget.longitude
          : null,
      source,
      ...(useManageCommuteCount
        ? {
            commuteForwardCount: stampWidget.commuteForwardCount,
            commuteBackwardCount: stampWidget.commuteBackwardCount,
          }
        : {}),
    },
  };
  return Api.invoke(req);
};
