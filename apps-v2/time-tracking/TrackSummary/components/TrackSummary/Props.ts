import { Status } from '../../../../domain/models/approval/request/Status';

export type Task = {
  jobId: string;
  jobCode: string;
  jobName: string;
  workCategoryId: string | null | undefined;
  workCategoryCode: string | null | undefined;
  workCategoryName: string | null | undefined;
  isEditLocked: boolean;
};

export type SummaryPeriod = {
  startDate: string;
  endDate: string;
};

export type Datum = Task & {
  workTime: number;
  workTimeRatio: number;
};

export type Data = ReadonlyArray<Datum>;

export type ApprovalProps = Readonly<{
  /**
   * Records of Time Track Summary
   */
  data: Data;

  /**
   * Start date of Time Track Summary
   */
  startDate: string;

  /**
   * End date of Time Track Summary
   */
  endDate: string;
}>;

export type RequestProps = Readonly<
  ApprovalProps & {
    status: Status;
    useRequest: boolean;
    openHistoryDialog: () => void;
  }
>;

export type TransferProps = Readonly<
  ApprovalProps & {
    status: Status;
    useRequest: boolean;
    onSelect: (event: React.SyntheticEvent, task: Task) => void;
  }
>;
