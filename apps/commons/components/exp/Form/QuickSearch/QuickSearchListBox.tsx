import React, { useContext } from 'react';
import AnimateHeight from 'react-animate-height';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import Spinner from '@apps/core/elements/Spinner';
import { Color } from '@apps/core/styles';

import CheckBoxFilter from './CheckBoxFilter';
import ListBox from './ListBox';
import { Option, QuickSearchContext } from './QuickSearchContext';

export const MENU_MAX_HEIGHT = 400;

interface Props {
  ROOT?: string;
  title: string;
  useJctRegistrationNumber?: boolean;
  onClickOpenDialog: () => void;
  onSelect: (option: Option) => void;
}

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
  DialogSelection: styled.div`
    padding: 6px 10px;
    color: rgb(39, 130, 237);
    cursor: pointer;
  `,
  Heading: styled.div`
    padding: 6px 0 6px 10px;
    text-transform: uppercase;
    font-weight: bold;
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
  `,
};

const QuickSearchableListBox = ({ onClickOpenDialog, ...props }: Props) => {
  const {
    isExpanded: isOpen,
    isLoading,
    selected,
    options,
    cursor,
  } = useContext(QuickSearchContext);
  const height = isOpen ? 'auto' : 0;
  return (
    <S.AnimateHeight height={height}>
      <S.ListBox isOpen={isOpen}>
        <S.DialogSelection
          onClick={onClickOpenDialog}
          data-testid={`${props.ROOT}-open-dialog`}
        >
          {msg().Exp_Lbl_OpenDialog}
        </S.DialogSelection>
        <CheckBoxFilter />
        <S.Heading>{props.title}</S.Heading>
        <S.OverflowContainer>
          {!isLoading ? (
            <ListBox
              role="listbox"
              options={options}
              selectedOption={selected as Option}
              cursor={cursor}
              {...props}
            />
          ) : (
            <S.SpinnerContainer>
              <Spinner size="small" />
            </S.SpinnerContainer>
          )}
        </S.OverflowContainer>
      </S.ListBox>
    </S.AnimateHeight>
  );
};

export default QuickSearchableListBox;
