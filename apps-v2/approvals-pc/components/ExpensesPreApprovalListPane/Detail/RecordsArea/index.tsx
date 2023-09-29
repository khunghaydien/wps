import React from 'react';
import AnimateHeight from 'react-animate-height';

import Button from '../../../../../commons/components/buttons/Button';
import ButtonGroups from '../../../../../commons/components/buttons/ButtonGroups';
import msg from '../../../../../commons/languages';
import { Text } from '../../../../../core';
import Tabs from '@apps/commons/components/exp/Form/RecordItem/Tabs';
import Attachment from '@commons/components/exp/Form/RecordItem/ActionButtons/Attachment';

import { ExpRequest } from '../../../../../domain/models/exp/request/Report';
import { ExpenseTaxTypeList } from '../../../../../domain/models/exp/TaxType';
import { MileageUnit } from '@apps/domain/models/exp/Mileage';
import { FileMetadata } from '@apps/domain/models/exp/Receipt';
import { isItemizedRecord } from '@apps/domain/models/exp/Record';

import { SideFile } from '../../../../modules/ui/sideFilePreview';

import ItemizeBody from '@apps/approvals-pc/components/ExpensesRequestListPane/Detail/RecordsArea/Itemize/Body';

import RecordBody from './RecordBody';
import RecordHeader from './RecordHeader';
import Title from './Title';

import './index.scss';

type Props = {
  expRequest: ExpRequest;
  fileMetadata: FileMetadata[];
  onClickAllOpenRecordButton: () => void;
  onClickAllCloseRecordButton: () => void;
  onClickRecordOpenButton: (arg0: string) => void;
  openNowList: {
    [key: string]: boolean;
  };
  expTaxTypeList: ExpenseTaxTypeList;
  baseCurrencyCode: string;
  baseCurrencySymbol: string;
  baseCurrencyDecimal: number;
  useImageQualityCheck: boolean;
  useJctRegistrationNumber?: boolean;
  setSideFile: (file: SideFile) => void;
  hideSideFile: () => void;
  isApexView?: boolean;
  mileageUnit: MileageUnit;
  openVendorDetail: (vendorId: string) => void;
};

const ROOT = 'approvals-pc-expenses-pre-approval-pane-detail__records-area';

export default class RecordsArea extends React.Component<Props> {
  render() {
    const { expRequest, openNowList, fileMetadata, useImageQualityCheck } =
      this.props;

    if (expRequest.records.length === 0) {
      return null;
    }

    const openApprovalReceiptPreview = (receipt) => {
      const {
        receiptCreatedDate: createdDate,
        receiptDataType: dataType,
        receiptId: id,
        receiptTitle: name,
        receiptFileId: verId,
      } = receipt;
      this.props.hideSideFile();
      setTimeout(() => {
        this.props.setSideFile({ createdDate, dataType, id, name, verId });
      }, 1);
    };

    const reportCCJob = {
      costCenterCode: expRequest.costCenterCode,
      jobCode: expRequest.jobCode,
      jobName: expRequest.jobName,
      costCenterName: expRequest.costCenterName,
    };
    const showCostCenterColumn = !!expRequest.costCenterName;

    return (
      <div className={ROOT}>
        <div className={`${ROOT}__record-header`}>
          <Text
            size="xl"
            color="primary"
            bold
            className={`${ROOT}__title-right`}
          >
            {msg().Exp_Lbl_Records}
          </Text>
          <div className={`${ROOT}-button-area`}>
            <ButtonGroups>
              <Button onClick={this.props.onClickAllOpenRecordButton}>
                {msg().Appr_Btn_Open}
              </Button>
              <Button onClick={this.props.onClickAllCloseRecordButton}>
                {msg().Appr_Btn_Close}
              </Button>
            </ButtonGroups>
          </div>
        </div>
        <Title showCostCenterColumn={showCostCenterColumn} />
        {expRequest.records.map((record, index) => {
          const isOpen = openNowList[record.recordId];
          const height = isOpen ? 'auto' : 0;
          const { receiptId, receiptList } = record;
          const selectedMetadatas = {};
          const isItemized = isItemizedRecord(record.items.length);

          if (receiptList) {
            receiptList.forEach((receipt) => {
              const { receiptId: rId } = receipt;
              const selectedMetadata = fileMetadata.find(
                (x) => x.contentDocumentId === rId
              );
              selectedMetadatas[rId] = selectedMetadata;
            });
          }
          if (receiptId) {
            const selectedMetadata = fileMetadata.find(
              (x) => x.contentDocumentId === record.receiptId
            );
            selectedMetadatas[receiptId] = selectedMetadata;
          }

          return (
            <section key={record.recordId} className={`${ROOT}-record`}>
              <RecordHeader
                request={expRequest}
                record={record}
                isOpen={isOpen}
                showCostCenterColumn={showCostCenterColumn}
                baseCurrencyCode={this.props.baseCurrencyCode}
                baseCurrencySymbol={this.props.baseCurrencySymbol}
                baseCurrencyDecimal={this.props.baseCurrencyDecimal}
                onClickRecordOpenButton={this.props.onClickRecordOpenButton}
              />
              <AnimateHeight height={height}>
                <Tabs
                  actionButtonContent={
                    <Attachment
                      isExpense={false}
                      isFinanceApproval={false}
                      readOnly
                      record={record}
                      openApprovalReceiptPreview={openApprovalReceiptPreview}
                      openReceiptLibraryDialog={() => {}}
                      onDeleteFile={() => {}}
                    />
                  }
                  itemizationTabContent={
                    isItemized && (
                      <ItemizeBody
                        baseCurrencyDecimal={this.props.baseCurrencyDecimal}
                        baseCurrencySymbol={this.props.baseCurrencySymbol}
                        parentCCJob={reportCCJob}
                        record={record}
                      />
                    )
                  }
                  recordTabContent={
                    <RecordBody
                      baseCurrencyCode={this.props.baseCurrencyCode}
                      baseCurrencySymbol={this.props.baseCurrencySymbol}
                      baseCurrencyDecimal={this.props.baseCurrencyDecimal}
                      request={expRequest}
                      record={record}
                      selectedMetadatas={selectedMetadatas}
                      useImageQualityCheck={useImageQualityCheck}
                      expTaxTypeList={this.props.expTaxTypeList}
                      recordIdx={index}
                      setSideFile={this.props.setSideFile}
                      hideSideFile={this.props.hideSideFile}
                      isApexView={this.props.isApexView}
                      mileageUnit={this.props.mileageUnit}
                      isRecordBodyOpen={isOpen}
                      useJctRegistrationNumber={
                        this.props.useJctRegistrationNumber
                      }
                      openVendorDetail={this.props.openVendorDetail}
                    />
                  }
                />
              </AnimateHeight>
            </section>
          );
        })}
      </div>
    );
  }
}
