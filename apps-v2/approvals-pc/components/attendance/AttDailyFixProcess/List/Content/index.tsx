import * as React from 'react';

import styled from 'styled-components';

import { FixDailyRequest } from '@attendance/domain/models/approval/FixDailyRequest';

import Header from './Header';
import Item from './Item';
import { Table } from './Parts';

const Container = styled.div`
  width: 100%;
  overflow: auto;
`;

const Content: React.FC<
  {
    selectedId: string;
    checkedIds: string[];
    requests: FixDailyRequest[];
    onClickRow: (id: string) => void;
    onCheckRow: (id: string) => void;
  } & React.ComponentProps<typeof Header>
> = ({
  maxSelection,
  order,
  checkedIds,
  selectedId,
  requests,
  checkedAll,
  onClickSort,
  onClickRow,
  onCheckRow,
  onCheckAll,
  onChangeMaxSelection,
}) => (
  <Container>
    <Table>
      <thead>
        <Header
          order={order}
          onClickSort={onClickSort}
          onCheckAll={onCheckAll}
          onChangeMaxSelection={onChangeMaxSelection}
          checkedAll={checkedAll}
          maxSelection={maxSelection}
        />
      </thead>
      <tbody>
        {requests.map((request) => (
          <Item
            key={request.id}
            request={request}
            checked={checkedIds.includes(request.id)}
            selected={selectedId === request.id}
            overSelectionMax={checkedIds.length >= maxSelection}
            onClickRow={() => onClickRow(request.id)}
            onChangeCheckBox={() => onCheckRow(request.id)}
          />
        ))}
      </tbody>
    </Table>
  </Container>
);

export default Content;
