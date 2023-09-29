import React, { useState } from 'react';

import classnames from 'classnames';
import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import FormatUtil from '@apps/commons/utils/FormatUtil';
import TaxSummary from '@commons/components/exp/Form/TaxSummary';
import msg from '@commons/languages';
import DateUtil from '@commons/utils/DateUtil';
import Alert from '@mobile/components/molecules/commons/Alert';
import Dialog from '@mobile/components/molecules/commons/Dialog';
import FileCard from '@mobile/components/molecules/commons/FileCard';
import Navigation from '@mobile/components/molecules/commons/Navigation';
import ViewItem from '@mobile/components/molecules/commons/ViewItem';

import STATUS from '@apps/domain/models/approval/request/Status';
import { AttachedFiles } from '@apps/domain/models/common/AttachedFile';
import {
  AccountingPeriodOption,
  AccountingPeriodOptionList,
} from '@apps/domain/models/exp/AccountingPeriod';
import { formatStatus } from '@apps/domain/models/exp/approval/request/History';
import { ExpenseReportType } from '@apps/domain/models/exp/expense-report-type/list';
import { Record, RecordUpdateInfoList } from '@apps/domain/models/exp/Record';
import {
  calculateSubtotalAmount,
  Report,
  status,
} from '@apps/domain/models/exp/Report';
import {
  TAX_DETAILS_TYPE,
  TaxDetailType,
} from '@apps/domain/models/exp/TaxType';
import { getJctRegistrationNumber } from '@apps/domain/models/exp/Vendor';
import { UserSetting } from '@apps/domain/models/UserSetting';

import { State as ApprovalHistory } from '@mobile/modules/expense/entities/approvalHistory';

import Amount from '@mobile/components/atoms/Amount';
import Button from '@mobile/components/atoms/Button';
import IconButton from '@mobile/components/atoms/IconButton';
import TextButton from '@mobile/components/atoms/TextButton';
import Wrapper from '@mobile/components/atoms/Wrapper';
import PreRequestArea from '@mobile/components/molecules/expense/PreRequestArea';
import RecordSummaryListItem from '@mobile/components/molecules/expense/RecordSummaryListItem';
import HistoryList from '@mobile/components/organisms/approval/HistoryList';
import FooterOptionsModal, {
  textColor as color,
} from '@mobile/components/organisms/expense/FooterOptionsModal';
import InfoDialog from '@mobile/components/organisms/expense/UpdateInfoDialog';

import './index.scss';

const ROOT = 'mobile-app-pages-report-detail';

export type Props = Readonly<{
  report: Report;
  reportId: string;
  requestId: string;
  reportNo: string;
  subject: string;
  status: string;
  accountingPeriodId: string;
  accountingDate: string;
  useFileAttachment: boolean;
  attachedFileList?: AttachedFiles;
  customRequestId?: string;
  customRequestName?: string;
  reportTypeName: string;
  costCenterCode: string;
  costCenterName: string;
  jobCode: string;
  jobName: string;
  vendorCode: string;
  vendorName: string;
  paymentDueDate: string;
  remarks: string;
  purpose: string;
  extendedItemTexts: Array<{
    name: string;
    value: string;
  }>;
  extendedItemPicklists: Array<{
    name: string;
    value: string;
    picklist: Array<{ label: string; value: string }>;
  }>;
  extendedItemLookup: Array<{
    name: string;
    value: string;
    selectedOptionName: string;
  }>;
  extendedItemDate: Array<{
    name: string;
    value: string;
  }>;
  totalAmountOfRecords: number;
  records: Record[];
  currencySymbol: string;
  currencyDecimalPlaces: number;
  isEditable: boolean;
  preRequest?: Report;
  userSetting: UserSetting;
  isApprovedPreRequest: boolean;
  accountingPeriodList: AccountingPeriodOptionList;
  approvalHistory: ApprovalHistory;
  recordUpdateInfo: RecordUpdateInfoList;
  selectedReportType: ExpenseReportType;
  onClickSearchExpType: () => void;
  onClickCreateICRecord: () => void;
  onClickCreateCCRecord: () => void;
  clearRecordUpdateInfo: () => void;
  vendorJctRegistrationNumber?: string;

  // Navigation
  onClickRecord: (recordId: string, recordType: string) => void;
  onClickRecall: () => void;
  openPrintPage: () => void;
  onClickSubmit: () => void;
  onClickReportList: () => void;
  onClickDelete: () => void;
  onClickEdit: () => void;
  onClickCreateReportFromRequest: (arg0: string) => void;
  onClickClone: () => void;
  openReceiptLibrary: () => void;
  isRequest?: boolean;
  onClickVendorDetail?: () => void;
  useJctRegistrationNumber?: boolean;
}>;

