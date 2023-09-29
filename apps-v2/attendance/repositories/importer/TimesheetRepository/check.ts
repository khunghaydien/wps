import Api from '@apps/commons/api';

import { ITimesheetRepository } from '@attendance/domain/models/importer/Timesheet';

type Result = PromiseType<ReturnType<ITimesheetRepository['check']>>;

type Response = {
  errorList: {
    errorDate: string;
    errorMessage: string;
  }[];
};

export default ((param) =>
  Api.invoke({
    path: '/att/timesheet-import/check',
    param: {
      empId: param.employeeId,
      startDate: param.startDate,
      endDate: param.endDate,
    },
  }).then((response: Response) =>
    response?.errorList?.reduce((map, { errorDate, errorMessage }) => {
      map.set(errorDate, [errorMessage]);
      return map;
    }, new Map() as Result)
  )) as ITimesheetRepository['check'];
