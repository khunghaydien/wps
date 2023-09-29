import React from 'react';

import styled from 'styled-components';

import { AutoHoursAllocationDictItem } from '@apps/domain/models/time-tracking/AutoHoursAllocationDict';

import AddRowButton from './AddRowButton';
import ListHeader from './ListHeader';
import ListRow, {
  HandlerProps as ListRowHandlerProps,
  ValueProps as ListRowValueProps,
} from './ListRow';

const TableWrapper = styled.div`
  flex: 1 1 0;
  width: 100%;
  min-height: 100%;
`;

const AddRowButtonWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
`;

const TableScrollDiv = styled.div`
  height: calc(100% - 40px); // 40px = Header's height
  overflow-y: auto;
`;

type ownValueProps = {
  dictList: { [key: string]: AutoHoursAllocationDictItem };
  dictListAllKeys: string[];
};

type ownHandlerProps = {
  addItem: () => void;
};

export type ValueProps = Omit<ListRowValueProps, 'dictionary'> & ownValueProps;

export type HandlerProps = ListRowHandlerProps & ownHandlerProps;

export type Props = ValueProps & HandlerProps;

const Table: React.FC<Props> = ({
  dictList,
  dictListAllKeys,
  addItem,
  ...listRowProps
}) => {
  const allocateDicList = dictListAllKeys.map((key) => dictList[key]);

  return (
    <TableWrapper>
      <ListHeader />
      <TableScrollDiv>
        {allocateDicList?.map((item) => (
          <ListRow key={item.key} dictionary={item} {...listRowProps} />
        ))}
        <AddRowButtonWrapper>
          <AddRowButton onClick={addItem} />
        </AddRowButtonWrapper>
      </TableScrollDiv>
    </TableWrapper>
  );
};
export default Table;
