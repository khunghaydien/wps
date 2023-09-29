/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { useSelector } from 'react-redux';

import { get, isEmpty } from 'lodash';

import { subRoleOptionCreator } from '@commons/components/exp/SubRole/subRoleOptionCreator';
import EditIcon from '@commons/images-pre-optimized/icons/edit.svg';

import './SubRoleInfo.scss';

type Props = {
  subroleEditable?: boolean;
  onClick: () => void;
};

const ROOT = 'sub-role-info';
const SubRoleInfo = (props: Props): React.ReactElement => {
  const { subroleEditable } = props;
  const selectedRole = useSelector(
    (state: any) => state.ui.expenses.subrole.selectedRole
  );
  const employeeDetails = useSelector(
    (state: any) => state.common.exp.entities.employeeDetails
  );
  const companies = useSelector(
    (state: any) => state.common.exp.entities.companyDetails
  );

  let displayDetails;
  if (employeeDetails && !isEmpty(employeeDetails.details)) {
    const record = employeeDetails.details.find((h) => h.id === selectedRole);
    if (record)
      displayDetails = subRoleOptionCreator(record, companies, record.primary);
  }

  const { onClick } = props;
  return (
    <div className={ROOT} onClick={subroleEditable ? onClick : undefined}>
      <div className={`${ROOT}-info-inner`}>
        <p className={`${ROOT}-info-label`}>
          {get(displayDetails, 'label', '')}
          {subroleEditable && <EditIcon />}
        </p>
      </div>
    </div>
  );
};

export default SubRoleInfo;
