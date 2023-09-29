import React, { useEffect, useState } from 'react';

import { cloneDeep } from 'lodash';

import configList from '@admin-pc-v2/constants/configList/organizationHierarchy';

import msg from '@apps/commons/languages';

import { Action, Record } from '@admin-pc/utils/RecordUtil';

import OrgTreeView from '../../containers/OrganizationHierarchyContainer/DetailOrganizationTreeViewContainer';

import MainContents from '@admin-pc/components/MainContents';

type Props = {
  itemList: Array<Record>;
  actions: Action;
  companyId: string;
  isShowDetail: boolean;
};

const OrganizationHierarchy = (props: Props) => {
  const { companyId, isShowDetail } = props;
  const [detailType, setDetailType] = useState('');

  useEffect(() => {
    props.actions.search({ companyId });
    props.actions.getConstants();
  }, [companyId]);

  useEffect(() => {
    if (!isShowDetail) {
      setDetailType('');
    }
  }, [isShowDetail]);

  const getCellActions = (column?: any) => {
    const viewHieararchyAction = [
      {
        icon: <span>{msg().Admin_Lbl_ViewHierarchy}</span>,
        callback: () => {
          setDetailType('hierarchy');
          props.actions.setModeBase('custom');
        },
      },
    ];
    const cellActions = {
      viewHierarchy: viewHieararchyAction,
    };
    return cellActions[column.key];
  };

  const configListOrgHiearachy = cloneDeep(configList);
  configListOrgHiearachy.base.forEach((config) => {
    if (config.key === 'companyId') {
      config.defaultValue = props.companyId;
    }
  });

  const CustomComponent = detailType ? <OrgTreeView /> : null;

  return (
    <MainContents
      componentKey="organizationHierarchy"
      configList={configListOrgHiearachy}
      itemList={props.itemList}
      cellActions={getCellActions}
      component={CustomComponent}
      detailTitle={
        detailType ? msg().Admin_Lbl_HierarchyView : msg().Admin_Lbl_Details
      }
      {...props}
    />
  );
};

export default OrganizationHierarchy;
