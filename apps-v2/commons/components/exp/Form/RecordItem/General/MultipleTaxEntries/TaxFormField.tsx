import React, { FC, ReactNode } from 'react';

import styled from 'styled-components';

import { Text } from '@apps/core';
import Button from '@commons/components/buttons/Button';
import Warning from '@commons/components/exp/Warning';
import AmountField from '@commons/components/fields/AmountField';
import LabelWithHint from '@commons/components/fields/LabelWithHint';
import Tooltip from '@commons/components/Tooltip';
import msg from '@commons/languages';
import ExpColor from '@commons/styles/exp/variables/_colors.scss';

import RecordsIcon from '../../../RecordList/Icon';

interface ITaxFormFieldProps {
  // optional
  allowNegativeAmount?: boolean;
  className?: string;
  currencySymbol?: string;
  decimalPlaces?: number;
  editButtonLabel?: string;
  errors?: string[];
  feedbackMessage?: string | ReactNode;
  hintMsg?: string;
  inputFieldClassName?: string;
  isEditButtonDisabled?: boolean;
  isInputDisabled?: boolean;
  // mandatory
  label: string;
  readOnly?: boolean;
  showEditButton?: boolean;
  tooltipMessage?: string;
  value: string | number | ReactNode;
  warningHint?: WarningHint;
  warningMessage?: string;
  onClickEditButton?: () => void;
  onInputChange?: (amount: number) => void;
}

type WarningHint = {
  align?: string;
  message: string;
};

const TaxFormField: FC<ITaxFormFieldProps> = ({
  label,
  value,
  allowNegativeAmount,
  className,
  decimalPlaces,
  errors,
  feedbackMessage,
  hintMsg,
  inputFieldClassName,
  isEditButtonDisabled,
  isInputDisabled,
  readOnly,
  showEditButton,
  tooltipMessage,
  currencySymbol,
  editButtonLabel,
  warningHint,
  warningMessage,
  onClickEditButton,
  onInputChange,
}) => {
  const INPUT_FIELD = (() => {
    const INPUT = (
      <InputField
        currencySymbol={currencySymbol}
        className={inputFieldClassName || ''}
        disabled={isInputDisabled}
        fractionDigits={decimalPlaces}
        value={value}
        onBlur={onInputChange}
        allowNegative={allowNegativeAmount}
      />
    );

    const INPUT_ERROR_MESSAGE = Array.isArray(errors) && errors.length > 0 && (
      <div className="input-feedback">{errors}</div>
    );

    if (tooltipMessage) {
      return (
        <Tooltip align="top" content={tooltipMessage}>
          <div>{INPUT}</div>
        </Tooltip>
      );
    }

    return (
      <>
        {INPUT}
        {INPUT_ERROR_MESSAGE}
        {warningMessage && <Warning message={warningMessage} />}
      </>
    );
  })();

  // if readOnly = true, return div instead of input field
  const { align, message } = warningHint || ({} as WarningHint);
  if (readOnly) {
    return (
      <TaxFormFieldWrapper className={className}>
        <FormField>
          <FieldHeader>
            <LabelGroup>
              <LabelWithHint text={label} hintMsg={hintMsg} />
              {message && (
                <RecordsIcon
                  align={align}
                  className=""
                  idx={1}
                  tooltip={message}
                />
              )}
            </LabelGroup>
          </FieldHeader>

          <div>{value}</div>
        </FormField>
      </TaxFormFieldWrapper>
    );
  }

  return (
    <TaxFormFieldWrapper className={className}>
      <FormField>
        <FieldHeader>
          <LabelWithHint text={label} hintMsg={hintMsg} />

          {showEditButton && (
            <EditButton
              className={`${className}__edit-button`}
              type="text"
              disabled={isEditButtonDisabled}
              onClick={onClickEditButton}
            >
              <Text
                size="large"
                color={!isEditButtonDisabled ? 'action' : 'disable'}
              >
                {editButtonLabel || msg().Com_Btn_Edit}
              </Text>
            </EditButton>
          )}
        </FieldHeader>

        {INPUT_FIELD}

        {feedbackMessage}
      </FormField>
    </TaxFormFieldWrapper>
  );
};

export default TaxFormField;

const TaxFormFieldWrapper = styled.div`
  word-break: break-all;
  display: flex;
  flex-direction: column;

  .input-feedback {
    word-break: break-word;
  }

  .negative-warning {
    margin-top: 8px;
    border: 1px solid #ffa845;
    border-radius: 4px;
    padding: 8px;
    display: flex;

    &-svg {
      display: flex;
      justify-content: center;
      align-self: center;
      overflow: visible !important;
    }

    &-msg {
      color: #333;
      margin-left: 10px;
    }
  }

  .highlight-bg:disabled {
    background-color: ${ExpColor.highlight};
  }
`;

const FieldHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`;

const EditButton = styled(Button)`
  min-height: 0px;
`;

const InputField = styled(AmountField)`
  text-align: right;
`;

const FormField = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

const LabelGroup = styled.div`
  display: flex;
  align-items: center;
`;
