import React from 'react';

import isNil from 'lodash/isNil';
import nanoid from 'nanoid';

import styled, { css } from 'styled-components';

import { useKey } from '../../hooks';
import { Color, Font } from '../../styles';
import { useOutsideClick, useScrollIntoView } from './hooks';

type InputProps = Omit<
  React.PropsWithoutRef<React.ComponentProps<'input'>>,
  'children' | 'value' | 'onChange' | 'onSelect'
>;

interface Props extends InputProps {
  'data-testid'?: string;
  assistiveInfo?: React.ReactNode;
  isOpenByDefault?: boolean;
  readOnly?: boolean;
  value: string | null | undefined;
  options: ReadonlyArray<{ id: string; value: string; label: string }>;
  onBlur?: (event: React.SyntheticEvent<HTMLElement>) => void;
  onChange?: (value: string) => void;
  onSelect?: (value: { id: string; value: string; label: string }) => void;
}

const Size = css`
  min-height: 32px;
  width: 72px;
`;

const ItemStyle = css`
  display: flex;
  align-items: center;
  text-align: left;
  white-space: normal;
  font-size: ${Font.size.L};
`;

const S = {
  Dropdown: styled.div`
    position: relative;
    padding: 0;
    margin: 0;
    ${Size};
  `,
  Combobox: styled.div`
    position: relative;
  `,
  Input: styled.input<React.ComponentProps<'input'>>`
    appearance: none;
    background: #fff;
    border-radius: 4px;
    border: 1px solid ${Color.border3};
    box-sizing: border-box;
    color: ${Color.primary};
    cursor: pointer;
    position: relative;
    outline: none;
    margin: 0;

    /**
     * Align the content to list items with considering vertical scrollbar width.
     */
    padding: 0 0 0 12px;
    ${ItemStyle};
    ${Size};

    :hover {
      background: ${Color.hover};
    }

    :disabled {
      cursor: auto;
      background: ${Color.bgDisabled};
    }

    ::placeholder {
      color: ${Color.disable};
    }

    [role='combobox'] &[readonly] {
      /**
     * Prevent from overriding our style by Salesforce
     */
      ${ItemStyle}
      padding: 0 0 0 12px;
      cursor: auto;
      background: ${Color.background};
    }
  ` as React.ComponentType<React.ComponentProps<'input'>>,
  ListBox: styled.ul<{
    isOpen: boolean;
    readOnly: boolean;
  }>`
    position: absolute;
    overflow-x: hidden;
    overflow-y: auto;
    background: #fff;
    max-height: 200px;
    margin: 4px 0 0 0;
    border: 1px solid ${Color.border3};
    box-sizing: border-box;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    display: ${({ isOpen, readOnly }): string =>
      isOpen && !readOnly ? 'block' : 'none'};
    ${Size};

    /**
     * NOTE
     * Should define it as constants?
     */
    z-index: 3;
  ` as React.ComponentType<{
    'data-testid': string;
    id: string;
    role: string;
    isOpen: boolean;
    readOnly: boolean;
    children: React.ReactNode;
  }>,
  Option: styled.li`
    ${ItemStyle};
    ${Size};

    :hover,
    :focus-within {
      border: none;
      outline: none;
      text-decoration: none;
      color: inherit;
      background: ${Color.hover};
    }
  `,
  A: styled.a<{ selected: boolean }>`
    color: #000;
    white-space: normal;
    text-decoration: none;
    padding: 0 0 0 12px;
    font-weight: ${({ selected }): string => (selected ? 'bold' : 'normal')};
    ${ItemStyle};
    ${Size};

    :hover,
    :active,
    :focus {
      border: none;
      outline: none;
      text-decoration: none;
      color: inherit;
    }
  ` as React.ComponentType<{ selected: boolean } & React.ComponentProps<'a'>>,
  AssistiveInfo: styled.span`
    position: absolute;
    right: 15px;
    top: 6px;
    bottom: 6px;
    width: 14px;
    color: ${Color.primary};
    font-size: ${Font.size.L};
    line-height: 19px;
  `,
};

interface OptionProps {
  'data-testid'?: string;
  'aria-selected': boolean;
  id: string;
  selected: boolean;
  isOpen: boolean;
  children: React.ReactNode;
  onMouseDown: (event: React.SyntheticEvent<HTMLElement>) => void;
}

