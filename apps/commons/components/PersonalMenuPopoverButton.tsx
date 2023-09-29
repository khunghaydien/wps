import React from 'react';

import SLDSDownIcon from '@salesforce-ux/design-system/assets/icons/utility/down.svg';
import SLDSUserIcon from '@salesforce-ux/design-system/assets/icons/utility/user.svg';

import msg from '../languages';

import './PersonalMenuPopoverButton.scss';

const ROOT = 'commons-personal-menu-popover-button';

export type Props = {
  standalone: boolean;
  onClick: (arg0: React.SyntheticEvent<HTMLButtonElement>) => void;
  pendingRequestCount: number;
};

export default class PersonalMenuPopoverButton extends React.Component<Props> {
  render() {
    const { pendingRequestCount, onClick } = this.props;
    return !this.props.standalone ? (
      <div className={`slds-m-horizontal--xx-small ${ROOT}`}>
        <button
          title={msg().Com_Btn_OpenPersonalMenu}
          className={`slds-button slds-button--icon ${ROOT}__button`}
          onClick={onClick}
        >
          <SLDSUserIcon
            className="slds-button__icon slds-button__icon--large slds-button__icon--hint"
            aria-hidden
          />
          <SLDSDownIcon
            className="slds-button__icon slds-button__icon--x-small slds-button__icon--hint"
            aria-hidden
          />
          <span className="slds-assistive-text">
            {msg().Com_Btn_OpenPersonalMenu}
          </span>
          <div className={`${ROOT}__count`}>
            {pendingRequestCount > 0 && pendingRequestCount}
          </div>
        </button>
      </div>
    ) : (
      <button
        className={`slds-button slds-button--neutral ${ROOT}__exit-button`}
        onClick={() =>
          /* window.close is only allowed to be called for windows that
           * were opened by a script using the window.open() method.
           *
           * See also https://developer.mozilla.org/en-US/docs/Web/API/Window/close.
           */
          window.close()
        }
      >
        {msg().Com_Btn_Close}
      </button>
    );
  }
}
