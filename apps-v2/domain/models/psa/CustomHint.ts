import Api from '../../../commons/api';

// Custom Hint
export type CustomHint = {
  title?: string;
  code?: string;
  duration?: string;
  moduleType?: string;
  workHoursPerDay?: string;
  targetMargin?: string;
  status?: string;
  resourceGroup?: string;
  projectWorkingDays?: string;
  projectManager?: string;
  projectDepartment?: string;
  projectCheckFrequency?: string;
  planningCycle?: string;
  opportunity?: string;
  firstCheckDate?: string;
  description?: string;
  contractType?: string;
  contractAmount?: string;
  client?: string;
  calendar?: string;
};

// eslint-disable-next-line import/prefer-default-export
export const getCustomHint = (
  companyId: string,
  moduleType: string
): Promise<CustomHint> => {
  return Api.invoke({
    path: '/custom-hint/get',
    param: { companyId, moduleType },
  });
};
