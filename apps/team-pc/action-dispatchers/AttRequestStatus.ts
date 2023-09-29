import { catchApiError, withLoading } from '../../commons/actions/app';
import UrlUtil from '../../commons/utils/UrlUtil';

import TeamAttSummaryPeriodListRepository from '../../repositories/TeamAttSummaryPeriodListRepository';
import TeamAttSummaryRepository from '../../repositories/TeamAttSummaryRepository';

import { AttSummary } from '../../domain/models/team/AttSummary';
import {
  AttSummaryPeriodList,
  findPeriodByName,
} from '../../domain/models/team/AttSummaryPeriodList';

import { actions as EntitiesAttSummaryActions } from '../modules/entities/attSummary';
import { actions as EntitiesAttSummaryPeriodListActions } from '../modules/entities/attSummaryPeriodList';
import { actions as UiAttRequestStatusPeriodsActions } from '../modules/ui/attRequestStatus/periods';
import { actions as UiAttRequestStatusTableActions } from '../modules/ui/attRequestStatus/table';

import { AppDispatch } from './AppThunk';

export const openTimesheetWindow = ({
  empId,
  targetDate,
}: {
  empId: string;
  targetDate: string;
}) => {
  UrlUtil.openApp('timesheet-pc', {
    empId,
    targetDate,
    standalone: '1',
  });
};

const loadPeriod =
  (periodName: string | null | undefined) =>
  (dispatch: AppDispatch): Promise<AttSummaryPeriodList> =>
    TeamAttSummaryPeriodListRepository.fetch(periodName).then(
      (attSummaryPeriodList) => {
        dispatch(
          EntitiesAttSummaryPeriodListActions.fetchSuccess(attSummaryPeriodList)
        );
        dispatch(
          UiAttRequestStatusPeriodsActions.fetchSuccess(
            periodName || '',
            attSummaryPeriodList
          )
        );
        return attSummaryPeriodList;
      }
    );

const loadAttSummary =
  (
    departmentId: string | null | undefined,
    periodName: string | null | undefined,
    attSummaryPeriodList: AttSummaryPeriodList
  ) =>
  (dispatch: AppDispatch): Promise<AttSummary | null | undefined | void> => {
    const target = findPeriodByName(periodName, attSummaryPeriodList);
    if (!target) {
      dispatch(EntitiesAttSummaryActions.clear());
      dispatch(UiAttRequestStatusTableActions.clear());
      return Promise.resolve();
    }
    return TeamAttSummaryRepository.search({
      departmentId,
      targetYear: target.year,
      targetMonthly: target.monthly,
    }).then((attSummary) => {
      dispatch(EntitiesAttSummaryActions.searchSuccess(attSummary));
      dispatch(UiAttRequestStatusTableActions.searchSuccess(attSummary));
      return attSummary;
    });
  };

export const load =
  (
    departmentId: string | null | undefined,
    periodName: string | null | undefined
  ) =>
  (dispatch: AppDispatch) =>
    dispatch(loadPeriod(periodName))
      .then((result) =>
        dispatch(loadAttSummary(departmentId, periodName, result))
      )
      .catch((error) => {
        dispatch(
          catchApiError(error || {}, {
            isContinuable: false,
          })
        );
        throw error;
      });

export const changePeriod =
  (
    departmentId: string | null | undefined,
    periodName: string | null | undefined
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(EntitiesAttSummaryActions.clear());
    dispatch(UiAttRequestStatusTableActions.clear());

    return dispatch(
      withLoading(() => dispatch(load(departmentId, periodName)))
    );
  };

export const changeDepartment =
  (
    departmentId: string | null | undefined,
    periodName: string | null | undefined,
    attSummaryPeriodList: AttSummaryPeriodList
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(EntitiesAttSummaryActions.clear());
    dispatch(UiAttRequestStatusTableActions.clear());

    return dispatch(
      withLoading(() =>
        dispatch(
          loadAttSummary(departmentId, periodName, attSummaryPeriodList)
        ).catch((error) => {
          dispatch(
            catchApiError(error || {}, {
              isContinuable: false,
            })
          );
          throw error;
        })
      )
    );
  };
