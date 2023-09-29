import React from 'react';

import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import { withInfo } from '@storybook/addon-info';
import {
  boolean,
  number,
  object,
  text,
  withKnobs,
} from '@storybook/addon-knobs';

import { Report } from '@apps/domain/models/exp/Report';
import { UserSetting } from '@apps/domain/models/UserSetting';

import ReportDetail from '../../../../../components/pages/expense/Report/Detail';

interface FCStory extends React.FC {
  storyName?: string;
  parameters?: unknown;
}

export default {
  title: 'Components/pages/expense',
  decorators: [withKnobs, withInfo],
};

export const _ReportDetail: FCStory = () => (
  <ReportDetail
    onClickRecord={action('onClickRecord')}
    onClickSubmit={action('onClickSubmit')}
    onClickReportList={action('onClickReportList')}
    onClickDelete={action('onClickDelete')}
    onClickEdit={action('onClickEdit')}
    onClickSearchExpType={action('onClickSearchExpType')}
    onClickCreateICRecord={action('onClickCreateICRecord')}
    onClickCreateCCRecord={action('onClickCreateCCRecord')}
    onClickClone={action('onClickClone')}
    onClickRecall={action('onClickRecall')}
    openPrintPage={action('openPrintPage')}
    openReceiptLibrary={action('openReceiptLibrary')}
    subject={text('subject', 'Report at Nov.')}
    status={text('status', 'Pending')}
    reportId={text('reportId', 'id00000')}
    reportNo={text('reportNo', 'exp00000')}
    requestId={text('requestId', 'exp00000')}
    reportTypeName={text('reportTypeName', 'One-day business trip')}
    accountingPeriodId={text('accountingPeriodId', '')}
    accountingDate={text('accountingDate', '2018-12-06')}
    useFileAttachment={boolean('useFileAttachment', false)}
    costCenterCode={text('costCenterCode', 'PD-1')}
    costCenterName={text('costCenterName', 'Product & Developer')}
    jobCode={text('jobCode', 'PRJ-A')}
    jobName={text('jobName', 'Project A')}
    vendorCode={text('vendorCode', 'V-A')}
    vendorName={text('vendorName', 'Vendor A')}
    paymentDueDate={text('paymentDueDate', '2020-01-01')}
    attachedFileList={object('attachedFileList', [])}
    customRequestId={text('customRequestId', 'cr1')}
    customRequestName={text('customRequestName', 'cr1 name')}
    remarks={text(
      'remarks',
      'This is remarks. this is remarks. this is remarks.'
    )}
    purpose={text(
      'purpose',
      'This is purpose. this is purpose. this is purpose.'
    )}
    userSetting={{} as UserSetting}
    selectedReportType={{} as any}
    currencySymbol="￥"
    currencyDecimalPlaces={0}
    isEditable={boolean('isEditable', true)}
    approvalHistory={object('approvalHistory', { list: [] } as any)}
    extendedItemTexts={object('extendedItemTexts', [
      {
        name: 'Extended Item Text 1',
        value: 'Value 1',
      },
      {
        name: 'Extended Item Text 2',
        value: 'Value 2',
      },
      {
        name: 'Extended Item Text 3',
        value: 'Value 3',
      },
    ])}
    extendedItemPicklists={object('extendedItemPicklists', [
      {
        name: 'Extended Item Picklist 1',
        value: 'Value 1',
      },
      {
        name: 'Extended Item Picklist 2',
        value: 'Value 2',
      },
      {
        name: 'Extended Item Picklist 3',
        value: 'Value 3',
      },
    ] as any)}
    extendedItemLookup={object('extendedItemLookup', [
      {
        name: 'Extended Item Lookup 1',
        value: 'Value 1',
      },
      {
        name: 'Extended Item Lookup 2',
        value: 'Value 2',
      },
      {
        name: 'Extended Item Lookup 3',
        value: 'Value 3',
      },
    ] as any)}
    extendedItemDate={object('extendedItemDate', [
      {
        name: 'Extended Item Date 1',
        value: 'Value 1',
      },
      {
        name: 'Extended Item Date 2',
        value: 'Value 2',
      },
      {
        name: 'Extended Item Date 3',
        value: 'Value 3',
      },
    ])}
    totalAmountOfRecords={number('amountOfRecords', 6000)}
    records={object('records', [
      {
        recordDate: '2017-08-24',
        currencyName: 'jp',
        recordType: 'transition',
        amount: '2000',
        items: [
          {
            recordDate: '2017-08-24',
            amount: '2000',
            expTypeName: 'AAAA',
            currencyInfo: {
              symbol: '￥',
              decimalPlaces: 0,
            },
          },
        ],
      },
      {
        recordDate: '2017-08-24',
        currencyName: 'jp',
        recordType: 'transition',
        amount: '2000',
        items: [
          {
            recordDate: '2017-08-24',
            amount: '2000',
            expTypeName: 'AAAA',
            currencyInfo: {
              symbol: '￥',
              decimalPlaces: 0,
            },
          },
        ],
      },
      {
        recordDate: '2017-08-24',
        currencyName: 'jp',
        recordType: 'transition',
        amount: '2000',
        items: [
          {
            recordDate: '2017-08-24',
            amount: '2000',
            expTypeName: 'AAAA',
            currencyInfo: {
              symbol: '￥',
              decimalPlaces: 0,
            },
          },
        ],
      },
    ] as any)}
    preRequest={object('report', {} as Report)}
    report={object('report', {} as Report)}
    onClickCreateReportFromRequest={action('onClickCreateReportFromRequest')}
    isApprovedPreRequest={boolean('isApprovedPreRequest', false)}
    accountingPeriodList={object('records', [])}
    recordUpdateInfo={[]}
    clearRecordUpdateInfo={action('resetRecordCloneUpdate')}
    isShowCCOption={false}
    isShowICOption={false}
  />
);

_ReportDetail.storyName = 'ReportDetail';
_ReportDetail.parameters = {
  info: {
    inline: false,
    styles: (stylesheet) => ({
      ...stylesheet,
      button: {
        ...stylesheet.button,
        topRight: {
          display: 'none',
        },
      },
    }),
    text: `
        # Description

        Detail of Expense Report
      `,
  },
};
