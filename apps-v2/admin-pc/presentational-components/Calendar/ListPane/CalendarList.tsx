import React from 'react';

import msg from '../../../../commons/languages';

import { Calendar } from '../../../models/calendar/Calendar';

import DataGrid from '../../../components/DataGrid';

export type Props = {
  calendarList: Calendar[];
  selectedCalendarId: string | null | undefined;
  onClickCalendarRow: (arg0: Calendar) => void;
};

export default class CalendarList extends React.Component<Props> {
  constructor() {
    // @ts-ignore
    super();
    this.onClickCalendarRow = this.onClickCalendarRow.bind(this);
  }

  onClickCalendarRow(index: number, calendar: Calendar): void {
    this.props.onClickCalendarRow(calendar);
  }

  render() {
    return (
      <div className=" data-grid">
        <DataGrid
          columns={[
            {
              key: 'companyCalendar',
              name: '',
              resizable: true,
            },
            {
              key: 'code',
              name: msg().Admin_Lbl_Code,
              sortable: true,
              resizable: true,
              filterable: true,
            },
            {
              key: 'name',
              name: msg().Admin_Lbl_Name,
              sortable: true,
              resizable: true,
              filterable: true,
            },
            {
              key: 'remarks',
              name: msg().Admin_Lbl_Remarks,
              sortable: true,
              resizable: true,
              filterable: true,
            },
          ]}
          rows={this.props.calendarList.map((cal) => ({
            ...cal,
            companyCalendar: cal.isDefault
              ? msg().Admin_Lbl_CompanyCalendar_Abbr
              : null,
            isSelected: cal.id === this.props.selectedCalendarId,
          }))}
          onRowClick={this.onClickCalendarRow}
        />
      </div>
    );
  }
}
