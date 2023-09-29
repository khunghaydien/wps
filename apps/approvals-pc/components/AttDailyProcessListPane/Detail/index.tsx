import React from 'react';

import isNil from 'lodash/isNil';

import HorizontalLayout from '../../../../commons/components/fields/layouts/HorizontalLayout';
import iconStatusMetaReapplying from '../../../../commons/images/iconStatusMetaReapplying.png';
import msg from '../../../../commons/languages';

import {
  ArrayLabel,
  Label,
} from '../../../../domain/models/approval/AttDailyDetail/Base';
import { ApprovalHistoryList } from '../../../../domain/models/approval/request/History';
import STATUS, {
  Status,
} from '../../../../domain/models/approval/request/Status';

import ApproveForm from '../../DetailParts/ApproveForm';
import Comparison from '../../DetailParts/Comparison';
import HeaderBar from '../../DetailParts/HeaderBar';
import HistoryTable from '../../DetailParts/HistoryTable';

import './index.scss';

const ROOT = 'approvals-pc-att-daily-process-list-pane-detail';

/**
 * Props
 */
type AttDailyDetail = {
  id: string; // 申請ID
  statusLabel: string; // 申請ステータス（表示用）
  originalRequestStatus: Status; // 元の申請の申請ステータス
  employeeName: string; // 申請者名
  employeePhotoUrl: string; // 申請者顔写真URL
  delegatedEmployeeName?: string;
  approveComment: string; // 承認者のコメント
  requestComment: string;
  userPhotoUrl: string; // 承認者顔写真URL
  detailList: ArrayLabel; // 承認申請の詳細の一覧
} & ApprovalHistoryList;

type ContentProps = AttDailyDetail & {
  isExpanded: boolean;
  togglePane: () => void;
  editComment: (arg0: string) => void;
  onClickRejectButton: () => void;
  onClickApproveButton: () => void;
};

type Props = ContentProps;

/**
 * 日次勤怠申請詳細
 *
 * 申請ごとに表示する項目についてはModulesのselectorでタイプごとに生成している
 * このコンポーネントでは受け取った値を表示するだけ
 */
export default class Detail extends React.Component<Props> {
  scrollable: HTMLDivElement | null | undefined;

  static defaultProps = {
    id: '',
    detailList: [],
    historyList: [],
  };

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.scrollable && this.props.id !== nextProps.id) {
      this.scrollable.scrollTop = 0;
    }
  }

  renderNotification() {
    if (this.props.id === '') {
      return null;
    }

    const props: ContentProps = this.props;

    switch (props.originalRequestStatus) {
      case STATUS.Reapplying:
        return (
          <div className={`${ROOT}__notification`}>
            <div className={`${ROOT}__notification-icon`}>
              <img src={iconStatusMetaReapplying} />
            </div>
            <div className={`${ROOT}__notification-text`}>
              {msg().Appr_Lbl_NotificationReapply}
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  renderDetailListItem(addon: Label) {
    return (
      <li key={addon.label} className={`${ROOT}__list-detail-item`}>
        <HorizontalLayout>
          <HorizontalLayout.Label cols={3}>
            {addon.label}
          </HorizontalLayout.Label>

          <HorizontalLayout.Body className={`${ROOT}__pre-wrap`} cols={9}>
            {addon.valueType ? (
              <Comparison
                new={addon.value.toString()}
                old={
                  addon.originalValue !== undefined &&
                  addon.originalValue !== null
                    ? addon.originalValue.toString()
                    : ''
                }
                type={addon.valueType || 'date'}
              />
            ) : (
              addon.value
            )}
          </HorizontalLayout.Body>
        </HorizontalLayout>
      </li>
    );
  }

  renderHeaderOnly() {
    return (
      <div className={`${ROOT}`}>
        <HeaderBar title={msg().Appr_Lbl_Detail} />
      </div>
    );
  }

  render() {
    if (this.props.id === '') {
      return this.renderHeaderOnly();
    }

    const props: ContentProps = this.props;

    return (
      <div className={`${ROOT}`}>
        <HeaderBar
          title={msg().Appr_Lbl_Detail}
          meta={[
            {
              label: msg().Appr_Lbl_ApplicantName,
              value: props.employeeName,
              show: true,
            },
            {
              label: msg().Appr_Lbl_DelegatedApplicantName,
              value: props.delegatedEmployeeName || '',
              show:
                !isNil(props.delegatedEmployeeName) &&
                props.delegatedEmployeeName !== '',
            },
            {
              label: msg().Appr_Lbl_Status,
              value: props.statusLabel,
              show: true,
            },
          ]
            .filter((m) => m.show)
            .map((m) => ({
              label: m.label,
              value: m.value,
            }))}
          isExpanded={props.isExpanded}
          onTogglePane={props.togglePane}
        />

        <div
          className={`${ROOT}__scrollable`}
          ref={(scrollable) => {
            this.scrollable = scrollable;
          }}
        >
          <ul className={`${ROOT}__list-detail`}>
            {this.renderNotification()}
            {props.detailList.map(this.renderDetailListItem)}
          </ul>

          <HistoryTable historyList={props.historyList} />

          <ApproveForm
            comment={props.approveComment}
            onChangeApproveComment={props.editComment}
            onClickRejectButton={props.onClickRejectButton}
            onClickApproveButton={props.onClickApproveButton}
            userPhotoUrl={props.userPhotoUrl}
          />
        </div>
      </div>
    );
  }
}
