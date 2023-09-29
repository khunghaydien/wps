import React from 'react';

import isEmpty from 'lodash/isEmpty';

import msg from '@apps/commons/languages';
import { fieldType, RowField } from '@apps/commons/utils/FormUtils';

import {
  bankAccountType,
  paymentDueDateSettingOptions,
  Vendor,
} from '@apps/domain/models/exp/Vendor';
import { OrganizationSetting } from '@apps/domain/models/UserSetting';

export type Errors = {
  code: string;
  // eslint-disable-next-line camelcase
  name_L0: string;
};

export type Props = {
  currencyCodeList: Array<{ label: string; value: string }>;
  disable: boolean;
  errors: Errors;
  organizationSetting: OrganizationSetting;
  useJctRegistrationNumber: boolean;
  vendorInfo: Vendor;
  setFieldValue: (field: string, value: any, shouldValidate: boolean) => void;
};

const jctRNConfig = [
  {
    key: 'isJctQualifiedInvoiceIssuer',
    msgkey: 'Exp_Lbl_JCTQualifiedInvoiceIssuer',
    type: fieldType.CHECKBOX,
  },
  {
    key: 'jctRegistrationNumber',
    msgkey: 'Exp_Clbl_JctRegistrationNumber',
    type: fieldType.TEXT,
    maxLength: 14,
  },
];

const formConfig = (autoSuggestList, useJctRegistrationNumber) => [
  {
    key: 'code',
    msgkey: 'Exp_Lbl_Code',
    type: fieldType.TEXT,
    maxLength: 20,
    isRequired: true,
  },
  {
    key: 'name_L0',
    msgkey: 'Exp_Lbl_Name',
    type: fieldType.TEXT,
    maxLength: 80,
    isRequired: true,
  },
  {
    key: 'name_L1',
    msgkey: 'Exp_Lbl_Name',
    maxLength: 80,
    type: fieldType.TEXT,
  },
  {
    key: 'active',
    msgkey: 'Admin_Lbl_Active',
    type: fieldType.CHECKBOX,
  },
  ...(useJctRegistrationNumber ? jctRNConfig : []),
  {
    key: 'paymentDueDateUsage',
    msgkey: 'Exp_Clbl_PaymentDate',
    options: paymentDueDateSettingOptions.map(({ msgkey, value }) => ({
      text: msg()[msgkey],
      value,
    })),
    type: fieldType.SELECT,
    isRequired: true,
  },
  {
    key: 'paymentTerm',
    msgkey: 'Exp_Lbl_PaymentTerm',
    maxLength: 255,
    type: fieldType.TEXT_AREA,
  },
  {
    key: 'paymentTermCode',
    msgkey: 'Exp_Lbl_PaymentTermCode',
    maxLength: 20,
    type: fieldType.TEXT,
  },
  {
    key: 'isWithholdingTax',
    msgkey: 'Exp_Lbl_WithholdingTax',
    type: fieldType.CHECKBOX,
  },
  {
    key: 'bankAccountType',
    msgkey: 'Exp_Lbl_BankAccountType',
    options: bankAccountType.map(({ label, value }) => ({
      text: msg()[label],
      value,
    })),
    type: fieldType.SELECT,
  },
  {
    key: 'bankAccountNumber',
    msgkey: 'Exp_Lbl_BankAccountNumber',
    maxLength: 38,
    type: fieldType.TEXT,
  },
  {
    key: 'bankCode',
    msgkey: 'Exp_Lbl_BankCode',
    maxLength: 7,
    type: fieldType.TEXT,
  },
  {
    key: 'bankName',
    msgkey: 'Exp_Lbl_BankName',
    maxLength: 60,
    type: fieldType.TEXT,
  },
  {
    key: 'branchCode',
    msgkey: 'Exp_Lbl_BranchCode',
    maxLength: 3,
    type: fieldType.TEXT,
  },
  {
    key: 'branchName',
    msgkey: 'Exp_Lbl_BranchName',
    maxLength: 40,
    type: fieldType.TEXT,
  },
  {
    key: 'branchAddress',
    msgkey: 'Exp_Lbl_BranchAddress',
    maxLength: 255,
    type: fieldType.TEXT_AREA,
  },
  {
    key: 'payeeName',
    msgkey: 'Exp_Lbl_PayeeName',
    maxLength: 50,
    type: fieldType.TEXT,
  },
  {
    key: 'currencyCode',
    msgkey: 'Exp_Lbl_BankCurrency',
    type: fieldType.AUTO_SUGGEST,
    props: 'isoCurrencyCode',
    autoSuggest: {
      value: 'value',
      label: 'label',
      buildLabel: (item) => `${item.label}`,
      suggestionKey: ['value', 'label'],
    },
    hintMsg: 'Admin_Help_AutoSuggest',
    action: 'searchIsoCurrencyCode',
    autoSuggestList,
  },
  {
    key: 'swiftCode',
    msgkey: 'Exp_Lbl_SwiftCode',
    maxLength: 11,
    type: fieldType.TEXT,
  },
  {
    key: 'correspondentBankName',
    msgkey: 'Exp_Lbl_CorrespondentBankBankName',
    maxLength: 60,
    type: fieldType.TEXT,
  },
  {
    key: 'correspondentBranchName',
    msgkey: 'Exp_Lbl_CorrespondentBankBranchName',
    maxLength: 40,
    type: fieldType.TEXT,
  },
  {
    key: 'correspondentBankAddress',
    msgkey: 'Exp_Lbl_CorrespondentBankAddress',
    maxLength: 255,
    type: fieldType.TEXT_AREA,
  },
  {
    key: 'correspondentSwiftCode',
    msgkey: 'Exp_Lbl_CorrespondentBankSwiftCode',
    maxLength: 11,
    type: fieldType.TEXT,
  },
  {
    key: 'country',
    msgkey: 'Exp_Lbl_CountryCode',
    type: fieldType.TEXT,
    maxLength: 3,
  },
  {
    key: 'zipCode',
    msgkey: 'Exp_Lbl_ZipCode',
    type: fieldType.TEXT,
    maxLength: 9,
  },
  {
    key: 'address',
    msgkey: 'Exp_Lbl_Address',
    type: fieldType.TEXT_AREA,
    maxLength: 255,
  },
];

const VendorForm = (props: Props) => {
  const {
    disable,
    errors,
    organizationSetting: { language0, language1 },
    vendorInfo,
    currencyCodeList,
  } = props;
  const cbFilter = isEmpty(language1) ? (o) => !o.key.match(/_L1$/) : (o) => o;
  const fields = formConfig(
    currencyCodeList,
    props.useJctRegistrationNumber
  ).filter(cbFilter);

  return (
    <>
      {fields.map((config) => (
        <RowField
          key={config.key}
          formValue={vendorInfo}
          config={config}
          isDisable={disable}
          onChange={(field, value) => props.setFieldValue(field, value, false)}
          errors={errors}
          mainLanguage={language0}
          subLanguage={language1}
        />
      ))}
    </>
  );
};

export default VendorForm;
