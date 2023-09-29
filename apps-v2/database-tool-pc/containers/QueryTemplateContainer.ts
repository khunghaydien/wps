import { connect } from 'react-redux';

import find from 'lodash/find';
import get from 'lodash/get';
import { createSelector } from 'reselect';

import { actions as queryTemplateAction } from '../modules/entities/query';
import { setDeleteDialog, setSaveDialog } from '../modules/ui/query';

import QueryTemplate from '../components/QueryTemplate';

const getObjDetails = (state) => state.entities.objectDetails;
const getSelectedObj = (state) => state.ui.selectedObj.objKey;
const getSelectedObjDefaulsSql = createSelector(
  getObjDetails,
  getSelectedObj,
  (objs, selectedObj) => {
    const fields = get(objs, `${selectedObj}.fields`, []);
    return fields.map((item) => item.name).join(',\n');
  }
);

const mapStateToProps = (state) => ({
  selectedObjKey: state.ui.selectedObj.objKey,
  companyId: state.userSetting.companyId,
  queryTemplateList: state.entities.query.templateList,
  queryTemplate: state.ui.query,
  selectedObjSetting: state.ui.selectedObj,
  originalSql: getSelectedObjDefaulsSql(state),
});

const mapDispatchToProps = {
  setSaveDialog,
  setDeleteDialog,
  saveQuery: queryTemplateAction.saveQuery,
  deleteQuery: queryTemplateAction.deleteQuery,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  onClickSaveQuery: (id: string | null, name: string) => {
    const {
      selectedObjSetting: { sqlList, searchCondition, sortCondition },
      companyId,
    } = stateProps;
    dispatchProps.saveQuery(
      id,
      name,
      companyId,
      sqlList.trim().split(',\n'),
      searchCondition,
      sortCondition
    );
  },
  onClickDeleteQuery: (id: string) => {
    dispatchProps.deleteQuery(id, stateProps.originalSql);
  },
  onChangeTemplate: (targeted: Record<string, any>) => {
    const id = targeted.value;
    if (id) {
      const template = find(stateProps.queryTemplateList, ['id', id]);
      const searchCondition = get(template, 'searchCondition') || '';
      const sortCondition = get(template, 'sortCondition') || '';
      let fieldsToSelect = stateProps.originalSql;
      if (template) {
        const fields = [...template.fieldsToSelect];
        fieldsToSelect = fields.join(',\n');
      }
      ownProps.onChangeTemplate(
        id,
        fieldsToSelect,
        searchCondition,
        sortCondition
      );
    }
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(QueryTemplate) as React.ComponentType<any>;
