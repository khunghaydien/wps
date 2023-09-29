import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { FunctionTypeList } from '@admin-pc/constants/functionType';

import { actions as delegateApplicantActions } from '@admin-pc/modules/delegateApplicant/entities/assignment';
import { actions as delegateApproverActions } from '@admin-pc/modules/delegateApprover/entities/assignment';

import { State } from '@admin-pc-v2/reducers';

import Employee from '@admin-pc-v2/presentational-components/Employee';

const mapStateToProps = (state: State) => ({
  companyId: state.base.menuPane.ui.targetCompanyId,
  isShowDetail: state.base.detailPane.ui.isShowDetail,
  isNewApproverAssignment: state.delegateApprover.ui.assignment.isNewAssignment,
  isNewApplicantAssignment:
    state.delegateApplicant.ui.assignment.isNewAssignment,
});

const EmployeeContainer = (ownProps: {
  title: string;
  useFunction: FunctionTypeList;
}) => {
  const baseRecord = useSelector(
    (state: State) => state.employee.ui.detail.baseRecord
  );

  const isShowDetail = useSelector(
    (state: State) => state.base.detailPane.ui.isShowDetail
  );
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();

  const useExpense = ownProps.useFunction.useExpense;

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          listDelegatedApprovers: delegateApproverActions.list,
          listDelegatedApplicants: delegateApplicantActions.list,
        },
        dispatch
      ),
    [dispatch]
  );

  useEffect(() => {
    if (isShowDetail) {
      if (baseRecord.id) {
        if (useExpense) {
          Actions.listDelegatedApprovers(baseRecord.id);
          Actions.listDelegatedApplicants(baseRecord.id);
        }
      }
    }
  }, [isShowDetail, baseRecord.id]);

  return <Employee {...ownProps} {...props} />;
};

export default EmployeeContainer;
