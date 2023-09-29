import * as React from 'react';

import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

import styled from 'styled-components';

import msg from '../../../commons/languages';
import { CheckBox, PopupFrame, Text, TextField } from '../../../core';

import { CalendarEvent } from '../../models/calendar-event/CalendarEvent';

import EventDate from './EventDate';
import Footer from './Footer';
import Header from './Header';

type Props = Readonly<{
  event: CalendarEvent;
  renderJobSelect: React.ComponentType<Record<string, unknown>>;
  renderWorkCategory: React.ComponentType<Record<string, unknown>>;
  useWorkTime: boolean;
  onChange: (
    key: keyof CalendarEvent,
    e: boolean | string | moment.Moment
  ) => void;
  onClickSave: () => void;
  onClickClose: () => void;
  onClickDelete: () => void;
  useCalculateCapacity: boolean;
}>;

const Flex: React.ComponentType<Record<string, unknown>> = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  &:first-child {
    margin-top: 40px;
  }
`;

const S = {
  Container: styled.div`
    width: 526px;
  `,
  Body: styled.div`
    min-height: 146px;
    padding: 0 20px;
  `,
  AlignCenter: styled(Flex)`
    align-items: center;
  `,
  AlignStart: styled(Flex)`
    align-items: flex-start;
  `,
  Text: styled(Text)`
    line-height: 17px;
  `,
  Label: styled.div`
    width: 84px;
    text-align: left;
    margin: 0 18px 0 0;
  `,
  Value: styled.div`
    width: 384px;
  `,
};

const EventEditPopup: React.ComponentType<Props> = React.memo(
  ({
    event,
    useWorkTime,
    onClickSave,
    onClickClose,
    onClickDelete,
    onChange,
    renderJobSelect,
    renderWorkCategory,
    useCalculateCapacity,
  }: Props) => {
    const JobSelect = renderJobSelect;
    const WorkCategorySelect = renderWorkCategory;

    const useJob = React.useMemo(
      () => useWorkTime && !event.isAllDay,
      [useWorkTime, event.isAllDay]
    );

    return (
      <S.Container>
        <PopupFrame
          onClose={onClickClose}
          header={
            <Header
              value={event.title}
              onChange={(e): void => onChange('title', e.target.value)}
            />
          }
          footer={
            <Footer
              hasDelete={!isEmpty(event.id)}
              onClickSave={onClickSave}
              onClickClose={onClickClose}
              onClickDelete={onClickDelete}
            />
          }
        >
          <S.Body>
            <EventDate event={event} onChange={onChange} />
            <div>
              {useJob && (
                <S.AlignCenter>
                  <S.Label>
                    <Text>{msg().Com_Lbl_Job}</Text>
                  </S.Label>
                  <S.Value>
                    <JobSelect />
                  </S.Value>
                </S.AlignCenter>
              )}
              {useJob && (
                <S.AlignCenter>
                  <S.Label>
                    <Text>{msg().Trac_Lbl_WorkCategory}</Text>
                  </S.Label>
                  <S.Value>
                    <WorkCategorySelect />
                  </S.Value>
                </S.AlignCenter>
              )}
              <S.AlignStart>
                <S.Label>
                  <Text>{msg().Cal_Lbl_Description}</Text>
                </S.Label>
                <S.Value>
                  <TextField
                    data-testid="event-edit-popup__description"
                    value={event.remarks}
                    onChange={(e): void => onChange('remarks', e.target.value)}
                    minRows={2}
                    maxRows={10}
                  />
                </S.Value>
              </S.AlignStart>
              {useCalculateCapacity && (
                <S.AlignStart>
                  <CheckBox
                    data-testid="event-edit-popup__calculate-capcity"
                    checked={event.calculateCapacity}
                    onChange={(e) =>
                      onChange('calculateCapacity', e.target.checked)
                    }
                  >
                    <S.Text>{msg().PSA_Lbl_ShowAsUnavailable}</S.Text>
                  </CheckBox>
                </S.AlignStart>
              )}
            </div>
          </S.Body>
        </PopupFrame>
      </S.Container>
    );
  }
);

export default EventEditPopup;
