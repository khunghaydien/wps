import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import configList from '@admin-pc-v2/constants/configList/featureAccess';

import { action as featureAccessListAction } from '@admin-pc-v2/modules/featureAccess/entities/list';
import { action as featureAccessEntityAction } from '@admin-pc-v2/modules/featureAccess/entities/record';

import * as featureAccess from '@admin-pc-v2/actions/featureAccess';

import { State } from '@admin-pc-v2/reducers';

import { Action } from '@admin-pc/utils/RecordUtil';

import MainContents from '@admin-pc/components/MainContents';

const mapStateToProps = (state: State) => ({
  featureAccessRecord: state.featureAccess.entities.record,
  isShowDetail: state.base.detailPane.ui.isShowDetail,
  editRecord: state.editRecord,
  companyId: state.base.menuPane.ui.targetCompanyId,
  value2msgkey: state.value2msgkey,
  tmpEditRecord: state.tmpEditRecord,
});

const FeatureAccessContainer = (ownProps: { commonActions: Action }) => {
  const companyId = useSelector(
    (state: State) => state.base.menuPane.ui.targetCompanyId
  );
  const tmpEditRecord = useSelector((state: State) => state.tmpEditRecord);
  const id = useSelector((state: State) => state.tmpEditRecord.id);
  const featureAccessRecord = useSelector(
    (state: State) => state.featureAccess.entities.record
  );
  const featureAccessList = useSelector(
    (state: State) => state.featureAccess.entities.list
  );

  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();

  const actions = useMemo(
    () =>
      bindActionCreators(
        {
          create: featureAccess.createFeatureAccess,
          update: featureAccess.updateFeatureAccess,
          delete: featureAccess.deleteFeatureAccess,
          fetchById: featureAccess.fetchFeatureAccessRecord,
          search: featureAccess.fetchFeatureAccessList,
          setRecord: featureAccessEntityAction.setRecord,
          setListDetail: featureAccessListAction.setListDetail,
        },
        dispatch
      ),
    [dispatch]
  );
  const configListFeactureAccess = _.cloneDeep(configList);
  configListFeactureAccess.base.forEach((config) => {
    if (config.key === 'companyId') {
      config.defaultValue = props.companyId;
    }
  });
  const ApproveAccessibleUserAndApproverAttRequestByDelegate =
    'ApproveAccessibleUserAndApproverAttRequestByDelegate';

  useEffect(() => {
    actions.search({ companyId });
  }, [companyId]);

  useEffect(() => {
    if (id) {
      actions
        .fetchById({ id })
        // @ts-ignore
        .then((res) => {
          const result = _.cloneDeep(res[0]);
          delete result.details;
          res[0].details.forEach(({ name, isEnabled }) => {
            result[name] = isEnabled;
            if (
              name === 'ApproveAccessibleUserAndApproverAttRequestByDelegate'
            ) {
              if (isEnabled) {
                result[ApproveAccessibleUserAndApproverAttRequestByDelegate] =
                  'true';
              } else {
                result[ApproveAccessibleUserAndApproverAttRequestByDelegate] =
                  'false';
              }
            }
          });
          ownProps.commonActions.setEditRecord(result);
          actions.setRecord(res[0]);
          actions.setListDetail(result);
        });
    }
  }, [id]);

  return (
    <MainContents
      {...props}
      {...ownProps}
      componentKey="feature-access"
      configList={configListFeactureAccess}
      itemList={featureAccessList}
      actions={actions}
      onClickCreateButton={async () => {
        await actions.create(configList, companyId, {
          ...tmpEditRecord,
          ApproveAccessibleUserAndApproverAttRequestByDelegate:
            tmpEditRecord[
              ApproveAccessibleUserAndApproverAttRequestByDelegate
            ] === 'true',
          ApproveAccessibleUserAttRequestByDelegate:
            tmpEditRecord[
              ApproveAccessibleUserAndApproverAttRequestByDelegate
            ] !== 'true',
        });
        actions.search({ companyId });
      }}
      onClickUpdateButton={async () => {
        await actions.update(
          configList,
          companyId,
          {
            ...tmpEditRecord,
            ApproveAccessibleUserAndApproverAttRequestByDelegate:
              tmpEditRecord[
                ApproveAccessibleUserAndApproverAttRequestByDelegate
              ] === 'true',
            ApproveAccessibleUserAttRequestByDelegate:
              tmpEditRecord[
                ApproveAccessibleUserAndApproverAttRequestByDelegate
              ] !== 'true',
          },
          featureAccessRecord
        );
        actions.search({ companyId });
      }}
    />
  );
};

export default FeatureAccessContainer;
