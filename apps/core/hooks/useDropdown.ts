import React, { useCallback, useMemo } from 'react';
import usePortal from 'react-useportal';

import drop from 'lodash/drop';
import isNil from 'lodash/isNil';
import nanoid from 'nanoid';

import msg from '../../commons/languages';

export type Option = {
  id?: string;
  value: any;
  label?: React.ReactNode;
};

type Props = Readonly<{
  readOnly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  hasEmptyOption?: boolean;
  value?: any;
  options: ReadonlyArray<{
    id?: string;
    value: any;
    label?: string | React.ReactNode;
  }>;
  onClick?: (e: React.SyntheticEvent<HTMLElement>) => void;
  onSelect: (value: Option) => void;
}>;

interface Dropdownable {
  isOpening: boolean;
  label: React.ReactNode | null | undefined;
  options: ReadonlyArray<Option>;
  selectedOption: Option;
  closeMenu: () => void;
  onClick: (e: React.SyntheticEvent<HTMLElement>) => void;
  onSelect: (value: Option) => void;
  DropdownMenu: React.ComponentType<{ children: React.ReactNode }>;
}

const useDropdown = ({ options = [], ...props }: Props): Dropdownable => {
  const { isOpen, togglePortal, closePortal, Portal } = usePortal({
    closeOnOutsideClick: true,
  });

  const onClick = useCallback(
    (e) => {
      if (!props.readOnly && !props.disabled) {
        if (props.onClick) {
          props.onClick(e);
        }
        togglePortal(e);
      }
    },
    [isOpen, togglePortal, props.readOnly, props.disabled, props.onClick]
  );
  const onSelect = useCallback(
    (value: Option) => {
      if (!props.readOnly && !props.disabled) {
        props.onSelect(value);
        closePortal();
      }
    },
    [closePortal, props.readOnly, props.disabled, props.onSelect]
  );

  const normalizedOptions: ReadonlyArray<Option> = useMemo(() => {
    const optionsWithId = options.map(({ id, ...option }) => ({
      ...option,
      id: isNil(id) ? nanoid(8) : id,
    }));

    if (props.hasEmptyOption) {
      const emptyOption = {
        id: nanoid(8),
        value: '',
        label: msg().Com_Lbl_None,
      };
      return [emptyOption, ...optionsWithId];
    } else {
      return [...optionsWithId];
    }
  }, [options, props.hasEmptyOption]);

  const selectedOption: Option = useMemo(() => {
    // Ignore empty option
    const opts = props.hasEmptyOption
      ? drop([...normalizedOptions], 1)
      : normalizedOptions;
    return (
      opts.find((option) => option.value === props.value) || { value: null }
    );
  }, [normalizedOptions, props.value]);

  const label = useMemo(() => {
    const labelOrValue = !isNil(selectedOption.label)
      ? selectedOption.label
      : selectedOption.value;
    return !isNil(labelOrValue) ? labelOrValue : props.placeholder;
  }, [selectedOption, props.placeholder]);

  return {
    isOpening: isOpen,
    closeMenu: closePortal,
    label,
    options: normalizedOptions,
    selectedOption,
    onClick,
    onSelect,
    DropdownMenu: Portal,
  };
};

export default useDropdown;
