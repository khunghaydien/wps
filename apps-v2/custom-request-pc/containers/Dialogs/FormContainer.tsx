import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Formik } from 'formik';
import { find, get, last } from 'lodash';
import { createSelector } from 'reselect';

import { generateSchema } from '@apps/commons/schema/customRequest/FormSchema';

import ReferenceSearchContainer from '@apps/commons/containers/customRequest/ReferenceSearchContainer';
import {
  initializeReferenceDialog,
  updateRequest,
  uploadReceipts,
} from '@commons/action-dispatchers/CustomRequest';
import { NAMESPACE_PREFIX } from '@commons/api';
import Component from '@commons/components/customRequest/Dialogs/Form';
import msg from '@commons/languages';

import { isFieldEditable } from '@apps/domain/models/customRequest';
import {
  dialogTypes,
  pageView,
  relatedList,
  typeName,
} from '@apps/domain/models/customRequest/consts';
import {
  FieldTypeMap,
  LayoutDetail,
  TypeName,
} from '@apps/domain/models/customRequest/types';

import { State } from '@custom-request-pc/modules';
import { actions as activeDialogActions } from '@custom-request-pc/modules/ui/dialog/activeDialog';
import { actions as pageViewUIActions } from '@custom-request-pc/modules/ui/pageView';
import { actions as selectedIdUIAction } from '@custom-request-pc/modules/ui/selectedId';

import { createNewRequest } from '@custom-request-pc/action-dispatchers';

import { Props as OwnProps } from '@custom-request-pc/components/Dialogs';

const RECORD_ACCESS_FIELD_NAME = NAMESPACE_PREFIX + 'RecordAccessId__c';

const getSelectedRequest = createSelector(
  (state: State) => state.entities.customRequestList.list,
  (state: State) => state.ui.selectedId,
  (requestList, selectedId) => requestList.find(({ Id }) => Id === selectedId)
);

const mapStateToProps = (state: State) => ({
  configList: state.ui.dialog.layoutConfig.config,
  recordTypeId: state.ui.dialog.selectedRecordTypeId,
  recordTypeIdInList: state.ui.selectedRecordTypeId,
  currencySymbol: state.userSetting.sfCompanyDefaultCurrencyCode,
  userId: state.userSetting.id,
});

