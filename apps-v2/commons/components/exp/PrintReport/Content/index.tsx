import React from 'react';

import isEmpty from 'lodash/isEmpty';

import MultiColumnsGrid from '@apps/commons/components/MultiColumnsGrid';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';

import { ExpenseReportType } from '@apps/domain/models/exp/expense-report-type/list';
import {
  getCustomLayoutFromEIs,
  getLabelValueFromEIs,
} from '@apps/domain/models/exp/ExtendedItem';
import {
  getDisplayOfVendorCCJob,
  Report,
} from '@apps/domain/models/exp/Report';

import './index.scss';

export type Props = {
  report: Report;
  selectedReportType: ExpenseReportType;
};

const ROOT = 'expenses-pc-print-print-report-content';

const Content = ({ report, selectedReportType }: Props) => {
  const { paymentDueDateUsage, vendorId, expReportTypeName } = report;
  const { isVendorVisible, isCostCenterVisible, isJobVisible } =
    getDisplayOfVendorCCJob(selectedReportType);
  // empty-valued payment due date displays only when it's used and vendor is selected
  const isPaymentDateVisible = vendorId && paymentDueDateUsage !== 'NotUsed';
  const rowOne = [
    {
      label: msg().Exp_Clbl_ReportType,
      value: expReportTypeName,
    },
    {
      label: msg().Exp_Clbl_RecordDate,
      value: DateUtil.dateFormat(report.accountingDate),
    },
    {
      label: msg().Exp_Clbl_ReportRemarks,
      value: report.remarks,
    },
  ];
  const rowTwo = [
    isCostCenterVisible
      ? {
          label: msg().Exp_Clbl_CostCenterHeader,
          value: report.costCenterName,
          code: report.costCenterCode,
        }
      : {},
    isJobVisible
      ? {
          label: msg().Exp_Lbl_Job,
          value: report.jobName,
          code: report.jobCode,
        }
      : {},
    isVendorVisible
      ? {
          label: msg().Exp_Clbl_Vendor,
          value: report.vendorId && report.vendorName,
          code: report.vendorId && report.vendorCode,
        }
      : {},
    isPaymentDateVisible
      ? {
          label: msg().Exp_Clbl_PaymentDate,
          value: DateUtil.dateFormat(report.paymentDueDate),
        }
      : {},
  ];
  const layout = report.fieldCustomLayout;
  const hasCustomLayout = !isEmpty(layout);
  const renderExtendedItems = () => {
    const extendedItems = getLabelValueFromEIs(report);
    const eiWithoutLayout = [];
    for (let i = 0; i < extendedItems.length; i += 4) {
      eiWithoutLayout.push(extendedItems.slice(i, i + 4));
    }
    const eiFields = [];
    const eiRows = hasCustomLayout
      ? getCustomLayoutFromEIs(layout, report)
      : eiWithoutLayout;
    eiRows.forEach((eiRow, idx) => {
      const child = (
        <MultiColumnsGrid
          key={`eiRow_${idx}`}
          className={`${ROOT}__row`}
          sizeList={[3, 3, 3, 3]}
        >
          {eiRow.map((o) => (
            <>
              <div className={`${ROOT}__label`}>{o.label} </div>
              <div className={`${ROOT}__value`}>
                {o.code ? o.value.split(`${o.code} - `) : o.value}
              </div>
              <div className={`${ROOT}__code`}>{o.code}</div>
            </>
          ))}
        </MultiColumnsGrid>
      );
      eiFields.push(child);
    });
    return eiFields;
  };

  return (
    <div className={ROOT}>
      <MultiColumnsGrid className={`${ROOT}__row`} sizeList={[3, 3, 6]}>
        {rowOne.map(({ label, value }) => (
          <div>
            <div className={`${ROOT}__label`}>{label} </div>
            <div className={`${ROOT}__value`}>{value || ''}</div>
          </div>
        ))}
      </MultiColumnsGrid>
      <MultiColumnsGrid className={`${ROOT}__row`} sizeList={[3, 3, 3, 3]}>
        {!!expReportTypeName &&
          rowTwo
            .filter((item) => item.label)
            .map(({ label, value, code = '' }) => (
              <div>
                <div className={`${ROOT}__label`}>{label}</div>
                <div className={`${ROOT}__value`}>{value || ''}</div>
                <div className={`${ROOT}__code`}>{code || ''}</div>
              </div>
            ))}
      </MultiColumnsGrid>
      {renderExtendedItems()}
    </div>
  );
};

export default Content;
