import * as React from 'react';
import { ReactElement } from 'react';

import classnames from 'classnames';
import _ from 'lodash';

import '../../commons/styles/modal-transition-slideup.css';
import GlobalContainer from '../../commons/containers/GlobalContainer';
import PersonalMenuPopoverContainer from '../../commons/containers/PersonalMenuPopoverContainer';
import ToastContainer from '../../commons/containers/ToastContainer';

import { UserSetting } from '../../domain/models/UserSetting';
import { CalendarEvent } from '../models/calendar-event/CalendarEvent';

import PsaEventPopupContainer from '../../psa-pc/sub-apps/event-popoup/containers/PsaEventContainer';
import CalendarHeader from '../containers/CalendarHeaderContainer';
import DailySummaryTriggerContainer from '../containers/DailySummaryTriggerContainer';
import EventEditPopupContainer from '../containers/EventEditPopupContainer';
import EventListPopupContainer from '../containers/EventListPopupContainer';
import MonthlyViewContainer from '../containers/MonthlyViewContainer';
import TrackSummaryCardContainer from '../containers/TrackSummaryCardContainer';
import WeeklyViewContainer from '../containers/WeeklyViewContainer';

import NavigationBar from './NavigationBar';
import UnsubmittedAlert from './UnsubmittedAlert';

import './Planner.scss';

type Props = Readonly<{
  calendarMode: string;
  userSetting: UserSetting;
  openPopup: (
    event: CalendarEvent,
    layout: {
      left: number;
      top: number;
    }
  ) => void;
}>;

export default class Planner extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.openEventEdit = this.openEventEdit.bind(this);
  }

  openEventEdit(
    selectedEvent: CalendarEvent,
    { pageX, pageY }: React.MouseEvent
  ): void {
    const container = document.getElementsByClassName('ts-container')[0];
    const { top, right } = container.getBoundingClientRect();
    const { pageYOffset } = window;

    const popupWindow = {
      height: selectedEvent.isAllDay ? 286 : 368,
      width: 526,
    };

    const absPosY = pageY + pageYOffset + container.scrollTop;
    const absPosX = pageX;

    const verticalPosition =
      top + popupWindow.height < absPosY
        ? {
            arrowDirection: 'down',
            top: absPosY - popupWindow.height,
          }
        : {
            arrowDirection: 'up',
            top: absPosY,
          };
    const horizontalPosition =
      right - popupWindow.width < absPosX
        ? {
            arrowDirection: 'right',
            left: absPosX - popupWindow.width,
          }
        : {
            arrowDirection: 'left',
            left: absPosX,
          };

    const layout = {
      top: verticalPosition.top,
      left: horizontalPosition.left,
    };

    this.props.openPopup(selectedEvent, layout);
  }

  render(): ReactElement {
    if (_.isEmpty(this.props.userSetting)) {
      return null;
    }

    return (
      <GlobalContainer>
        <NavigationBar />
        <div className="ts-calendar">
          <div className="planner-pc-planner">
            {this.props.userSetting.useWorkTime && <UnsubmittedAlert />}
            {this.props.userSetting.useWorkTime && (
              <div
                data-testid="planner-pc__track-summary-request"
                className="planner-pc-planner__track-summary"
              >
                <TrackSummaryCardContainer />
              </div>
            )}
            <div
              className={classnames({
                'planner-pc-planner__calendar__header': true,
                'is-narrow': !this.props.userSetting.useWorkTime,
              })}
            >
              <CalendarHeader />
            </div>
            <div
              className={`planner-pc-planner__calendar planner-pc-planner__calendar--${this.props.calendarMode}`}
            >
              {this.props.calendarMode === 'month' ? (
                <div
                  data-testid="planner-pc__monthly-calendar"
                  className="planner-pc-planner__calendar__month"
                >
                  <MonthlyViewContainer onClickEvent={this.openEventEdit} />
                </div>
              ) : (
                <div
                  data-testid="planner-pc__weekly-calendar"
                  className="planner-pc-planner__calendar__week"
                >
                  <WeeklyViewContainer openEventEdit={this.openEventEdit} />
                </div>
              )}
            </div>
          </div>

          <PsaEventPopupContainer />
          <EventEditPopupContainer />

          <EventListPopupContainer onClickEvent={this.openEventEdit} />
        </div>

        <PersonalMenuPopoverContainer
          showProxyEmployeeSelectButton={false}
          showChangeApproverButton={false}
        />

        <DailySummaryTriggerContainer asDefaultView />
        <ToastContainer />
      </GlobalContainer>
    );
  }
}
