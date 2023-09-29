import * as React from 'react';

import styled from 'styled-components';

import msg from '../../../commons/languages';
import CalendarUtil from '../../../commons/utils/CalendarUtil';
import { CloseButton, Text } from '../../../core';
import { Color } from '../../../core/styles';

import { Ui } from '../../styles';
import Event from './Event';

type Props = Readonly<{
  date: Date;
  events: ReadonlyArray<{
    id: string;
    title: string;
    startDateTime: Date;
    isLessThanDay: boolean;
    isReadOnly: boolean;
    isEditing: boolean;
  }>;

  onClickClose: () => void;
}>;

const Card = styled.div`
  width: ${Ui.eventList.width}px;
  height: 100%;
  overflow: hidden;
  border-radius: 4px;
  background: #fff;
  border: 1px solid ${Color.border3};
  box-sizing: border-box;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const Body = styled.div`
  height: 200px;
  overflow: hidden auto;
`;

const Header = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  height: 35px;
  padding: 0 3px 0 9px;
`;

const H2 = styled.h2`
  width: 33%;
  flex: 1 1 0%;
`;

const Heading = (props: { children: string }) => (
  <Text as={H2} {...props} bold size="xl" />
);

const Hr = styled.hr`
  width: 100%;
  height: 1px;
  padding: 0;
  margin: 0;
`;

const List = styled.ul`
  padding: 8px 0 14px 0;
`;

const ListItem = styled.li<{ isOverMultipleDays: boolean }>`
  outline: none;
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-start;
  height: ${({ isOverMultipleDays }) => (isOverMultipleDays ? 18 : 20)}px;
  padding: 0 ${({ isOverMultipleDays }) => (isOverMultipleDays ? 9 : 13)}px;
  margin: ${({ isOverMultipleDays }) => (isOverMultipleDays ? 2 : 0)}px 0 0 0;

  :first-child {
    margin: 0;
  }
`;

const EventList = ({ date, events = [], onClickClose }: Props) => (
  <Card data-testid="daily-summary__event-list-popup">
    <Header role="presentation">
      <Heading>{CalendarUtil.format(date, { weekday: 'short' })}</Heading>
      <Heading>{date.getDate().toString()}</Heading>
      <CloseButton tabIndex={0} onClick={onClickClose} />
    </Header>
    <Hr />
    <Body>
      <List>
        {events.map((event) => (
          // @ts-ignore isOverMultipleDays missing
          <ListItem key={event.id} tabIndex={0} {...event}>
            {/*
            // @ts-ignore isReadOnly is unused props */}
            <Event isReadOnly>{event.title || msg().Cal_Lbl_NoTitle}</Event>
          </ListItem>
        ))}
      </List>
    </Body>
  </Card>
);

export default EventList;
