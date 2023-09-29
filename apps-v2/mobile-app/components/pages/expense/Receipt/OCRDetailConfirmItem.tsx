import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import msg from '@apps/commons/languages';
import ImgIconAttention from '@commons/images/icons/attention.svg';
import DateUtil from '@commons/utils/DateUtil';
import { parseNumberOrNull } from '@commons/utils/NumberUtil';
import TextUtil from '@commons/utils/TextUtil';
import AmountInputField from '@mobile/components/molecules/commons/Fields/AmountInputField';
import SFDateField from '@mobile/components/molecules/commons/Fields/SFDateField';
import TextField from '@mobile/components/molecules/commons/Fields/TextField';
import FilePreview from '@mobile/components/molecules/commons/FilePreview';

import {
  AMOUNT_MATCH_STATUS,
  generateOCRAmountMsg,
  getMetadataDisplay,
  getMetadataWarning,
} from '@apps/domain/models/exp/Receipt';

import { State } from '@apps/mobile-app/modules';

// import JctRegistrationNumber from '../Record/New/General/JctRegistrationNumber';
import './OCRDetailConfirm.scss';

const ROOT = 'mobile-app-pages-ocr-detail-confirm';

type Props = {
  baseCurrencyDecimal: number;
  useImageQualityCheck: boolean;
  receiptIndex: number;
  setOCRDetail: (OcrInfo) => void;
};

const OCRDetailConfirmItem = (props: Props) => {
  const { receiptIndex } = props;
  const { selectedOCRReceipt: selectedOCRReceiptArr, ocrDetail: ocrDetailArr } =
    useSelector((state: State) => state.expense.ui);
  const today = DateUtil.getToday();
  const {
    recordDate: date,
    amount,
    merchant,
    // jctRegistrationNumber,
  } = ocrDetailArr[receiptIndex];
  const recordDate = date || today;
  const selectedReceipt = selectedOCRReceiptArr[receiptIndex];
  const contentDocumentId = selectedReceipt.receiptId;
  const selectedMetadata = useSelector((state: State) =>
    state.expense.entities.fileMetadata.find(
      (data) => data.contentDocumentId === contentDocumentId
    )
  );

  const updateFieldByKey = (key: string) => (value) => {
    const newOcrDetail = [...ocrDetailArr];
    newOcrDetail[receiptIndex] = {
      ...newOcrDetail[receiptIndex],
      [key]: value,
    };
    return props.setOCRDetail(newOcrDetail);
  };

  const handleDateChange = (e, { date }) => {
    const updateValue = date && DateUtil.fromDate(date);
    const value = updateValue || today;
    updateFieldByKey('recordDate')(value);
  };

  useEffect(() => {
    // today's date for record date will be default if cannot obtain from OCR
    if (!date) {
      handleDateChange(null, { date: today });
    }
  }, [date]);

  const dateField = (
    <SFDateField
      label={msg().Exp_Clbl_Date}
      onChange={handleDateChange}
      value={recordDate}
    />
  );

  const amountField = (
    <AmountInputField
      className={`${ROOT}__amount`}
      label={msg().Exp_Clbl_Amount}
      onBlur={(val) => {
        const amount = parseNumberOrNull(val) || 0;
        updateFieldByKey('amount')(amount);
      }}
      value={amount}
      decimalPlaces={props.baseCurrencyDecimal}
    />
  );

  const merchantField = (
    <TextField
      className={`${ROOT}__merchant`}
      label={msg().Exp_Clbl_Merchant}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        updateFieldByKey('merchant')(e.target.value);
      }}
      value={merchant}
    />
  );

  // const jctRegistrationNumberField = (
  //   <div className={`${ROOT}__jct-number-container`}>
  //     <JctRegistrationNumber
  //       value={jctRegistrationNumber}
  //       onChange={updateFieldByKey('jctRegistrationNumber')}
  //       disabled={false}
  //     />
  //   </div>
  // );

  const renderWarning = (
    labelKey: string,
    wholeMsg?: string | React.ReactNode
  ) => {
    return (
      <div className={`${ROOT}__feedback`}>
        <ImgIconAttention className={`${ROOT}__feedback-svg`} />
        <span className={`${ROOT}__feedback-msg`}>
          {wholeMsg ||
            TextUtil.template(msg().Exp_Msg_ManuallyEntered, msg()[labelKey])}
        </span>
      </div>
    );
  };

  const {
    title,
    receiptId,
    receiptFileId,
    dataType,
    uploadedDate,
    ocrInfo = {},
  } = selectedOCRReceiptArr[receiptIndex];

  const { status, message } = generateOCRAmountMsg(
    ocrInfo.amount,
    amount,
    props.baseCurrencyDecimal
  );

  const amountWarning =
    status !== AMOUNT_MATCH_STATUS.OK && renderWarning(null, message);
  let dateWarning =
    ocrInfo.recordDate !== recordDate && renderWarning('Exp_Clbl_Date');
  const isFilledToday = !date || date === today;
  if (!ocrInfo.recordDate && isFilledToday) {
    // if today is filled due to no scanned data, show this warning msg
    dateWarning = renderWarning(null, msg().Exp_Err_AutoFillToday);
  }

  const filePreview = (
    <FilePreview
      className={`${ROOT}__receipt block`}
      title={title}
      id={receiptId}
      fileId={receiptFileId}
      dataType={dataType}
      uploadedDate={uploadedDate}
      openExternal
    />
  );

  const metadata = props.useImageQualityCheck && (
    <div className={`${ROOT}__metadata`}>
      {getMetadataDisplay(selectedMetadata)}
    </div>
  );

  const metadataWarningText = TextUtil.nl2br(
    getMetadataWarning(selectedMetadata)
  );
  const metadataWarning =
    props.useImageQualityCheck &&
    metadataWarningText &&
    renderWarning(null, metadataWarningText);

  return (
    <>
      {dateField}
      {dateWarning}
      {amountField}
      {amountWarning}
      {merchantField}
      {/* {jctRegistrationNumberField} */}
      {filePreview}
      {metadata}
      {metadataWarning}
    </>
  );
};

export default OCRDetailConfirmItem;
