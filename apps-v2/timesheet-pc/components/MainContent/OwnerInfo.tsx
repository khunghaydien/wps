import React from 'react';

import msg from '../../../commons/languages';

import { OwnerInfo as OwnerInfoModel } from '../../../domain/models/attendance/Timesheet';

import './OwnerInfo.scss';

const ROOT = 'timesheet-pc-main-content-owner-info';

type Props = Readonly<{
  ownerInfo: OwnerInfoModel;
}>;

const OwnerInfo: React.FC<Props> = ({ ownerInfo }) => {
  const departmentNameAndSeparator = ownerInfo.departmentName
    ? [
        <strong key="1" className={`${ROOT}__department-name`}>
          {ownerInfo.departmentName}
        </strong>,
        '/',
      ]
    : null;

  return (
    <div className={ROOT}>
      {departmentNameAndSeparator}
      <strong className={`${ROOT}__ownerInfo-name`}>
        {ownerInfo.employeeName}
      </strong>

      <dl className={`${ROOT}__working-type-name`}>
        <dt>{msg().Att_Lbl_WorkingType}</dt>
        <dd>
          <strong>{ownerInfo.workingTypeName}</strong>
        </dd>
      </dl>
    </div>
  );
};

export default OwnerInfo;
