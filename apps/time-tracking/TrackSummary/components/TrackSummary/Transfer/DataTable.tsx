import * as React from 'react';

import isNil from 'lodash/isNil';

import styled from 'styled-components';

import { Status } from '../../../../../domain/models/approval/request/Status';

import { Body, Cell, Header, HeaderCol, Row, Table } from '../../atoms/Table';
import { Task } from '../../TrackSummary/Props';

// @ts-ignore https://github.com/microsoft/TypeScript/issues/37597
const StyledTable = styled(Table)`
  th,
  td {
    text-align: left;
    word-break: break-all;
    :first-child,
    :nth-child(3) {
      min-width: 148px;
    }
    :nth-child(2),
    :nth-child(4) {
      min-width: 312px;
    }
    :nth-last-child(2),
    :nth-last-child(3) {
      text-align: right;
      width: auto;
    }
    :last-child {
      text-align: center;
      border-bottom: 1px solid #fff;
      width: 24px;
    }
  }
`;

type ColumnSelector<TRow extends Record<string, any>> = {
  [header: string]: React.ComponentType<
    TRow & {
      color: string | null | undefined;
    }
  >;
};

type Props<TRow extends Record<string, any>> = Readonly<{
  onSelect: (event: React.SyntheticEvent, task: Task) => void;
  className?: string;
  data: ReadonlyArray<TRow>;
  column: ColumnSelector<TRow>;
  colors?: ReadonlyArray<string>;
  status?: Status;
}>;

const EmptyRow = styled(Row)``;

const CircleCol = styled(HeaderCol)`
  width: 12px;
`;

const Circle = styled.div`
  border-radius: 50%;
  background-color: ${(props: Record<string, any>) => props.color};
  height: 12px;
  width: 12px;
`;

const DataTable = <TRow extends Record<string, any>>(props: Props<TRow>) => {
  const colors = props.colors || [];
  const colorLength = colors.length;
  const headers = Object.keys(props.column);

  return (
    <StyledTable className={props.className}>
      <Header>
        <Row>
          {props.colors && <CircleCol />}
          {headers.map((header: string, index: number) => {
            return <HeaderCol colIndex={index}>{header}</HeaderCol>;
          })}
        </Row>
      </Header>
      <Body>
        {(isNil(props.data) || props.data.length < 1) && <EmptyRow />}
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
                    <Content
                      {...datum}
                      color={color}
                      status={props.status}
                      onSelect={props.onSelect}
                    />
                  </Cell>
                );
              })}
            </Row>
          );
        })}
      </Body>
    </StyledTable>
  );
};

export default DataTable;
