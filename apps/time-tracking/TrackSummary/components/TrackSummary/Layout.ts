import styled, { css } from 'styled-components';

import { Card as CoreCard } from '../../../../core';

// eslint-disable-next-line import/prefer-default-export
export const Row = styled.div<{
  height?: string | number;
  noMargin?: boolean;
  align?: string;
}>`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: ${({ align = 'center' }) => align};
  margin: 0 0 ${(props) => (props.noMargin ? '0' : '20px')} 0;
  height: ${(props) => props.height || 'auto'};
`;

export const Card = styled(CoreCard)`
  min-width: 400px;
`;

const NoWrapRows = css`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`;

const HeaderGroupRightStyle = css`
  justify-content: flex-end;
  margin-left: auto;
`;

export const HeaderGroupStyle = css`
  justify-content: flex-start;
`;

export const Header = styled.div`
  ${NoWrapRows};
`;

export const HeaderGroup = styled.div<{ right?: boolean }>`
  ${NoWrapRows};
  justify-self: flex-start;
  ${({ right }) => (right ? HeaderGroupRightStyle : HeaderGroupStyle)};
`;

const RightAlign = css`
  display: flex;
  justify-content: flex-end;
`;

const LeftAlign = css`
  display: flex;
  justify-content: flex-start;
`;

export const HeaderItem = styled.div<{ right?: boolean }>`
  margin-left: 20px;
  min-width: 40px;
  ${({ right }) => (right ? RightAlign : LeftAlign)};
`;
