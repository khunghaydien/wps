import * as React from 'react';

import styled from 'styled-components';

import Tooltip from '@apps/commons/components/Tooltip';
import IconDown from '@apps/commons/images/icons/down.svg';
import IconUp from '@apps/commons/images/icons/up.svg';
import msg from '@apps/commons/languages';
import { CheckBox as $CheckBox } from '@apps/core';
import TextUtil from '@commons/utils/TextUtil';

import {
  SortKeys,
  State,
} from '@apps/approvals-pc/modules/ui/attFixDaily/records';

import MaxSelectField from '../../../particles/MaxSelectField';
import {
  ActualWorkTimeCell,
  AttentionCell,
  CheckBoxCell,
  DepartmentCell,
  EmployeeCell,
  EmployeeIconCell,
  EndTimeCell,
  OverWorkTimeCell,
  RequestAndEventCell,
  Row,
  StartTimeCell,
  TargetDateCell,
  TotalOverWorkTimeCell,
} from './Parts';

// @ts-ignore
const Container = styled(Row)`
  > td {
    position: sticky;
    top: 0;
    // スクロールされる要素が重なり合ってしまうことがあるため。
    z-index: 1;
    padding-top: 4px;
    padding-bottom: 4px;
    background-color: #f4f6f9;
    color: #53688c;
    overflow: hidden;
  }
`;

const SortCellContainer = styled.div`
  display: inline-grid;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    'Label Asc'
    'Label Desc';
  cursor: pointer;
`;

const Label = styled.div`
  grid-area: Label;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  padding-right: 4px;
  > div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const CheckBox = styled($CheckBox)`
  cursor: pointer;
`;

const Direction = styled.div<{
  type: 'asc' | 'desc';
  value: 'asc' | 'desc' | null;
}>`
  ${({ type }) => {
    switch (type) {
      case 'asc':
        return `
          grid-area: Asc;
          padding-bottom: 2px;
          svg {
            vertical-align: bottom;
          }
        `;
      case 'desc':
        return `
          grid-area: Desc;
          padding-top: 2px;
          svg {
            vertical-align: top;
          }
        `;
    }
  }}
  ${({ type, value }) =>
    type === value || value === null ? '' : '* { display: none; }'}
  svg path {
    height: 3px;
    ${({ type, value }) => (type === value ? 'fill: #0090b9;' : ' fill: #666;')}
  }
