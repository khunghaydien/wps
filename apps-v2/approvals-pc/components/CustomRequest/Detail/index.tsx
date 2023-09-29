import React, { ReactElement, useState } from 'react';

import classNames from 'classnames';
import get from 'lodash/get';

import Spinner from '@apps/commons/components/Spinner';
import { NAMESPACE_PREFIX } from '@commons/api';
import Button from '@commons/components/buttons/Button';
import CustomRequestDetail from '@commons/components/customRequest/Detail';
import msg from '@commons/languages';

import { FILE_PREFIX, status } from '@apps/domain/models/customRequest/consts';
import {
  LayoutItem,
  RequestDetail,
} from '@apps/domain/models/customRequest/types';

import { SideFile } from '../../../modules/ui/sideFilePreview';

import ApproveFooter from '../../DetailParts/ApprovalFooterBar';
import AttachmentPreview from '../../DetailParts/AttachmentPreview';
import CommentHeader from '../../DetailParts/CommentHeader';
import HeaderBar from '../../DetailParts/HeaderBar';
import HistoryTable from '../../DetailParts/HistoryTable';
import SideFilePreview from '../../DetailParts/SideFilePreview';

import './index.scss';

export type EditFormContainerProps = {
  onHide: () => void;
};

type Props = {
  currencySymbol: string;
  editFormContainer: (props: EditFormContainerProps) => ReactElement;
  isShowFile: boolean;
  isShowSidePanel: boolean;
  layoutConfig: LayoutItem[];
  requestDetail: RequestDetail;
  userPhotoUrl: string;
  isApexView: boolean;
  showLoading: boolean;
  hideSideFile: () => void;
  onApprove: (comment: string, requestIdList: string[]) => void;
  onReject: (comment: string, requestIdList: string[]) => void;
  setSideFile: (file: SideFile) => void;
};

const STATUS_FIELD_NAME = NAMESPACE_PREFIX + 'Status__c';
const ROOT = 'approvals-pc-custom-request-panel-detail';

const Detail = ({
  currencySymbol,
  editFormContainer: EditFormContainer,
  isShowFile,
  isShowSidePanel,
  layoutConfig,
  requestDetail,
  userPhotoUrl,
  hideSideFile,
  onApprove,
  onReject,
  setSideFile,
  isApexView,
  showLoading,
}: Props) => {
  const [userComment, setUserComment] = useState('');
  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
  const {
    Id: requestId = '',
    submitterPhotoUrl = '',
    submitterName,
  } = requestDetail.customRequest || {};

  const onChangeComment = (userComment: string) => setUserComment(userComment);

  const onClickApproveButton = () => {
    if (requestId) {
      onApprove(userComment, [requestId]);
      setUserComment('');
    }
  };

  const onClickRejectButton = () => {
    if (requestId) {
      onReject(userComment, [requestId]);
      setUserComment('');
    }
  };

  const onToggleEditBtn = () =>
    setIsOpenEditDialog((isOpenEditDialog) => !isOpenEditDialog);

  if (!isApexView && !requestId) {
    return (
      <div className={ROOT}>
        <div className={`${ROOT}__empty-header`}>
          <HeaderBar title={msg().Appr_Lbl_Detail} />
        </div>
      </div>
    );
  }

  const attachedList = requestDetail.attachedFileList || [];
  const hasAttachedFiles = attachedList.length > 0;
  const historyList = requestDetail.approvalHistoryList || [];
  const comment = get(historyList, '0.comment', '');
  const rootClass = classNames(ROOT, {
    [`${ROOT}__apex-page`]: isApexView,
    'with-side-panel': isShowSidePanel,
  });
  const contentClass = classNames(`${ROOT}__content`, {
    'with-side-panel': isShowSidePanel,
  });
  const spinnerForApexDetailView = () =>
    isApexView && <Spinner loading={showLoading} />;

  const customRequestStatus = get(
    requestDetail,
    `customRequest.${STATUS_FIELD_NAME}`
  );
  const isShowApproveFooter = customRequestStatus === status.PENDING;
  const isDisabledEditButton = !isShowApproveFooter;

  return (
    <div className={rootClass}>
      <SideFilePreview hideSideFile={hideSideFile} />

      <div className={contentClass}>
        {isApexView && (
          <div className={`${ROOT}__page-header`}>
            <HeaderBar title={msg().Appr_Lbl_Detail} />
          </div>
        )}
        <div className={`${ROOT}__scrollable`}>
          <div className={`${ROOT}__header`}>
            <div className={`${ROOT}__comment`}>
              <CommentHeader
                value={comment}
                employeePhotoUrl={submitterPhotoUrl}
                employeeName={submitterName}
              />
            </div>
            <Button
              className={`${ROOT}__edit`}
              onClick={onToggleEditBtn}
              disabled={isDisabledEditButton}
            >
              {msg().Com_Btn_Edit}
            </Button>
          </div>

          <CustomRequestDetail
            currencySymbol={currencySymbol}
            isApproval
            isShownFile={false}
            isShownHistory={false}
            layoutConfig={layoutConfig}
            requestDetail={requestDetail}
            title={msg().Appr_Lbl_Detail}
          />
          {isShowFile && (
            <div className={`${ROOT}__attachment`}>
              <div className={`${ROOT}__attachment-header`}>
                {msg().Exp_Lbl_FileAttachment}
              </div>
              <div className={`${ROOT}__attachment-content`}>
                {hasAttachedFiles ? (
                  <AttachmentPreview
                    attachedFileList={attachedList}
                    hideSideFile={hideSideFile}
                    isApexView={false}
                    prefix={FILE_PREFIX}
                    setSideFile={setSideFile}
                  />
                ) : (
                  <div className={`${ROOT}__attachment-empty`}>
                    {msg().Exp_Lbl_NoFileAttachment}
                  </div>
                )}
              </div>
            </div>
          )}
          <HistoryTable historyList={historyList} />
        </div>
        {isShowApproveFooter && (
          <ApproveFooter
            comment={userComment}
            onChangeApproveComment={onChangeComment}
            onClickRejectButton={onClickRejectButton}
            onClickApproveButton={onClickApproveButton}
            userPhotoUrl={userPhotoUrl}
          />
        )}
        {isOpenEditDialog && <EditFormContainer onHide={onToggleEditBtn} />}
      </div>
      {spinnerForApexDetailView()}
    </div>
  );
};

export default Detail;
