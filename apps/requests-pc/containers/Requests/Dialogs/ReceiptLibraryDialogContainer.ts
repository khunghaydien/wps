import { connect } from 'react-redux';

import { cloneDeep, find, get, includes, last, set, size } from 'lodash';

import ReceiptLibraryDialog, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/ReceiptLibrary';
import msg from '../../../../commons/languages';
import TextUtil from '../../../../commons/utils/TextUtil';
import { actions as fileMetadataActions } from '@commons/modules/exp/entities/fileMetadata';

import { getMetadata } from '@apps/domain/models/exp/Receipt';

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
  // filter out attached file from receipt library
  const maxSelectionCount = state.ui.expenses.receiptLibrary.maxSelectionCount;
  let receiptList = state.entities.exp.receiptLibrary.list.receipts;
  const attachedFileVerIds = (
    get(ownProps.expReport, 'attachedFileList') || []
  ).map(({ attachedFileVerId }) => attachedFileVerId);
  receiptList = receiptList.filter(
    ({ contentVersionId }) => !attachedFileVerIds.includes(contentVersionId)
  );
  const selectedReceipt = state.ui.expenses.receiptLibrary.selectedReceipt;
  const attachedFileCount = size(ownProps.expReport.attachedFileList);
  const isMaxCountSelected =
    attachedFileCount + size(selectedReceipt) === maxSelectionCount;
  const hintMsg =
    attachedFileCount > 0
      ? TextUtil.template(msg().Exp_Lbl_FileAttached, attachedFileCount)
      : '';

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
    if (ownProps.recordIdx < 0) {
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
    const {
      receiptId,
      receiptFileId,
      dataType: receiptDataType,
      title: receiptTitle,
      uploadedDate: receiptCreatedDate,
    } = selectedReceiptList[0];
    Object.assign(expReport.records[ownProps.recordIdx], {
      receiptId,
      receiptFileId,
      receiptDataType,
      receiptTitle,
      receiptCreatedDate,
    });

    if (!touched.records) {
      touched.records = {};
    }
    if (!touched.records[ownProps.recordIdx]) {
      touched.records[ownProps.recordIdx] = {};
    }
    const touchedRecord = touched.records[ownProps.recordIdx];
    touchedRecord.receiptId = true;
    ownProps.onChangeEditingExpReport(`report`, expReport, touched);
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
