import * as React from 'react';

import isNil from 'lodash/isNil';

import { useFilter } from '../../../commons/hooks';

import { useDropdown } from '../../hooks';
import DropdownContext, { Option } from './DropdownContext';

interface Props<T> {
  children: React.ReactNode;

  value?: any;
  hasEmptyOption?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  onClick?: (e: React.SyntheticEvent<HTMLElement>) => void;
  onSelect: (value: Option) => void;

  items: ReadonlyArray<T>;
  filterSelector: (item: T) => string;
  optionSelector: (item: T) => Option;
}

function DropdownProvider<T>({
  children,
  ...props
}: Props<T>): React.ReactElement {
  const [term, filteredItems, changeTerm] = useFilter(
    props.items as T[],
    props.filterSelector
  );
  const filteredOptions = React.useMemo(() => {
    return filteredItems.map(props.optionSelector);
  }, [filteredItems, props.optionSelector]);
  const label = React.useMemo(() => {
    const opts = props.items.map(props.optionSelector);
    const found = opts.find((option) => option.value === props.value) || {
      value: undefined,
      label: undefined,
    };
    const labelOrValue = !isNil(found.label) ? found.label : found.value;
    return !isNil(labelOrValue) ? labelOrValue : props.placeholder;
  }, [props.items, props.value, props.placeholder]);
  const {
    isOpening,
    closeMenu,
    selectedOption,
    options,
    onClick,
    onSelect,
    DropdownMenu,
  } = useDropdown({
    ...props,
    options: filteredOptions,
  });

  return (
    <DropdownContext.Provider
      value={{
        label,
        isMenuOpened: isOpening,
        closeMenu,
        isOptionListLoading: props.isLoading || false,
        options,
        changeTerm,
        term,
        selectOption: onSelect,
        selectedOption,
        clickDropdown: onClick,
        DropdownMenu,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
}

export default DropdownProvider;
