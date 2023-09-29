import React from 'react';

import isNil from 'lodash/isNil';

import { labelMapping } from '../../../../commons/constants/requestStatus';

import msg from '../../../../commons/languages';

import { AttDailyAttention } from '../../../../domain/models/attendance/AttDailyAttention';
import { ApprovalHistory } from '@apps/domain/models/approval/request/History';

import ApproveForm from '../../DetailParts/ApproveForm';
import Comment from '../../DetailParts/Comment';
import HeaderBar from '../../DetailParts/HeaderBar';
import HistoryTable from '../../DetailParts/HistoryTable';
import Attentions from './Attentions';
import RecordSummary from './RecordSummary';
import RecordTable from './RecordTable';

import './index.scss';

const ROOT = 'approvals-pc-att-monthly-process-list-pane-detail';

type Props = {
  requestId: string;
  status: string;
  employeeName: string;
  employeePhotoUrl: string;
  delegatedEmployeeName: null | string;
  requestComment: null | string;
  records: Record<string, any>[];
  attentions: Readonly<{
    [key: string]: AttDailyAttention;
  }>;
  attentionSummary: {
    ineffectiveWorkingTime: number;
    insufficientRestTime: number;
    paternityLeaveAtBirthSummary?: {
      id: string;
      startDateWorkTime: number;
      endDateWorkTime: number;
      totalWorkDays: number;
      totalWorkTime: number;
    }[];
    childCareAllowanceSummary?: {
      id: string;
      totalWorkTime: number;
    }[];
    childCareSummary?: {
      totalWorkDays: number;
    }[];
  };
  closingDate: string;
  restTimeTotal: number;
  realWorkTimeTotal: number;
  overTimeTotal: number;
  nightTimeTotal: number;
  virtualWorkTimeTotal: number;
  holidayWorkTimeTotal: number;
  lostTimeTotal: number;
  summaries: Record<string, any>[];
  historyList: ApprovalHistory[];
  userPhotoUrl: string;
  approvalComment: string;
  isExpanded: boolean;
  togglePane: () => void;
  editComment: Function;
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
    if (this.scrollable && prevProps.requestId !== this.props.requestId) {
      this.scrollable.scrollTop = 0;
    }
  }

  onClickApproveButton() {
    return this.props.approve(
      [this.props.requestId],
      this.props.approvalComment
    );
  }

  onClickRejectButton() {
    return this.props.reject(
      [this.props.requestId],
      this.props.approvalComment
    );
  }

  render() {
    // If no approval item were selected
    if (this.props.requestId === '') {
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
              value: this.props.employeeName,
              show: true,
            },
            {
              label: msg().Appr_Lbl_DelegatedApplicantName,
              value: this.props.delegatedEmployeeName || '',
              show:
                !isNil(this.props.delegatedEmployeeName) &&
                this.props.delegatedEmployeeName !== '',
            },
            {
              label: msg().Appr_Lbl_Status,
              value: formatStatus(this.props.status),
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
            value={this.props.requestComment || ''}
            employeePhotoUrl={this.props.employeePhotoUrl}
          />

          <Attentions {...this.props.attentionSummary} />

          <RecordTable
            records={this.props.records}
            attentions={this.props.attentions}
            restTimeTotal={this.props.restTimeTotal}
            realWorkTimeTotal={this.props.realWorkTimeTotal}
            overTimeTotal={this.props.overTimeTotal}
            nightTimeTotal={this.props.nightTimeTotal}
            virtualWorkTimeTotal={this.props.virtualWorkTimeTotal}
            holidayWorkTimeTotal={this.props.holidayWorkTimeTotal}
            lostTimeTotal={this.props.lostTimeTotal}
          />

          <RecordSummary
            summaries={this.props.summaries}
            closingDate={this.props.closingDate}
          />

          <HistoryTable historyList={this.props.historyList} />

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
