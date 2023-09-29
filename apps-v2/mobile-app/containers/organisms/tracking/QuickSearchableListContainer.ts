import * as React from 'react';
import { connect } from 'react-redux';
import { RouterProps } from 'react-router';
import { match as Match, withRouter } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';

import DateUtil from '../../../../commons/utils/DateUtil';

import { Job } from '../../../../domain/models/time-tracking/Job';

import { State } from '../../../modules';
import { actions as JobSelectHistory } from '../../../modules/tracking/ui/jobs/history';

import QuickSearchableList, {
  Props,
} from '../../../components/organisms/tracking/QuickSearchableList';

type OwnProps = Readonly<{
  match: Match<any>;
  history: RouterProps['history'];
  children: React.FunctionComponent<{ items: ReadonlyArray<Job> }>;
}>;

const getItems = (
  jobTable: {
    [key: string]: any;
  },
  match: Match<any>
) => {
  const defaultValue = { isDone: false, items: [] };
  const jobs = jobTable[match.params.parentJobId || ''];
  return jobs || defaultValue;
};

const mapStateToProps = (state: State) => ({
  jobs: state.tracking.entity.jobs,
  breadcrumbs: [...state.tracking.ui.jobs.history.parents].reverse(),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      go: JobSelectHistory.go,
    },
    dispatch
  );

const mergeProps = (
  { jobs, ...stateProps },
  { go, ...dispatchProps },
  ownProps: OwnProps
) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  items: getItems(jobs, ownProps.match).items,
  isLoading: !getItems(jobs, ownProps.match).isDone,
  filterSelector: (item: Job): string => `${item.code} ${item.name}`,
  onClickBreadCrumbs: (job: Job) => {
    if (ownProps.match.params.date) {
      ownProps.history.replace(
        `/tracking/tracking-daily/${DateUtil.formatISO8601Date(
          ownProps.match.params.date
        )}/jobs/${job.id}`
      );
    }
    go(job);
  },
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(
    QuickSearchableList as React.ComponentType<Props<Job>>
  ) as React.ComponentType<any>
);
