import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { getUserSetting } from '@apps/commons/actions/userSetting';
import DateUtil from '@commons/utils/DateUtil';
import { withLoading } from '@mobile/modules/commons/loading';

import { UserSetting } from '@apps/domain/models/UserSetting';

import { State } from '../../../modules';
import { actions as employeeHistoryActions } from '@mobile/modules/expense/ui/employeeHistory';

import { fetchHistories } from '@mobile/action-dispatchers/expense/EmployeeHistory';

import Layout from '@mobile/components/organisms/expense/Layout';

// eslint-disable-next-line react/no-unused-prop-types
type OwnProps = RouteComponentProps & { children: React.ReactNode };

const LayoutContainer: React.FunctionComponent<OwnProps> = (ownProps) => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const userSetting = useSelector((state: State) => state.userSetting);
  const isShowingBody = !!(userSetting && userSetting.companyId);

  useEffect(() => {
    if (!isShowingBody) {
      // When an empty Array is sent to the API, it will only return the basic information and will not retrieve and populate the details.
      // @ts-ignore
      dispatch(getUserSetting({ detailSelectors: [] })).then(
        ({
          empHistoryValidFrom,
          empHistoryValidTo,
          empGroupId,
          employeeId,
        }: UserSetting) => {
          dispatch(withLoading(fetchHistories(employeeId)));
          dispatch(
            employeeHistoryActions.set({
              validFrom: empHistoryValidFrom,
              validTo: DateUtil.addDays(empHistoryValidTo, -1),
              empGroupId,
            })
          );
        }
      );
    }
  }, []);

  return (
    <Layout isShowingBody={isShowingBody} isShowing={false}>
      {ownProps.children}
    </Layout>
  );
};

export default LayoutContainer;
