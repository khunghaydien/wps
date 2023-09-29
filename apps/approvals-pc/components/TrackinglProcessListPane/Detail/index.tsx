import React from 'react';

import classNames from 'classnames';

import { labelMapping as statusLabelMapping } from '../../../../commons/constants/requestStatus';

import Button from '../../../../commons/components/buttons/Button';
import imgIconArrowLongRight from '../../../../commons/images/iconArrowLongRight.png';
import msg from '../../../../commons/languages';

import { DailyTrackList } from '@apps/domain/models/time-tracking/DailyTrackList';
import { TaskForSummary } from '@apps/domain/models/time-tracking/TrackRequest';

import TrackSummary from '../../../../time-tracking/TrackSummary';
import Collapse from '../../Collapse';
import HeaderBar from '../../DetailParts/HeaderBar';
import Approve from './Approve';
import HistoryTable from './HistoryTable';
import Table from './Table';

import './index.scss';

const ROOT = 'approvals-pc-tracking-process-list-pane-detail';

type Props = {
  employeeName: string;
  employeePhotoUrl: string;
  status: string;
  comment: string;
  isExpand: boolean;
  togglePane: () => void;
  dailyTrackList: DailyTrackList;
  taskList: { [id: string]: TaskForSummary };
  startDate: string;
  endDate: string;
  selectedId: string;
  historyList: Array<any>;
  userPhotoUrl: string;
  requestId: string;
  requestComment: string;
  approve: Function;
  reject: Function;
  editComment: Function;
};

export default class Detail extends React.Component<Props> {
  static defaultProps = {};

  render() {
    const btnExpandImageCssClass = classNames(
      `${ROOT}__header-btn-expand-image`,
      {
        [`${ROOT}__header-btn-expand-image--is-expand`]: this.props.isExpand,
      }
    );

    const btnExpandImageAlt = this.props.isExpand
      ? msg().Com_Btn_Contract
      : msg().Com_Btn_Expand;

    if (!this.props.selectedId) {
      return (
        <section className={ROOT}>
          <header className={`${ROOT}__header`}>
            <Button
              type="outline-default"
              className={`${ROOT}__header-btn-expand`}
              onClick={this.props.togglePane}
            >
              <img
                src={imgIconArrowLongRight}
                className={`${btnExpandImageCssClass}`}
                alt={btnExpandImageAlt}
              />
            </Button>
            <h2 className={`${ROOT}__header-body`}>{msg().Appr_Lbl_Detail}</h2>
          </header>
          <div className={`${ROOT}__scrollable`} />
        </section>
      );
    }

    const statusLabel = msg()[statusLabelMapping[this.props.status]];

    return (
      <section className={ROOT}>
        <HeaderBar
          title={msg().Appr_Lbl_Detail}
          meta={[
            {
              label: msg().Appr_Lbl_ApplicantName,
              value: this.props.employeeName,
              show: true,
            },
            /*
             * TODO 代理申請者名の表示に対応する
            {
              label: msg().Appr_Lbl_DelegatedApplicantName,
              value: this.props.delegatedEmployeeName || '',
              show:
                !isNil(this.props.delegatedEmployeeName) &&
                this.props.delegatedEmployeeName !== '',
            },
            */
            {
              label: msg().Appr_Lbl_Status,
              value: statusLabel,
              show: true,
            },
          ]}
          onTogglePane={this.props.togglePane}
          isExpanded={this.props.isExpand}
        />

        <div className={`${ROOT}__scrollable`}>
          <div className={`${ROOT}__info-area`}>
            <div className={`${ROOT}__comment`}>
              <img
                className={`${ROOT}__comment-icon`}
                src={this.props.employeePhotoUrl}
                alt=""
              />
              <p className={`${ROOT}__comment-body`}>{this.props.comment}</p>
            </div>
          </div>

          <div className={`${ROOT}__summary`}>
            <TrackSummary.Approval id={this.props.requestId} />
          </div>

          <div className={`${ROOT}__table`}>
            <Collapse title={msg().Appr_Lbl_DayDetail}>
              <Table
                dailyTrackList={this.props.dailyTrackList}
                taskList={this.props.taskList}
                startDate={this.props.startDate}
                endDate={this.props.endDate}
                isExpand={this.props.isExpand}
              />
            </Collapse>
          </div>

          <div className={`${ROOT}__history-table`}>
            <Collapse title={msg().Appr_Lbl_HistoryList}>
              <HistoryTable
                historyList={this.props.historyList}
                isEllipsis={!this.props.isExpand}
              />
            </Collapse>
          </div>

          <div className={`${ROOT}__approve`}>
            <Approve
              requestId={this.props.requestId}
              comment={this.props.requestComment}
              userPhotoUrl={this.props.userPhotoUrl}
              approve={this.props.approve}
              reject={this.props.reject}
              editComment={this.props.editComment}
            />
          </div>
        </div>
      </section>
    );
  }
}
