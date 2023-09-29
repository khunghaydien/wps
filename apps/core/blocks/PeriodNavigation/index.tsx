import React from 'react';

import styled from 'styled-components';

import msg from '../../../commons/languages';

import Button from '../../elements/Button';
// SMELL CODE
// blocks should not depend on blocks.
import ArrowLeftButton from '../buttons/ArrowLeftButton';
import ArrowRightButton from '../buttons/ArrowRightButton';
import Period from './Period';

interface Props {
  startDate: string;
  endDate: string;
  onClickNext: () => void;
  onClickPrev: () => void;
  onClickCurrent: () => void;
}

const S = {
  Container: styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    margin: 0;
    height: auto;
    max-width: 482px;
  `,
  CurrentPeriodButton: styled(Button)`
    color: #53688c;
    margin: 0 16px 0 20px;
    padding: 7px 17px 6px 17px;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
};

const PeriodNavigation: React.FC<Props> = ({
  startDate,
  endDate,
  onClickNext,
  onClickPrev,
  onClickCurrent,
}: Props) => {
  return (
    <S.Container>
      <Period startDate={startDate} endDate={endDate} />
      <S.CurrentPeriodButton onClick={onClickCurrent}>
        {msg().Time_Btn_CurrentPeriod}
      </S.CurrentPeriodButton>
      <ArrowLeftButton onClick={onClickPrev} />
      <ArrowRightButton onClick={onClickNext} />
    </S.Container>
  );
};

export default PeriodNavigation;
