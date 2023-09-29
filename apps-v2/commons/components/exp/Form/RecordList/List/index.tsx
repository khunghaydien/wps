import * as React from 'react';

import { find, get, isEmpty, isEqual } from 'lodash';

import Highlight from '@apps/commons/components/exp/Highlight';
import {
  convertDifferenceValues,
  DifferenceValues,
  isDifferent,
} from '@apps/commons/utils/exp/RequestReportDiffUtils';
import TextUtil from '@apps/commons/utils/TextUtil';
import Tooltip from '@commons/components/Tooltip';
import ImgIconAttention from '@commons/images/icons/attention.svg';

// import CheckIcon from '@commons/images/icons/CheckIcon.svg';
import { ExpenseReportType } from '../../../../../../domain/models/exp/expense-report-type/list';
import {
  calculateTotalTaxes,
  isIcRecord,
  isItemizedRecord,
  isMileageRecord,
  isUseWithholdingTax,
  RECEIPT_TYPE,
  Record,
  RECORD_TYPE,
} from '../../../../../../domain/models/exp/Record';
import { Report, status } from '../../../../../../domain/models/exp/Report';
import { getDetailDisplay } from '../../../../../../domain/models/exp/TransportICCard';
import { MileageDestinationInfo } from '@apps/domain/models/exp/Mileage';

import DateUtil from '../../../../../utils/DateUtil';
import FormatUtil from '../../../../../utils/FormatUtil';

import IconCheckDetail from '../../../../../images/icons/checkDetail.svg';
import CreditCardIcon from '../../../../../images/icons/creditCard.svg';
import msg from '../../../../../languages';
import SFPopover from '../../../../SFPopover';
import { RECORD_ATTACHMENT_MAX_COUNT_ERROR } from '../../RecordItem/RecordReceipt';
import RouteAttentionIcon from '../../RecordItem/TransitJorudanJP/RouteMap/RouteAttentionIcon';
import RecordIcon from '../Icon';
import ItemizationDetail from '../ItemsDetail/Itemization';
import TaxWithholdingDetail from '../ItemsDetail/TaxWithholding';
import MultiTaxItemsPopover from '../MultiTaxItemsPopover';
import RecordsSummary from './RecordsSummary';

import './index.scss';

const ROOT = 'ts-expenses__form-records__list';
const CHECKBOX_CLASS = `${ROOT}__item__wrapbox__checkbox__input`;

type Props = {
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  checkboxes: Array<number>;
  errors: {
    accountingDate?: string;
    records: Array<Record>;
  };
  isErrDisplay: boolean;
  isExpenseRequest?: boolean;
  isFinanceApproval?: boolean;
  isHighlightDiff?: boolean;
  isNewReportFromPreRequest?: boolean;

  isSummaryMode: boolean;
  overlap: { record: boolean; report: boolean };
  readOnly: boolean;
  recordIdx: number;
  records: Array<Record>;
  report: Report;
  reportTypeList: Array<ExpenseReportType>;
  selectedExpPreRequest?: Report;
  selectedExpReport: Report;
  selectedTab: number;
  touched: {
    records: Array<Record>;
  };
  useJctRegistrationNumber?: boolean;
  getImage: (arg0: void) => any;
  onChangeCheckBox: (arg0: number) => void;
  onClickRecord: (arg0: number) => void;
};

const REQUIRED_FIELD_NAME = {
  paymentMethodId: msg().Exp_Clbl_PaymentMethod,
  withholdingTaxAmount: msg().Exp_Clbl_WithholdingTaxAmount,
  merchant: msg().Exp_Clbl_Merchant,
};

export const AMOUNT_MATCH_VALUE_LABEL =
  'Exp_Lbl_AmountOfAllTaxTypesDoNotAddUpToTotal';

