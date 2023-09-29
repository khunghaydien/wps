import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { cloneDeep, isEmpty } from 'lodash';
import { createSelector } from 'reselect';

import { NAMESPACE_PREFIX } from '@commons/api';
import msg from '@commons/languages';
import { showToastWithType } from '@commons/modules/toast';

import { generateFieldAndValueMap } from '@custom-request-pc/models';

import { State } from '@custom-request-pc/modules';
import { actions as customRequestListAction } from '@custom-request-pc/modules/entities/customRequestList';
import { actions as activeDialogActions } from '@custom-request-pc/modules/ui/dialog/activeDialog';
import { actions as pageViewUIActions } from '@custom-request-pc/modules/ui/pageView';
import { actions as selectedIdUIAction } from '@custom-request-pc/modules/ui/selectedId';
import { actions as selectedRecordTypeIdUIAction } from '@custom-request-pc/modules/ui/selectedRecordTypeId';

import {
  cloneMultiRequest,
  deleteRequests,
  initialize,
} from '@custom-request-pc/action-dispatchers';

import Component from '@custom-request-pc/components/List';

import {
  AUTO_SET_FIELDS,
  availableButtons,
  pageView,
  status,
} from '@custom-request-pc/consts';
import { ColumnConfig, CustomRequests } from '@custom-request-pc/types';

const CONTENTS_FIELD_NAME = NAMESPACE_PREFIX + 'Contents__c';
const STATUS_FIELD_NAME = NAMESPACE_PREFIX + 'Status__c';

const getHtmlStrip = createSelector(
  (state: State) => state.entities.customRequestList.list,
  (list: CustomRequests) =>
    list.map((o) => {
      const res = cloneDeep(o);
      if (o[CONTENTS_FIELD_NAME]) {
        res[CONTENTS_FIELD_NAME] = o[CONTENTS_FIELD_NAME].replace(
          /<[^>]*>?/gm,
          ''
        );
      }
      return res;
    })
);

const mapStateToProps = (state: State) => {
  return {
    selectedId: state.ui.selectedId,
    selectedRecordTypeId: state.ui.selectedRecordTypeId,
    objectName: state.entities.recordTypeList.objectName,
    isLoading: state.entities.customRequestList.isLoading,
    recordTypeList: state.entities.recordTypeList.records,
    requestEntityList: state.entities.customRequestList.list,
    requestDisplayList: getHtmlStrip(state),
    currencySymbol: state.userSetting.sfCompanyDefaultCurrencyCode,
  };
};

const ListContainer = () => {
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();
  const layoutConfig = useSelector(
    (state: State) => state.ui.layoutConfig.config
  );
  const sObjName = useSelector(
    (state: State) => state.ui.layoutConfig.sObjName
  );

  const columnConfig = layoutConfig.map((x) => ({
    key: x.field,
    name: x.label,
    typeName: x.typeName,
    fractionDigits: x.fractionDigits,
    picklistValues: x.picklistValues,
    field: x.field,
  }));

  const buttonsConfig = useSelector((state: State) => state.ui.buttonsConfig);
  const isShowClone = buttonsConfig.includes(availableButtons.CLONE);

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          setPageView: pageViewUIActions.setView,
          setSelectedId: selectedIdUIAction.set,
          list: customRequestListAction.list,
          setSelectedRecordType: selectedRecordTypeIdUIAction.set,
          clearItems: customRequestListAction.clear,
          openFormDialog: activeDialogActions.new,
          openRecordTyleSelectDialog: activeDialogActions.recordTypeSelect,
          initialize,
          cloneMultiRequest,
          deleteRequests,
          showToastWithType,
        },
        dispatch
      ),
    [dispatch]
  );

  useEffect(() => {
    if (
      sObjName &&
      props.selectedRecordTypeId &&
      isEmpty(props.requestDisplayList)
    ) {
      Actions.list(
        sObjName,
        layoutConfig.map(({ field }) => field),
        props.selectedRecordTypeId
      );
    }
  }, [layoutConfig, props.selectedRecordTypeId]);

  const onClickDelete = (idList: string[]) => {
    const statusList = props.requestEntityList
      .filter(({ Id }) => idList.includes(Id))
      /* eslint-disable camelcase */
      .map((x) => x[STATUS_FIELD_NAME]);
    const disallowDelete =
      statusList.includes(status.PENDING) ||
      statusList.includes(status.APPROVED);
    if (disallowDelete) {
      Actions.showToastWithType(
        msg().Exp_Msg_CannotDeleteCertainCustomRequest,
        4000,
        'error'
      );
    } else {
      Actions.deleteRequests(
        idList,
        sObjName,
        layoutConfig.map(({ field }) => field),
        props.selectedRecordTypeId
      );
    }
  };

  const onClickClone = (idList: string[]) => {
    const selectedCRs = props.requestEntityList.filter(({ Id }) =>
      idList.includes(Id)
    );

    const fieldsMap = layoutConfig.reduce((acc, { field, ...config }) => {
      acc[field] = config;
      return acc;
    }, {});

    const infoArray = selectedCRs.map((request) => {
      // remove auto set fields when clone
      const filtered = Object.keys(request)
        .filter((key) => !AUTO_SET_FIELDS.includes(key))
        .reduce((obj, key) => {
          obj[key] = request[key];
          return obj;
        }, {});
      return generateFieldAndValueMap(
        filtered,
        fieldsMap,
        props.selectedRecordTypeId
      );
    });
    Actions.cloneMultiRequest(
      infoArray,
      sObjName,
      layoutConfig.map(({ field }) => field),
      props.selectedRecordTypeId
    );
  };

  return (
    <Component
      isLoading={props.isLoading}
      currencySymbol={props.currencySymbol}
      recordTypeList={props.recordTypeList}
      selectedRecordTypeId={props.selectedRecordTypeId}
      customRequestList={props.requestDisplayList}
      columnConfig={columnConfig as ColumnConfig}
      isShowClone={isShowClone}
      onSelectRecordType={(id) => {
        Actions.setSelectedRecordType(id);
        Actions.clearItems();
      }}
      onClickNew={() => {
        Actions.openRecordTyleSelectDialog();
      }}
      onClickRow={(id: string) => {
        Actions.setPageView(pageView.Detail);
        Actions.setSelectedId(id);
      }}
      onClickRefresh={() => {
        Actions.initialize(props.selectedRecordTypeId, props.objectName);
      }}
      onClickClone={onClickClone}
      onClickDelete={(idList) => {
        onClickDelete(idList);
      }}
    />
  );
};

export default ListContainer;
