import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import cloneDeep from 'lodash/cloneDeep';

import { FunctionTypeList } from '../../constants/functionType';

import { Vendor } from '../../../domain/models/exp/Vendor';

import * as vendorDetailActions from '../../action-dispatchers/vendor/Detail';
import * as vendorListActions from '../../action-dispatchers/vendor/List';

import { State } from '../../reducers';

import { getter as RecordGetter } from '../../utils/RecordUtil';

import Component from '../../presentational-components/Vendor/Detail';

const mapStateToProps = (state: State) => {
  return {
    editRecord: state.vendor.entities.baseRecord,
    tmpEditRecord: state.vendor.ui.detail.baseRecord,
    getOrganizationSetting: state.getOrganizationSetting,
    modeBase: state.base.detailPane.ui.modeBase,
    sfObjFieldValues: state.sfObjFieldValues,
  };
};

const DetailContainer = ({
  useFunction,
}: {
  useFunction: FunctionTypeList;
}) => {
  const pagingCondition = useSelector(
    (state: State) => state.base.listPane.ui.paging
  );
  const companyId = useSelector(
    (state: State) => state.base.menuPane.ui.targetCompanyId
  );
  const searchQuery = useSelector(
    (state: State) => state.vendor.ui.searchQuery
  );
  const baseRecord = useSelector(
    (state: State) => state.vendor.ui.detail.baseRecord
  );
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();
  const VendorListActions = useMemo(
    () => bindActionCreators(vendorListActions, dispatch),
    [dispatch]
  );
  const VendorDetailActions = useMemo(
    () => bindActionCreators(vendorDetailActions, dispatch),
    [dispatch]
  );

  return (
    <Component
      {...props}
      useFunction={useFunction}
      onClickCreateButton={() => {
        (async () => {
          const baseValueGetter = RecordGetter(props.tmpEditRecord);
          const result = await VendorDetailActions.createRecord(
            companyId,
            {
              ...props.editRecord,
            },
            {
              ...props.tmpEditRecord,
            },
            baseValueGetter,
            useFunction
          );
          if (!result) {
            return;
          }
          VendorListActions.setSelectedRowIndex(-1);
          await VendorListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
        })();
      }}
      onClickUpdateBaseButton={() => {
        (async () => {
          const baseValueGetter = RecordGetter(props.tmpEditRecord);
          const result = await VendorDetailActions.updateBase(
            companyId,
            props.editRecord,
            props.tmpEditRecord,
            baseValueGetter,
            useFunction
          );
          if (!result) {
            return;
          }
          await VendorListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
          VendorListActions.setSelectedRowIndex(-1);
        })();
      }}
      onClickDeleteButton={() => {
        (async () => {
          const result = await VendorDetailActions.removeBase(
            props.editRecord.id
          );
          if (!result) {
            return;
          }
          VendorListActions.setSelectedRowIndex(-1);
          await VendorListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
        })();
      }}
      onChangeDetailItem={(key: keyof Vendor, value: Vendor[keyof Vendor]) => {
        VendorDetailActions.changeBaseRecordValue(key, value);
      }}
      onClickCloseButton={() => {
        VendorListActions.setSelectedRowIndex(-1);
        VendorDetailActions.hideDetail();
      }}
      onClickCancelEditButton={() => {
        VendorDetailActions.cancelEditing(props.editRecord);
      }}
      onClickStartEditingBaseButton={() => {
        VendorDetailActions.startEditingBase();
      }}
      onClickCloneButton={() => {
        const cloneRecord = cloneDeep(baseRecord);
        cloneRecord.id = null;
        cloneRecord.code = '';
        VendorDetailActions.startEditingClonedRecord(cloneRecord);
      }}
    />
  );
};

export default DetailContainer;
