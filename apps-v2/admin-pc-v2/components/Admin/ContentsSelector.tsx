import React from 'react';

import ApproverSettingContainer from '@admin-pc-v2/containers/ApproverSettingContainer';
import DepartmentContainer from '@admin-pc-v2/containers/DepartmentContainer';
import EmployeeContainer from '@admin-pc-v2/containers/EmployeeContainer';
import FeatureAccessContainer from '@admin-pc-v2/containers/FeatureAccessContainer';
import OrganizationHierarchyContainer from '@admin-pc-v2/containers/OrganizationHierarchyContainer';
import PaymentMethodContainer from '@admin-pc-v2/containers/PaymentMethodContainer';
import PositionContainer from '@admin-pc-v2/containers/PositionContainer';
import RecordAccessGrantContainer from '@admin-pc-v2/containers/RecordAccessGrantContainer';
import ApproverGroupContainer from '@apps/admin-pc-v2/containers/ApproverGroupContainer';
import MileageRateContainer from '@apps/admin-pc-v2/containers/MileageRateContainer';
import RecordAccessPrivilegeContainer from '@apps/admin-pc-v2/containers/RecordAccessPrivilegeContainer';
import RecordAccessStandardContainer from '@apps/admin-pc-v2/containers/RecordAccessStandardContainer';

import {
  getContentsContainer as getContentsContainerV1,
  Props,
} from '@admin-pc/components/Admin/ContentsSelector';

const getContentsContainerV2 = (props: Props) => {
  switch (props.selectedKey) {
    case 'OrgHierarchy':
      return <OrganizationHierarchyContainer {...props} />;
    case 'Department':
      return <DepartmentContainer {...props} />;
    case 'Position':
      return <PositionContainer {...props} />;
    case 'Emp':
    case 'OverallEmp':
      return <EmployeeContainer {...props} />;
    case 'FeatureAccess':
      return <FeatureAccessContainer {...props} />;
    case 'RecordAccessStandard':
      return <RecordAccessStandardContainer {...props} />;
    case 'RecordAccessPrivilege':
      return <RecordAccessPrivilegeContainer {...props} />;
    case 'RecordAccessGrant':
      return <RecordAccessGrantContainer {...props} />;
    case 'PaymentMethod':
      return <PaymentMethodContainer {...props} />;
    case 'ApproverSetting':
      return <ApproverSettingContainer {...props} />;
    case 'ApproverGroup':
      return <ApproverGroupContainer {...props} />;
    case 'MileageRate':
      return <MileageRateContainer {...props} />;
    default:
      return null;
  }
};

export default class ContentsSelectorV2 extends React.Component<Props> {
  render() {
    return (
      getContentsContainerV2(this.props) || getContentsContainerV1(this.props)
    );
  }
}
