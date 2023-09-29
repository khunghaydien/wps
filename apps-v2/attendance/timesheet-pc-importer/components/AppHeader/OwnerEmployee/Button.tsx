import * as React from 'react';

import SLDSUserIcon from '@salesforce-ux/design-system/assets/icons/utility/user.svg';
import styled from 'styled-components';

import msg from '@commons/languages';

const EmployeeButton = styled.button`
  &&& {
    padding: 10px;
  }
`;

const Button: React.FC<{
  onClick: () => void;
}> = ({ onClick }) => (
  <div className={`slds-m-horizontal--xx-small`}>
    <EmployeeButton
      title={msg().Com_Lbl_SwitchEmployee}
      type={'button'}
      className={`slds-button slds-button--icon`}
      onClick={onClick}
    >
      <SLDSUserIcon
        className="slds-button__icon slds-button__icon--large slds-button__icon--hint"
        aria-hidden
      />
    </EmployeeButton>
  </div>
);

export default Button;
