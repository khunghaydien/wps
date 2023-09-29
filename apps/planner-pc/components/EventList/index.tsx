import * as React from 'react';

import styled, { css, FlattenSimpleInterpolation } from 'styled-components';

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
  onClickOpen: (id: string, event: React.MouseEvent) => void;
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

const Heading = (props: { children: string }): React.ReactElement => (
  <Text as={H2} {...props} bold size="xl" />
);

const Hr = styled.hr`
  width: 100%;
  height: 1px;
  padding: 0;
  margin: 0;
`;

const isReadOnlyStyle = css`
  :hover,
  :focus {
    cursor: auto;
    outline: none;
    background: transparent;
  }
`;

const List = styled.ul`
  padding: 8px 0 14px 0;
`;

const ListItem = styled.li<{
  isOverMultipleDays?: boolean;
  isReadOnly: boolean;
}>`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-start;
  height: ${({ isOverMultipleDays }): number =>
    isOverMultipleDays ? 18 : 20}px;
  padding: 0
    ${({ isOverMultipleDays }): number => (isOverMultipleDays ? 9 : 13)}px;
  margin: ${({ isOverMultipleDays }): number => (isOverMultipleDays ? 2 : 0)}px
    0 0 0;

  :first-child {
    margin: 0;
  }

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background: ${Color.hover};
    color: ${Color.primary};
  }

  ${({ isReadOnly }): FlattenSimpleInterpolation =>
    isReadOnly && isReadOnlyStyle};
`;

const ListItemContent = styled(Text)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const EventList: React.FC<Props> = ({
  date,
  events = [],
  onClickClose,
  onClickOpen,
}: Props) => (
  <Card>
    <Header role="presentation">
      <Heading>{CalendarUtil.format(date, { weekday: 'short' })}</Heading>
      <Heading>{date.getDate().toString()}</Heading>
      <CloseButton tabIndex={0} onClick={onClickClose} />
    </Header>
    <Hr />
    <Body>
      <List role="menu">
        {events.map((event) =>
          !event.isLessThanDay ? (
            <ListItem key={event.id} tabIndex={0} {...event}>
              <Event
                onClick={(e): void => onClickOpen(event.id, e)}
                isReadOnly={event.isReadOnly}
                isEditing={event.isEditing}
                role="menuitem"
              >
                {event.title || msg().Cal_Lbl_NoTitle}
              </Event>
            </ListItem>
          ) : (
            <ListItem
              {...event}
              key={event.id}
              tabIndex={0}
              role="menuitem"
              onClick={(e): void => onClickOpen(event.id, e)}
            >
              <ListItemContent size="small">
                {CalendarUtil.format(event.startDateTime, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                {event.title || msg().Cal_Lbl_NoTitle}
              </ListItemContent>
            </ListItem>
          )
        )}
      </List>
    </Body>
  </Card>
);

export default EventList;
