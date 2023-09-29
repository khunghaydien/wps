import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import get from 'lodash/get';
import { $Values } from 'utility-types';

import {
  goBack,
  pushHistoryWithPrePage,
} from '@mobile/concerns/routingHistory';

import AppPermissionUtil from '../../../../commons/utils/AppPermissionUtil';
import ReceiptLibrary from '../../../components/pages/expense/commons/ReceiptLibrary';
import { toFixedNumber } from '@commons/utils/NumberUtil';

import {
  Base64FileList,
  OcrInfo,
  SelectedReceipt,
} from '@apps/domain/models/exp/Receipt';
import { ReceiptList } from '@apps/domain/models/exp/receipt-library/list';
import {
  OCR_RECORD_MAX,
  RECORD_ATTACHMENT_MAX_COUNT,
} from '@apps/domain/models/exp/Record';
import { ATTACHMENT_MAX_COUNT } from '@apps/domain/models/exp/Report';

import { State } from '../../../modules';
import { actions as fileMetadataActions } from '../../../modules/expense/entities/fileMetadata';
import { actions as formValueRecordAction } from '../../../modules/expense/ui/general/formValues';
import { actions as ocrDetailActions } from '../../../modules/expense/ui/ocrDetail';
import { actions as formValueReportAction } from '../../../modules/expense/ui/report/formValues';
import { actions as selectedOCRReceiptAction } from '../../../modules/expense/ui/selectedOCRReceipt';

import {
  deleteReceipt,
  executeOcr,
  getBase64files,
  getReceipts,
  uploadReceipts,
} from '../../../action-dispatchers/expense/Receipt';

export const backType = {
  REPORT: 'report',
  RECORD: 'record',
} as const;

type OwnProps = RouteComponentProps & {
  backType: $Values<typeof backType>;
  type: string;
  withOCR?: boolean;
};

