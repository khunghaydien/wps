import React from 'react';

import classNames from 'classnames';
import _ from 'lodash';

import Button from '../../../../commons/components/buttons/Button';
import HorizontalLayout from '../../../../commons/components/fields/layouts/HorizontalLayout';
import Tooltip from '../../../../commons/components/Tooltip';
import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';
import FormatUtil from '../../../../commons/utils/FormatUtil';
import { Text } from '../../../../core';
import Highlight from '@apps/commons/components/exp/Highlight';
import {
  convertDifferenceValues,
  isDifferent,
} from '@apps/commons/utils/exp/RequestReportDiffUtils';
import { Color } from '@apps/core/styles';

import { STATUS_MAP } from '../../../../domain/models/exp/CustomRequest';
import {
  getCustomLayoutFromEIs,
  getLabelValueFromEIs,
} from '../../../../domain/models/exp/ExtendedItem';
import {
  calculateSubtotalAmount,
  ExpRequest,
} from '../../../../domain/models/exp/request/Report';
import { getJctRegistrationNumber } from '../../../../domain/models/exp/Vendor';
import { generateSettlementAmount } from '@apps/domain/models/exp/Report';

import { SideFile } from '../../../modules/ui/sideFilePreview';

import AttachmentPreview from '../../DetailParts/AttachmentPreview';

const ROOT = 'approvals-pc-expenses-request-pane-detail';

const requestToReportMapping = {
  subject: 'subject',
  totalAmount: 'totalAmount',
  purpose: 'purpose',
  costCenterName: 'costCenterName',
  costCenterCode: 'costCenterCode',
  jobName: 'jobName',
  jobCode: 'jobCode',
  remarks: 'remarks',
  vendorName: 'vendorName',
  vendorJctRegistrationNumber: 'vendorJctRegistrationNumber',
  paymentDueDate: 'paymentDueDate',
  paymentDueDateUsage: 'paymentDueDateUsage',
};

type Props = {
  isApexView?: boolean;
  expRequest: ExpRequest;
  expPreRequest: ExpRequest;
  baseCurrencySymbol: string;
  baseCurrencyDecimal: number;
  useJctRegistrationNumber: boolean;
  alwaysDisplaySettlementAmount: boolean;
  openVendorDetail: (vendorId: string) => void;
  openCustomRequestPage: (id?: string) => void;
  setSideFile: (sideFile: SideFile) => void;
  hideSideFile: () => void;
  isHighlightDiffSetting?: boolean;
};

const SETTLEMENT_AMOUNT_KEY = 'settlementAmount';

