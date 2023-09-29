import React from 'react';
import AnimateHeight from 'react-animate-height';

import Button from '../../../../../commons/components/buttons/Button';
import ButtonGroups from '../../../../../commons/components/buttons/ButtonGroups';
import msg from '../../../../../commons/languages';
import { Text } from '../../../../../core';

import { ExpRequest } from '../../../../../domain/models/exp/request/Report';
import { ExpenseTaxTypeList } from '../../../../../domain/models/exp/TaxType';
import { FileMetadata } from '@apps/domain/models/exp/Receipt';

import { SideFile } from '../../../../modules/ui/expenses/detail/sideFilePreview';

import RecordBody from './RecordBody';
import RecordHeader from './RecordHeader';
import Title from './Title';

import './index.scss';

type Props = {
  expRequest: ExpRequest;
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
  openRecordItemsConfirmDialog: () => void;
  setSelectedRecord: (arg0: number) => void;
  setSideFile: (file: SideFile) => void;
  hideSideFile: () => void;
  isApexView?: boolean;
  useJctRegistrationNumber?: boolean;
};

const ROOT = 'approvals-pc-expenses-request-pane-detail__records-area';

export default class RecordsArea extends React.Component<Props> {
  render() {
    const { expRequest, openNowList, fileMetadata, useImageQualityCheck } =
      this.props;

    if (expRequest.records.length === 0) {
      return null;
    }

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

          const selectedMetadata = fileMetadata.find(
            (x) => x.contentDocumentId === record.receiptId
          );

          return (
            <section key={record.recordId} className={`${ROOT}-record`}>
              <RecordHeader
                report={expRequest}
                record={record}
                isOpen={isOpen}
                showCostCenterColumn={showCostCenterColumn}
                baseCurrencyCode={this.props.baseCurrencyCode}
                baseCurrencySymbol={this.props.baseCurrencySymbol}
                baseCurrencyDecimal={this.props.baseCurrencyDecimal}
                onClickRecordOpenButton={this.props.onClickRecordOpenButton}
              />
              <AnimateHeight height={height}>
                <RecordBody
                  baseCurrencyCode={this.props.baseCurrencyCode}
                  baseCurrencySymbol={this.props.baseCurrencySymbol}
                  baseCurrencyDecimal={this.props.baseCurrencyDecimal}
                  report={expRequest}
                  record={record}
                  selectedMetadata={selectedMetadata}
                  useImageQualityCheck={useImageQualityCheck}
                  expTaxTypeList={this.props.expTaxTypeList}
                  recordIdx={index}
                  setSelectedRecord={this.props.setSelectedRecord}
                  openRecordItemsConfirmDialog={
                    this.props.openRecordItemsConfirmDialog
                  }
                  setSideFile={this.props.setSideFile}
                  hideSideFile={this.props.hideSideFile}
                  isApexView={this.props.isApexView}
                  useJctRegistrationNumber={this.props.useJctRegistrationNumber}
                />
              </AnimateHeight>
            </section>
          );
        })}
      </div>
    );
  }
}
