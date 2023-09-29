import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  getPlannerSetting,
  savePlannerSetting,
} from '../../actions/plannerSetting';

import { State } from '../../reducers';

import { Props as OwnProps } from '../../components/Admin/ContentsSelector';
import PlannerSetting, {
  Props,
} from '../../presentational-components/PlannerSetting';

const mapStateToProps = (state: State) => ({
  companyId: state.base.menuPane.ui.targetCompanyId,
  searchPlannerSetting: state.searchPlannerSetting,
});

const mapDispatchToProps = (dispatch) => {
  const { get, update } = bindActionCreators(
    {
      get: getPlannerSetting,
      update: savePlannerSetting,
    },
    dispatch
  );

  return {
    actions: {
      get,
      update: async (param) => {
        await update(param);
        get({ companyId: param.companyId });
      },
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlannerSetting) as React.ComponentType<
  Props & OwnProps
> as React.ComponentType<OwnProps>;
