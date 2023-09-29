export type TaskSummaryRecord = {
  jobId: string;
  jobCode: string;
  jobName: string;
  workCategoryId: string | null | undefined;
  workCategoryCode: string | null | undefined;
  workCategoryName: string | null | undefined;
  workTimeRatio: number;
  workTime: number;
  isEditLocked: boolean;
};
