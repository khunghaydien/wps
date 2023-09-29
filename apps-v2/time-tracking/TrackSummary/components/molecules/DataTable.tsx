import * as React from 'react';

import styled, { css } from 'styled-components';

import { Body, Cell, Header, HeaderCol, Row, Table } from '../atoms/Table';

type ColumnSelector<TRow extends Record<string, unknown>> = {
  [header: string]: React.ComponentType<
    TRow & {
      color: string | null | undefined;
    }
  >;
};

type Props<TRow extends Record<string, unknown>> = Readonly<{
  className?: string;
  data: ReadonlyArray<TRow>;
  column: ColumnSelector<TRow>;
  colors?: ReadonlyArray<string>;
}>;

const CircleCol = styled(HeaderCol)`
  width: 12px;
`;

const Circle = styled.div`
  border-radius: 50%;
  background-color: ${(props: Record<string, any>) => props.color};
  height: 12px;
  width: 12px;
`;

const FirstHeaderCol = styled(HeaderCol)<{ isStretch: boolean }>`
  min-width: 480px;
  ${({ isStretch }) =>
    isStretch &&
    css`
      width: 100%;
      min-width: auto;
    `}
`;

const LastHeaderCol = styled(HeaderCol)`
  width: 380px;
`;

const DataTable = <TRow extends Record<string, unknown>>(
  props: Props<TRow>
) => {
  const colors = props.colors || [];
  const colorLength = colors.length;
  const headers = Object.keys(props.column);
  const lastIndex = headers.length - 1;

  return (
    <Table className={props.className}>
      <Header>
        <Row>
          {props.colors && <CircleCol />}
          {headers.map((header: string, index: number) => {
            if (index === 0) {
              return (
                <FirstHeaderCol
                  colIndex={index} // Approval screen has 2 columns
                  isStretch={headers.length === 2}
                >
                  {header}
                </FirstHeaderCol>
              );
            } else if (index === lastIndex) {
              return <LastHeaderCol colIndex={index}>{header}</LastHeaderCol>;
            }
            return <HeaderCol colIndex={index}>{header}</HeaderCol>;
          })}
        </Row>
      </Header>
      <Body>
        {props.data.map((datum, rowIndex: number) => {
          const colorIndex = rowIndex % colorLength;
          const color = props.colors ? colors[colorIndex] : undefined;
          return (
            <Row>
              {props.colors && (
                <Cell>
                  <Circle color={color} />
                </Cell>
              )}
              {headers.map((header, index) => {
                const Content = props.column[header];
                return (
                  <Cell colIndex={index}>
                    <Content {...datum} color={color} />
                  </Cell>
                );
              })}
            </Row>
          );
        })}
      </Body>
    </Table>
  );
};

export default DataTable;
