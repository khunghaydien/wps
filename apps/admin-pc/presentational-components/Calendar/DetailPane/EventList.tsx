import React from 'react';

import Button from '../../../../commons/components/buttons/Button';
import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';

import { CalendarEvent } from '../../../models/calendar/CalendarEvent';

import DataGrid from '../../../components/DataGrid';

import './EventList.scss';

const ROOT = 'admin-pc-calendar-detail-pane-event-list';

const formatDate = (dateStr) => {
  return <span>{DateUtil.formatYMD(dateStr.value)}</span>;
};

const formatDayType = (dayTypeKey) => {
  const dayType = {
    Workday: msg().Com_DayType_Workday,
    Holiday: msg().Com_DayType_Holiday,
    LegalHoliday: msg().Com_DayType_LegalHoliday,
  }[dayTypeKey.value];

  return <span>{dayType}</span>;
};

type RowSelection = { row: { id: string } };

const extractCalendarEventIds = (rowSelectionList: RowSelection[]): string[] =>
  rowSelectionList.map((rowSelection) => rowSelection.row.id);

export type Props = {
  modifiable: boolean;
  eventList: CalendarEvent[];
  selectedEventIds: string[];
  onClickCreateEventButton: () => void;
  onClickEditEventButton: (arg0: CalendarEvent) => void;
  onRowsSelected: (arg0: string[]) => void;
  onRowsDeselected: (arg0: string[]) => void;
  onClickDeleteEventButton: () => void;
};

export default class EventList extends React.Component<Props> {
  constructor() {
    // @ts-ignore
    super();
    this.onRowsSelected = this.onRowsSelected.bind(this);
    this.onRowsDeselected = this.onRowsDeselected.bind(this);
    this.formatEditButton = this.formatEditButton.bind(this);
  }

  onRowsSelected(rowSelectionList: RowSelection[]) {
    this.props.onRowsSelected(extractCalendarEventIds(rowSelectionList));
  }

  onRowsDeselected(rowSelectionList: RowSelection[]) {
    this.props.onRowsDeselected(extractCalendarEventIds(rowSelectionList));
  }

  // eslint-disable-next-line react/no-unused-prop-types
  formatEditButton(props: { value: string }) {
    return (
      <Button
        type="default"
        className={`${ROOT}__edit-button`}
        onClick={() => {
          const calendarEvent = this.props.eventList.filter(
            (event) => event.id === props.value
          )[0];
          this.props.onClickEditEventButton(calendarEvent);
        }}
      >
        {msg().Com_Btn_Edit}
      </Button>
    );
  }

  renderActionButtons() {
    const { selectedEventIds, modifiable } = this.props;
    return (
      <div className={`${ROOT}__action-buttons`}>
        <Button
          key="new"
          type="secondary"
          onClick={this.props.onClickCreateEventButton}
          disabled={!modifiable}
        >
          {msg().Com_Btn_New}
        </Button>

        <div className={`${ROOT}__modify-buttons`}>
          <Button
            key="delete"
            type="destructive"
            onClick={this.props.onClickDeleteEventButton}
            disabled={
              !modifiable || !selectedEventIds || !selectedEventIds.length
            }
          >
            {msg().Com_Btn_Delete}
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const CELL_HORIZONTAL_PADDING = 10 * 2;
    return (
      <div className={ROOT}>
        <div className={`${ROOT}__heading`}>{msg().Admin_Lbl_Event}</div>

        {this.renderActionButtons()}

        <DataGrid
          columns={[
            {
              key: 'recordDate',
              name: msg().Att_Lbl_Date,
              formatter: formatDate,
              width: 140 + CELL_HORIZONTAL_PADDING,
              resizable: true,
            },
            {
              key: 'name',
              name: msg().Admin_Lbl_Name,
              width: 132 + CELL_HORIZONTAL_PADDING,
              resizable: true,
            },
            {
              key: 'dayType',
              name: msg().Admin_Lbl_DayType,
              formatter: formatDayType,
              width: 116 + CELL_HORIZONTAL_PADDING,
              resizable: true,
            },
            {
              key: 'remarks',
              name: msg().Admin_Lbl_Remarks,
              resizable: true,
            },
            {
              key: 'id',
              name: '',
              formatter: this.formatEditButton,
              width: 70 + CELL_HORIZONTAL_PADDING,
              resizable: true,
            },
          ]}
          rows={this.props.eventList}
          showCheckbox
          onRowsSelected={this.onRowsSelected}
          onRowsDeselected={this.onRowsDeselected}
        />
      </div>
    );
  }
}
