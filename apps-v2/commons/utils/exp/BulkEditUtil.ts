import { ReactElement } from 'react';

import {
  currencyInfo,
  isItemizedRecord,
  Record,
  RecordItem,
} from '@apps/domain/models/exp/Record';

export const getRecordsClonedMultipleTimes = (
  cloneNum: number,
  recordIdxList: number[],
  recordList: Record[]
) => {
  const clonedRecords = recordIdxList
    .map((idx: number) => {
      const record = recordList[idx];
      if (record) {
        return [...Array(cloneNum).keys()].map(() => ({
          ...getResetFields(record),
        }));
      }
      return [];
    })
    .flat();
  return recordList.concat(clonedRecords);
};

export const getResetFields = (
  record: Record,
  selectedDate?: string
): Record => {
  const recordItemList = record.items;
  const [parentItem = {} as RecordItem, ...childItemList] = recordItemList;

  const isItemized = isItemizedRecord(recordItemList.length);
  const isMultipleTax = parentItem?.taxItems?.length > 0;

  // if itemId not exist e.g. new cloned record, remove child id field from taxItems[]
  if (isMultipleTax) {
    parentItem.taxItems = parentItem.taxItems.map((taxItem) => ({
      ...taxItem,
      id: null,
    }));
  }

  const resetChildItemList = isItemized
    ? childItemList.map((childItemList) => ({
        ...childItemList,
        itemId: null,
        recordDate: selectedDate || childItemList.recordDate,
      }))
    : [];

  return {
    ...record,
    recordId: null,
    creditCardAssociation: null,
    creditCardNo: null,
    creditCardTransactionId: null,
    transitIcCardNo: null,
    transitIcRecordId: null,
    receiptList: [],
    items: [
      {
        ...parentItem,
        itemId: null,
        merchant: null,
      },
      ...resetChildItemList,
    ],
  };
};

/* build grid */
type FormatterProps = {
  data: Record;
  hasError: boolean;
  index: number;
  value: string | number;
};

export type Column = {
  align?: 'center' | 'left' | 'right';
  formatter?: (props: FormatterProps) => ReactElement;
  grow?: boolean;
  key: string;
  name: string;
  shrink?: boolean;
  width?: string | number;
  fullData?: boolean;
};

export type ColumnCss = {
  flexBasis: (string | number) | null | undefined;
  flexShrink: 1 | 0;
  flexGrow: 1 | 0;
  justifyContent: 'center' | 'flex-start' | 'flex-end';
};

export const buildColumnCss = (column: Column): ColumnCss => {
  const { align, grow, shrink, width } = column;
  return {
    flexBasis: width,
    flexShrink: shrink ? 1 : 0,
    flexGrow: grow ? 1 : 0,
    justifyContent:
      align === 'right'
        ? 'flex-end'
        : align === 'center'
        ? 'center'
        : 'flex-start',
  };
};

// props
export type CalculateForeignCurrencyAmount = {
  amount: number;
  currencyId: string;
  currencyInfo: currencyInfo;
  exchangeRate: number;
  exchangeRateManual: boolean;
  localAmount: number;
};

export type CalculateBaseCurrencyAmount = {
  amount: number;
  amountPayable: number;
  gstVat: number;
  taxRate: number;
  taxTypeBaseId: string;
  taxTypeHistoryId: string;
  taxTypeName: string;
  withoutTax: number;
};

export type MileageRateInfo = {
  mileageRate: number;
  mileageRateBaseId: string;
  mileageRateHistoryId: string;
  mileageRateName: string;
};
