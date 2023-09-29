import STATUS, { Status } from '../approval/request/Status';
import { Task } from './Task';

export type DailyTask = {
  targetDate: string;
  status: Status;
  note: null | string;
  output: null | string;
  realWorkTime: null | number;
  isTemporaryWorkTime: boolean;
  taskList: Task[];
};

const defaultValue: DailyTask = {
  targetDate: '',
  status: STATUS.NotRequested,
  note: null,
  output: null,
  realWorkTime: null,
  isTemporaryWorkTime: false,
  taskList: [],
};

export const canEditTask = (status: Status): boolean =>
  status !== STATUS.Pending && status !== STATUS.Approved;

export default defaultValue;
