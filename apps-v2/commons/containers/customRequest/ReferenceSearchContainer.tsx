import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { useFormikContext } from 'formik';

import { searchReference } from '@commons/action-dispatchers/CustomRequest';
import Component from '@commons/components/customRequest/Dialogs/ReferenceSearch';
import { State } from '@commons/modules';
import { actions as selectedReferenceActions } from '@commons/modules/customRequest/ui/selectedReferenceRecords';

type StateProps = {
  common: State;
};

type Props = {
  onHide: () => void;
};

const ReferenceSearchContainer = (ownProps: Props) => {
  const dispatch = useDispatch();
  const { setFieldValue } = useFormikContext();

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          setSelectedReference: selectedReferenceActions.set,
          searchReference,
        },
        dispatch
      ),
    [dispatch]
  );
  const objectName = useSelector(
    (state: StateProps) =>
      state.common.customRequest.entities.referenceLayout.sObjName
  );
  const fieldName = useSelector(
    (state: StateProps) =>
      state.common.customRequest.entities.referenceLayout.fieldName
  );
  const referenceLayout = useSelector(
    (state: StateProps) =>
      state.common.customRequest.entities.referenceLayout.layout
  );
  const referenceRecords = useSelector(
    (state: StateProps) =>
      state.common.customRequest.entities.referenceRecords.records
  );

  const onSearchReference = (query: string) => {
    Actions.searchReference(objectName, referenceLayout, query);
  };

  const onClickRecord = (record) => {
    setFieldValue(fieldName, record.Id);
    Actions.setSelectedReference(objectName, record);
    ownProps.onHide();
  };

  return (
    <Component
      referenceLayout={referenceLayout}
      referenceRecords={referenceRecords}
      onHide={ownProps.onHide}
      onSearchReference={onSearchReference}
      onClickRecord={onClickRecord}
    />
  );
};

export default ReferenceSearchContainer;
