import React from 'react';

import ObjectUtil from '@commons/utils/ObjectUtil';

import './Employee.scss';

const ROOT = 'approvals-pc-attendance-particles-grid-formatters-employee';

type ValueType = {
  employeeName: string;
  departmentName: string;
};

type Props = {
  value: ValueType;
  keyMap?: ValueType;
};

export default class Employee extends React.Component<Props> {
  render() {
    const { keyMap } = this.props;

    const employeeName = ObjectUtil.getOrEmpty(
      this.props.value,
      keyMap ? keyMap.employeeName : 'employeeName'
    );
    const departmentName = ObjectUtil.getOrEmpty(
      this.props.value,
      keyMap ? keyMap.departmentName : 'departmentName'
    );

    return (
      <div className={`${ROOT}`}>
        <div className={`${ROOT}__name`}>
          <div>{employeeName}</div>
          <div className={`${ROOT}__cell-name-department`}>
            {departmentName}
          </div>
        </div>
      </div>
    );
  }
}
