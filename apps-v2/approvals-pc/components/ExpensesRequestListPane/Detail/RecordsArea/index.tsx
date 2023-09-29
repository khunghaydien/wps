import React from 'react';
import AnimateHeight from 'react-animate-height';

import Button from '../../../../../commons/components/buttons/Button';
import ButtonGroups from '../../../../../commons/components/buttons/ButtonGroups';
import msg from '../../../../../commons/languages';
import { Text } from '../../../../../core';
import Tabs from '@apps/commons/components/exp/Form/RecordItem/Tabs';
import Highlight from '@apps/commons/components/exp/Highlight';
import Attachment from '@commons/components/exp/Form/RecordItem/ActionButtons/Attachment';

import { ExpRequest } from '../../../../../domain/models/exp/request/Report';
import { ExpenseTaxTypeList } from '../../../../../domain/models/exp/TaxType';
import { MileageUnit } from '@apps/domain/models/exp/Mileage';
import { FileMetadata } from '@apps/domain/models/exp/Receipt';
import { isItemizedRecord } from '@apps/domain/models/exp/Record';

import { SideFile } from '../../../../modules/ui/sideFilePreview';

import ItemizeBody from './Itemize/Body';
import RecordBody from './RecordBody';
import RecordHeader from './RecordHeader';
import Title from './Title';

import './index.scss';

type Props = {
  expRequest: ExpRequest;
  expPreRequest: ExpRequest;
  fileMetadata: FileMetadata[];
  useImageQualityCheck: boolean;
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
  setSideFile: (file: SideFile) => void;
  hideSideFile: () => void;
  isApexView?: boolean;
  isHighlightDiff?: boolean;
  mileageUnit: MileageUnit;
  useJctRegistrationNumber?: boolean;
  openVendorDetail: (vendorId: string) => void;
};

const ROOT = 'approvals-pc-expenses-request-pane-detail__records-area';

export default class RecordsArea extends React.Component<Props> {
  render() {
    const {
      expRequest,
      expPreRequest,
      isHighlightDiff,
      openNowList,
      fileMetadata,
      useImageQualityCheck,
      mileageUnit,
    } = this.props;
    const { costCenterCode, jobCode, jobName, costCenterName } = expRequest;
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

    const showCostCenterColumn = !!expRequest.costCenterName;

    const reportCCJob = {
      costCenterCode,
      jobCode,
      preCostCenterCode: expPreRequest?.costCenterCode,
      preJobCode: expPreRequest?.jobCode,
      jobName,
      costCenterName,
      preCostCenterName: expPreRequest?.costCenterName,
      preJobName: expPreRequest?.jobName,
    };

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
              <Button
                data-testid={`${ROOT}__button-expand`}
                onClick={this.props.onClickAllOpenRecordButton}
              >
                {msg().Appr_Btn_Open}
              </Button>
              <Button
                data-testid={`${ROOT}__button-collapse`}
                onClick={this.props.onClickAllCloseRecordButton}
              >
                {msg().Appr_Btn_Close}
              </Button>
            </ButtonGroups>
          </div>
        </div>
        <Title showCostCenterColumn={showCostCenterColumn} />
        {expRequest.records.map((record, index) => {
          const isOpen = openNowList[record.recordId];
          const height = isOpen ? 'auto' : 0;
          const { expPreRequestRecordId, receiptId, receiptList } = record;
          const preRequestRecord =
            isHighlightDiff &&
            expPreRequest &&
            expPreRequest.records.find(
              (r) => r.recordId === expPreRequestRecordId
            );
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
              <Highlight highlight={preRequestRecord === undefined}>
                <>
                  <RecordHeader
                    report={expRequest}
                    record={record}
                    preExpReport={expPreRequest}
                    preExpRecord={preRequestRecord}
                    isOpen={isOpen}
                    showCostCenterColumn={showCostCenterColumn}
                    baseCurrencyCode={this.props.baseCurrencyCode}
                    baseCurrencySymbol={this.props.baseCurrencySymbol}
                    baseCurrencyDecimal={this.props.baseCurrencyDecimal}
                    onClickRecordOpenButton={this.props.onClickRecordOpenButton}
                    isHighlightDiff={isHighlightDiff}
                  />
                  <AnimateHeight height={height}>
                    <Tabs
                      actionButtonContent={
                        <Attachment
                          isExpense={false}
                          isFinanceApproval={false}
                          readOnly
                          record={record}
                          openApprovalReceiptPreview={
                            openApprovalReceiptPreview
                          }
                          openReceiptLibraryDialog={() => {}}
                          onDeleteFile={() => {}}
                        />
                      }
                      itemizationTabContent={
                        isItemized && (
                          <ItemizeBody
                            baseCurrencyDecimal={this.props.baseCurrencyDecimal}
                            baseCurrencySymbol={this.props.baseCurrencySymbol}
                            isHighlightDiff={isHighlightDiff}
                            parentCCJob={reportCCJob}
                            preRecord={preRequestRecord}
                            record={record}
                          />
                        )
                      }
                      recordTabContent={
                        <RecordBody
                          baseCurrencyCode={this.props.baseCurrencyCode}
                          baseCurrencySymbol={this.props.baseCurrencySymbol}
                          baseCurrencyDecimal={this.props.baseCurrencyDecimal}
                          preExpReport={expPreRequest}
                          report={expRequest}
                          record={record}
                          selectedMetadatas={selectedMetadatas}
                          useImageQualityCheck={useImageQualityCheck}
                          preExpRecord={preRequestRecord}
                          expTaxTypeList={this.props.expTaxTypeList}
                          recordIdx={index}
                          setSideFile={this.props.setSideFile}
                          hideSideFile={this.props.hideSideFile}
                          isApexView={this.props.isApexView}
                          isHighlightDiff={isHighlightDiff}
                          mileageUnit={mileageUnit}
                          isRecordBodyOpen={isOpen}
                          useJctRegistrationNumber={
                            this.props.useJctRegistrationNumber
                          }
                          openVendorDetail={this.props.openVendorDetail}
                        />
                      }
                    />
                  </AnimateHeight>
                </>
              </Highlight>
            </section>
          );
        })}
      </div>
    );
  }
}
