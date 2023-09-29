import React from 'react';

import msg from '@commons/languages';
import DateUtil from '@commons/utils/DateUtil';

import { CustomRequest } from '@apps/domain/models/customRequest/types';

import Person from '@mobile/components/atoms/Person';

import './ReportCustomRequest.scss';

const ROOT = 'mobile-app-molecules-approval-custom-request-report-summary';

export type Props = Readonly<{
  report: CustomRequest;
}>;

const ReportCustomRequest = ({ report }: Props) => {
  const {
    DepartmentName__c: departmentName,
    recordTypeName,
    RequestTime__c: requestTime,
    submitterName,
    submitterPhotoUrl,
  } = report;
  return (
    <div className={ROOT}>
      <Person
        className={`${ROOT}__person`}
        src={submitterPhotoUrl}
        alt={submitterName}
      />
      <div className={`${ROOT}__detail`}>
        <div className={`${ROOT}__record-type`}>{recordTypeName}</div>
        <div className={`${ROOT}__name`}>{submitterName}</div>
        <div className={`${ROOT}__department`}>{departmentName}</div>
        <div className={`${ROOT}__bottom`}>
          <div className={`${ROOT}__bottom__date`}>
            <div className={`${ROOT}__bottom__date-title`}>
              {msg().Appr_Lbl_DateSubmitted}
            </div>
            {DateUtil.formatYMD(requestTime)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCustomRequest;
