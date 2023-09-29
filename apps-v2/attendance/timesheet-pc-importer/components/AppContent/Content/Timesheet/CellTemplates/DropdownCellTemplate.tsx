import React, { FC } from 'react';
import Select, { MenuProps, OptionProps } from 'react-select';

import {
  CellTemplate,
  Compatible,
  DropdownCell,
  getCellProperty,
  getCharFromKeyCode,
  isAlphaNumericKey,
  keyCodes,
  Uncertain,
  UncertainCompatible,
} from '@silevis/reactgrid';

export type OptionType = {
  label: string;
  value: string;
};

export class DropdownCellTemplate implements CellTemplate<DropdownCell> {
  getCompatibleCell(
    uncertainCell: Uncertain<DropdownCell>
  ): Compatible<DropdownCell> {
    let selectedValue: string | undefined;
    try {
      selectedValue = getCellProperty(uncertainCell, 'selectedValue', 'string');
    } catch {
      selectedValue = undefined;
    }
    const values = getCellProperty(uncertainCell, 'values', 'object');
    const value = selectedValue ? parseFloat(selectedValue) : NaN;
    let isDisabled = true;
    try {
      isDisabled = getCellProperty(uncertainCell, 'isDisabled', 'boolean');
    } catch {
      isDisabled = false;
    }
    let inputValue: string | undefined;
    try {
      inputValue = getCellProperty(uncertainCell, 'inputValue', 'string');
    } catch {
      inputValue = undefined;
    }
    let isOpen: boolean;
    try {
      isOpen = getCellProperty(uncertainCell, 'isOpen', 'boolean');
    } catch {
      isOpen = false;
    }
    const text = selectedValue || '';
    return {
      ...uncertainCell,
      selectedValue,
      text,
      value,
      values,
      isDisabled,
      isOpen,
      inputValue,
    };
  }

  update(
    cell: Compatible<DropdownCell>,
    cellToMerge: UncertainCompatible<DropdownCell>
  ): Compatible<DropdownCell> {
    if (cellToMerge.type === 'dropdown') {
      let selectedValue: string | undefined;
      try {
        selectedValue = getCellProperty(cellToMerge, 'selectedValue', 'string');
      } catch {
        selectedValue = undefined;
      }
      return this.getCompatibleCell({
        ...cell,
        selectedValue,
        isOpen: cellToMerge.isOpen,
        inputValue: cellToMerge.inputValue,
      });
    } else {
      let selectedValue: string | undefined;
      try {
        const text = getCellProperty(cellToMerge, 'text', 'string').trim();
        selectedValue = cell.values.find(
          (value) => value.value === text
        )?.value;
      } catch {
        selectedValue = undefined;
      }
      return this.getCompatibleCell({
        ...cell,
        selectedValue,
      });
    }
  }

  getClassName(cell: Compatible<DropdownCell>): string {
    const isOpen = cell.isOpen ? 'open' : 'closed';
    return `${cell.className ? cell.className : ''} ${isOpen}`;
  }

  handleKeyDown(
    cell: Compatible<DropdownCell>,
    keyCode: number,
    ctrl: boolean,
    shift: boolean,
    alt: boolean
  ): { cell: Compatible<DropdownCell>; enableEditMode: boolean } {
    if ((keyCode === keyCodes.SPACE || keyCode === keyCodes.ENTER) && !shift) {
      return {
        cell: this.getCompatibleCell({ ...cell, isOpen: !cell.isOpen }),
        enableEditMode: false,
      };
    }
    const char = getCharFromKeyCode(keyCode, shift);
    if (!ctrl && !alt && isAlphaNumericKey(keyCode))
      return {
        cell: this.getCompatibleCell({
          ...cell,
          inputValue: shift ? char : char.toLowerCase(),
          isOpen: !cell.isOpen,
        }),
        enableEditMode: false,
      };
    return { cell, enableEditMode: false };
  }

  render(
    cell: Compatible<DropdownCell>,
    isInEditMode: boolean,
    onCellChanged: (cell: Compatible<DropdownCell>, commit: boolean) => void
  ): React.ReactNode {
    return (
      <DropdownInput
        onCellChanged={(cell) =>
          onCellChanged(this.getCompatibleCell(cell), true)
        }
        cell={cell}
      />
    );
  }
}

interface DIProps {
  onCellChanged: (...args: any[]) => void;
  cell: Record<string, any>;
}

const DropdownInput: FC<DIProps> = ({ onCellChanged, cell }) => {
  const selectRef = React.useRef<any>(null);

  const [inputValue, setInputValue] = React.useState<string | undefined>(
    cell.inputValue
  );

  const value = React.useMemo(
    () => cell.values.find((val) => val.value === cell.selectedValue) ?? null,
    [cell.selectedValue, cell.values]
  );

  React.useEffect(() => {
    if (cell.isOpen && selectRef.current) {
      selectRef.current.focus();
      setInputValue(cell.inputValue);
    }
  }, [cell.isOpen, cell.inputValue]);

  return (
    <div
      title={value?.label}
      style={{ width: '100%' }}
      onPointerDown={() => onCellChanged({ ...cell, isOpen: !cell.isOpen })}
    >
      <Select
        {...(cell.inputValue && {
          inputValue,
          defaultInputValue: inputValue,
          onInputChange: (e) => setInputValue(e),
        })}
        isSearchable={true}
        ref={selectRef}
        menuIsOpen={cell.isOpen}
        onChange={(e) =>
          onCellChanged({
            ...cell,
            selectedValue: (e as OptionType).value,
            isOpen: false,
            inputValue: undefined,
          })
        }
        blurInputOnSelect={true}
        value={value}
        isDisabled={cell.isDisabled}
        options={cell.values}
        onKeyDown={(e) => e.stopPropagation()}
        components={{
          Option: CustomOption,
          Menu: CustomMenu,
        }}
        styles={{
          container: (provided) => ({
            ...provided,
            width: '100%',
            height: '100%',
          }),
          control: (provided) => ({
            ...provided,
            border: 'none',
            borderColor: 'transparent',
            minHeight: '25px',
            background: 'transparent',
            boxShadow: 'none',
          }),
          indicatorsContainer: (provided) => ({
            ...provided,
            paddingTop: '0px',
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            padding: '0px 4px',
          }),
          singleValue: (provided) => ({
            ...provided,
            color: 'inherit',
          }),
          indicatorSeparator: (provided) => ({
            ...provided,
            marginTop: '4px',
            marginBottom: '4px',
          }),
          input: (provided) => ({
            ...provided,
            padding: 0,
          }),
          valueContainer: (provided) => ({
            ...provided,
            padding: '0 8px',
          }),
        }}
      />
    </div>
  );
};

const CustomOption: React.FC<OptionProps<OptionType, false>> = ({
  innerProps,
  label,
  isSelected,
  isFocused,
}) => (
  <div
    title={label}
    {...innerProps}
    style={{
      display: 'block',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    }}
    onPointerDown={(e) => e.stopPropagation()}
    className={`rg-dropdown-option${isSelected ? ' selected' : ''}${
      isFocused ? ' focused' : ''
    }`}
  >
    {label}
  </div>
);

const CustomMenu: React.FC<MenuProps<OptionType, false>> = ({
  innerProps,
  children,
}) => (
  <div {...innerProps} className="rg-dropdown-menu">
    {children}
  </div>
);
