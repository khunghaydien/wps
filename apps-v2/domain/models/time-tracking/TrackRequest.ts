import Api from '../../../commons/api';
import ObjectUtil from '../../../commons/utils/ObjectUtil';
import { convertSummaryTask } from '../../../commons/utils/TaskListUtil';

import { ApprovalHistory } from '../approval/request/History';
import { Status as RequestStatus } from '../approval/request/Status';
import {
  convertDailyTrackList,
  DailyTrackList,
  FromRemote as DailyTrackListFromRemote,
} from './DailyTrackList';

type FromRemote = DailyTrackListFromRemote & {
  requestId: string;
  startDate: string;
  endDate: string;
  status: RequestStatus;
  comment: string | null | undefined;
  employeeName: string;
  employeePhotoUrl: string;
  historyList: ApprovalHistory[];
};

export type TaskForSummary = {
  id: string;
  jobId: string;
  jobName: string;
  workCategoryId: string | null | undefined;
  workCategoryName: string | null | undefined;
  taskTimeSum: number;
  barColor: string;
  graphRatio: number;
};

export type TrackRequest = {
  requestId: string;
  status: string;
  startDate: string;
  endDate: string;
  comment: string;
  employeeName: string;
  employeePhotoUrl: string;
  dailyList: DailyTrackList;
  taskList: {
    [id: string]: TaskForSummary;
  };
  summaryTaskAllIds: string[];
};

export const fetch = (requestId: string): Promise<TrackRequest> => {
  const req = {
    path: '/time-track/request/record/get',
    param: { requestId },
  };
  return Api.invoke(req).then((res: FromRemote) => {
    const dailyList = convertDailyTrackList(res);
    return {
      employeeName: res.employeeName,
      employeePhotoUrl: res.employeePhotoUrl,
      status: res.status,
      startDate: res.startDate,
      endDate: res.endDate,
      comment: ObjectUtil.getOrEmpty(res, 'comment'),
      requestId: res.requestId || '',
      historyList: res.historyList,
      dailyList,
      ...convertSummaryTask(dailyList),
    };
  });
};

export default { fetch };
