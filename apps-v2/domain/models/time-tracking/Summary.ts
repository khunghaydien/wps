import defaultRequest, { Request } from './Request';
import { TaskSummaryRecord } from './TaskSummaryRecord';

export type SummaryFromRemote = Readonly<{
  id: string | null | undefined;
  startDate: string;
  endDate: string;
  workTime: number;
  taskSummaryRecords: ReadonlyArray<TaskSummaryRecord>;
  isLocked: boolean;
}>;

export type SummaryFromRemoteWithRequest = Readonly<{
  request: Request | null | undefined;
  summary: SummaryFromRemote;
  useRequest: boolean;
}>;

export type Summary = Readonly<
  SummaryFromRemote & {
    request: Request;
    useRequest: boolean;
  }
>;

const defaultSummary: Summary = {
  request: defaultRequest,
  id: null,
  startDate: '',
  endDate: '',
  workTime: 0,
  taskSummaryRecords: [],
  isLocked: false,
  useRequest: false,
};

export default defaultSummary;
