import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

import { get, isEmpty } from 'lodash';

import { searchDepartmentHierarchyParent } from '@apps/admin-pc/actions/organizationHierarchy';

const OrganizationHierarchyParentLabelComponent = (
  props
): React.ReactElement => {
  const hierarchyPatternId = get(props.tmpEditRecord, 'hierarchyPatternId');
  const deptId = get(props.tmpEditRecordBase, 'id');
  const targetDate = get(props.tmpEditRecord, 'validDateFrom');
  const [parentDepartment, setParentDepartment] = useState('-');

  const dispatch = useDispatch();

  const HierarchyActions = useMemo(
    () => bindActionCreators({ searchDepartmentHierarchyParent }, dispatch),
    [dispatch]
  );

  useEffect(() => {
    setParentDepartment('-');
    if (hierarchyPatternId) {
      HierarchyActions.searchDepartmentHierarchyParent({
        hierarchyPtnId: hierarchyPatternId,
        targetDate,
        deptId,
        // @ts-ignore
      }).then(handleDepartmentHierarchyResponse);
    }
  }, [hierarchyPatternId, deptId, targetDate]);

  const handleDepartmentHierarchyResponse = (hierarchies) => {
    if (!isEmpty(hierarchies)) {
      setParentDepartment(`${hierarchies[0].code} - ${hierarchies[0].name}`);
    }
  };

  return (
    <div>
      <p style={{ color: '#333333' }}>{parentDepartment}</p>
    </div>
  );
};

export default OrganizationHierarchyParentLabelComponent;
