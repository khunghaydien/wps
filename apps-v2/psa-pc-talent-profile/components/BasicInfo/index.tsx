import React from 'react';

import TextAreaField from '@apps/commons/components/fields/TextAreaField';
import msg from '@apps/commons/languages';

import './index.scss';

const ROOT = 'ts-psa__talent-profile__basic-info';

type Props = {
  employeeProfile: any;
  remarks: string;
  updateRemarks: (remarks: string) => void;
};

const BasicInfo = (props: Props) => {
  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}__header`}>{msg().Psa_Lbl_BasicInfo}</div>
      <div className={`${ROOT}__row`}>
        <div className={`${ROOT}__label`}>{msg().Psa_Lbl_Name}</div>
        <div className={`${ROOT}__value`}>{props.employeeProfile.empNameL}</div>
      </div>
      <div className={`${ROOT}__row`}>
        <div className={`${ROOT}__label`}>{msg().Psa_Lbl_JobTitle}</div>
        <div className={`${ROOT}__value`}>
          {props.employeeProfile.empPosition}
        </div>
      </div>
      <div className={`${ROOT}__row`}>
        <div className={`${ROOT}__label`}>{msg().Psa_Lbl_EmployeeCode}</div>
        <div className={`${ROOT}__value`}>{props.employeeProfile.empCode}</div>
      </div>
      <div className={`${ROOT}__row`}>
        <div className={`${ROOT}__label`}>{msg().Psa_Lbl_Department}</div>
        <div className={`${ROOT}__value`}>
          {props.employeeProfile.empDeptName}
        </div>
      </div>
      <div className={`${ROOT}__row`}>
        <div className={`${ROOT}__label`}>{msg().$Psa_Clbl_JobGrade}</div>
        <div className={`${ROOT}__value`}>
          {props.employeeProfile.empGrade || '-'}
        </div>
      </div>
      <div className={`${ROOT}__row`}>
        <div className={`${ROOT}__label`}>
          {msg().Psa_Lbl_CapabilityDateOfHire}
        </div>
        <div className={`${ROOT}__value`}>
          {props.employeeProfile.empHiredDate}
        </div>
      </div>
      <div className={`${ROOT}__row`}>
        <div className={`${ROOT}__label`}>{msg().Psa_Lbl_CapabilityEmail}</div>
        <div className={`${ROOT}__value`}>{props.employeeProfile.empEmail}</div>
      </div>
      <div className={`${ROOT}__row__remarks`}>
        <div className={`${ROOT}__label`}>
          {msg().Psa_Lbl_CapabilityRemarks}
        </div>
        <div className={`${ROOT}__value`}>
          <TextAreaField
            className={`${ROOT}__text-remarks`}
            value={props.remarks}
            onChange={(e) => props.updateRemarks(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
