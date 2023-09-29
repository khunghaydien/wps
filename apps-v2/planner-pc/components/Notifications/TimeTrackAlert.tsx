import React from 'react';

import styled from 'styled-components';

import Tooltip from '../../../commons/components/Tooltip';
import msg from '../../../commons/languages';
import { Attention } from '../../../core/elements/Icons';

type Props = Readonly<{
  id?: string;
  align?: 'top left';
  isVisible: boolean;
}>;

const S = {
  Message: styled.div`
    display: inline-flex;
    white-space: pre-line;
    width: 256px;
  `,
  List: styled.ul`
    list-style: disc;
    list-style-position: inside;
  `,
  ListItem: styled.li``,
};

const TimeTrackAlert: React.FC<Props> = ({ id, isVisible, align }: Props) => {
  return (
    <>
      {isVisible && (
        <Tooltip
          id={id}
          align={align}
          content={
            <S.List>
              <S.ListItem>
                <S.Message>{msg().Cal_Lbl_TimeTrackingAlert}</S.Message>
              </S.ListItem>
            </S.List>
          }
        >
          <Attention
            data-testid="planner-pc__time-track-alert"
            color="attention"
          />
        </Tooltip>
      )}
    </>
  );
};

export default TimeTrackAlert;
