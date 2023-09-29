import React, { FC, useEffect } from 'react';

import styled from 'styled-components';

import { SelectedReceipt } from '@apps/domain/models/exp/Receipt';

import msg from '../../../../../languages';
import Button from '../../../../buttons/Button';
import DialogFrame from '../../../../dialogs/DialogFrame';
import ProgressBar, {
  PROGRESS_STATUS,
  ProgressBarStep,
} from '../../../../ProgressBar';
import { FormProps } from './Form';
import OCRReceiptDetailItem from './OCRReceiptDetailItem';

import './index.scss';

const ROOT = 'ts-expenses-modal-ocr-receipt-detail';

type Props = {
  progressBar: Array<ProgressBarStep>;
  selectedReceipt: SelectedReceipt[];
  useImageQualityCheck: boolean;
  onClickBackBtn: () => void;
  onClickCloseDialog: () => void;
  onClickNextBtn: () => void;
  setProgressBar: (arg0: Array<ProgressBarStep>) => Record<string, unknown>;
  uploadAndExecuteOcrImg: (
    base64Url: string,
    pageNum: number,
    pdfContentDocId: string
  ) => Promise<void>;
} & Pick<FormProps, 'baseCurrencyDecimal'>;

const OCRReceiptDetail: FC<Props> = (props) => {
  const {
    baseCurrencyDecimal,
    progressBar,
    selectedReceipt,
    useImageQualityCheck,
    onClickBackBtn,
    onClickCloseDialog,
    onClickNextBtn,
    uploadAndExecuteOcrImg,
  } = props;

  useEffect(() => {
    const steps = [
      {
        id: '1',
        text: msg().Exp_Lbl_ReceiptSelection,
        status: PROGRESS_STATUS.ACTIVE,
      },
      {
        id: '2',
        text: msg().Exp_Lbl_ConfirmReceipt,
        status: PROGRESS_STATUS.SELECTED,
      },
      {
        id: '3',
        text: msg().Exp_Lbl_ExpenseTypeSelect,
        status: PROGRESS_STATUS.INACTIVE,
      },
    ];
    props.setProgressBar(steps);
  }, []);

  return (
    <DialogFrame
      title={msg().Exp_Lbl_CreateRecordFromReceipt}
      hide={onClickCloseDialog}
      className={ROOT}
      footer={
        <DialogFrame.Footer
          sub={
            <>
              <Button onClick={onClickBackBtn}>{msg().Com_Lbl_Back}</Button>
              <ProgressBar steps={progressBar} />
            </>
          }
        >
          <Button type="primary" onClick={onClickNextBtn}>
            {msg().Com_Lbl_NextButton}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <ScrollableForm>
        {selectedReceipt.map(({ receiptId }, index) => (
          <>
            <OCRReceiptDetailItem
              key={receiptId}
              baseCurrencyDecimal={baseCurrencyDecimal}
              receiptIndex={index}
              useImageQualityCheck={useImageQualityCheck}
              uploadAndExecuteOcrImg={uploadAndExecuteOcrImg}
            />
            {selectedReceipt.length > 1 &&
              selectedReceipt.length !== index + 1 && <hr />}
          </>
        ))}
      </ScrollableForm>
    </DialogFrame>
  );
};

export default OCRReceiptDetail;

const ScrollableForm = styled.div`
  max-height: 500px;
  overflow: scroll;
`;
