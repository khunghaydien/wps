import { connect } from 'react-redux';

import {
  cloneDeep,
  find,
  get,
  includes,
  isEqual,
  last,
  set,
  size,
} from 'lodash';

import ReceiptLibraryDialog, {
  Props,
  SelectedPdfIdsList,
} from '../../../../commons/components/exp/Form/Dialog/ReceiptLibrary';
import { PROGRESS_STATUS } from '../../../../commons/components/ProgressBar';
import msg from '../../../../commons/languages';
import TextUtil from '../../../../commons/utils/TextUtil';
import { actions as fileMetadataActions } from '@commons/modules/exp/entities/fileMetadata';
import { actions as ocrPdfDocsActions } from '@commons/modules/exp/ui/ocrPdfDocs';
import { toFixedNumber } from '@commons/utils/NumberUtil';

import {
  getMetadata,
  isPDF,
  OCR_STATUS,
  OcrInfo,
} from '@apps/domain/models/exp/Receipt';

import { actions as receiptLibraryAction } from '../../../../domain/modules/exp/receiptLibrary/list';
import { State } from '../../../modules';
import { dialogTypes } from '../../../modules/ui/expenses/dialog/activeDialog';
import { actions as commentActions } from '../../../modules/ui/expenses/dialog/approval/comment';
import { actions as progressBarActions } from '../../../modules/ui/expenses/dialog/progressBar';
import { actions as selectionCountActions } from '../../../modules/ui/expenses/receiptLibrary/maxSelectionCount';
import { actions as ocrDetailActions } from '../../../modules/ui/expenses/receiptLibrary/ocrDetail';
import { actions as selectedReceiptActions } from '../../../modules/ui/expenses/receiptLibrary/selectedReceipt';

import {
  openExpenseTypeDialog,
  openOCRDetailDialog,
} from '../../../action-dispatchers/Dialog';
import {
  deleteReceipt,
  executeOcr,
  executePdfSubPageOcr,
  getBase64File,
  getScannedPdf,
  keepGettingStatus,
  uploadAndExecuteOcrPdf,
  uploadReceipts,
} from '../../../action-dispatchers/Receipt';

import { Props as OwnProps } from '../../../components/Expenses/Dialog';

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  const attachedFileCount = size(ownProps.expReport.attachedFileList);
  // Receipts with no OCR info
  let isReportReceipt = true;
  let isMultiStep = false;
  let title = msg().Exp_Lbl_ReceiptLibrary;
  let hintMsg =
    attachedFileCount > 0
      ? TextUtil.template(msg().Exp_Lbl_FileAttached, attachedFileCount)
      : '';
  if (ownProps.recordIdx >= 0) {
    hintMsg = '';
  }
  const activeDialog = state.ui.expenses.dialog.activeDialog;
  const currentDialog = last(activeDialog);
  let mainButtonTitle = msg().Exp_Lbl_Attach;

  // filter out attached file from receipt library
  const maxSelectionCount = state.ui.expenses.receiptLibrary.maxSelectionCount;
  let receiptList = state.entities.exp.receiptLibrary.list.receipts;
  const attachedFileVerIds = (
    get(ownProps.expReport, 'attachedFileList') || []
  ).map(({ attachedFileVerId }) => attachedFileVerId);
  if (maxSelectionCount > 1) {
    receiptList = receiptList.filter(
      ({ contentVersionId }) => !attachedFileVerIds.includes(contentVersionId)
    );
  }
  const selectedReceipt = state.ui.expenses.receiptLibrary.selectedReceipt;
  let isMaxCountSelected =
    attachedFileCount + size(selectedReceipt) === maxSelectionCount;
  if (currentDialog === dialogTypes.OCR_RECEIPTS) {
    mainButtonTitle = msg().Com_Lbl_NextButton;
    isReportReceipt = false;
    isMultiStep = true;
    title = msg().Exp_Lbl_CreateRecordFromReceipt;
    hintMsg = '';
    isMaxCountSelected = size(selectedReceipt) === maxSelectionCount;
  }

  return {
    mainButtonTitle,
    isReportReceipt,
    isMultiStep,
    currentDialog,
    title,
    receiptList,
    photoUrl: state.userSetting.photoUrl,
    comment: state.ui.expenses.dialog.approval.comment,
    customHint: state.entities.exp.customHint.recordReceipt,
    fileMetadata: state.common.exp.entities.fileMetadata,
    useImageQualityCheck: state.userSetting.useImageQualityCheck,
    progressBar: state.ui.expenses.dialog.progressBar,
    isLoading: !!state.ui.expenses.dialog.isLoading,
    selectedReceipt,
    hintMsg,
    isMaxCountSelected,
    maxSelectionCount,
    attachedFileCount,
    companyId: state.userSetting.companyId,
    employeeId: state.userSetting.employeeId,
    baseCurrencyDecimal: state.userSetting.currencyDecimalPlaces,
    reportTypeId: state.ui.expenses.selectedExpReport.expReportTypeId,
    ocrPdfDocsObj: state.common.exp.ui.ocrPdfDocs,
  };
};

