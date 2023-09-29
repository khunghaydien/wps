import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Formik } from 'formik';

import { generateSchema } from '@commons/schema/customRequest/FormSchema';

import {
  initializeReferenceDialog,
  updateRequest,
  uploadReceipts,
} from '@commons/action-dispatchers/CustomRequest';
import { NAMESPACE_PREFIX } from '@commons/api';
import Form from '@commons/components/customRequest/Dialogs/Form';
import ReferenceSearchContainer from '@commons/containers/customRequest/ReferenceSearchContainer';
import msg from '@commons/languages';

import {
  isFieldEditable,
  isShowFileSection,
} from '@apps/domain/models/customRequest';
import {
  CUSTOM_REQUEST_APPROVAL_COLUMNS,
  CUSTOM_REQUEST_ID_FIELD_KEY,
  CUSTOM_REQUEST_SF_OBJECT_NAME,
  dialogTypes,
  typeName,
} from '@apps/domain/models/customRequest/consts';
import {
  FieldTypeMap,
  LayoutItem,
  TypeName,
} from '@apps/domain/models/customRequest/types';

import { State } from '../../../modules';

import { AppDispatch } from '../../../action-dispatchers/AppThunk';

import { EditFormContainerProps } from '@apps/approvals-pc/components/CustomRequest/Detail';

const RECORD_ACCESS_FIELD_NAME = NAMESPACE_PREFIX + 'RecordAccessId__c';
const EDIT_MODE = dialogTypes.EDIT;

const EditFormContainer = ({ onHide }: EditFormContainerProps) => {
  const dispatch = useDispatch() as AppDispatch;
  const [isOpenRefDialog, setIsOpenRefDialog] = useState(false);

  const { currencySymbol } = useSelector((state: State) => state.userSetting);
  const requestDetail = useSelector(
    (state: State) => state.common.customRequest.entities.requestDetail
  );
  const referenceLabelField = useSelector(
    (state: State) => state.common.customRequest.entities.referenceLabelField
  );
  const { layoutConfigList, selectedReferenceRecords } = useSelector(
    (state: State) => state.ui.customRequest
  );
  const isApexView = useSelector((state: State) => state.ui.isApexView);

  const requestDetailObj = requestDetail.customRequest || {};
  const { RecordTypeId = '', RecordTypeName = '' } = requestDetailObj;
  const layoutConfigObj = layoutConfigList.find(
    ({ recordTypeId: layoutRecordTypeId }) =>
      layoutRecordTypeId === RecordTypeId
  );
  const layoutConfig = layoutConfigObj?.config || [];
  const isShowFile = isShowFileSection(layoutConfigObj?.relatedList);

  const onClickSave = (values) => {
    const valuesCopy = { ...values };
    const attachedFileList = valuesCopy.attachedFileList;
    valuesCopy.RecordTypeId = RecordTypeId;

    delete valuesCopy.hasFile;
    delete valuesCopy.attachedFileList;
    delete valuesCopy[RECORD_ACCESS_FIELD_NAME];

    const fieldTypeMap = {} as FieldTypeMap;
    const inputtedFields = Object.keys(valuesCopy);
    layoutConfig.forEach((layoutItem: LayoutItem) => {
      const isEditable = isFieldEditable(layoutItem, EDIT_MODE);
      // fieldTypeMap and valueMapList element should have same keys
      if (isEditable && inputtedFields.includes(layoutItem.field)) {
        fieldTypeMap[layoutItem.field] = layoutItem.typeName as TypeName;
      }
    });
    fieldTypeMap.RecordTypeId = typeName.REFERENCE as TypeName;
    fieldTypeMap.Id = typeName.ID as TypeName;

    const fieldsToSelect = [
      ...new Set([
        ...layoutConfig.map(({ field }) => field),
        ...Object.values(CUSTOM_REQUEST_APPROVAL_COLUMNS),
        CUSTOM_REQUEST_ID_FIELD_KEY,
      ]),
    ];
    dispatch(
      updateRequest(
        [valuesCopy],
        fieldTypeMap,
        CUSTOM_REQUEST_SF_OBJECT_NAME,
        fieldsToSelect,
        RecordTypeId,
        attachedFileList,
        isShowFile,
        true,
        true
      )
    );
    onHide();
  };

  const onToggleRefDialog = () =>
    setIsOpenRefDialog((isOpenRefDialog) => !isOpenRefDialog);

  const openReferenceDialog = (objName: string, fieldName: string) => {
    dispatch(initializeReferenceDialog(objName, fieldName));
    onToggleRefDialog();
  };

  const uploadFiles = async (files: File[]) => {
    const file = files[0];
    return await dispatch(uploadReceipts(file));
  };

  const attachedFileList = requestDetail.attachedFileList || [];
  const { labelMap = {}, ...rest } = requestDetailObj;
  const initialValues = { ...rest, attachedFileList };
  const schema = generateSchema(layoutConfig, EDIT_MODE);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onClickSave}
      validationSchema={schema}
      enableReinitialize
    >
      <>
        <Form
          recordTypeName={RecordTypeName}
          uploadFiles={uploadFiles}
          openReferenceDialog={openReferenceDialog}
          mode={EDIT_MODE}
          isShownFile={isShowFile}
          title={msg().Exp_Lbl_EditCustomRequest}
          labelMap={labelMap}
          configList={layoutConfig}
          currencySymbol={currencySymbol}
          selectedReferenceRecords={selectedReferenceRecords}
          referenceLabelField={referenceLabelField}
          onHideAll={onHide}
          isApexView={isApexView}
        />
        {/* to share formik context */}
        {isOpenRefDialog && (
          <ReferenceSearchContainer onHide={onToggleRefDialog} />
        )}
      </>
    </Formik>
  );
};

export default EditFormContainer;
