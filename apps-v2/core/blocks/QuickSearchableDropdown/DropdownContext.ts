import * as React from 'react';

export type Option = {
  id?: string;
  value: any;
  label?: React.ReactNode;
};

/**
 * Throw error when DropdownContext is used out of context provider.
 */
const invariantViolation = (..._args: unknown[]): void => {
  throw new Error(
    'Attempt to call useDialog out of Dropdown Menu context. Make sure your app is rendered in DropdownMenuProvider.'
  );
};

const DefaultComponent: React.ComponentType<{
  children: React.ReactNode;
}> = () => null;

/**
 * DropdownMenu context
 */
export interface DropdownMenuContextType {
  label: React.ReactNode | null | undefined;
  isMenuOpened: boolean;
  closeMenu: () => void;
  isOptionListLoading: boolean;
  options: ReadonlyArray<Option>;
  changeTerm: (
    arg0: React.SyntheticEvent<HTMLInputElement>,
    terms?: string[]
  ) => void;
  term: string;
  selectOption: (arg0: Option) => void;
  selectedOption: Option;
  clickDropdown: (arg0: React.SyntheticEvent<HTMLElement>) => void;
  DropdownMenu: React.ComponentType<{ children: React.ReactNode }>;
}

const DropdownContext = React.createContext<DropdownMenuContextType>({
  label: undefined,
  isMenuOpened: false,
  closeMenu: invariantViolation,
  isOptionListLoading: false,
  options: [] as ReadonlyArray<Option>,
  changeTerm: invariantViolation,
  term: '',
  selectOption: invariantViolation,
  selectedOption: { value: undefined },
  clickDropdown: invariantViolation,
  DropdownMenu: DefaultComponent,
});

export default DropdownContext;
