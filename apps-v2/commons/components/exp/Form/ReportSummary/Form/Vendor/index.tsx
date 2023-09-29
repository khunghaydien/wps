import * as React from 'react';

import classNames from 'classnames';

import IconCompany from '@apps/commons/images/icons/company.svg';
import IconUser from '@apps/commons/images/icons/user.svg';
import {
  convertDifferenceValues,
  DifferenceValues,
  isDifferent,
} from '@apps/commons/utils/exp/RequestReportDiffUtils';

import { Report } from '../../../../../../../domain/models/exp/Report';
import {
  getJctRegistrationNumber,
  VENDOR_PAYMENT_DUE_DATE_USAGE,
  vendorTypes,
} from '../../../../../../../domain/models/exp/Vendor';

import msg from '../../../../../../languages';
import Button from '../../../../../buttons/Button';
import DateField from '../../../../../fields/DateField';
import LabelWithHint from '../../../../../fields/LabelWithHint';
import MultiColumnsGrid from '../../../../../MultiColumnsGrid';
import QuickSearch, { Option } from '../../../QuickSearch';
import { Errors } from '../..';

const ROOT = 'ts-expenses__form-report-summary__form__vendor';

type Props = {
  errors: Errors;
  expPreRequest?: Report;
  expReport: Report;
  hintMsg?: string;
  isFinanceApproval?: boolean;
  isHighlightDiff?: boolean;
  isRequired: boolean;
  readOnly: boolean;
  showVendorFilter: boolean;
  useJctRegistrationNumber?: boolean;
  getRecentVendors: () => Promise<Option[]>;
  onChangeEditingExpReport: (
    arg0: string,
    arg1: any,
    arg2?: any,
    shouldValidate?: boolean
  ) => void;
  onClickVendorSearch: () => void;
  searchVendors: (keyword?: string) => Promise<Option[]>;
  toggleVendorDetail: (arg0: boolean) => void;
};

const { COMPANY, PERSONAL } = vendorTypes;

const vendorFilters = [
  {
    label: msg().Exp_Lbl_Personal,
    value: PERSONAL,
    isChecked: true,
    icon: <IconUser />,
  },
  {
    label: msg().Com_Lbl_Company,
    value: COMPANY,
    isChecked: true,
    icon: <IconCompany />,
  },
];

export default class ReportSummaryFormVendor extends React.Component<Props> {
  componentDidUpdate(prevProps: Props) {
    const { expReport, toggleVendorDetail } = this.props;
    const isReportChanged = prevProps.expReport.reportId !== expReport.reportId;
    const isVendorChanged = prevProps.expReport.vendorId !== expReport.vendorId;
    const isReportTypeChanged =
      prevProps.expReport.expReportTypeId !== expReport.expReportTypeId;

    if (isReportChanged || isReportTypeChanged || isVendorChanged) {
      toggleVendorDetail(false);
    }
  }

  onChangePaymentDate = (value: string) => {
    this.props.onChangeEditingExpReport(`report.paymentDueDate`, value, true);
  };

  handleChangeVendor = () => {
    this.props.toggleVendorDetail(false);
    this.props.onChangeEditingExpReport('report.vendorId', null, true);
    this.props.onChangeEditingExpReport('report.paymentDueDateUsage', null);
    this.props.onChangeEditingExpReport('report.paymentDueDate', null);
    if (this.props.useJctRegistrationNumber) {
      this.props.onChangeEditingExpReport(
        `report.vendorJctRegistrationNumber`,
        null
      );
      this.props.onChangeEditingExpReport(
        `report.vendorIsJctQualifiedIssuer`,
        false,
        true,
        false
      );
    }
  };

  getDiffValues = (): DifferenceValues => {
    let diffValues = {};
    const { expReport, expPreRequest, isHighlightDiff } = this.props;
    if (isHighlightDiff) {
      const diffMapping = {
        vendorId: 'vendorId',
        paymentDueDate: 'paymentDueDate',
      };
      diffValues = convertDifferenceValues(
        diffMapping,
        expReport,
        expPreRequest
      );
    }
    return diffValues;
  };

