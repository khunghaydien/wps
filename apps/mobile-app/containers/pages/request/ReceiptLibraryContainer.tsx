import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { $Values } from 'utility-types';

import { goBack } from '@mobile/concerns/routingHistory';

import AppPermissionUtil from '../../../../commons/utils/AppPermissionUtil';
import ReceiptLibrary from '../../../components/pages/expense/commons/ReceiptLibrary';

import { Base64FileList } from '@apps/domain/models/exp/Receipt';
import { ReceiptList } from '@apps/domain/models/exp/receipt-library/list';

import { State } from '../../../modules';
import { actions as fileMetadataActions } from '../../../modules/expense/entities/fileMetadata';
import { actions as formValueRecordAction } from '../../../modules/expense/ui/general/formValues';
import { actions as formValueReportAction } from '../../../modules/expense/ui/report/formValues';

import {
  deleteReceipt,
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
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

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
  const { useExpense, employeeId, currencyId } = useSelector(
    (state: State) => state.userSetting
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
      // now record only support single receipt
      const file = files[0];
      const fileInfo = {
        receiptId: file.contentDocumentId,
        receiptFileId: file.contentVersionId,
        receiptDataType: file.fileType,
        receiptTitle: file.title,
        receiptCreatedDate: file.createdDate,
      };
      const updatedRecord = { ...record, ...fileInfo };
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
    { deleteReceipt, saveFileMetadata: fileMetadataActions.save },
    dispatch
  );

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
      backType={ownProps.backType}
      receiptList={filteredReceiptList}
      hasPermissionError={hasPermissionError}
      withOCR={ownProps.withOCR}
      decimalPlaces={decimalPlaces}
      currencySymbol={currencySymbol}
      getBase64files={getBase64fileAction}
      uploadReceipts={uploadReceiptFiles}
      onClickSelectBtn={onClickSelectBtn}
      backToDetailPage={backToDetailPage}
      deleteReceipt={Actions.deleteReceipt}
      executeOcr={() => {}}
      saveFileMetadata={Actions.saveFileMetadata}
    />
  );
};

export default ReceiptLibraryContainer;
