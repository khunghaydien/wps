import * as React from 'react';

import styled from 'styled-components';

import msg from '../../../../../commons/languages';
import TimeUtil from '../../../../../commons/utils/TimeUtil';
import { CloseButton, Icons, LinkButton } from '../../../../../core';
import { Font } from '../../../../../core/styles';

import { DirectRequest } from '@attendance/domain/models/AttDailyRequest/DirectRequest';
import * as RestTime from '@attendance/domain/models/RestTime';

import AttTimeRangeField from '../fields/AttTimeRangeField';
import FormRow from './FormRow';
import $createRestTimesFactory from '@attendance/domain/factories/RestTimesFactory';
import isDeletableRestTimes from '@attendance/ui/helpers/dailyRecord/restTime/isDeletable';
import isLastAndAddableRestTimes from '@attendance/ui/helpers/dailyRecord/restTime/isLastAndAddable';

const createRestTimesFactory = $createRestTimesFactory();

const S = {
  CloseButton: styled(CloseButton)`
    width: 16px;
    height: 16px;
    background-color: #999;

    :hover {
      background-color: #999;
    }

    svg {
      width: 6px;
      height: 6px;

      path {
        fill: #fff;
      }
    }
  `,

  CloseButtonContainer: styled.div`
    display: inline-block;
    margin-left: 12px;
  `,

  PlusIcon: styled(Icons.Plus)`
    height: 8px;
    width: 8px;
    min-width: 8px;
    min-height: 8px;
  `,

  AddRestTimeButtonContainer: styled.div`
    display: flex;
    align-items: center;
    margin-top: 12px;
    text-align: left;

    span {
      font-size: ${Font.size.L};
      margin-left: 8px;
    }
  `,
};

type Props = {
  directApplyRestTimes: RestTime.RestTimes;
  maxRestTimesCount: number;
  onUpdateValue: (
    arg0: keyof DirectRequest,
    arg1: DirectRequest[keyof DirectRequest]
  ) => void;
  isReadOnly: boolean;
};

const DirectApplyRestTimeRangeFormRows: React.FC<Props> = (props: Props) => {
  const { directApplyRestTimes, maxRestTimesCount, onUpdateValue, isReadOnly } =
    props;
  const RestTimesFactory = React.useMemo(
    () => createRestTimesFactory({ maxLength: maxRestTimesCount }),
    []
  );

  return (
    <>
      {directApplyRestTimes.map(
        (restTime, idx, restTimes: RestTime.RestTimes) => (
          <FormRow
            key={idx}
            labelText={`${msg().$Att_Lbl_CustomRest}${idx + 1}`}
          >
            <AttTimeRangeField
              startTime={{
                value: TimeUtil.toHHmm(restTime.startTime),
                onBlur: (value) =>
                  onUpdateValue(
                    'directApplyRestTimes',
                    RestTimesFactory.update(restTimes, idx, {
                      ...restTime,
                      startTime: TimeUtil.parseMinutes(value),
                    })
                  ),
              }}
              endTime={{
                value: TimeUtil.toHHmm(restTime.endTime),
                onBlur: (value) =>
                  onUpdateValue(
                    'directApplyRestTimes',
                    RestTimesFactory.update(restTimes, idx, {
                      ...restTime,
                      endTime: TimeUtil.parseMinutes(value),
                    })
                  ),
              }}
              disabled={isReadOnly}
            />
            {!isReadOnly && isDeletableRestTimes(idx, restTimes) && (
              <S.CloseButtonContainer>
                <S.CloseButton
                  type="button"
                  alt={msg().Att_Btn_RemoveItem}
                  onClick={() =>
                    onUpdateValue(
                      'directApplyRestTimes',
                      RestTimesFactory.remove(restTimes, idx)
                    )
                  }
                  key={`icon-remove${idx + 1}`}
                />
              </S.CloseButtonContainer>
            )}
            {!isReadOnly &&
              isLastAndAddableRestTimes(idx, restTimes, maxRestTimesCount) && (
                <LinkButton
                  onClick={() =>
                    onUpdateValue(
                      'directApplyRestTimes',
                      RestTimesFactory.push(restTimes)
                    )
                  }
                  key={`icon-add${idx + 1}`}
                >
                  <S.AddRestTimeButtonContainer>
                    <S.PlusIcon color="accent" />
                    <span>{msg().Att_Lbl_AddRestTime}</span>
                  </S.AddRestTimeButtonContainer>
                </LinkButton>
              )}
          </FormRow>
        )
      )}
    </>
  );
};

export default DirectApplyRestTimeRangeFormRows;
