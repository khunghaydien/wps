import React, { forwardRef, memo, useContext, useMemo, useRef } from 'react';

import { useWindowHeight } from '@react-hook/window-size';
import isNil from 'lodash/isNil';

import styled from 'styled-components';

import DropdownButton from '../../elements/DropdownButton';
import { useId, useRect } from '../../hooks';
import DropdownContext, { Option } from './DropdownContext';
import DropdownProvider from './DropdownProvider';
import QuickSearchableListBox from './QuickSearchableListBox';

interface Props<T> extends Omit<React.ComponentType<'select'>, 'children'> {
  'data-testid'?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
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

const S = {
  MenuWrapper: styled.div.attrs<{
    width?: number;
    top?: number;
    bottom?: number;
    left?: number;
  }>(({ width = 0, top, bottom, left }) => ({
    style: {
      width: `${width}px`,
      top: `${!isNil(top) ? `${top}px` : 'inherit'}`,
      bottom: `${!isNil(bottom) ? `${bottom}px` : 'inherit'}`,
      left: `${!isNil(left) ? `${left}px` : 'inherit'}`,
    },
  }))`
    position: absolute;

    /**
     * NOTE
     * Consider making it constant.
     * This value is the same as the core/DialogRoot's z-index value.
     */
    z-index: 6000000;
  `,
};

interface DropdownButtonContainerProps {
  'data-testid'?: string;
  className?: string;
  readOnly?: boolean;
  disabled?: boolean;
  value?: any;
  placeholder?: string;
  ref?: React.Ref<HTMLDivElement>;
}

const DropdownButtonContainer = memo<DropdownButtonContainerProps>(
  forwardRef<HTMLDivElement, DropdownButtonContainerProps>(
    ({ 'data-testid': testId, ...props }, ref: React.Ref<HTMLDivElement>) => {
      const context = useContext(DropdownContext);

      return (
        <DropdownButton
          {...props}
          ref={ref}
          aria-haspopup="listbox"
          data-testid={testId}
          isOpen={context.isMenuOpened}
          isValueSelected={!!context.selectedOption.value}
          label={context.label}
          onClick={context.clickDropdown}
        />
      );
    }
  )
);

DropdownButtonContainer.displayName = 'DropdownButtonContainer';

const DropdownMenuContainer = memo<{
  'data-testid'?: string;
  ref: React.Ref<HTMLDivElement>;
}>(
  forwardRef((_props, ref: React.Ref<HTMLDivElement>) => {
    const context = useContext(DropdownContext);
    const id = useId();

    return (
      <QuickSearchableListBox
        key={id}
        ref={ref}
        role="listbox"
        isOpen={context.isMenuOpened}
        isLoading={context.isOptionListLoading}
        onChange={context.changeTerm}
        onSelect={context.selectOption}
        options={context.options}
        selectedOption={context.selectedOption}
        term={context.term}
      />
    );
  })
);

DropdownMenuContainer.displayName = 'DropdownMenuContainer';

const DropdownContainer = memo(
  (props: {
    'data-testid'?: string;
    className?: string;
    disabled?: boolean;
    readOnly?: boolean;
    value?: any;
    placeholder?: string;
  }) => {
    const { DropdownMenu, ...context } = useContext(DropdownContext);

    const buttonRef = useRef<HTMLDivElement>();
    const menuRef = useRef<HTMLDivElement>();

    const {
      width,
      height: buttonHeight,
      top,
      bottom,
      left,
    } = useRect(buttonRef, {
      updateOnScroll: context.isMenuOpened,
    });
    const { height } = useRect(menuRef);

    const windowHeight = useWindowHeight();
    const SPACER = 4;
    /* px */
    const position: {
      bottom: number | null | undefined;
      left: number;
      top: number | null | undefined;
      width: number;
    } = useMemo(() => {
      const topSpace = top;
      const bottomSpace = windowHeight - bottom;
      const isRenderingBottom = bottomSpace >= topSpace;
      if (isRenderingBottom) {
        // Show menu at the bottom of DropdownButton
        const top = bottom + SPACER;
        return {
          width,
          top,
          bottom: null,
          left,
        };
      } else {
        // Show menu at the top of DropdownButton
        const top = topSpace - height - SPACER;
        return {
          width,
          top,
          bottom: null,
          left,
        };
      }
    }, [width, height, top, bottom, left, buttonHeight, windowHeight]);
    const positionedMenu = useMemo(() => {
      return (
        <>
          {context.isMenuOpened && (
            <DropdownMenu>
              <S.MenuWrapper {...position}>
                <DropdownMenuContainer
                  data-testid={props['data-testid']}
                  ref={menuRef}
                />
              </S.MenuWrapper>
            </DropdownMenu>
          )}
        </>
      );
    }, [
      position.width,
      position.top,
      position.bottom,
      position.left,
      menuRef,
      context.isMenuOpened,
      props['data-testid'],
    ]);

    return (
      <>
        <DropdownButtonContainer
          data-testid={props['data-testid']}
          className={props.className}
          ref={buttonRef}
          readOnly={props.readOnly}
          disabled={props.disabled}
          value={props.value}
          placeholder={props.placeholder}
        />
        {positionedMenu}
      </>
    );
  }
);

const QuickSearchableDropdown = <T,>({
  'data-testid': testId,
  className,
  onSelect,
  items,
  filterSelector,
  optionSelector,
  ...props
}: Props<T>): React.ReactElement => {
  return (
    /**
     * Context API is used to separate the update cycle of Menu Component and its parent component.
     *
     * When rendering via Portal, Component is unmounted and remounted each time it is re-rendered.
     * At this time, the native DOM is also written after deletion, so focus is lost.
     * Since QuickSearchableDropdown has input in Menu, this behavior is not accepted.
     * So, to isolate the update cycle of the Menu Component and its parent component,
     * Context API is applied here.
     */
    <DropdownProvider
      {...props}
      onSelect={onSelect}
      items={items}
      filterSelector={filterSelector}
      optionSelector={optionSelector}
    >
      <DropdownContainer
        data-testid={testId}
        className={className}
        {...props}
      />
    </DropdownProvider>
  );
};

QuickSearchableDropdown.defaultProps = {
  hasEmptyOption: false,
};

export default QuickSearchableDropdown;
