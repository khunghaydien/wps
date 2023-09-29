import { connect } from 'react-redux';

import { MAX_RECORDS_NUMBER, RecordTableMode } from '../constants/recordTable';

import { confirm } from '../../commons/actions/app';
import msg from '../../commons/languages';

import { fetchObjDetail } from '../modules/entities/objectDetails';
import { actions as recordAction } from '../modules/entities/objRecord';
import { actions as queryTemplateAction } from '../modules/entities/query';
import { setSelectedId } from '../modules/ui/query';
import { actions as recordListAction } from '../modules/ui/recordList';
import { actions as selectedObjAction } from '../modules/ui/selectedObj';

import { downloadFile } from '../action-dispatchers/Download';

import ObjectPage from '../components/ObjectPage';

const mapStateToProps = (state) => ({
  objList: state.entities.objectList,
  objDetails: state.entities.objectDetails,
  selectedObjKey: state.ui.selectedObj.objKey,
  selectedObjSetting: state.ui.selectedObj,
  objDetail: state.entities.objectDetails[state.ui.selectedObj.objKey],
  objRecord: state.entities.objRecord,
  currentPage: state.ui.recordList.currentPage,
  mode: state.ui.recordList.mode,
  recordOrg: state.entities.objRecord,
  isDetailRecordPage: state.ui.recordDetail.isDetailPage,
  isFetched: state.entities.query.isFetched,
  companyId: state.userSetting.companyId,
  queryTemplateDialog: state.ui.query,
});

const mapDispatchToProps = {
  fetchObjDetail,
  setSelectedObjKey: selectedObjAction.setSelectedObjKey,
  setSqlQuery: selectedObjAction.setSqlList,
  setSearchCondition: selectedObjAction.setSearchCondition,
  setSortCondition: selectedObjAction.setSortCondition,
  setRecordDisplay: selectedObjAction.setRecordDisplay,
  setHighlightRefItem: selectedObjAction.setHighlightRefItem,
  setDeletedChecked: selectedObjAction.setDeletedChecked,
  fetchRecordsCount: recordAction.fetchRecordsCount,
  fetchObjRecords: recordAction.fetchObjRecords,
  confirm,
  updateRecord: recordListAction.updateRecords,
  setMode: recordListAction.setMode,
  setDeletedIncluded: recordListAction.setDeletedIncluded,
  setListHeaderColumn: recordListAction.setListHeaderColumn,
  downloadFile,
  fetchQueryTemplates: queryTemplateAction.fetchQuery,
  setSelectedId,
};

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onChangeSelectedObj: async (targetObj: Record<string, any>) => {
    if (stateProps.mode !== RecordTableMode.readOnly) {
      const result = await dispatchProps.confirm(
        msg().Common_Confirm_DiscardEdits
      );
      if (result) {
        dispatchProps.updateRecord(stateProps.recordOrg.records);
        dispatchProps.setMode(RecordTableMode.readOnly);
      } else {
        return;
      }
    }
    const sObjKey = targetObj.value;
    dispatchProps.setSelectedObjKey(sObjKey);
    dispatchProps.setRecordDisplay(false);
    dispatchProps.setDeletedChecked(false);
    dispatchProps.setSearchCondition('');
    dispatchProps.setSortCondition('');
    dispatchProps.setSelectedId('');
    dispatchProps.setSqlQuery('');
    if (!stateProps.objDetails[sObjKey]) {
      dispatchProps.fetchObjDetail(sObjKey);
    }
    if (!stateProps.isFetched) {
      dispatchProps.fetchQueryTemplates(stateProps.companyId);
    }
  },
  onClickSearchRecords: () => {
    const {
      sqlList,
      searchCondition,
      sortCondition,
      isDeletedIncludedChecked,
    } = stateProps.selectedObjSetting;
    const fieldsToSelect = sqlList.trim().split(',\n');
    dispatchProps.setListHeaderColumn(fieldsToSelect);
    dispatchProps.setDeletedIncluded(isDeletedIncludedChecked);
    dispatchProps.fetchRecordsCount(
      stateProps.selectedObjKey,
      isDeletedIncludedChecked,
      searchCondition.trim()
    );
    dispatchProps
      .fetchObjRecords(
        stateProps.selectedObjKey,
        fieldsToSelect,
        stateProps.currentPage,
        isDeletedIncludedChecked,
        MAX_RECORDS_NUMBER,
        searchCondition.trim(),
        sortCondition.trim()
      )
      .then(() => dispatchProps.setRecordDisplay(true));
  },
  onClickCancel: () => {
    dispatchProps.confirm(msg().Common_Confirm_DiscardEdits, (yes) => {
      if (yes) {
        dispatchProps.updateRecord(stateProps.recordOrg.records);
        dispatchProps.setMode(RecordTableMode.readOnly);
      }
    });
  },
  onClickDownload: () => {
    const {
      sqlList,
      searchCondition,
      sortCondition,
      isDeletedIncludedChecked,
    } = stateProps.selectedObjSetting;
    const fieldsToSelect = sqlList.trim().split(',\n');
    dispatchProps
      .fetchRecordsCount(
        stateProps.selectedObjKey,
        isDeletedIncludedChecked,
        searchCondition
      )
      .then((count) =>
        dispatchProps.downloadFile(
          stateProps.selectedObjKey,
          count,
          isDeletedIncludedChecked,
          fieldsToSelect,
          searchCondition,
          sortCondition
        )
      );
  },
  setQueryTemplate: (id, fieldsToSelect, searchCondition, sortCondition) => {
    dispatchProps.setSqlQuery(fieldsToSelect);
    dispatchProps.setSearchCondition(searchCondition);
    dispatchProps.setSortCondition(sortCondition);
    dispatchProps.setSelectedId(id);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ObjectPage) as React.ComponentType<Record<string, any>>;
