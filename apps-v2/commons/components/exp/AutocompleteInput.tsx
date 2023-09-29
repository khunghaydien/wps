import React, { useCallback, useEffect, useRef, useState } from 'react';
import AnimateHeight from 'react-animate-height';

import classNames from 'classnames';
import debounce from 'lodash/debounce';

import styled from 'styled-components';

import Spinner from '@apps/core/elements/Spinner';
import useClickOutside from '@apps/core/hooks/useClickOutside';
import { Color } from '@apps/core/styles';
import ListBox from '@commons/components/exp/Form/QuickSearch/ListBox';

import './AutocompleteInput.scss';

const ROOT = 'commons-autocomplete-input';

export type Option = {
  id: string;
  icon?: React.ReactElement;
  label: string;
  selectData?: any;
  value: string;
};

export type AutocompleteInputProps = Readonly<{
  'aria-describedby'?: string;
  autoFocus?: boolean;
  className?: string;
  debounceDuration?: number;
  defaultOptions?: Array<Option>;
  disabled?: boolean;
  error?: boolean;
  freeFlow?: boolean;
  inputClass?: string;
  isFinalDestination?: boolean;
  isMobile?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  testId?: string;
  type:
    | 'date'
    | 'datetime-locale'
    | 'file'
    | 'hidden'
    | 'month'
    | 'number'
    | 'password'
    | 'text'
    | 'time'
    | 'week';
  value: string;
  withIndicator?: boolean;
  getSuggestions: (keyword: string) => Promise<Option[]>;
  onBlur?: () => void;
  onSelectSuggestion?: (option?: Option, selectData?: any) => void;
}>;

export const MENU_MAX_HEIGHT = 400;

