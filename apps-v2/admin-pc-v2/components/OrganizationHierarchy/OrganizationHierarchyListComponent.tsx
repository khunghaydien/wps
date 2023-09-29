import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { get, isEmpty } from 'lodash';

import { MODE } from '@admin-pc/modules/base/detail-pane/ui';

import { searchOrganizationHierarchy } from '@apps/admin-pc/actions/organizationHierarchy';

import { State } from '@admin-pc-v2/reducers';

import OrganizationHierarchyListContainer from '@admin-pc-v2/containers/OrganizationHierarchyListContainer';

type Props = {
  objectKey?: string;
  disabled?: boolean;
  defaultDisableCheck?: boolean;
  tmpEditRecordBase?: Record<string, any>;
  tmpEditRecord?: Record<string, any>;
  onChangeDetailItem: (objectKey: string, value: string) => void;
  mode: string;
};

const mapStateToProps = (state: State) => {
  return {
    organizationPatternList: state.searchOrganizationHierarchy,
    companyId: state.base.menuPane.ui.targetCompanyId,
  };
};

const OrganizationHierarchyList = (props: Props) => {
  const { mode, defaultDisableCheck, objectKey = 'hierarchyPatternId' } = props;
  const deptId = get(props.tmpEditRecordBase, 'id');
  const [value, setValue] = useState(get(props.tmpEditRecord, objectKey));
  const organizationPatternListProps = useSelector(mapStateToProps);
  const dispatch = useDispatch();

  const OrganizatonHierachyActions = useMemo(
    () => bindActionCreators({ searchOrganizationHierarchy }, dispatch),
    [dispatch]
  );

  useEffect(() => {
    // Fetching organization hierarchy patterns
    OrganizatonHierachyActions.searchOrganizationHierarchy({
      companyId: organizationPatternListProps.companyId,
    });
  }, []);

  useEffect(() => {
    // When we change department while still on a detail screen,
    // we need to call onChangeDetailItem to set the objectKey
    props.onChangeDetailItem(objectKey, value);
  }, [deptId]);

  useEffect(() => {
    if (
      !isEmpty(organizationPatternListProps.organizationPatternList) &&
      (isEmpty(value) || mode === 'new')
    ) {
      // Checking if there is any value selected initially
      const v = get(
        organizationPatternListProps,
        'organizationPatternList.0.id'
      );
      onChangeHierarchyPattern(v);
    }
  }, [organizationPatternListProps.organizationPatternList, mode]);

  const onChangeHierarchyPattern = (val?: string): void => {
    setValue(val);
    props.onChangeDetailItem(objectKey, val);
  };

  const list = (organizationPatternListProps.organizationPatternList || []).map(
    (op) => ({
      label: op.name,
      value: op.id,
      text: op.name,
    })
  );

  // Disabled for all modes except view mode
  let disabled = mode !== MODE.VIEW;
  if (defaultDisableCheck) {
    disabled = props.disabled;
  }

  return (
    <OrganizationHierarchyListContainer
      list={list}
      onChange={onChangeHierarchyPattern}
      value={value}
      disabled={disabled}
    />
  );
};

export default OrganizationHierarchyList;
