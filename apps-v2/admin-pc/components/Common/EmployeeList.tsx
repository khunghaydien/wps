import React, { ReactNode as Node } from 'react';
import ReactDataGrid, { Column } from 'react-data-grid';
import Measure from 'react-measure';

import isNil from 'lodash/isNil';

import SLDSSearchIcon from '@salesforce-ux/design-system/assets/icons/utility/search.svg';

import msg from '../../../commons/languages';
import TextUtil from '../../../commons/utils/TextUtil';

import { EmployeePersonalInfo } from '../../models/common/EmployeePersonalInfo';

import './EmployeeList.scss';

const ROOT = 'admin-pc-common-employee-list';

const MessageContainer = (props: { children: Node }) => (
  <div
    className={`slds-align--absolute-center slds-grid ${ROOT}__message-container`}
  >
    {props.children}
  </div>
);

const GuideMessageView = () => (
  <MessageContainer>
    <span
      className={`slds-icon--container slds-icon-utility-search ${ROOT}__message-icon`}
    >
      <SLDSSearchIcon
        className="slds-icon slds-icon--large slds-icon-text-default"
        aria-hidden="true"
      />
    </span>
    <p className={`slds-text-color--weak ${ROOT}__message-text`}>
      {msg().Com_Msg_SearchGuideMessage}
    </p>
  </MessageContainer>
);

const EmptyRowsView = () => (
  <MessageContainer>
    <span
      className={`slds-icon--container slds-icon-utility-search ${ROOT}__message-icon`}
    >
      <SLDSSearchIcon
        className="slds-icon slds-icon--large slds-icon-text-default"
        aria-hidden="true"
      />
    </span>
    <p className={`slds-text-color--weak ${ROOT}__message-text`}>
      {msg().Com_Err_NoEmployeesFound}
    </p>
  </MessageContainer>
);

const EmployeePhotoFormatter = (props: { value: string }) => (
  <div className={`${ROOT}__emp-photo-container`}>
    <img
      role="presentation"
      src={props.value}
      width="36"
      height="36"
      className={`${ROOT}__emp-photo`}
    />
  </div>
);

const getDefaultColumnDef = (): Column<EmployeePersonalInfo>[] => [
  {
    key: 'photoUrl',
    name: '',
    width: 64,
    formatter: EmployeePhotoFormatter,
    resizable: true,
  },
  {
    key: 'name',
    name: msg().Com_Lbl_EmployeeName,
    resizable: true,
  },
  {
    key: 'code',
    name: msg().Com_Lbl_EmployeeCode,
    resizable: true,
  },
  {
    key: 'deptName',
    name: msg().Com_Lbl_DepartmentName,
    resizable: true,
  },
  {
    key: 'workingTypeName',
    name: msg().Admin_Lbl_WorkScheme,
    resizable: true,
  },
];

export type Props = {
  employees: EmployeePersonalInfo[];
  columns?: Column<EmployeePersonalInfo>[];
  limit?: number;
  isOverLimit?: boolean;
  isSearchExecuted: boolean;
  selectedEmployeeId: string;
  onClickEmployee: (arg0: string) => void;
};

export default class EmployeeList extends React.Component<Props> {
  constructor() {
    // @ts-ignore
    super();
    this.rowGetter = this.rowGetter.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
  }

  onRowClick(rowIdx: number, selectedRow: EmployeePersonalInfo) {
    if (selectedRow) {
      this.props.onClickEmployee(selectedRow.id);
    }
  }

  rowGetter(index: number) {
    return this.props.employees[index];
  }

  render() {
    const employeesCount = this.props.employees.length;

    return (
      <div
        className={`slds-grid slds-grow slds-shrink-none slds-grid--vertical ${ROOT}`}
      >
        {this.props.isSearchExecuted && employeesCount !== 0 ? (
          <p
            className={`slds-text-color--weak ${ROOT}__list-description-container`}
          >
            <span className={`${ROOT}__list-description`}>
              {TextUtil.template(
                msg().Admin_Msg_EmployeesFound,
                `${employeesCount}${this.props.isOverLimit ? `+` : ``}`
              )}
            </span>
            {this.props.isOverLimit && (
              <span className={`${ROOT}__list-is-over-limit`}>
                {TextUtil.template(
                  msg().Admin_Msg_IsOverLimit,
                  isNil(this.props.limit) ? 0 : this.props.limit
                )}
              </span>
            )}
          </p>
        ) : null}
        <Measure
          // @ts-ignore
          whitelist={['height']}
        >
          {(dimensions) => (
            <div className="slds-grow slds-shrink-none data-grid-in-flex">
              <ReactDataGrid
                columns={
                  this.props.columns !== null &&
                  this.props.columns !== undefined
                    ? this.props.columns
                    : getDefaultColumnDef()
                }
                // @ts-ignore
                minHeight={dimensions.height}
                headerRowHeight={36}
                rowsCount={employeesCount}
                rowGetter={this.rowGetter}
                rowKey="id"
                rowHeight={44}
                enableRowSelect
                rowSelection={{
                  showCheckbox: false,
                  enableShiftSelect: false,
                  selectBy: {
                    keys: {
                      rowKey: 'id',
                      values: [this.props.selectedEmployeeId],
                    },
                  },
                }}
                onRowClick={this.onRowClick}
                emptyRowsView={
                  !this.props.isSearchExecuted
                    ? GuideMessageView
                    : EmptyRowsView
                }
              />
            </div>
          )}
        </Measure>
      </div>
    );
  }
}