const AutocompleteInput = (
  props: AutocompleteInputProps
): React.ReactElement => {
  const {
    className,
    error,
    disabled,
    readOnly,
    testId,
    type,
    value,
    placeholder,
    required,
    autoFocus,
    debounceDuration = 0,
    defaultOptions,
    isFinalDestination,
    withIndicator,
    inputClass,
    isMobile,
    freeFlow,
    onSelectSuggestion,
    getSuggestions,
    onBlur,
  } = props;
  const [inputValue, setInputValue] = useState<string | number>(value);
  const [focused, setFocused] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<Array<Option>>(defaultOptions || []);
  const input = useRef<HTMLInputElement>();
  const autocompleteRef = useRef();

  const activeElement = document.activeElement;

  useEffect(() => {
    if (isMobile && input && input.current) {
      input.current.addEventListener('focusout', focusOut);
    }
    return () => {
      focusOut();
      if (isMobile && input.current)
        input.current.removeEventListener('focusout', focusOut);
    };
  }, [input]);

  useEffect(() => {
    if (defaultOptions) setOptions(defaultOptions);
  }, [defaultOptions]);

  useEffect(() => {
    if (activeElement !== input.current && focused) setFocused(false);
  }, [activeElement]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useClickOutside(autocompleteRef, () => {
    if (document.activeElement !== input.current && focused) {
      setFocused(false);
      if (freeFlow) {
        const v = String(inputValue);
        onSelectSuggestion({
          id: v,
          label: v,
          value: v,
        });
      } else setInputValue(value);
    }
  });

  const debouncedOnChange = useCallback(
    debounce((value: string | number, dO: Array<Option>) => {
      setLoading(true);
      getSuggestions(value.toString()).then((res) => {
        if (value.toString().length > 0) setOptions(res || []);
        else setOptions(dO || []);
        setLoading(false);
      });
    }, debounceDuration),
    [defaultOptions]
  );

  const finalClassName = classNames(ROOT, className, {
    [`${ROOT}--error`]: error,
    [`${ROOT}--disabled`]: disabled,
    [`${ROOT}--read-only`]: readOnly,
  });

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFocused(true);
    const { value } = e.target;
    setInputValue(value);
    debouncedOnChange(value, defaultOptions);
    if (freeFlow) {
      const v = String(value);
      onSelectSuggestion({
        id: v,
        label: v,
        value: v,
      });
    }
  };

  const focus = () => {
    input.current && input.current.focus();
    setFocused(true);
  };
  const focusOut = () => setTimeout(() => setFocused(false), 300);

  const onSelect = (option: Option, selectData?: any) => {
    setInputValue(option.value);
    if (onSelectSuggestion) onSelectSuggestion(option, selectData);
    setFocused(false);
    // update selected destinations in formik before searching route
    setTimeout(() => {
      input.current && input.current.blur();
    }, 1);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') debouncedOnChange(inputValue, defaultOptions);
    if (e.key === 'Tab') {
      setFocused(false);
      if (freeFlow) {
        const v = String(inputValue);
        onSelectSuggestion({
          id: v,
          label: v,
          value: v,
        });
      }
    }
  };

  return (
    <div className={finalClassName} ref={autocompleteRef}>
      {withIndicator && !isFinalDestination && (
        <>
          <S.SmallIndicator top={28} />
          <S.SmallIndicator top={38} />
          <S.SmallIndicator top={48} />
        </>
      )}
      {withIndicator && (
        <span
          className={classNames({
            [`${ROOT}__indicator`]: true,
            [`${ROOT}__indicator-red`]: isFinalDestination,
          })}
        />
      )}
      <input
        className={classNames(`${ROOT}__input`, inputClass)}
        data-test-id={testId}
        type={type}
        value={inputValue}
        placeholder={placeholder}
        required={required}
        autoFocus={autoFocus}
        aria-invalid={error}
        aria-describedby={props['aria-describedby']}
        disabled={disabled}
        onFocus={focus}
        onChange={onChangeInput}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        ref={input}
      />
      {focused && (
        <S.ListBox
          className={classNames({
            [`${ROOT}__suggestions`]: true,
            [`${ROOT}__suggestions-with-indicator`]: withIndicator,
          })}
          isOpen={focused}
        >
          <S.OverflowContainer>
            {!loading ? (
              <ListBox
                role="listbox"
                options={options.map((s) => ({
                  label: s.value,
                  name: s.value,
                  value: s.value,
                  code: s.value,
                  icon: s.icon,
                  selectData: s.selectData,
                }))}
                onSelect={onSelect}
                optionClassName={`${ROOT}__option`}
                // mousedown fires before blur event
                // to prevent blur from firing before clicking suggestion item
                onMouseDown={(event) => event.preventDefault()}
              />
            ) : (
              <S.SpinnerContainer>
                <Spinner size="small" />
              </S.SpinnerContainer>
            )}
          </S.OverflowContainer>
        </S.ListBox>
      )}
    </div>
  );
};

const S = {
  ListBox: styled.div<{ isOpen?: boolean }>`
    display: flex;
    visibility: ${({ isOpen }): string => (isOpen ? 'visible' : 'hidden')};
    flex-flow: column nowrap;
    background: #fff;
    border: 1px solid ${Color.border3};
    box-sizing: border-box;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    max-height: ${MENU_MAX_HEIGHT}px;
    padding: 8px 0 8px 0;
    overflow-x: hidden;
    overflow-y: hidden;
    white-space: pre-wrap;
    margin-top: 3px;
  `,
  OverflowContainer: styled.div`
    max-height: 360px;
    overflow-y: auto;
  `,
  SpinnerContainer: styled.div`
    height: 240px;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  AnimateHeight: styled(AnimateHeight)`
    position: absolute;
    width: 100%;
    top: 100%;
    left: 0;
    z-index: 2;
  `,
  SmallIndicator: styled.div<{ top: number }>`
    position: absolute;
    height: 4px;
    width: 4px;
    background-color: #666666;
    border-radius: 50%;
    top: ${({ top }) => top}px;
    left: 3px;
    z-index: 1;
  `,
};

export default AutocompleteInput;
