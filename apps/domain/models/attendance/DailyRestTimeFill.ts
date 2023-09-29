import Api from '../../../commons/api';

// eslint-disable-next-line import/prefer-default-export
export const post = (
  params: {
    employeeId?: string | null | undefined;
    targetDate?: string | null | undefined;
  } = { employeeId: null, targetDate: null }
) => {
  return Api.invoke({
    path: '/att/daily-rest-time/fill',
    param: {
      empId: params.employeeId,
      targetDate: params.targetDate,
    },
  });
};
