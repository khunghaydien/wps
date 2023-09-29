import React from 'react';

import isNil from 'lodash/isNil';

import { labelMapping } from '../../../../../commons/constants/requestStatus';

import msg from '../../../../../commons/languages';

import { FixMonthlyRequestViewModel } from '@apps/approvals-pc/models/attendance/FixMonthlyRequestViewModel';

import ApproveForm from '../../../DetailParts/ApproveForm';
import Comment from '../../../DetailParts/Comment';
import HeaderBar from '../../../DetailParts/HeaderBar';
import HistoryTable from '../../../DetailParts/HistoryTable';
import AllowanceTable from '../../particles/AllowanceTable';
import Attentions from '../../particles/Attentions';
import ObjectivelyEventLogTable from '../../particles/ObjectivelyEventLogTable';
import RestReasonTable from '../../particles/RestReasonTable';
import RecordSummary from './RecordSummary';
import RecordTable from './RecordTable';

import './index.scss';

const ROOT = 'approvals-pc-att-monthly-process-list-pane-detail';

type Props = {
  summary: FixMonthlyRequestViewModel | null;
  userPhotoUrl: string;
  approvalComment: string;
  isExpanded: boolean;
  togglePane: () => void;
  editComment: (...args: unknown[]) => void;
  reject: (arg0: string[], arg1: string) => void;
  approve: (arg0: string[], arg1: string) => void;
  onClickApproveButton: () => void;
  onClickRejectButton: () => void;
};

const formatStatus = (status) => msg()[labelMapping[status]] || status;

export default class Detail extends React.Component<Props> {
  scrollable: HTMLDivElement | null | undefined;

  constructor() {
    // @ts-ignore
    super();
    this.onClickApproveButton = this.onClickApproveButton.bind(this);
    this.onClickRejectButton = this.onClickRejectButton.bind(this);
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.scrollable &&
      prevProps.summary &&
      prevProps.summary.id !== this.props.summary.id
    ) {
      this.scrollable.scrollTop = 0;
    }
  }

  onClickApproveButton() {
    return this.props.approve(
      [this.props.summary.id],
      this.props.approvalComment
    );
  }

  onClickRejectButton() {
    return this.props.reject(
      [this.props.summary.id],
      this.props.approvalComment
    );
  }

  render() {
    // If no approval item were selected
    if (this.props.summary === null) {
      return (
        <div className={`${ROOT}`}>
          <div className={`${ROOT}__header`}>
            <HeaderBar title={msg().Appr_Lbl_Detail} />
          </div>
        </div>
      );
    }

    return (
      <div className={`${ROOT}`}>
        <HeaderBar
          title={msg().Appr_Lbl_Detail}
          meta={[
            {
              label: msg().Appr_Lbl_ApplicantName,
              value: this.props.summary.submitter.employee.name,
              show: true,
            },
            {
              label: msg().Appr_Lbl_DelegatedApplicantName,
              value: this.props.summary.submitter.delegator.employee.name || '',
              show:
                !isNil(this.props.summary.submitter.delegator.employee.name) &&
                this.props.summary.submitter.delegator.employee.name !== '',
            },
            {
              label: msg().Appr_Lbl_Status,
              value: formatStatus(this.props.summary.status),
              show: true,
            },
          ]
            .filter((m) => m.show)
            .map((m) => ({
              label: m.label,
              value: m.value,
            }))}
          onTogglePane={this.props.togglePane}
          isExpanded={this.props.isExpanded}
        />

        <div
          className={`${ROOT}__scrollable`}
          ref={(scrollable) => {
            this.scrollable = scrollable;
          }}
        >
          {/* Pass empty string instead if requestComment is null */}
          <Comment
            value={this.props.summary.comment || ''}
            employeePhotoUrl={this.props.summary.submitter.employee.photoUrl}
          />

          <Attentions {...this.props.summary.attention} />

          <RecordTable summary={this.props.summary} />

          <RecordSummary
            summaries={this.props.summary.summaries}
            dividedSummaries={this.props.summary.dividedSummaries}
          />

          {this.props.summary.dailyRestRecords ? (
            <RestReasonTable
              dailyRestRecordList={this.props.summary.dailyRestRecords}
            />
          ) : null}

          {this.props.summary.workingType.useAllowanceManagement ? (
            <AllowanceTable
              dailyAllowanceRecordList={
                this.props.summary.dailyAllowanceRecords
              }
            />
          ) : null}

          {this.props.summary.workingType.useObjectivelyEventLog ? (
            <ObjectivelyEventLogTable
              dailyObjectiveRecords={
                this.props.summary.dailyObjectiveEventLogRecords
              }
            />
          ) : null}

          <HistoryTable historyList={this.props.summary.historyList} />

          <ApproveForm
            comment={this.props.approvalComment}
            onChangeApproveComment={this.props.editComment}
            onClickRejectButton={this.onClickRejectButton}
            onClickApproveButton={this.onClickApproveButton}
            userPhotoUrl={this.props.userPhotoUrl}
          />
        </div>
      </div>
    );
  }
}
