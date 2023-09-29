import Api from '../../../commons/api';

import { Status as RequestStatus } from '../approval/request/Status';
import {
  convertDailyTrackList,
  DailyTrackList,
  FromRemote as DailyTrackListFromRemote,
} from './DailyTrackList';
import { Period } from './Period';

type FromRemote = DailyTrackListFromRemote & {
  requestId: string;
  startDate: string;
  endDate: string;
  status: RequestStatus;
  periods: Period[]; // 日付順(降順)
};

export type MonthlyTrack = {
  requestId: string;
  dailyTrackList: DailyTrackList;
  overview: {
    startDate: string;
    endDate: string;
    status: RequestStatus;
  };
};

const convertOverView = (result: FromRemote) => {
  return {
    startDate: result.startDate,
    endDate: result.endDate,
    status: result.status,
  };
};

export const fetch = (targetDate: string): Promise<MonthlyTrack> => {
  return Api.invoke({
    path: '/time-track/monthly/get',
    param: { targetDate },
  }).then((res) => {
    const dailyTrackList = convertDailyTrackList(res);
    const overview = convertOverView(res);

    return {
      dailyTrackList,
      overview,
      periods: res.periods,
      requestId: res.requestId || '',
    };
  });
};

export default { fetch };
