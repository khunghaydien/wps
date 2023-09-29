import { TaskSummaryRecord } from './TaskSummaryRecord';

export type RequestSummary = Readonly<{
  summaryId: string | null | undefined;
  startDate: string;
  endDate: string;
  workTime: number;
  taskSummaryRecords: ReadonlyArray<TaskSummaryRecord>;
}>;

const defaultSummary: RequestSummary = {
  summaryId: null,
  startDate: '',
  endDate: '',
  workTime: 0,
  taskSummaryRecords: [],
};

export default defaultSummary;