`;

const SortCell: React.FC<{
  sortKey: SortKeys;
  order: State['order'];
  onClickSort: (key: SortKeys, direction: 'asc' | 'desc') => void;
  children: React.ReactNode;
}> = ({ sortKey, order, onClickSort, children }) => {
  const onClickAsc = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      onClickSort(sortKey, 'asc');
    },
    [onClickSort, sortKey]
  );
  const onClickDesc = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      onClickSort(sortKey, 'desc');
    },
    [onClickSort, sortKey]
  );
  const onClickToggle = React.useCallback(() => {
    let direction: 'asc' | 'desc';
    if (order.key === sortKey) {
      direction = order.direction === 'asc' ? 'desc' : 'asc';
    } else {
      direction = 'asc';
    }
    onClickSort(sortKey, direction);
  }, [onClickSort, order.direction, order.key, sortKey]);

  return (
    <SortCellContainer onClick={onClickToggle}>
      <Label>
        <div>{children}</div>
      </Label>
      <Direction
        type="asc"
        value={direction(order, sortKey)}
        onClick={onClickAsc}
      >
        <IconUp />
      </Direction>
      <Direction
        type="desc"
        value={direction(order, sortKey)}
        onClick={onClickDesc}
      >
        <IconDown />
      </Direction>
    </SortCellContainer>
  );
};

const SORT_KEY = {
  EMPLOYEE: 'submitter.employee.code',
  DEPARTMENT: 'submitter.employee.department.name',
  TARGET_DATE: 'targetDate',
  START_TIME: 'targetRecord.startTime',
  END_TIME: 'targetRecord.endTime',
  ACTUAL_WORK_TIME: 'targetRecord.realWorkTime',
  OVERTIME: 'targetRecord.overTime',
  TOTAL_OVERTIME: 'recordTotal.overTime',
  REQUEST_AND_EVENT: 'targetRecord.event',
} as const;

const isOrdered = (order: State['order'], key: SortKeys) => order.key === key;

const direction = (order: State['order'], key: SortKeys) =>
  isOrdered(order, key) ? order.direction : null;

const Header: React.FC<{
  maxSelection: number;
  order: State['order'];
  checkedAll: boolean;
  onCheckAll: () => void;
  onClickSort: (key: SortKeys, direction: 'asc' | 'desc') => void;
  onChangeMaxSelection: (maxSelection: number) => void;
}> = ({
  maxSelection,
  order,
  checkedAll,
  onCheckAll,
  onClickSort,
  onChangeMaxSelection,
}) => (
  <Container>
    <AttentionCell />
    <CheckBoxCell>
      <Tooltip
        align="top left"
        content={TextUtil.template(msg().Appr_Msg_MaxSelected, maxSelection)}
      >
        <CheckBox onChange={onCheckAll} checked={checkedAll} />
      </Tooltip>
    </CheckBoxCell>
    <EmployeeIconCell>
      <MaxSelectField value={maxSelection} onChange={onChangeMaxSelection} />
    </EmployeeIconCell>
    <EmployeeCell
      title={`${msg().Com_Lbl_EmployeeCode} / ${msg().Com_Lbl_EmployeeName}`}
    >
      <SortCell
        sortKey={SORT_KEY.EMPLOYEE}
        order={order}
        onClickSort={onClickSort}
      >
        {msg().Com_Lbl_EmployeeCode} / {msg().Com_Lbl_EmployeeName}
      </SortCell>
    </EmployeeCell>
    <DepartmentCell title={msg().Appr_Lbl_DepartmentName}>
      <SortCell
        sortKey={SORT_KEY.DEPARTMENT}
        order={order}
        onClickSort={onClickSort}
      >
        {msg().Appr_Lbl_DepartmentName}
      </SortCell>
    </DepartmentCell>
    <TargetDateCell title={msg().Att_Lbl_TargetDate}>
      <SortCell
        sortKey={SORT_KEY.TARGET_DATE}
        order={order}
        onClickSort={onClickSort}
      >
        {msg().Att_Lbl_TargetDate}
      </SortCell>
    </TargetDateCell>
    <StartTimeCell title={msg().Att_Lbl_TimeIn}>
      <SortCell
        sortKey={SORT_KEY.START_TIME}
        order={order}
        onClickSort={onClickSort}
      >
        {msg().Att_Lbl_TimeIn}
      </SortCell>
    </StartTimeCell>
    <EndTimeCell title={msg().Att_Lbl_TimeOut}>
      <SortCell
        sortKey={SORT_KEY.END_TIME}
        order={order}
        onClickSort={onClickSort}
      >
        {msg().Att_Lbl_TimeOut}
      </SortCell>
    </EndTimeCell>
    <ActualWorkTimeCell title={msg().Att_Lbl_ActualWork}>
      <SortCell
        sortKey={SORT_KEY.ACTUAL_WORK_TIME}
        order={order}
        onClickSort={onClickSort}
      >
        {msg().Att_Lbl_ActualWork}
      </SortCell>
    </ActualWorkTimeCell>
    <OverWorkTimeCell title={msg().Att_Lbl_Overtime}>
      <SortCell
        sortKey={SORT_KEY.OVERTIME}
        order={order}
        onClickSort={onClickSort}
      >
        {msg().Att_Lbl_Overtime}
      </SortCell>
    </OverWorkTimeCell>
    <TotalOverWorkTimeCell title={msg().Att_Lbl_TotalOvertime}>
      <SortCell
        sortKey={SORT_KEY.TOTAL_OVERTIME}
        order={order}
        onClickSort={onClickSort}
      >
        {msg().Att_Lbl_TotalOvertime}
      </SortCell>
    </TotalOverWorkTimeCell>
    <RequestAndEventCell title={msg().Att_Lbl_RequestAndEvent}>
      <SortCell
        sortKey={SORT_KEY.REQUEST_AND_EVENT}
        order={order}
        onClickSort={onClickSort}
      >
        {msg().Att_Lbl_RequestAndEvent}
      </SortCell>
    </RequestAndEventCell>
  </Container>
);

export default Header;
