import React from 'react';

import msg from '@apps/commons/languages';
import Navigation from '@mobile/components/molecules/commons/Navigation';

import { SelectedReceipt } from '@apps/domain/models/exp/Receipt';

import Button from '@mobile/components/atoms/Button';
import Wrapper from '@mobile/components/atoms/Wrapper';

import OCRDetailConfirmItem from './OCRDetailConfirmItem';

import './OCRDetailConfirm.scss';

const ROOT = 'mobile-app-pages-ocr-detail-confirm';

type Props = {
  baseCurrencyDecimal: number;
  selectedOCRReceipt: SelectedReceipt[];
  useImageQualityCheck: boolean;
  setOCRDetail: (OcrInfo) => void;
  onClickBackBtn: () => void;
  onClickApplyBtn: () => void;
};

const OCRDetailConfirm = (props: Props) => {
  const {
    baseCurrencyDecimal,
    selectedOCRReceipt,
    useImageQualityCheck,
    onClickApplyBtn,
    onClickBackBtn,
    setOCRDetail,
  } = props;

  return (
    <Wrapper className={ROOT}>
      <Navigation
        title={msg().Exp_Lbl_ConfirmReceipt}
        onClickBack={onClickBackBtn}
      />
      <div className="main-content">
        {selectedOCRReceipt.map(({ receiptId }, index) => (
          <>
            <OCRDetailConfirmItem
              key={receiptId}
              baseCurrencyDecimal={baseCurrencyDecimal}
              receiptIndex={index}
              useImageQualityCheck={useImageQualityCheck}
              setOCRDetail={setOCRDetail}
            />
            {selectedOCRReceipt.length > 1 &&
              selectedOCRReceipt.length !== index + 1 && <hr />}
          </>
        ))}
      </div>
      <div className={`${ROOT}__apply`}>
        <Button
          priority="primary"
          variant="neutral"
          type="submit"
          className={`${ROOT}__apply-btn`}
          onClick={onClickApplyBtn}
        >
          {msg().Com_Lbl_Apply}
        </Button>
      </div>
    </Wrapper>
  );
};

export default OCRDetailConfirm;