const ReceiptLibraryContainer = (ownProps: OwnProps) => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const receiptList = useSelector(
    (state: State) => state.expense.entities.receiptLibrary.list.receipts
  );
  const formValuesReport = useSelector(
    (state: State) => state.expense.ui.report.formValues
  );
  const formValuesRecord = useSelector(
    (state: State) => state.expense.ui.general.formValues
  );
  const currencySymbol = useSelector(
    (state: State) => state.userSetting.currencySymbol
  );
  const decimalPlaces = useSelector(
    (state: State) => state.userSetting.currencyDecimalPlaces
  );
  const { useExpense, employeeId, currencyId, useImageQualityCheck } =
    useSelector((state: State) => state.userSetting);

  const fileMetadata = useSelector(
    (state: State) => state.expense.entities.fileMetadata
  );

  const hasPermissionError = AppPermissionUtil.checkPermissionError(
    useExpense,
    employeeId,
    currencyId
  );

  useEffect(() => {
    dispatch(getReceipts(ownProps.withOCR));
  }, []);

  const backToDetailPage = () => {
    goBack(ownProps.history);
  };

  const onClickSelectBtn = (files: ReceiptList) => {
    if (ownProps.backType === backType.RECORD) {
      const record = formValuesRecord;
      const { receiptList } = record;
      const receiptListClone = receiptList ? cloneDeep(receiptList) : [];
      files.forEach((file) => {
        const fileInfo = {
          receiptId: file.contentDocumentId,
          receiptFileId: file.contentVersionId,
          receiptDataType: file.fileType,
          receiptTitle: file.title,
          receiptCreatedDate: file.createdDate,
        };
        receiptListClone.push(fileInfo);
      });
      const updatedRecord = { ...record, ...{ receiptList: receiptListClone } };
      dispatch(formValueRecordAction.save(updatedRecord));
      goBack(ownProps.history);
    } else if (ownProps.backType === backType.REPORT) {
      const report = formValuesReport;
      const originalFiles = report.attachedFileList || [];
      const appendedFiles = files.map((file) => ({
        attachedFileId: file.contentDocumentId,
        attachedFileVerId: file.contentVersionId,
        attachedFileDataType: file.fileType,
        attachedFileName: file.title,
        attachedFileCreatedDate: file.createdDate,
        attachedFileExtension: file.fileExtension,
      }));

      const attachedFileList = [...originalFiles, ...appendedFiles];
      const updatedReport = { ...report, attachedFileList };
      dispatch(formValueReportAction.save(updatedReport));
      goBack(ownProps.history);
    } else if (ownProps.withOCR) {
      const { history } = ownProps;

      if (files.length > 1) {
        const { selectedReceiptArr, ocrInfoArr, selectedMetadataArr } =
          files.reduce<{
            selectedReceiptArr: SelectedReceipt[];
            ocrInfoArr: OcrInfo[];
            selectedMetadataArr: string[];
          }>(
            (acc, file) => {
              const { contentDocumentId } = file;

              const ocrInfo = file.ocrInfo.result || {};
              const { recordDate, amount, merchant } = ocrInfo;
              // The amount in detail confirm dialog should be consistent with decimail setting
              const roundedAmount = toFixedNumber(amount, decimalPlaces);
              const selectedMetadata = find(fileMetadata, {
                contentDocumentId,
              });

              return {
                ...acc,
                selectedReceiptArr: [
                  ...acc.selectedReceiptArr,
                  {
                    receiptId: contentDocumentId,
                    receiptFileId: file.contentVersionId,
                    receiptFileExtension: file.fileExtension,
                    dataType: file.fileType,
                    title: file.title,
                    uploadedDate: file.createdDate,
                    receiptData: file.receiptData,
                    ocrInfo: {
                      amount: get(file, 'ocrInfo.result.amount', 0),
                      recordDate: get(file, 'ocrInfo.result.recordDate', ''),
                      merchant: get(file, 'ocrInfo.result.merchant', ''),
                    },
                  },
                ],
                ocrInfoArr: [
                  ...acc.ocrInfoArr,
                  {
                    recordDate,
                    amount: roundedAmount,
                    merchant,
                  },
                ],
                selectedMetadataArr: selectedMetadata
                  ? [
                      ...acc.selectedMetadataArr,
                      selectedMetadata.contentDocumentId,
                    ]
                  : acc.selectedMetadataArr,
              };
            },
            { selectedReceiptArr: [], ocrInfoArr: [], selectedMetadataArr: [] }
          );

        dispatch(selectedOCRReceiptAction.set(selectedReceiptArr));
        dispatch(ocrDetailActions.set(ocrInfoArr));

        if (useImageQualityCheck && selectedMetadataArr.length) {
          dispatch(fileMetadataActions.fetch(selectedMetadataArr));
        }
      } else {
        const file = files[0];
        const { contentDocumentId } = file;
        const fileInfo = {
          receiptId: contentDocumentId,
          receiptFileId: file.contentVersionId,
          receiptFileExtension: file.fileExtension,
          dataType: file.fileType,
          title: file.title,
          uploadedDate: file.createdDate,
          receiptData: file.receiptData,
          ocrInfo: {
            amount: get(file, 'ocrInfo.result.amount', 0),
            recordDate: get(file, 'ocrInfo.result.recordDate', ''),
            merchant: get(file, 'ocrInfo.result.merchant', ''),
          },
        };
        dispatch(selectedOCRReceiptAction.set([fileInfo]));

        const ocrInfo = file.ocrInfo.result || {};
        const { recordDate, amount, merchant } = ocrInfo;
        // The amount in detail confirm dialog should be consistent with decimail setting
        const roundedAmount = toFixedNumber(amount, decimalPlaces);
        dispatch(
          ocrDetailActions.set([
            {
              recordDate,
              amount: roundedAmount,
              merchant,
            },
          ])
        );

        // fetch file metadata
        const selectedMetadata = fileMetadata.find(
          (x) => x.contentDocumentId === contentDocumentId
        );
        if (useImageQualityCheck && !selectedMetadata) {
          dispatch(fileMetadataActions.fetch([contentDocumentId]));
        }
      }

      const ocrConfirmPath = '/expense/receipt-library/ocr-confirm';
      pushHistoryWithPrePage(history, ocrConfirmPath);
    }
  };

  const uploadReceiptFiles = (base64Files: Base64FileList) => {
    const withLoading = false;
    return (
      dispatch(uploadReceipts(base64Files, null, withLoading))
        // @ts-ignore
        .then(async (res: ReceiptList) => {
          await dispatch(getReceipts(ownProps.withOCR, withLoading));
          return res;
        })
    );
  };

  const getBase64fileAction = (e: React.ChangeEvent<HTMLInputElement>) => {
    return (
      dispatch(getBase64files(e))
        // @ts-ignore
        .then((res: Base64FileList) => res)
    );
  };

  const Actions = bindActionCreators(
    {
      executeOcr,
      deleteReceipt,
      saveFileMetadata: fileMetadataActions.save,
    },
    dispatch
  );

  const getMaxAllowedReceipts = () => {
    if (ownProps.backType === 'record') {
      const { receiptList } = formValuesRecord;
      if (!receiptList || receiptList.length === 0)
        return RECORD_ATTACHMENT_MAX_COUNT;
      return RECORD_ATTACHMENT_MAX_COUNT - receiptList.length;
    }
    if (ownProps.backType === 'report') return ATTACHMENT_MAX_COUNT;
    return OCR_RECORD_MAX;
  };

  const isRecord = ownProps.backType === backType.RECORD;
  const getFileVerId = (receipt) => {
    return isRecord ? receipt?.receiptFileId : receipt?.attachedFileVerId;
  };
  const data = isRecord ? formValuesRecord : formValuesReport;
  const path = isRecord ? 'receiptList' : 'attachedFileList';
  const attachedFileVerIds = (data?.[path] || []).map(getFileVerId);
  const filteredReceiptList = receiptList.filter(
    ({ contentVersionId }) => !attachedFileVerIds.includes(contentVersionId)
  );

  return (
    <ReceiptLibrary
      receiptList={filteredReceiptList}
      hasPermissionError={hasPermissionError}
      withOCR={ownProps.withOCR}
      decimalPlaces={decimalPlaces}
      currencySymbol={currencySymbol}
      maxReceipts={getMaxAllowedReceipts()}
      getBase64files={getBase64fileAction}
      uploadReceipts={uploadReceiptFiles}
      onClickSelectBtn={onClickSelectBtn}
      backToDetailPage={backToDetailPage}
      deleteReceipt={Actions.deleteReceipt}
      saveFileMetadata={Actions.saveFileMetadata}
      executeOcr={Actions.executeOcr}
    />
  );
};

export default ReceiptLibraryContainer;
