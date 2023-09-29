import * as React from 'react';

import styled from 'styled-components';

import msg from '../../../../commons/languages';
import TimeUtil from '../../../../commons/utils/TimeUtil';
import { CloseButton, Icons, LinkButton } from '../../../../core';
import { Font } from '../../../../core/styles';

import { DirectRequest } from '../../../../domain/models/attendance/AttDailyRequest/DirectRequest';
import * as RestTime from '../../../../domain/models/attendance/RestTime';
import { MAX_STANDARD_REST_TIME_COUNT } from '@apps/domain/models/attendance/RestTime';

import AttTimeRangeField from '../fields/AttTimeRangeField';
import FormRow from './FormRow';

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
  `,

  AddRestTimeButtonContainer: styled.div`
    display: flex;
    align-items: center;
    margin-top: 12px;

    span {
      font-size: ${Font.size.L};
      margin-left: 8px;
    }
  `,
};

type Props = {
  directApplyRestTimes: RestTime.RestTimes;
  onUpdateValue: (
    arg0: keyof DirectRequest,
    arg1: DirectRequest[keyof DirectRequest]
  ) => void;
  isReadOnly: boolean;
};

const DirectApplyRestTimeRangeFormRows: React.FC<Props> = (props: Props) => {
  const { directApplyRestTimes, onUpdateValue, isReadOnly } = props;
  return (
    <>
      {directApplyRestTimes.map(
        (restTime, idx, restTimes: RestTime.RestTimes) => (
          <FormRow key={idx} labelText={`${msg().Att_Lbl_Rest}${idx + 1}`}>
            <AttTimeRangeField
              startTime={{
                value: TimeUtil.toHHmm(restTime.startTime),
                onBlur: (value) =>
                  onUpdateValue(
                    'directApplyRestTimes',
                    RestTime.update(restTimes, idx, {
                      ...restTime,
                      startTime: TimeUtil.toMinutes(value),
                    })
                  ),
              }}
              endTime={{
                value: TimeUtil.toHHmm(restTime.endTime),
                onBlur: (value) =>
                  onUpdateValue(
                    'directApplyRestTimes',
                    RestTime.update(restTimes, idx, {
                      ...restTime,
                      endTime: TimeUtil.toMinutes(value),
                    })
                  ),
              }}
              disabled={isReadOnly}
            />
            {!isReadOnly && restTimes.length > 1 && (
              <S.CloseButtonContainer>
                <S.CloseButton
                  type="button"
                  alt={msg().Att_Btn_RemoveItem}
                  onClick={() =>
                    onUpdateValue(
                      'directApplyRestTimes',
                      RestTime.remove(restTimes, idx)
                    )
                  }
                  key={`icon-remove${idx + 1}`}
                />
              </S.CloseButtonContainer>
            )}
            {!isReadOnly &&
              idx === restTimes.length - 1 &&
              restTimes.length < MAX_STANDARD_REST_TIME_COUNT && (
                <LinkButton
                  onClick={() =>
                    onUpdateValue(
                      'directApplyRestTimes',
                      RestTime.push(restTimes)
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
