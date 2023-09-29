import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';

import { catchApiError } from '@commons/actions/app';
import Component from '@commons/components/exp/Form/Dialog/OCRReceiptDetail';
import { PROGRESS_STATUS } from '@commons/components/ProgressBar';
import { actions as fileMetadataActions } from '@commons/modules/exp/entities/fileMetadata';
import FileUtil from '@commons/utils/FileUtil';

import {
  generateBase64File,
  getLatestOCRDate,
  uploadPdfReceipt,
} from '@apps/domain/models/exp/OCR';
import { OcrPage } from '@apps/domain/models/exp/Receipt';

import { State } from '../../../modules';
import { actions as progressBarActions } from '../../../modules/ui/expenses/dialog/progressBar';
import { actions as ocrDetailActions } from '../../../modules/ui/expenses/receiptLibrary/ocrDetail';
import { actions as selectedReceiptActions } from '../../../modules/ui/expenses/receiptLibrary/selectedReceipt';
import { actions as receiptLibraryActions } from '@apps/domain/modules/exp/receiptLibrary/list';

import {
  openExpenseTypeDialog,
  openOCRReceiptLibraryDialog,
} from '../../../action-dispatchers/Dialog';
import { keepGettingPdfStatus } from '@apps/expenses-pc/action-dispatchers/Receipt';

const DialogContainer = (ownProps) => {
  const employeeId = useSelector(
    (state: State) => state.userSetting.employeeId
  );

  const useImageQualityCheck = useSelector(
    (state: State) => state.userSetting.useImageQualityCheck
  );

  const companyId = useSelector((state: State) => state.userSetting.companyId);
  const reportTypeId = useSelector(
    (state: State) => state.ui.expenses.selectedExpReport.expReportTypeId
  );
  const selectedReceipt = useSelector(
    (state: State) => state.ui.expenses.receiptLibrary.selectedReceipt
  );
  const ocrDetail = useSelector(
    (state: State) => state.ui.expenses.receiptLibrary.ocrDetail
  );
  const progressBar = useSelector(
    (state: State) => state.ui.expenses.dialog.progressBar
  );

  const userDecimal = useSelector(
    (state: State) => state.userSetting.currencyDecimalPlaces
  );
  const baseCurrencyDecimal = ownProps.currencyDecimalPlaces || userDecimal;

  const dispatch = useDispatch();

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          setProgressBar: progressBarActions.set,
          resetProgressBar: progressBarActions.clear,
          setOCRDetail: ocrDetailActions.set,
          resetOCRDetail: ocrDetailActions.reset,
          resetSelectedReceipt: selectedReceiptActions.clear,
          saveFileMetadata: fileMetadataActions.save,
          openExpenseTypeDialog,
          openOCRReceiptLibraryDialog,
          executeOcr: receiptLibraryActions.executePdfOcr,
          keepGettingPdfStatus,
        },
        dispatch
      ),
    [dispatch]
  );

  const onClickCloseDialog = () => {
    Actions.resetSelectedReceipt();
    Actions.resetProgressBar();
    Actions.resetOCRDetail();
    ownProps.hideAllDialogsAndClear();
  };

  const onClickNextBtn = () => {
    const steps = cloneDeep(progressBar);
    steps[steps.length - 2].status = PROGRESS_STATUS.ACTIVE;
    steps[steps.length - 1].status = PROGRESS_STATUS.SELECTED;
    ownProps.hideDialog();
    Actions.setProgressBar(steps);

    const recordDate =
      getLatestOCRDate(ocrDetail) || ownProps.expReport.accountingDate;

    Actions.openExpenseTypeDialog(
      employeeId,
      companyId,
      recordDate,
      'General',
      reportTypeId,
      false
    );
  };

  const onClickBackBtn = () => {
    ownProps.hideDialog();
    Actions.openOCRReceiptLibraryDialog();
  };

  const uploadAndExecuteOcrImg = async (
    dataUrl: string,
    pageNum: number,
    pdfContentDocId: string
  ): Promise<void> => {
    try {
      const selectedReceiptObj = selectedReceipt.find(
        ({ receiptId }) => receiptId === pdfContentDocId
      );
      if (!selectedReceiptObj) return;

      const { title, pages, receiptFileId } = selectedReceiptObj;
      const pdfPages = pages || [];

      // check if page is already uploaded
      const isNotUploaded =
        pdfPages.findIndex((page: OcrPage) => page.pdfPageNum === pageNum) ===
        -1;

      if (isNotUploaded) {
        const pdfFileNameNoPrefix =
          FileUtil.getOriginalFileNameWithoutPrefix(title);
        const base64File = generateBase64File(
          dataUrl,
          pdfFileNameNoPrefix,
          pageNum
        );
        const uploadedPage = await uploadPdfReceipt([base64File], true);
        const contentVersionId = get(uploadedPage, '0');

        // execute ocr
        if (contentVersionId) {
          const executeOcrRes = await Actions.executeOcr(
            receiptFileId,
            contentVersionId,
            pageNum
          );
          Actions.keepGettingPdfStatus(
            get(executeOcrRes, 'payload.taskId'),
            receiptFileId, // pdf contentVersionId
            selectedReceiptObj
          );
        }
      }
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    }
  };

  return (
    <Component
      onClickCloseDialog={onClickCloseDialog}
      onClickNextBtn={onClickNextBtn}
      onClickBackBtn={onClickBackBtn}
      uploadAndExecuteOcrImg={uploadAndExecuteOcrImg}
      setProgressBar={Actions.setProgressBar}
      selectedReceipt={selectedReceipt}
      useImageQualityCheck={useImageQualityCheck}
      progressBar={progressBar}
      baseCurrencyDecimal={baseCurrencyDecimal}
    />
  );
};

export default DialogContainer;
