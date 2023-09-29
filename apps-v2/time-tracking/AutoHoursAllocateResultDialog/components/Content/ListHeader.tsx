import React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';

import Cell from './Cell';

const TableHeaderWrapper = styled.div`
  display: flex;
  height: 36px;
  line-height: 35px;
  text-align: left;
  border-right: 1px solid #ddd;
  border-left: 1px solid #ddd;
  background: #f9f9f9;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  overflow-x: hidden;
`;

type Props = {
  checkAll: boolean;
  toggleCheckAll: (checkAllFlg: boolean) => void;
};

const ListHeader: React.FC<Props> = ({ checkAll, toggleCheckAll }) => {
  return (
    <TableHeaderWrapper>
      <Cell left={0} width={50} isHeader={true} cellNumber={1}>
        <input
          type="checkbox"
          checked={checkAll}
          onChange={() => {
            toggleCheckAll(checkAll);
          }}
        />
      </Cell>
      <Cell left={50} width={90} isHeader={true}>
        {msg().Time_Lbl_Result}
      </Cell>
      <Cell left={140} width={150} isHeader={true}>
        {msg().Time_Lbl_Schedule}
      </Cell>
      <Cell left={290} width={110} isHeader={true}>
        {msg().Time_Lbl_ScheduleTimeRange}
      </Cell>
      <Cell left={400} width={360} isHeader={true}>
        {msg().Trac_Lbl_Job}
      </Cell>
      <Cell left={760} width={190} isHeader={true}>
        {msg().Trac_Lbl_WorkCategory}
      </Cell>
      <Cell left={950} width={100} isHeader={true}>
        {msg().Time_Lbl_Hours}
      </Cell>
      <Cell left={1050} width={150} isHeader={true}>
        {msg().Time_Lbl_TimeTrackingDictionary}
      </Cell>
    </TableHeaderWrapper>
  );
};

export default ListHeader;
