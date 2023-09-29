import * as React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import moment from 'moment';

import styled from 'styled-components';

import { catchApiError, catchBusinessError } from '../../commons/actions/app';
import DateUtil from '../../commons/utils/DateUtil';
import { Option } from '../../core';
import msg from '@commons/languages';

import { Job } from '../../domain/models/time-tracking/Job';
import { CalendarEvent } from '../models/calendar-event/CalendarEvent';
import { EventParam } from '../models/calendar-event/EventFromRemote';

import { State } from '../modules';

import App from '../action-dispatchers/App';
import { AppDispatch } from '../action-dispatchers/AppThunk';
import EventEditPopupActions from '../action-dispatchers/EventEditPopup';
import Events from '../action-dispatchers/Events';
import {
  editEventEditPopup,
  refreshActiveJobList,
  selectJobEventEditPopup as selectJobEventEditPopupAction,
} from '../actions/eventEditPopup';
import { saveEmpEvent } from '../actions/events';

import EventEditPopup from '../components/EventEditPopup/index';
import JobSelect from '../components/EventEditPopup/JobSelect';
import Popup from '../components/Popup';

import { useJobSelectDialog } from '../../time-tracking/JobSelectDialog';
import WorkCategoryDropdown from '../../time-tracking/WorkCategoryDropdown';
import { validateEvent } from '../validators';

const { useCallback, useEffect, useMemo } = React;

const mapStateToProps = (state: State) => {
  return {
    date: state.selectedDay.toDate(),
    // TODO Remove @ts-ignore after migrating common reducer
    // @ts-ignore
    empInfo: state.common.empInfo,
    workCategoryList: state.eventEditPopup.workCategoryList,
    event: state.eventEditPopup.event,
    jobList: state.eventEditPopup.jobList,
    // TODO Remove @ts-ignore after migrating userSetting reducer
    // @ts-ignore
    useWorkTime: state.userSetting.useWorkTime,
    eventEditPopup: state.ui.eventEditPopup,
    useCalculateCapacity:
      // TODO Remove @ts-ignore after migrating userSetting reducer
      // @ts-ignore
      state.userSetting.usePsa && state.userSetting.belongsToResourceGroup,
  };
};

const Overlay = styled.div`
  position: fixed;
  z-index: 500000;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0);
`;

const StyledPopup = styled(Popup)<{
  isOpen?: boolean;
  top: string;
  left: string;
  children: React.ReactNode;
}>`
  z-index: 500002;
`;

const useJobFinder = (targetDate: moment.Moment | null): (() => void) => {
  // Dependencies
  const dispatch = useDispatch() as AppDispatch;
  const formattedTargetDate = React.useMemo(
    () => (targetDate ? targetDate.format('YYYY-MM-DD') : ''),
    [targetDate]
  );
  const editEventPopup = React.useMemo(() => {
    return EventEditPopupActions(dispatch, formattedTargetDate);
  }, [dispatch, formattedTargetDate]);

  const onClickOk = useCallback(editEventPopup.selectJob, [targetDate]);
  const [onClickOpen] = useJobSelectDialog<Job>({
    targetDate: formattedTargetDate,
    onOk: (job) => {
      onClickOk(job);
    },
    onError: (error) => {
      dispatch(catchApiError(error, { isContinuable: true }));
    },
  });

  return onClickOpen as () => void;
};

