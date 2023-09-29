import React, { useContext } from 'react';

import styled from 'styled-components';

import DotLoader from '@apps/commons/components/DotLoader';
import IconButton from '@apps/core/elements/IconButton';
import { useKey } from '@apps/core/hooks/index';
import { Icons } from '@apps/core/index';
import { Color } from '@apps/core/styles';

import QuickSearchContext from './QuickSearchContext';

import ExpColor from '../../../../styles/exp/variables/_colors.scss';

interface Props extends React.ComponentProps<'input'> {
  ROOT?: string;
  isHighlight?: boolean;
  showLoadingIndicator: boolean;
  onChange: (e: React.SyntheticEvent<HTMLInputElement>) => void;
  onClickRemove?: () => void;
}

type SearchFieldInputProps = Omit<Props, 'onClickRemove'>;

const S = {
  OuterInput: styled.div<{
    disabled?: boolean;
    isExpanded?: boolean;
    isHighlight?: boolean;
  }>`
    display: flex;
    align-items: center;
    height: 32px;
    background: ${({ disabled, isHighlight }) =>
      isHighlight
        ? ExpColor.highlight
        : disabled
        ? Color.background
        : Color.base};
    border: 1px solid ${Color.border3};
    border-radius: 4px;
    padding: 0 8px;
    width: 100%;

    .commons-dot-loader {
      background: ${({ disabled }) =>
        disabled ? Color.background : Color.base} !important;
    }

    :focus-within {
      border: 1px solid ${Color.accent};
      box-shadow: 0 0 3px #0070d2;
    }
  `,

  InnerInput: styled.input.attrs(() => ({
    type: 'text',
  }))`
    height: 100%;
    border: none !important;
    outline: none;
    font-size: 13px;
    line-height: 19px;
    color: ${Color.primary};
    width: 100%;

    ::placeholder {
      color: ${Color.disable};
    }

    :disabled {
      background-color: transparent;
    }
  ` as React.ComponentType<Props>,

  SearchIcon: styled(Icons.Search)<{ disabled?: boolean }>`
    height: 12px;
    width: 12px;
    margin-right: 8px;
    display: ${({ disabled }) => (disabled ? 'none' : 'block')};
  `,
  IconButton: styled(IconButton)<{
    disabled?: boolean;
    hidden?: boolean;
    showLoadingIndicator?: boolean;
  }>`
    height: 12px;
    width: 12px;
    display: ${({ showLoadingIndicator, disabled, hidden }) =>
      showLoadingIndicator || disabled || hidden ? 'none' : 'block'};
    fill: ${Color.secondary};
  `,
  Loader: styled(DotLoader)`
    height: 100%;
    width: 100%;
    & > div {
      position: static !important;
      padding-top: 6px !important;
      transform: none !important;
    }
  `,
};

const onClickInput = (e) => e.target.select();

const InnerInput = (props: SearchFieldInputProps) =>
  props.showLoadingIndicator ? (
    <S.Loader loading />
  ) : (
    <S.InnerInput
      data-testid={`${props.ROOT}-input`}
      key={props.key}
      value={props.value}
      onChange={props.onChange}
      onClick={onClickInput}
      {...props}
    />
  );

const QuickSearchField = (props: Props) => {
  const searchIconKey = useKey();
  const inputKey = useKey();
  const removeKey = useKey();
  const { value, isExpanded } = useContext(QuickSearchContext);
  const { disabled, isHighlight } = props;
  return (
    <S.OuterInput
      isExpanded={isExpanded}
      disabled={disabled}
      isHighlight={isHighlight}
    >
      <S.SearchIcon key={searchIconKey} disabled={disabled} color="disable" />
      <InnerInput key={inputKey} value={value} title={value} {...props} />
      <S.IconButton
        key={removeKey}
        type="button"
        icon={Icons.Close}
        onClick={props.onClickRemove}
        disabled={disabled}
        hidden={!props.onClickRemove || !value}
        data-testid={`${props.ROOT}-clear`}
      />
    </S.OuterInput>
  );
};

export default QuickSearchField;
