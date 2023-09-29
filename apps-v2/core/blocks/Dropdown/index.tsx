import React, { useMemo, useRef } from 'react';

import { useWindowHeight } from '@react-hook/window-size';
import isNil from 'lodash/isNil';

import styled from 'styled-components';

import DropdownButton from '../../elements/DropdownButton';
import ListBox from '../../elements/ListBox';
import { useDropdown, useRect } from '../../hooks';
import { Color } from '../../styles';

const MENU_MAX_HEIGHT = 384;
/* px */

export type Option = {
  id?: string;
  value: any;
  label?: string | React.ReactNode;
};

type DropdownProps = Omit<
  React.ComponentProps<'select'>,
  'children' | 'value' | 'onSelect'
>;

interface Props extends DropdownProps {
  'data-testid'?: string;
  readOnly?: boolean;
  className?: string;
  listBoxClassName?: string;
  value?: any;
  options: ReadonlyArray<Option>;
  // Add empty item to option list if hasEmptyOption is true
  hasEmptyOption?: boolean;
  placeholder?: string;
  onSelect: (value: Option) => void;
}

const S = {
  WrapperMenu: styled.div<{
    width?: number;
    top?: number;
    bottom?: number;
    left?: number;
  }>`
    position: absolute;
    width: ${({ width = 0 }): number => width}px;
    top: ${({ top }): string => (!isNil(top) ? `${top}px` : 'inherit')};
    bottom: ${({ bottom }): string =>
      !isNil(bottom) ? `${bottom}px` : 'inherit'};
    left: ${({ left }): string => (!isNil(left) ? `${left}px` : 'inherit')};

    /**
     * NOTE
     * Consider making it constant
     */
    z-index: 6000000;
  `,
  ListBox: styled.div<{ isOpen: boolean }>`
    display: ${({ isOpen }): string => (isOpen ? 'block' : 'none')};
    background: #fff;
    border: 1px solid ${Color.border3};
    box-sizing: border-box;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    max-height: ${MENU_MAX_HEIGHT}px;
    padding: 8px 0 8px 0;
    overflow-x: hidden;
    overflow-y: auto;
    white-space: pre-wrap;
  `,
};

const Dropdown: React.FC<Props> = (props: Props) => {
  const testId = props['data-testid'];
  const {
    label,
    isOpening,
    selectedOption,
    options,
    onClick,
    onSelect,
    DropdownMenu,
  } = useDropdown(props);

  const buttonRef = useRef<HTMLDivElement>();
  const menuRef = useRef<HTMLUListElement>();

  const { width, top, bottom, left } = useRect(buttonRef, {
    updateOnScroll: isOpening,
  });
  const { height } = useRect(menuRef);

  const windowHeight = useWindowHeight();
  const SPACER = 4;
  /* px */
  const position = useMemo(() => {
    const isMenuOverflowBottom = bottom + MENU_MAX_HEIGHT > windowHeight;
    if (isMenuOverflowBottom) {
      // Show menu at the top of DropdownButton
      return {
        width,
        top: top - height - SPACER,
        bottom: top - SPACER,
        left,
      };
    } else {
      // Show menu at the bottom of DropdownButton
      return {
        width,
        top: bottom + SPACER,
        left,
      };
    }
  }, [width, height, top, bottom, left, windowHeight]);
  const positionedMenu = useMemo(() => {
    return (
      <>
        {isOpening && (
          <DropdownMenu>
            <S.WrapperMenu {...position}>
              <S.ListBox
                className={props.listBoxClassName}
                as={ListBox}
                ref={menuRef}
                isOpen={isOpening}
                role="listbox"
                data-testid={testId}
                onSelect={onSelect}
                options={options}
                selectedOption={selectedOption}
              />
            </S.WrapperMenu>
          </DropdownMenu>
        )}
      </>
    );
  }, [position, menuRef, isOpening, props['data-testid']]);

  return (
    <>
      <DropdownButton
        {...props}
        ref={buttonRef}
        aria-haspopup="listbox"
        data-testid={testId}
        isOpen={isOpening}
        isValueSelected={!!selectedOption.value}
        label={label}
        onClick={onClick}
      />
      {positionedMenu}
    </>
  );
};

Dropdown.defaultProps = {
  hasEmptyOption: false,
};

export default Dropdown;