const FormContainer = (ownProps: OwnProps) => {
  const props = useSelector(mapStateToProps);
  const recordTypeList = useSelector(
    (state: State) => state.entities.recordTypeList.records
  );
  const selectedRequest =
    useSelector((state: State) => getSelectedRequest(state)) || {};
  const requestDetail = useSelector(
    (state: State) => state.entities.requestDetail
  );
  const defaultRequest = useSelector(
    (state: State) => state.entities.defaultRequest
  );
  const getRelatedList = createSelector(
    (state: State) => state.ui.layoutDetailInfo,
    (layoutDetail: LayoutDetail) =>
      layoutDetail.relatedLists.map((x) => get(x, 'sobject'))
  );
  const getFileDisplayConfig = createSelector(getRelatedList, (relatedLists) =>
    relatedLists.includes(relatedList.FILE_LIST)
  );
  const getHistoryDisplayConfig = createSelector(
    getRelatedList,
    (relatedLists) => relatedLists.includes(relatedList.HISTORY_LIST)
  );
  const isShownFile = useSelector((state: State) =>
    getFileDisplayConfig(state)
  );
  const isShownHistory = useSelector((state: State) =>
    getHistoryDisplayConfig(state)
  );

  const selectedReferenceRecords = useSelector(
    (state: State) => state.ui.dialog.selectedReferenceRecords
  );

  const referenceLabelField = useSelector(
    (state: State) => state.entities.referenceLabelField
  );

  const mode = last(ownProps.activeDialog);
  const schema = generateSchema(props.configList, mode);
  const dispatch = useDispatch();
  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          createNewRequest,
          updateRequest,
          uploadReceipts,
          initializeReferenceDialog,
          onHide: activeDialogActions.hide,
          setReferenceActiveDialog: activeDialogActions.reference,
          setPageView: pageViewUIActions.setView,
          setSelectedId: selectedIdUIAction.set,
        },
        dispatch
      ),
    [dispatch]
  );

  const openReferenceDialog = (objName: string, fieldName: string) => {
    Actions.setReferenceActiveDialog();
    Actions.initializeReferenceDialog(objName, fieldName);
  };

  const uploadFiles = async (files: File[]) => {
    const file = files[0];
    return await Actions.uploadReceipts(file);
  };
  const layoutConfig = useSelector(
    (state: State) => state.ui.layoutConfig.config
  );

  const sObjName = useSelector(
    (state: State) => state.ui.layoutConfig.sObjName
  );

  const isReferenceDialogShown = useSelector((state: State) =>
    state.ui.dialog.activeDialog.includes(dialogTypes.REFERENCE)
  );

  const isEditing = ownProps.activeDialog.includes(dialogTypes.EDIT);
  const selectedRecordTypeId = isEditing
    ? props.recordTypeIdInList
    : props.recordTypeId;
  const onClickSave = (values) => {
    const valuesCopy = { ...values };
    const attachedFileList = valuesCopy.attachedFileList;
    valuesCopy.RecordTypeId = selectedRecordTypeId;
    delete valuesCopy.hasFile;
    delete valuesCopy.attachedFileList;
    delete valuesCopy[RECORD_ACCESS_FIELD_NAME];
    const fieldTypeMap = {} as FieldTypeMap;
    const inputtedFields = Object.keys(valuesCopy);
    props.configList.forEach((x) => {
      const isEditable = isFieldEditable(x, mode);
      // fieldTypeMap and valueMapList element should have same keys
      if (isEditable && inputtedFields.includes(x.field)) {
        fieldTypeMap[x.field] = x.typeName as TypeName;
      }
    });
    fieldTypeMap.RecordTypeId = typeName.REFERENCE as TypeName;

    if (isEditing) {
      fieldTypeMap.Id = typeName.ID as TypeName;
      Actions.updateRequest(
        [valuesCopy],
        fieldTypeMap,
        sObjName,
        layoutConfig.map(({ field }) => field),
        selectedRecordTypeId,
        attachedFileList,
        isShownFile,
        isShownHistory,
        false,
        props.userId
      )
        // @ts-ignore
        .then(() => {
          ownProps.onHideAll();
        });
    } else {
      Actions.createNewRequest(
        [valuesCopy],
        fieldTypeMap,
        sObjName,
        layoutConfig.map(({ field }) => field),
        selectedRecordTypeId,
        props.userId,
        attachedFileList
      )
        // @ts-ignore
        .then((recordId: string) => {
          ownProps.onHideAll();
          Actions.setSelectedId(recordId);
          Actions.setPageView(pageView.Detail);
        });
    }
  };

  const attachedFileList = requestDetail.attachedFileList || [];
  const { labelMap = {}, ...rest } = selectedRequest;
  let initialValues = {};
  if (isEditing) {
    initialValues = { ...rest, attachedFileList };
  } else {
    props.configList.forEach((x) => {
      initialValues[x.field] = defaultRequest[x.field];
    });
  }

  const title = isEditing
    ? msg().Exp_Lbl_EditCustomRequest
    : msg().Exp_Lbl_NewCustomRequest;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onClickSave}
      validationSchema={schema}
      enableReinitialize
    >
      <>
        <Component
          recordTypeName={
            find(recordTypeList, { id: selectedRecordTypeId }).name
          }
          uploadFiles={uploadFiles}
          openReferenceDialog={openReferenceDialog}
          mode={mode}
          isShownFile={isShownFile}
          title={title}
          labelMap={labelMap}
          configList={props.configList}
          currencySymbol={props.currencySymbol}
          selectedReferenceRecords={selectedReferenceRecords}
          referenceLabelField={referenceLabelField}
          onHideAll={ownProps.onHideAll}
        />
        {/* To share formik context */}
        {isReferenceDialogShown && (
          <ReferenceSearchContainer onHide={Actions.onHide} />
        )}
      </>
    </Formik>
  );
};

export default FormContainer;
