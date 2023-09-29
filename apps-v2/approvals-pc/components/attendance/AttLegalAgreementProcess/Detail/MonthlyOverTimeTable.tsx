import React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import TimeUtil from '@apps/commons/utils/TimeUtil';

import { MonthlyRequest } from '@attendance/domain/models/approval/LegalAgreementRequest';

const Container = styled.div`
  display: flex;
  flex-wrap: nowrap;
  font-size: 13px;
  margin-bottom: 45px;
`;

const Left = styled.div`
  margin-left: 35px;
`;

const Right = styled.div`
  margin-left: 35px;
  margin-right: 35px;
`;

const Group = styled.div`
  border-left: 1px #d6dce5 solid;
  border-right: 1px #d6dce5 solid;
  border-bottom: 1px #d6dce5 solid;
  &:first-child {
    border-top: 1px #d6dce5 solid;
  }
`;

const Row = styled.div`
  flex-basis: 100%;
  display: flex;
  height: auto;
  line-height: 30px;
  border-bottom: 1px #d6dce5 dashed;
  &:last-child {
    border-bottom: 0px;
  }
  overflow-wrap: break-word;
`;

const Label = styled.span`
  width: 200px;
  padding-left: 5px;
  background-color: #f2f5f8;
  color: #8094ad;
`;

const Value = styled.span`
  width: 100px;
  padding-right: 5px;
  background-color: #fff;
  text-align: right;
`;

const handleTimes = (times: number | null) => {
  if (!times) {
    return '00:00';
  } else {
    return TimeUtil.toHHmm(times);
  }
};

const MonthlyOverTimeTable: React.FC<{
  overtime: MonthlyRequest;
  showSpecial: boolean;
}> = (props) => (
  <Container>
    <Left>
      <Group>
        <Row>
          <Label>{msg().Att_Lbl_OvertimeHours}</Label>
          <Value>{handleTimes(props.overtime.monthlyOvertimeHours)}</Value>
        </Row>
        {props.showSpecial && (
          <Row>
            <Label>{msg().Att_Lbl_SpecialOvertimeHours}</Label>
            <Value>
              {handleTimes(props.overtime.specialMonthlyOvertimeHours)}
            </Value>
          </Row>
        )}
      </Group>
      <Group>
        <Row>
          <Label>{msg().Att_Lbl_MonthlyOvertimeHours1MoAgo}</Label>
          <Value>
            {handleTimes(props.overtime.monthlyOvertimeHours1MoAgo)}
          </Value>
        </Row>
        {props.showSpecial && (
          <Row>
            <Label>{msg().Att_Lbl_SpecialMonthlyOvertimeHours1MoAgo}</Label>
            <Value>
              {handleTimes(props.overtime.specialMonthlyOvertimeHours1MoAgo)}
            </Value>
          </Row>
        )}
      </Group>
      <Group>
        <Row>
          <Label>{msg().Att_Lbl_MonthlyOvertimeHours2MoAgo}</Label>
          <Value>
            {handleTimes(props.overtime.monthlyOvertimeHours2MoAgo)}
          </Value>
        </Row>
        {props.showSpecial && (
          <Row>
            <Label>{msg().Att_Lbl_SpecialMonthlyOvertimeHours2MoAgo}</Label>
            <Value>
              {handleTimes(props.overtime.specialMonthlyOvertimeHours2MoAgo)}
            </Value>
          </Row>
        )}
      </Group>
    </Left>
    <Right>
      <Group>
        <Row>
          <Label>{msg().Att_Lbl_OvertimeLimit}</Label>
          <Value>
            {TimeUtil.toHHmm(props.overtime.overtimeHoursLimit) || '--'}
          </Value>
        </Row>
      </Group>
      <Group>
        <Row>
          <Label>{msg().Att_Lbl_ExtensionCountLimit}</Label>
          <Value>
            {!props.overtime.extensionCount
              ? '0'
              : props.overtime.extensionCount}
            /
            {!props.overtime.extensionCountLimit
              ? '--'
              : props.overtime.extensionCountLimit}{' '}
            {msg().Com_Lbl_Times}
          </Value>
        </Row>
      </Group>
    </Right>
  </Container>
);

export default MonthlyOverTimeTable;
