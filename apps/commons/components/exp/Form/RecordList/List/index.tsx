import * as React from 'react';

import { find, get, isEmpty, isEqual } from 'lodash';

import { ExpenseReportType } from '../../../../../../domain/models/exp/expense-report-type/list';
import {
  isHotelFee,
  isIcRecord,
  isRecordItemized,
  RECEIPT_TYPE,
  Record,
} from '../../../../../../domain/models/exp/Record';
import { Report, status } from '../../../../../../domain/models/exp/Report';
import { getDetailDisplay } from '../../../../../../domain/models/exp/TransportICCard';

// import Tooltip from '@commons/components/Tooltip';
// import CheckIcon from '@commons/images/icons/CheckIcon.svg';
import DateUtil from '../../../../../utils/DateUtil';
import FormatUtil from '../../../../../utils/FormatUtil';

import IconCheckDetail from '../../../../../images/icons/checkDetail.svg';
import CreditCardIcon from '../../../../../images/icons/creditCard.svg';
import msg from '../../../../../languages';
import SFPopover from '../../../../SFPopover';
import RouteAttentionIcon from '../../RecordItem/TransitJorudanJP/RouteMap/RouteAttentionIcon';
import RecordIcon from '../Icon';
import ItemsDetail from '../ItemsDetail';
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
  isNewReportFromPreRequest?: boolean;

  isSummaryMode: boolean;
  overlap: { record: boolean; report: boolean };
  readOnly: boolean;
  recordIdx: number;
  records: Array<Record>;
  report: Report;
  reportTypeList: Array<ExpenseReportType>;
  selectedExpReport: Report;
  selectedTab: number;
  touched: {
    records: Array<Record>;
  };
  useJctRegistrationNumber: boolean;
  getImage: (arg0: void) => any;
  onChangeCheckBox: (arg0: number) => void;
  onClickRecord: (arg0: number) => void;
};

const REQUIRED_FIELD_NAME = {
  merchant: msg().Exp_Clbl_Merchant,
};

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
    return key && REQUIRED_FIELD_NAME[key]
      ? `${REQUIRED_FIELD_NAME[key]}:`
      : '';
  }

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
    const hasAttachmentBody = item.receiptFileId;
    const hasRemarks = item.items[0].remarks;
    const hasSelectedRoute = item.routeInfo && item.routeInfo.selectedRoute;
    let image = null;
    let iconWithPopover = <div className={`${ROOT}__icon-item-wrapper`} />;
    let displayTooltip = '';
    switch (item.recordType) {
      case 'General':
      case 'HotelFee':
      case 'FixedAllowanceSingle':
      case 'FixedAllowanceMulti':
        if (!isReceiptNotUsed) {
          if (hasAttachmentBody || (hasRemarks && !isReceiptRequired)) {
            image = this.props.getImage().hasEvidence(ROOT, false); // blue
          } else {
            image = this.props.getImage().receipt(); // white
          }
        }

        if (isRecordItemized(item.recordType)) {
          const popoverContent = (
            <ItemsDetail
              record={item}
              baseCurrencySymbol={baseCurrencySymbol}
              baseCurrencyDecimal={baseCurrencyDecimal}
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

    const taxAmount = (
      <>
        <div>{`${baseCurrencySymbol} ${tax}`}</div>
        {!isHotelFee(item.recordType) && (
          <div className={`${ROOT}__item__tax-type`}>
            <div>{`${item.items[0].taxTypeName || ''}`}</div>
            {`${FormatUtil.convertToDisplayingPercent(
              item.items[0].taxRate || 0
            )}`}
          </div>
        )}
      </>
    );

    const subTotal = (
      <div>
        {baseCurrencySymbol} {amount}
      </div>
    );

    const isForeignCurrency = item.items[0].useForeignCurrency;

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

    const recordsErrors = get(this.props.errors, 'records', {});

    const errors = !isEmpty(recordsErrors[i])
      ? Object.values(recordsErrors[i])
      : [];
    const displayErrors = errors.map((x) => typeof x === 'string' && msg()[x]);
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
        .reduce((errorMsg = '', idx: any) => `${errorMsg}${idx}\n`, '');
    }

    // Whether record has error
    const hasError =
      (isReceiptRequired && !hasAttachmentBody) ||
      (!hasAttachmentBody && !hasRemarks && !hasSelectedRoute) ||
      displayTooltip;

    // const hasRecordJctRegistrationNumber =
    //   this.props.useJctRegistrationNumber &&
    //   item.items[0].jctRegistrationNumber;

    return (
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
          {DateUtil.dateFormat(item.recordDate)}
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
            {get(selectedExpReport, `records.${i}.items.0.costCenterName`) ||
              selectedExpReport.costCenterName}
          </div>
        )}
        {isJobUsed && (
          <div className={`${ROOT}__item__job`}>
            {get(selectedExpReport, `records.${i}.items.0.jobName`) ||
              selectedExpReport.jobName}
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
              {item.routeInfo.origin.name}
              &nbsp;-&nbsp;
              {item.routeInfo.arrival.name}
            </div>
          )}
          {isIcRecord(item.recordType) && item.transitIcRecordInfo && (
            <div className={`${ROOT}__detail__ic`}>
              {getDetailDisplay(item.transitIcRecordInfo)}
            </div>
          )}
          {item.items[0].remarks}
        </div>
        <div className={`${ROOT}__item__excl-tax`}>
          {(isForeignCurrency && <>&mdash;</>) ||
            `${baseCurrencySymbol} ${taxExclAmount}`}
        </div>
        <div className={`${ROOT}__item__tax`}>
          {(isForeignCurrency && <>&mdash;</>) || taxAmount}
        </div>
        <div className={`${ROOT}__item__amount`}>
          {subTotal}
          {foreignTotal}
        </div>
      </div>
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
      <div data-testid={ROOT}>
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
        </div>

        {table}
      </div>
    );
  }
}
