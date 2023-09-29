import styled, { css } from 'styled-components';

import variables from '../../../../commons/styles/wsp.scss';

const spacer = css`
  padding: 4px 6px 5px 6px;

  :last-child {
    padding: 0 0 0 6px;
  }

  :first-child {
    padding: 0 6px 0 0;
  }
`;

export const Table = styled.table`
  padding: 0;
  margin: 0;
`;

export const Header = styled.thead`
  white-space: nowrap;
`;

export const HeaderCol = styled.th<{ colIndex?: number }>`
  text-align: ${(props: Record<string, any>) =>
    props.colIndex !== 0 ? 'right' : 'left'};
  color: ${variables['color-text-2']};
  font-size: ${variables['text-body-1-font-size']};
  font-weight: normal;
  line-height: ${variables['text-body-1-line-height']};
  ${spacer}
`;

export const Body = styled.tbody``;

export const Row = styled.tr`
  border-bottom: ${(props: Record<string, any>) =>
    props.borderless ? 'none' : `1px solid ${variables['color-border-1']}`};
  height: 24px;
  font-size: ${variables['text-body-1-font-size']};
  font-weight: normal;
  line-height: ${variables['text-body-1-line-height']};
`;

export const Cell = styled.td<{ colIndex?: number; emphasis?: boolean }>`
  text-align: ${(props) => (props.colIndex !== 0 ? 'right' : 'left')};
  ${spacer};
  ${(props) =>
    props.emphasis
      ? `
    font-size: ${variables['text-header-1-font-size']};
    font-weight: ${variables['text-header-1-font-weight']};
    line-height: ${variables['text-header-1-line-height']};
  `
      : ''}
`;
