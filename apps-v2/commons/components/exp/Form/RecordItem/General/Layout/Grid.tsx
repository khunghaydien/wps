import React, { ReactNode } from 'react';

import styled from 'styled-components';

interface IGridProps {
  children: ReactNode;
  columnGap?: number;
  noOfColumns?: number;
  rowGap?: number;
}

const Grid = ({
  columnGap = 0,
  rowGap = 0,
  noOfColumns,
  children,
}: IGridProps) => {
  const commonProps = {
    className: 'grid-column',
    $columnGap: columnGap,
    $rowGap: rowGap,
  };

  if (Number.isInteger(noOfColumns) && noOfColumns > 0) {
    return (
      <FixedWidthGridColumn {...commonProps} $noOfColumns={noOfColumns}>
        {children}
      </FixedWidthGridColumn>
    );
  }

  return <AutofillGridColumn {...commonProps}>{children}</AutofillGridColumn>;
};

export default Grid;

const GridColumn = styled.div<{ $columnGap?: number; $rowGap?: number }>`
  display: grid;
  column-gap: ${({ $columnGap }) => `${$columnGap}px`};
  row-gap: ${({ $rowGap }) => `${$rowGap}px`};
`;

const AutofillGridColumn = styled(GridColumn)`
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
`;

const FixedWidthGridColumn = styled(GridColumn)<{ $noOfColumns?: number }>`
  grid-template-columns: ${({ $noOfColumns }) =>
    `repeat(${$noOfColumns}, 1fr)}`};
`;
