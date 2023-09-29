import * as React from 'react';

import styled from 'styled-components';

import Tooltip from '@apps/commons/components/Tooltip';
import iconAttentions from '@apps/commons/images/iconAttention.png';
import msg from '@apps/commons/languages';
import TimeUtil from '@apps/commons/utils/TimeUtil';
import { CheckBox as $CheckBox } from '@apps/core';

import { FixDailyRequest } from '@attendance/domain/models/approval/FixDailyRequest';

import {
  ActualWorkTimeCell,
  AttentionCell,
  CheckBoxCell,
  DepartmentCell,
  EmployeeCell,
  EmployeeIconCell,
  EndTimeCell as $EndTimeCell,
  OverWorkTimeCell,
  RequestAndEventCell,
  Row,
  StartTimeCell as $StartTimeCell,
  TargetDateCell,
  TotalOverWorkTimeCell,
} from './Parts';
import { tip } from '@attendance/ui/helpers/attentionDailyMessages';

const Container = styled(
  ({
    selected: _selected,
    ...props
  }: { selected: boolean } & React.ComponentProps<typeof Row>) => (
    <Row {...props} />
  )
)`
  ${({ selected }) =>
    selected ? 'background-color: #58CDFF;' : 'background-color: #fff;'}
  > td {
    padding-top: 7px;
    padding-bottom: 7px;
  }

  cursor: pointer;
`;

const AttentionIcon = styled.img`
  width: 100%;
`;

const Label = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CheckBox = styled($CheckBox)`
  cursor: pointer;
`;

// @ts-ignore
const StartTimeCell = styled($StartTimeCell)<{ modified: boolean }>`
  ${({ modified }) =>
    modified
      ? `
    text-decoration: underline;
  `
      : ''}
`;

const EndTimeCell = styled($EndTimeCell)<{ modified: boolean }>`
  ${({ modified }) =>
    modified
      ? `
    text-decoration: underline;
  `
      : ''}
`;

const Item: React.FC<{
  request: FixDailyRequest;
  selected: boolean;
  checked: boolean;
  overSelectionMax: boolean;
  onClickRow: () => void;
  onChangeCheckBox: (value: boolean) => void;
}> = ({
  request,
  selected,
  checked,
  overSelectionMax,
  onClickRow,
  onChangeCheckBox: $onChangeCheckBox,
}) => {
  const onChangeCheckBox = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      $onChangeCheckBox(e.currentTarget.checked);
    },
    [$onChangeCheckBox]
  );
  const onClickCheckBox = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };
  const { targetRecord: record, recordTotal } = request;

  return (
    <Container onClick={onClickRow} selected={selected}>
      <AttentionCell>
        {record.attentions && record.attentions.length ? (
          <Tooltip align="right" content={tip(record.attentions)}>
            <AttentionIcon
              src={iconAttentions}
              alt={msg().Att_Msg_DailyAttention}
            />
          </Tooltip>
        ) : null}
      </AttentionCell>
      <CheckBoxCell>
        <CheckBox
          onChange={onChangeCheckBox}
          onClick={onClickCheckBox}
          checked={checked}
          disabled={!checked && overSelectionMax}
        />
      </CheckBoxCell>
      <EmployeeIconCell>
        <img src={request.submitter.employee.photoUrl} alt={''} />
      </EmployeeIconCell>
      <EmployeeCell>
        <Label title={request.submitter.employee.code}>
          {request.submitter.employee.code}
        </Label>
        <Label title={request.submitter.employee.name}>
          {request.submitter.employee.name}
        </Label>
      </EmployeeCell>
      <DepartmentCell title={request.submitter.employee.department.name}>
        {request.submitter.employee.department.name}
      </DepartmentCell>
      <TargetDateCell>{request.targetDate}</TargetDateCell>
      <StartTimeCell modified={record.startTimeModified}>
        {TimeUtil.toHHmm(record.startTime)}
      </StartTimeCell>
      <EndTimeCell modified={record.endTimeModified}>
        {TimeUtil.toHHmm(record.endTime)}
      </EndTimeCell>
      <ActualWorkTimeCell>
        {TimeUtil.toHHmm(record.realWorkTime)}
      </ActualWorkTimeCell>
      <OverWorkTimeCell>{TimeUtil.toHHmm(record.overTime)}</OverWorkTimeCell>
      <TotalOverWorkTimeCell>
        {TimeUtil.toHHmm(recordTotal.overTime)}
      </TotalOverWorkTimeCell>
      <RequestAndEventCell title={record.event}>
        {record.event}
      </RequestAndEventCell>
    </Container>
  );
};

export default Item;
