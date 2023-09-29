import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Formik } from 'formik';
import { find, get, last } from 'lodash';
import { createSelector } from 'reselect';
import * as Yup from 'yup';

import FileUtil from '@apps/commons/utils/FileUtil';
import { NAMESPACE_PREFIX } from '@commons/api';
import msg from '@commons/languages';

import { isFieldEditable } from '@apps/custom-request-pc/models';

import { State } from '@custom-request-pc/modules';

import {
  createNewRequest,
  getBase64File,
  updateRequest,
  uploadReceipts,
} from '@custom-request-pc/action-dispatchers';

import { Props as OwnProps } from '@custom-request-pc/components/Dialogs';
import Component from '@custom-request-pc/components/Dialogs/Form';

import {
  dialogTypes,
  relatedList,
  typeName,
} from '@apps/custom-request-pc/consts';
import {
  FieldTypeMap,
  LayoutDetail,
  LayoutItem,
  Mode,
  TypeName,
} from '@custom-request-pc/types';

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
});

const generateSchema = (configList: Array<LayoutItem>, mode: Mode) => {
  const shapeObj = {};
  configList.forEach((x) => {
    const isValidField = ![RECORD_ACCESS_FIELD_NAME].includes(x.field);
    const isEditable = isFieldEditable(x, mode);
    const isRequired = isValidField && isEditable && x.required;
    switch (x.typeName) {
      case typeName.CURRENCY:
      case typeName.DATE:
      case typeName.DATETIME:
      case typeName.MULTIPICKLIST:
      case typeName.PICKLIST:
      case typeName.REFERENCE:
      case typeName.TEXTAREA:
      case typeName.STRING:
        isRequired &&
          (shapeObj[x.field] = Yup.string().required(
            msg().Common_Err_Required
          ));
        break;
      case typeName.DOUBLE:
        isRequired &&
          (shapeObj[x.field] = Yup.number().required(
            msg().Common_Err_Required
          ));
        break;
      case typeName.BOOLEAN:
        isRequired &&
          (shapeObj[x.field] = Yup.boolean().required(
            msg().Common_Err_Required
          ));
        break;
      default:
        break;
    }
  });
  return Yup.object().shape(shapeObj);
};

const FormContainer = (ownProps: OwnProps) => {
  const props = useSelector(mapStateToProps);
  const recordTypeList = useSelector(
    (state: State) => state.entities.recordTypeList.records
  );
  const selectedRequest = useSelector((state: State) =>
    getSelectedRequest(state)
  );
  const requestDetail = useSelector(
    (state: State) => state.entities.requestDetail
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

  const mode = last(ownProps.activeDialog);
  const schema = generateSchema(props.configList, mode);
  const dispatch = useDispatch();
  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          createNewRequest,
          updateRequest,
          getBase64File,
          uploadReceipts,
        },
        dispatch
      ),
    [dispatch]
  );

  const uploadFiles = async (files: File[]) => {
    const file = files[0];
    const base64File = await Actions.getBase64File(file);
    const res = await Actions.uploadReceipts([base64File as any]);
    const attachment = {
      attachedFileId: (res as any).contentDocumentId,
      attachedFileVerId: (res as any).contentVersionId,
      attachedFileDataType: (base64File as any).type,
      attachedFileName: FileUtil.getFileNameWithoutExtension(base64File.name),
      attachedFileCreatedDate: new Date(),
      attachedFileExtension: FileUtil.getFileExtension(base64File.name),
    };

    return attachment;
  };
  const layoutConfig = useSelector(
    (state: State) => state.ui.layoutConfig.config
  );

  const sObjName = useSelector(
    (state: State) => state.ui.layoutConfig.sObjName
  );

  const isEditing = last(ownProps.activeDialog) === dialogTypes.EDIT;
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
        isShownHistory
      );
    } else {
      Actions.createNewRequest(
        [valuesCopy],
        fieldTypeMap,
        sObjName,
        layoutConfig.map(({ field }) => field),
        selectedRecordTypeId,
        attachedFileList
      );
    }

    ownProps.onHideAll();
  };

  const attachedFileList = requestDetail.attachedFileList || [];
  let initialValues = {};
  if (isEditing) {
    initialValues = { ...selectedRequest, attachedFileList };
  } else {
    props.configList.forEach((x) => {
      if (x.defaultValue && x.typeName === typeName.BOOLEAN) {
        initialValues[x.field] = x.defaultValue;
      }
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
      <Component
        {...props}
        {...ownProps}
        recordTypeName={find(recordTypeList, { id: selectedRecordTypeId }).name}
        uploadFiles={uploadFiles}
        mode={mode}
        isShownFile={isShownFile}
        title={title}
      />
    </Formik>
  );
};

export default FormContainer;
