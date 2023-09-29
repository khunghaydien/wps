import React from 'react';

import classNames from 'classnames';
import { isEmpty } from 'lodash';

import MultiColumnsGrid from '@apps/commons/components/MultiColumnsGrid';
import FormatUtil from '@apps/commons/utils/FormatUtil';

import { ProjectFinanceType } from '@apps/domain/models/psa/ProjectFinance';

import './index.scss';

const ROOT = 'ts-psa__finance-summary';

type RowData = {
  label: string;
  planned: string | number;
  actual: string | number;
  diff: string | number;
};

type FinanceCategorySummary = {
  dataKey: string;
} & RowData;

type FinanceSummary = {
  total: RowData;
  financeCategory: Array<FinanceCategorySummary>;
  financeType: string;
};

type Props = {
  title: string;
  financeType: string;
  summaryData: FinanceSummary;
  currencyDecimal: number;
  headerLabel: RowData;
  onRowClick?: (dataKey: string) => void;
};

const FinanceSummaryList = (props: Props) => {
  const { title, financeType, headerLabel, summaryData, onRowClick } = props;

  const generateRowCell = (
    dataKey: string,
    label: string | number,
    isDataRow = false,
    customClass = ''
  ) => {
    return (
      <div
        key={dataKey}
        className={classNames(
          `${ROOT}__cell`,
          `finance-${dataKey}`,
          { 'is-data-row': isDataRow },
          customClass
        )}
      >
        {typeof label === 'number'
          ? FormatUtil.formatNumber(label, props.currencyDecimal)
          : label}
      </div>
    );
  };

  const generateRow = (
    rowKey: string,
    rowData: RowData | FinanceCategorySummary,
    rowClass = '',
    onClick?: () => void
  ) => {
    const isDataRow = !!onClick;
    return (
      <MultiColumnsGrid
        key={rowKey}
        className={classNames(`${ROOT}__${rowClass}`)}
        sizeList={[6, 2, 2, 2]}
        onClick={isDataRow ? onClick : () => {}}
      >
        {Object.keys(rowData).map((dataKey) => {
          return (
            <div key={dataKey}>
              {generateRowCell(dataKey, rowData[dataKey], isDataRow)}
            </div>
          );
        })}
      </MultiColumnsGrid>
    );
  };

  const generateContentRow = () => {
    if (
      summaryData.financeCategory &&
      summaryData.financeCategory.length !== 0
    ) {
      const content = [];
      content.push(
        summaryData.financeCategory.map(({ dataKey, ...otherField }, idx) => {
          if (financeType === ProjectFinanceType.Revenue && idx === 0) {
            return (
              <div key={dataKey}>
                {generateRow(dataKey, otherField, 'row', () =>
                  onRowClick(ProjectFinanceType.Revenue)
                )}
                <div className={`${ROOT}__divider`}></div>
              </div>
            );
          } else if (financeType === ProjectFinanceType.Cost && idx === 0) {
            return (
              <div key={dataKey}>
                {generateRow(dataKey, otherField, 'row', () =>
                  onRowClick(ProjectFinanceType.Cost)
                )}
                <div className={`${ROOT}__divider`}></div>
              </div>
            );
          } else {
            return (
              <div key={dataKey}>
                {generateRow(dataKey, otherField, 'row', () =>
                  onRowClick(dataKey)
                )}
              </div>
            );
          }
        })
      );
      return content;
    }
  };

  if (isEmpty(summaryData)) {
    return null;
  }

  return (
    <div key={`${ROOT}`} className={`${ROOT}`}>
      <div key={'title'} className={`${ROOT}__title`}>
        {title}
      </div>
      <div key={'body'} className={`${ROOT}__body`}>
        {generateRow('header', headerLabel, 'header')}
        {summaryData.total && generateRow('total', summaryData.total, 'total')}
        <div className={`${ROOT}__divider`}></div>
        {generateContentRow()}
      </div>
    </div>
  );
};

export default FinanceSummaryList;
