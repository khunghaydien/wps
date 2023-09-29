import React from 'react';

import classNames from 'classnames';

import styled, { keyframes } from 'styled-components';

type Props = {
  noOfRow?: number;
  noOfCol?: number;
  colWidth?: Array<string> | string; // if string, same width will be applied to all columns
  rowHeight?: string;
  className?: string;
  margin?: string; // margin between rows
};

const ROOT = 'commons-skeleton';

const active = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const S = {
  Row: styled.span<{
    margin: string;
  }>`
    margin-top: ${({ margin }) => margin};
    display: flex;
    justify-content: space-between;
    :first-child {
      margin-top: 0;
    }
  `,

  Item: styled.span<{
    width: string;
    rowHeight?: string;
  }>`
    flex-shrink: 1;
    width: ${({ width }) => width};
    background-size: 200px 100%;
    background-repeat: no-repeat;
    border-radius: 4px;
    display: inline-block;
    height: ${({ rowHeight }): string => rowHeight || '20px'};
    background-color: #eee;
    background-image: linear-gradient(90deg, #eee, #f5f5f5, #eee);
    animation: ${active} 1.6s ease-in-out infinite;
  `,
};

const Skeleton = (props: Props) => {
  const {
    noOfRow = 1,
    noOfCol = 1,
    rowHeight = '20px',
    colWidth = '100%',
    margin = '20px',
  } = props;

  const wrapperClass = classNames(ROOT, props.className);

  const table = [];
  // build rows
  for (let i = 0; i < noOfRow; i++) {
    const items = [];
    // build items inside row
    for (let j = 0; j < noOfCol; j++) {
      const width = typeof colWidth === 'string' ? colWidth : colWidth[j];
      items.push(<S.Item rowHeight={rowHeight} width={width} />);
    }
    const row = <S.Row margin={margin}>{items}</S.Row>;
    table.push(row);
  }

  return (
    <div className={wrapperClass}>
      {table}
      {/* for E2E testing */}
      <span className="slds-assistive-text">Loading...</span>
    </div>
  );
};

export default Skeleton;
