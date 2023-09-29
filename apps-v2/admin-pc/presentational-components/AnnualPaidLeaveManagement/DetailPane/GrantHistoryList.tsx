import React from 'react';
import ReactDataGrid from 'react-data-grid';

import Button from '../../../../commons/components/buttons/Button';
import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';
import DurationUtil from '../../../../commons/utils/DurationUtil';

import { GrantHistoryRecord } from '../../../models/leave-management/types';

import { AppDispatch } from '../../../action-dispatchers/AppThunk';

import './GrantHistoryList.scss';

const ROOT = 'admin-pc-annual-paid-leave-management-grant-history-list';

const DateFormatter = (props: { value: string }) => (
  <span>{DateUtil.formatYMD(props.value)}</span>
);

const DaysFormatter = (props: { value: number; row: GrantHistoryRecord }) => {
  if (props.row && props.row.hoursGranted > 0) {
    return (
      <span>
        {DurationUtil.formatDaysAndHoursWithUnit(
          props.row.daysGranted,
          props.row.hoursGranted
        )}
      </span>
    );
  }
  return <span>{DurationUtil.formatDaysWithUnit(props.value)}</span>;
};

const DaysAndHoursFormatter = (props: {
  value: { daysLeft: number; hoursLeft: number };
}) => (
  <span>
    {DurationUtil.formatDaysAndHoursWithUnit(
      props.value.daysLeft,
      props.value.hoursLeft
    )}
  </span>
);

class ButtonGroupFormatter extends React.Component<{
  targetGrantHistoryRecordId: string;
  onClickUpdateButton: (arg0: string) => void;
  onClickFractionGrantButton: (arg0: string) => void;
  rowValue: GrantHistoryRecord;
}> {
  constructor() {
    // @ts-ignore
    super();
    this.onClickUpdateButton = this.onClickUpdateButton.bind(this);
    this.onClickFractionGrantButton =
      this.onClickFractionGrantButton.bind(this);
  }

  onClickUpdateButton(_value: string) {
    this.props.onClickUpdateButton(this.props.targetGrantHistoryRecordId);
  }

  onClickFractionGrantButton() {
    this.props.onClickFractionGrantButton(
      this.props.targetGrantHistoryRecordId
    );
  }

  render() {
    return (
      <div className="slds-clearfix">
        <div className="slds-float--right">
          <Button
            type="default"
            className={`${ROOT}__update-button`}
            onClick={this.onClickUpdateButton}
          >
            {msg().Com_Lbl_Arrangement}
          </Button>
        </div>
        {(!Number.isInteger(this.props.rowValue.daysLeft) ||
          this.props.rowValue.hoursLeft > 0) &&
        this.props.rowValue.daysGranted >= 1 ? (
          <div className={`slds-float--right ${ROOT}__fraction-grant-div `}>
            <Button
              type="default"
              className={`${ROOT}__fraction-grant-button`}
              onClick={this.onClickFractionGrantButton}
            >
              {msg().Admin_Lbl_FractionGrant}
            </Button>
          </div>
        ) : null}
      </div>
    );
  }
}

const EmptyRowsView = () => (
  <div className={`slds-align--absolute-center ${ROOT}__empty-rows-view`}>
    {msg().Admin_Msg_AnnualPaidLeaveGrantHistoryListEmptyRowsViewMessage}
  </div>
);

export type Props = {
  dispatch: AppDispatch;
  grantHistoryList: GrantHistoryRecord[];
  onClickUpdateButton: (arg0: string) => void;
  onClickFractionGrantButton: (arg0: string) => void;
};

export default class GrantHistoryList extends React.Component<Props> {
  constructor() {
    // @ts-ignore
    super();
    this.rowGetter = this.rowGetter.bind(this);
    this.buttonGroupFormatter = this.buttonGroupFormatter.bind(this);
  }

  rowGetter(index: number) {
    const grantHistory = this.props.grantHistoryList[index];
    if (grantHistory) {
      return {
        ...grantHistory,
        daysAndHoursLeft: {
          daysLeft: grantHistory.daysLeft,
          hoursLeft: grantHistory.hoursLeft,
        },
      };
    }
  }

  // Linter warns targetGrantedHistoryRecordId is unused,
  // even though it's clearly used. It may be a bug.

  /* eslint-disable react/no-unused-prop-types */
  buttonGroupFormatter(props: { value: string; row: GrantHistoryRecord }) {
    return (
      <ButtonGroupFormatter
        // @ts-ignore
        dispatch={this.props.dispatch}
        onClickUpdateButton={this.props.onClickUpdateButton}
        onClickFractionGrantButton={this.props.onClickFractionGrantButton}
        targetGrantHistoryRecordId={props.value}
        rowValue={props.row}
      />
    );
  }

  /* eslint-enable react/no-unused-prop-types */

  render() {
    return (
      <section className={ROOT}>
        <header>
          <h3 className={`${ROOT}__title`}>
            {msg().Admin_Lbl_AnnualPaidLeaveGrantHistoryOfValid}
          </h3>
        </header>
        <div className="data-grid">
          <ReactDataGrid
            columns={[
              {
                key: 'validDateFrom',
                name: msg().Admin_Lbl_LeaveGrantValidDateFrom,
                formatter: DateFormatter,
                resizable: true,
              },
              {
                key: 'validDateTo',
                name: msg().Admin_Lbl_LeaveGrantValidDateTo,
                formatter: DateFormatter,
                resizable: true,
              },
              {
                key: 'daysGranted',
                name: msg().Admin_Lbl_LeaveDaysGranted,
                formatter: DaysFormatter,
                resizable: true,
              },
              {
                key: 'daysAndHoursLeft',
                name: msg().Admin_Lbl_LeaveDaysLeft,
                formatter: DaysAndHoursFormatter,
                resizable: true,
              },
              {
                key: 'comment',
                name: msg().Admin_Lbl_Comment,
                resizable: true,
              },
              {
                key: 'id',
                name: '',
                formatter: this.buttonGroupFormatter,
                resizable: true,
                width: 215,
              },
            ]}
            headerRowHeight={36}
            rowsCount={this.props.grantHistoryList.length}
            rowGetter={this.rowGetter}
            rowKey="id"
            rowHeight={44}
            emptyRowsView={EmptyRowsView}
          />
        </div>
      </section>
    );
  }
}
