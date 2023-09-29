import React from 'react';

import ObjectUtil from '../../../utils/ObjectUtil';

import './Employee.scss';

const ROOT = 'commons-grid-formatters-employee';

type ValueType = {
  photoUrl: string;
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

    const photoUrl = ObjectUtil.getOrEmpty(
      this.props.value,
      keyMap ? keyMap.photoUrl : 'photoUrl'
    );
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
        {photoUrl && (
          <div className={`${ROOT}__icon-wrapper`}>
            <img className={`${ROOT}__icon`} alt="" src={photoUrl} />
          </div>
        )}

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
