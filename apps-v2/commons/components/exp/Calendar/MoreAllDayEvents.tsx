import React, { FC } from 'react';

import styled from 'styled-components';

import { CloseButton, Text } from '@apps/core';
import msg from '@commons/languages';
import { BaseEvent } from '@commons/models/DailySummary/BaseEvent';
import CalendarUtil from '@commons/utils/CalendarUtil';

import { Color, EventListDimensions } from './styles';

type Props = Readonly<{
  date: Date;
  events: ReadonlyArray<BaseEvent>;
  onClickClose: () => void;
  onClickEvent: (event: BaseEvent) => void;
}>;

const Card = styled.div`
  width: ${EventListDimensions.width}px;
  height: 100%;
  overflow: hidden;
  border-radius: 4px;
  background: #fff;
  border: 1px solid ${Color.border};
  box-sizing: border-box;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
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

const Hr = styled.hr`
  width: 100%;
  height: 1px;
  padding: 0;
  margin: 0;
`;

const Body = styled.div`
  height: 200px;
  overflow: hidden auto;
`;

const List = styled.ul`
  padding: 8px 0 14px 0;
`;

const ListItem = styled.li<{
  isOverMultipleDays?: boolean;
}>`
  cursor: pointer;
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

const Block = styled.span`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  height: 18px;
  appearance: none;
  border: none;
  outline: none;
  background: ${Color.event};
  border-radius: 2px;
  color: #fff;
  padding: 0 4px;
  display: flex;
  align-items: center;
  width: 100%; ;
`;

const EventText = styled(Text)`
  color: #fff;
`;

const Heading = (props: { children: string }) => (
  <Text as={H2} {...props} bold size="xl" />
);

const MoreAllDayEvents: FC<Props> = ({
  date,
  events = [],
  onClickClose,
  onClickEvent,
}) => (
  <Card>
    <Header role="presentation">
      <Heading>{CalendarUtil.format(date, { weekday: 'short' })}</Heading>
      <Heading>{date.getDate().toString()}</Heading>
      <CloseButton tabIndex={0} onClick={onClickClose} />
    </Header>
    <Hr />
    <Body>
      <List>
        {events.map((event) => (
          <ListItem
            key={event.id}
            tabIndex={0}
            {...event}
            onClick={() => onClickEvent(event)}
          >
            <Block>
              <EventText size="small">
                {event.title || msg().Cal_Lbl_NoTitle}
              </EventText>
            </Block>
          </ListItem>
        ))}
      </List>
    </Body>
  </Card>
);

export default MoreAllDayEvents;