const EventEditPopupContainer: React.FC<Record<string, unknown>> = React.memo(
  () => {
    const { date, useWorkTime, eventEditPopup, ...stateProps } = useSelector(
      mapStateToProps,
      shallowEqual
    );

    const dispatch = useDispatch();
    const events = useMemo(() => Events(dispatch), [dispatch]);
    const app = useMemo(() => App(dispatch), [dispatch]);

    const selectJobEventEditPopup = useCallback(
      (id) =>
        (dispatch as ThunkDispatch<State, unknown, AnyAction>)(
          selectJobEventEditPopupAction(id)
        ),
      [dispatch]
    );
    const onChange = useCallback(
      (key: keyof CalendarEvent, value: string | boolean | moment.Moment) =>
        dispatch(editEventEditPopup(key, value)),
      [dispatch]
    );
    const closeEventEdit = useCallback(() => {
      app.closeEventEditPopup(stateProps.event.id);
    }, [dispatch, app.closeEventEditPopup, stateProps.event.id]);

    const onClickDelete = useCallback(() => {
      // @ts-ignore
      events.removeEvent(stateProps.event, date);
      closeEventEdit();
    }, [stateProps.event, events]);

    const onClickJobFinderButton = useJobFinder(stateProps.event.start);

    const onSubmit = () => {
      const errors = validateEvent(stateProps.event);
      if (errors.length > 0) {
        const messages = errors.map((error) => error.message);
        dispatch(
          catchBusinessError(msg().Com_Lbl_Error, messages.join('\n'), null, {
            isContinuable: true,
          })
        );
        return;
      }

      let startDate: string | moment.Moment = stateProps.event.start.clone();
      let endDate: string | moment.Moment = stateProps.event.end.clone();

      // 終日の場合utcに変換する前に該当日の開始時刻へ移動
      // utcモードにしてからstartOfを呼び出すと意図しない時間のズレが発生する
      if (stateProps.event.isAllDay) {
        (startDate as moment.Moment).startOf('day');
        (endDate as moment.Moment).startOf('day');
      }

      startDate = (startDate as moment.Moment).utc().format() as string;
      endDate = (endDate as moment.Moment).utc().format() as string;

      // FIXME: サーバーへ送るための変換は action にまとめたい
      const event: EventParam = {
        id: stateProps.event.id,
        title: stateProps.event.title,
        startDate, // utc
        endDate, // utc
        isAllDay: stateProps.event.isAllDay,
        calculateCapacity: stateProps.event.calculateCapacity,
        isOrganizer: stateProps.event.isOrganizer,
        isOuting: stateProps.event.isOuting,
        location: stateProps.event.location,
        remarks: stateProps.event.remarks,
        job: stateProps.event.job as Job,
        workCategoryId: stateProps.event.workCategoryId,
      };

      // @ts-ignore
      dispatch(saveEmpEvent(event)).then((result) => {
        if (result.isSuccess) {
          closeEventEdit();
        }
      });
    };

    const input =
      stateProps.event.start === null
        ? ''
        : DateUtil.formatISO8601Date(stateProps.event.start.valueOf());
    useEffect(() => {
      if (stateProps.event.start === null) {
        return;
      }

      // 予定の開始日時を変更したら、ジョブリストを取得し直す
      // FIXME: 開始日変更以外のタイミングでも実行されるため、場所を移したい

      // NOTE:
      // 保存されていない予定のnextProps.event.jobはcodeとnameを持たないため、
      // ジョブを指定した後で開始日を変更すると、プルダウン要素を正しく構築できない
      // これを回避するため、this.props.jobListの内容で不足を補填する
      const targetEvent = stateProps.event;
      const detailedEventJob = stateProps.jobList.find(
        (job) => job.jobId === targetEvent.job.id
      );
      const supplementedEvent: CalendarEvent = {
        ...targetEvent,
        job: {
          id: targetEvent.job.id,
          code: detailedEventJob ? detailedEventJob.jobCode : '',
          name: detailedEventJob ? detailedEventJob.jobName : '',
        },
      };

      (dispatch as ThunkDispatch<State, unknown, AnyAction>)(
        refreshActiveJobList(supplementedEvent)
      );
    }, [dispatch, input]);

    const hasJobType: boolean = useMemo(() => {
      const job = stateProps.jobList.find(
        (elem) => elem.jobId === stateProps.event.job.id
      );

      return job ? job.hasJobType : false;
    }, [stateProps.jobList, stateProps.event.job.id]);

    const hasWorkCategory = useMemo(() => {
      return hasJobType || !!stateProps.event.workCategoryId;
    }, [hasJobType, stateProps.event.workCategoryId]);

    return (
      <>
        {eventEditPopup.isOpen && (
          <Overlay
            data-testid="event-edit-popup__overlay"
            onClick={closeEventEdit}
          />
        )}
        <StyledPopup
          isOpen={eventEditPopup.isOpen}
          top={`${eventEditPopup.top}px`}
          left={`${eventEditPopup.left}px`}
        >
          <EventEditPopup
            {...stateProps}
            onChange={onChange}
            onClickDelete={onClickDelete}
            onClickClose={closeEventEdit}
            onClickSave={onSubmit}
            useWorkTime={useWorkTime}
            renderJobSelect={() =>
              useWorkTime && (
                <JobSelect
                  data-testid="edit-event-popup__job-select"
                  value={stateProps.event.job}
                  options={stateProps.jobList}
                  onSelect={(option: Option) =>
                    selectJobEventEditPopup(option.value)
                  }
                  onClickSearch={onClickJobFinderButton}
                />
              )
            }
            renderWorkCategory={() =>
              useWorkTime &&
              hasWorkCategory && (
                <WorkCategoryDropdown
                  data-testid="edit-event-popup__work-category-select"
                  onSelect={({ id, code, name }): void => {
                    onChange('workCategoryId', id);
                    onChange('workCategoryCode', code);
                    onChange('workCategoryName', name);
                  }}
                  jobId={stateProps.event?.job?.id}
                  onError={() => {}}
                  selected={{
                    workCategoryCode: stateProps.event.workCategoryCode,
                    workCategoryId: stateProps.event.workCategoryId,
                    workCategoryName: stateProps.event.workCategoryName,
                  }}
                  targetDate={stateProps.event?.start?.format('YYYY-MM-DD')}
                />
              )
            }
          />
        </StyledPopup>
      </>
    );
  }
);

export default EventEditPopupContainer;
