import Api from '@apps/commons/api';

export type JobType = 'ProjectFinance' | 'Expense';

export const JOB_TYPE = {
  ProjectFinance: 'ProjectFinance',
  Expense: 'Expense',
};

export type runBatchJobProjectParam = {
  projectId: string;
  jobType: JobType;
};

export const runBatchJobProject = (
  param: runBatchJobProjectParam
): Promise<any> => {
  return Api.invoke({
    path: '/psa/batchjob/project/run',
    param,
  })
    .then((response: any) => response)
    .catch((err) => {
      throw err;
    });
};