const renderAlert = (
  records: Record[],
  isApInactive: boolean,
  isRequest?: boolean
) => {
  const messages = [];
  if (isApInactive) messages.push(msg().Exp_ERR_AccountingPeriodInactive);
  if (records.length === 0) messages.push(msg().Exp_Err_SubmitReportNoRecords);
  return messages.length > 0 && !isRequest ? (
    <Alert variant="warning" message={messages} />
  ) : null;
};

const renderApprovalHistory = (approvalHistory: ApprovalHistory) => {
  const renderList = () =>
    approvalHistory.isLoading ? (
      <div>{msg().Com_Lbl_Loading}</div>
    ) : (
      <HistoryList historyList={formatStatus(approvalHistory.list)} />
    );

  return (
    <>
      <div className={`${ROOT}__headline`}>
        <div className={`${ROOT}__title heading-2`}>
          {msg().Com_Lbl_ApprovalHistory}
        </div>
      </div>
      {renderList()}
    </>
  );
};

const renderExtendedTextItems = (
  items: Array<{
    name: string;
    value: string;
  }>
) => items.map((item) => <ViewItem label={item.name}>{item.value}</ViewItem>);

const renderExtendedPicklistItems = (
  items: Array<{
    name: string;
    value: string;
    picklist: Array<{ label: string; value: string }>;
  }>
) =>
  items.map((item) => {
    const val = item.value;
    const pickListItem = val ? find(item.picklist, { value: val }) : null;
    return (
      <ViewItem label={item.name}>
        {pickListItem ? pickListItem.label : ''}
      </ViewItem>
    );
  });

const renderExtendedLookupItems = (
  items: Array<{
    name: string;
    value: string;
    selectedOptionName: string;
  }>
) =>
  items.map((item) => (
    <ViewItem label={item.name}>
      {item.value ? `${item.value} - ${item.selectedOptionName}` : ''}
    </ViewItem>
  ));

const renderExtendedDateItems = (
  items: Array<{
    name: string;
    value: string;
  }>
) =>
  items.map((item) => (
    <ViewItem label={item.name}>{DateUtil.dateFormat(item.value)}</ViewItem>
  ));

export const renderSubtotalAmount = (
  baseCurrencySymbol: string,
  baseCurrencyDecimal: number,
  records: Array<Record>,
  expDisplayTaxDetailsSetting: TaxDetailType,
  classNameRoot: string = ROOT,
  className?: string
) => {
  const { foreignCurrency, baseCurrencyAmount } =
    calculateSubtotalAmount(records);
  const foreignCurrencyAmount = Object.keys(foreignCurrency).map((fc) => {
    const { symbol, amount, decimalPlaces } = foreignCurrency[fc];
    return (
      <Amount
        className={classnames(
          `${classNameRoot}__sub-foreign-amount`,
          className
        )}
        key={fc}
        amount={amount}
        symbol={symbol}
        decimalPlaces={decimalPlaces}
      />
    );
  });
  return (
    <>
      {!isEmpty(foreignCurrencyAmount) &&
        expDisplayTaxDetailsSetting === TAX_DETAILS_TYPE.NotUsed && (
          <>
            {!!baseCurrencyAmount && (
              <Amount
                className={classnames(
                  `${classNameRoot}__sub-base-amount`,
                  className
                )}
                amount={baseCurrencyAmount}
                symbol={baseCurrencySymbol}
                decimalPlaces={baseCurrencyDecimal}
              />
            )}
            {foreignCurrencyAmount}
          </>
        )}
      {expDisplayTaxDetailsSetting !== TAX_DETAILS_TYPE.NotUsed && (
        <TaxSummary
          records={records}
          baseCurrencySymbol={baseCurrencySymbol}
          baseCurrencyDecimal={baseCurrencyDecimal}
          foreignCurrencyAmount={foreignCurrencyAmount}
          expDisplayTaxDetailsSetting={expDisplayTaxDetailsSetting}
        />
      )}
    </>
  );
};

const renderFileList = (useFileAttachment, files) => {
  const isDisplay = useFileAttachment && !isEmpty(files);
  const fileList = (files || []).map((file) => (
    <FileCard key={file.attachedFileVerId} file={file} />
  ));
  return (
    isDisplay && (
      <ViewItem label={msg().Exp_Lbl_AttachedFile}>{fileList}</ViewItem>
    )
  );
};