  render() {
    const {
      isRequired,
      expReport,
      readOnly,
      errors,
      hintMsg,
      showVendorFilter,
    } = this.props;

    const showPaymentDate =
      expReport.vendorId &&
      expReport.paymentDueDateUsage !== VENDOR_PAYMENT_DUE_DATE_USAGE.NotUsed;
    const paymentDateRequired =
      expReport.paymentDueDateUsage === VENDOR_PAYMENT_DUE_DATE_USAGE.Required;

    const onSelectVendor = (x: Option) => {
      if (!x.id) {
        this.handleChangeVendor();
        return;
      }
      this.props.onChangeEditingExpReport(`report.vendorId`, x.id, true);
      this.props.onChangeEditingExpReport(
        `report.vendorName`,
        x.name,
        true,
        false
      );
      this.props.onChangeEditingExpReport(
        `report.vendorCode`,
        x.code,
        true,
        false
      );
      this.props.onChangeEditingExpReport(
        `report.paymentDueDateUsage`,
        x.paymentDueDateUsage,
        true,
        false
      );
      this.props.onChangeEditingExpReport(
        'report.paymentDueDate',
        '',
        true,
        false
      );
      if (this.props.useJctRegistrationNumber) {
        this.props.onChangeEditingExpReport(
          `report.vendorJctRegistrationNumber`,
          x.jctRegistrationNumber,
          true,
          false
        );
        this.props.onChangeEditingExpReport(
          `report.vendorIsJctQualifiedIssuer`,
          x.isJctQualifiedInvoiceIssuer,
          true,
          false
        );
      }
    };

    const displayValue = expReport.vendorId
      ? `${expReport.vendorCode} - ${expReport.vendorName}`
      : '';

    const placeHolder = msg().Com_Lbl_PressEnterToSearch;

    const diffValues = this.getDiffValues();

    const vendorArea = (
      <MultiColumnsGrid className={`${ROOT}`} sizeList={[6, 6]}>
        <div
          className={`${ROOT}-input ts-text-field-container`}
          data-testid={ROOT}
        >
          <LabelWithHint
            text={msg().Exp_Clbl_Vendor}
            hintMsg={(!readOnly && hintMsg) || ''}
            isRequired={isRequired}
          />
          <QuickSearch
            ROOT={ROOT}
            filters={showVendorFilter ? vendorFilters : []}
            isSkipRecentlyUsed={this.props.isFinanceApproval}
            disabled={readOnly}
            placeholder={placeHolder}
            selectedId={expReport.vendorId}
            targetDate={''}
            displayValue={displayValue}
            onSelect={onSelectVendor}
            getRecentlyUsedItems={this.props.getRecentVendors}
            getSearchResult={this.props.searchVendors}
            openSearchDialog={this.props.onClickVendorSearch}
            isHighlight={isDifferent('vendorId', diffValues)}
            useJctRegistrationNumber={this.props.useJctRegistrationNumber}
          />
          {expReport.vendorId && (
            <MultiColumnsGrid sizeList={[3, 9]}>
              <Button
                className={`${ROOT}-btn--viewDetail`}
                onClick={() => this.props.toggleVendorDetail(true)}
              >
                {msg().Exp_Btn_VendorDetail}
              </Button>
              {this.props.useJctRegistrationNumber && (
                <div className={`${ROOT}--jct-number`}>
                  {`${
                    msg().Exp_Clbl_JctRegistrationNumber
                  }: ${getJctRegistrationNumber(
                    expReport.vendorJctRegistrationNumber,
                    expReport.vendorIsJctQualifiedIssuer
                  )}`}
                </div>
              )}
            </MultiColumnsGrid>
          )}
          {errors.vendorId && (
            <div className="input-feedback">{msg()[errors.vendorId]}</div>
          )}
        </div>

        {showPaymentDate && (
          <div className="ts-text-field-container">
            <p className="key">
              {paymentDateRequired && <span className="is-required">*</span>}
              &nbsp;{msg().Exp_Clbl_PaymentDate}
            </p>

            <DateField
              value={expReport.paymentDueDate}
              onChange={this.onChangePaymentDate}
              disabled={readOnly}
              className={classNames({
                'highlight-bg': isDifferent('paymentDueDate', diffValues),
              })}
            />

            {errors.paymentDueDate && (
              <div className="input-feedback">
                {msg()[errors.paymentDueDate]}
              </div>
            )}
          </div>
        )}
      </MultiColumnsGrid>
    );

    return vendorArea;
  }
}
