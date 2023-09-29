import { connect } from 'react-redux';

import find from 'lodash/find';

import { ID_FIELD } from '../constants/keyMap';
import { RecordTableMode } from '../constants/recordTable';

import { confirm } from '../../commons/actions/app';
import msg from '../../commons/languages';

import { fetchObjDetail } from '../modules/entities/objectDetails';
import { actions as recordApiAction } from '../modules/entities/objRecord';
import { setDetailRecord } from '../modules/entities/recordDetail';
import { actions as detailRecordAction } from '../modules/ui/recordDetail';
import { actions as recordListAction } from '../modules/ui/recordList';

import RecordTable from '../components/RecordTable';

const mapStateToProps = (state) => ({
  selectedObj: state.ui.selectedObj,
  objKey: state.ui.selectedObj.objKey,
  isDeletedIncluded: state.ui.recordList.isDeletedIncluded,
  listHeaderColumns: state.ui.recordList.listHeaderColumn,
  recordOrg: state.entities.objRecord,
  records: state.ui.recordList.records,
  resetCheckbox: state.ui.recordList.resetCheckbox,
  mode: state.ui.recordList.mode,
  currentPage: state.ui.recordList.currentPage,
  objects: state.entities.objectDetails,
  objDetail: state.entities.objectDetails[state.ui.selectedObj.objKey],
});

const mapDispatchToProps = {
  fetchRecordsCount: recordApiAction.fetchRecordsCount,
  fetchObjRecords: recordApiAction.fetchObjRecords,
  deleteRecord: recordApiAction.deleteRecord,
  undeleteRecord: recordApiAction.undeleteRecord,
  updateObjRecord: recordApiAction.updateRecord,
  createObjRecord: recordApiAction.createRecord,
  fetchObjRecordById: recordApiAction.fetchObjRecordById,
  setCurrentPage: recordListAction.setCurrentPage,
  updateRecord: recordListAction.updateRecords,
  setMode: recordListAction.setMode,
  setCheckboxList: recordListAction.setCheckboxList,
  confirm,
  displayDetailRecord: detailRecordAction.setDetailPageDisplay,
  setRecordDetailData: detailRecordAction.setDetailRecord,
  fetchObjDetail,
  setDetailRecord,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  onChangeCurrentPage: (targetPage, fetchRowNum) => {
    const { searchCondition, sortCondition } = ownProps;
    dispatchProps.setCurrentPage(targetPage);
    dispatchProps.fetchObjRecords(
      stateProps.selectedObj.objKey,
      stateProps.listHeaderColumns,
      targetPage,
      stateProps.selectedObj.isDeletedIncluded,
      fetchRowNum,
      searchCondition.trim(),
      sortCondition.trim()
    );
  },
  onClickDeleteRecord: (recordIds) => {
    dispatchProps.deleteRecord(
      stateProps.selectedObj.objKey,
      recordIds,
      stateProps.selectedObj.isDeletedIncluded,
      stateProps.listHeaderColumns,
      ownProps.searchCondition.trim(),
      ownProps.sortCondition.trim(),
      stateProps.currentPage
    );
  },
  onClickUndeleteRecord: (recordIds) => {
    dispatchProps.undeleteRecord(
      stateProps.selectedObj.objKey,
      recordIds,
      stateProps.records
    );
  },
  onClickCancel: () => {
    dispatchProps.confirm(msg().Common_Confirm_DiscardEdits, (yes) => {
      if (yes) {
        dispatchProps.updateRecord(stateProps.recordOrg.records);
        dispatchProps.setMode(RecordTableMode.readOnly);
      }
    });
  },
  onClickSaveEdit: (updatedRows) => {
    const fieldTypeMap = {};
    stateProps.objDetail.fields.forEach((item) => {
      Object.assign(fieldTypeMap, { [item.name]: item.typeName });
    });
    dispatchProps
      .updateObjRecord(
        stateProps.selectedObj.objKey,
        fieldTypeMap,
        updatedRows,
        stateProps.records
      )
      .then(() => {
        dispatchProps.setMode(RecordTableMode.readOnly);
      });
  },
  onClickSaveAdd: (addRows) => {
    const fieldTypeMap = {};
    stateProps.objDetail.fields.forEach((item) => {
      Object.assign(fieldTypeMap, { [item.name]: item.typeName });
    });
    dispatchProps.createObjRecord(
      stateProps.selectedObj.objKey,
      fieldTypeMap,
      addRows,
      stateProps.selectedObj.isDeletedIncluded,
      stateProps.listHeaderColumns,
      ownProps.searchCondition.trim(),
      ownProps.sortCondition.trim()
    );
  },
  onClickDetailRecordId: (referenceColumn, id) => {
    // If referenceColumn is Id, retrieve data from itself; Otherwise fetch from BE
    // If referedObject is included in redux, fetch record by id directly; otherwise fetch object detail to generate fieldTypeMap
    if (referenceColumn === ID_FIELD) {
      const record = find(stateProps.records, { Id: id });
      dispatchProps.setRecordDetailData(stateProps.objKey, record);
      dispatchProps.setDetailRecord(record);
    } else {
      const referenceObj = find(stateProps.objDetail.fields, {
        name: referenceColumn,
      }).referenceTo[0];
      const referObjDetail = stateProps.objects[referenceObj];
      let fields = [];
      if (referObjDetail) {
        fields = referObjDetail.fields.map((item) => item.name);
        dispatchProps.fetchObjRecordById(referenceObj, fields, id);
      } else {
        dispatchProps.fetchObjDetail(referenceObj).then((res) => {
          fields = res.fields.map((item) => item.name);
          dispatchProps.fetchObjRecordById(referenceObj, fields, id);
        });
      }
    }
    dispatchProps.displayDetailRecord(true);
  },
  onChangePageSize: (rowNum) => {
    const { searchCondition, sortCondition } = ownProps;
    const {
      selectedObj: { objKey, isDeletedIncluded },
      listHeaderColumns,
      currentPage,
    } = stateProps;
    dispatchProps.fetchObjRecords(
      objKey,
      listHeaderColumns,
      currentPage,
      isDeletedIncluded,
      rowNum,
      searchCondition.trim(),
      sortCondition.trim()
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(RecordTable) as React.ComponentType<Record<string, any>>;
