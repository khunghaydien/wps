import React, { useMemo } from 'react';

import format from 'date-fns/format';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import { Icons, Text } from '@apps/core';

import { useFetchAlertOnSubmit } from '@apps/planner-pc/hooks/useFetchAlertOnSubmit';
import { useRequestAlert } from '@apps/planner-pc/hooks/useRequestAlert';

type Props = {
  date?: Date;
};

const S = {
  Wrapper: styled.div`
    min-height: 48px;
    width: 100%;
    background: #de933a;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  IconWrapper: styled.div`
    margin-right: 9px;
    display: flex;
    align-items: center;
  `,
};

const UnsubmittedAlert = ({ date = new Date() }: Props) => {
  useFetchAlertOnSubmit(date);

  const { alert, startDate, endDate } = useRequestAlert();
  const startDateISOString = useMemo(() => {
    if (startDate) {
      return format(startDate, 'YYYY-MM-DD');
    }
    return '';
  }, [startDate]);
  const endDateISOString = useMemo(() => {
    if (endDate) {
      return format(endDate, 'YYYY-MM-DD');
    }
    return '';
  }, [endDate]);

  return alert ? (
    <S.Wrapper>
      <S.IconWrapper>
        <Icons.Attention color="base" />
      </S.IconWrapper>
      <Text color="base">
        {msg().Trac_Msg_UnsubmittedRequestAlert}(
        {`${startDateISOString} - ${endDateISOString}`})
      </Text>
    </S.Wrapper>
  ) : (
    <></>
  );
};

export default UnsubmittedAlert;
