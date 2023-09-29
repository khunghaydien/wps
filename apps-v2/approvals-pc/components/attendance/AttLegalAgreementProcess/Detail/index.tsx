import React from 'react';

import isNil from 'lodash/isNil';

import HorizontalLayout from '@commons/components/fields/layouts/HorizontalLayout';
import iconStatusMetaReapplying from '@commons/images/iconStatusMetaReapplying.png';
import msg from '@commons/languages';
import TimeUtil from '@commons/utils/TimeUtil';

import {
  Label,
  Status,
} from '@attendance/domain/models/approval/AttDailyRequestDetail/Base';
import * as LegalAgreementRequest from '@attendance/domain/models/approval/LegalAgreementRequest';
import { CODE } from '@attendance/domain/models/LegalAgreementRequestType';

import ApproveForm from '../../../DetailParts/ApproveForm';
import Comparison from '../../../DetailParts/Comparison';
import HeaderBar from '../../../DetailParts/HeaderBar';
import HistoryTable from '../../../DetailParts/HistoryTable';
import HeadTableList from './HeadTableList';
import status from '@attendance/ui/helpers/approval/legalAgreementRequest/status';

import './index.scss';

const ROOT = 'approvals-pc-att-legal-agreement-process-list-pane-detail';

/**
 * Props
 */
type AttLegalAgreementDetail = {
  id: string; // 申請ID
  approvalComment: string; // 承認者のコメント
  requestComment: string;
  userPhotoUrl: string; // 承認者顔写真URL
  request: LegalAgreementRequest.LegalAgreementRequest; // 承認申請の詳細
  originalRequestStatus: Status; // 元の申請の申請ステータス
};

type ContentProps = AttLegalAgreementDetail & {
  isExpanded: boolean;
  togglePane: () => void;
  editComment: (arg0: string) => void;
  onClickRejectButton: () => void;
  onClickApproveButton: () => void;
};

type Props = ContentProps;

const mapObject = (
  obj: LegalAgreementRequest.Request | null | undefined,
  f: (arg0: LegalAgreementRequest.Request) => Record<string, any>
) => {
  return obj ? f(obj) : {};
};

const formatAsAttLegalAgreementRequest = (
  request: LegalAgreementRequest.Request,
  original?: LegalAgreementRequest.Request
): Label[] => {
  return [
    {
      label: msg().Att_Lbl_LimitToBeChanged,
      value: TimeUtil.toHours(request.changedOvertimeHoursLimit),
      ...mapObject(original, (o) => ({
        valueType: 'number',
        originalValue: TimeUtil.toHours(o.changedOvertimeHoursLimit) || '',
      })),
    },
    {
      label: msg().Appr_Lbl_Reason,
      value: request.reason || '',
      ...mapObject(original, (o) => ({
        valueType: 'longtext',
        originalValue: o.reason || '',
      })),
    },
    {
      label: msg().Appr_Lbl_Measure,
      value: request.measure || '',
      ...mapObject(original, (o) => ({
        valueType: 'longtext',
        originalValue: o.measure || '',
      })),
    },
  ];
};

export const createDetailList = (
  request: LegalAgreementRequest.LegalAgreementRequest | null
) => {
  const initialDetailList = [
    {
      label: '',
      value: '',
    },
  ];

  if (!request) {
    return initialDetailList;
  }

  if (!request.request.id) {
    return initialDetailList;
  }

  const refineOrigianlRequest = <
    T extends LegalAgreementRequest.LegalAgreementRequest['originalRequest']
  >(
    r: any
  ): T => {
    return r as T;
  };

  const { request: currentRequest, originalRequest } = request;
  switch (currentRequest.type) {
    case CODE.MONTHLY:
    case CODE.YEARLY:
      return formatAsAttLegalAgreementRequest(
        currentRequest,
        refineOrigianlRequest(originalRequest)
      );
    default:
      return initialDetailList;
  }
};

export default class Detail extends React.Component<Props> {
  scrollable: HTMLDivElement | null | undefined;

  static defaultProps = {
    id: '',
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
      case LegalAgreementRequest.STATUS.REAPPLYING:
        return (
          <div className={`${ROOT}__notification`}>
            <div className={`${ROOT}__notification-icon`}>
              <img alt="reallying" src={iconStatusMetaReapplying} />
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
          <HorizontalLayout.Label
            cols={3}
            className={`${ROOT}__detail-lable-item`}
          >
            {addon.label}
          </HorizontalLayout.Label>

          <HorizontalLayout.Body
            className={`${ROOT}__pre-wrap ${ROOT}__line-feed-resolution`}
            cols={9}
          >
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

    const {
      request: {
        request: currentRequest,
        historyList,
        legalAgreementWorkSystem,
      },
      request,
      isExpanded,
      togglePane,
      approvalComment,
      editComment,
      onClickRejectButton,
      onClickApproveButton,
      userPhotoUrl,
    } = this.props;

    const detailItemList = createDetailList(request);

    return (
      <div className={`${ROOT}`}>
        <HeaderBar
          title={msg().Appr_Lbl_Detail}
          meta={[
            {
              label: msg().Appr_Lbl_ApplicantName,
              value: currentRequest.submitter.employee.name,
              show: true,
            },
            {
              label: msg().Appr_Lbl_DelegatedApplicantName,
              value: currentRequest.submitter.delegator.employee.name || '',
              show:
                !isNil(currentRequest.submitter.delegator.employee.name) &&
                currentRequest.submitter.delegator.employee.name !== '',
            },
            {
              label: msg().Appr_Lbl_Status,
              value: status(currentRequest.status),
              show: true,
            },
          ]
            .filter((m) => m.show)
            .map((m) => ({
              label: m.label,
              value: m.value,
            }))}
          isExpanded={isExpanded}
          onTogglePane={togglePane}
        />

        <div
          className={`${ROOT}__scrollable`}
          ref={(scrollable) => {
            this.scrollable = scrollable;
          }}
        >
          <HeadTableList
            request={currentRequest}
            legalAgreementWorkSystem={legalAgreementWorkSystem}
          />
          <ul className={`${ROOT}__list-detail`}>
            {this.renderNotification()}
            {detailItemList?.map(this.renderDetailListItem)}
          </ul>
          <HistoryTable historyList={historyList} />

          <ApproveForm
            comment={approvalComment}
            onChangeApproveComment={editComment}
            onClickRejectButton={onClickRejectButton}
            onClickApproveButton={onClickApproveButton}
            userPhotoUrl={userPhotoUrl}
          />
        </div>
      </div>
    );
  }
}
