import React from 'react';

import msg from '../../../../commons/languages';

import { Calendar } from '../../../models/calendar/Calendar';

import ListPaneHeader from '../../../components/MainContents/ListPaneHeader';

import CalendarList from './CalendarList';

import './index.scss';

const ROOT = 'admin-pc-calendar-list-pane';

export type Props = {
  calendarList: Calendar[];
  selectedCalendarId: string | null | undefined;
  onSelectCalendar: (arg0: any) => void;
  onClickCreateNewButton: () => void;
};

export default class ListPane extends React.Component<Props> {
  render() {
    return (
      <div className={ROOT}>
        <ListPaneHeader
          title={msg().Admin_Lbl_Calendar}
          onClickCreateNewButton={this.props.onClickCreateNewButton}
        />

        <div className={`${ROOT}__content`}>
          {this.props.calendarList.length > 0 && (
            <div className={`${ROOT}__company-calendar`}>
              <CalendarList
                calendarList={this.props.calendarList}
                selectedCalendarId={this.props.selectedCalendarId}
                onClickCalendarRow={this.props.onSelectCalendar}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
