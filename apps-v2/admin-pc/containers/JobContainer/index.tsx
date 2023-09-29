import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { FunctionTypeList } from '../../constants/functionType';

import { searchByJob as searchJobAssignmentByJob } from '../../modules/job/entities/assignmentList';

import { searchDepartment } from '../../actions/department';
import * as job from '../../actions/job';
import { searchJobType } from '../../actions/jobType';

import { State } from '../../reducers';

import Component from '../../presentational-components/Job';

const { useEffect, useMemo } = React;

const mapStateToProps = (state: State) => {
  return {
    isShowDetail: state.base.detailPane.ui.isShowDetail,
    searchCompany: state.searchCompany,
  };
};

const JobContainer = (ownProps: {
  title: string;
  useFunction: FunctionTypeList;
}) => {
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();
  const companyId = useSelector(
    (state: State) => state.base.menuPane.ui.targetCompanyId
  );
  const baseRecord = useSelector(
    (state: State) => state.job.ui.detail.baseRecord
  );
  const isShowDetail = useSelector(
    (state: State) => state.base.detailPane.ui.isShowDetail
  );

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          getConstantsScopedAssignment: job.getConstantsScopedAssignment,
          searchDepartment,
          searchJobType,
          searchJobAssignmentByJob,
        },
        dispatch
      ),
    [dispatch]
  );

  useEffect(() => {
    Actions.getConstantsScopedAssignment();
  }, []);

  useEffect(() => {
    // TODO No need to call API if assigned to company
    if (isShowDetail && baseRecord.id) {
      Actions.searchJobAssignmentByJob(baseRecord.id);
    }
  }, [isShowDetail, baseRecord.id, companyId]);

  return <Component {...ownProps} {...props} />;
};

export default JobContainer;
