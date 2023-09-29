import React from 'react';

import configList from '../../../constants/configList/calendar';

import msg from '../../../../commons/languages';

import { Calendar, isCompanyCalendar } from '../../../models/calendar/Calendar';
import { CalendarEvent } from '../../../models/calendar/CalendarEvent';

import DetailItem from '../../../components/MainContents/DetailPane/DetailItem';
import { DetailPaneButtonsHeader } from '../../../components/MainContents/DetailPane/DetailPaneHeader';

import EventList from './EventList';

import './index.scss';

const ROOT = 'admin-pc-calendar-detail-pane';

export type Props = {
  calendar: Calendar;
  eventList: CalendarEvent[];
  selectedEventIdList: string[];
  mode: '' | 'edit' | 'new';
  sfObjFieldValues: Record<string, unknown>;
  getOrganizationSetting: Record<string, unknown>;
  onClickSaveButton: (arg0: any) => void;
  onClickClosePane: (arg0: any) => void;
  onClickEditDetailButton: (arg0: any) => void;
  onClickCancelEditButton: (arg0: any) => void;
  onClickUpdateButton: (arg0: any) => void;
  onClickDeleteButton: (arg0: React.SyntheticEvent<any>) => void;
  onUpdateDetailItemValue: (arg0: any) => void;
  onClickCreateEventButton: (arg0: any) => void;
  onClickEditEventButton: (arg0: any) => void;
  onEventRowsSelected: (arg0: any) => void;
  onEventRowsDeselected: (arg0: any) => void;
  onClickDeleteEventButton: (arg0: any) => void;
};

export default class DetailPane extends React.Component<Props> {
  render() {
    const calendar: any = this.props.calendar || {};

    const isDetailItemDisabled =
      this.props.mode !== 'edit' && this.props.mode !== 'new';

    const isEventListModifiable = !!calendar.id;
    const isCalendarDeletable = !!calendar.id && !isCompanyCalendar(calendar);

    const title = calendar.id ? msg().Com_Btn_Edit : msg().Com_Btn_New;

    return (
      <div className={ROOT}>
        <DetailPaneButtonsHeader
          title={title}
          mode={this.props.mode}
          isDeleteButtonDisabled={!isCalendarDeletable}
          onClickCloseButton={this.props.onClickClosePane}
          onClickCancelButton={this.props.onClickCancelEditButton}
          onClickEditButton={this.props.onClickEditDetailButton}
          onClickDeleteButton={this.props.onClickDeleteButton}
          onClickSaveButton={this.props.onClickSaveButton}
          onClickUpdateButton={this.props.onClickUpdateButton}
        />

        <div className={`${ROOT}__body`}>
          <ul className={`${ROOT}__item-list`}>
            {configList.base.map((config) => (
              <DetailItem
                config={config}
                tmpEditRecord={calendar}
                sfObjFieldValues={this.props.sfObjFieldValues}
                getOrganizationSetting={this.props.getOrganizationSetting}
                onChangeDetailItem={this.props.onUpdateDetailItemValue}
                disabled={isDetailItemDisabled}
              />
            ))}
          </ul>

          <EventList
            modifiable={isEventListModifiable}
            eventList={this.props.eventList}
            selectedEventIds={this.props.selectedEventIdList}
            onRowsSelected={this.props.onEventRowsSelected}
            onRowsDeselected={this.props.onEventRowsDeselected}
            // @ts-ignore
            onClickCreateEventButton={this.props.onClickCreateEventButton}
            onClickEditEventButton={this.props.onClickEditEventButton}
            // @ts-ignore
            onClickDeleteEventButton={this.props.onClickDeleteEventButton}
          />
        </div>
      </div>
    );
  }
}
