import React, { useState } from 'react';

import isNil from 'lodash/isNil';

import { RichTextEditor } from '@commons/components/customRequest/Fields';
import msg from '@commons/languages';
import FormatUtil from '@commons/utils/FormatUtil';
import FileCard from '@mobile/components/molecules/commons/FileCard';
import Navigation from '@mobile/components/molecules/commons/Navigation';
import ViewItem from '@mobile/components/molecules/commons/ViewItem';

import {
  AttachedFile,
  AttachedFiles,
} from '@apps/domain/models/common/AttachedFile';
import { groupLayoutItemsBySectionAndRow } from '@apps/domain/models/customRequest';
import {
  CUSTOM_REQUEST_FIELD_SECTION_LABEL,
  FILE_PREFIX,
  RECORD_ACCESS_FIELD_NAME,
  typeName as TYPE_NAME,
} from '@apps/domain/models/customRequest/consts';
import {
  CustomRequest,
  LayoutItem,
  RequestDetail,
} from '@apps/domain/models/customRequest/types';
import { formatStatus } from '@apps/domain/models/exp/approval/request/History';

import Wrapper from '@mobile/components/atoms/Wrapper';
import Footer from '@mobile/components/organisms/approval/Footer';
import HistoryList from '@mobile/components/organisms/approval/HistoryList';

import './DetailPage.scss';

type Props = {
  currencySymbol: string;
  isShowFile: boolean;
  layoutItemConfigList: LayoutItem[];
  requestDetail: RequestDetail;
  onClickApproveReject: (
    requestIdList: string[],
    comment: string,
    isClickApprove?: boolean
  ) => void;
  onClickBack: () => void;
};

const ROOT = 'mobile-app-pages-approval-page-custom-request-detail';

const getFieldContent = (
  currencySymbol: string,
  field: string,
  fractionDigits: number,
  referenceFieldValue: string,
  typeName: string,
  value: string
) => {
  switch (typeName) {
    case TYPE_NAME.CURRENCY:
      return `${currencySymbol} ${FormatUtil.formatNumber(
        value,
        fractionDigits
      )}`;
    case TYPE_NAME.TEXTAREA:
      return (
        <RichTextEditor
          key={value}
          label={''}
          value={value}
          readOnly
          error={''}
          name={field}
        />
      );
    case TYPE_NAME.REFERENCE:
      return referenceFieldValue;
    case TYPE_NAME.URL:
      return (
        <a href={value} target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      );
    case TYPE_NAME.BOOLEAN:
      return String(value);
    default:
      return value;
  }
};

const buildLayout = (
  layoutItemConfigList: LayoutItem[],
  customRequest: CustomRequest | Record<string, never>,
  currencySymbol: string
) => {
  const groupedItemConfig =
    groupLayoutItemsBySectionAndRow(layoutItemConfigList);

  return Object.entries(groupedItemConfig).map(([sectionId, sectionConfig]) => {
    const {
      label: sectionLabel,
      list: sectionList,
      rows: sectionRows,
      columns: sectionColumns,
    } = sectionConfig;
    const labelMap = customRequest.labelMap || {};

    const sectionFieldList = [...Array(sectionColumns).keys()].map((colIdx) => {
      return [...Array(sectionRows).keys()].map((rowIdx) => {
        const column = sectionList?.[rowIdx]?.[colIdx];

        if (!column) return null;

        if (!column.label) return <div className={`${ROOT}__blank-space`} />;

        const value = isNil(customRequest[column.field])
          ? ''
          : customRequest[column.field];
        const referenceFieldValue = labelMap[column.field] || '';

        const { field, fractionDigits, label, typeName } = column;

        if (field === RECORD_ACCESS_FIELD_NAME) return null;
        return (
          <ViewItem className={`${ROOT}__field`} key={field} label={label}>
            {getFieldContent(
              currencySymbol,
              field,
              fractionDigits,
              referenceFieldValue,
              typeName,
              value
            )}
          </ViewItem>
        );
      });
    });

    const isOtherSectionLabel =
      sectionLabel !== CUSTOM_REQUEST_FIELD_SECTION_LABEL;

    return (
      <section key={sectionId}>
        {isOtherSectionLabel && (
          <div className={`${ROOT}__title`}>{sectionLabel}</div>
        )}
        <div>{sectionFieldList}</div>
      </section>
    );
  });
};

const renderFileAttachSection = (
  attachedFileList: AttachedFiles,
  isShowFile: boolean
) => {
  if (!isShowFile) return null;

  const hasFileAttached = attachedFileList.length > 0;
  return (
    <section>
      <div className={`${ROOT}__title`}>{msg().Exp_Lbl_FileAttachment}</div>
      {hasFileAttached ? (
        attachedFileList.map((file: AttachedFile) => (
          <FileCard
            key={file.attachedFileVerId}
            file={file}
            prefix={FILE_PREFIX}
          />
        ))
      ) : (
        <div className={`${ROOT}__no-file-attach`}>
          {msg().Exp_Lbl_NoFileAttachment}
        </div>
      )}
    </section>
  );
};

const DetailPage = ({
  currencySymbol,
  isShowFile,
  layoutItemConfigList,
  requestDetail,
  onClickApproveReject,
  onClickBack,
}: Props) => {
  const [comment, setComment] = useState('');
  const {
    attachedFileList = [],
    approvalHistoryList = [],
    customRequest = {},
  } = requestDetail;
  const { Id = '' } = customRequest;

  const onChangeComment = (comment: string) => setComment(comment);

  return (
    <Wrapper className={ROOT}>
      <Navigation
        className={`${ROOT}__nav`}
        title={msg().Appr_Lbl_Detail}
        onClickBack={onClickBack}
        backButtonLabel={msg().Com_Lbl_Back}
      />
      <div className="main-content">
        {buildLayout(layoutItemConfigList, customRequest, currencySymbol)}
        {renderFileAttachSection(attachedFileList, isShowFile)}
        <section>
          <div className={`${ROOT}__title`}>
            {msg().Com_Lbl_ApprovalHistory}
          </div>
          <HistoryList
            className={`${ROOT}__history`}
            historyList={formatStatus(approvalHistoryList)}
          />
        </section>
      </div>
      <Footer
        comment={comment}
        onChangeComment={onChangeComment}
        onClickApproveButton={() => onClickApproveReject([Id], comment, true)}
        onClickRejectButton={() => onClickApproveReject([Id], comment)}
      />
    </Wrapper>
  );
};

export default DetailPage;
