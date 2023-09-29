import React from 'react';

import MultiColumnsGrid from '@apps/commons/components/MultiColumnsGrid';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';

import { Report } from '@apps/domain/models/exp/Report';
import { UserSetting } from '@apps/domain/models/UserSetting';

import './index.scss';

export type Props = {
  report: Report;
  userSetting: UserSetting;
};

const ROOT = 'expenses-pc-print-print-report-applicant';

const Applicant = ({ report, userSetting }: Props) => {
  const { reportNo, requestDate, departmentName, departmentCode } = report;
  const { employeeName, employeeCode } = userSetting;

  return (
    <div className={ROOT}>
      <MultiColumnsGrid sizeList={[3, 3, 3, 3]}>
        <div className={`${ROOT}__column`}>
          <div className={`${ROOT}__label`}>{msg().Com_Lbl_Employee}</div>
          <div className={`${ROOT}__value`}>{employeeName}</div>
          <div className={`${ROOT}__code`}>{employeeCode}</div>
        </div>
        <div className={`${ROOT}__column`}>
          <div className={`${ROOT}__label`}>{msg().Exp_Lbl_Department}</div>
          <div className={`${ROOT}__value`}>{departmentName}</div>
          <div className={`${ROOT}__code`}>{departmentCode}</div>
        </div>
        <div className={`${ROOT}__column`}>
          <div className={`${ROOT}__label`}>{msg().Exp_Lbl_ReportNo}</div>
          <div className={`${ROOT}__value`}>{reportNo || ''}</div>
        </div>
        <div className={`${ROOT}__column`}>
          <div className={`${ROOT}__label`}>{msg().Exp_Lbl_RequestDate}</div>
          <div className={`${ROOT}__value`}>
            {requestDate ? DateUtil.dateFormat(requestDate) : ''}
          </div>
        </div>
      </MultiColumnsGrid>
    </div>
  );
};

export default Applicant;
