import { connect } from 'react-redux';

import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { MAX_RECORDS_NUMBER } from '../constants/recordTable';

import { confirm } from '../../commons/actions/app';
import msg from '../../commons/languages';

import { fetchObjDetail } from '../modules/entities/objectDetails';
import { actions as recordApiAction } from '../modules/entities/objRecord';
import { updateRecord as updateObjRecord } from '../modules/entities/recordDetail';
import { actions as detailRecordAction } from '../modules/ui/recordDetail';

import RecordDetailPage from '../components/RecordDetailPage';

const mapStateToProps = (state) => ({
  objKey: state.ui.recordDetail.objKey,
  record: state.ui.recordDetail.record,
  isEditMode: state.ui.recordDetail.isEdit,
  orgRecord: state.entities.recordDetail,
  objDetail: state.entities.objectDetails[state.ui.recordDetail.objKey],
  objects: state.entities.objectDetails,
  selectedObjKey: state.ui.selectedObj.objKey,
  listHeaderColumn: state.ui.recordList.listHeaderColumn,
  isDeletedIncluded: state.ui.recordList.isDeletedIncluded,
  currentPage: state.ui.recordList.currentPage,
});

const mapDispatchToProps = {
  updateRecord: detailRecordAction.updateDetailRecord,
  confirm,
  fetchObjDetail,
  setMode: detailRecordAction.setEditMode,
  backToObjectPage: detailRecordAction.setDetailPageDisplay,
  displayDetailRecord: detailRecordAction.setDetailPageDisplay,
  fetchObjRecordById: recordApiAction.fetchObjRecordById,
  updateObjRecord,
  fetchObjRecords: recordApiAction.fetchObjRecords,
};

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onClickGoBack: (updatedData, isDetailPage) => {
    if (!isEmpty(updatedData)) {
      dispatchProps.confirm(msg().Common_Confirm_DiscardEdits, (yes) => {
        if (yes) {
          dispatchProps.updateRecord(stateProps.orgRecord);
          dispatchProps.setMode(false);
          dispatchProps.backToObjectPage(isDetailPage);
        }
      });
    } else {
      dispatchProps.setMode(false);
      dispatchProps.backToObjectPage(isDetailPage);
    }
  },
  onClickCancel: () => {
    dispatchProps.confirm(msg().Common_Confirm_DiscardEdits, (yes) => {
      if (yes) {
        dispatchProps.updateRecord(stateProps.orgRecord);
        dispatchProps.setMode(false);
      }
    });
  },
  onClickSaveEdit: (updatedData) => {
    const fieldTypeMap = {};
    const valueMap = { Id: stateProps.orgRecord.Id };
    Object.entries(updatedData).forEach(([key, value]) => {
      fieldTypeMap[key] = get(value, 'type');
      valueMap[key] = get(value, 'value');
    });
    dispatchProps
      .updateObjRecord(
        stateProps.objKey,
        fieldTypeMap,
        [valueMap],
        stateProps.record
      )
      .then(() => {
        // If it's the selected object's record, update the records table accordingly in the object page
        if (stateProps.objKey === stateProps.selectedObjKey) {
          const { searchCondition, sortCondition } = stateProps.selectedObj;
          dispatchProps.fetchObjRecords(
            stateProps.objKey,
            stateProps.listHeaderColumn,
            stateProps.currentPage,
            stateProps.isDeletedIncluded,
            MAX_RECORDS_NUMBER,
            searchCondition.trim(),
            sortCondition.trim()
          );
        }
      });
  },
  onClickDetailRecordId: (referenceColumn, id) => {
    // If referenceColumn is Id, the reference object is the current record's object
    const referenceObj =
      referenceColumn === 'Id'
        ? stateProps.objKey
        : find(stateProps.objDetail.fields, {
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
    dispatchProps.displayDetailRecord(true);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(RecordDetailPage) as React.ComponentType<Record<string, any>>;