const Option: React.FC<OptionProps> = ({
  onMouseDown,
  id,
  selected,
  isOpen,
  children,
  'data-testid': testId,
  ...props
}: OptionProps) => {
  const ref = useScrollIntoView(selected && isOpen);

  return (
    <S.Option
      data-testid={testId}
      id={id}
      aria-selected={props['aria-selected']}
      ref={ref}
      onMouseDown={onMouseDown}
    >
      <S.A href="#" selected={selected}>
        {children}
      </S.A>
    </S.Option>
  );
};

const Combobox = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      assistiveInfo,
      className,
      isOpenByDefault = false,
      value,
      disabled,
      readOnly,
      options,
      placeholder,
      onChange,
      onSelect,
      onBlur,
      'data-testid': testId,
      ...props
    }: Props,
    forwardingRef: React.Ref<HTMLInputElement>
  ) => {
    // Local states

    const [isOpen, setIsOpen] = React.useState(isOpenByDefault);

    // Momoized values

    const selectedOption = React.useMemo(() => {
      return (
        options.find((option) => option.value === value) || { value: undefined }
      );
    }, [options, value]);

    // Input ref
    const defaultRef = React.useRef<HTMLInputElement | null>(null);
    const inputRef = (forwardingRef ||
      defaultRef) as React.RefObject<HTMLInputElement>;

    // Event handlers

    const ignoreEvent = (event: React.SyntheticEvent<HTMLElement>): void => {
      event.stopPropagation();
      event.preventDefault();
    };

    const onClick = React.useCallback(() => {
      if (!disabled && !readOnly) {
        setIsOpen(true);
      }
      if (typeof inputRef !== 'function' && inputRef.current) {
        inputRef.current.select();
      }
    }, [disabled, readOnly, isOpen]);

    const handleSelect = React.useCallback(
      (option: { id: string; value: string; label: string }) =>
        (event: React.SyntheticEvent<HTMLElement>): void => {
          event.stopPropagation();
          event.preventDefault();
          onSelect(option);
          setIsOpen(false);
        },
      [options, onSelect]
    );

    const handleBlur = React.useCallback(
      (e: React.SyntheticEvent<HTMLElement>) => {
        if (!readOnly) {
          onBlur(e);
        }
        setIsOpen(false);
      },
      [onBlur, readOnly]
    );

    // Side effects

    const ref = useOutsideClick(() => setIsOpen(false));

    // Generate Ids for a11y
    const listboxId = nanoid(8);

    const inputKey = useKey();

    return (
      <S.Dropdown className={className} ref={ref}>
        <S.Combobox
          data-testid={testId}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-owns={listboxId}
          onClick={onClick}
          onFocus={onClick}
        >
          <S.Input
            key={inputKey}
            data-testid={testId ? `${testId}__input` : undefined}
            aria-activedescendant={selectedOption.value}
            aria-autocomplete="list"
            aria-controls={listboxId}
            type="text"
            value={value}
            placeholder={placeholder}
            onBlur={handleBlur}
            onChange={(e: React.SyntheticEvent<HTMLInputElement>): void =>
              onChange(e.currentTarget.value)
            }
            onSelect={ignoreEvent}
            readOnly={readOnly}
            ref={inputRef}
            disabled={disabled}
            {...props}
          />
          {!isNil(assistiveInfo) && (
            <S.AssistiveInfo>{assistiveInfo}</S.AssistiveInfo>
          )}
        </S.Combobox>
        <S.ListBox
          data-testid={testId ? `${testId}__listbox` : undefined}
          role="listbox"
          id={listboxId}
          isOpen={isOpen}
          readOnly={readOnly}
        >
          {options.map((option, index) => {
            return (
              <Option
                data-testid={
                  testId ? `${testId}__listbox-item-${index}` : undefined
                }
                key={option.id}
                id={option.id}
                aria-selected={option.value === value}
                selected={option.value === value}
                isOpen={isOpen}
                onMouseDown={handleSelect(option)}
              >
                {option.label}
              </Option>
            );
          })}
        </S.ListBox>
      </S.Dropdown>
    );
  }
);

export default Combobox;
