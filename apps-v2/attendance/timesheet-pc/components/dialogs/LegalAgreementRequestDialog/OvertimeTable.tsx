import React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import TimeUtil from '@apps/commons/utils/TimeUtil';

import {
  MonthlyOvertime,
  WORK_SYSTEM,
  WorkSystem,
  YearlyOvertime,
} from '@attendance/domain/models/LegalAgreementOvertime';
import {
  CODE,
  Code,
} from '@attendance/domain/models/LegalAgreementRequestType';

const Table = styled.div<{ showSpecial: boolean }>`
  display: flex;
  flex-wrap: wrap;
  font-size: 13px;
  padding-bottom: 6px;

  div {
    flex-basis: 100%;
    display: flex;
    min-height: 26px;
    line-height: 26px;
  }
  span:nth-of-type(odd) {
    width: 200px;
    padding-left: 5px;
    background-color: #f2f5f8;
    color: #53688c;
    border-left: 1px #d6dce5 solid;
    overflow-wrap: break-word;
  }
  span:nth-of-type(even) {
    width: 70px;
    padding-right: 5px;
    background-color: #fff;
    text-align: right;
  }

  > div:nth-of-type(1) > span {
    border-top: 1px #d2d8e2 solid;
  }
  > div:nth-of-type(odd) > span {
    border-bottom: ${({ showSpecial }) =>
      showSpecial ? '1px #d2d8e2 dashed' : '1px #d2d8e2 solid'};
  }
  > div:nth-of-type(even) > span {
    border-bottom: 1px #d2d8e2 solid;
  }
  > div > span:nth-of-type(even) {
    border-right: 1px #d2d8e2 solid;
  }

  > div > span:nth-of-type(2) {
    margin-right: 20px;
  }
  > div > span:nth-of-type(n + 3) {
    border-bottom: 1px #d2d8e2 solid;
  }
`;

type Props = {
  type: Code;
  overtime: MonthlyOvertime | YearlyOvertime | null;
  workSystem: WorkSystem | null;
};

const MonthlyOvertimeTable: React.FC<{
  overtime: MonthlyOvertime;
  showSpecial: boolean;
}> = ({ overtime, showSpecial }) => (
  <Table showSpecial={showSpecial}>
    <div>
      <span>{msg().Att_Lbl_OvertimeHours}</span>
      <span>{TimeUtil.toHHmm(overtime?.monthlyOvertimeHours)}</span>
      <span>{msg().Att_Lbl_OvertimeLimit}</span>
      <span>{TimeUtil.toHHmm(overtime?.monthlyOvertimeLimit) || '--'}</span>
    </div>
    {showSpecial && (
      <div>
        <span>{msg().Att_Lbl_SpecialOvertimeHours}</span>
        <span>{TimeUtil.toHHmm(overtime?.specialMonthlyOvertimeHours)}</span>
        <span>{msg().Att_Lbl_ExtensionCountLimit}</span>
        <span>
          {overtime?.extensionCount}/
          {overtime?.specialExtensionCountLimit || '--'}
          {msg().Com_Lbl_Times}
        </span>
      </div>
    )}
    <div>
      <span>{msg().Att_Lbl_MonthlyOvertimeHours1MoAgo}</span>
      <span>{TimeUtil.toHHmm(overtime?.monthlyOvertimeHours1MoAgo)}</span>
      {!showSpecial && (
        <React.Fragment>
          <span>{msg().Att_Lbl_ExtensionCountLimit}</span>
          <span>
            {overtime?.extensionCount}/
            {overtime?.specialExtensionCountLimit || '--'}
            {msg().Com_Lbl_Times}
          </span>
        </React.Fragment>
      )}
    </div>
    {showSpecial && (
      <div>
        <span>{msg().Att_Lbl_SpecialMonthlyOvertimeHours1MoAgo}</span>
        <span>
          {TimeUtil.toHHmm(overtime?.specialMonthlyOvertimeHours1MoAgo)}
        </span>
      </div>
    )}
    <div>
      <span>{msg().Att_Lbl_MonthlyOvertimeHours2MoAgo}</span>
      <span>{TimeUtil.toHHmm(overtime?.monthlyOvertimeHours2MoAgo)}</span>
    </div>
    {showSpecial && (
      <div>
        <span>{msg().Att_Lbl_SpecialMonthlyOvertimeHours2MoAgo}</span>
        <span>
          {TimeUtil.toHHmm(overtime?.specialMonthlyOvertimeHours2MoAgo)}
        </span>
      </div>
    )}
  </Table>
);

const YearylyOvertimeTable: React.FC<{
  overtime: YearlyOvertime;
  showSpecial: boolean;
}> = ({ overtime, showSpecial }) => (
  <Table showSpecial={showSpecial}>
    <div>
      <span>{msg().Att_Lbl_OvertimeHours}</span>
      <span>{TimeUtil.toHHmm(overtime?.yearlyOvertimeHours)}</span>
      <span>{msg().Att_Lbl_OvertimeLimit}</span>
      <span>{TimeUtil.toHHmm(overtime?.yearlyOvertimeLimit) || '--'}</span>
    </div>
    {showSpecial && (
      <div>
        <span>{msg().Att_Lbl_SpecialOvertimeHours}</span>
        <span>{TimeUtil.toHHmm(overtime?.specialYearlyOvertimeHours)}</span>
      </div>
    )}
    <div>
      <span>{msg().Att_Lbl_YearlyOvertimeHours1YearAgo}</span>
      <span>{TimeUtil.toHHmm(overtime?.yearlyOvertimeHours1YearAgo)}</span>
    </div>
    {showSpecial && (
      <div>
        <span>{msg().Att_Lbl_SpecialYearlyOvertimeHours1YearAgo}</span>
        <span>
          {TimeUtil.toHHmm(overtime?.specialYearlyOvertimeHours1YearAgo)}
        </span>
      </div>
    )}
  </Table>
);

const OvertimeTable: React.FC<Props> = ({ type, overtime, workSystem }) => {
  const showSpecial = workSystem && workSystem !== WORK_SYSTEM.MANAGER;
  switch (type) {
    case CODE.MONTHLY:
      return (
        <MonthlyOvertimeTable
          overtime={overtime as MonthlyOvertime}
          showSpecial={showSpecial}
        />
      );
    case CODE.YEARLY:
      return (
        <YearylyOvertimeTable
          overtime={overtime as YearlyOvertime}
          showSpecial={showSpecial}
        />
      );
    default:
      return null;
  }
};

export default OvertimeTable;
