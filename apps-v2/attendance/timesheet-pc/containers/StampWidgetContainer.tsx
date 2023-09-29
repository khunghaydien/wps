import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { createSelector } from 'reselect';

import { STAMP_SOURCE } from '@attendance/domain/models/DailyStampTime';

import { State } from '../modules';
import * as selectors from '../modules/selectors';

import * as stampWidgetActions from '../action-dispatchers/StampWidget';

import $StampWidget from '../components/MainContent/StampWidget';

import UseCases from '../UseCases';
import isEnabledSubmittingFixDailyRequest from '@attendance/domain/services/FixDailyRequestService/isEnabledSubmitting';
import Events from '@attendance/timesheet-pc/events';
import useOnResume from '@attendance/ui/hooks/useOnResume';

const requestTargetDate = (state: State) =>
  state.entities.stampWidget?.stampOutDate;

const attRecordList = (state: State) => state.entities.timesheet?.attRecordList;

const workingTypes = (state: State) => state.entities.timesheet?.workingTypes;

const enabledSubmitFixDailyRequest: (state: State) => boolean = createSelector(
  workingTypes,
  attRecordList,
  requestTargetDate,
  (workingTypes, records, targetDate) =>
    isEnabledSubmittingFixDailyRequest({
      targetDate,
      workingTypes,
      records,
    })
);

const records = createSelector(
  attRecordList,
  selectors.buildDailyRequestConditionMap,
  (records, requestSummaries) => {
    if (!records || !requestSummaries) {
      return [];
    }
    return records.reduce((obj, record) => {
      const { recordDate } = record;
      obj[recordDate] = {
        id: record.id,
        dailyRequestSummary: {
          status: requestSummaries[recordDate]?.remarkableRequestStatus,
        },
      };
      return obj;
    }, {});
  }
);

const mapStateToProps = (state: State, ownProps) => ({
  loading: !!state.common.app.loadingDepth,
  language: state.common.userSetting.language, // NOTE: 言語適用タイミングの検知
  isEnableStartStamp: state.entities.stampWidget.isEnableStartStamp,
  isEnableEndStamp: state.entities.stampWidget.isEnableEndStamp,
  isEnableRestartStamp: state.entities.stampWidget.isEnableRestartStamp,
  mode: state.entities.stampWidget.mode,
  message: state.entities.stampWidget.message,
  className: ownProps.className,
  requestTargetDate: requestTargetDate(state),
  records: records(state),
  enabledSubmitFixDailyRequest: enabledSubmitFixDailyRequest(state),
});

function mapDispatchToProps(dispatch, ownProps) {
  return bindActionCreators(
    {
      reload: stampWidgetActions.initDailyStampTime,
      onDidMount:
        ownProps.onDidMount !== undefined
          ? ownProps.onDidMount
          : stampWidgetActions.initDailyStampTime,
      onClickStampButton: (stampWidget) =>
        stampWidgetActions.submitStamp(stampWidget, {
          withGlobalLoading: ownProps.withGlobalLoading,
          onStampSuccess: ownProps.onStampSuccess,
        }),
      onChangeMessage: (message) => stampWidgetActions.updateMessage(message),
      onClickModeButton: (clockType) =>
        stampWidgetActions.switchModeType(clockType),
    },
    dispatch
  );
}

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onClickStampButton: () => dispatchProps.onClickStampButton(stateProps),
  onClickSubmitFixDaily: async () => {
    if (stateProps.isEnableEndStamp) {
      await UseCases().submitFixDailyRequestWithClockOut({
        stampTimeRecord: {
          comment: stateProps.message,
          source: STAMP_SOURCE.WEB,
        },
        dailyRecords: stateProps.records,
      });
    } else {
      const request = stateProps.records[stateProps.requestTargetDate];
      await UseCases().submitFixDailyRequest(request);
    }
    Events.updatedDailyRecord.publish();
  },
});

// ms * 60 (minus) * 5 = 5 min
const StampWidget = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(
  (
    props: React.ComponentProps<typeof $StampWidget> & {
      loading: boolean;
      reload: () => Promise<void>;
    }
  ) => {
    const { loading, reload } = props;
    const handler = React.useCallback(() => {
      if (loading) {
        return;
      }
      return reload();
    }, [loading, reload]);
    useOnResume(handler);
    return <$StampWidget {...props} />;
  }
);

export default StampWidget;