export default class RecordsList extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    if (
      this.props.overlap?.record &&
      this.props.recordIdx === nextProps.recordIdx &&
      this.props.readOnly === nextProps.readOnly
    ) {
      return false;
    }
    return (
      !this.props.readOnly ||
      !isEmpty(this.props.report.preRequest) ||
      this.props.readOnly !== nextProps.readOnly ||
      !isEqual(this.props.errors, nextProps.errors)
    );
  }

  getRecordItemFieldName(key: string, i: number) {
    const { report } = this.props;
    const expRecord = get(report, `records.${i}.items.0`, {});
    if (key.includes('extendedItem')) {
      const eiPrefix = key.substring(0, key.indexOf('Value'));
      return get(expRecord, `${eiPrefix}Info.name`, '').concat(':');
    }
    if (['amount', 'localAmount'].includes(key)) {
      return '';
    }
    return key && REQUIRED_FIELD_NAME[key]
      ? `${REQUIRED_FIELD_NAME[key]}:`
      : '';
  }

  getDiffItems = (item: Record, preRecord: Record, fieldName: string) => {
    const { selectedExpPreRequest, selectedExpReport } = this.props;
    // get costcenter/job values from report/pre-report if record does not have it
    const finalPath = item.items[0][fieldName]
      ? `items[0].${fieldName}`
      : fieldName;

    const originalPath = preRecord.items[0][fieldName]
      ? `items[0].${fieldName}`
      : fieldName;

    const preValues = preRecord.items[0][fieldName]
      ? preRecord
      : selectedExpPreRequest;
    const values = item.items[0][fieldName] ? item : selectedExpReport;

    return {
      diffMapping: {
        [finalPath]: originalPath,
      },
      values,
      preValues,
    };
  };

  getDiffValues = (
    item: Record,
    isHighlightNewRecord: boolean
  ): DifferenceValues => {
    const { selectedExpPreRequest, isHighlightDiff } = this.props;
    const preRequestRecords = get(selectedExpPreRequest, 'records', []);
    let diffValues = {};

    if (
      isHighlightDiff &&
      !isHighlightNewRecord &&
      !isEmpty(preRequestRecords)
    ) {
      const preRecord: Record = preRequestRecords.find(
        (record) => record.recordId === item.expPreRequestRecordId
      );

      const diffMapping = {
        'items[0].recordDate': 'items[0].recordDate',
        'items[0].remarks': 'items[0].remarks',
        'items[0].withoutTax': 'items[0].withoutTax',
        'items[0].taxTypeName': 'items[0].taxTypeName',
        'items[0].gstVat': 'items[0].gstVat',
        'items[0].taxRate': 'items[0].taxRate',
        'items[0].amount': 'items[0].amount',
        'routeInfo.origin.name': 'routeInfo.origin.name',
        'routeInfo.arrival.name': 'routeInfo.arrival.name',
      };
      const recordDiffValues = convertDifferenceValues(
        diffMapping,
        item,
        preRecord
      );

      // cost center
      const costCenterDiffItems = this.getDiffItems(
        item,
        preRecord,
        'costCenterHistoryId'
      );
      const costCenterDiffValues = convertDifferenceValues(
        costCenterDiffItems.diffMapping,
        costCenterDiffItems.values,
        costCenterDiffItems.preValues
      );

      // job
      const jobDiffItems = this.getDiffItems(item, preRecord, 'jobId');
      const jobDiffValues = convertDifferenceValues(
        jobDiffItems.diffMapping,
        jobDiffItems.values,
        jobDiffItems.preValues
      );

      // milaege
      let isMileageDiff = false;
      if (isMileageRecord(item.recordType)) {
        const destinations = get(item, 'mileageRouteInfo.destinations', []);
        const preExpDestinations = get(
          preRecord,
          'mileageRouteInfo.destinations',
          []
        );
        if (
          preExpDestinations &&
          destinations.length !== preExpDestinations.length
        ) {
          // case where destinations is different by number of destinations
          isMileageDiff = true;
        } else {
          // case where we need to check each field to see if any destination is different
          isMileageDiff = destinations.some((destination, idx) => {
            const { name } = destination;
            const preRecordDestination = get(preExpDestinations, idx);
            const { name: preRecordName } = preRecordDestination;
            return !isEqual(name, preRecordName);
          });
        }
      }

      diffValues = Object.assign(
        recordDiffValues,
        costCenterDiffValues,
        jobDiffValues,
        { isMileageDiff }
      );
    }
    return diffValues;
  };

  renderItem = (
    item: Record,
    i: number,
    isCostCenterUsed: boolean,
    isJobUsed: boolean,
    isCreatingNew: boolean
  ) => {
    const {
      report,
      isErrDisplay,
      selectedExpReport,
      baseCurrencySymbol,
      baseCurrencyDecimal,
      isHighlightDiff,
    } = this.props;
    const isNewRecord = item ? !item.recordId : true;
    // valid if it has preRequestId and no reportId
    const isValidRequest = report.preRequestId && !report.reportId;

    // Do not show new record in RecordList
    if (isNewRecord && !isValidRequest) {
      return null;
    }

    const isActive = i === this.props.recordIdx ? 'active' : '';
    const isChecked = this.props.checkboxes.indexOf(i) > -1;
    const isReceiptRequired = item.fileAttachment === RECEIPT_TYPE.Required;
    const isReceiptNotUsed = item.fileAttachment === RECEIPT_TYPE.NotUsed;
    const hasAttachmentBody = !isEmpty(item.receiptList);
    const hasRemarks = item.items[0].remarks;
    const hasSelectedRoute = item.routeInfo && item.routeInfo.selectedRoute;
    let image = null;
    let iconWithPopover = <div className={`${ROOT}__icon-item-wrapper`} />;
    let rightDetailPopover = <div className={`${ROOT}__icon-item-wrapper`} />;
    let displayTooltip = '';
    let mileageContent = <div className={`${ROOT}__icon-item-wrapper`} />;

    const recordItem = item.items[0];
    const isMultipleTax = recordItem?.taxItems?.length > 0;

    switch (item.recordType) {
      case 'General':
      case 'FixedAllowanceSingle':
      case 'FixedAllowanceMulti':
        if (!isReceiptNotUsed) {
          if (hasAttachmentBody || (hasRemarks && !isReceiptRequired)) {
            image = this.props.getImage().hasEvidence(ROOT, false); // blue
          } else {
            image = this.props.getImage().receipt(); // white
          }
        }

        const isItemized = isItemizedRecord(item.items.length);
        if (isItemized) {
          const popoverContent = (
            <ItemizationDetail
              baseCurrencySymbol={baseCurrencySymbol}
              baseCurrencyDecimal={baseCurrencyDecimal}
              items={item.items}
            />
          );

          iconWithPopover = (
            <SFPopover
              align="top left"
              triggerAction="hover"
              hasStaticAlignment
              body={popoverContent}
              triggerClassName={`${ROOT}__icon-item-wrapper`}
            >
              <button type="button" className={`${ROOT}__icon-item-btn`}>
                <IconCheckDetail
                  className={`${ROOT}__icon-item-btn-icon`}
                  aria-hidden="true"
                />
              </button>
            </SFPopover>
          );
        }

        if (isUseWithholdingTax(item.withholdingTaxUsage)) {
          const popoverContent = (
            <TaxWithholdingDetail
              baseCurrencyDecimal={baseCurrencyDecimal}
              baseCurrencySymbol={baseCurrencySymbol}
              record={item}
            />
          );
          rightDetailPopover = (
            <SFPopover
              align="top right"
              triggerAction="hover"
              hasStaticAlignment
              body={popoverContent}
              triggerClassName={`${ROOT}__icon-item-wrapper`}
            >
              <button type="button" className={`${ROOT}__icon-item-btn`}>
                <IconCheckDetail
                  className={`${ROOT}__icon-item-btn-icon`}
                  aria-hidden="true"
                />
              </button>
            </SFPopover>
          );
        }

        if (item.recordType === RECORD_TYPE.General) {
          iconWithPopover =
            isMultipleTax && !isItemized ? (
              <SFPopover
                align="top left"
                triggerAction="hover"
                hasStaticAlignment
                body={
                  <MultiTaxItemsPopover
                    recordDate={recordItem.recordDate}
                    expTypeName={recordItem.expTypeName}
                    taxItems={recordItem.taxItems}
                    baseCurrencySymbol={baseCurrencySymbol}
                    baseCurrencyDecimal={baseCurrencyDecimal}
                  />
                }
                triggerClassName={`${ROOT}__icon-item-wrapper`}
              >
                <button type="button" className={`${ROOT}__icon-item-btn`}>
                  <IconCheckDetail
                    className={`${ROOT}__icon-item-btn-icon`}
                    aria-hidden="true"
                  />
                </button>
              </SFPopover>
            ) : (
              iconWithPopover
            );
        }

        break;
      case RECORD_TYPE.Mileage:
        const destinations = (
          get(
            item,
            'mileageRouteInfo.destinations',
            []
          ) as Array<MileageDestinationInfo>
        )
          .map((d) => d.name)
          .join(' - ');
        mileageContent = (
          <div className={`${ROOT}__tooltip`}>
            <Tooltip
              id={`${ROOT}__tooltip`}
              align="bottom"
              content={
                <div className={`${ROOT}__tooltip-msg`}>{destinations}</div>
              }
              style={{ display: 'inline-block' }}
            >
              <div className={`${ROOT}__detail__mileage`}>{destinations}</div>
            </Tooltip>
          </div>
        );
        break;
      case 'TransitJorudanJP':
        if (hasSelectedRoute) {
          image = this.props.getImage().hasEvidence(ROOT, true);
        } else {
          image = this.props.getImage().routeSelected();
        }

        break;
      case 'TransportICCardJP':
        const isNotLinked = !item.transitIcRecordId;
        image = this.props.getImage().ic(ROOT, isNotLinked);
        break;
      default:
        break;
    }

    if (item.creditCardTransactionId) {
      image = <CreditCardIcon />;
    }

    // diff view
    let diffValues = {};
    const isHighlightNewRecord = item.expPreRequestRecordId === null;
    diffValues = this.getDiffValues(item, isHighlightNewRecord);

    // @ts-ignore
    const isMileageDiff = diffValues.isMileageDiff;

    const amount = FormatUtil.formatNumber(
      item.items[0].amount,
      baseCurrencyDecimal
    );
    const tax = FormatUtil.formatNumber(
      item.items[0].gstVat,
      baseCurrencyDecimal
    );
    const taxExclAmount = FormatUtil.formatNumber(
      item.items[0].withoutTax,
      baseCurrencyDecimal
    );

    const isHighlight = isHighlightDiff && !isHighlightNewRecord;
    const isForeignCurrency = item.items[0].useForeignCurrency;
    const isNegative = isForeignCurrency
      ? item.items[0].localAmount < 0
      : item.items[0].amount < 0;

    const taxAmount = (
      <>
        <div>
          <Highlight
            className={`${ROOT}__highlight-field`}
            highlight={
              isHighlight && isDifferent('items[0].gstVat', diffValues)
            }
          >
            {`${baseCurrencySymbol} ${tax}`}
          </Highlight>
        </div>
        {!isMultipleTax && (
          <div className={`${ROOT}__item__tax-type`}>
            <Highlight
              className={`${ROOT}__highlight-field`}
              highlight={
                isHighlight &&
                (isDifferent('items[0].taxTypeName', diffValues) ||
                  isDifferent('items[0].taxRate', diffValues))
              }
            >
              <>
                {`${
                  item.items[0].taxTypeName || ''
                } ${FormatUtil.convertToDisplayingPercent(
                  item.items[0].taxRate || 0
                )}`}
              </>
            </Highlight>
          </div>
        )}
      </>
    );

    const subTotal = (
      <div>
        {baseCurrencySymbol} {amount}
        {isNegative && (
          <Tooltip
            id={`${ROOT}__tooltip`}
            align="top right"
            content={TextUtil.template(
              msg().Exp_Lbl_NegativeAmount,
              isForeignCurrency
                ? msg().Exp_Clbl_LocalAmount
                : msg().Exp_Clbl_IncludeTax
            )}
            style={{ display: 'inline-block', marginLeft: '4px' }}
          >
            <ImgIconAttention />
          </Tooltip>
        )}
      </div>
    );

    let foreignTotal = null;
    if (isForeignCurrency) {
      const foreignSymbol = get(item, 'items.0.currencyInfo.symbol', '');
      const foreignDecimal = get(item, 'items.0.currencyInfo.decimalPlaces', 0);
      const foreignAmount = FormatUtil.formatNumber(
        item.items[0].localAmount,
        foreignDecimal
      );

      foreignTotal = (
        <div className={`${ROOT}__foreign-total`}>
          {foreignSymbol} {foreignAmount}
        </div>
      );
    }

    // enable record if isNewReport
    const recordItemBtnReadOnly = this.props.isNewReportFromPreRequest
      ? false
      : this.props.readOnly;

    const isDisabled =
      this.props.errors.accountingDate || recordItemBtnReadOnly || isCreatingNew
        ? 'is-disabled'
        : '';

    // for multiple fixed allowance, append amount option lable
    let expTypeName = item.items[0].expTypeName;
    if (
      item.recordType === 'FixedAllowanceMulti' &&
      item.items[0].fixedAllowanceOptionLabel
    ) {
      expTypeName = `${item.items[0].expTypeName} : ${item.items[0].fixedAllowanceOptionLabel}`;
    }

    const taxItems = get(item, 'items.0.taxItems') || [];
    const { totalAmountInclTax } = calculateTotalTaxes(
      taxItems,
      baseCurrencyDecimal
    );

    const recordsErrors = get(this.props.errors, 'records', {});

    const errors = !isEmpty(recordsErrors[i])
      ? Object.values(recordsErrors[i])
      : [];

    const recordErrorKeys = !isEmpty(recordsErrors[i])
      ? Object.keys(recordsErrors[i])
      : [];

    const displayErrors = errors.map((x) => {
      if (typeof x === 'string' && x === AMOUNT_MATCH_VALUE_LABEL) {
        return TextUtil.template(
          msg().Exp_Lbl_AmountOfAllTaxTypesDoNotAddUpToTotal,
          `${baseCurrencySymbol}${FormatUtil.formatNumber(
            totalAmountInclTax,
            baseCurrencyDecimal
          )}`
        );
      }
      return typeof x === 'string' && msg()[x];
    });
    const itemErrors = get(recordsErrors, `${i}.items.0`, {});

    // For Extended Item Only
    if (typeof itemErrors !== 'string' && !isEmpty(itemErrors)) {
      const itemErrorsValue = Object.keys(itemErrors).map(
        (key) =>
          `${this.getRecordItemFieldName(key, i)}${msg()[itemErrors[key]]}`
      );
      displayErrors.push(...itemErrorsValue);
    }

    // Render the error
    if (!isEmpty(displayErrors)) {
      displayTooltip = displayErrors
        .filter((x) => typeof x === 'string')
        .reduce((errorMsg = '', message: any, idx: number) => {
          const field = errors[idx];
          if (
            typeof field === 'string' &&
            field === RECORD_ATTACHMENT_MAX_COUNT_ERROR &&
            recordErrorKeys[idx] === 'receiptList'
          ) {
            return errorMsg;
          }
          if (typeof field === 'string' && field === 'Common_Err_Required') {
            // for record required errors only
            const fieldName = REQUIRED_FIELD_NAME[recordErrorKeys[idx]];
            return `${errorMsg}${message} ${fieldName}\n`;
          }
          return `${errorMsg}${message}\n`;
        }, '');
    }

    // Whether record has error
    const hasError =
      (isReceiptRequired && !hasAttachmentBody) ||
      (!hasAttachmentBody && !hasRemarks && !hasSelectedRoute) ||
      !!displayTooltip;

    // const hasRecordJctRegistrationNumber =
    //   this.props.useJctRegistrationNumber &&
    //   item.items[0].jctRegistrationNumber;

    return (
      <Highlight
        className={`${ROOT}__highlight`}
        highlight={isHighlightDiff && isHighlightNewRecord}
      >
        <div
          key={`record${i}`}
          className={`${ROOT}__item ${isActive} ${isDisabled}`}
          onClick={(e) => {
            if (!((e.target as any).className === CHECKBOX_CLASS)) {
              this.props.onClickRecord(i);
            }
          }}
        >
          {hasError && isErrDisplay ? (
            <RecordIcon
              idx={i}
              errors={this.props.errors}
              touched={this.props.touched}
              tooltip={displayTooltip}
              className={`${ROOT}__item__wrapbox__icon`}
            />
          ) : (
            <div className={`${ROOT}__item__wrapbox__icon`} />
          )}

          <div className={`${ROOT}__item__wrapbox__checkbox`}>
            <input
              type="checkbox"
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onChange={() => this.props.onChangeCheckBox(i)}
              checked={isChecked}
              disabled={
                this.props.readOnly ||
                this.props.selectedExpReport.status === status.PENDING ||
                this.props.isFinanceApproval ||
                this.props.selectedTab === 1
              }
              className={CHECKBOX_CLASS}
            />
          </div>

          {iconWithPopover}

          <div className={`${ROOT}__item__date`}>
            <Highlight
              className={`${ROOT}__highlight-field`}
              highlight={
                isHighlight && isDifferent('items[0].recordDate', diffValues)
              }
            >
              {`${DateUtil.dateFormat(item.recordDate)} ${DateUtil.customFormat(
                item.recordDate,
                '(ddd)'
              )}`}
            </Highlight>
          </div>
          <div className={`${ROOT}__item__type`}>{expTypeName}</div>
          {this.props.isExpenseRequest ? null : (
            <div className={`${ROOT}__item__proof`}>
              {image}
              {/* {hasRecordJctRegistrationNumber && (
                <Tooltip
                  align="top right"
                  content={
                    <div className={`${ROOT}__tooltipMsg`}>
                      {item.items[0]?.jctRegistrationNumber}
                    </div>
                  }
                >
                  <CheckIcon className={`${ROOT}__appear`} />
                </Tooltip>
              )} */}
            </div>
          )}
          {isCostCenterUsed && (
            <div className={`${ROOT}__item__cost-center`}>
              <Highlight
                className={`${ROOT}__highlight-field`}
                highlight={
                  (isHighlight &&
                    isDifferent('items[0].costCenterHistoryId', diffValues)) ||
                  isDifferent('costCenterHistoryId', diffValues)
                }
              >
                {get(
                  selectedExpReport,
                  `records.${i}.items.0.costCenterName`
                ) || selectedExpReport.costCenterName}
              </Highlight>
            </div>
          )}
          {isJobUsed && (
            <div className={`${ROOT}__item__job`}>
              <Highlight
                className={`${ROOT}__highlight-field`}
                highlight={
                  isHighlight &&
                  (isDifferent('items[0].jobId', diffValues) ||
                    isDifferent('jobId', diffValues))
                }
              >
                {get(selectedExpReport, `records.${i}.items.0.jobName`) ||
                  selectedExpReport.jobName}
              </Highlight>
            </div>
          )}
          <div className={`${ROOT}__item__remark`}>
            {item.routeInfo && item.routeInfo.origin && item.routeInfo.arrival && (
              <div className={`${ROOT}__detail__route`}>
                <div className={`${ROOT}__status`}>
                  <RouteAttentionIcon
                    isRoundTrip={item.routeInfo.roundTrip}
                    item={item.routeInfo.selectedRoute}
                  />
                </div>
                <Highlight
                  className={`${ROOT}__highlight-field`}
                  highlight={
                    isHighlight &&
                    isDifferent('routeInfo.origin.name', diffValues)
                  }
                >
                  {item.routeInfo.origin.name}
                </Highlight>
                &nbsp;-&nbsp;
                <Highlight
                  className={`${ROOT}__highlight-field`}
                  highlight={
                    isHighlight &&
                    isDifferent('routeInfo.arrival.name', diffValues)
                  }
                >
                  {item.routeInfo.arrival.name}
                </Highlight>
              </div>
            )}
            {isIcRecord(item.recordType) && item.transitIcRecordInfo && (
              <div className={`${ROOT}__detail__ic`}>
                {getDetailDisplay(item.transitIcRecordInfo)}
              </div>
            )}
            {isMileageRecord(item.recordType) && (
              <Highlight highlight={isHighlight && isMileageDiff}>
                {mileageContent}
              </Highlight>
            )}
            <Highlight
              className={`${ROOT}__highlight-field`}
              highlight={
                isHighlight && isDifferent('items[0].remarks', diffValues)
              }
            >
              {item.items[0].remarks}
            </Highlight>
          </div>
          <div className={`${ROOT}__item__excl-tax`}>
            {(isForeignCurrency && <>&mdash;</>) || (
              <Highlight
                className={`${ROOT}__highlight-field`}
                highlight={
                  isHighlight && isDifferent('items[0].withoutTax', diffValues)
                }
              >
                {`${baseCurrencySymbol} ${taxExclAmount}`}
              </Highlight>
            )}
          </div>
          <div className={`${ROOT}__item__tax`}>
            {(isForeignCurrency && <>&mdash;</>) || taxAmount}
          </div>
          <div className={`${ROOT}__item__amount`}>
            <Highlight
              className={`${ROOT}__highlight-field`}
              highlight={
                isHighlight && isDifferent('items[0].amount', diffValues)
              }
            >
              <>
                {subTotal}
                {foreignTotal}
              </>
            </Highlight>
          </div>
          {rightDetailPopover}
        </div>
      </Highlight>
    );
  };

  render() {
    const { reportTypeList, selectedExpReport, isSummaryMode } = this.props;
    const currentReportType = find(reportTypeList, [
      'id',
      selectedExpReport.expReportTypeId,
    ]);
    const isCostCenterUsed =
      get(currentReportType, 'isCostCenterRequired', 'UNUSED') !== 'UNUSED';
    const isJobUsed =
      get(currentReportType, 'isJobRequired', 'UNUSED') !== 'UNUSED';

    const newRecord = this.props.records.find(({ recordId }) => !recordId);
    const isCreatingNew = !!newRecord;

    let table;

    if (this.props.records.length === 0) {
      table = (
        <div className={`${ROOT}__empty`}>{msg().Exp_Msg_CreateNewRecord}</div>
      );
    } else if (isSummaryMode) {
      table = (
        <RecordsSummary
          records={this.props.records}
          renderItem={this.renderItem}
          isCreatingNew={isCreatingNew}
          isCostCenterUsed={isCostCenterUsed}
          isJobUsed={isJobUsed}
          isExpenseRequest={this.props.isExpenseRequest}
          isApprovedRequest={
            this.props.report.preRequestId && !this.props.report.reportId
          }
          baseCurrencyDecimal={this.props.baseCurrencyDecimal}
          baseCurrencySymbol={this.props.baseCurrencySymbol}
        />
      );
    } else {
      table = this.props.records.map((item, i) =>
        this.renderItem(item, i, isCostCenterUsed, isJobUsed, isCreatingNew)
      );
    }

    return (
      <div data-testid={ROOT} className={`${ROOT}__container`}>
        <div className={`${ROOT}__item__header`}>
          <div className={`${ROOT}__item__wrapbox__checkbox`}>
            {/* <input type="checkbox" /> */}
          </div>
          <RecordIcon className={`${ROOT}__item__wrapbox__icon`} idx={0} />
          <div className={`${ROOT}__item__sub-item`} />
          <div className={`${ROOT}__item__date`}>{msg().Exp_Clbl_Date}</div>
          <div className={`${ROOT}__item__type`}>
            {msg().Exp_Clbl_ExpenseType}
          </div>
          {this.props.isExpenseRequest ? null : (
            <div className={`${ROOT}__item__proof`}>
              {msg().Exp_Lbl_Evidence}
            </div>
          )}
          {isCostCenterUsed && (
            <div className={`${ROOT}__item__cost-center`}>
              {msg().Exp_Clbl_CostCenter}
            </div>
          )}
          {isJobUsed && (
            <div className={`${ROOT}__item__job`}>{msg().Exp_Lbl_Job}</div>
          )}
          <div className={`${ROOT}__item__remark`}>{msg().Exp_Lbl_Detail}</div>
          <div className={`${ROOT}__item__excl-tax`}>
            {msg().Exp_Clbl_WithoutTax}
          </div>
          <div className={`${ROOT}__item__tax`}>{msg().Exp_Clbl_GstAmount}</div>
          <div className={`${ROOT}__item__amount`}>{msg().Exp_Clbl_Amount}</div>
          <RecordIcon className={`${ROOT}__item__wrapbox__icon`} idx={0} />
        </div>

        {table}
      </div>
    );
  }
}