const Summary = (props: Props) => {
  const {
    expRequest,
    expPreRequest,
    baseCurrencySymbol,
    baseCurrencyDecimal,
    openVendorDetail,
    openCustomRequestPage,
    isApexView,
    isHighlightDiffSetting,
  } = props;

  const isHighlightDiff =
    isHighlightDiffSetting && !_.isEmpty(expRequest.expPreRequest);
  let diffValues;
  if (isHighlightDiff) {
    diffValues = convertDifferenceValues(
      requestToReportMapping,
      expRequest,
      expPreRequest
    );
  }

  const getVendorInfo = (expRequest: ExpRequest) => {
    const {
      vendorCode,
      vendorName,
      paymentDueDate,
      vendorJctRegistrationNumber,
      vendorIsJctQualifiedIssuer,
      vendorId,
    } = expRequest;
    let vendorInfo = [];

    if (!vendorCode && !isDifferent('vendorName', diffValues)) {
      return vendorInfo;
    }

    vendorInfo = [
      {
        label: msg().Exp_Clbl_Vendor,
        value: `${vendorCode ? `${vendorCode} - ${vendorName}` : ''}`,
        extra: vendorCode && (
          <>
            {props.useJctRegistrationNumber && (
              <>
                <br />
                {`${
                  msg().Exp_Clbl_JctRegistrationNumber
                }: ${getJctRegistrationNumber(
                  vendorJctRegistrationNumber,
                  vendorIsJctQualifiedIssuer
                )}`}
              </>
            )}
            <br />
            <Button
              className={`${ROOT}__vendor-detail`}
              onClick={() => openVendorDetail(vendorId)}
            >
              {msg().Exp_Btn_VendorDetail}
            </Button>
          </>
        ),
        key: 'vendorName',
      },
    ];

    if (paymentDueDate || isDifferent('paymentDueDate', diffValues)) {
      const paymentDateInfo = {
        label: msg().Exp_Clbl_PaymentDate,
        value: DateUtil.formatYMD(paymentDueDate) || '',
        key: 'paymentDueDate',
        formatter: DateUtil.formatYMD,
      };
      vendorInfo.push(paymentDateInfo);
    }

    return vendorInfo;
  };

  const renderTotalAmount = () => {
    if (
      !isHighlightDiff ||
      _.isEmpty(expPreRequest) ||
      !isDifferent('totalAmount', diffValues)
    )
      return totalAmount;
    return (
      <div className={`${ROOT}__summary-header--amount-diff`}>
        <Highlight>
          <Text
            size="large"
            color="primary"
            bold
            className={`${ROOT}__summary-header--amount`}
          >
            {totalAmount}
          </Text>
        </Highlight>
        <Highlight
          highlightColor={Color.bgDisabled}
          className={`${ROOT}__list-detail-highlight`}
        >
          <Text
            size="large"
            color="primary"
            bold
            className={`${ROOT}__summary-header--amount`}
          >
            {`(${baseCurrencySymbol} ${FormatUtil.formatNumber(
              diffValues.totalAmount.original,
              baseCurrencyDecimal
            )})`}
          </Text>
        </Highlight>
      </div>
    );
  };

  const renderSubtotalAmount = (expRequest: ExpRequest) => {
    const { foreignCurrency, baseCurrencyAmount } = calculateSubtotalAmount(
      expRequest.records
    );

    let preExpRecordAmounts;
    let preBaseCurrencyAmount;
    if (isHighlightDiff && expPreRequest) {
      preExpRecordAmounts = calculateSubtotalAmount(expPreRequest.records);
      preBaseCurrencyAmount = preExpRecordAmounts.baseCurrencyAmount;
    }

    const foreignCurrencyAmount = Object.keys(foreignCurrency).map((fc) => {
      const { symbol, amount, decimalPlaces } = foreignCurrency[fc];
      return (
        <div className={`${ROOT}__total-base-amount`} key={fc}>
          {symbol}&nbsp;{FormatUtil.formatNumber(amount, decimalPlaces)}
        </div>
      );
    });

    const isDiffBaseAmount =
      !_.isNil(preBaseCurrencyAmount) &&
      !_.isEqual(preBaseCurrencyAmount, baseCurrencyAmount);

    return (
      <>
        {!_.isEmpty(foreignCurrencyAmount) && (
          <Tooltip
            align="left"
            content={msg().Exp_Msg_SubtotalAmount}
            position="absolute"
          >
            <div>
              <div className={`${ROOT}__total-foriegn-amount`}>
                <div className={`${ROOT}-subtotal-container`}>
                  {!!baseCurrencyAmount && (
                    <div className={`${ROOT}__total-base-amount`}>
                      <Highlight highlight={isDiffBaseAmount}>
                        {`${baseCurrencySymbol} ${FormatUtil.formatNumber(
                          baseCurrencyAmount,
                          baseCurrencyDecimal
                        )}`}
                      </Highlight>
                    </div>
                  )}
                  {isDiffBaseAmount && (
                    <div className={`${ROOT}__total-base-amount`}>
                      <Highlight
                        highlightColor={Color.bgDisabled}
                        className={`${ROOT}__list-detail-highlight`}
                      >
                        {`${baseCurrencySymbol} ${FormatUtil.formatNumber(
                          preBaseCurrencyAmount,
                          baseCurrencyDecimal
                        )}`}
                      </Highlight>
                    </div>
                  )}
                </div>
              </div>
              <div className={`${ROOT}__total-foriegn-amount`}>
                <div className={`${ROOT}-subtotal-container`}>
                  {foreignCurrencyAmount}
                </div>
              </div>
            </div>
          </Tooltip>
        )}
      </>
    );
  };

  const renderCustomRequestField = () => {
    const { customRequestId, customRequestStatus, customRequestName } =
      expRequest;
    const status = customRequestStatus || '';
    const className = `${ROOT}__list-detail-item-custom-request`;
    const statusClass = classNames(`${className}-status`, status.toLowerCase());
    const statusText = status && msg()[STATUS_MAP[status]];

    return [
      {
        label: msg().Exp_Lbl_CustomRequest,
        value: (
          <div>
            <span className={statusClass}>{statusText}</span>
            <span
              className={`${className}-name`}
              onClick={() => {
                openCustomRequestPage(customRequestId);
              }}
            >
              {customRequestName}
            </span>
          </div>
        ),
      },
    ];
  };

  const LABEL_JOB = msg().Exp_Lbl_Job;
  const LABEL_CC = msg().Exp_Clbl_CostCenterHeader;
  const shouldDisplay = ({ label, value }) => {
    if (label === LABEL_JOB) return value || diffValues?.jobCode?.original;
    if (label === LABEL_CC)
      return value || diffValues?.costCenterCode?.original;
    return true;
  };
  const reportNumber = `${msg().Exp_Lbl_ReportNo} : ${expRequest.reportNo}`;
  const totalAmount = `${baseCurrencySymbol} ${FormatUtil.formatNumber(
    expRequest.totalAmount,
    baseCurrencyDecimal
  )}`;

  const renderItems = [
    {
      label: msg().Exp_Clbl_RecordDate,
      value: DateUtil.formatYMD(expRequest.accountingDate),
    },
    {
      label: msg().Exp_Clbl_ReportType,
      value: expRequest.expReportTypeName || '',
      key: 'expReportTypeName',
    },
    ...(expRequest.customRequestId ? renderCustomRequestField() : []),
    {
      label: msg().Exp_Clbl_Purpose,
      value: expRequest.purpose || '',
      key: 'purpose',
    },
    {
      label: LABEL_CC,
      value: expRequest.costCenterName
        ? `${expRequest.costCenterCode} - ${expRequest.costCenterName}`
        : '',
      key: 'costCenterCode',
    },
    {
      label: LABEL_JOB,
      value: expRequest.jobName
        ? `${expRequest.jobCode} - ${expRequest.jobName}`
        : '',
      key: 'jobCode',
    },
    ...getVendorInfo(expRequest),
  ];
  const layout = expRequest.fieldCustomLayout;
  const preLayout = _.get(expPreRequest, 'fieldCustomLayout');
  const hasCustomLayout = !_.isEmpty(layout);
  let jobDiffLabel = '';
  const preJobCode = _.get(diffValues, `jobCode.original`);
  if (preJobCode) {
    const preJobName =
      _.get(diffValues, `jobName.original`) || expPreRequest?.jobName;
    jobDiffLabel = `${preJobCode} - ${preJobName}`;
  }

  let costCenterDiffLabel = '';
  const preCostCenterCode = _.get(diffValues, `costCenterCode.original`);
  if (preCostCenterCode) {
    const preCostCenterName =
      _.get(diffValues, `costCenterName.original`) ||
      expPreRequest?.costCenterName;
    costCenterDiffLabel = `${preCostCenterCode} - ${preCostCenterName}`;
  }
  const renderFields = (fields, expPreRequestEIFields = undefined) =>
    fields
      .filter(shouldDisplay)
      .map(
        ({ label, value, extra, key, formatter, id }: Record<string, any>) => {
          let diffValue;
          let highlight =
            !_.isEmpty(expPreRequest) &&
            (expPreRequestEIFields || isDifferent(key, diffValues));
          const isHighlightSettlementAmount =
            isHighlightDiffSetting &&
            key === SETTLEMENT_AMOUNT_KEY &&
            !_.isEmpty(expPreRequest);
          if (highlight && !_.isEmpty(expPreRequest)) {
            if (expPreRequestEIFields) {
              const preItem = expPreRequestEIFields?.find((p) => p.id === id);
              diffValue = _.get(preItem, `value`, '');
              highlight = !_.isEqual(diffValue, value);
            } else if (key === requestToReportMapping.vendorName) {
              diffValue = _.get(diffValues, `${key}.original`);
              const preVendorJctRegistrationNumber = _.get(
                diffValues,
                `${requestToReportMapping.vendorJctRegistrationNumber}.original`
              );
              const preVendorIsJctQualifiedIssuer = _.get(
                expPreRequest,
                'vendorIsJctQualifiedIssuer',
                false
              );

              diffValue += props.useJctRegistrationNumber
                ? `${diffValue ? '\n' : ''}${
                    msg().Exp_Clbl_JctRegistrationNumber
                  }: ${getJctRegistrationNumber(
                    preVendorJctRegistrationNumber,
                    preVendorIsJctQualifiedIssuer
                  )}`
                : '';
            } else if (key === requestToReportMapping.jobCode) {
              diffValue = jobDiffLabel;
            } else if (key === requestToReportMapping.costCenterCode) {
              diffValue = costCenterDiffLabel;
            } else {
              diffValue = _.get(diffValues, `${key}.original`);
            }
          }
          if (formatter) {
            value = formatter(value);
            diffValue = formatter(diffValue);
          }
          return (
            <li key={label} className={`${ROOT}__list-detail-item`}>
              <HorizontalLayout>
                <HorizontalLayout.Label cols={4}>
                  {label}
                </HorizontalLayout.Label>
                {value && (
                  <HorizontalLayout.Body
                    className={
                      highlight && `${ROOT}__list-detail-body-fit-content`
                    }
                    cols={8}
                  >
                    <Highlight
                      highlight={highlight || isHighlightSettlementAmount}
                    >
                      <>
                        {value}
                        {extra || null}
                      </>
                    </Highlight>
                  </HorizontalLayout.Body>
                )}
                {highlight && (
                  <HorizontalLayout.Body
                    className={`${ROOT}__list-detail-body-fit-content ${ROOT}__list-detail-highlight`}
                    cols={8}
                  >
                    <Highlight
                      highlightColor={Color.bgDisabled}
                    >{`(${diffValue})`}</Highlight>
                  </HorizontalLayout.Body>
                )}
              </HorizontalLayout>
            </li>
          );
        }
      );
  const renderLayout = (layout, preLayout) => {
    return layout.map((row, idx) => {
      return (
        <li key={`row-${idx}`} className={`${ROOT}__list-detail-item`}>
          <HorizontalLayout>
            {row.map(({ label, value, extra, id }: Record<string, any>) => {
              let highlight = false;
              let preLayoutRowItem;
              if (preLayout) {
                const preLayoutList = preLayout.flat();
                preLayoutRowItem = preLayoutList.find((ri) => ri.id === id);
                if (preLayoutRowItem !== undefined) {
                  highlight = !_.isEqual(preLayoutRowItem.value || '', value);
                } else if (value) {
                  highlight = props.isHighlightDiffSetting;
                }
              }
              return (
                <div key={label} className="slds-size--4-of-12">
                  <div className={`${ROOT}__extended-item-label`}>{label}</div>
                  <div className={`${ROOT}__extended-item-body`}>
                    <Highlight highlight={highlight}>
                      <>
                        {value}
                        {extra || null}
                      </>
                    </Highlight>
                    {highlight && (
                      <Highlight
                        className={`${ROOT}__list-detail-highlight ${ROOT}__extended-item-body-label-highlight`}
                        highlightColor={Color.bgDisabled}
                      >
                        <>
                          ({_.get(preLayoutRowItem, 'value', '')}
                          {_.get(preLayoutRowItem, 'extra', '')})
                        </>
                      </Highlight>
                    )}
                  </div>
                </div>
              );
            })}
          </HorizontalLayout>
        </li>
      );
    });
  };

  const renderSettlementFields = () => {
    const { settlementAmount, settlementResult } = expRequest;
    const settlementAmountValue = generateSettlementAmount(
      baseCurrencyDecimal,
      baseCurrencySymbol,
      settlementAmount,
      settlementResult
    );
    return {
      label: msg().Exp_Clbl_SettlementAmount,
      value: settlementAmountValue,
      key: SETTLEMENT_AMOUNT_KEY,
    };
  };

  const isShowSettlementAmount =
    expRequest.useCashAdvance || props.alwaysDisplaySettlementAmount;

  return (
    <div className={`${ROOT}__container`}>
      <div className={`${ROOT}__summary-header`}>
        <Text
          size="xl"
          color="primary"
          bold
          className={`${ROOT}__summary-header--summary`}
        >
          {msg().Exp_Lbl_ReportSummary}
        </Text>
        <Text
          size="large"
          color="primary"
          className={`${ROOT}__summary-header--reportnum`}
        >
          {reportNumber}
        </Text>
        <div className={`${ROOT}__summary-header-container`}>
          <Highlight highlight={isDifferent('subject', diffValues)}>
            <Text
              size="large"
              color="primary"
              className={`${ROOT}__summary-header--title`}
            >
              {expRequest.subject}
            </Text>
          </Highlight>
          {isDifferent('subject', diffValues) && (
            <Highlight
              highlight={isDifferent('subject', diffValues)}
              highlightColor={Color.bgDisabled}
            >
              <Text
                size="large"
                color="primary"
                className={`${ROOT}__summary-header--title ${ROOT}__summary-header--title-original`}
              >
                ({diffValues.subject.original})
              </Text>
            </Highlight>
          )}
        </div>
        <div className={`${ROOT}__summary-header--amount-setion`}>
          {renderTotalAmount()}
          {renderSubtotalAmount(expRequest)}
        </div>
      </div>
      <div>
        <ul className={`${ROOT}__list-detail`}>
          <AttachmentPreview
            attachedFileList={expRequest.attachedFileList}
            setSideFile={props.setSideFile}
            hideSideFile={props.hideSideFile}
            isApexView={isApexView}
          />
          {renderFields(renderItems)}
          {hasCustomLayout
            ? renderLayout(
                getCustomLayoutFromEIs(layout, expRequest),
                isHighlightDiff && !_.isEmpty(expPreRequest)
                  ? getCustomLayoutFromEIs(preLayout, expPreRequest)
                  : undefined
              )
            : renderFields(
                getLabelValueFromEIs(expRequest),
                isHighlightDiff && !_.isEmpty(expPreRequest)
                  ? getLabelValueFromEIs(expPreRequest)
                  : undefined
              )}
          {renderFields([
            {
              label: msg().Exp_Clbl_ReportRemarks,
              value: expRequest.remarks || '',
              key: 'remarks',
            },
          ])}
        </ul>
        {expRequest.useCashAdvance && (
          <ul className={`${ROOT}__list-detail ${ROOT}__cash-advance`}>
            {renderFields([
              {
                label: msg().Exp_Clbl_CashAdvanceAmount,
                value: `${baseCurrencySymbol} ${
                  FormatUtil.formatNumber(
                    expRequest.expPreRequest.cashAdvanceAmount,
                    baseCurrencyDecimal
                  ) || 0
                }`,
              },
              {
                label: msg().Exp_Clbl_CashAdvanceDate,
                value:
                  DateUtil.formatYMD(
                    expRequest.expPreRequest.cashAdvanceDate
                  ) || '',
              },
              {
                label: msg().Exp_Clbl_CashAdvanceRequestPurpose,
                value: expRequest.expPreRequest.cashAdvanceRequestPurpose || '',
              },
            ])}
          </ul>
        )}
        {isShowSettlementAmount && (
          <ul className={`${ROOT}__list-detail ${ROOT}__settlement-amount`}>
            {renderFields([renderSettlementFields()])}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Summary;
