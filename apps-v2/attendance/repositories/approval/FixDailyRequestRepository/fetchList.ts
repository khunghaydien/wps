import Api from '@apps/commons/api';

import {
  AttendanceSummary,
  createDividedSummaries,
  createOwnerInfos,
  createRecord,
  createSummaries,
  createWorkingType,
} from '@attendance/repositories/approval/models/AttendanceSummary';

import {
  FixDailyRequest,
  IFixDailyRequestRepository,
  Status,
} from '@attendance/domain/models/approval/FixDailyRequest';

export type Response = {
  requestList: {
    id: string;
    status: Status;
    employeeInfoList: {
      startDate: string;
      endDate: string;
      departmentName: string;
      workingTypeName: string;
    }[];
    employeeCode: string;
    employeeName: string;
    photoUrl: string;
    departmentName: string;
    delegatedEmployeeName: string;
    // comment: string;
    requestDate: string;
    targetDate: string;
    record: AttendanceSummary['records'][number];
    recordTotal: {
      restTime: number;
      realWorkTime: number;
      overTime: number;
      nightTime: number;
      lostTime: number;
      virtualWorkTime: number;
      holidayWorkTime: number;
    };
    useRestReason: boolean;
    summaries: AttendanceSummary['summaries'];
    dividedSummaries: AttendanceSummary['dividedSummaries'];
  }[];
};

const $convert = (response: Response): FixDailyRequest[] => {
  const { requestList } = response;
  return requestList.map(
    ({
      photoUrl: employeePhotoUrl,
      departmentName,
      delegatedEmployeeName,
      record,
      recordTotal,
      useRestReason,
      ...request
    }) => {
      const targetRecord = createRecord(record);
      return {
        id: request.id,
        requestDate: request.requestDate,
        targetDate: request.targetDate,
        startDate: null,
        endDate: null,
        submitter: {
          employee: {
            name: request.employeeName,
            code: request.employeeCode,
            photoUrl: employeePhotoUrl,
            department: {
              name: departmentName,
            },
          },
          delegator: {
            employee: {
              name: delegatedEmployeeName,
            },
          },
        },
        ownerInfos: createOwnerInfos(request),
        targetRecord,
        records: [targetRecord],
        recordTotal,
        useRestReason: false,
        summaries: createSummaries(request.summaries, { records: [record] }),
        dividedSummaries: createDividedSummaries(request.dividedSummaries, {
          records: [record],
        }),
        attention: {
          ineffectiveWorkingTime: 0,
          insufficientRestTime: 0,
        },
        workingType: createWorkingType({ records: [record], useRestReason }),
        dailyAllowanceRecords: null,
        dailyObjectiveEventLogRecords: null,
        dailyRestRecords: null,
        displayFieldLayout: null,
      };
    }
  );
};

const fetchList: IFixDailyRequestRepository['fetchList'] = async ({
  employeeId,
  approvalType,
}) => {
  const response: Response = await Api.invoke({
    path: '/att/request-list/fix-daily/get',
    param: {
      empId: employeeId,
      approvalType,
    },
  });
  return $convert(response);
};

export default fetchList;
