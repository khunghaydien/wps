export const TASK_INPUT_MODE = {
  WORK_DURATION: 'WORK_DURATION',
  WORK_REPORT: 'WORK_REPORT',
} as const;

export type TaskInputMode =
  typeof TASK_INPUT_MODE[keyof typeof TASK_INPUT_MODE];
