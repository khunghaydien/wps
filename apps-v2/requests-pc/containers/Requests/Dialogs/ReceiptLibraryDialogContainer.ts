import { connect } from 'react-redux';

import {
  cloneDeep,
  find,
  flatMap,
  get,
  includes,
  last,
  map,
  set,
  size,
} from 'lodash';

import ReceiptLibraryDialog, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/ReceiptLibrary';
import msg from '../../../../commons/languages';
import TextUtil from '../../../../commons/utils/TextUtil';
import { actions as fileMetadataActions } from '@commons/modules/exp/entities/fileMetadata';

import { getMetadata } from '@apps/domain/models/exp/Receipt';
import { RECORD_ATTACHMENT_MAX_COUNT } from '@apps/domain/models/exp/Record';

import { actions as receiptLibraryAction } from '../../../../domain/modules/exp/receiptLibrary/list';
import { State } from '../../../modules';
import { actions as commentActions } from '../../../modules/ui/expenses/dialog/approval/comment';
import { actions as selectionCountActions } from '../../../modules/ui/expenses/receiptLibrary/maxSelectionCount';
import { actions as selectedReceiptActions } from '../../../modules/ui/expenses/receiptLibrary/selectedReceipt';

import { openExpenseTypeDialog } from '../../../action-dispatchers/Dialog';
import {
  deleteReceipt,
  getBase64File,
  uploadReceipts,
} from '../../../action-dispatchers/Receipt';

import { Props as OwnProps } from '../../../components/Requests/Dialog';

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  // Receipts with no OCR info
  const isReportReceipt = true;
  const isMultiStep = false;

  const activeDialog = state.ui.expenses.dialog.activeDialog;
  const currentDialog = last(activeDialog);
  const mainButtonTitle = msg().Exp_Lbl_Attach;

  const isBulkEditMode = state.common.exp.ui.bulkEditRecord.isEnabled;
  const isBulkEditRecord = isBulkEditMode && ownProps.bulkRecordIdx >= 0;
  const isRecord = ownProps.recordIdx >= 0;
  // filter out attached file from receipt library
  let maxSelectionCount = state.ui.expenses.receiptLibrary.maxSelectionCount;
  let receiptList = state.entities.exp.receiptLibrary.list.receipts;

  // get all attached file version id in report
  const allAttachedFileVerId = flatMap(
    map(ownProps.expReport.records, (record) => record.receiptList)
  ).map((receipt) => receipt.receiptFileId);

  const attachedFileVerIds = isBulkEditMode
    ? allAttachedFileVerId
    : (
        get(
          ownProps.expReport,
          isRecord
            ? `records.${ownProps.recordIdx}.receiptList`
            : 'attachedFileList'
        ) || []
      ).map((receipt) =>
        isRecord ? receipt.receiptFileId : receipt.attachedFileVerId
      );
  receiptList = receiptList.filter(
    ({ contentVersionId }) => !attachedFileVerIds.includes(contentVersionId)
  );
  const selectedReceipt = state.ui.expenses.receiptLibrary.selectedReceipt;
  const attachedFileCount = size(ownProps.expReport.attachedFileList);
  let isMaxCountSelected =
    attachedFileCount + size(selectedReceipt) === maxSelectionCount;
  let hintMsg =
    attachedFileCount > 0
      ? TextUtil.template(msg().Exp_Lbl_FileAttached, attachedFileCount)
      : '';

  if (ownProps.recordIdx >= 0 || isBulkEditRecord) {
    hintMsg = '';
    const recordIdx = isBulkEditRecord
      ? ownProps.bulkRecordIdx
      : ownProps.recordIdx;
    const targetRecord = ownProps.expReport.records[recordIdx];
    const maxReceiptsToSelect =
      RECORD_ATTACHMENT_MAX_COUNT - (targetRecord.receiptList || []).length;
    maxSelectionCount = maxReceiptsToSelect;
    isMaxCountSelected = size(selectedReceipt) === maxReceiptsToSelect;
  }

  const subroleId = get(state, 'ui.expenses.subrole.selectedRole');
  return {
    mainButtonTitle,
    isReportReceipt,
    isMultiStep,
    currentDialog,
    title: msg().Exp_Lbl_ReceiptLibrary,
    receiptList,
    photoUrl: state.userSetting.photoUrl,
    comment: state.ui.expenses.dialog.approval.comment,
    customHint: state.entities.exp.customHint.recordReceipt,
    receiptStatus: (state.ui.expenses.receiptLibrary as any).status,
    selectedReceipt,
    hintMsg,
    isMaxCountSelected,
    isLoading: !!state.ui.expenses.dialog.isLoading,
    maxSelectionCount,
    attachedFileCount,
    companyId: state.userSetting.companyId,
    employeeId: state.userSetting.employeeId,
    reportTypeId: state.ui.expenses.selectedExpReport.expReportTypeId,
    subroleId,
    isBulkEditMode,
  };
};

