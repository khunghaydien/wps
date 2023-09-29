import React, { FC } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import Button from '@commons/components/buttons/Button';
import IconButton from '@commons/components/exp/Icon/IconButton';
import LinkSvg from '@commons/images/icons/link.svg';
import msg from '@commons/languages';

import { ExpenseType } from '@apps/domain/models/exp/ExpenseType';
import {
  isCCPaymentMethod,
  isICPaymentMethod,
  PaymentMethod,
} from '@apps/domain/models/exp/PaymentMethod';
import { isCCRecord, isIcRecord, Record } from '@apps/domain/models/exp/Record';

import Errors from '@mobile/components/atoms/Errors';
import MobileIconButton from '@mobile/components/atoms/IconButton';

type Props = {
  cssRoot: string;
  errors?: string[];
  expRecord: Record;
  isDisabled: boolean;
  isMobile?: boolean;
  selectedExpenseType?: ExpenseType;
  selectedPaymentMethod?: PaymentMethod;
  targetRecord?: string;
  openCCTransactionDialog: () => void;
  openICTransactionDialog: () => void;
  setFieldValue?: (
    key: string,
    value: boolean | null,
    shouldValidate?: boolean
  ) => void;
  updateReport?: (key: string, value: string, recalc?: boolean) => void;
};

const renderLinkField = (cssRoot: string, linkedInfo: string) => (
  <>
    <LinkSvg className={`${cssRoot}__ic-cc-linked-svg`} />
    <span className={`${cssRoot}__ic-cc-linked-text`}>{`${
      msg().Exp_Lbl_Linked
    } (${linkedInfo})`}</span>
  </>
);

const renderClearIconButton = (
  cssRoot: string,
  fieldName: string,
  isDisabled: boolean,
  isMobile: boolean,
  isCCPaymentMethod?: boolean,
  targetRecord?: string,
  setFieldValue?: (
    key: string,
    value: boolean | null,
    shouldValidate?: boolean
  ) => void,
  updateReport?: (key: string, value: string, recalc?: boolean) => void
) => {
  if (isMobile) {
    const onClickClear = () => {
      setFieldValue(fieldName, null);
      setFieldValue('isCCPaymentMethod', isCCPaymentMethod);
    };
    return (
      <MobileIconButton
        disabled={isDisabled}
        icon="clear"
        className={`${cssRoot}__ic-cc-linked-clear`}
        onClick={onClickClear}
      />
    );
  }
  return (
    <IconButton
      disabled={isDisabled}
      icon="close-copy"
      size="x-small"
      className={`${cssRoot}__ic-cc-linked-clear`}
      onClick={() => updateReport(`${targetRecord}.${fieldName}`, null)}
    />
  );
};

const renderLinkButton = (
  cssRoot: string,
  isDisabled: boolean,
  openTransactionDialog: () => void,
  text: string
) => (
  <Button
    className={`${cssRoot}__ic-cc-link-btn`}
    disabled={isDisabled}
    onClick={openTransactionDialog}
    type="primary"
  >
    {text}
  </Button>
);

const renderError = (errors: string[], isMobile: boolean) => {
  if (isMobile) return <Errors messages={errors} />;
  return <div className="input-feedback">{msg()[errors[0]]}</div>;
};

const ICCCLinkButton: FC<Props> = ({
  cssRoot,
  errors,
  expRecord,
  isDisabled,
  isMobile = false,
  openCCTransactionDialog,
  openICTransactionDialog,
  selectedExpenseType = {},
  selectedPaymentMethod,
  setFieldValue,
  targetRecord,
  updateReport,
}) => {
  const { recordType, useForeignCurrency } = selectedExpenseType as ExpenseType;
  const isSelectedInvalid = isEmpty(selectedPaymentMethod);
  const isCCRecordType = isCCRecord(expRecord);
  const isICRecordType = isIcRecord(recordType);
  if (useForeignCurrency) return null;

  const {
    creditCardAssociation,
    creditCardNo,
    creditCardTransactionId,
    paymentMethodId,
    transitIcCardName,
    transitIcRecordId,
  } = expRecord;
  const { integrationService } = selectedPaymentMethod;
  const isShowCcCardLink =
    (isSelectedInvalid && isCCRecordType) ||
    isCCPaymentMethod(integrationService);
  const isShowIcCardLink =
    isICRecordType || isICPaymentMethod(integrationService, recordType);

  if (!paymentMethodId || (!isShowCcCardLink && !isShowIcCardLink)) return null;

  const isDisableLink = isDisabled || isSelectedInvalid;

  const linkContainerClassName = classNames(`${cssRoot}__ic-cc-link`, {
    [`${cssRoot}__ic-cc-link-error`]: errors[0] && errors.length > 0,
  });
  const linkFieldClassName = classNames(`${cssRoot}__ic-cc-linked`, {
    [`${cssRoot}__ic-cc-linked-disabled`]: isDisableLink,
  });

  if (isShowCcCardLink) {
    const cardInfo =
      creditCardAssociation && creditCardNo
        ? `${creditCardAssociation} **** ${creditCardNo}`
        : '-';
    return (
      <div className={linkContainerClassName}>
        {creditCardTransactionId ? (
          <div className={linkFieldClassName}>
            {renderLinkField(cssRoot, cardInfo)}
            {renderClearIconButton(
              cssRoot,
              'creditCardTransactionId',
              isDisableLink,
              isMobile,
              isShowCcCardLink,
              targetRecord,
              setFieldValue,
              updateReport
            )}
          </div>
        ) : (
          renderLinkButton(
            cssRoot,
            isDisableLink,
            openCCTransactionDialog,
            msg().Exp_Btn_LinkRecordToCreditCardTransaction
          )
        )}
        {renderError(errors, isMobile)}
      </div>
    );
  } else {
    return (
      <div className={linkContainerClassName}>
        {transitIcRecordId ? (
          <div className={linkFieldClassName}>
            {renderLinkField(cssRoot, transitIcCardName || '-')}
            {renderClearIconButton(
              cssRoot,
              'transitIcRecordId',
              isDisableLink,
              isMobile,
              undefined,
              targetRecord,
              setFieldValue,
              updateReport
            )}
          </div>
        ) : (
          renderLinkButton(
            cssRoot,
            isDisableLink,
            openICTransactionDialog,
            msg().Exp_Btn_LinkRecordToIcCardTransaction
          )
        )}
        {renderError(errors, isMobile)}
      </div>
    );
  }
};

export default ICCCLinkButton;