const mapDispatchToProps = {
  getBase64File,
  deleteReceipt,
  uploadReceipts,
  keepGettingStatus,
  executeOcr,
  openExpenseTypeDialog,
  openOCRDetailDialog,
  onChangeComment: commentActions.set,
  setProgressBar: progressBarActions.set,
  resetProgressBar: progressBarActions.clear,
  setOCRDetail: ocrDetailActions.set,
  onChangeSelectedReceipt: selectedReceiptActions.set,
  resetSelectedReceipt: selectedReceiptActions.clear,
  resetOCRDetail: ocrDetailActions.reset,
  deleteSelectedReceipt: selectedReceiptActions.delete,
  getReceipts: receiptLibraryAction.list,
  resetSelectionCount: selectionCountActions.reset,
  saveFileMetadata: fileMetadataActions.save,
  fetchFileMetadata: fileMetadataActions.fetch,
  uploadAndExecuteOcrPdf,
  removeOcfPdfDoc: ocrPdfDocsActions.remove,
  getScannedPdf,
  executePdfSubPageOcr,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  deleteReceipt: (receiptId, dataType) => {
    const isOcrPdf = !stateProps.isReportReceipt && isPDF(dataType);
    // @ts-ignore
    dispatchProps.deleteReceipt(receiptId).then((res) => {
      if (res) {
        const selectedReceiptIds = stateProps.selectedReceipt.map(
          ({ receiptId }) => receiptId
        );
        const isDeleteSelected = includes(selectedReceiptIds, receiptId);
        const isDeleteSingleSelected = isEqual([receiptId], selectedReceiptIds);
        if (isDeleteSelected) {
          dispatchProps.deleteSelectedReceipt(receiptId);
        }
        if (stateProps.isMultiStep && isDeleteSingleSelected) {
          const steps = cloneDeep(stateProps.progressBar);
          steps[0].status = PROGRESS_STATUS.SELECTED;
          dispatchProps.setProgressBar(steps);
        }
      }
      if (isOcrPdf) {
        dispatchProps.removeOcfPdfDoc(receiptId);
      }
    });
  },
  onClickReceiptLibrayCloseButton: () => {
    dispatchProps.resetSelectedReceipt();
    dispatchProps.resetProgressBar();
    dispatchProps.resetOCRDetail();
    dispatchProps.resetSelectionCount();
    ownProps.onClickHideDialogButton();
  },
  onImageDrop: (file, runOCR) => {
    const bgLoad = true;
    return (
      dispatchProps
        .getBase64File(file, bgLoad)
        // @ts-ignore
        .then(async (base64File) => {
          // pdf ocr
          if (isPDF(file.type) && runOCR) {
            return dispatchProps.uploadAndExecuteOcrPdf(base64File);
          }

          return (
            dispatchProps
              .uploadReceipts([base64File], bgLoad)
              // @ts-ignore
              .then(async (res) => {
                if (res && runOCR) {
                  dispatchProps
                    .executeOcr(get(res, 'contentVersionId')) // @ts-ignore
                    .then((ocrExecuteRes) => {
                      dispatchProps.keepGettingStatus(
                        get(ocrExecuteRes, 'payload.taskId'),
                        get(res, 'contentVersionId')
                      );
                    });
                }
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
                    ocrInfo: { status: OCR_STATUS.IN_PROGRESS },
                  };
                }
                return {
                  receiptId: null,
                  receiptFileId: null,
                  receiptData: null,
                  ocrInfo: null,
                };
              })
          );
        })
    );
  },
  getScannedPdfBase64List: async (selectedPdfIdsList: SelectedPdfIdsList) => {
    const { ocrPdfDocsObj } = stateProps;
    const ocrPdfDocIdList = Object.keys(ocrPdfDocsObj);
    const pdfIdsList = selectedPdfIdsList.filter(
      ({ receiptId }) => !ocrPdfDocIdList.includes(receiptId)
    );
    if (pdfIdsList.length > 0) {
      await dispatchProps.getScannedPdf(pdfIdsList);
    }
  },
  executePdfSubPageOcr: async (pdfContentVerId: string) => {
    const { fileMetadata } = stateProps;
    await dispatchProps.executePdfSubPageOcr(pdfContentVerId, fileMetadata);
  },
  executeOcr: (receiptFileId) => {
    // @ts-ignore
    dispatchProps.executeOcr(receiptFileId).then((ocrExecuteRes) => {
      dispatchProps.keepGettingStatus(
        get(ocrExecuteRes, 'payload.taskId'),
        receiptFileId
      );
    });
  },
  openDetailConfirmDialog: () => {
    const {
      selectedReceipt: selectedReceiptsArr,
      baseCurrencyDecimal,
      useImageQualityCheck,
      fileMetadata,
    } = stateProps;
    const isBulkRecordUsingDiffReceipts = selectedReceiptsArr.length > 1;

    if (isBulkRecordUsingDiffReceipts) {
      const { ocrDetails, selectedMetadataArr } = selectedReceiptsArr.reduce<{
        ocrDetails: OcrInfo[];
        selectedMetadataArr: string[];
      }>(
        (acc, selectedReceipt) => {
          const { ocrInfo, receiptId, dataType } = selectedReceipt;
          const { recordDate, amount, merchant } = get(ocrInfo, 'result') || {};

          // The amount in detail confirm dialog should be consistent with decimail setting
          const roundedAmount = toFixedNumber(amount, baseCurrencyDecimal);
          const contentDocumentId = receiptId;
          const selectedMetadata = find(fileMetadata, {
            contentDocumentId,
          });

          return {
            ...acc,
            ocrDetails: [
              ...acc.ocrDetails,
              { recordDate, amount: roundedAmount, merchant },
            ],
            // do not fetch metadata for pdf
            selectedMetadataArr:
              selectedMetadata || isPDF(dataType)
                ? acc.selectedMetadataArr
                : [...acc.selectedMetadataArr, contentDocumentId],
          };
        },
        { ocrDetails: [], selectedMetadataArr: [] }
      );

      dispatchProps.setOCRDetail(ocrDetails);

      if (useImageQualityCheck && selectedMetadataArr.length) {
        dispatchProps.fetchFileMetadata(selectedMetadataArr);
      }
    } else {
      const selectedReceipt = selectedReceiptsArr[0];
      const ocrInfo = get(selectedReceipt, 'ocrInfo.result') || {};
      const { recordDate, amount, merchant } = ocrInfo;

      // The amount in detail confirm dialog should be consistent with decimail setting
      const roundedAmount = toFixedNumber(amount, baseCurrencyDecimal);
      dispatchProps.setOCRDetail([
        { recordDate, amount: roundedAmount, merchant },
      ]);

      if (!isPDF(selectedReceipt.dataType)) {
        const contentDocumentId = selectedReceipt.receiptId;
        const selectedMetadata = find(fileMetadata, {
          contentDocumentId,
        });

        if (useImageQualityCheck && !selectedMetadata) {
          dispatchProps.fetchFileMetadata([contentDocumentId]);
        }
      }
    }

    ownProps.hideDialog();
    dispatchProps.openOCRDetailDialog();
  },
  onClickSelectReceipt: (param) => {
    const selectedReceiptList = param;
    ownProps.hideDialog();
    dispatchProps.resetSelectedReceipt();
    dispatchProps.resetSelectionCount();
    const expReport = cloneDeep(ownProps.expReport);
    const touched = cloneDeep(ownProps.touched);
    if (ownProps.recordIdx < 0) {
      // for report receipt (multiple receipts available)
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

    set(touched, `records.${ownProps.recordIdx}.receiptId`, true);
    ownProps.onChangeEditingExpReport(`report`, expReport, touched);
  },
  getReceipts: (withOcrInfo?: boolean, isNewUpload?: boolean) => {
    dispatchProps.getReceipts(withOcrInfo, isNewUpload, !withOcrInfo);
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