const mapDispatchToProps = {
  getBase64File,
  deleteReceipt,
  uploadReceipts,
  openExpenseTypeDialog,
  onChangeComment: commentActions.set,
  onChangeSelectedReceipt: selectedReceiptActions.set,
  resetSelectedReceipt: selectedReceiptActions.clear,
  deleteSelectedReceipt: selectedReceiptActions.delete,
  getReceipts: receiptLibraryAction.list,
  resetSelectionCount: selectionCountActions.reset,
  saveFileMetadata: fileMetadataActions.save,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  executeOcr: (_receiptId) => ({} as Function),
  setProgressBar: (_steps) => ({}),
  openDetailConfirmDialog: () => {},
  progressBar: [],
  deleteReceipt: (receiptId) => {
    // @ts-ignore
    dispatchProps.deleteReceipt(receiptId).then((res) => {
      const selectedReceiptIds = stateProps.selectedReceipt.map(
        ({ receiptId }) => receiptId
      );
      const isDeleteSelected = includes(selectedReceiptIds, receiptId);
      if (res && isDeleteSelected) {
        dispatchProps.deleteSelectedReceipt(receiptId);
      }
    });
  },
  onClickReceiptLibrayCloseButton: () => {
    dispatchProps.resetSelectedReceipt();
    dispatchProps.resetSelectionCount();
    ownProps.onClickHideDialogButton();
  },
  onImageDrop: (file) => {
    const bgLoad = true;
    return dispatchProps
      .getBase64File(file, bgLoad) // @ts-ignore
      .then((base64File) => {
        return (
          dispatchProps
            .uploadReceipts([base64File], bgLoad)
            // @ts-ignore
            .then(async (res) => {
              if (res) {
                const contentDocumentId = get(res, 'contentDocumentId');
                const metadata = await getMetadata(file);
                if (metadata) {
                  dispatchProps.saveFileMetadata({
                    ...metadata,
                    contentDocumentId,
                  });
                }
                return {
                  receiptId: contentDocumentId,
                  receiptFileId: get(res, 'contentVersionId'),
                  receiptData: get(base64File, 'data'),
                };
              }
              return {
                receiptId: null,
                receiptFileId: null,
                receiptData: null,
              };
            })
        );
      })
      .catch(() => {
        // do nothing
      });
  },
  onClickSelectReceipt: (selectedReceiptList) => {
    ownProps.hideDialog();
    dispatchProps.resetSelectedReceipt();
    dispatchProps.resetSelectionCount();
    const expReport = cloneDeep(ownProps.expReport);
    const touched = cloneDeep(ownProps.touched);
    if (ownProps.recordIdx < 0 && ownProps.bulkRecordIdx < 0) {
      // for report receipt
      const attachedFileList = selectedReceiptList.map((receipt) => ({
        attachedFileId: receipt.receiptId,
        attachedFileVerId: receipt.receiptFileId,
        attachedFileDataType: receipt.dataType,
        attachedFileName: receipt.title,
        attachedFileExtension: receipt.extension,
      }));
      expReport.attachedFileList = (
        ownProps.expReport.attachedFileList || []
      ).concat(attachedFileList);
      set(touched, 'report.attachedFileList', true);
      ownProps.onChangeEditingExpReport('report', expReport, touched);
      return;
    }
    // for bulk edit record multiple receipts
    if (stateProps.isBulkEditMode && ownProps.bulkRecordIdx >= 0) {
      const selectedReceiptDetails = selectedReceiptList.map((receipt) => ({
        receiptId: receipt.receiptId,
        receiptFileId: receipt.receiptFileId,
        receiptDataType: receipt.dataType,
        receiptTitle: receipt.title,
        receiptCreatedDate: receipt.uploadedDate,
        receiptFileExtension: receipt.extension,
      }));
      const currentRecord = expReport.records[ownProps.bulkRecordIdx];
      currentRecord.receiptList = (currentRecord.receiptList || []).concat(
        selectedReceiptDetails
      );
      ownProps.onChangeEditingExpReport('report', expReport, touched);
      return;
    }

    const selectedReceiptDetails = selectedReceiptList.map((receipt) => ({
      receiptId: receipt.receiptId,
      receiptFileId: receipt.receiptFileId,
      receiptDataType: receipt.dataType,
      receiptTitle: receipt.title,
      receiptCreatedDate: receipt.uploadedDate,
      receiptFileExtension: receipt.extension,
    }));
    if (!expReport.records[ownProps.recordIdx].receiptList) {
      expReport.records[ownProps.recordIdx].receiptList = [];
    }
    Object.assign(expReport.records[ownProps.recordIdx].receiptList, [
      ...expReport.records[ownProps.recordIdx].receiptList,
      ...selectedReceiptDetails,
    ]);
    ownProps.onChangeEditingExpReport(`report`, expReport, true);
  },
  getReceipts: (withOcrInfo?: boolean, isNewUpload?: boolean) => {
    dispatchProps.getReceipts(withOcrInfo, isNewUpload);
  },
  setSelectedReceipt: (targetedReceipt) => {
    const { maxSelectionCount, selectedReceipt, isMaxCountSelected } =
      stateProps;
    const isSingleSelection = maxSelectionCount === 1;
    const isSelected = find(selectedReceipt, [
      'receiptFileId',
      targetedReceipt.receiptFileId,
    ]);
    const isModifiable = !(!isSelected && isMaxCountSelected);
    if (isSingleSelection || isModifiable) {
      dispatchProps.onChangeSelectedReceipt(
        targetedReceipt,
        isSingleSelection,
        !!isSelected
      );
    }
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ReceiptLibraryDialog) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