const isSubmittableStatus = (currentStatus?: string) => {
  switch (currentStatus) {
    case status.NOT_REQUESTED:
    case status.REJECTED:
    case status.RECALLED:
    case status.CANCELED:
      return true;
    default:
      return false;
  }
};

const ReportDetail = (props: Props) => {
  const [isOpenedDeleteDialog, setIsOpenedDeleteDialog] = useState(false);
  const [isFooterModalOpen, setIsFooterModalOpen] = useState(false);
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);

  const openedDeleteDialog = () => setIsOpenedDeleteDialog(true);
  const closeDeleteDialog = () => setIsOpenedDeleteDialog(false);

  const {
    reportId,
    report,
    records = [],
    isEditable,
    currencyDecimalPlaces,
    currencySymbol,
    totalAmountOfRecords,
    isApprovedPreRequest,
    preRequest,
    accountingPeriodId,
    recordUpdateInfo,
    isRequest,
  } = props;
  const isDisableSubmitButton =
    !isEditable || (!isRequest && records.length === 0) || isApprovedPreRequest;
  const isDeleteDisabled = !reportId || !isSubmittableStatus(report.status);

  const withPreRequest = !isEmpty(preRequest);
  const accountingPeriodList = props.accountingPeriodList || [];
  const selectedAccountingPeriod =
    (accountingPeriodId &&
      find(accountingPeriodList, {
        value: accountingPeriodId,
      })) ||
    ({} as AccountingPeriodOption);

  const openRecordMenuModal = () => setIsFooterModalOpen(true);
  const closeRecordMenuModal = () => setIsFooterModalOpen(false);

  const openMoreMenuModal = () => setIsMoreModalOpen(true);
  const closeMoreMenuModal = () => setIsMoreModalOpen(false);

  const showApprovalHistory = props.requestId && props.requestId !== 'null';

  const actionButtons = isApprovedPreRequest
    ? [
        <TextButton
          onClick={() => {
            props.onClickCreateReportFromRequest(
              get(preRequest, 'reportId') || ''
            );
          }}
        >
          {msg().Exp_Lbl_CreateReport}
        </TextButton>,
      ]
    : [
        <TextButton onClick={props.onClickEdit} disabled={!isEditable}>
          {msg().Com_Btn_Edit}
        </TextButton>,
        <IconButton
          className={`${ROOT}__more`}
          icon="threedots_vertical"
          onClick={openMoreMenuModal}
        />,
      ];

  // const exportToEmailAction = () => {
  //   const html = document.getElementById(`${ROOT}__print-report`).outerHTML;
  //   setIsMoreModalOpen(false);
  //   props.exportToEmail(html);
  // };

  const {
    useTransitManager,
    useMasterCardImport,
    useReceiptScan,
    expDisplayTaxDetailsSetting,
  } = props.userSetting;
  const footerModalOptions = [
    {
      label: msg().Exp_Lbl_Manual,
      action: props.onClickSearchExpType,
    },
  ];
  if (useReceiptScan && !isRequest) {
    footerModalOptions.push({
      label: msg().Exp_Lbl_CreateRecordFromReceipt,
      action: props.openReceiptLibrary,
    });
  }
  if (useMasterCardImport && !isRequest) {
    footerModalOptions.push({
      label: msg().Exp_Lbl_CreateRecordFromCreditCard,
      action: props.onClickCreateCCRecord,
    });
  }
  if (useTransitManager && !isRequest) {
    footerModalOptions.push({
      label: msg().Exp_Lbl_CreateRecordFromIcCard,
      action: props.onClickCreateICRecord,
    });
  }

  const title = isRequest ? msg().Exp_Lbl_RequestTarget : msg().Exp_Lbl_Report;
  const currentAp = accountingPeriodList.find(
    (accountingPeriod) => accountingPeriod.value === report.accountingPeriodId
  );
  const isApInactive = currentAp && !currentAp.active;

  return (
    <Wrapper>
      <div className={ROOT}>
        <div className={`${ROOT}__heading`}>
          <Navigation
            title={title}
            backButtonLabel={
              isRequest ? msg().Exp_Lbl_Requests : msg().Exp_Btn_ReportList
            }
            onClickBack={props.onClickReportList}
            actions={actionButtons}
          />
        </div>
        <div className="main-content">
          {renderAlert(records, isApInactive, isRequest)}
          <div className={`${ROOT}__report`}>
            {withPreRequest && (
              <PreRequestArea
                preRequest={preRequest}
                baseCurrencySymbol={currencySymbol}
                baseCurrencyDecimal={currencyDecimalPlaces}
                withHeader
                className={ROOT}
              />
            )}
            <div className={`${ROOT}__headline`}>
              <div className={`${ROOT}__title heading-2`}>
                {isRequest ? msg().Exp_Lbl_RequestTarget : msg().Exp_Lbl_Report}
              </div>
              <div className={`${ROOT}__report-no`}>{props.reportNo}</div>
            </div>
            <ViewItem label={msg().Exp_Clbl_ReportTitle}>
              {props.subject}
            </ViewItem>
            <ViewItem label={msg().Exp_Lbl_Status}>
              {props.status === STATUS.Canceled
                ? STATUS.Rejected
                : props.status}
            </ViewItem>
            {!isEmpty(accountingPeriodList) && !isRequest ? (
              <>
                <ViewItem label={msg().Exp_Clbl_AccountingPeriod}>
                  {get(selectedAccountingPeriod, 'label', '')}
                </ViewItem>
                <ViewItem label={msg().Exp_Clbl_RecordDate}>
                  {DateUtil.formatYMD(selectedAccountingPeriod.recordDate)}
                </ViewItem>
              </>
            ) : (
              <ViewItem
                label={
                  isRequest
                    ? msg().Exp_Clbl_ScheduledDate
                    : msg().Exp_Clbl_RecordDate
                }
              >
                {DateUtil.formatYMD(props.accountingDate)}
              </ViewItem>
            )}
            <ViewItem label={msg().Exp_Clbl_ReportType}>
              {props.reportTypeName}
            </ViewItem>
            {report.totalAmount > 0 && (
              <ViewItem label={msg().Exp_Lbl_TotalAmount}>
                {`${currencySymbol} ${FormatUtil.formatNumber(
                  report.totalAmount,
                  currencyDecimalPlaces
                )}`}
              </ViewItem>
            )}
            {props.customRequestId && (
              <ViewItem label={msg().Exp_Lbl_CustomRequest}>
                <a
                  className={`${ROOT}__custom-request-name`}
                  href={`/lightning/r/ComGeneralRequest__c/${props.customRequestId}/view`}
                  onClick={() => {
                    // used for redirect back to this page after click back btn
                    window.sessionStorage.setItem('returnTab', 'expense');
                    window.sessionStorage.setItem(
                      'returnReportId',
                      props.reportId
                    );
                  }}
                >
                  {props.customRequestName || ''}
                </a>
              </ViewItem>
            )}

            <ViewItem label={msg().Exp_Clbl_Purpose}>{props.purpose}</ViewItem>
            {props.costCenterCode && (
              <ViewItem label={msg().Exp_Clbl_CostCenterHeader}>
                {`${props.costCenterCode} - ${props.costCenterName}`}
              </ViewItem>
            )}
            {props.jobCode && (
              <ViewItem label={msg().Exp_Lbl_Job}>
                {`${props.jobCode} - ${props.jobName}`}
              </ViewItem>
            )}
            {props.vendorCode && (
              <ViewItem label={msg().Exp_Clbl_Vendor}>
                <div>
                  <span>{`${props.vendorCode} - ${props.vendorName}`}</span>
                  <IconButton
                    className={`${ROOT}__vendor-detail`}
                    icon="chevronright"
                    onClick={props.onClickVendorDetail}
                  />
                </div>
                {props.useJctRegistrationNumber && (
                  <div className={`${ROOT}__vendor-jct`}>{`${
                    msg().Exp_Clbl_JctRegistrationNumber
                  }: ${getJctRegistrationNumber(
                    props.vendorJctRegistrationNumber,
                    report.vendorIsJctQualifiedIssuer
                  )}`}</div>
                )}
              </ViewItem>
            )}
            {props.paymentDueDate && (
              <ViewItem label={msg().Exp_Clbl_PaymentDate}>
                {DateUtil.formatYMD(props.paymentDueDate)}
              </ViewItem>
            )}
            {renderExtendedTextItems(props.extendedItemTexts)}
            {renderExtendedPicklistItems(props.extendedItemPicklists)}
            {renderExtendedLookupItems(props.extendedItemLookup)}
            {renderExtendedDateItems(props.extendedItemDate)}
            <ViewItem label={msg().Exp_Clbl_ReportRemarks}>
              {props.remarks}
            </ViewItem>
            {renderFileList(props.useFileAttachment, props.attachedFileList)}
          </div>
          <div className={`${ROOT}__records`}>
            <div className={`${ROOT}__headline`}>
              <div className={`${ROOT}__headline-title heading-2`}>
                <div className={`${ROOT}__title`}>{msg().Exp_Lbl_Records}</div>
                <div className={`${ROOT}__headline-subtitle`}>
                  <div className={`${ROOT}__subtitle heading-2`}>
                    {msg().Exp_Lbl_TotalLong}
                  </div>
                  <Amount
                    amount={totalAmountOfRecords}
                    symbol={currencySymbol}
                    decimalPlaces={currencyDecimalPlaces}
                  />
                </div>
              </div>
              {renderSubtotalAmount(
                currencySymbol,
                currencyDecimalPlaces,
                props.records,
                expDisplayTaxDetailsSetting,
                ROOT,
                `${
                  expDisplayTaxDetailsSetting === TAX_DETAILS_TYPE.NotUsed
                    ? `${ROOT}__tax-summary-amount-right`
                    : `${ROOT}__tax-summary-amount-left`
                }`
              )}
            </div>
            {records.map((record) => (
              <RecordSummaryListItem
                key={record.recordId}
                onClick={() =>
                  props.onClickRecord(record.recordId, record.recordType)
                }
                record={record}
                currencySymbol={currencySymbol}
                currencyDecimalPlaces={currencyDecimalPlaces}
              />
            ))}
          </div>
          {showApprovalHistory && renderApprovalHistory(props.approvalHistory)}
        </div>
        <div className={`${ROOT}__actions`}>
          <Button
            onClick={openRecordMenuModal}
            priority="secondary"
            variant="add"
            disabled={!props.isEditable || isApprovedPreRequest}
          >
            {msg().Exp_Btn_AddRcord}
          </Button>
          <Button
            onClick={props.onClickSubmit}
            priority="primary"
            variant="neutral"
            disabled={isDisableSubmitButton}
          >
            {msg().Exp_Btn_Submit}
          </Button>
        </div>
        <Dialog
          isOpened={isOpenedDeleteDialog}
          title={msg().Exp_Msg_ConfirmDelete}
          content={
            <div className={`${ROOT}__dialog`}>
              <p className={`${ROOT}__item`}>{msg().Exp_Lbl_Title}:</p>
              <p className={`${ROOT}__sub-item`}>{props.subject}</p>
              <p className={`${ROOT}__item`}>{msg().Exp_Lbl_TotalAmount}:</p>
              <Amount
                className={`${ROOT}__amount`}
                amount={totalAmountOfRecords}
                symbol={currencySymbol}
                decimalPlaces={currencyDecimalPlaces}
              />
            </div>
          }
          leftButtonLabel={msg().Com_Btn_Cancel}
          rightButtonLabel={msg().Com_Btn_Delete}
          onClickLeftButton={closeDeleteDialog}
          onClickRightButton={props.onClickDelete}
          onClickCloseButton={closeDeleteDialog}
        />
        {isFooterModalOpen && (
          <FooterOptionsModal
            title={msg().Exp_Btn_AddRcord}
            menuItems={footerModalOptions}
            closeModal={closeRecordMenuModal}
          />
        )}
        {isMoreModalOpen && (
          <FooterOptionsModal
            title={msg().Exp_Btn_More}
            menuItems={[
              {
                label: msg().Exp_Lbl_Recall,
                action: props.onClickRecall,
                disabled: props.report.status !== status.PENDING,
              },
              {
                label: msg().Exp_Lbl_Clone,
                action: props.onClickClone,
              },
              {
                label: msg().Com_Btn_Delete,
                action: () => {
                  closeMoreMenuModal();
                  openedDeleteDialog();
                },
                color: color.error,
                disabled: isDeleteDisabled,
              },
              ...(!isRequest
                ? [
                    {
                      label: msg().Com_Btn_PrintPage,
                      action: props.openPrintPage,
                    },
                  ]
                : []),
            ]}
            closeModal={closeMoreMenuModal}
          />
        )}
      </div>
      {!isEmpty(recordUpdateInfo) && (
        <InfoDialog
          updateInfo={recordUpdateInfo}
          onClickHideDialogButton={props.clearRecordUpdateInfo}
        />
      )}
    </Wrapper>
  );
};

export default ReportDetail;
