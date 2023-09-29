import React, { createContext } from 'react';

export type FilterItem = {
  icon: React.ReactNode;
  isChecked: boolean;
  label: string;
  value: string;
};

export type Option = {
  id?: string;
  code?: string;
  icon?: React.ReactNode;
  isJctQualifiedInvoiceIssuer?: boolean;
  jctRegistrationNumber?: string;
  label?: React.ReactNode;
  name?: string;
  paymentDueDateUsage?: string;
  type?: string;
  value: string;
};

type QuickSearchCtx = {
  cursor: number;
  filters?: Array<FilterItem>;
  isExpanded: boolean;
  isLoading: boolean;
  options: Array<Option>;
  selected: Option;
  types?: Array<string>;
  value: string;
  handleCheckBox?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const QuickSearchContext = createContext({} as QuickSearchCtx);

export default QuickSearchContext;
