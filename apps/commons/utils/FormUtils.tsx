import React from 'react';

import isEmpty from 'lodash/isEmpty';
import { $Values } from 'utility-types';

import styled from 'styled-components';

import LabelWithHint from '@apps/commons/components/fields/LabelWithHint';
import SelectField from '@apps/commons/components/fields/SelectField';
import TextAreaField from '@apps/commons/components/fields/TextAreaField';
import TextField from '@apps/commons/components/fields/TextField';
import MultiColumnsGrid from '@apps/commons/components/MultiColumnsGrid';
import msg, { language } from '@apps/commons/languages';
import colors from '@apps/commons/styles/exp/variables/_colors.scss';

// TODO replace this once after moving AutoSuggestTextField to common component
import AutoSuggestTextField from '@apps/admin-pc/components/AutoSuggestTextField';

export const fieldType = {
  TEXT: 'text',
  TEXT_AREA: 'testArea',
  SELECT: 'select',
  CHECKBOX: 'checkbox',
  AUTO_SUGGEST: 'suggestSelect',
};

export type FieldType = $Values<typeof fieldType>;

/**
 * Generate language label based on locale
 *
 * @param {string} languageKey
 * @returns {string}
 */
const getLanguageLabel = (languageKey: $Values<typeof language>) => {
  switch (languageKey) {
    case language.JA:
      return msg().Com_Lbl_Japanese;
    case language.EN_US:
    default:
      return msg().Com_Lbl_English;
  }
};

/**
 * Get field label with language appendix based on company language setting
 *
 * eg: [fieldLabel]([language]) - Name(English)
 *
 * @param {string} [fieldKey]
 * @param {string} [msgLabel]
 * @param {string} [mainLanguage]
 * @param {string} [subLanguage]
 * @returns {string}
 */
const getMsgKey = (fieldKey, msgLabel, mainLanguage, subLanguage) => {
  if (!isEmpty(fieldKey.match(/_L0$/))) {
    return `${msg()[msgLabel]}(${getLanguageLabel(mainLanguage)})`;
  } else if (!isEmpty(fieldKey.match(/_L1$/))) {
    return `${msg()[msgLabel]}(${getLanguageLabel(subLanguage)})`;
  } else {
    return msg()[msgLabel];
  }
};

/**
 * Generate field according to configuration for form
 *
 * @param {any} [value]
 * @param {Record<string, any>} [config]
 * @param {boolean} isDisable
 * @param {object} handleOnChange
 * @returns {React.ReactElement<any>|null}
 */
export const getField = (
  value: any,
  config: Record<string, any>,
  isDisable: boolean,
  handleOnChange: (key: string, value: any) => void
): React.ReactElement<any> | null => {
  const { key } = config;
  let field;
  switch (config.type) {
    case fieldType.TEXT:
      field = (
        <TextField
          disabled={isDisable}
          value={value || ''}
          maxLength={config.maxLength}
          onChange={(e) => handleOnChange(key, e.target.value)}
        />
      );
      break;
    case fieldType.TEXT_AREA:
      field = (
        <TextAreaField
          onChange={(e) => handleOnChange(key, e.target.value)}
          disabled={isDisable}
          value={value || ''}
        />
      );
      break;
    case fieldType.SELECT:
      field = (
        <SelectField
          onChange={(e) => {
            handleOnChange(key, e.target.value);
          }}
          options={config.options}
          value={value}
          disabled={isDisable}
        />
      );
      break;
    case fieldType.CHECKBOX:
      field = (
        <input
          type="checkbox"
          disabled={isDisable}
          onChange={() => {
            handleOnChange(key, !value);
          }}
          checked={value}
        />
      );
      break;
    case fieldType.AUTO_SUGGEST:
      field = (
        /* @ts-ignore */
        <AutoSuggestTextField
          key={key}
          onBlur={(_e, value) => {
            handleOnChange(key, value);
          }}
          disabled={isDisable}
          value={value}
          suggestList={config.autoSuggestList || []}
          suggestConfig={{
            value: 'value',
            label: 'label',
            buildLabel: (item) => `${item.label}`,
            suggestionKey: ['value', 'label'],
          }}
        />
      );
      break;
    default:
      field = null;
  }
  return field;
};

const S = {
  Row: styled.div`
    width: 60%;
    margin-top: 6px;
    & > input {
      width: 100%;
    }
    & > input[type='checkbox'] {
      width: 20px;
      height: 32px;
    }
  `,
  Error: styled.div`
    color: ${colors.warning};
  `,
  Label: styled(LabelWithHint)`
    margin-left: ${({ isRequired }) => (isRequired ? 0 : '10px')};
    margin-top: 6px;
    height: 37px;
    display: flex;
    align-items: center;
    & > p {
      margin-bottom: 0;
    }
  `,
};

/**
 * Generate field in a row with hint label and error message
 */

type RowProps = {
  formValue: Record<string, any>;
  config: Record<string, any>;
  isDisable: boolean;
  errors: Record<string, string>;
  mainLanguage: string;
  subLanguage: string;
  onChange: (field: string, value: any) => void;
};

export const RowField = ({
  formValue,
  config,
  isDisable,
  onChange,
  errors,
  mainLanguage,
  subLanguage,
}: RowProps): React.ReactElement<any> => {
  const { key, hintMsg } = config;
  const filed = getField(formValue[key], config, isDisable, onChange);
  return (
    <MultiColumnsGrid key={key} sizeList={[3, 9]}>
      <S.Label
        text={getMsgKey(key, config.msgkey, mainLanguage, subLanguage)}
        hintMsg={(hintMsg && msg()[hintMsg]) || ''}
        isRequired={config.isRequired}
      />
      <S.Row>
        {filed}
        {errors[key] && <S.Error>{msg()[`${errors[key]}`]}</S.Error>}
      </S.Row>
    </MultiColumnsGrid>
  );
};
