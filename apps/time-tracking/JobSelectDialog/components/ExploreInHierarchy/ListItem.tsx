import * as React from 'react';

import styled, { css } from 'styled-components';

import { ArrowRightButton } from '../../../../core';
import { Color } from '../../../../core/styles';

type Props = {
  children: React.ReactNode;
  className?: string;
  hasChildren?: boolean;
  opened?: boolean;
  selected?: boolean;
  onClick: (arg0: React.SyntheticEvent<HTMLElement>) => void;
};

const Styles = {
  selected: css`
    color: #fff;
    background: ${Color.accent};

    :hover {
      cursor: pointer;
    }
  `,
  opened: css`
    color: ${Color.primary};
    background: #ebf3f7;

    :hover {
      cursor: pointer;
      background: ${Color.hover};
    }
  `,
  default: css`
    :hover {
      cursor: pointer;
      background: ${Color.hover};
    }
  `,
};

type SProps = {
  opened?: boolean;
  selected?: boolean;
};

const getStyle = ({ opened, selected }: SProps) => {
  if (selected) {
    return Styles.selected;
  } else if (opened) {
    return Styles.opened;
  } else {
    return Styles.default;
  }
};

const S = {
  Container: styled.div<SProps>`
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    width: 240px;
    height: 100%;
    padding: 6px 20px 7px 20px;
    ${getStyle};
  `,
  Content: styled.div<SProps>`
    ${getStyle};
  `,
  OpenButton: styled(ArrowRightButton)<SProps>`
    ${getStyle};

    :hover {
      background: transparent;
    }
  `,
};

const ListItem = ({ children, hasChildren, onClick, ...props }: Props) => {
  return (
    <S.Container onClick={onClick} {...props}>
      <S.Content {...props}>{children}</S.Content>
      {hasChildren && (
        <S.OpenButton color={props.selected ? 'white' : undefined} />
      )}
    </S.Container>
  );
};

export default ListItem;
